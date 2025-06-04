"use client";
import { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { motion } from "framer-motion";
import gsap from "gsap";
import * as THREE from "three";

// 3D Floating Avatar Component
const FloatingAvatar = () => {
  const meshRef = useRef();

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.2;
      meshRef.current.position.y = Math.sin(clock.getElapsedTime()) * 0.2;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color="#4f46e5" roughness={0.2} metalness={0.1} />
    </mesh>
  );
};

const SuccessStoryComponent = () => {
  const containerRef = useRef();

  useEffect(() => {
    // GSAP animation for the floating effect
    gsap.to(containerRef.current, {
      y: 10,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl shadow-xl overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-indigo-800 mb-2">
          Success Story
        </h1>
        <p className="text-lg text-gray-700">
          We Help Fellow Nonprofits Access The Funding Tools, Training
        </p>
      </motion.div>

      {/* Content Grid */}
      <div className="grid md:grid-cols-2 gap-8 items-center">
        {/* Left Column */}
        <div>
          <motion.p
            className="text-gray-600 mb-6 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Our secure online donation platform allows you to make contributions
            quickly and safely. Choose from various payment methods and set up
            one-time exactly.
          </motion.p>

          <motion.div
            className="bg-white p-6 rounded-xl shadow-md mb-6"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-xl font-semibold text-indigo-700 mb-2">
              Our Success Story
            </h3>
            <div className="flex items-center space-x-4">
              <div className="bg-indigo-100 p-3 rounded-full">
                <span className="text-indigo-700 font-bold text-2xl">
                  Starting
                </span>
              </div>
              {/* <span className="text-gray-700">Years of Experience</span> */}
            </div>
          </motion.div>
        </div>

        {/* Right Column - 3D Floating Avatar */}
        <motion.div
          ref={containerRef}
          className="relative h-64"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Canvas shadows camera={{ position: [0, 0, 5], fov: 50 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={0.8} />
            <FloatingAvatar />
          </Canvas>
          <div className="absolute bottom-0 left-0 right-0 text-center">
            <p className="text-lg font-medium text-indigo-700">
              Hasan Al Banna Nahid{" "}
            </p>
            <span className="text-sm text-gray-500">1</span>
          </div>
        </motion.div>
      </div>

      {/* Footer Text */}
      <motion.div
        className="mt-8 pt-6 border-t border-gray-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <p className="text-gray-600 italic">
          Our success stories highlight the real life impact of your donations &
          the resilience of those we help. These narratives showcase the power
          of compassion.
        </p>
      </motion.div>
    </div>
  );
};

export default SuccessStoryComponent;
