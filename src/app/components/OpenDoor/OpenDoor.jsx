"use client";
import { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Text, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function FloatingIcons() {
  const iconsRef = useRef([]);

  const icons = [
    {
      type: "volunteer",
      position: [-3, 1, 0],
      color: "#3b82f6",
      icon: "🙋",
      size: 0.5,
    },
    {
      type: "donate",
      position: [3, -1, 0],
      color: "#10b981",
      icon: "💙",
      size: 0.5,
    },
    {
      type: "community",
      position: [0, 2, -3],
      color: "#f59e0b",
      icon: "👥",
      size: 0.6,
    },
    {
      type: "impact",
      position: [0, -2, 3],
      color: "#ef4444",
      icon: "✨",
      size: 0.7,
    },
  ];

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    iconsRef.current.forEach((icon, i) => {
      if (icon) {
        icon.position.y = icons[i].position.y + Math.sin(time + i) * 0.3;
        icon.rotation.y += 0.01;
      }
    });
  });

  return (
    <group>
      {icons.map((icon, i) => (
        <Float key={i} speed={2} rotationIntensity={0.5} floatIntensity={1}>
          <Text
            ref={(el) => (iconsRef.current[i] = el)}
            position={icon.position}
            fontSize={icon.size}
            color={icon.color}
            anchorX="center"
            anchorY="middle"
            font="/fonts/NotoEmoji-Regular.ttf"
          >
            {icon.icon}
            <meshStandardMaterial
              emissive={icon.color}
              emissiveIntensity={0.5}
            />
          </Text>
        </Float>
      ))}
    </group>
  );
}

function BackgroundScene() {
  const particlesRef = useRef();

  useEffect(() => {
    const count = 500;
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 50;
    }

    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.1,
      color: 0xffffff,
      transparent: true,
      opacity: 0.5,
    });

    particlesRef.current = new THREE.Points(
      particlesGeometry,
      particlesMaterial
    );

    return () => {
      particlesGeometry.dispose();
      particlesMaterial.dispose();
    };
  }, []);

  useFrame(() => {
    if (particlesRef.current) {
      particlesRef.current.rotation.x += 0.001;
      particlesRef.current.rotation.y += 0.002;
    }
  });

  if (!particlesRef.current) return null;

  return <primitive object={particlesRef.current} />;
}

export default function VolunteerPage() {
  const leftCardRef = useRef();
  const rightCardRef = useRef();
  const containerRef = useRef();

  useEffect(() => {
    // Filter out undefined refs
    const validRefs = [leftCardRef.current, rightCardRef.current].filter(
      (ref) => ref !== undefined
    );

    // Card animations
    gsap.from(validRefs, {
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        toggleActions: "play none none none",
      },
    });

    // Floating effect for rightCardRef
    if (rightCardRef.current) {
      gsap.to(rightCardRef.current, {
        y: -10,
        duration: 3,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        delay: 0.5,
      });
    }

    // Background animation
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        backgroundPosition: "100% 50%",
        duration: 15,
        repeat: -1,
        yoyo: true,
        ease: "none",
      });
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900"
      style={{ backgroundSize: "200% 200%" }}
    >
      {/* 3D Background */}
      <div className="absolute inset-0 z-0 opacity-30">
        <Canvas>
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#3b82f6" />
          <pointLight
            position={[-10, -10, -10]}
            intensity={0.5}
            color="#f59e0b"
          />
          <BackgroundScene />
          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
      </div>

      {/* 3D Floating Icons */}
      <div className="absolute inset-0 z-10">
        <Canvas>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          <FloatingIcons />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.5}
          />
        </Canvas>
      </div>

      {/* Content */}
      <div className="relative z-20 h-full flex flex-col items-center justify-center px-4 sm:px-8 py-16">
        <h1 className="text-4xl sm:text-5xl font-bold text-white text-center mb-4">
          Join Our Community
        </h1>
        <p className="text-xl text-gray-300 text-center max-w-2xl mb-12">
          Together we can make a difference in people's lives
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-1 mx-auto gap-8 w-full max-w-6xl">
          {/* Volunteer Card (Commented Out) */}
          {/* <div
            ref={leftCardRef}
            className="relative bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border-2 border-white/20 p-8 shadow-2xl"
          >
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-500/20 rounded-full filter blur-3xl"></div>
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-amber-500/20 rounded-full filter blur-3xl"></div>

            <div className="flex flex-col h-full">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Become a Volunteer
                </h2>
                <p className="text-gray-300">
                  Share your time and skills to directly impact lives in our
                  community
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1 mr-3 text-blue-400">✓</div>
                  <span className="text-gray-200">
                    Hands-on experience with our programs
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1 mr-3 text-blue-400">✓</div>
                  <span className="text-gray-200">
                    Training and skill development
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1 mr-3 text-blue-400">✓</div>
                  <span className="text-gray-200">
                    Community networking opportunities
                  </span>
                </li>
              </ul>

              <button className="mt-auto px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                Sign Up to Volunteer
              </button>
            </div>
          </div> */}

          {/* Donor Card */}
          <div
            ref={rightCardRef}
            className="relative bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border-2 border-white/20 p-8 shadow-2xl"
          >
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-green-500/20 rounded-full filter blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/20 rounded-full filter blur-3xl"></div>

            <div className="flex flex-col h-full">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Support as a Donor
                </h2>
                <p className="text-gray-300">
                  Your contributions help sustain and expand our critical
                  programs
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1 mr-3 text-green-400">
                    ✓
                  </div>
                  <span className="text-gray-200">
                    Transparent impact reporting
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1 mr-3 text-green-400">
                    ✓
                  </div>
                  <span className="text-gray-200">
                    Tax deductible donations
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1 mr-3 text-green-400">
                    ✓
                  </div>
                  <span className="text-gray-200">
                    Recognition in our annual report
                  </span>
                </li>
              </ul>

              <button className="mt-auto px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                Make a Donation
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
