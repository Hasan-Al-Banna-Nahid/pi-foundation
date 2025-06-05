"use client";
import { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";
import * as THREE from "three";
import Link from "next/link";

function FooterBackground() {
  const groupRef = useRef();
  const particlesRef = useRef();
  const cloudRef = useRef();
  const meshRef = useRef();
  const count = 600; // Particle count for a dense effect
  const cloudCount = 10;

  useEffect(() => {
    if (!particlesRef.current || !cloudRef.current) return;

    // Initialize particles
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 25;
      colors[i] = 0.6 + Math.random() * 0.4; // Purple-blue tones
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
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });

    particlesRef.current.geometry = particlesGeometry;
    particlesRef.current.material = particlesMaterial;

    // Initialize clouds
    const cloudGeometry = new THREE.SphereGeometry(0.5, 20, 20);
    const cloudMaterial = new THREE.MeshStandardMaterial({
      color: "#ffffff",
      transparent: true,
      opacity: 0.4,
      roughness: 0.9,
      metalness: 0.1,
    });
    for (let i = 0; i < cloudCount; i++) {
      const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
      cloud.position.set(
        (Math.random() - 0.5) * 15,
        1 + Math.random() * 3,
        (Math.random() - 0.5) * 15
      );
      cloud.scale.setScalar(0.4 + Math.random() * 0.6);
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
      groupRef.current.rotation.y += 0.005;
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.002;
    }
    if (cloudRef.current) {
      cloudRef.current.children.forEach((cloud, i) => {
        cloud.position.x += Math.sin(time + i * 0.5) * 0.01;
        cloud.position.z += Math.cos(time + i * 0.5) * 0.01;
        cloud.scale.setScalar(0.4 + Math.sin(time + i) * 0.08); // Pulsing effect
      });
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.015;
      meshRef.current.position.y = Math.sin(time * 0.5) * 0.2;
    }
  });

  return (
    <>
      <ambientLight intensity={0.6} color={0x4444ff} />
      <pointLight position={[5, 5, 5]} intensity={1.8} color={0x8888ff} />
      <pointLight position={[-5, -5, 5]} intensity={1.5} color={0x4444cc} />
      <group ref={groupRef}>
        <points ref={particlesRef} />
        <group ref={cloudRef} />
        <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.4}>
          <mesh ref={meshRef}>
            <torusKnotGeometry args={[2, 0.5, 120, 16, 2, 3]} />
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

export default function Footer() {
  return (
    <footer className="relative w-full py-12 bg-gradient-to-br from-purple-900 to-blue-950 text-white overflow-hidden">
      {/* 3D Animated Background */}
      <div className="absolute inset-0 z-0 opacity-20">
        <Canvas camera={{ position: [0, 0, 15], fov: 50 }}>
          <FooterBackground />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableRotate={false}
          />
        </Canvas>
      </div>

      {/* Footer Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold mb-4 font-serif text-gold-400">
              About Us
            </h3>
            <p className="text-purple-200 text-sm font-sans leading-relaxed">
              We are dedicated to creating positive change through compassion,
              action, and community empowerment.
            </p>
          </div>

          {/* Links Section */}
          <div>
            <h3 className="text-xl font-bold mb-4 font-serif text-gold-400">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {["Home", "Services", "About", "News", "Contact"].map((link) => (
                <li key={link}>
                  <Link
                    href={`#${link.toLowerCase()}`}
                    className="text-purple-200 hover:text-gold-400 transition-colors duration-300 font-sans text-sm"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-xl font-bold mb-4 font-serif text-gold-400">
              Contact Us
            </h3>
            <ul className="space-y-2 text-purple-200 text-sm font-sans">
              <li>Email: info@example.com</li>
              <li>Phone: +1 (123) 456-7890</li>
              <li>Address: 1234 Street, City, Country</li>
            </ul>
          </div>

          {/* Newsletter Section */}
          <div>
            <h3 className="text-xl font-bold mb-4 font-serif text-gold-400">
              Newsletter
            </h3>
            <p className="text-purple-200 text-sm mb-4 font-sans">
              Stay updated with our latest news and events.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 rounded-l-full bg-gray-800/50 backdrop-blur-sm text-white placeholder-purple-300 border border-purple-400/30 focus:outline-none focus:border-purple-400/60 font-sans text-sm w-full"
              />
              <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-800 text-white rounded-r-full font-bold hover:opacity-85 transition-all font-sans text-sm">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-purple-400/30 pt-6 text-center">
          <p className="text-purple-200 text-sm font-sans">
            &copy; {new Date().getFullYear()} Humanist Services. All rights
            reserved.
          </p>
        </div>
      </div>

      {/* Floating Decorative Elements */}
      <div className="absolute top-10 left-10 w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-900 rounded-full backdrop-blur-sm animate-float"></div>
      <div className="absolute bottom-10 right-10 w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-900 rounded-full backdrop-blur-sm animate-float-delay"></div>

      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes float-delay {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-15px);
          }
        }
      `}</style>
    </footer>
  );
}
