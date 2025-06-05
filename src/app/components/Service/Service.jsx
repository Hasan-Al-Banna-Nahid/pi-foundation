"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";
import * as THREE from "three";
import { useEffect, useRef } from "react";
import { useSpring, animated } from "@react-spring/web";

function ParticleBackground({ cardPositions }) {
  const particlesRef = useRef();
  const cloudsRef = useRef();
  const helixRef = useRef();
  const heartsRef = useRef();
  const count = 300;
  const cloudCount = 8;
  const heartCount = 12;
  const mouse = useRef({ x: 0, y: 0 });
  const velocities = useRef(new Float32Array(count * 3));
  const originalPositions = useRef(new Float32Array(count * 3));

  useEffect(() => {
    if (!particlesRef.current) return;

    // Initialize particles
    const particles = particlesRef.current;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 25;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 25;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 25;
      originalPositions.current[i * 3] = positions[i * 3];
      originalPositions.current[i * 3 + 1] = positions[i * 3 + 1];
      originalPositions.current[i * 3 + 2] = positions[i * 3 + 2];

      colors[i * 3] = 0.8 + Math.sin(i * 0.1) * 0.2;
      colors[i * 3 + 1] = 0.6 + Math.cos(i * 0.1) * 0.2;
      colors[i * 3 + 2] = 0.5 + Math.sin(i * 0.1 + 1) * 0.2;
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
    const cloudGeometry = new THREE.SphereGeometry(0.7, 32, 32);
    const cloudMaterial = new THREE.MeshStandardMaterial({
      color: "#ffffff",
      transparent: true,
      opacity: 0.3,
      roughness: 0.8,
      metalness: 0.1,
    });
    for (let i = 0; i < cloudCount; i++) {
      const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
      cloud.position.set(
        (Math.random() - 0.5) * 18,
        3 + Math.random() * 4,
        (Math.random() - 0.5) * 18
      );
      cloud.scale.setScalar(0.6 + Math.random() * 0.6);
      cloudsRef.current.add(cloud);
    }

    // Initialize hearts around cards
    const heartGeometry = new THREE.SphereGeometry(0.12, 12, 12);
    const heartMaterial = new THREE.MeshStandardMaterial({
      color: "#FFD700",
      emissive: "#FFD700",
      emissiveIntensity: 0.7,
      transparent: true,
      opacity: 0.8,
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
        const radius = 1.8;
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
    if (!particlesRef.current) return;

    const particles = particlesRef.current;
    const positions = particles.geometry.attributes.position?.array;
    const colors = particles.geometry.attributes.color?.array;

    if (!positions || !colors) return;

    // Particle motion with dynamic colors
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const x = positions[i3];
      const y = positions[i3 + 1];
      const z = positions[i3 + 2];

      const k = 0.1;
      const damping = 0.9;
      const ox = originalPositions.current[i3];
      const oy = originalPositions.current[i3 + 1];
      const oz = originalPositions.current[i3 + 2];

      const ax = -k * (x - ox);
      const ay =
        -k * (y - oy) + Math.sin(state.clock.getElapsedTime() + i * 0.1) * 0.03;
      const az = -k * (z - oz);

      velocities.current[i3] += ax * delta;
      velocities.current[i3 + 1] += ay * delta;
      velocities.current[i3 + 2] += az * delta;

      velocities.current[i3] *= damping;
      velocities.current[i3 + 1] *= damping;
      velocities.current[i3 + 2] *= damping;

      const mouseWorld = new THREE.Vector3(
        mouse.current.x * 12,
        mouse.current.y * 12,
        0
      );
      const distance = Math.sqrt(
        (x - mouseWorld.x) ** 2 + (y - mouseWorld.y) ** 2 + z ** 2
      );
      if (distance < 2.5) {
        const force = (2.5 - distance) * 0.5;
        velocities.current[i3] += force * (x - mouseWorld.x) * delta;
        velocities.current[i3 + 1] += force * (y - mouseWorld.y) * delta;
      }

      positions[i3] += velocities.current[i3] * delta;
      positions[i3 + 1] += velocities.current[i3 + 1] * delta;
      positions[i3 + 2] += velocities.current[i3 + 2] * delta;

      colors[i3] = 0.8 + Math.sin(state.clock.getElapsedTime() + i * 0.1) * 0.2;
      colors[i3 + 1] =
        0.6 + Math.cos(state.clock.getElapsedTime() + i * 0.1) * 0.2;
      colors[i3 + 2] =
        0.5 + Math.sin(state.clock.getElapsedTime() + i * 0.1 + 1) * 0.2;
    }

    particles.geometry.attributes.position.needsUpdate = true;
    particles.geometry.attributes.color.needsUpdate = true;
    particles.rotation.y += delta * 0.03;

    cloudsRef.current.children.forEach((cloud, i) => {
      cloud.position.x +=
        Math.sin(state.clock.getElapsedTime() + i * 0.5) * 0.015;
      cloud.position.z +=
        Math.cos(state.clock.getElapsedTime() + i * 0.5) * 0.015;
      cloud.scale.setScalar(
        0.6 + Math.sin(state.clock.getElapsedTime() + i) * 0.1
      );
    });

    const time = state.clock.getElapsedTime();
    for (let i = 0; i < cardPositions.length; i++) {
      for (let j = 0; j < heartCount; j++) {
        const index = i * heartCount + j;
        const angle = (j / heartCount) * Math.PI * 2 + time * 0.6;
        const radius = 1.8 + Math.sin(time + j * 0.5) * 0.25;
        const matrix = new THREE.Matrix4();
        matrix.setPosition(
          cardPositions[i].x + Math.cos(angle) * radius,
          cardPositions[i].y + Math.sin(angle) * radius,
          cardPositions[i].z + Math.sin(time + j) * 0.6
        );
        heartsRef.current.children[0].setMatrixAt(index, matrix);
      }
    }
    heartsRef.current.children[0].instanceMatrix.needsUpdate = true;

    if (helixRef.current) {
      helixRef.current.rotation.y += delta * 0.2;
      helixRef.current.position.y = Math.sin(time * 0.5) * 0.5;
    }
  });

  return (
    <>
      <ambientLight intensity={0.8} color="#ffffff" />
      <pointLight position={[10, 10, 10]} intensity={2} color="#FFD700" />
      <pointLight position={[-10, -10, 10]} intensity={1.5} color="#66ccff" />
      <group>
        <points ref={particlesRef}>
          <bufferGeometry attach="geometry" />
          <pointsMaterial
            attach="material"
            size={0.06}
            sizeAttenuation={true}
            vertexColors
            transparent
            opacity={0.9}
          />
        </points>
        <group ref={cloudsRef} />
        <group ref={heartsRef} />
        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
          <mesh ref={helixRef}>
            <torusKnotGeometry args={[3, 0.5, 120, 16, 2, 3]} />
            <meshStandardMaterial
              color="#66ccff"
              emissive="#66ccff"
              emissiveIntensity={0.4}
              transparent
              opacity={0.25}
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
    treatment: "from-red-500 to-purple-700",
    education: "from-green-500 to-blue-700",
    unemployment: "from-yellow-500 to-orange-700",
  };

  const iconMap = {
    treatment: "🩺",
    education: "📚",
    unemployment: "💼",
  };

  const cardProps = useSpring({
    from: { y: 50, opacity: 0, scale: 0.85, rotateX: 15 },
    to: { y: 0, opacity: 1, scale: 1, rotateX: 0 },
    config: { mass: 1, tension: 180, friction: 20 },
    delay: index * 250,
  });

  return (
    <animated.div
      style={{
        ...cardProps,
        transform: cardProps.rotateX.to(
          (rx) => `perspective(1000px) rotateX(${rx}deg)`
        ),
      }}
      className="relative bg-gradient-to-br from-white/90 to-gray-100/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border-l-8 border-gold-500 ring-4 ring-gold-400/30 hover:ring-gold-500/60 transition-all duration-500 hover:scale-105 hover:shadow-[0_0_25px_rgba(255,215,0,0.5)]"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-gold-200/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-700"></div>
      <div className="relative p-6 sm:p-8">
        <div className="text-5xl sm:text-6xl mb-5 text-gold-500 animate-pulse">
          {iconMap[theme]}
        </div>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4 tracking-tight font-serif">
          {title}
        </h3>
        <p className="text-gray-800 text-base sm:text-lg mb-6 font-sans leading-relaxed">
          {description}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-inner"
            >
              <p className="text-lg sm:text-xl font-bold text-gold-600">
                {stat.value}
              </p>
              <p className="text-sm text-gray-700 font-sans">{stat.label}</p>
            </div>
          ))}
        </div>

        <button
          className={`bg-gradient-to-r ${gradientMap[theme]} text-white px-6 sm:px-8 py-3 rounded-full font-bold text-base sm:text-lg hover:opacity-85 transition-all transform hover:scale-110 shadow-lg font-sans flex items-center justify-center gap-3 w-full`}
        >
          {buttonText}
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
    from: { opacity: 0, y: 60 },
    to: { opacity: 1, y: 0 },
    config: { mass: 1, tension: 140, friction: 16 },
  });

  const cardPositions = [
    new THREE.Vector3(-3, 0, 0),
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(3, 0, 0),
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-30">
        <Canvas camera={{ position: [0, 0, 15], fov: 50 }}>
          <ParticleBackground cardPositions={cardPositions} />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableRotate={false}
          />
        </Canvas>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <animated.div style={textProps} className="text-center mb-12 sm:mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-4 tracking-tight font-serif animate-glow">
            We Do It For All People
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-800 max-w-3xl mx-auto leading-relaxed font-sans">
            Humanist Services is dedicated to creating positive change through
            compassion, action, and community empowerment.
          </p>
        </animated.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} index={index} />
          ))}
        </div>

        <animated.div
          style={textProps}
          className="mt-16 sm:mt-24 bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 sm:p-10 max-w-4xl mx-auto border-l-6 border-gold-500"
        >
          <blockquote className="text-center relative">
            <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-5xl text-gold-400 opacity-60">
              “
            </span>
            <p className="text-xl sm:text-2xl italic text-gray-900 mb-4 font-medium font-serif">
              "Together We Can Make Changes"
            </p>
            <footer className="text-gray-800 text-base sm:text-lg font-sans">
              — Hasan Al Banna Nahid, Founder, Pi Foundation
            </footer>
          </blockquote>
        </animated.div>

        <animated.div
          style={textProps}
          className="mt-12 sm:mt-16 text-center bg-gradient-to-br from-purple-500/15 to-blue-900/15 backdrop-blur-xl rounded-3xl p-8 sm:p-10"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 tracking-tight font-serif">
            Join Us in Making a Difference
          </h2>
          <div className="flex flex-col sm:flex-row justify-center gap-6 sm:gap-8">
            <button className="bg-gradient-to-r from-purple-600 to-blue-800 text-white px-8 sm:px-10 py-4 rounded-full font-bold text-base sm:text-lg hover:opacity-85 transition-all transform hover:scale-110 shadow-lg font-sans flex items-center justify-center gap-3">
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
            <button className="bg-gradient-to-r from-purple-600 to-blue-800 text-white px-8 sm:px-10 py-4 rounded-full font-bold text-base sm:text-lg hover:opacity-85 transition-all transform hover:scale-110 shadow-lg font-sans flex items-center justify-center gap-3">
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

        <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-900 rounded-full backdrop-blur-sm animate-float"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-900 rounded-full backdrop-blur-sm animate-float-delay"></div>
      </div>
    </div>
  );
}
