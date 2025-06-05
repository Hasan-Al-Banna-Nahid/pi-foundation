"use client";
import { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";
import * as THREE from "three";
import { gsap } from "gsap";
import Image from "next/image";
import Link from "next/link";

function MeshAnimation({ meshRef, netRef, particlesRef }) {
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.x = time * 0.05;
      meshRef.current.rotation.y = time * 0.03;
    }
    if (netRef.current) {
      netRef.current.rotation.z = time * 0.02;
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.y = time * 0.01;
    }
  });
  return null;
}

function FloatingMesh() {
  const meshRef = useRef(null);
  const netRef = useRef(null);
  const particlesRef = useRef(null);

  useEffect(() => {
    if (!netRef.current) {
      const netGeometry = new THREE.BufferGeometry();
      const size = 5;
      const divisions = 10;
      const vertices = [];

      for (let i = 0; i <= divisions; i++) {
        const x = (i / divisions) * size - size / 2;
        vertices.push(x, -size / 2, 0, x, size / 2, 0);
      }
      for (let i = 0; i <= divisions; i++) {
        const y = (i / divisions) * size - size / 2;
        vertices.push(-size / 2, y, 0, size / 2, y, 0);
      }

      netGeometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(vertices, 3)
      );

      const netMaterial = new THREE.LineBasicMaterial({
        color: 0x8888ff,
        transparent: true,
        opacity: 0.3,
      });

      const lineSegments = new THREE.LineSegments(netGeometry, netMaterial);
      netRef.current = lineSegments;
    }

    return () => {
      if (netRef.current) {
        netRef.current.geometry.dispose();
        netRef.current.material.dispose();
      }
    };
  }, []);

  useEffect(() => {
    if (!particlesRef.current) {
      const particlesGeometry = new THREE.BufferGeometry();
      const count = 500;
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);

      for (let i = 0; i < count * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 10;
        colors[i] = 0.5 + Math.random() * 0.5;
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
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
      });

      const points = new THREE.Points(particlesGeometry, particlesMaterial);
      particlesRef.current = points;
    }

    return () => {
      if (particlesRef.current) {
        particlesRef.current.geometry.dispose();
        particlesRef.current.material.dispose();
      }
    };
  }, []);

  return (
    <>
      <MeshAnimation
        meshRef={meshRef}
        netRef={netRef}
        particlesRef={particlesRef}
      />
      <ambientLight intensity={0.5} color={0x4444ff} />
      <pointLight position={[5, 5, 5]} intensity={1.5} color={0x8888ff} />
      <pointLight position={[-5, -5, 5]} intensity={1.5} color={0x4444cc} />

      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[2, 1]} />
          <meshStandardMaterial
            color={0x8888ff}
            emissive={0x4444cc}
            emissiveIntensity={0.3}
            wireframe
            transparent
            opacity={0.2}
          />
        </mesh>
      </Float>

      {netRef.current && (
        <primitive object={netRef.current} position={[0, 0, -1]} />
      )}

      {particlesRef.current && <primitive object={particlesRef.current} />}
    </>
  );
}

export default function RecentProjects() {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    gsap.from(sectionRef.current, {
      opacity: 0,
      y: 50,
      duration: 1.5,
      ease: "power3.out",
    });

    cardsRef.current.forEach((card) => {
      if (!card) return;

      const glow = document.createElement("div");
      glow.className =
        "absolute inset-0 rounded-lg opacity-0 transition-opacity duration-300";
      glow.style.background =
        "radial-gradient(circle at center, rgba(136, 136, 255, 0.8) 0%, rgba(68, 68, 204, 0.4) 70%, transparent 100%)";
      glow.style.zIndex = "-1";
      card.appendChild(glow);

      const netOverlay = document.createElement("div");
      netOverlay.className =
        "absolute inset-0 rounded-lg opacity-0 transition-opacity duration-300";
      netOverlay.style.backgroundImage =
        "linear-gradient(to right, rgba(136, 136, 255, 0.3) 1px, transparent 1px), linear-gradient(to bottom, rgba(136, 136, 255, 0.3) 1px, transparent 1px)";
      netOverlay.style.backgroundSize = "20px 20px";
      netOverlay.style.zIndex = "-1";
      card.appendChild(netOverlay);

      card.addEventListener("mouseenter", () => {
        gsap.to(glow, { opacity: 1, duration: 0.3 });
        gsap.to(netOverlay, { opacity: 0.5, duration: 0.3 });
        gsap.to(card, {
          y: -5,
          boxShadow: "0 10px 25px rgba(136, 136, 255, 0.5)",
          duration: 0.3,
        });
      });

      card.addEventListener("mouseleave", () => {
        gsap.to(glow, { opacity: 0, duration: 0.3 });
        gsap.to(netOverlay, { opacity: 0, duration: 0.3 });
        gsap.to(card, {
          y: 0,
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          duration: 0.3,
        });
      });
    });

    return () => {
      cardsRef.current.forEach((card) => {
        if (card) {
          card.replaceChildren(); // Clean up added elements
        }
      });
    };
  }, []);

  const projects = [
    {
      id: 1,
      image: "/yedu.jpg",
      title: "Education",
      description: "Child & Youth Education & Fundraising",
    },
    {
      id: 2,
      image: "/p.webp",
      title: "Treatment",
      description: "Healthcare & Support",
    },
    {
      id: 3,
      image: "/job.jpg",
      title: "Employment",
      description: "Job Skills Training",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-20 overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
      }}
    >
      <div className="absolute inset-0 z-0 opacity-20">
        <Canvas camera={{ position: [0, 0, 15], fov: 70 }}>
          <FloatingMesh />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableRotate={false}
          />
        </Canvas>
      </div>

      <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-purple-300 text-sm font-medium mb-2">
            Complete Projects
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-white">
            Our Recent Projects
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div
              key={project.id}
              ref={(el) => (cardsRef.current[index] = el)}
              className="relative bg-gray-900 rounded-lg overflow-hidden shadow-lg p-1 transition-all duration-300"
              style={{
                background:
                  "linear-gradient(135deg, rgba(26, 26, 46, 0.8) 0%, rgba(22, 33, 62, 0.8) 100%)",
              }}
            >
              <div className="relative h-64 w-full overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    e.target.src = "/fallback-bg.jpg";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/70 via-transparent to-transparent" />
              </div>

              <div className="p-6 relative">
                <h3 className="text-xl font-bold text-white mb-2">
                  {project.title}
                </h3>
                <p className="text-purple-200 text-sm">{project.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/projects">
            <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-800 text-white rounded-full hover:from-purple-700 hover:to-blue-900 transition-all duration-300 shadow-lg hover:shadow-xl">
              View All Projects
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
