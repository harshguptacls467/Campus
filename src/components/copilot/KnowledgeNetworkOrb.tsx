"use client";

import React, { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

interface KnowledgeNode {
  id: string;
  label: string;
  category: string;
  position: [number, number, number];
  color: string;
  prompt: string;
}

const KNOWLEDGE_NODES: KnowledgeNode[] = [
  {
    id: "exams",
    label: "EXAMS",
    category: "Academic",
    position: [-2.2, 1.0, 0],
    color: "#F59E0B",
    prompt: "I have DBMS tomorrow and only 3 hours.",
  },
  {
    id: "placements",
    label: "PLACEMENTS",
    category: "Careers",
    position: [2.2, 0.8, 0.2],
    color: "#6366F1",
    prompt: "Am I eligible for today's placement?",
  },
  {
    id: "notices",
    label: "NOTICES",
    category: "Official",
    position: [0.9, 1.9, 0.5],
    color: "#10B981",
    prompt: "Show important notices from this week.",
  },
  {
    id: "attendance",
    label: "ATTENDANCE",
    category: "Bunk-o-Meter",
    position: [1.8, -1.4, -0.3],
    color: "#8B5CF6",
    prompt: "Can I bunk tomorrow?",
  },
  {
    id: "events",
    label: "EVENTS",
    category: "Campus Life",
    position: [-1.6, -1.6, 0.4],
    color: "#EC4899",
    prompt: "Find hackathons I can participate in.",
  },
  {
    id: "syllabus",
    label: "SYLLABUS",
    category: "Coursework",
    position: [-0.6, 2.1, -0.6],
    color: "#3B82F6",
    prompt: "What should I prepare for DBMS mid-sem?",
  },
];

function OrbitingNode({
  node,
  isHovered,
  onHover,
  onClick,
}: {
  node: KnowledgeNode;
  isHovered: boolean;
  onHover: (id: string | null) => void;
  onClick: (prompt: string) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      const targetScale = isHovered ? 1.4 : 1.0;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 8);
    }
  });

  return (
    <group position={node.position}>
      <mesh
        ref={meshRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(node.id);
        }}
        onPointerOut={() => onHover(null)}
        onClick={(e) => {
          e.stopPropagation();
          onClick(node.prompt);
        }}
      >
        <sphereGeometry args={[0.24, 20, 20]} />
        <meshStandardMaterial
          color={node.color}
          emissive={node.color}
          emissiveIntensity={isHovered ? 1.0 : 0.45}
          roughness={0.2}
          metalness={0.7}
        />
      </mesh>

      {/* Orbit halo ring when hovered */}
      {isHovered && (
        <mesh>
          <ringGeometry args={[0.34, 0.42, 32]} />
          <meshBasicMaterial color={node.color} transparent opacity={0.65} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}

function KnowledgeMeshLines({
  activeId,
}: {
  activeId: string | null;
}) {
  return (
    <group>
      {KNOWLEDGE_NODES.map((node) => {
        const isSelected = activeId === node.id;
        const points = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(...node.position)];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);

        return (
          // @ts-expect-error Three JSX
          <line key={node.id} geometry={geometry}>
            <lineBasicMaterial
              color={isSelected ? node.color : "#C7D2FE"}
              transparent
              opacity={isSelected ? 0.9 : 0.25}
              linewidth={isSelected ? 2 : 1}
            />
          </line>
        );
      })}
    </group>
  );
}

function CenterCore({ isHovered }: { isHovered: boolean }) {
  const coreRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.4;
      coreRef.current.rotation.x = Math.sin(t * 0.5) * 0.2;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.3;
      ringRef.current.rotation.x = Math.PI / 3;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      <mesh ref={coreRef}>
        <octahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial
          color="#1E1B4B"
          emissive="#6366F1"
          emissiveIntensity={isHovered ? 1.0 : 0.6}
          roughness={0.15}
          metalness={0.8}
        />
      </mesh>

      <mesh ref={ringRef}>
        <torusGeometry args={[0.85, 0.012, 16, 48]} />
        <meshBasicMaterial color="#818CF8" transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

export default function KnowledgeNetworkOrb({
  onSelectPrompt,
}: {
  onSelectPrompt: (prompt: string) => void;
}) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const activeNode = useMemo(() => {
    return KNOWLEDGE_NODES.find((n) => n.id === hoveredNode);
  }, [hoveredNode]);

  return (
    <div className="relative w-full h-[260px] sm:h-[300px] flex items-center justify-center select-none overflow-hidden rounded-3xl bg-[#FAF9F6] border border-zinc-200/80">
      
      {/* Background ambient radial glow */}
      <div className="absolute inset-0 bg-radial-glow opacity-80 pointer-events-none" />

      {/* Floating Category Badges */}
      <div className="absolute top-3 left-4 right-4 flex items-center justify-between pointer-events-none z-10 text-xs font-mono">
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md border border-zinc-200 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
          <span className="font-bold text-zinc-900">
            {activeNode ? activeNode.label : "CAMPUS KNOWLEDGE NETWORK"}
          </span>
          {activeNode && (
            <span className="text-[10px] text-zinc-400">Click node to explore</span>
          )}
        </div>

        <span className="hidden sm:inline text-[10px] text-zinc-400">
          6 DOMAINS SYNCHRONIZED
        </span>
      </div>

      <Canvas
        camera={{ position: [0, 0, 5.2], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        className="w-full h-full cursor-pointer"
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[4, 5, 4]} intensity={1.2} />
        <pointLight position={[-3, -3, 2]} intensity={0.5} color="#818CF8" />

        <Float speed={1.5} rotationIntensity={0.25} floatIntensity={0.3}>
          <CenterCore isHovered={!!hoveredNode} />
          <KnowledgeMeshLines activeId={hoveredNode} />

          {KNOWLEDGE_NODES.map((node) => (
            <OrbitingNode
              key={node.id}
              node={node}
              isHovered={hoveredNode === node.id}
              onHover={setHoveredNode}
              onClick={onSelectPrompt}
            />
          ))}
        </Float>
      </Canvas>

      {/* Micro-hint on bottom */}
      <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-white/80 backdrop-blur-sm border border-zinc-200/70 text-[10px] font-mono text-zinc-500 pointer-events-none">
        Click any node (Exams, Placements, Attendance) to query
      </div>
    </div>
  );
}
