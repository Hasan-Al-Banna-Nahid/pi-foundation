"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, Text } from "@react-three/drei";
import * as THREE from "three";

function FloatingHands() {
  const leftHand = useRef();
  const rightHand = useRef();

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    leftHand.current.rotation.y = Math.sin(time) * 0.2;
    leftHand.current.position.y = Math.sin(time * 1.5) * 0.1;
    rightHand.current.rotation.y = Math.cos(time) * 0.2;
    rightHand.current.position.y = Math.cos(time * 1.5) * 0.1;
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Left Hand */}
      <group ref={leftHand} position={[-1.5, 0, 0]}>
        <mesh>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshStandardMaterial
            color="#f59e0b"
            emissive="#f59e0b"
            emissiveIntensity={0.5}
          />
        </mesh>
        {[...Array(5)].map((_, i) => (
          <mesh key={i} position={[0, -0.1 - i * 0.2, 0.1]}>
            <cylinderGeometry args={[0.05, 0.05, 0.3, 8]} />
            <meshStandardMaterial color="#f59e0b" />
          </mesh>
        ))}
      </group>

      {/* Right Hand */}
      <group ref={rightHand} position={[1.5, 0, 0]}>
        <mesh>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshStandardMaterial
            color="#3b82f6"
            emissive="#3b82f6"
            emissiveIntensity={0.5}
          />
        </mesh>
        {[...Array(5)].map((_, i) => (
          <mesh key={i} position={[0, -0.1 - i * 0.2, 0.1]}>
            <cylinderGeometry args={[0.05, 0.05, 0.3, 8]} />
            <meshStandardMaterial color="#3b82f6" />
          </mesh>
        ))}
      </group>
    </group>
  );
}

export default function OpenDoorsComponent() {
  return (
    <div className="relative h-[600px] w-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Canvas>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          <FloatingHands />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.5}
          />
        </Canvas>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col lg:flex-row items-center justify-center px-8 gap-12">
        {/* Left Column - Text */}
        <div className="lg:w-1/2 space-y-6 text-center lg:text-left">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
            Our Doors Are Always Open To
          </h2>
          <h3 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-blue-600">
            More People Who Want To
          </h3>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">
            Support Each Other!
          </p>

          <button className="mt-8 px-8 py-3 bg-gradient-to-r from-amber-500 to-blue-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
            Get Involved
          </button>
        </div>

        {/* Right Column - Mockup */}
        <div className="lg:w-1/2 relative h-full flex items-center justify-center">
          <div className="relative w-full max-w-md h-80 bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-white/30 shadow-2xl overflow-hidden p-8">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber-400/20 rounded-full filter blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-500/20 rounded-full filter blur-3xl"></div>

            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Ways to Support
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <div className="flex-shrink-0 mt-1 mr-3 text-amber-500">•</div>
                <span>Volunteer your time and skills</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 mt-1 mr-3 text-blue-500">•</div>
                <span>Donate to support our programs</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 mt-1 mr-3 text-amber-500">•</div>
                <span>Spread awareness in your community</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 mt-1 mr-3 text-blue-500">•</div>
                <span>Partner with us as an organization</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
