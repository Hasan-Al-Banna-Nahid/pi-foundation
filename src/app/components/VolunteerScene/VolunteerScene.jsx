"use client";
import { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Text } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { motion } from "framer-motion";

// 3D Floating Object Component
function FloatingHeart({ position }) {
  const meshRef = useRef();

  useFrame(({ clock }) => {
    meshRef.current.rotation.x = Math.sin(clock.getElapsedTime()) * 0.2;
    meshRef.current.rotation.y = Math.cos(clock.getElapsedTime() * 0.5) * 0.3;
    meshRef.current.position.y = Math.sin(clock.getElapsedTime() * 1.5) * 0.2;
  });

  return (
    <Float speed={3} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color="#ef4444"
          emissive="#ef4444"
          emissiveIntensity={0.5}
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>
    </Float>
  );
}

// Charity Card Component
const CharityCard = ({
  title,
  description,
  progress,
  goal,
  raised,
  color,
  index,
}) => {
  const cardRef = useRef();
  const percentage = Math.min(Math.round((raised / goal) * 100), 100);

  useEffect(() => {
    // GSAP animation for card entrance
    gsap.from(cardRef.current, {
      opacity: 0,
      y: 50,
      duration: 0.8,
      delay: index * 0.15,
      ease: "power3.out",
    });

    // Continuous floating effect
    gsap.to(cardRef.current, {
      y: 10,
      duration: 3,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });
  }, [index]);

  return (
    <motion.div
      ref={cardRef}
      whileHover={{ scale: 1.03 }}
      className={`relative overflow-hidden rounded-2xl shadow-2xl ${color} p-0.5 h-full`}
    >
      <div className="relative h-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6">
        {/* 3D Object Container */}
        <div className="absolute -top-10 -right-10 w-40 h-40">
          <Canvas>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <FloatingHeart position={[0, 0, 2]} />
          </Canvas>
        </div>

        {/* Glow Effect */}
        <div
          className={`absolute -top-20 -right-20 w-40 h-40 rounded-full filter blur-3xl ${color.replace(
            "bg-gradient-to-r",
            "bg-gradient-to-br"
          )} opacity-30`}
        ></div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 mb-4">{description}</p>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
            <motion.div
              className="h-2.5 rounded-full bg-gradient-to-r from-green-400 to-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1.5, delay: index * 0.2 }}
            />
          </div>

          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-gray-700">
              Raised: ${raised.toLocaleString()}
            </span>
            <span className="text-sm font-medium text-gray-700">
              Goal: ${goal.toLocaleString()}
            </span>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-auto px-6 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            Donate Now
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// Main Component
export default function CharityCardSeries() {
  const containerRef = useRef();
  const cards = [
    {
      id: 1,
      title: "Food for All",
      description: "Providing meals to underprivileged communities worldwide",
      raised: 86210,
      goal: 100000,
      color: "bg-gradient-to-r from-amber-500 to-orange-500",
      progress: 86,
    },
    {
      id: 2,
      title: "Medical Relief",
      description: "Healthcare access for remote communities",
      raised: 69628,
      goal: 120000,
      color: "bg-gradient-to-r from-emerald-500 to-teal-600",
      progress: 58,
    },
    {
      id: 3,
      title: "Education Fund",
      description: "Building schools and providing learning materials",
      raised: 45000,
      goal: 80000,
      color: "bg-gradient-to-r from-blue-500 to-indigo-600",
      progress: 56,
    },
    {
      id: 4,
      title: "Clean Water",
      description: "Sustainable water solutions for arid regions",
      raised: 92300,
      goal: 150000,
      color: "bg-gradient-to-r from-cyan-500 to-sky-600",
      progress: 62,
    },
  ];

  // GSAP animation for container
  useEffect(() => {
    gsap.from(containerRef.current, {
      opacity: 0,
      y: 50,
      duration: 1,
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        toggleActions: "play none none none",
      },
    });
  }, []);

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-4">
          Our Charity Programs
        </h2>
        <p className="text-xl text-center text-gray-600 max-w-3xl mx-auto mb-12">
          Join us in making a difference through these impactful initiatives
        </p>

        <div
          ref={containerRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {cards.map((card, index) => (
            <CharityCard key={card.id} index={index} {...card} />
          ))}
        </div>
      </div>
    </div>
  );
}
