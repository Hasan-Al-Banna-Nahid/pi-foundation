"use client";
import { useRef, useMemo, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Float, Text } from "@react-three/drei";
import * as THREE from "three";
import "swiper/css";
import "swiper/css/navigation";

function CampaignScene({ category, hexColor }) {
  const lightRef = useRef();
  const { camera } = useThree();

  // Map Tailwind classes to hex colors for particles
  const colorMap = {
    "from-amber-500": "#f59e0b",
    "from-emerald-500": "#10b981",
    "from-blue-500": "#3b82f6",
    "from-purple-500": "#8b5cf6",
    "from-indigo-500": "#4f46e5",
    "from-green-500": "#22c55e",
  };

  // Define category-specific icons
  const icons = useMemo(() => {
    const iconConfigs = {
      Food: {
        geometry: new THREE.ConeGeometry(0.2, 0.4, 8), // Fork-like shape
        material: new THREE.MeshStandardMaterial({
          color: "#f59e0b",
          emissive: "#f59e0b",
          emissiveIntensity: 0.5,
        }),
        position: [0, 0, 0],
      },
      Treatment: {
        geometry: new THREE.BoxGeometry(0.3, 0.05, 0.3), // Cross-like shape
        material: new THREE.MeshStandardMaterial({
          color: "#10b981",
          emissive: "#10b981",
          emissiveIntensity: 0.5,
        }),
        position: [-0.5, 0, 0.5],
      },
      Development: {
        geometry: new THREE.SphereGeometry(0.2, 16, 16), // Globe-like shape
        material: new THREE.MeshStandardMaterial({
          color: "#3b82f6",
          emissive: "#3b82f6",
          emissiveIntensity: 0.5,
        }),
        position: [0.5, 0, -0.5],
      },
      Education: {
        geometry: new THREE.BoxGeometry(0.3, 0.3, 0.05), // Book shape
        material: new THREE.MeshStandardMaterial({
          color: "#8b5cf6",
          emissive: "#8b5cf6",
          emissiveIntensity: 0.5,
        }),
        position: [-0.5, 0, -0.5],
      },
      Employment: {
        geometry: new THREE.CylinderGeometry(0.15, 0.15, 0.3, 16), // Briefcase-like
        material: new THREE.MeshStandardMaterial({
          color: "#4f46e5",
          emissive: "#4f46e5",
          emissiveIntensity: 0.5,
        }),
        position: [0.5, 0, 0.5],
      },
      Environment: {
        geometry: new THREE.SphereGeometry(0.2, 16, 16), // Leaf-like sphere
        material: new THREE.MeshStandardMaterial({
          color: "#22c55e",
          emissive: "#22c55e",
          emissiveIntensity: 0.5,
        }),
        position: [0, 0, 0],
      },
    };
    return [iconConfigs[category]];
  }, [category]);

  // Particle system for subtle background effect
  const particles = useMemo(() => {
    const particlesGeometry = new THREE.BufferGeometry();
    const count = 150;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    // Use hexColor or fallback to white
    const particleColor = hexColor
      ? new THREE.Color(hexColor)
      : new THREE.Color("#ffffff");

    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 4;
      colors[i] =
        i % 3 === 0
          ? particleColor.r
          : i % 3 === 1
          ? particleColor.g
          : particleColor.b;
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
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
    });

    return new THREE.Points(particlesGeometry, particlesMaterial);
  }, [hexColor]);

  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    lightRef.current.position.x = Math.sin(time) * 1.5;
    lightRef.current.position.z = Math.cos(time) * 1.5;
    particles.rotation.y += 0.002;
    camera.position.z = 2.5 + Math.sin(time * 0.3) * 0.2;
  });

  // Cleanup Three.js objects
  useEffect(() => {
    return () => {
      particles.geometry.dispose();
      particles.material.dispose();
      icons.forEach((icon) => {
        icon.geometry.dispose();
        icon.material.dispose();
      });
    };
  }, [particles, icons]);

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight
        ref={lightRef}
        position={[1.5, 1.5, 1.5]}
        intensity={2}
        color={icons[0].material.color}
        distance={6}
        decay={1.5}
      />
      <primitive object={particles} />
      {icons.map((icon, index) => (
        <Float
          key={index}
          speed={3}
          rotationIntensity={0.6}
          floatIntensity={1.2}
        >
          <mesh
            geometry={icon.geometry}
            material={icon.material}
            position={icon.position}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            scale={hovered ? 1.3 : 1}
          />
        </Float>
      ))}
      <Text
        fontSize={0.3}
        color="#ffffff"
        position={[0, 0.8, 0]}
        anchorX="center"
        anchorY="middle"
      >
        {category}
        <meshStandardMaterial
          emissive={icons[0].material.color}
          emissiveIntensity={1.8}
        />
      </Text>
    </>
  );
}

const campaigns = [
  {
    id: 1,
    title: "Be hungry no more & Leave no one behind",
    category: "Food",
    raised: 86210,
    goal: 60000,
    image: "/hungry.jpeg",
    color: "from-amber-500 to-amber-700",
  },
  {
    id: 2,
    title: "Medical Health for People in Acute Need",
    category: "Treatment",
    raised: 69628,
    goal: 60000,
    image: "/sick.jpeg",
    color: "from-emerald-500 to-emerald-700",
  },
  {
    id: 3,
    title: "Your Little Help Can Heal Their Hearts",
    category: "Development",
    raised: 40009,
    goal: 50000,
    image: "/heart.jpeg",
    color: "from-blue-500 to-blue-700",
  },
  {
    id: 4,
    title: "Education for Every Child",
    category: "Education",
    raised: 75000,
    goal: 100000,
    image: "/educ.jpeg",
    color: "from-purple-500 to-purple-700",
  },
  {
    id: 5,
    title: "Sustainable Employment Programs",
    category: "Employment",
    raised: 58000,
    goal: 80000,
    image: "/vt.jpeg",
    color: "from-indigo-500 to-indigo-700",
  },
  {
    id: 6,
    title: "Protect Our Planet",
    category: "Environment",
    raised: 32000,
    goal: 50000,
    image: "/pl.jpeg",
    color: "from-green-500 to-green-700",
  },
];

export default function CampaignSlider() {
  return (
    <div className="relative my-8 h-[600px] w-full overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center px-4 sm:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-white mb-8">
          Our Current Campaigns
        </h2>

        <Swiper
          modules={[Autoplay, Navigation]}
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2, spaceBetween: 15 },
            1024: { slidesPerView: 3, spaceBetween: 20 },
          }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          navigation
          loop={true}
          className="w-full max-w-6xl mx-auto"
        >
          {campaigns.map((campaign) => {
            const percentage = Math.min(
              Math.round((campaign.raised / campaign.goal) * 100),
              100
            );

            return (
              <SwiperSlide key={campaign.id}>
                <div
                  className={`relative bg-gradient-to-br ${campaign.color} p-2 rounded-2xl shadow-2xl h-[450px] transform perspective-1000 rotateX-5 rotateY-5 transition-transform duration-500 hover:rotateX-0 hover:rotateY-0 hover:scale-105 hover:shadow-3xl`}
                >
                  {/* 3D Background */}
                  <div className="absolute inset-0 z-0">
                    <Canvas camera={{ position: [0, 0, 2.5], fov: 45 }}>
                      <CampaignScene
                        category={campaign.category}
                        hexColor={campaign.color
                          .split(" ")[0]
                          .replace("from-", "#")} // Pass hex color
                      />
                      <OrbitControls
                        enableZoom={false}
                        enablePan={false}
                        autoRotate
                        autoRotateSpeed={0.4}
                      />
                    </Canvas>
                  </div>

                  {/* Card Content */}
                  <div className="relative h-full bg-white/20 backdrop-blur-md rounded-xl overflow-hidden border border-white/30">
                    {/* Image */}
                    <div className="absolute inset-0">
                      <img
                        src={campaign.image}
                        alt={campaign.title}
                        className="w-full h-full object-cover opacity-80"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                    </div>

                    {/* Content */}
                    <div className="relative h-full flex flex-col justify-end p-4">
                      <div className="bg-white/85 backdrop-blur-sm rounded-lg p-4 shadow-lg border-l-4 border-white/50">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              {campaign.category}
                            </span>
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mt-1 line-clamp-2">
                              {campaign.title}
                            </h3>
                          </div>
                          <div className="text-2xl font-bold text-gray-900">
                            {percentage}%
                          </div>
                        </div>

                        {/* Progress bar */}
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                          <div
                            className={`bg-gradient-to-r ${campaign.color} h-2 rounded-full transition-all duration-500`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                          <div className="text-xs text-gray-700">
                            <span className="font-bold">
                              Raised - ${campaign.raised.toLocaleString()}
                            </span>
                            <span className="mx-1">/</span>
                            <span>
                              Goal - ${campaign.goal.toLocaleString()}
                            </span>
                          </div>

                          <button
                            className={`px-4 py-1 bg-gradient-to-r ${campaign.color} text-white text-sm font-bold rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105`}
                          >
                            Donate Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
}
