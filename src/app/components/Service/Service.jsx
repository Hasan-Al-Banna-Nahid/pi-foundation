"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useEffect, useRef } from "react";

function ParticleBackground() {
  const particlesRef = useRef();
  const count = 1000;

  useEffect(() => {
    const particles = particlesRef.current;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

      // Soft pastel colors
      colors[i * 3] = 0.5 + Math.random() * 0.5;
      colors[i * 3 + 1] = 0.5 + Math.random() * 0.5;
      colors[i * 3 + 2] = 0.5 + Math.random() * 0.5;
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
    particlesRef.current.rotation.x += delta * 0.05;
    particlesRef.current.rotation.y += delta * 0.03;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry attach="geometry" />
      <pointsMaterial
        attach="material"
        size={0.1}
        sizeAttenuation={true}
        vertexColors
        transparent
        opacity={0.6}
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
      className={`relative bg-white rounded-xl shadow-2xl overflow-hidden border-t-8 border-l-8 ${
        theme === "treatment"
          ? "border-green-500"
          : theme === "education"
          ? "border-blue-500"
          : "border-purple-500"
      }`}
    >
      <div className="p-8">
        <div className="text-4xl mb-4">{iconMap[theme]}</div>
        <h3 className="text-2xl font-bold text-gray-800 mb-3">{title}</h3>
        <p className="text-gray-600 mb-6">{description}</p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
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
        // { value: "10K+", label: "Patients Treated" },
        // { value: "24/7", label: "Care Available" },
      ],
      buttonText: "Support Healthcare",
    },
    {
      theme: "education",
      title: "Quality Education",
      description:
        "Building schools and providing learning resources to underserved communities worldwide.",
      stats: [
        // { value: "50+", label: "Schools Built" },
        // { value: "5K+", label: "Children Helped" },
      ],
      buttonText: "Fund Education",
    },
    {
      theme: "unemployment",
      title: "Job Opportunities",
      description:
        "Empowering individuals with vocational training and employment placement services.",
      stats: [
        // { value: "85%", label: "Employment Rate" },
        // { value: "2K+", label: "People Trained" },
      ],
      buttonText: "Create Jobs",
    },
  ];

  return (
    <div className="relative min-h-screen bg-gray-50 overflow-hidden">
      {/* Three.js Background */}
      <div className="absolute inset-0 z-0 opacity-20">
        <Canvas>
          <ambientLight intensity={0.5} />
          <ParticleBackground />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableRotate={false}
          />
        </Canvas>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
            We Do It For All People
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Humanist Services dedicated to creating positive change through
            compassion and action.
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>

        {/* Testimonial Section */}
        {/* <div className="mt-24 bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
          <blockquote className="text-center">
            <p className="text-xl italic text-gray-700 mb-4">
              "The support we received transformed our community. Children now
              have access to education, families have healthcare, and adults
              have meaningful employment."
            </p>
            <footer className="text-gray-600">
              — Maria G., Community Leader
            </footer>
          </blockquote>
        </div> */}
        <div className="mt-24 bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
          <blockquote className="text-center">
            <p className="text-xl italic text-gray-700 mb-4">
              "Togethers We Can Make Changes"
            </p>
            <footer className="text-gray-600">
              — Hasan Al Banna Nahid. Founder,Pi Foundation.
            </footer>
          </blockquote>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Join Us in Making a Difference
          </h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-4 rounded-lg font-bold hover:opacity-90 transition-all transform hover:scale-105 shadow-lg">
              Become a Volunteer
            </button>
            <button className="bg-gradient-to-r from-purple-500 to-red-500 text-white px-8 py-4 rounded-lg font-bold hover:opacity-90 transition-all transform hover:scale-105 shadow-lg">
              Make a Donation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
