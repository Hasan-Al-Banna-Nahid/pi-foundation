"use client";
import { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, Text } from "@react-three/drei";
import * as THREE from "three";

function InfiniteTrees() {
  const groupRef = useRef();
  const trees = useRef([]);

  // Create trees
  useEffect(() => {
    const count = 30;
    const tempTrees = [];

    for (let i = 0; i < count; i++) {
      const tree = {
        x: (Math.random() - 0.5) * 100,
        z: -i * 5,
        scale: 0.5 + Math.random() * 1.5,
      };
      tempTrees.push(tree);
    }

    trees.current = tempTrees;
  }, []);

  useFrame((state, delta) => {
    // Move trees forward
    trees.current.forEach((tree) => {
      tree.z += delta * 10;
      if (tree.z > 5) tree.z = -95;
    });

    // Rotate group slowly
    groupRef.current.rotation.y += delta * 0.1;
  });

  return (
    <group ref={groupRef}>
      {trees.current.map((tree, i) => (
        <group
          key={i}
          position={[tree.x, 0, tree.z]}
          scale={[tree.scale, tree.scale, tree.scale]}
        >
          <mesh position={[0, 1.5, 0]}>
            <coneGeometry args={[1, 3, 4]} />
            <meshStandardMaterial color="#10b981" />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.3, 0.3, 1, 8]} />
            <meshStandardMaterial color="#78350f" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function FloatingCard() {
  const cardRef = useRef();

  useFrame(({ clock }) => {
    cardRef.current.position.x = Math.sin(clock.getElapsedTime() * 0.5) * 0.5;
    cardRef.current.position.y = Math.cos(clock.getElapsedTime() * 0.8) * 0.3;
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <group ref={cardRef}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[3, 2, 0.2]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#e2e8f0"
            emissiveIntensity={0.5}
            metalness={0.1}
            roughness={0.2}
          />
        </mesh>
        <Text
          position={[0, 0.5, 0.11]}
          fontSize={0.3}
          color="#1e293b"
          anchorX="center"
          anchorY="middle"
          maxWidth={2.8}
        >
          Success Story
        </Text>
      </group>
    </Float>
  );
}

export default function SuccessStories() {
  return (
    <div className="relative h-[700px] w-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Canvas>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 5, 10]} intensity={1} />
          <pointLight position={[-10, 5, -10]} intensity={0.5} />
          <InfiniteTrees />
          <FloatingCard />
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
        {/* Left Column - Story */}
        <div className="lg:w-1/2 space-y-6">
          <div className="inline-block bg-gradient-to-r from-green-500 to-blue-500 p-1 rounded-lg mb-6">
            <h2 className="text-3xl font-bold text-white bg-gray-900 px-6 py-3 rounded-lg">
              Success Story
            </h2>
          </div>

          <p className="text-lg text-gray-700 max-w-2xl">
            We Help Fellow Nonprofits Access The Funding Tools, Training, and
            Support They Need.
          </p>

          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border-l-4 border-green-500 mt-6">
            <p className="text-gray-700 mb-4">
              Our secure online donation platform allows you to make
              contributions quickly and safely. Choose from various payment
              methods and set up one-time or recurring donations.
            </p>
            <button className="px-6 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all">
              Our Success Story
            </button>
          </div>
        </div>

        {/* Right Column - Testimonial */}
        <div className="lg:w-1/2 relative h-full flex items-center justify-center">
          <div className="relative w-full max-w-md bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg border-t-4 border-blue-500">
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-green-500/20 rounded-full backdrop-blur-sm"></div>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-blue-500/20 rounded-full backdrop-blur-sm"></div>

            <h3 className="text-2xl font-bold text-gray-900 mb-4">Adam Cruz</h3>
            <p className="text-gray-700 italic">
              "Our success stories highlight the real life impact of your
              donations & the resilience of those we help. These narratives
              showcase the power of compassion."
            </p>

            <div className="mt-6 flex items-center">
              <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
              <div>
                <p className="font-bold text-gray-900">Community Leader</p>
                <p className="text-sm text-gray-600">Since 2020</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
