"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";
import * as THREE from "three";
import { useEffect, useRef } from "react";
import { useSpring, animated } from "@react-spring/web";

function ParticleBackground({ cardPositions }) {
  const particlesRef = useRef();
  const cloudsRef = useRef();
  const torusRef = useRef();
  const heartsRef = useRef();
  const count = 200;
  const cloudCount = 6;
  const heartCount = 10; // Hearts per card
  const mouse = useRef({ x: 0, y: 0 });
  const velocities = useRef(new Float32Array(count * 3));
  const originalPositions = useRef(new Float32Array(count * 3));

  useEffect(() => {
    // Initialize background particles
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

    // Initialize clouds
    const cloudGeometry = new THREE.SphereGeometry(0.6, 24, 24);
    const cloudMaterial = new THREE.MeshStandardMaterial({
      color: "#ffffff",
      transparent: true,
      opacity: 0.25,
      roughness: 0.9,
    });
    for (let i = 0; i < cloudCount; i++) {
      const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
      cloud.position.set(
        (Math.random() - 0.5) * 15,
        2 + Math.random() * 3,
        (Math.random() - 0.5) * 15
      );
      cloud.scale.setScalar(0.5 + Math.random() * 0.5);
      cloudsRef.current.add(cloud);
    }

    // Initialize hearts around cards
    const heartGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    const heartMaterial = new THREE.MeshStandardMaterial({
      color: "#FFD700",
      emissive: "#FFD700",
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.7,
    });
    const heartMesh = new THREE.InstancedMesh(
      heartGeometry,
      heartMaterial,
      heartCount * cardPositions.length
    );
    for (let i = 0; i < cardPositions.length; i++) {
      for (let j = 0; j < heartCount; j++) {
        const index = i * heartCount + j;
        const matrix = new THREE.Matrix4();
        const angle = (j / heartCount) * Math.PI * 2;
        const radius = 1.5;
        matrix.setPosition(
          cardPositions[i].x + Math.cos(angle) * radius,
          cardPositions[i].y + Math.sin(angle) * radius,
          cardPositions[i].z
        );
        heartMesh.setMatrixAt(index, matrix);
      }
    }
    heartsRef.current.add(heartMesh);

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
      cloudGeometry.dispose();
      cloudMaterial.dispose();
      heartGeometry.dispose();
      heartMaterial.dispose();
    };
  }, [cardPositions]);

  useFrame((state, delta) => {
    const particles = particlesRef.current;
    const positions = particles.geometry.attributes.position.array;

    // Particle motion and touch effect
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const x = positions[i3];
      const y = positions[i3 + 1];
      const z = positions[i3 + 2];

      // Spring force with wave-like motion
      const k = 0.08;
      const damping = 0.92;
      const ox = originalPositions.current[i3];
      const oy = originalPositions.current[i3 + 1];
      const oz = originalPositions.current[i3 + 2];

      const ax = -k * (x - ox);
      const ay =
        -k * (y - oy) + Math.sin(state.clock.getElapsedTime() + i) * 0.02;
      const az = -k * (z - oz);

      velocities.current[i3] += ax * delta;
      velocities.current[i3 + 1] += ay * delta;
      velocities.current[i3 + 2] += az * delta;

      velocities.current[i3] *= damping;
      velocities.current[i3 + 1] *= damping;
      velocities.current[i3 + 2] *= damping;

      // Touch effect with glow
      const mouseWorld = new THREE.Vector3(
        mouse.current.x * 10,
        mouse.current.y * 10,
        0
      );
      const distance = Math.sqrt(
        (x - mouseWorld.x) ** 2 + (y - mouseWorld.y) ** 2 + z ** 2
      );
      if (distance < 2) {
        const force = (2 - distance) * 0.4;
        velocities.current[i3] += force * (x - mouseWorld.x) * delta;
        velocities.current[i3 + 1] += force * (y - mouseWorld.y) * delta;
      }

      positions[i3] += velocities.current[i3] * delta;
      positions[i3 + 1] += velocities.current[i3 + 1] * delta;
      positions[i3 + 2] += velocities.current[i3 + 2] * delta;
    }

    particles.geometry.attributes.position.needsUpdate = true;
    particles.rotation.y += delta * 0.02;

    // Animate clouds
    cloudsRef.current.children.forEach((cloud, i) => {
      cloud.position.x += Math.sin(state.clock.getElapsedTime() + i) * 0.01;
      cloud.position.z += Math.cos(state.clock.getElapsedTime() + i) * 0.01;
    });

    // Animate hearts around cards
    const time = state.clock.getElapsedTime();
    for (let i = 0; i < cardPositions.length; i++) {
      for (let j = 0; j < heartCount; j++) {
        const index = i * heartCount + j;
        const angle = (j / heartCount) * Math.PI * 2 + time * 0.5;
        const radius = 1.5 + Math.sin(time + j) * 0.2;
        const matrix = new THREE.Matrix4();
        matrix.setPosition(
          cardPositions[i].x + Math.cos(angle) * radius,
          cardPositions[i].y + Math.sin(angle) * radius,
          cardPositions[i].z + Math.sin(time + j) * 0.5
        );
        heartsRef.current.children[0].setMatrixAt(index, matrix);
      }
    }
    heartsRef.current.children[0].instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <ambientLight intensity={0.7} />
      <pointLight position={[10, 10, 10]} intensity={1.8} />
      <group>
        <points ref={particlesRef}>
          <bufferGeometry attach="geometry" />
          <pointsMaterial
            attach="material"
            size={0.05}
            sizeAttenuation={true}
            vertexColors
            transparent
            opacity={0.85}
          />
        </points>
        <group ref={cloudsRef} />
        <group ref={heartsRef} />
        <Float speed={1} rotationIntensity={0.4} floatIntensity={0.4}>
          <mesh ref={torusRef}>
            <torusKnotGeometry args={[2, 0.4, 100, 16]} />
            <meshStandardMaterial
              color="#FFD700"
              emissive="#FFD700"
              emissiveIntensity={0.3}
              transparent
              opacity={0.15}
              wireframe
            />
          </mesh>
        </Float>
      </group>
    </>
  );
}

function ServiceCard({ theme, title, description, stats, buttonText, index }) {
  const gradientMap = {
    treatment: "from-purple-500 to-blue-900",
    education: "from-purple-500 to-blue-900",
    unemployment: "from-purple-500 to-blue-900",
  };

  const iconMap = {
    treatment: "🩺",
    education: "📚",
    unemployment: "💼",
  };

  const cardProps = useSpring({
    from: { y: 40, opacity: 0, scale: 0.9 },
    to: { y: 0, opacity: 1, scale: 1 },
    config: { mass: 1, tension: 160, friction: 18 },
    delay: index * 200,
  });

  return (
    <animated.div
      style={cardProps}
      className="relative bg-white/95 backdrop-blur-lg rounded-2xl shadow-lg overflow-hidden border-l-[6px] border-gold-400 ring-2 ring-gold-300/50 hover:ring-gold-400/70 transition-all duration-300 hover:scale-105 hover:shadow-2xl animate-glow"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-gold-100/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
      <div className="relative p-5 sm:p-6">
        <div className="text-4xl sm:text-5xl mb-4">{iconMap[theme]}</div>
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 font-serif">
          {title}
        </h3>
        <p className="text-gray-700 text-sm sm:text-base mb-6 font-sans line-clamp-3">
          {description}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-gray-100/90 backdrop-blur-sm p-3 rounded-lg"
            >
              <p className="text-base sm:text-lg font-bold text-gray-900">
                {stat.value}
              </p>
              <p className="text-xs text-gray-600 font-sans">{stat.label}</p>
            </div>
          ))}
        </div>

        <button
          className={`bg-gradient-to-r ${gradientMap[theme]} text-white px-5 py-2 rounded-full font-medium text-sm sm:text-base hover:opacity-90 transition-all transform hover:scale-105 shadow-md w-full font-sans flex items-center justify-center gap-2`}
        >
          {buttonText}
          <svg
            className="w-4 h-4"
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
        </button>
      </div>
    </animated.div>
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

  const textProps = useSpring({
    from: { opacity: 0, y: 50 },
    to: { opacity: 1, y: 0 },
    config: { mass: 1, tension: 120, friction: 14 },
  });

  // Approximate card positions in 3D space (adjust based on layout)
  const cardPositions = [
    new THREE.Vector3(-2, 0, 0), // Card 1
    new THREE.Vector3(0, 0, 0), // Card 2
    new THREE.Vector3(2, 0, 0), // Card 3
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 overflow-hidden">
      {/* Background Patterns */}
      <div className="absolute inset-0 z-0 opacity-25 bg-[url('/dagger-map-pattern.png')] bg-cover"></div>
      <div className="absolute inset-0 z-0 opacity-15 bg-[url('/wave-pattern.png')] bg-repeat"></div>
      <div className="absolute inset-0 z-0 opacity-20">
        <Canvas camera={{ position: [0, 0, 12], fov: 45 }}>
          <ParticleBackground cardPositions={cardPositions} />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableRotate={false}
          />
        </Canvas>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <animated.div style={textProps} className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4 tracking-tight font-serif animate-pulse">
            We Do It For All People
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-sans">
            Humanist Services is dedicated to creating positive change through
            compassion, action, and community empowerment.
          </p>
        </animated.div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} index={index} />
          ))}
        </div>

        {/* Testimonial Section */}
        <animated.div
          style={textProps}
          className="mt-16 sm:mt-24 bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl p-6 sm:p-8 max-w-3xl sm:max-w-4xl mx-auto border-l-4 border-gold-400"
        >
          <blockquote className="text-center relative">
            <span className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-4xl text-gold-400 opacity-50">
              “
            </span>
            <p className="text-lg sm:text-xl italic text-gray-900 mb-4 font-medium font-serif">
              "Together We Can Make Changes"
            </p>
            <footer className="text-gray-700 text-sm sm:text-base font-sans">
              — Hasan Al Banna Nahid, Founder, Pi Foundation
            </footer>
          </blockquote>
        </animated.div>

        {/* CTA Section */}
        <animated.div
          style={textProps}
          className="mt-12 sm:mt-16 text-center bg-gradient-to-br from-purple-500/10 to-blue-900/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8"
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-6 tracking-tight font-serif">
            Join Us in Making a Difference
          </h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
            <button className="bg-gradient-to-r from-purple-500 to-blue-900 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-sm sm:text-base hover:opacity-90 transition-all transform hover:scale-105 shadow-lg font-sans flex items-center justify-center gap-2">
              Become a Volunteer
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
            </button>
            <button className="bg-gradient-to-r from-purple-500 to-blue-900 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-sm sm:text-base hover:opacity-90 transition-all transform hover:scale-105 shadow-lg font-sans flex items-center justify-center gap-2">
              Make a Donation
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
            </button>
          </div>
        </animated.div>

        {/* Decorative Floating Elements */}
        <div className="absolute top-10 left-10 w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-900 rounded-full backdrop-blur-sm animate-float"></div>
        <div className="absolute bottom-10 right-10 w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-900 rounded-full backdrop-blur-sm animate-float-delay"></div>
      </div>
    </div>
  );
}
