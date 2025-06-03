"use client";
import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import Image from "next/image";

function FloatingCards() {
  const groupRef = useRef();

  useFrame((state, delta) => {
    groupRef.current.rotation.y += delta * 0.5;
  });

  const cards = [
    {
      id: 1,
      title: "Education",
      emoji: "📚",
      color: "#8b5cf6",
      position: [0, 0, 3],
      slogan: "Unlock Potential Through Learning",
    },
    {
      id: 2,
      title: "Treatment",
      emoji: "🩺",
      color: "#10b981",
      position: [3, 0, 0],
      slogan: "Healing Lives With Compassion",
    },
    {
      id: 3,
      title: "Food",
      emoji: "🍞",
      color: "#f59e0b",
      position: [0, 0, -3],
      slogan: "Nourishing Communities Daily",
    },
    {
      id: 4,
      title: "Employment",
      emoji: "💼",
      color: "#3b82f6",
      position: [-3, 0, 0],
      slogan: "Building Sustainable Livelihoods",
    },
  ];

  return (
    <group ref={groupRef}>
      {cards.map((card) => (
        <group key={card.id} position={card.position}>
          <Text
            fontSize={0.5}
            color={card.color}
            anchorX="center"
            anchorY="middle"
            font="/fonts/NotoEmoji-Regular.ttf"
          >
            {card.emoji}
          </Text>
          <Text
            position={[0, -0.8, 0]}
            fontSize={0.2}
            color="white"
            anchorX="center"
            anchorY="middle"
            maxWidth={3}
            lineHeight={1}
            letterSpacing={0.02}
            textAlign="center"
          >
            {card.title.toUpperCase()}
          </Text>
        </group>
      ))}
    </group>
  );
}

export default function AboutUsHero() {
  return (
    <div className="relative my-8 h-screen  overflow-hidden bg-gradient-to-br from-gray-500 via-cyan-700 to-slate-700">
      {/* Three.js Background Layer */}
      <div className="absolute inset-0 z-0 opacity-20">
        <Canvas>
          <pointLight position={[10, 10, 10]} intensity={1.5} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          <FloatingCards />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={1.5}
            makeDefault
          />
        </Canvas>
      </div>

      {/* Main Content */}
      <div className="relative z-10 h-full my-8 flex flex-col lg:flex-row items-center justify-center px-6 sm:px-12 lg:px-24 gap-12">
        {/* Left Column - Text Content */}
        <div className="lg:w-1/2 my-8 space-y-8 text-center lg:text-left">
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
                name: "Education",
                icon: "📚",
                color: "from-purple-500 to-purple-700",
              },
              {
                name: "Treatment",
                icon: "🩺",
                color: "from-green-500 to-green-700",
              },
              {
                name: "Food",
                icon: "🍞",
                color: "from-amber-500 to-amber-700",
              },
              {
                name: "Employment",
                icon: "💼",
                color: "from-blue-500 to-blue-700",
              },
            ].map((item) => (
              <div
                key={item.name}
                className={`bg-gradient-to-br ${item.color} p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-white/20`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-white font-medium">{item.name}</span>
                </div>
              </div>
            ))}
          </div>

          {/* <div className="flex  mt-2 flex-col sm:flex-row gap-4">
            <button className="mt-6 px-8 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 group">
              <span className="relative -bottom-4 z-10">About More</span>
              <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-green-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </button>
            <button className="mt-6 px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 group">
              <span className="relative z-10 flex items-center justify-center gap-2">
                Join Our Mission
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </button>
          </div> */}
        </div>

        {/* Right Column - Image Layer */}
        <div className="lg:w-1/2 relative h-full flex items-center justify-center">
          {/* Image with Glass Card */}
          <div className="relative w-full max-w-lg h-96 rounded-3xl overflow-hidden shadow-2xl group">
            <Image
              src="/smile.webp"
              alt="Community helping together"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              quality={100}
              priority
            />

            {/* Image overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>

            {/* Glass Card */}
            <div className="absolute -bottom-6 -right-6 backdrop-blur-md bg-white/90 p-6 rounded-xl shadow-xl w-3/4 border-l-4 border-green-500 transform rotate-1 hover:rotate-0 transition-transform duration-300">
              <div className="flex items-center space-x-2">
                <div className="text-gray-600 text-sm font-medium">
                  Countries reached with our programs
                </div>
              </div>
            </div>

            {/* Stats Glass Panel */}
            {/* <div className="absolute top-48 -left-12 z-50 backdrop-blur-md bg-white/80 p-4 rounded-xl shadow-lg border border-white/20">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "10K+", label: "Lives" },
                  { value: "50+", label: "Communities" },
                  { value: "100%", label: "Transparency" },
                  { value: "24/7", label: "Support" },
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <p className="text-lg font-bold text-gray-800">
                      {stat.value}
                    </p>
                    <p className="text-xs text-gray-600">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div> */}

            {/* Decorative Elements */}
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-blue-500/20 rounded-full backdrop-blur-sm animate-float"></div>
            <div className="absolute bottom-8 -right-8 w-20 h-20 bg-green-500/20 rounded-full backdrop-blur-sm animate-float-delay"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
