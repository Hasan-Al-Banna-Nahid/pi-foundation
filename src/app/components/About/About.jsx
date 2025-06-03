"use client";
import { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";

function FloatingIcons() {
  const groupRef = useRef();

  useFrame((state, delta) => {
    groupRef.current.rotation.y += delta * 0.2;
  });

  return (
    <group ref={groupRef}>
      {/* Food */}
      <Text
        position={[0, 0, 3]}
        fontSize={0.5}
        color="#10b981"
        anchorX="center"
        anchorY="middle"
      >
        🍞
      </Text>

      {/* Water */}
      <Text
        position={[3, 0, 0]}
        fontSize={0.5}
        color="#3b82f6"
        anchorX="center"
        anchorY="middle"
      >
        💧
      </Text>

      {/* Education */}
      <Text
        position={[0, 0, -3]}
        fontSize={0.5}
        color="#10b981"
        anchorX="center"
        anchorY="middle"
      >
        📚
      </Text>

      {/* Medical */}
      <Text
        position={[-3, 0, 0]}
        fontSize={0.5}
        color="#3b82f6"
        anchorX="center"
        anchorY="middle"
      >
        🩺
      </Text>
    </group>
  );
}

export default function AboutUsHero() {
  return (
    <div className="relative h-screen overflow-hidden bg-gray-50 my-6">
      {/* Three.js Background Layer */}
      <div className="absolute inset-0 z-0 opacity-20">
        <Canvas>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <FloatingIcons />
          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
      </div>

      {/* Main Content */}
      <div className="relative z-10 h-full flex flex-col lg:flex-row items-center justify-center px-6 sm:px-12 lg:px-24">
        {/* Left Column - Text Content */}
        <div className="lg:w-1/2 space-y-8 text-center lg:text-left">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            We Believe That We
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-600">
              Can Save More Lives
            </span>
            <br />
            With You
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0">
            Donet is the largest global crowdfunding community connecting
            nonprofits, donors, and companies in nearly every country. We help
            nonprofits from Bangladesh access the tools they need to make our
            country better.
          </p>

          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0">
            {["Food", "Water", "Education", "Medical"].map((item) => (
              <div
                key={item}
                className="flex items-center space-x-2 bg-white/80 p-3 rounded-lg shadow-sm"
              >
                <div className="w-5 h-5 border-2 border-green-500 rounded-sm flex items-center justify-center">
                  <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
                </div>
                <span className="text-gray-700">Charity For {item}</span>
              </div>
            ))}
          </div>

          <button className="mt-6 px-8 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
            About More
          </button>
        </div>

        {/* Right Column - Image Layer */}
        <div className="lg:w-1/2 mt-12 lg:mt-0 relative">
          {/* Base Image */}
          <div className="relative w-full h-64 lg:h-96 rounded-2xl overflow-hidden shadow-2xl">
            <img
              src="/images/hero-about.jpg"
              alt="Community helping together"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Floating Card Layer */}
          <div className="absolute -bottom-8 -right-8 bg-white p-6 rounded-xl shadow-xl w-3/4 border-l-4 border-green-500 transform rotate-2">
            <p className="text-gray-600">Country reached with our programs</p>
          </div>

          {/* Floating Elements */}
          <div className="absolute -top-8 -left-8 w-20 h-20 bg-blue-500/10 rounded-full backdrop-blur-sm"></div>
          <div className="absolute top-1/4 -right-4 w-16 h-16 bg-green-500/10 rounded-full backdrop-blur-sm"></div>
        </div>
      </div>
    </div>
  );
}
