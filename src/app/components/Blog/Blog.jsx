"use client";
import { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";
import * as THREE from "three";
import { useSpring, animated } from "@react-spring/web";
import Link from "next/link";

function CloudRainScene() {
  const groupRef = useRef();
  const particlesRef = useRef();
  const cloudRef = useRef();
  const meshRef = useRef();

  useEffect(() => {
    if (!particlesRef.current || !cloudRef.current) return;

    // Initialize particles
    const particlesGeometry = new THREE.BufferGeometry();
    const count = 800; // Increased for richer effect
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 20;
      colors[i] = 0.6 + Math.random() * 0.4; // Soft blue-purple tones
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
      size: 0.04,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    particlesRef.current.geometry = particlesGeometry;
    particlesRef.current.material = particlesMaterial;

    // Initialize clouds
    const cloudGeometry = new THREE.SphereGeometry(0.6, 24, 24);
    const cloudMaterial = new THREE.MeshStandardMaterial({
      color: "#ffffff",
      transparent: true,
      opacity: 0.5,
      roughness: 0.8,
      metalness: 0.1,
    });
    for (let i = 0; i < 12; i++) {
      // Increased cloud count
      const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
      cloud.position.set(
        (Math.random() - 0.5) * 12,
        2 + Math.random() * 4,
        (Math.random() - 0.5) * 12
      );
      cloud.scale.setScalar(0.5 + Math.random() * 0.7);
      cloudRef.current.add(cloud);
    }

    return () => {
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      cloudGeometry.dispose();
      cloudMaterial.dispose();
    };
  }, []);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.01;
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.001;
    }
    if (cloudRef.current) {
      cloudRef.current.children.forEach((cloud, i) => {
        cloud.position.x += Math.sin(time + i * 0.5) * 0.015;
        cloud.position.z += Math.cos(time + i * 0.5) * 0.015;
        cloud.scale.setScalar(0.5 + Math.sin(time + i) * 0.1); // Pulsing effect
      });
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.02;
      meshRef.current.position.y = Math.sin(time * 0.5) * 0.3;
    }
  });

  return (
    <>
      <ambientLight intensity={0.7} color={0x4444ff} />
      <pointLight position={[5, 5, 5]} intensity={2} color={0x8888ff} />
      <pointLight position={[-5, -5, 5]} intensity={1.5} color={0x4444cc} />
      <group ref={groupRef}>
        <points ref={particlesRef} />
        <group ref={cloudRef} />
        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
          <mesh ref={meshRef}>
            <icosahedronGeometry args={[2, 1]} />
            <meshStandardMaterial
              color={0x8888ff}
              emissive={0x4444cc}
              emissiveIntensity={0.4}
              transparent
              opacity={0.3}
              wireframe
            />
          </mesh>
        </Float>
      </group>
    </>
  );
}

function AboutCard({ title, description, imageUrl, link, index }) {
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
      className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-[0_0_25px_rgba(136,136,255,0.5)]"
    >
      <div
        className="absolute inset-0 bg-cover bg-center filter grayscale hover:grayscale-0 transition-all duration-700"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
      <div className="relative p-6 sm:p-8 flex flex-col h-full bg-black/30">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-4 tracking-tight font-serif">
          {title}
        </h3>
        <p className="text-purple-100 text-base sm:text-lg mb-6 font-sans leading-relaxed flex-grow">
          {description}
        </p>
        <Link
          href={link}
          className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-800 text-white rounded-full font-bold text-base hover:opacity-85 transition-all transform hover:scale-110 shadow-lg font-sans w-fit"
        >
          Read More
        </Link>
      </div>
    </animated.div>
  );
}

export default function AboutSection() {
  const cards = [
    {
      title: "Our Mission",
      description:
        "We strive to empower communities through compassion, action, and sustainable solutions.",
      imageUrl:
        "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      link: "#mission",
    },
    {
      title: "Our Vision",
      description:
        "A world where everyone has access to opportunities and support to thrive.",
      imageUrl:
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      link: "#vision",
    },
    {
      title: "Our Impact",
      description:
        "Transforming lives through education, healthcare, and job opportunities.",
      imageUrl:
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      link: "#impact",
    },
  ];

  const textProps = useSpring({
    from: { opacity: 0, y: 60 },
    to: { opacity: 1, y: 0 },
    config: { mass: 1, tension: 140, friction: 16 },
  });

  return (
    <section className="relative w-full py-20 overflow-hidden bg-gradient-to-br from-blue-900 to-purple-950">
      <div className="absolute inset-0 z-0 opacity-25">
        <Canvas camera={{ position: [0, 0, 12], fov: 50 }}>
          <CloudRainScene />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableRotate={false}
          />
        </Canvas>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <animated.div style={textProps} className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-white font-serif">
            About Us
          </h2>
          <p className="text-purple-200 text-lg sm:text-xl mt-4 max-w-3xl mx-auto font-sans">
            We are dedicated to making a difference through compassion and
            action.
          </p>
        </animated.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <AboutCard key={index} {...card} index={index} />
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0);
          }
        }
        @keyframes glow {
          0%,
          100% {
            opacity: 0.7;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </section>
  );
}
