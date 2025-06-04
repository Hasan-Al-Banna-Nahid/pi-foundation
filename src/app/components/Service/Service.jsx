"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useEffect, useRef } from "react";

function ParticleBackground() {
  const particlesRef = useRef();
  const count = 1000;
  const mouse = useRef({ x: 0, y: 0 });
  const velocities = useRef(new Float32Array(count * 3));
  const originalPositions = useRef(new Float32Array(count * 3));

  useEffect(() => {
    const particles = particlesRef.current;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
      originalPositions.current[i * 3] = positions[i * 3];
      originalPositions.current[i * 3 + 1] = positions[i * 3 + 1];
      originalPositions.current[i * 3 + 2] = positions[i * 3 + 2];

      // Soft pastel colors with a golden tint
      colors[i * 3] = 0.8 + Math.random() * 0.2; // R
      colors[i * 3 + 1] = 0.6 + Math.random() * 0.2; // G
      colors[i * 3 + 2] = 0.4; // B
    }

    particles.geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    particles.geometry.setAttribute(
      "color",
      new THREE.BufferAttribute(colors, 3)
    );

    // Mouse move handler for touch effect
    const onMouseMove = (event) => {
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  useFrame((state, delta) => {
    const particles = particlesRef.current;
    const positions = particles.geometry.attributes.position.array;

    // Spring-like motion and touch effect
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const x = positions[i3];
      const y = positions[i3 + 1];
      const z = positions[i3 + 2];

      // Spring force towards original position
      const k = 0.1; // Spring constant
      const damping = 0.9; // Damping factor
      const ox = originalPositions.current[i3];
      const oy = originalPositions.current[i3 + 1];
      const oz = originalPositions.current[i3 + 2];

      const ax = -k * (x - ox);
      const ay = -k * (y - oy);
      const az = -k * (z - oz);

      velocities.current[i3] += ax * delta;
      velocities.current[i3 + 1] += ay * delta;
      velocities.current[i3 + 2] += az * delta;

      velocities.current[i3] *= damping;
      velocities.current[i3 + 1] *= damping;
      velocities.current[i3 + 2] *= damping;

      // Touch effect: displace particles near mouse
      const mouseWorld = new THREE.Vector3(
        mouse.current.x * 10,
        mouse.current.y * 10,
        0
      );
      const distance = Math.sqrt(
        (x - mouseWorld.x) ** 2 + (y - mouseWorld.y) ** 2 + z ** 2
      );
      if (distance < 2) {
        const force = (2 - distance) * 0.5;
        velocities.current[i3] += force * (x - mouseWorld.x) * delta;
        velocities.current[i3 + 1] += force * (y - mouseWorld.y) * delta;
      }

      positions[i3] += velocities.current[i3] * delta;
      positions[i3 + 1] += velocities.current[i3 + 1] * delta;
      positions[i3 + 2] += velocities.current[i3 + 2] * delta;
    }

    particles.geometry.attributes.position.needsUpdate = true;
    particles.rotation.y += delta * 0.03;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry attach="geometry" />
      <pointsMaterial
        attach="material"
        size={0.08}
        sizeAttenuation={true}
        vertexColors
        transparent
        opacity={0.7}
      />
    </points>
  );
}

function ServiceCard({ theme, title, description, stats, buttonText }) {
  const gradientMap = {
    treatment: "from-green-500 to-blue-500",
    education: "from-blue-500 to-purple-500",
    unemployment: "from-purple-500 to-red-500",
  };

  const iconMap = {
    treatment: "🩺",
    education: "📚",
    unemployment: "💼",
  };

  return (
    <div
      className={`relative bg-white rounded-xl shadow-2xl overflow-hidden border-l-[6px] border-gold-400 transform transition-all duration-300 hover:scale-105 hover:shadow-xl`}
    >
      <div className="p-6 sm:p-8">
        <div className="text-3xl sm:text-4xl mb-4">{iconMap[theme]}</div>
        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">
          {title}
        </h3>
        <p className="text-gray-600 text-sm sm:text-base mb-6">{description}</p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-gray-50 p-3 rounded-lg">
              <p className="text-lg sm:text-xl font-bold text-gray-800">
                {stat.value}
              </p>
              <p className="text-xs sm:text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        <button
          className={`bg-gradient-to-r ${gradientMap[theme]} text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-all transform hover:scale-105 shadow-md w-full`}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}

export default function HumanistServices() {
  const services = [
    {
      theme: "treatment",
      title: "Medical Treatment",
      description:
        "Providing life-saving treatments to those in critical need with our network of healthcare professionals.",
      stats: [
        { value: "10K+", label: "Patients Treated" },
        { value: "24/7", label: "Care Available" },
      ],
      buttonText: "Support Healthcare",
    },
    {
      theme: "education",
      title: "Quality Education",
      description:
        "Building schools and providing learning resources to underserved communities worldwide.",
      stats: [
        { value: "50+", label: "Schools Built" },
        { value: "5K+", label: "Children Helped" },
      ],
      buttonText: "Fund Education",
    },
    {
      theme: "unemployment",
      title: "Job Opportunities",
      description:
        "Empowering individuals with vocational training and employment placement services.",
      stats: [
        { value: "85%", label: "Employment Rate" },
        { value: "2K+", label: "People Trained" },
      ],
      buttonText: "Create Jobs",
    },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 overflow-hidden">
      {/* Three.js Background */}
      <div className="absolute inset-0 z-0 opacity-30">
        <Canvas>
          <ambientLight intensity={0.6} />
          <pointLight position={[10, 10, 10]} intensity={1.5} />
          <ParticleBackground />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableRotate={false}
          />
        </Canvas>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4 tracking-tight">
            We Do It For All People
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Humanist Services is dedicated to creating positive change through
            compassion, action, and community empowerment.
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>

        {/* Testimonial Section */}
        <div className="mt-16 sm:mt-24 bg-white/95 backdrop-blur-md rounded-xl shadow-xl p-6 sm:p-8 max-w-3xl sm:max-w-4xl mx-auto">
          <blockquote className="text-center">
            <p className="text-lg sm:text-xl italic text-gray-700 mb-4 font-medium">
              "Together We Can Make Changes"
            </p>
            <footer className="text-gray-600 text-sm sm:text-base">
              — Hasan Al Banna Nahid, Founder, Pi Foundation
            </footer>
          </blockquote>
        </div>

        {/* CTA Section */}
        <div className="mt-12 sm:mt-16 text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-6 tracking-tight">
            Join Us in Making a Difference
          </h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
            <button className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold hover:opacity-90 transition-all transform hover:scale-105 shadow-lg">
              Become a Volunteer
            </button>
            <button className="bg-gradient-to-r from-purple-500 to-red-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold hover:opacity-90 transition-all transform hover:scale-105 shadow-lg">
              Make a Donation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
