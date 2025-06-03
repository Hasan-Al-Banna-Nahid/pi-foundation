"use client";
import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import Image from "next/image";

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
        font="/fonts/NotoEmoji-Regular.ttf" // Add emoji font
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
        font="/fonts/NotoEmoji-Regular.ttf"
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
        font="/fonts/NotoEmoji-Regular.ttf"
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
        font="/fonts/NotoEmoji-Regular.ttf"
      >
        🩺
      </Text>
    </group>
  );
}

export default function AboutUsHero() {
  return (
    <div className="relative h-screen overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Three.js Background Layer */}
      <div className="absolute inset-0 z-0 opacity-30">
        <Canvas>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <FloatingIcons />
          <OrbitControls enableZoom={false} enablePan={false} makeDefault />
        </Canvas>
      </div>

      {/* Main Content */}
      <div className="relative z-10 h-full flex flex-col lg:flex-row items-center justify-center px-6 sm:px-12 lg:px-24 gap-12">
        {/* Left Column - Text Content */}
        <div className="lg:w-1/2 space-y-8 text-center lg:text-left">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            We Believe That We
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-600 animate-gradient">
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
            {[
              {
                name: "Food",
                icon: "🍞",
                color: "from-amber-400 to-amber-600",
              },
              { name: "Water", icon: "💧", color: "from-blue-400 to-blue-600" },
              {
                name: "Education",
                icon: "📚",
                color: "from-purple-400 to-purple-600",
              },
              {
                name: "Medical",
                icon: "🩺",
                color: "from-emerald-400 to-emerald-600",
              },
            ].map((item) => (
              <div
                key={item.name}
                className={`bg-gradient-to-br ${item.color} p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-white font-medium">
                    Charity For {item.name}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button className="mt-6 px-8 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 group">
            <span className="relative z-10">About More</span>
            <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-green-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </button>
        </div>

        {/* Right Column - Image Layer */}
        <div className="lg:w-1/2 relative h-full flex items-center">
          {/* Base Image with Glass Morphism Effect */}
          <div className="relative w-full h-80 lg:h-96 rounded-3xl overflow-hidden shadow-2xl group">
            <Image
              src="/smile.webp" // Replace with your image path
              alt="Community helping together"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              quality={100}
              priority
            />

            {/* Image overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>

            {/* Floating Card Layer */}
            <div className="absolute -bottom-6 -right-6 bg-white/90 backdrop-blur-md p-6 rounded-xl shadow-xl w-3/4 border-l-4 border-green-500 transform rotate-1 hover:rotate-0 transition-transform duration-300">
              <div className="flex items-center space-x-2">
                {/* <div className="text-3xl font-bold text-green-600">74+</div> */}
                <div className="text-gray-600 text-sm font-medium">
                  Countries reached with our programs
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-blue-500/20 rounded-full backdrop-blur-sm animate-float"></div>
            <div className="absolute top-1/4 -right-6 w-20 h-20 bg-green-500/20 rounded-full backdrop-blur-sm animate-float-delay"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
