"use client";
import { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useSpring, animated } from "@react-spring/web";
import { gsap } from "gsap";
import Image from "next/image";

function WaveBackground() {
  const meshRef = useRef(null);
  const geometryRef = useRef(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (geometryRef.current) {
      const positions = geometryRef.current.attributes.position;
      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const y = positions.getY(i);
        const z = Math.sin(x * 0.5 + time) * Math.cos(y * 0.5 + time) * 0.5;
        positions.setZ(i, z);
      }
      positions.needsUpdate = true;
    }
    if (meshRef.current) {
      meshRef.current.rotation.z += 0.005; // Gentle rotation
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} color="#7e22ce" />
      <pointLight position={[5, 5, 5]} intensity={1.5} color="#ffffff" />
      <pointLight position={[-5, -5, 5]} intensity={1} color="#1e3a8a" />
      <mesh ref={meshRef}>
        <planeGeometry ref={geometryRef} args={[291, 20, 32, 32]} />
        <meshStandardMaterial
          color="#7e22ce"
          emissive="#1e3a8a"
          emissiveIntensity={0.3}
          transparent
          opacity={0.6}
          wireframe
          side={THREE.DoubleSide}
        />
      </mesh>
    </>
  );
}

export default function FounderBanner() {
  const cardRef = useRef(null);
  const imageContainerRef = useRef(null);

  useEffect(() => {
    if (cardRef.current) {
      gsap.from(cardRef.current, {
        opacity: 0,
        y: 50,
        duration: 1.5,
        ease: "power3.out",
      });
    }
    if (imageContainerRef.current) {
      gsap.from(imageContainerRef.current, {
        scale: 0.8,
        opacity: 0,
        duration: 1.2,
        delay: 0.3,
        ease: "power3.out",
      });
    }
  }, []);

  const quoteProps = useSpring({
    from: { opacity: 0, y: 30 },
    to: { opacity: 1, y: 0 },
    config: { mass: 1, tension: 120, friction: 14 },
  });

  const subtitleProps = useSpring({
    from: { opacity: 0, y: 30 },
    to: { opacity: 1, y: 0 },
    config: { mass: 1, tension: 120, friction: 14 },
    delay: 200,
  });

  const buttonProps = useSpring({
    from: { scale: 0, opacity: 0 },
    to: { scale: 1, opacity: 1 },
    config: { mass: 1, tension: 150, friction: 12 },
    delay: 400,
  });

  return (
    <div
      ref={cardRef}
      className="relative w-full min-h-[600px] lg:min-h-[400px] bg-gradient-to-br from-purple-900 to-blue-900 overflow-hidden rounded-2xl shadow-2xl backdrop-blur-lg border border-white/10"
    >
      {/* 3D Animated Background */}
      <div className="absolute inset-0 z-0 opacity-20">
        <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
          <WaveBackground />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableRotate={false}
          />
        </Canvas>
      </div>

      {/* Content */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 sm:p-8 lg:p-12 text-white">
        {/* Left Section - Founder Image and Bio */}
        <div className="flex flex-col justify-center items-center lg:items-start space-y-6">
          <div
            ref={imageContainerRef}
            className="relative rounded-lg w-80 h-80 lg:w-96 lg:h-96 transition-transform duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(126,34,206,0.5)]"
          >
            <Image
              src="/n.png"
              alt="Hasan Al Banna Nahid"
              width={384}
              height={384}
              className="object-cover w-full h-full rounded-lg"
              onError={(e) => {
                e.target.src = "/n.png";
              }}
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-900 opacity-50 border border-white/20" />
          </div>
          <div className="text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold font-serif">
              Hasan Al Banna Nahid
            </h2>
            <p className="text-sm sm:text-base font-sans text-purple-200">
              Founder, PI Foundation
            </p>
          </div>
        </div>

        {/* Right Section - Quote and Subtitle */}
        <div className="flex flex-col justify-center items-center lg:items-start space-y-6">
          <animated.h1
            style={quoteProps}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif leading-tight text-center lg:text-left"
          >
            "Together we can make changes"
          </animated.h1>
          <animated.p
            style={subtitleProps}
            className="text-base sm:text-lg lg:text-xl font-sans max-w-md text-center lg:text-left text-purple-100"
          >
            By uniting our strengths and compassion, we can transform lives,
            uplift communities, and create a brighter future for all. Join us in
            this journey of impact and hope.
          </animated.p>
          <animated.div style={buttonProps}>
            <a
              href="/about"
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Learn More
            </a>
          </animated.div>
        </div>
      </div>
    </div>
  );
}
