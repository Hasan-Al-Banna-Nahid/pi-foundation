"use client";
import { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";
import Image from "next/image";
import { useSpring, animated } from "@react-spring/web";
import * as THREE from "three";

function CloudRainScene() {
  const groupRef = useRef();
  const cloudRef = useRef();
  const rainRef = useRef();
  const particlesRef = useRef();
  const cloudCount = 10;
  const rainCount = 200;

  useEffect(() => {
    // Initialize clouds
    const cloudGeometry = new THREE.SphereGeometry(0.5, 16, 16);
    const cloudMaterial = new THREE.MeshStandardMaterial({
      color: "#ffffff",
      transparent: true,
      opacity: 0.3,
      roughness: 0.8,
    });
    for (let i = 0; i < cloudCount; i++) {
      const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
      cloud.position.set(
        (Math.random() - 0.5) * 15,
        2 + Math.random() * 3,
        (Math.random() - 0.5) * 15
      );
      cloud.scale.setScalar(0.5 + Math.random() * 0.5);
      cloudRef.current.add(cloud);
    }

    // Initialize rain particles
    const rainGeometry = new THREE.BufferGeometry();
    const rainPositions = new Float32Array(rainCount * 3);
    for (let i = 0; i < rainCount * 3; i += 3) {
      rainPositions[i] = (Math.random() - 0.5) * 15;
      rainPositions[i + 1] = Math.random() * 10;
      rainPositions[i + 2] = (Math.random() - 0.5) * 15;
    }
    rainGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(rainPositions, 3)
    );
    const rainMaterial = new THREE.PointsMaterial({
      color: "#60a5fa",
      size: 0.02,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
    });
    rainRef.current = new THREE.Points(rainGeometry, rainMaterial);

    // Initialize background particles
    const particlesGeometry = new THREE.BufferGeometry();
    const count = 200;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 20;
      colors[i] = 0.5 + Math.random() * 0.5;
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
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    particlesRef.current = new THREE.Points(
      particlesGeometry,
      particlesMaterial
    );

    return () => {
      cloudGeometry.dispose();
      cloudMaterial.dispose();
      rainGeometry.dispose();
      rainMaterial.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
    };
  }, []);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    groupRef.current.rotation.y += 0.01;
    particlesRef.current.rotation.y += 0.001;
    cloudRef.current.children.forEach((cloud, i) => {
      cloud.position.x += Math.sin(time + i) * 0.01;
      cloud.position.z += Math.cos(time + i) * 0.01;
    });
    if (rainRef.current) {
      const positions = rainRef.current.geometry.attributes.position.array;
      for (let i = 1; i < rainCount * 3; i += 3) {
        positions[i] -= 0.1;
        if (positions[i] < -2) {
          positions[i] += 10;
        }
      }
      rainRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 5]} intensity={1.5} />
      <pointLight position={[-10, -10, 5]} intensity={0.5} />
      <group ref={groupRef}>
        <group ref={cloudRef} />
        {rainRef.current && <primitive object={rainRef.current} />}
        {particlesRef.current && <primitive object={particlesRef.current} />}
        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
          <mesh>
            <torusKnotGeometry args={[2, 0.5, 100, 16]} />
            <meshStandardMaterial
              color="#ffffff"
              transparent
              opacity={0.15}
              wireframe
            />
          </mesh>
        </Float>
      </group>
    </>
  );
}

export default function AboutUsHero() {
  const containerRef = useRef();

  const textProps = useSpring({
    from: { opacity: 0, y: 50 },
    to: { opacity: 1, y: 0 },
    config: { mass: 1, tension: 120, friction: 14 },
  });

  const imageProps = useSpring({
    from: { opacity: 0, scale: 0.95 },
    to: { opacity: 1, scale: 1 },
    config: { mass: 1, tension: 120, friction: 14 },
    delay: 200,
  });

  return (
    <div className="relative min-h-screen my-4 sm:my-8 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-300">
      {/* Background Patterns */}
      <div className="absolute inset-0 z-0 opacity-25 bg-[url('/dagger-map-pattern.png')] bg-cover"></div>
      <div className="absolute inset-0 z-0 opacity-15 bg-[url('/wave-pattern.png')] bg-repeat"></div>
      <div className="absolute inset-0 z-0 opacity-20">
        <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
          <CloudRainScene />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={1}
            makeDefault
          />
        </Canvas>
      </div>

      {/* Main Content */}
      <div
        ref={containerRef}
        className="relative z-10 min-h-screen flex flex-col lg:flex-row items-center justify-center px-4 sm:px-6 lg:px-12 gap-8 sm:gap-12"
      >
        {/* Left Column - Text Content */}
        <animated.div
          style={textProps}
          className="w-full lg:w-1/2 my-8 space-y-6 text-center lg:text-left"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight font-serif">
            We Believe That We
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-900 animate-gradient">
              Can Save More Lives
            </span>
            <br />
            With You
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-full sm:max-w-2xl mx-auto lg:mx-0 font-sans">
            Donet is the largest global crowdfunding community connecting
            nonprofits, donors, and companies in nearly every country. We
            empower nonprofits in Bangladesh with tools to transform our nation
            for the better.
          </p>

          <div className="grid grid-cols-2 gap-4 max-w-xs sm:max-w-md mx-auto lg:mx-0">
            {[
              { name: "Education", icon: "📚" },
              { name: "Treatment", icon: "🩺" },
              { name: "Food", icon: "🍞" },
              { name: "Employment", icon: "💼" },
            ].map((item) => (
              <div
                key={item.name}
                className="bg-gradient-to-br from-purple-500 to-blue-900 p-3 sm:p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm border border-white/20"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-xl sm:text-2xl">{item.icon}</span>
                  <span className="text-white font-medium text-sm sm:text-base font-sans">
                    {item.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </animated.div>

        {/* Right Column - Image Layer */}
        <animated.div
          style={imageProps}
          className="w-full lg:w-1/2 flex items-center justify-center"
        >
          <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg h-64 sm:h-80 md:h-96 rounded-3xl overflow-hidden shadow-2xl group">
            <Image
              src="/smile.webp"
              alt="Community helping together"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              quality={100}
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

            {/* Glass Card */}
            <div className="absolute -bottom-4 -right-4 lg:-bottom-6 lg:-right-6 backdrop-blur-lg bg-white/90 p-4 sm:p-6 rounded-xl shadow-xl w-3/4 lg:w-2/3 border-l-4 border-gold-400 transform rotate-2 hover:rotate-0 transition-transform duration-300">
              <div className="flex items-center space-x-2">
                <span className="text-xl sm:text-2xl">🌍</span>
                <div className="text-gray-900 text-xs sm:text-sm font-medium font-sans">
                  Transforming Bangladesh with global impact
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -left-4 lg:-top-6 lg:-left-6 w-16 sm:w-20 lg:w-24 h-16 sm:h-20 lg:h-24 bg-gradient-to-br from-purple-500 to-blue-900 rounded-full backdrop-blur-sm animate-float"></div>
            <div className="absolute bottom-6 -right-6 lg:bottom-8 lg:-right-8 w-14 sm:w-16 lg:w-20 h-14 sm:h-16 lg:h-20 bg-gradient-to-br from-purple-500 to-blue-900 rounded-full backdrop-blur-sm animate-float-delay"></div>
          </div>
        </animated.div>
      </div>
    </div>
  );
}
