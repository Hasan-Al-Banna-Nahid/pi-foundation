"use client";
import { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

// 3D Floating Object Component
function FloatingHeart({ position }) {
  const meshRef = useRef();
  const velocity = useRef(new THREE.Vector3(0, 0, 0));
  const originalPosition = useRef(new THREE.Vector3(...position));
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMouseMove = (event) => {
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const elapsedTime = clock.getElapsedTime();

    // Pulsating effect
    const pulse = 0.4 + Math.sin(elapsedTime * 2) * 0.1;
    mesh.scale.set(pulse, pulse, pulse);

    // Orbit animation
    const orbitRadius = 0.5;
    mesh.position.x =
      originalPosition.current.x + Math.cos(elapsedTime * 0.5) * orbitRadius;
    mesh.position.y =
      originalPosition.current.y + Math.sin(elapsedTime * 0.5) * orbitRadius;
    mesh.position.z = originalPosition.current.z;

    // Mouse interaction
    const mouseWorld = new THREE.Vector3(
      mouse.current.x * 5,
      mouse.current.y * 5,
      0
    );
    const distance = mesh.position.distanceTo(mouseWorld);
    if (distance < 2) {
      const force = (2 - distance) * 0.3;
      const direction = new THREE.Vector3()
        .subVectors(mesh.position, mouseWorld)
        .normalize();
      velocity.current.add(direction.multiplyScalar(force * elapsedTime));
    }

    mesh.position.add(velocity.current.clone().multiplyScalar(elapsedTime));

    // Rotation
    mesh.rotation.x = Math.sin(elapsedTime * 0.3) * 0.1;
    mesh.rotation.y = Math.cos(elapsedTime * 0.4) * 0.15;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial
          color="#ef4444"
          emissive="#ef4444"
          emissiveIntensity={0.7}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
    </Float>
  );
}

// Charity Card Component
const CharityCard = ({
  title,
  description,
  goal,
  raised,
  color = "bg-gradient-to-r from-green-500 to-blue-500",
  index,
}) => {
  const cardRef = useRef();
  const percentage = Math.min(Math.round((raised / goal) * 100), 100);

  useEffect(() => {
    gsap.from(cardRef.current, {
      opacity: 0,
      scale: 0.9,
      rotation: 5,
      duration: 0.8,
      delay: index * 0.15,
      ease: "power3.out",
    });
  }, [index]);

  return (
    <motion.div
      ref={cardRef}
      whileHover={{ scale: 1.03 }}
      className="relative overflow-hidden rounded-2xl shadow-2xl border-l-[6px] border-gold-400 bg-gradient-to-br from-gray-50 to-gray-100 p-6 h-full transition-all duration-300 hover:shadow-xl"
    >
      {/* 3D Object Container */}
      <div className="absolute -top-8 -right-8 w-32 h-32 sm:w-40 sm:h-40">
        <Canvas>
          <ambientLight intensity={0.6} />
          <pointLight position={[10, 10, 10]} intensity={1.2} />
          <FloatingHeart position={[0, 0, 2]} />
        </Canvas>
      </div>

      {/* Glow Effect */}
      <div
        className={`absolute -top-16 -right-16 w-32 h-32 sm:w-40 sm:h-40 rounded-full filter blur-3xl ${color.replace(
          "bg-gradient-to-r",
          "bg-gradient-to-br"
        )} opacity-20`}
      ></div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 tracking-tight">
          {title}
        </h3>
        <p className="text-gray-600 text-sm sm:text-base mb-4">{description}</p>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
          <motion.div
            className="h-2.5 rounded-full bg-gradient-to-r from-green-400 to-blue-500"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1.5, delay: index * 0.2 }}
          />
        </div>

        <div className="flex justify-between items-center mb-4 text-sm sm:text-base">
          <span className="font-medium text-gray-700">
            Raised: ${raised.toLocaleString()}
          </span>
          <span className="font-medium text-gray-700">
            Goal: ${goal.toLocaleString()}
          </span>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-auto px-4 sm:px-6 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all"
        >
          Donate Now
        </motion.button>
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
    },
    {
      id: 2,
      title: "Medical Relief",
      description: "Healthcare access for remote communities",
      raised: 69628,
      goal: 120000,
      color: "bg-gradient-to-r from-emerald-500 to-teal-600",
    },
    {
      id: 3,
      title: "Education Fund",
      description: "Building schools and providing learning materials",
      raised: 45000,
      goal: 80000,
      color: "bg-gradient-to-r from-blue-500 to-indigo-600",
    },
    {
      id: 4,
      title: "Employment",
      description: "Sustainable water solutions for arid regions",
      raised: 92300,
      goal: 150000,
      color: "bg-gradient-to-r from-cyan-500 to-sky-600",
    },
  ];

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
    <div className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-200">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center text-gray-900 mb-4 tracking-tight">
          Our Charity Programs
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-center text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
          Join us in making a difference through these impactful initiatives
        </p>

        <div
          ref={containerRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
        >
          {cards.map((card, index) => (
            <CharityCard key={card.id} index={index} {...card} />
          ))}
        </div>
      </div>
    </div>
  );
}
