"use client";
import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";
import * as THREE from "three";
import { useSpring, animated } from "@react-spring/web";
import { gsap } from "gsap";
import Image from "next/image";

function HumanFiguresBackground() {
  const groupRef = useRef(null);
  const figuresRef = useRef(null);
  const count = 50; // Number of human figures
  const positions = useRef(new Float32Array(count * 3));
  const velocities = useRef(new Float32Array(count * 3));

  useEffect(() => {
    if (!figuresRef.current) return;

    // Initialize human figures in a circular pattern
    const matrices = new Float32Array(count * 16); // For instanced mesh matrices
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const angle = (i / count) * Math.PI * 2;
      const radius = 6 + Math.random() * 2; // Spread figures in a ring
      const x = Math.cos(angle) * radius;
      const y = (Math.random() - 0.5) * 4; // Vertical spread
      const z = Math.sin(angle) * radius;
      positions.current[i3] = x;
      positions.current[i3 + 1] = y;
      positions.current[i3 + 2] = z;

      // Random walking direction
      velocities.current[i3] = (Math.random() - 0.5) * 0.2;
      velocities.current[i3 + 1] = 0;
      velocities.current[i3 + 2] = (Math.random() - 0.5) * 0.2;

      // Set instanced matrix
      const matrix = new THREE.Matrix4();
      matrix.setPosition(x, y, z);
      matrix.scale(new THREE.Vector3(0.3, 0.6, 0.3)); // Scale for human-like proportions
      matrix.toArray(matrices, i * 16);
    }

    figuresRef.current.instanceMatrix = new THREE.InstancedBufferAttribute(
      matrices,
      16
    );
    figuresRef.current.instanceMatrix.needsUpdate = true;

    return () => {
      figuresRef.current.geometry.dispose();
      figuresRef.current.material.dispose();
    };
  }, []);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (figuresRef.current) {
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const matrix = new THREE.Matrix4();

        // Update positions with walking motion
        positions.current[i3] += velocities.current[i3] * 0.016;
        positions.current[i3 + 2] += velocities.current[i3 + 2] * 0.016;

        // Keep figures within bounds (circular path)
        const distance = Math.sqrt(
          positions.current[i3] ** 2 + positions.current[i3 + 2] ** 2
        );
        if (distance > 8) {
          const angle = Math.atan2(
            positions.current[i3 + 2],
            positions.current[i3]
          );
          positions.current[i3] = Math.cos(angle) * 7;
          positions.current[i3 + 2] = Math.sin(angle) * 7;
        }

        // Add bobbing and waving motion
        const y = positions.current[i3 + 1] + Math.sin(time * 2 + i) * 0.1;
        matrix.setPosition(positions.current[i3], y, positions.current[i3 + 2]);

        // Add slight rotation for liveliness
        matrix.multiply(
          new THREE.Matrix4().makeRotationY(Math.sin(time + i) * 0.2)
        );
        matrix.scale(new THREE.Vector3(0.3, 0.6, 0.3));

        figuresRef.current.setMatrixAt(i, matrix);
      }
      figuresRef.current.instanceMatrix.needsUpdate = true;
    }
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.01; // Gentle rotation of the entire group
    }
  });

  return (
    <>
      <ambientLight intensity={0.6} color="#aaffcc" />
      <pointLight position={[5, 5, 5]} intensity={1.5} color="#ffffff" />
      <pointLight position={[-5, -5, 5]} intensity={1} color="#88ccff" />
      <group ref={groupRef}>
        <instancedMesh ref={figuresRef} args={[null, null, count]}>
          <cylinderGeometry args={[0.5, 0.5, 2, 16]} />{" "}
          {/* Simplified human shape */}
          <meshStandardMaterial
            color="#66cc99"
            emissive="#66cc99"
            emissiveIntensity={0.5}
            transparent
            opacity={0.7}
          />
        </instancedMesh>
      </group>
    </>
  );
}

export default function SuccessStoryBanner({
  youtubeUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
}) {
  const bannerRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (bannerRef.current) {
      gsap.from(bannerRef.current, {
        opacity: 0,
        y: 50,
        duration: 1.5,
        ease: "power3.out",
      });

      gsap.from(".stat-item", {
        opacity: 0,
        y: 20,
        duration: 1,
        stagger: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: bannerRef.current,
          start: "top 80%",
        },
      });
    }
  }, []);

  const titleProps = useSpring({
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

  const playButtonProps = useSpring({
    from: { scale: 0, opacity: 0 },
    to: { scale: 1, opacity: 1 },
    config: { mass: 1, tension: 150, friction: 12 },
    delay: 400,
  });

  const handlePlayClick = () => {
    window.open(youtubeUrl, "_blank");
  };

  return (
    <div
      ref={bannerRef}
      className="relative w-full min-h-[600px] lg:min-h-[400px] bg-gradient-to-br from-green-900 to-teal-900 overflow-hidden rounded-lg shadow-2xl"
    >
      {/* Animated Human Figures Background */}
      <div className="absolute inset-0 z-10 opacity-25">
        <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
          <HumanFiguresBackground />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableRotate={false}
          />
        </Canvas>
      </div>

      {/* Content */}
      <div className="relative z-20 grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 sm:p-8 lg:p-12 text-white">
        {/* Left Section - Text and Stats */}
        <div className="flex flex-col justify-center items-start space-y-6">
          <animated.h1
            style={titleProps}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif leading-tight"
          >
            We Always Help The Needy People
          </animated.h1>
          <animated.p
            style={subtitleProps}
            className="text-base sm:text-lg lg:text-xl font-sans max-w-md"
          >
            Discover the inspiring stories of individuals and communities
            transformed by our programs. Our successful stories highlight the
            real-life impact of your donations.
          </animated.p>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="stat-item">
              <p className="text-3xl font-bold text-yellow-400">15K+</p>
              <p className="text-sm font-sans">Incredible Volunteers</p>
            </div>
            <div className="stat-item">
              <p className="text-3xl font-bold text-yellow-400">1K+</p>
              <p className="text-sm font-sans">Successful Campaigns</p>
            </div>
            <div className="stat-item">
              <p className="text-3xl font-bold text-yellow-400">400+</p>
              <p className="text-sm font-sans">Monthly Donors</p>
            </div>
            <div className="stat-item">
              <p className="text-3xl font-bold text-yellow-400">35K+</p>
              <p className="text-sm font-sans">Team Support</p>
            </div>
          </div>
        </div>

        {/* Right Section - Image and Play Button */}
        <div className="relative flex items-center justify-center">
          <Image
            src="/gd.webp"
            alt="Success story"
            width={800}
            height={400}
            className="object-cover rounded-lg shadow-lg"
            onError={(e) => {
              e.target.src = "/fallback-bg.jpg";
            }}
          />
          <animated.div
            style={playButtonProps}
            className="absolute flex items-center justify-center w-16 h-16 bg-white rounded-full cursor-pointer hover:bg-gray-100 transition-all duration-300"
            onClick={handlePlayClick}
            aria-label="Play success story video"
          >
            <svg
              className="w-8 h-8 text-green-900"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </animated.div>
        </div>
      </div>
    </div>
  );
}
