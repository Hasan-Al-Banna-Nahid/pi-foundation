"use client";
import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, Text } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function BackgroundMockup() {
  const particlesRef = useRef();
  const shapesRef = useRef([]);

  // Create background particles and shapes
  const particles = useMemo(() => {
    const particlesGeometry = new THREE.BufferGeometry();
    const count = 150;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 30;
      colors[i] = i % 3 === 0 ? 1 : i % 3 === 1 ? 0.62 : 0.04; // Match #f59e0b
    }

    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    particlesGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(colors, 3)
    );

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
    });

    return new THREE.Points(particlesGeometry, particlesMaterial);
  }, []);

  const shapes = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 5; i++) {
      arr.push({
        position: [
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 10,
          -10 - Math.random() * 5,
        ],
        scale: 1 + Math.random(),
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0],
        color: new THREE.Color().setHSL(Math.random(), 0.3, 0.7),
      });
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.001;
    }
    shapesRef.current.forEach((mesh) => {
      if (mesh) {
        mesh.rotation.x += 0.005;
        mesh.rotation.y += 0.005;
      }
    });
  });

  useEffect(() => {
    return () => {
      particles.geometry.dispose();
      particles.material.dispose();
      shapesRef.current.forEach((mesh) => {
        if (mesh) {
          mesh.geometry.dispose();
          mesh.material.dispose();
        }
      });
    };
  }, [particles]);

  return (
    <group>
      <primitive object={particles} ref={particlesRef} />
      {shapes.map((shape, i) => (
        <mesh
          key={i}
          position={shape.position}
          scale={shape.scale}
          rotation={shape.rotation}
          ref={(el) => (shapesRef.current[i] = el)}
        >
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color={shape.color}
            emissive={shape.color}
            emissiveIntensity={0.3}
            transparent
            opacity={0.7}
          />
        </mesh>
      ))}
    </group>
  );
}

function FloatingCommunity() {
  const groupRef = useRef();
  const objectsRef = useRef([]);

  const objects = useMemo(
    () => [
      {
        type: "hand-left",
        geometry: new THREE.SphereGeometry(0.2, 32, 32),
        material: new THREE.MeshStandardMaterial({
          color: "#f59e0b",
          emissive: "#f59e0b",
          emissiveIntensity: 0.5,
        }),
        position: [-1.5, 0, 0],
        orbitRadius: 3,
        orbitSpeed: 0.5,
        fingers: true,
      },
      {
        type: "hand-right",
        geometry: new THREE.SphereGeometry(0.2, 32, 32),
        material: new THREE.MeshStandardMaterial({
          color: "#3b82f6",
          emissive: "#3b82f6",
          emissiveIntensity: 0.5,
        }),
        position: [1.5, 0, 0],
        orbitRadius: 2.5,
        orbitSpeed: 0.6,
        fingers: true,
      },
      {
        type: "heart",
        geometry: (() => {
          const shape = new THREE.Shape();
          shape.moveTo(0.25, 0.25);
          shape.bezierCurveTo(0.25, 0.25, 0.2, 0, 0, 0);
          shape.bezierCurveTo(-0.3, 0, -0.3, 0.35, -0.3, 0.35);
          shape.bezierCurveTo(-0.3, 0.55, -0.15, 0.7, 0, 0.95);
          shape.bezierCurveTo(0.15, 0.7, 0.3, 0.55, 0.3, 0.35);
          shape.bezierCurveTo(0.3, 0.35, 0.3, 0, 0, 0);
          return new THREE.ExtrudeGeometry(shape, {
            depth: 0.1,
            bevelEnabled: false,
          });
        })(),
        material: new THREE.MeshStandardMaterial({
          color: "#ff4757",
          emissive: "#ff4757",
          emissiveIntensity: 0.7,
        }),
        position: [0, 1, 0],
        orbitRadius: 4,
        orbitSpeed: 0.4,
      },
      {
        type: "globe",
        geometry: new THREE.SphereGeometry(0.25, 16, 16),
        material: new THREE.MeshStandardMaterial({
          color: "#1e90ff",
          emissive: "#1e90ff",
          emissiveIntensity: 0.6,
        }),
        position: [2, -1, 0],
        orbitRadius: 3.5,
        orbitSpeed: 0.45,
      },
      {
        type: "speech",
        geometry: new THREE.BoxGeometry(0.4, 0.3, 0.1),
        material: new THREE.MeshStandardMaterial({
          color: "#2ed573",
          emissive: "#2ed573",
          emissiveIntensity: 0.6,
        }),
        position: [-2, 1, 0],
        orbitRadius: 3,
        orbitSpeed: 0.55,
      },
      {
        type: "handshake",
        geometry: new THREE.TorusGeometry(0.2, 0.05, 16, 32),
        material: new THREE.MeshStandardMaterial({
          color: "#ffa502",
          emissive: "#ffa502",
          emissiveIntensity: 0.6,
        }),
        position: [0, -1.5, 0],
        orbitRadius: 4.5,
        orbitSpeed: 0.5,
      },
    ],
    []
  );

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    objectsRef.current.forEach((mesh, i) => {
      if (mesh) {
        const { orbitRadius, orbitSpeed } = objects[i];
        mesh.position.x = Math.sin(time * orbitSpeed + i) * orbitRadius;
        mesh.position.z = Math.cos(time * orbitSpeed + i) * orbitRadius;
        mesh.rotation.y += 0.02;
      }
    });
  });

  useEffect(() => {
    return () => {
      objects.forEach((obj) => {
        obj.geometry.dispose();
        obj.material.dispose();
      });
    };
  }, [objects]);

  return (
    <group ref={groupRef}>
      {objects.map((obj, i) => (
        <Float key={i} speed={2} rotationIntensity={0.5} floatIntensity={1}>
          <mesh
            geometry={obj.geometry}
            material={obj.material}
            position={obj.position}
            ref={(el) => (objectsRef.current[i] = el)}
          >
            {obj.fingers &&
              [...Array(5)].map((_, j) => (
                <mesh key={j} position={[0, -0.1 - j * 0.15, 0.1]}>
                  <cylinderGeometry args={[0.04, 0.04, 0.2, 8]} />
                  <meshStandardMaterial color={obj.material.color} />
                </mesh>
              ))}
          </mesh>
        </Float>
      ))}
      <Text
        position={[0, 2.5, 0]}
        fontSize={0.5}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        Community Support
        <meshStandardMaterial emissive="#f59e0b" emissiveIntensity={1} />
      </Text>
    </group>
  );
}

export default function OpenDoorsComponent() {
  const cardRef = useRef();

  useEffect(() => {
    gsap.from(cardRef.current, {
      opacity: 0,
      y: 50,
      duration: 1,
      scrollTrigger: {
        trigger: cardRef.current,
        start: "top 80%",
        toggleActions: "play none none none",
      },
    });

    gsap.to(cardRef.current, {
      y: 15,
      duration: 3,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });
  }, []);

  return (
    <div className="relative h-[600px] w-full overflow-hidden">
      {/* Mockup Background */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 15], fov: 50 }}>
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#f59e0b" />
          <pointLight
            position={[-10, -10, -10]}
            intensity={0.5}
            color="#3b82f6"
          />
          <BackgroundMockup />
        </Canvas>
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* 3D Objects */}
      <div className="absolute inset-0 z-10">
        <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          <FloatingCommunity />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.3}
          />
        </Canvas>
      </div>

      {/* Content */}
      <div className="relative z-20 h-full flex flex-col lg:flex-row items-center justify-center px-4 sm:px-8 gap-6 lg:gap-12">
        {/* Left Column - Text */}
        <div className="lg:w-1/2 space-y-4 text-center lg:text-left">
          <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
            Our Doors Are Always Open To
          </h2>
          <h3 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-blue-600">
            More People Who Want To
          </h3>
          <p className="text-xl sm:text-2xl font-bold text-white">
            Support Each Other!
          </p>
          <button className="mt-6 px-8 py-3 bg-gradient-to-r from-amber-500 to-blue-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
            Get Involved
          </button>
        </div>

        {/* Right Column - Card */}
        <div
          ref={cardRef}
          className="lg:w-1/2 flex items-center justify-center"
        >
          <div className="relative w-full max-w-sm h-80 bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-transparent bg-gradient-to-r from-amber-500 to-blue-600 p-[2px] shadow-2xl overflow-hidden">
            <div className="h-full bg-white/80 rounded-2xl p-6">
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber-400/20 rounded-full filter blur-3xl"></div>
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-500/20 rounded-full filter blur-3xl"></div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Ways to Support
              </h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1 mr-2 text-amber-500">
                    •
                  </div>
                  <span>Volunteer your time and skills</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1 mr-2 text-blue-500">•</div>
                  <span>Donate to support our programs</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1 mr-2 text-amber-500">
                    •
                  </div>
                  <span>Spread awareness in your community</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1 mr-2 text-blue-500">•</div>
                  <span>Partner with us as an organization</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
