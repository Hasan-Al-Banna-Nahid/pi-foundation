"use client";
import { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSpring, animated } from "@react-spring/web";
import Image from "next/image";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

// Three.js Bottle Break and Cloud Map Animation
function BackgroundAnimation() {
  const groupRef = useRef();
  const particlesRef = useRef([]);
  const liquidRef = useRef();
  const cloudRef = useRef();
  const count = 50; // Number of bottle fragments
  const cloudCount = 20; // Number of cloud particles

  useEffect(() => {
    // Initialize bottle fragments
    const fragments = [];
    for (let i = 0; i < count; i++) {
      const geometry = new THREE.BoxGeometry(
        0.1 + Math.random() * 0.1,
        0.1 + Math.random() * 0.1,
        0.1 + Math.random() * 0.1
      );
      const material = new THREE.MeshStandardMaterial({
        color: "#4b0082",
        roughness: 0.3,
        metalness: 0.8,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(
        (Math.random() - 0.5) * 0.5,
        2 + Math.random() * 1,
        (Math.random() - 0.5) * 0.5
      );
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      fragments.push({
        mesh,
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.2,
          -Math.random() * 0.5,
          (Math.random() - 0.5) * 0.2
        ),
      });
      groupRef.current.add(mesh);
    }
    particlesRef.current = fragments;

    // Initialize liquid plane
    const liquidGeometry = new THREE.PlaneGeometry(10, 10);
    const liquidMaterial = new THREE.MeshStandardMaterial({
      color: "#ef4444",
      transparent: true,
      opacity: 0.8,
      roughness: 0.2,
      metalness: 0.5,
    });
    liquidRef.current = new THREE.Mesh(liquidGeometry, liquidMaterial);
    liquidRef.current.rotation.x = -Math.PI / 2;
    liquidRef.current.position.y = -1;
    groupRef.current.add(liquidRef.current);

    // Initialize cloud particles
    const cloudGeometry = new THREE.SphereGeometry(0.5, 16, 16);
    const cloudMaterial = new THREE.MeshStandardMaterial({
      color: "#ffffff",
      transparent: true,
      opacity: 0.3,
      roughness: 0.8,
    });
    for (let i = 0; i < cloudCount; i++) {
      const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
      cloud.position.set(
        (Math.random() - 0.5) * 15,
        Math.random() * 5,
        (Math.random() - 0.5) * 15
      );
      cloud.scale.setScalar(0.5 + Math.random() * 0.5);
      groupRef.current.add(cloud);
    }
  }, []);

  useFrame((state, delta) => {
    // Animate bottle fragments
    particlesRef.current.forEach((fragment) => {
      fragment.mesh.position.add(
        fragment.velocity.clone().multiplyScalar(delta)
      );
      fragment.velocity.y -= 0.1 * delta; // Gravity
      if (fragment.mesh.position.y < -0.9) {
        fragment.mesh.position.y = -0.9;
        fragment.velocity.set(0, 0, 0); // Stop at liquid level
      }
      fragment.mesh.rotation.x += fragment.velocity.x * delta;
      fragment.mesh.rotation.y += fragment.velocity.y * delta;
    });

    // Animate liquid rising
    if (liquidRef.current && liquidRef.current.position.y < 0) {
      liquidRef.current.position.y += delta * 0.2;
      liquidRef.current.scale.setScalar(1 + liquidRef.current.position.y * 0.1);
    }

    // Animate clouds
    groupRef.current.children.forEach((child, i) => {
      if (i >= count + 1) {
        // Skip bottle fragments and liquid
        child.position.x +=
          Math.sin(state.clock.elapsedTime + i) * 0.01 * delta;
        child.position.z +=
          Math.cos(state.clock.elapsedTime + i) * 0.01 * delta;
      }
    });
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.7} />
      <pointLight position={[5, 5, 5]} intensity={1.8} />
    </group>
  );
}

// Quote Card Component
const QuoteCard = ({ quote, author, index }) => {
  const quoteRef = useRef();
  const quoteSpring = useSpring({
    from: { y: 50, opacity: 0, rotateX: 10 },
    to: { y: 0, opacity: 1, rotateX: 0 },
    config: { mass: 1, tension: 120, friction: 14 },
    delay: index * 200,
  });

  return (
    <animated.div
      ref={quoteRef}
      style={quoteSpring}
      className="relative bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl p-5 sm:p-6 max-w-xs mx-auto border-l-[6px] border-gold-400 ring-1 ring-gold-200/50 hover:ring-gold-300/50 transition-all duration-300"
    >
      <span className="absolute -top-3 -left-3 text-2xl sm:text-3xl text-gold-400">
        “
      </span>
      <p className="text-sm sm:text-base italic text-gray-800 mb-3 font-medium font-serif">
        {quote}
      </p>
      <footer className="text-gray-700 text-xs sm:text-sm font-serif">
        — {author}
      </footer>
      <span className="absolute -bottom-3 -right-3 text-2xl sm:text-3xl text-gold-400">
        ”
      </span>
    </animated.div>
  );
};

// Main Component
export default function SuccessStoryBanner() {
  const containerRef = useRef();
  const quotes = [
    {
      quote: "Together We Can Make Changes",
      author: "Hasan Al Banna Nahid, Founder, Pi Foundation",
    },
    {
      quote: "Education empowers communities to rise above challenges.",
      author: "Ayesha Siddique, Education Coordinator",
    },
    {
      quote: "Accessible treatment saves lives and restores hope.",
      author: "Dr. Karim Rahman, Medical Director",
    },
    {
      quote: "Jobs provide dignity and a path to self-reliance.",
      author: "Fatima Begum, Employment Specialist",
    },
    {
      quote: "Clean air and water are rights, not privileges.",
      author: "Rohan Islam, Environmental Advocate",
    },
  ];

  // GSAP animation for container and button
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

    gsap.from(".success-button", {
      opacity: 0,
      scale: 0.8,
      duration: 0.8,
      delay: 0.5,
      ease: "back.out(1.7)",
      scrollTrigger: {
        trigger: ".success-button",
        start: "top 90%",
      },
    });
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 py-12 sm:py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Patterns */}
      <div className="absolute inset-0 z-0 opacity-25 bg-[url('/dagger-map-pattern.png')] bg-cover"></div>
      <div className="absolute inset-0 z-0 opacity-15 bg-[url('/wave-pattern.png')] bg-repeat"></div>
      <div className="absolute inset-0 z-0 opacity-35">
        <Canvas>
          <BackgroundAnimation />
        </Canvas>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Top Content */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight font-serif animate-pulse">
            Our Success Stories
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-sans">
            Witness the transformative impact of our initiatives in education,
            healthcare, employment, and environmental sustainability.
          </p>
        </div>

        {/* Middle Content: Quotes and Images */}
        <div className="flex flex-col lg:flex-row gap-8 sm:gap-12">
          {/* Left: Quote Cards */}
          <div className="lg:w-1/2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {quotes.map((quote, index) => (
                <QuoteCard key={index} index={index} {...quote} />
              ))}
            </div>
          </div>

          {/* Right: Images with Dagger Map Background */}
          <div className="lg:w-1/2 flex flex-col gap-6 sm:gap-8">
            <div className="relative w-full max-w-sm mx-auto rounded-2xl shadow-lg overflow-hidden ring-1 ring-gold-200/50">
              <div className="absolute inset-0 bg-[url('/dagger-map-pattern.png')] bg-cover opacity-25"></div>
              <div className="absolute inset-0 bg-[url('/wave-pattern.png')] bg-repeat opacity-15"></div>
              <Image
                src="/sm.jpg"
                alt="Success Story 1"
                width={400}
                height={300}
                className="object-cover w-full h-48 sm:h-64"
                priority
              />
            </div>
            <div className="relative w-full max-w-sm mx-auto rounded-2xl shadow-lg overflow-hidden ring-1 ring-gold-200/50">
              <div className="absolute inset-0 bg-[url('/dagger-map-pattern.png')] bg-cover opacity-25"></div>
              <div className="absolute inset-0 bg-[url('/wave-pattern.png')] bg-repeat opacity-15"></div>
              <Image
                src="/p.jpg"
                alt="Success Story 2"
                width={400}
                height={300}
                className="object-cover w-full h-48 sm:h-64"
                priority
              />
            </div>
          </div>
        </div>

        {/* Bottom Success Story Button */}
        <div className="mt-12 sm:mt-16 text-center">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="success-button bg-gradient-to-r from-gray-400 to-gray-600 text-slate-100 px-4 sm:px-6 py-2 rounded-full font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center mx-auto text-sm sm:text-base"
          >
            <span>Explore More</span>
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
