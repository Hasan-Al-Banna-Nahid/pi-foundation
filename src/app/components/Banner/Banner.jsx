"use client";
import { useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";
import * as THREE from "three";
import Image from "next/image";
import { useSpring, animated } from "@react-spring/web";
import "swiper/css";
import "swiper/css/effect-fade";

function FloatingParticles() {
  const particlesRef = useRef();
  const torusRef = useRef();
  const count = 200;
  const mouse = useRef({ x: 0, y: 0 });
  const velocities = useRef(new Float32Array(count * 3));
  const originalPositions = useRef(new Float32Array(count * 3));

  useEffect(() => {
    // Initialize particles
    const particles = particlesRef.current;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12;
      originalPositions.current[i * 3] = positions[i * 3];
      originalPositions.current[i * 3 + 1] = positions[i * 3 + 1];
      originalPositions.current[i * 3 + 2] = positions[i * 3 + 2];

      // Golden pastel colors
      colors[i * 3] = 0.9 + Math.random() * 0.1;
      colors[i * 3 + 1] = 0.7 + Math.random() * 0.2;
      colors[i * 3 + 2] = 0.4;
    }

    particles.geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    particles.geometry.setAttribute(
      "color",
      new THREE.BufferAttribute(colors, 3)
    );

    // Mouse and touch handlers
    const onMouseMove = (event) => {
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    const onTouchMove = (event) => {
      const touch = event.touches[0];
      mouse.current.x = (touch.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(touch.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, []);

  useFrame((state, delta) => {
    const particles = particlesRef.current;
    const positions = particles.geometry.attributes.position.array;
    const time = state.clock.getElapsedTime();

    // Particle motion and touch effect
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const x = positions[i3];
      const y = positions[i3 + 1];
      const z = positions[i3 + 2];

      // Spring force with wave-like motion
      const k = 0.1;
      const damping = 0.9;
      const ox = originalPositions.current[i3];
      const oy = originalPositions.current[i3 + 1];
      const oz = originalPositions.current[i3 + 2];

      const ax = -k * (x - ox);
      const ay = -k * (y - oy) + Math.sin(time + i) * 0.015;
      const az = -k * (z - oz);

      velocities.current[i3] += ax * delta;
      velocities.current[i3 + 1] += ay * delta;
      velocities.current[i3 + 2] += az * delta;

      velocities.current[i3] *= damping;
      velocities.current[i3 + 1] *= damping;
      velocities.current[i3 + 2] *= damping;

      // Touch effect with glow
      const mouseWorld = new THREE.Vector3(
        mouse.current.x * 6,
        mouse.current.y * 6,
        0
      );
      const distance = Math.sqrt(
        (x - mouseWorld.x) ** 2 + (y - mouseWorld.y) ** 2 + z ** 2
      );
      if (distance < 1) {
        const force = (1 - distance) * 0.2;
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
      <ambientLight intensity={0.8} />
      <pointLight position={[10, 10, 10]} intensity={2} />
      <group>
        <points ref={particlesRef}>
          <bufferGeometry attach="geometry" />
          <pointsMaterial
            attach="material"
            size={0.03}
            sizeAttenuation={true}
            vertexColors
            transparent
            opacity={0.9}
          />
        </points>
        <Float speed={1} rotationIntensity={0.3} floatIntensity={0.3}>
          <mesh ref={torusRef}>
            <torusKnotGeometry args={[1.5, 0.3, 100, 16]} />
            <meshStandardMaterial
              color="#FFD700"
              emissive="#FFD700"
              emissiveIntensity={0.4}
              transparent
              opacity={0.2}
              wireframe
            />
          </mesh>
        </Float>
      </group>
    </>
  );
}

function BannerSlide({ bgImage, themeColor, title, subtitle, stats, buttons }) {
  const titleProps = useSpring({
    from: { opacity: 0, y: 60, scale: 0.95 },
    to: { opacity: 1, y: 0, scale: 1 },
    config: { mass: 1, tension: 140, friction: 16 },
  });

  const subtitleProps = useSpring({
    from: { opacity: 0, y: 60, scale: 0.95 },
    to: { opacity: 1, y: 0, scale: 1 },
    config: { mass: 1, tension: 140, friction: 16 },
    delay: 200,
  });

  const buttonsProps = useSpring({
    from: { opacity: 0, y: 60, scale: 0.95 },
    to: { opacity: 1, y: 0, scale: 1 },
    config: { mass: 1, tension: 140, friction: 16 },
    delay: 400,
  });

  const statsProps = useSpring({
    from: { opacity: 0, y: 60, scale: 0.95 },
    to: { opacity: 1, y: 0, scale: 1 },
    config: { mass: 1, tension: 140, friction: 16 },
    delay: 600,
  });

  return (
    <div className="relative h-screen max-w-[1600px] mx-auto rounded-lg overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={bgImage}
          alt="Banner background"
          fill
          className="object-cover"
          quality={100}
          priority
          onError={(e) => {
            e.target.src = "/fallback-bg.jpg"; // Fallback image
          }}
        />
        <div
          className={`absolute inset-0 bg-gradient-to-r ${themeColor} opacity-60`}
        ></div>
      </div>

      {/* Background Patterns */}
      <div className="absolute inset-0 z-5 opacity-15 bg-[url('/dagger-map-pattern.png')] bg-cover"></div>
      <div className="absolute inset-0 z-5 opacity-10 bg-[url('/wave-pattern.png')] bg-repeat"></div>

      {/* Three.js Canvas */}
      <div className="absolute inset-0 z-10 opacity-20">
        <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
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
        <div className="bg-black/20 backdrop-blur-md rounded-xl p-4 sm:p-6 max-w-3xl mx-auto">
          <animated.h1
            style={titleProps}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-4 font-serif leading-tight"
            style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}
          >
            {title}
          </animated.h1>

          <animated.p
            style={subtitleProps}
            className="text-base sm:text-lg lg:text-xl text-white max-w-2xl mb-6 font-sans"
            style={{ textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}
          >
            {subtitle}
          </animated.p>

          <animated.div
            style={buttonsProps}
            className="flex flex-col sm:flex-row gap-3 mb-8"
          >
            {buttons.map((btn, index) => (
              <a
                key={index}
                href={btn.link}
                className="bg-gradient-to-r from-purple-500 to-blue-900 px-6 sm:px-8 py-3 text-white font-bold rounded-full text-sm sm:text-base hover:opacity-90 transition-all duration-300 shadow-lg transform hover:scale-105 ring-2 ring-gold-300/50 hover:ring-gold-400/70 animate-glow font-sans flex items-center justify-center gap-2"
              >
                {btn.text}
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </a>
            ))}
          </animated.div>

          {/* Stats */}
          <animated.div
            style={statsProps}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-center max-w-3xl mx-auto"
          >
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white/15 backdrop-blur-lg p-3 rounded-lg border-l-2 border-gold-400 animate-glow"
              >
                <p className="text-lg sm:text-xl font-bold text-yellow-300 font-serif">
                  {stat.value}
                </p>
                <p className="text-xs sm:text-sm text-white font-sans">
                  {stat.label}
                </p>
              </div>
            ))}
          </animated.div>
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
        { text: "Donate for Treatment", link: "/donate" },
        { text: "Volunteer as Medic", link: "/volunteer" },
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
        { text: "Sponsor a Child", link: "/sponsor" },
        { text: "Fund a School", link: "/build-school" },
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
        { text: "Explore Programs", link: "/programs" },
        { text: "Hire Graduates", link: "/employers" },
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
      fadeEffect={{ crossFade: true }}
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
