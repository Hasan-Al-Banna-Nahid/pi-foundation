"use client";
import { useRef, useEffect, forwardRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Text } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSpring, animated } from "@react-spring/web";
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/navigation";

gsap.registerPlugin(ScrollTrigger);

const HandGivingScene = () => {
  const groupRef = useRef();
  const particlesRef = useRef();
  const handsRef = useRef([]);
  const cloudRef = useRef();
  const cloudCount = 8;

  useEffect(() => {
    // Initialize cloud particles
    const cloudGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const cloudMaterial = new THREE.MeshStandardMaterial({
      color: "#ffffff",
      transparent: true,
      opacity: 0.2,
      roughness: 0.8,
    });
    for (let i = 0; i < cloudCount; i++) {
      const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
      cloud.position.set(
        (Math.random() - 0.5) * 10,
        Math.random() * 4,
        (Math.random() - 0.5) * 10
      );
      cloud.scale.setScalar(0.4 + Math.random() * 0.3);
      cloudRef.current.add(cloud);
    }

    // Initialize hand models (simplified as cones)
    const handGeometry = new THREE.ConeGeometry(0.15, 0.5, 8);
    const handMaterial = new THREE.MeshStandardMaterial({
      color: "#FFD700",
      emissive: "#FFD700",
      emissiveIntensity: 0.3,
      roughness: 0.4,
    });
    for (let i = 0; i < 5; i++) {
      const hand = new THREE.Mesh(handGeometry, handMaterial);
      hand.position.set(
        (Math.random() - 0.5) * 8,
        -2 + Math.random() * 1,
        (Math.random() - 0.5) * 8
      );
      hand.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      handsRef.current.push(hand);
      groupRef.current.add(hand);
    }

    // Initialize particles
    const particlesGeometry = new THREE.BufferGeometry();
    const count = 200;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 15;
      colors[i] = 0.5 + Math.random() * 0.5;
    }
    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    particlesGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(colors, 3)
    );
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    particlesRef.current = new THREE.Points(
      particlesGeometry,
      particlesMaterial
    );
    groupRef.current.add(particlesRef.current);

    return () => {
      cloudGeometry.dispose();
      cloudMaterial.dispose();
      handGeometry.dispose();
      handMaterial.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
    };
  }, []);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    groupRef.current.rotation.y = time * 0.02;
    particlesRef.current.rotation.y += 0.001;
    handsRef.current.forEach((hand, i) => {
      hand.position.y += Math.sin(time + i) * 0.01;
      hand.rotation.z += Math.cos(time + i) * 0.005;
    });
    cloudRef.current.children.forEach((cloud, i) => {
      cloud.position.x += Math.sin(time + i) * 0.01;
      cloud.position.z += Math.cos(time + i) * 0.01;
    });
  });

  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      <group ref={groupRef}>
        <group ref={cloudRef} />
        <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
          <mesh>
            <torusKnotGeometry args={[1.5, 0.4, 100, 16]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive="#ffffff"
              emissiveIntensity={0.1}
              transparent
              opacity={0.15}
              wireframe
            />
          </mesh>
        </Float>
      </group>
    </>
  );
};

const campaigns = [
  {
    id: 1,
    title: "End Hunger & Support Vulnerable Communities",
    category: "Food",
    raised: 86210,
    goal: 60000,
    image: "/hungry.jpeg",
    color: "bg-gradient-to-br from-amber-400 to-amber-600",
  },
  {
    id: 2,
    title: "Medical Care for Those in Critical Need",
    category: "Treatment",
    raised: 69628,
    goal: 60000,
    image: "/sick.jpeg",
    color: "bg-gradient-to-br from-emerald-400 to-emerald-600",
  },
  {
    id: 3,
    title: "Healing Hearts Through Compassion",
    category: "Development",
    raised: 40009,
    goal: 50000,
    image: "/heart.jpeg",
    color: "bg-gradient-to-br from-blue-400 to-blue-600",
  },
  {
    id: 4,
    title: "Education Access for All Children",
    category: "Education",
    raised: 75000,
    goal: 100000,
    image: "/educ.jpeg",
    color: "bg-gradient-to-br from-purple-400 to-purple-600",
  },
  {
    id: 5,
    title: "Creating Sustainable Job Opportunities",
    category: "Employment",
    raised: 58000,
    goal: 80000,
    image: "/vt.jpeg",
    color: "bg-gradient-to-br from-indigo-400 to-indigo-600",
  },
  {
    id: 6,
    title: "Protecting Our Planet's Future",
    category: "Environment",
    raised: 32000,
    goal: 50000,
    image: "/pl.jpeg",
    color: "bg-gradient-to-br from-green-400 to-green-600",
  },
];

export default function CampaignSlider() {
  const containerRef = useRef();

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
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-300">
      {/* Background Patterns */}
      <div className="absolute inset-0 z-0 opacity-25 bg-[url('/dagger-map-pattern.png')] bg-cover"></div>
      <div className="absolute inset-0 z-0 opacity-15 bg-[url('/wave-pattern.png')] bg-repeat"></div>
      <div className="absolute inset-0 z-0 opacity-20">
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
          <HandGivingScene />
        </Canvas>
      </div>

      <div
        ref={containerRef}
        className="relative z-10 container mx-auto px-4 sm:px-8 py-16"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 font-serif animate-pulse">
            Our Impactful Campaigns
          </h2>
          <p className="text-base sm:text-lg text-gray-700 max-w-2xl mx-auto font-sans">
            Join us in making a difference through these vital initiatives
          </p>
        </motion.div>

        <Swiper
          modules={[Autoplay, Navigation]}
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 1.5, spaceBetween: 15 },
            1024: { slidesPerView: 2.5, spaceBetween: 20 },
            1280: { slidesPerView: 3, spaceBetween: 20 },
          }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          loop={true}
          centeredSlides={true}
          className="w-full pb-12"
        >
          {campaigns.map((campaign, index) => {
            const percentage = Math.min(
              Math.round((campaign.raised / campaign.goal) * 100),
              100
            );

            const cardSpring = useSpring({
              from: { y: 25, opacity: 0 },
              to: { y: 0, opacity: 1 },
              config: { mass: 1, tension: 140, friction: 16 },
              delay: index * 150,
            });

            return (
              <SwiperSlide key={campaign.id}>
                <animated.div
                  style={cardSpring}
                  className="relative h-[480px] rounded-2xl overflow-hidden shadow-2xl bg-white/10 backdrop-blur-lg border-l-[6px] border-gold-400 ring-1 ring-gold-200/50 hover:ring-gold-300/50 transition-all duration-300"
                >
                  {/* Card Background Image */}
                  <div className="absolute inset-0 z-0">
                    <img
                      src={campaign.image}
                      alt={campaign.title}
                      className="w-full h-full object-cover opacity-70"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="relative z-10 h-full flex flex-col justify-end p-4 sm:p-6">
                    <div className="bg-white/90 backdrop-blur-md rounded-lg p-4 sm:p-5 shadow-lg border-l-4 border-gold-400">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider font-sans">
                            {campaign.category}
                          </span>
                          <h3 className="text-base sm:text-lg font-bold text-gray-900 mt-1 line-clamp-2 font-serif">
                            {campaign.title}
                          </h3>
                        </div>
                        <div className="text-lg sm:text-xl font-bold text-gray-900">
                          {percentage}%
                        </div>
                      </div>

                      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                        <motion.div
                          className={`h-2 rounded-full ${campaign.color}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                        />
                      </div>

                      <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                        <div className="text-xs sm:text-sm text-gray-700 font-sans">
                          <span className="font-bold">
                            ${campaign.raised.toLocaleString()}
                          </span>
                          <span className="mx-1">/</span>
                          <span>${campaign.goal.toLocaleString()}</span>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className={`px-3 sm:px-4 py-1 ${campaign.color} text-white text-xs sm:text-sm font-bold rounded-full shadow-md hover:shadow-lg transition-all flex items-center`}
                        >
                          <span>Donate</span>
                          <svg
                            className="w-3 h-3 sm:w-4 sm:h-4 ml-1"
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
                </animated.div>
              </SwiperSlide>
            );
          })}
          <div className="swiper-button-prev !text-gray-700 !left-4 after:!text-xl"></div>
          <div className="swiper-button-next !text-gray-700 !right-4 after:!text-xl"></div>
        </Swiper>
      </div>
    </div>
  );
}
