"use client";
import { useRef, useMemo, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Text, Float, useGLTF } from "@react-three/drei";
import * as THREE from "three";

function VolunteerScene() {
  const lightRef = useRef();
  const secondaryLightRef = useRef();
  const groupRef = useRef();
  const { camera } = useThree();

  // Create particle system with enhanced sparkling effect
  const particles = useMemo(() => {
    const particlesGeometry = new THREE.BufferGeometry();
    const count = 1000; // Increased particle count for richer effect

    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const scales = new Float32Array(count);

    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 12; // Wider spread
      colors[i] = Math.random();
      scales[i] = Math.random() * 0.05 + 0.05; // Vary particle size
    }

    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    particlesGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(colors, 3)
    );
    particlesGeometry.setAttribute(
      "scale",
      new THREE.BufferAttribute(scales, 1)
    );

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending, // Sparkling effect
    });

    return new THREE.Points(particlesGeometry, particlesMaterial);
  }, []);

  // 3D Icons for Volunteer Benefits
  const icons = useMemo(
    () => [
      {
        position: [2, 0, 0],
        geometry: new THREE.BoxGeometry(0.3, 0.3, 0.05), // Book for resources
        material: new THREE.MeshStandardMaterial({ color: "#4f46e5" }),
        name: "resources",
      },
      {
        position: [-2, 0, 0],
        geometry: new THREE.SphereGeometry(0.2, 16, 16), // Sphere for community
        material: new THREE.MeshStandardMaterial({ color: "#10b981" }),
        name: "community",
      },
      {
        position: [0, 0, 2],
        geometry: new THREE.BoxGeometry(0.3, 0.05, 0.3), // Cap for training
        material: new THREE.MeshStandardMaterial({ color: "#4f46e5" }),
        name: "training",
      },
      {
        position: [0, 0, -2],
        geometry: new THREE.SphereGeometry(0.2, 16, 16), // Heart-like for impact
        material: new THREE.MeshStandardMaterial({ color: "#10b981" }),
        name: "impact",
      },
    ],
    []
  );

  // Animation and interactivity
  const [hovered, setHovered] = useState(null);

  useFrame(({ clock, mouse }) => {
    const time = clock.getElapsedTime();

    // Animate lights
    lightRef.current.position.x = Math.sin(time) * 2.5;
    lightRef.current.position.z = Math.cos(time) * 2.5;
    secondaryLightRef.current.position.x = Math.cos(time * 0.5) * 3;
    secondaryLightRef.current.position.z = Math.sin(time * 0.5) * 3;

    // Animate particles
    particles.rotation.y += 0.001;
    particles.rotation.x += 0.0005;

    // Animate icons
    icons.forEach((icon, i) => {
      const mesh = groupRef.current.children[i];
      mesh.position.y += Math.sin(time + i) * 0.01; // Float effect
      mesh.rotation.y += 0.02; // Rotate icons
      if (hovered === icon.name) {
        mesh.scale.set(1.2, 1.2, 1.2); // Scale up on hover
      } else {
        mesh.scale.set(1, 1, 1);
      }
    });

    // Subtle camera animation
    camera.position.z = 5 + Math.sin(time * 0.2) * 0.5; // Gentle zoom
  });

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight
        ref={lightRef}
        position={[2, 2, 2]}
        intensity={2}
        color="#4f46e5"
        distance={12}
        decay={1.5}
      />
      <pointLight
        ref={secondaryLightRef}
        position={[-2, -2, -2]}
        intensity={1.5}
        color="#10b981"
        distance={12}
        decay={1.5}
      />

      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <Text
          font="/fonts/Inter-Bold.ttf"
          fontSize={0.8}
          color="#ffffff"
          position={[0, 1.5, 0]}
          anchorX="center"
          anchorY="middle"
        >
          Become a Volunteer
          <meshStandardMaterial emissive="#4f46e5" emissiveIntensity={2.5} />
        </Text>
      </Float>

      <primitive object={particles} />

      <group ref={groupRef}>
        {icons.map((icon, index) => (
          <mesh
            key={index}
            geometry={icon.geometry}
            material={icon.material}
            position={icon.position}
            onPointerOver={() => setHovered(icon.name)}
            onPointerOut={() => setHovered(null)}
          />
        ))}
      </group>
    </>
  );
}

export default function VolunteerComponent() {
  return (
    <div className="relative my-8 h-[600px] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Three.js Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <VolunteerScene />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.3}
          />
        </Canvas>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col lg:flex-row items-center justify-center px-8 gap-12">
        {/* Left Column */}
        <div className="lg:w-1/2 space-y-8 text-center lg:text-left">
          <div className="inline-block bg-gradient-to-r from-purple-600 to-emerald-500 p-1 rounded-lg mb-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-white bg-gray-900 px Grown px-6 py-3 rounded-lg">
              Join Our Movement
            </h2>
          </div>

          <p className="text-lg text-gray-300 max-w-2xl">
            Provide resources such as reports, infographics, and educational
            materials related to our cause. Help us make a difference in
            communities worldwide.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 group relative overflow-hidden border-2 border-purple-400/30">
              <span className="relative z-10">Learn More</span>
              <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </button>

            <button className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 group relative overflow-hidden border-2 border-emerald-400/30">
              <span className="relative z-10">Join Us Now</span>
              <span className="absolute inset-0 bg-gradient-to-r from-teal-600 to-emerald-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </button>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:w-1/2 relative h-full flex items-center justify-center">
          <div className="relative w-full max-w-md h-80 bg-white/10 backdrop-blur-lg rounded-2xl border-2 border-white/20 p-8 shadow-2xl overflow-hidden">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/20 rounded-full filter blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-emerald-500/20 rounded-full filter blur-3xl"></div>

            <h3 className="text-2xl font-bold text-white mb-4">
              Volunteer Benefits
            </h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <div className="flex-shrink-0 mt-1 mr-3 text-emerald-400">
                  ✓
                </div>
                <span>Access to exclusive resources</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 mt-1 mr-3 text-emerald-400">
                  ✓
                </div>
                <span>Community of like-minded people</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 mt-1 mr-3 text-emerald-400">
                  ✓
                </div>
                <span>Training and development</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 mt-1 mr-3 text-emerald-400">
                  ✓
                </div>
                <span>Make a tangible impact</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
