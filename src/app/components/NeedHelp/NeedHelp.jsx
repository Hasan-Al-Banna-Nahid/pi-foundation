"use client";
import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";
import * as THREE from "three";
import { useSpring, animated } from "@react-spring/web"; // Changed to @react-spring/web for DOM animations
import { gsap } from "gsap";
import Image from "next/image";

function FloatingParticles() {
  const particlesRef = useRef(null);
  const torusRef = useRef(null);
  const count = 200;
  const mouse = useRef({ x: 0, y: 0 });
  const velocities = useRef(new Float32Array(count * 3));
  const originalPositions = useRef(new Float32Array(count * 3));

  useEffect(() => {
    const particles = particlesRef.current;
    if (!particles) return;

    // Create and assign geometry
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      originalPositions.current[i * 3] = positions[i * 3];
      originalPositions.current[i * 3 + 1] = positions[i * 3 + 1];
      originalPositions.current[i * 3 + 2] = positions[i * 3 + 2];

      colors[i * 3] = 0.1 + Math.random() * 0.2;
      colors[i * 3 + 1] = 0.5 + Math.random() * 0.3;
      colors[i * 3 + 2] = 0.1 + Math.random() * 0.2;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    particles.geometry = geometry; // Assign geometry to the points object

    const onMouseMove = (event) => {
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  useFrame((state, delta) => {
    const particles = particlesRef.current;
    if (!particles || !particles.geometry?.attributes?.position) return; // Safety check
    const positions = particles.geometry.attributes.position.array;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const x = positions[i3];
      const y = positions[i3 + 1];
      const z = positions[i3 + 2];

      const k = 0.08;
      const damping = 0.92;
      const ox = originalPositions.current[i3];
      const oy = originalPositions.current[i3 + 1];
      const oz = originalPositions.current[i3 + 2];

      const ax = -k * (x - ox);
      const ay =
        -k * (y - oy) + Math.sin(state.clock.getElapsedTime() + i) * 0.01;
      const az = -k * (z - oz);

      velocities.current[i3] += ax * delta;
      velocities.current[i3 + 1] += ay * delta;
      velocities.current[i3 + 2] += az * delta;

      velocities.current[i3] *= damping;
      velocities.current[i3 + 1] *= damping;
      velocities.current[i3 + 2] *= damping;

      const mouseWorld = new THREE.Vector3(
        mouse.current.x * 5,
        mouse.current.y * 5,
        0
      );
      const distance = Math.sqrt(
        (x - mouseWorld.x) ** 2 + (y - mouseWorld.y) ** 2 + z ** 2
      );
      if (distance < 1) {
        const force = (1 - distance) * 0.15;
        velocities.current[i3] += force * (x - mouseWorld.x) * delta;
        velocities.current[i3 + 1] += force * (y - mouseWorld.y) * delta;
      }

      positions[i3] += velocities.current[i3] * delta;
      positions[i3 + 1] += velocities.current[i3 + 1] * delta;
      positions[i3 + 2] += velocities.current[i3 + 2] * delta;
    }

    particles.geometry.attributes.position.needsUpdate = true;
    particles.rotation.y += delta * 0.02;
  });

  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[5, 5, 5]} intensity={1.5} />
      <group>
        <points ref={particlesRef}>
          <bufferGeometry />{" "}
          {/* Removed attach="geometry" as it's now set in useEffect */}
        </points>
        <Float speed={0.8} rotationIntensity={0.3} floatIntensity={0.3}>
          <mesh ref={torusRef}>
            <torusKnotGeometry args={[1.2, 0.2, 80, 16]} />
            <meshStandardMaterial
              color="#FFD700"
              emissive="#FFD700"
              emissiveIntensity={0.2}
              transparent
              opacity={0.1}
              wireframe
            />
          </mesh>
        </Float>
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
    // Fallback to redirect if Modal isn't available
    window.open(youtubeUrl, "_blank");
  };

  return (
    <div
      ref={bannerRef}
      className="relative w-full min-h-[600px] lg:min-h-[400px] bg-gradient-to-br from-green-900 to-teal-900 overflow-hidden rounded-lg shadow-2xl"
    >
      {/* Background Patterns */}
      <div className="absolute inset-0 z-0 opacity-20 bg-[url('/dagger-map-pattern.png')] bg-cover"></div>
      <div className="absolute inset-0 z-0 opacity-10 bg-[url('/wave-pattern.png')] bg-repeat"></div>
      <div className="absolute inset-0 z-10 opacity-15">
        <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
          <FloatingParticles />
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
            src="/success-story-bg.jpg"
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
