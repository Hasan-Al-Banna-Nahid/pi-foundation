"use client";
import { useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import "swiper/css";
import "swiper/css/effect-fade";

// Three.js Floating Particles Component
function FloatingParticles() {
  const particlesRef = useRef();
  const count = 500;

  useEffect(() => {
    const particles = particlesRef.current;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

      colors[i * 3] = Math.random();
      colors[i * 3 + 1] = Math.random();
      colors[i * 3 + 2] = Math.random();
    }

    particles.geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    particles.geometry.setAttribute(
      "color",
      new THREE.BufferAttribute(colors, 3)
    );
  }, []);

  useFrame((state, delta) => {
    particlesRef.current.rotation.x += delta * 0.1;
    particlesRef.current.rotation.y += delta * 0.05;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry attach="geometry" />
      <pointsMaterial
        attach="material"
        size={0.05}
        sizeAttenuation={true}
        vertexColors
        transparent
        opacity={0.8}
      />
    </points>
  );
}

// Individual Banner Component
function BannerSlide({ bgImage, themeColor, title, subtitle, stats, buttons }) {
  return (
    <div className="relative h-screen lg:max-w-[1600px] mx-auto p-4 rounded-lg">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={bgImage}
          alt="Banner background"
          className="w-full h-full object-cover"
        />
        <div
          className={`absolute inset-0 bg-gradient-to-r ${themeColor} opacity-80`}
        ></div>
      </div>

      {/* Three.js Canvas */}
      <div className="absolute inset-0 z-10 opacity-30">
        <Canvas>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <FloatingParticles />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableRotate={false}
          />
        </Canvas>
      </div>

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
          {title}
        </h1>

        <p className="text-xl sm:text-2xl text-white max-w-3xl mb-8">
          {subtitle}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          {buttons.map((btn, index) => (
            <a
              key={index}
              href={btn.link}
              className={`px-6 py-3 ${btn.bgColor} hover:opacity-90 text-white font-bold rounded-lg transition-all duration-300 shadow-lg transform hover:scale-105 text-sm sm:text-base`}
            >
              {btn.text}
            </a>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-black/40 p-4 rounded-lg backdrop-blur-sm"
            >
              <p className="text-2xl font-bold text-yellow-400">{stat.value}</p>
              <p className="text-sm text-white">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AnimatedBanners() {
  const banners = [
    {
      id: 1,
      bgImage: "/treatment.jpeg",
      themeColor: "from-green-900/70 to-blue-900/70",
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
          bgColor: "bg-purple-400 text-green-900",
        },
      ],
      stats: [
        // { value: "10,000+", label: "Lives Saved" },
        // { value: "24/7", label: "Emergency Care" },
        // { value: "500+", label: "Medical Staff" },
        // { value: "100%", label: "Direct to Care" },
      ],
    },
    {
      id: 2,
      bgImage: "/edu.jpg",
      themeColor: "from-blue-900/70 to-purple-900/70",
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
        // { value: "50+", label: "Schools Built" },
        // { value: "5,000+", label: "Children Supported" },
        // { value: "100%", label: "Donations to Education" },
        // { value: "24", label: "Villages Reached" },
      ],
    },
    {
      id: 3,
      bgImage: "/unem.avif",
      themeColor: "from-purple-900/70 to-red-900/70",
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
        // { value: "85%", label: "Employment Rate" },
        // { value: "2,000+", label: "People Trained" },
        // { value: "200+", label: "Partner Companies" },
        // { value: "Free", label: "Career Counseling" },
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
