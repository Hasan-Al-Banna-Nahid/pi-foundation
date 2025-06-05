"use client";
import { useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Stars, Float } from "@react-three/drei";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";
import "swiper/css";
import "swiper/css/effect-fade";
import { gsap } from "gsap";
import Image from "next/image";

// Rain Cloud Mesh Background Component
function RainCloudBackground() {
  const groupRef = useRef(null);
  const particlesRef = useRef(null);
  const count = 500; // Number of rain droplets

  useEffect(() => {
    if (!particlesRef.current) return;

    // Initialize particles in a net-like grid
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const velocities = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Arrange in a grid with slight randomness, resembling a fishing net
      const x = ((i % 10) - 5) * 2 + (Math.random() - 0.5) * 0.5;
      const y = Math.floor(i / 10) * 0.5 - 10 + (Math.random() - 0.5) * 0.5;
      const z = (Math.random() - 0.5) * 10;
      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;
      scales[i] = 0.05 + Math.random() * 0.05; // Vary droplet size
      velocities[i3 + 1] = -0.5 - Math.random() * 0.3; // Falling speed
    }

    particlesRef.current.geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    particlesRef.current.geometry.setAttribute(
      "scale",
      new THREE.BufferAttribute(scales, 1)
    );

    return () => {
      particlesRef.current.geometry.dispose();
    };
  }, []);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array;
      const velocities =
        particlesRef.current.geometry.attributes.position.array;

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        positions[i3 + 1] += velocities[i3 + 1] * 0.016; // Simulate falling
        // Reset droplets to top when they fall too far
        if (positions[i3 + 1] < -10) {
          positions[i3 + 1] += 20;
          positions[i3] = ((i % 10) - 5) * 2 + (Math.random() - 0.5) * 0.5;
          positions[i3 + 2] = (Math.random() - 0.5) * 10;
        }
        // Add slight sway for wind effect
        positions[i3] += Math.sin(time + i) * 0.01;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.05; // Gentle rotation
    }
  });

  return (
    <group ref={groupRef}>
      <points ref={particlesRef}>
        <bufferGeometry />
        <pointsMaterial
          size={0.1}
          sizeAttenuation={true}
          color={0x88aaff}
          transparent
          opacity={0.7}
          emissive={0x88aaff}
          emissiveIntensity={0.5}
        />
      </points>
    </group>
  );
}

// Cartoon SVG Scene
function CartoonSVGScene({ type }) {
  const groupRef = useRef(null);
  const svgRef = useRef(null);

  // Placeholder SVG path - replace with your actual SVG file path
  const svgPath = `/cartoon-${type}.svg`; // e.g., /public/cartoon-treatment.svg
  let svgData;
  try {
    svgData = useLoader(SVGLoader, svgPath);
  } catch (error) {
    console.error(`Failed to load SVG: ${svgPath}`, error);
  }

  useEffect(() => {
    if (!svgData || !svgRef.current) return;

    // Process SVG paths to create a texture
    const paths = svgData.paths;
    const shapes = paths.flatMap((path) =>
      path.toShapes(true).map((shape) => ({
        shape,
        color: path.color || new THREE.Color(0xffffff),
      }))
    );

    // Create a texture from SVG
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = 512;
    canvas.height = 512;
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);

    shapes.forEach(({ shape, color }) => {
      context.fillStyle = color.getStyle();
      context.beginPath();
      const path2D = new Path2D();
      shape.getPoints().forEach((point, i) => {
        if (i === 0) path2D.moveTo(point.x, point.y);
        else path2D.lineTo(point.x, point.y);
      });
      path2D.closePath();
      context.fill(path2D);
    });

    const texture = new THREE.CanvasTexture(canvas);
    svgRef.current.material.map = texture;
    svgRef.current.material.needsUpdate = true;

    return () => {
      texture.dispose();
      canvas.remove();
    };
  }, [svgData]);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(time * 0.5) * 0.2; // Bobbing
      groupRef.current.rotation.y = Math.sin(time * 0.3) * 0.1; // Gentle sway
    }
    if (svgRef.current) {
      svgRef.current.scale.setScalar(1 + Math.sin(time * 1.5) * 0.05); // Pulse effect
    }
  });

  const color =
    type === "treatment"
      ? 0xff6666
      : type === "education"
      ? 0x66ff66
      : 0xffff66;

  return (
    <group ref={groupRef}>
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
        <mesh ref={svgRef} position={[0, 0, 0]}>
          <planeGeometry args={[4, 4]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.7}
            transparent
            opacity={0.9}
            side={THREE.DoubleSide}
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
function AnimatedCard({ children, index, type }) {
  const cardRef = useRef(null);
  const gradientMap = {
    treatment: "from-red-600 via-purple-600 to-blue-700",
    education: "from-green-600 via-teal-500 to-blue-600",
    employment: "from-yellow-500 via-orange-600 to-red-600",
  };

  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { y: 100, opacity: 0, rotateX: -20 },
      {
        y: 0,
        opacity: 1,
        rotateX: 0,
        duration: 0.8,
        delay: index * 0.3,
        ease: "power3.out",
      }
    );
  }, [index]);

  return (
    <div
      ref={cardRef}
      className={`relative bg-gradient-to-br from-white/95 to-gray-200/85 backdrop-blur-2xl rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.2)] p-6 mb-4 w-full max-w-md transform transition-all duration-300 hover:shadow-[0_15px_40px_rgba(0,0,0,0.3)] hover:scale-105 border-l-4 border-gradient-to-r ${gradientMap[type]}`}
      style={{
        transform: `translateY(${index * -10}px) rotate(${index * 2}deg)`,
      }}
    >
      {children}
    </div>
  );
}

// Individual Banner Slide
function BannerSlide({ title, subtitle, stats, buttons, type }) {
  return (
    <div className="relative h-screen lg:max-w-[1600px] mx-auto flex flex-col lg:flex-row items-center justify-between p-4 sm:p-6 lg:p-8">
      {/* Stacked Cards Section */}
      <div className="relative z-20 w-full lg:w-1/2 flex flex-col items-center">
        <AnimatedCard index={0} type={type}>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 leading-tight font-[Inter,ui-sans-serif,system-ui]">
            {title}
          </h1>
          <p className="text-lg sm:text-xl text-gray-800 mb-6 font-[Inter,ui-sans-serif,system-ui] leading-relaxed">
            {subtitle}
          </p>
        </AnimatedCard>
        <AnimatedCard index={1} type={type}>
          <div className="flex flex-col sm:flex-row gap-4">
            {buttons.map((btn, idx) => (
              <a
                key={idx}
                href={btn.link}
                className={`px-6 py-3 ${btn.bgColor} text-white font-semibold rounded-lg shadow-[0_0_10px_rgba(0,0,0,0.2)] hover:shadow-[0_0_15px_rgba(0,0,0,0.3)] transition-all duration-300 transform hover:scale-105 text-sm sm:text-base`}
              >
                {btn.text}
              </a>
            ))}
          </div>
        </AnimatedCard>
        <AnimatedCard index={2} type={type}>
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-inner border border-gray-200/50"
              >
                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-600 font-[Inter,ui-sans-serif,system-ui]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </AnimatedCard>
      </div>

      {/* Cartoon SVG Animated Section */}
      <div className="relative z-20 w-full lg:w-1/2 h-64 lg:h-[80%] rounded-xl shadow-[0_0_20px_rgba(136,136,255,0.5)] overflow-hidden">
        <Image fill quality={100} src="/smi.jpg" />
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
          bgColor: "bg-gradient-to-r from-red-600 to-purple-700",
        },
        {
          text: "Volunteer as Medic",
          link: "/volunteer",
          bgColor: "bg-gradient-to-r from-purple-600 to-blue-700",
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
        {
          text: "Sponsor a Child",
          link: "/sponsor",
          bgColor: "bg-gradient-to-r from-green-600 to-blue-600",
        },
        {
          text: "Fund a School",
          link: "/build-school",
          bgColor: "bg-gradient-to-r from-teal-500 to-cyan-700",
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
          bgColor: "bg-gradient-to-r from-yellow-500 to-orange-600",
        },
        {
          text: "Hire Graduates",
          link: "/employers",
          bgColor: "bg-gradient-to-r from-orange-600 to-red-600",
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
      {/* Rain Cloud Mesh Background */}
      <div className="absolute inset-0 z-0 opacity-20">
        <Canvas camera={{ position: [0, 0, 15], fov: 70 }}>
          <ambientLight intensity={0.4} color={0x88aaff} />
          <RainCloudBackground />
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
        allowTouchMove={true}
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
