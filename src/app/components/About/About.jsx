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
    <div className="relative min-h-screen my-4 sm:my-8 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
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
      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row items-center justify-center px-4 sm:px-6 lg:px-12 gap-8 sm:gap-12">
        {/* Left Column - Text Content */}
        <div className="w-full lg:w-1/2 my-8 space-y-6 text-center lg:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            We Believe That We
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-600 animate-gradient">
              Can Save More Lives
            </span>
            <br />
            With You
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-full sm:max-w-2xl mx-auto lg:mx-0">
            Donet is the largest global crowdfunding community connecting
            nonprofits, donors, and companies in nearly every country. We help
            nonprofits from Bangladesh access the tools they need to make our
            country better.
          </p>

          <div className="grid grid-cols-2 gap-4 max-w-xs sm:max-w-md mx-auto lg:mx-0">
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
                className={`bg-gradient-to-br ${item.color} p-3 sm:p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-white/20`}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-xl sm:text-2xl">{item.icon}</span>
                  <span className="text-white font-medium text-sm sm:text-base">
                    {item.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Image Layer */}
        <div className="w-full lg:w-1/2 flex items-center justify-center">
          {/* Image with Glass Card */}
          <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg h-64 sm:h-80 md:h-96 rounded-3xl overflow-hidden shadow-2xl group">
            <Image
              src="/smile.webp"
              alt="Community helping together"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              quality={100}
              priority
            />

            {/* Image overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent hidden lg:block"></div>

            {/* Glass Card - Hidden on mobile */}
            <div className="absolute -bottom-4 -right-4 lg:-bottom-6 lg:-right-6 backdrop-blur-md bg-white/90 p-4 sm:p-6 rounded-xl shadow-xl w-3/4 lg:w-3/4 border-l-4 border-green-500 transform rotate-1 hover:rotate-0 transition-transform duration-300 hidden lg:block">
              <div className="flex items-center space-x-2">
                <div className="text-gray-600 text-xs sm:text-sm font-medium">
                  Country will reach with our programs
                </div>
              </div>
            </div>

            {/* Decorative Elements - Hidden on mobile */}
            <div className="absolute -top-4 -left-4 lg:-top-6 lg:-left-6 w-16 sm:w-20 lg:w-24 h-16 sm:h-20 lg:h-24 bg-blue-500/20 rounded-full backdrop-blur-sm animate-float hidden lg:block"></div>
            <div className="absolute bottom-6 -right-6 lg:bottom-8 lg:-right-8 w-14 sm:w-16 lg:w-20 h-14 sm:h-16 lg:h-20 bg-green-500/20 rounded-full backdrop-blur-sm animate-float-delay hidden lg:block"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
