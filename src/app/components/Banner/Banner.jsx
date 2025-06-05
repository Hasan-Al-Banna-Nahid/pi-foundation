"use client";
import { useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Float } from "@react-three/drei";
import * as THREE from "three";
import "swiper/css";
import "swiper/css/effect-fade";
import { gsap } from "gsap";

// Enhanced Background Pattern Component
function BackgroundPattern() {
  const meshRef = useRef(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (meshRef.current) {
      const position = meshRef.current.geometry.attributes.position;
      for (let i = 0; i < position.count; i++) {
        const x = position.getX(i);
        const y = position.getY(i);
        const z =
          Math.sin(x * 0.3 + time * 0.5) * Math.cos(y * 0.3 + time * 0.5) * 0.8;
        position.setZ(i, z);
      }
      position.needsUpdate = true;
      meshRef.current.rotation.z = time * 0.05;
    }
  });

  return (
    <mesh ref={meshRef}>
      <torusKnotGeometry args={[10, 0.2, 100, 16]} />
      <meshStandardMaterial
        color={0x66ccff}
        wireframe
        transparent
        opacity={0.2}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// Vector Animated Scene for Right Section
function VectorScene({ type }) {
  const meshRef = useRef(null);
  const groupRef = useRef(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = time * 0.2;
      meshRef.current.rotation.x = Math.sin(time * 0.1) * 0.3;
    }
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(time * 0.5) * 0.3;
    }
  });

  const geometry =
    type === "treatment" ? (
      <torusGeometry args={[1.5, 0.4, 16, 100]} />
    ) : type === "education" ? (
      <dodecahedronGeometry args={[1.8, 0]} />
    ) : (
      <octahedronGeometry args={[1.8, 0]} />
    );

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <mesh ref={meshRef}>
          {geometry}
          <meshStandardMaterial
            color={
              type === "treatment"
                ? 0xff6666
                : type === "education"
                ? 0x66ff66
                : 0xffff66
            }
            emissive={0x4444cc}
            emissiveIntensity={0.5}
            transparent
            opacity={0.6}
            wireframe
          />
        </mesh>
      </Float>
      <pointLight position={[3, 3, 3]} intensity={2} color={0x66ccff} />
      <pointLight position={[-3, -3, 3]} intensity={1.5} color={0x4444cc} />
      <Stars
        radius={50}
        depth={30}
        count={2000}
        factor={3}
        saturation={0.5}
        fade
      />
    </group>
  );
}

// Animated Card Component
function AnimatedCard({ children, index }) {
  const cardRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { y: 100, opacity: 0, rotationX: -30 },
      {
        y: 0,
        opacity: 1,
        rotationX: 0,
        duration: 0.8,
        delay: index * 0.3,
        ease: "power3.out",
      }
    );
  }, [index]);

  return (
    <div
      ref={cardRef}
      className="bg-black/30 backdrop-blur-md rounded-xl shadow-[0_0_15px_rgba(136,136,255,0.4)] p-6 mb-4 w-full max-w-md"
    >
      {children}
    </div>
  );
}

// Individual Banner Slide
function BannerSlide({ title, subtitle, stats, buttons, type }) {
  return (
    <div className="relative h-screen lg:max-w-[1600px] mx-auto flex flex-col lg:flex-row items-center justify-between p-4 sm:p-6 lg:p-8">
      {/* Vertically Stacked Cards Section */}
      <div className="relative z-20 w-full lg:w-1/2 flex flex-col items-center">
        <AnimatedCard index={0}>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
            {title}
          </h1>
          <p className="text-lg sm:text-xl text-purple-200 mb-6">{subtitle}</p>
        </AnimatedCard>
        <AnimatedCard index={1}>
          <div className="flex flex-col sm:flex-row gap-4">
            {buttons.map((btn, idx) => (
              <a
                key={idx}
                href={btn.link}
                className={`px-6 py-3 ${btn.bgColor} text-white font-semibold rounded-lg shadow-[0_0_10px_rgba(136,136,255,0.5)] hover:shadow-[0_0_15px_rgba(136,136,255,0.8)] transition-all duration-300 transform hover:scale-105 text-sm sm:text-base`}
              >
                {btn.text}
              </a>
            ))}
          </div>
        </AnimatedCard>
        <AnimatedCard index={2}>
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="bg-black/50 p-3 rounded-lg backdrop-blur-sm text-center"
              >
                <p className="text-xl font-bold text-yellow-400">
                  {stat.value}
                </p>
                <p className="text-sm text-purple-200">{stat.label}</p>
              </div>
            ))}
          </div>
        </AnimatedCard>
      </div>

      {/* Vector Animated Section */}
      <div className="relative z-20 w-full lg:w-1/2 h-64 lg:h-[80%] rounded-xl shadow-[0_0_20px_rgba(136,136,255,0.5)] overflow-hidden">
        <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
          <VectorScene type={type} />
        </Canvas>
      </div>
    </div>
  );
}

export default function AnimatedBanners() {
  const banners = [
    {
      id: 1,
      type: "treatment",
      title: (
        <>
          Be The Reason Someone <br />
          <span className="text-yellow-300">Breathes Another Day</span>
        </>
      ),
      subtitle:
        "Your support provides life-saving treatments to those in critical need.",
      buttons: [
        {
          text: "Donate for Treatment",
          link: "/donate",
          bgColor: "bg-yellow-500",
        },
        {
          text: "Volunteer as Medic",
          link: "/volunteer",
          bgColor: "bg-purple-400 text-purple-900",
        },
      ],
      stats: [
        { value: "10,000+", label: "Lives Saved" },
        { value: "24/7", label: "Emergency Care" },
        { value: "500+", label: "Medical Staff" },
        { value: "100%", label: "Direct to Care" },
      ],
    },
    {
      id: 2,
      type: "education",
      title: (
        <>
          Be The Reason A Child <br />
          <span className="text-yellow-300">Learns Another Day</span>
        </>
      ),
      subtitle:
        "Education transforms lives. Help us build schools and provide learning resources.",
      buttons: [
        { text: "Sponsor a Child", link: "/sponsor", bgColor: "bg-yellow-500" },
        {
          text: "Fund a School",
          link: "/build-school",
          bgColor: "bg-cyan-700 text-blue-900",
        },
      ],
      stats: [
        { value: "50+", label: "Schools Built" },
        { value: "5,000+", label: "Children Supported" },
        { value: "100%", label: "Donations to Education" },
        { value: "24", label: "Villages Reached" },
      ],
    },
    {
      id: 3,
      type: "employment",
      title: (
        <>
          Be The Reason Someone <br />
          <span className="text-yellow-300">Works Another Day</span>
        </>
      ),
      subtitle:
        "Empowering individuals with job skills and employment opportunities.",
      buttons: [
        {
          text: "Explore Programs",
          link: "/programs",
          bgColor: "bg-yellow-500",
        },
        {
          text: "Hire Graduates",
          link: "/employers",
          bgColor: "bg-red-400 text-purple-900",
        },
      ],
      stats: [
        { value: "85%", label: "Employment Rate" },
        { value: "2,000+", label: "People Trained" },
        { value: "200+", label: "Partner Companies" },
        { value: "Free", label: "Career Counseling" },
      ],
    },
  ];

  return (
    <div className="relative w-full h-screen">
      {/* Enhanced 3D Background */}
      <div className="absolute inset-0 z-0 opacity-20">
        <Canvas camera={{ position: [0, 0, 15], fov: 70 }}>
          <ambientLight intensity={0.4} color={0x66ccff} />
          <BackgroundPattern />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.5}
          />
        </Canvas>
      </div>

      {/* Swiper Slider */}
      <Swiper
        modules={[Autoplay, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        effect="fade"
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={true}
        className="w-full h-screen"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <BannerSlide {...banner} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
