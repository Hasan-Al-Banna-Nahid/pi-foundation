"use client";
import { useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Float } from "@react-three/drei";
import * as THREE from "three";
import Image from "next/image";
import "swiper/css";
import "swiper/css/effect-fade";

function SceneAnimation({ meshRef, netRef, handRef }) {
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.x = time * 0.1;
      meshRef.current.rotation.y = time * 0.05;
    }
    if (netRef.current) {
      netRef.current.rotation.z = time * 0.03;
    }
    if (handRef.current) {
      handRef.current.position.y = Math.sin(time) * 0.5;
      handRef.current.rotation.y = time * 0.02;
    }
  });
  return null;
}

function ThreeScene() {
  const meshRef = useRef(null);
  const netRef = useRef(null);
  const handRef = useRef(null);

  useEffect(() => {
    if (!netRef.current) {
      const netGeometry = new THREE.BufferGeometry();
      const size = 5;
      const divisions = 10;
      const vertices = [];

      for (let i = 0; i <= divisions; i++) {
        const x = (i / divisions) * size - size / 2;
        vertices.push(x, -size / 2, 0, x, size / 2, 0);
      }
      for (let i = 0; i <= divisions; i++) {
        const y = (i / divisions) * size - size / 2;
        vertices.push(-size / 2, y, 0, size / 2, y, 0);
      }

      netGeometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(vertices, 3)
      );

      const netMaterial = new THREE.LineBasicMaterial({
        color: 0x8888ff,
        transparent: true,
        opacity: 0.4,
      });

      const lineSegments = new THREE.LineSegments(netGeometry, netMaterial);
      netRef.current = lineSegments;
    }

    return () => {
      if (netRef.current) {
        netRef.current.geometry.dispose();
        netRef.current.material.dispose();
      }
    };
  }, []);

  return (
    <>
      <SceneAnimation meshRef={meshRef} netRef={netRef} handRef={handRef} />
      <ambientLight intensity={0.6} color={0x4444ff} />
      <pointLight position={[5, 5, 5]} intensity={1.5} color={0x8888ff} />
      <pointLight position={[-5, -5, 5]} intensity={1.5} color={0x4444cc} />
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
      />

      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[2, 1]} />
          <meshStandardMaterial
            color={0x8888ff}
            emissive={0x4444cc}
            emissiveIntensity={0.4}
            wireframe
            transparent
            opacity={0.3}
          />
        </mesh>
      </Float>

      {netRef.current && (
        <primitive object={netRef.current} position={[0, 0, -1]} />
      )}

      <Float speed={1} rotationIntensity={0.3} floatIntensity={0.5}>
        <mesh ref={handRef} position={[2, 0, 0]}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial
            color={0xaaaaaa}
            emissive={0x8888ff}
            emissiveIntensity={0.5}
            transparent
            opacity={0.7}
          />
          <mesh position={[0, 0.5, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.5, 8]} />
            <meshStandardMaterial
              color={0xaaaaaa}
              emissive={0x8888ff}
              emissiveIntensity={0.5}
              transparent
              opacity={0.7}
            />
          </mesh>
        </mesh>
      </Float>
    </>
  );
}

function BannerSlide({ image, themeColor, title, subtitle, stats, buttons }) {
  return (
    <div className="relative h-screen lg:max-w-[1600px] mx-auto flex flex-col lg:flex-row items-center justify-between p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-purple-900 to-blue-950">
      {/* 3D Canvas Background */}
      <div className="absolute inset-0 z-0 opacity-20">
        <Canvas camera={{ position: [0, 0, 15], fov: 70 }}>
          <ThreeScene />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableRotate={false}
          />
        </Canvas>
      </div>

      {/* Content Section */}
      <div className="relative z-10 w-full lg:w-1/2 p-6 sm:p-8 lg:p-12 bg-black/20 backdrop-blur-md rounded-xl shadow-[0_0_20px_rgba(136,136,255,0.5)] hover:shadow-[0_0_30px_rgba(136,136,255,0.7)] transition-all duration-300">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
          {title}
        </h1>
        <p className="text-lg sm:text-xl text-purple-200 max-w-md mb-6">
          {subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {buttons.map((btn, index) => (
            <a
              key={index}
              href={btn.link}
              className={`px-6 py-3 ${btn.bgColor} text-white font-semibold rounded-lg shadow-[0_0_10px_rgba(136,136,255,0.5)] hover:shadow-[0_0_15px_rgba(136,136,255,0.8)] transition-all duration-300 transform hover:scale-105 text-sm sm:text-base`}
            >
              {btn.text}
            </a>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4 max-w-md">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-black/50 p-3 rounded-lg backdrop-blur-sm text-center"
            >
              <p className="text-xl font-bold text-yellow-400">{stat.value}</p>
              <p className="text-sm text-purple-200">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Image Section */}
      <div className="relative z-10 w-full lg:w-1/2 h-64 lg:h-full overflow-hidden rounded-xl shadow-[0_0_20px_rgba(136,136,255,0.5)] hover:shadow-[0_0_30px_rgba(136,136,255,0.7)] transition-all duration-300">
        <Image
          src={image}
          alt="Banner image"
          fill
          className="object-cover transform hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = "/fallback-bg.jpg";
          }}
        />
      </div>
    </div>
  );
}

export default function AnimatedBanners() {
  const banners = [
    {
      id: 1,
      image: "/treatment.jpeg",
      themeColor: "from-purple-900 to-blue-950",
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
      image: "/edu.jpg",
      themeColor: "from-purple-900 to-blue-950",
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
      image: "/unem.avif",
      themeColor: "from-purple-900 to-blue-950",
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
  );
}
