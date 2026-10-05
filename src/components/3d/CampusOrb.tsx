"use client";

import React, { useRef, useState, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

interface NodeData {
  id: string;
  label: string;
  subtext: string;
  category: string;
  position: [number, number, number];
  color: string;
  glowColor: string;
  size: number;
}

const NODES: NodeData[] = [
  {
    id: "placement",
    label: "Placements",
    subtext: "3 drives • 2 eligible (TCS, Zomato)",
    category: "Corporate Career",
    position: [2.2, 0.7, 0.4],
    color: "#6366F1",
    glowColor: "#818CF8",
    size: 0.22,
  },
  {
    id: "exam",
    label: "Exams",
    subtext: "2 upcoming • 1 tomorrow (DBMS)",
    category: "Academic Records",
    position: [-2.1, 1.1, -0.2],
    color: "#F59E0B",
    glowColor: "#FBBF24",
    size: 0.22,
  },
  {
    id: "deadline",
    label: "Deadlines",
    subtext: "3 pending • Exam form & Lab record",
    category: "Registrar Schedule",
    position: [0.8, 2.1, 0.8],
    color: "#EF4444",
    glowColor: "#F87171",
    size: 0.2,
  },
  {
    id: "events",
    label: "Events & Clubs",
    subtext: "4 active • AI Hackathon registration",
    category: "Student Life",
    position: [-1.4, -1.8, 0.6],
    color: "#10B981",
    glowColor: "#34D399",
    size: 0.2,
  },
  {
    id: "attendance",
    label: "Attendance",
    subtext: "77.4% • CN at risk (68.2%)",
    category: "Bunk-o-Meter",
    position: [1.8, -1.5, -0.5],
    color: "#8B5CF6",
    glowColor: "#A78BFA",
    size: 0.2,
  },
];

function ConnectionLine({
  start,
  end,
  isHighlighted,
  color,
}: {
  start: [number, number, number];
  end: [number, number, number];
  isHighlighted: boolean;
  color: string;
}) {
  const lineRef = useRef<THREE.Line>(null);

  const points = useMemo(() => {
    return [new THREE.Vector3(...start), new THREE.Vector3(...end)];
  }, [start, end]);

  const lineGeometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [points]);

  useFrame((state) => {
    if (lineRef.current) {
      const mat = lineRef.current.material as THREE.LineBasicMaterial;
      if (isHighlighted) {
        mat.opacity = 0.95;
      } else {
        const t = state.clock.elapsedTime;
        mat.opacity = 0.22 + Math.sin(t * 1.5 + start[0]) * 0.08;
      }
    }
  });

  return (
    // @ts-expect-error Three line JSX
    <line ref={lineRef} geometry={lineGeometry}>
      <lineBasicMaterial
        color={isHighlighted ? color : "#818CF8"}
        transparent
        opacity={0.3}
        linewidth={isHighlighted ? 2 : 1}
      />
    </line>
  );
}

function SatelliteNode({
  node,
  hoveredNode,
  setHoveredNode,
}: {
  node: NodeData;
  hoveredNode: string | null;
  setHoveredNode: (id: string | null) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const isHovered = hoveredNode === node.id;

  useFrame((state, delta) => {
    if (meshRef.current) {
      const targetScale = isHovered ? 1.5 : 1.0;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 8);
    }
  });

  return (
    <group position={node.position}>
      <mesh
        ref={meshRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredNode(node.id);
        }}
        onPointerOut={() => setHoveredNode(null)}
      >
        <sphereGeometry args={[node.size, 24, 24]} />
        <meshStandardMaterial
          color={node.color}
          emissive={node.glowColor}
          emissiveIntensity={isHovered ? 1.0 : 0.45}
          roughness={0.2}
          metalness={0.7}
        />
      </mesh>

      {/* Outer Halo ring when hovered */}
      {isHovered && (
        <mesh>
          <ringGeometry args={[node.size * 1.4, node.size * 1.65, 32]} />
          <meshBasicMaterial color={node.glowColor} transparent opacity={0.65} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}

function CentralAICore({ isCoreHovered, setIsCoreHovered }: { isCoreHovered: boolean; setIsCoreHovered: (v: boolean) => void }) {
  const coreRef = useRef<THREE.Mesh>(null);
  const ringRef1 = useRef<THREE.Mesh>(null);
  const ringRef2 = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.4;
      coreRef.current.rotation.x = Math.sin(t * 0.5) * 0.15;
    }
    if (ringRef1.current) {
      ringRef1.current.rotation.z += delta * 0.35;
      ringRef1.current.rotation.x = Math.PI / 3 + Math.sin(t * 0.3) * 0.1;
    }
    if (ringRef2.current) {
      ringRef2.current.rotation.y -= delta * 0.25;
      ringRef2.current.rotation.z = Math.PI / 4;
    }
  });

  return (
    <group
      position={[0, 0, 0]}
      onPointerOver={() => setIsCoreHovered(true)}
      onPointerOut={() => setIsCoreHovered(false)}
    >
      {/* Central crystalline icosahedron */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.55, 1]} />
        <meshStandardMaterial
          color="#312E81"
          emissive="#6366F1"
          emissiveIntensity={isCoreHovered ? 1.0 : 0.6}
          roughness={0.15}
          metalness={0.85}
        />
      </mesh>

      {/* Inner glowing core sphere */}
      <mesh>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshBasicMaterial color="#818CF8" />
      </mesh>

      {/* Orbiting Orbital Rings */}
      <mesh ref={ringRef1}>
        <torusGeometry args={[0.85, 0.012, 16, 64]} />
        <meshBasicMaterial color="#A5B4FC" transparent opacity={0.65} />
      </mesh>

      <mesh ref={ringRef2}>
        <torusGeometry args={[1.05, 0.01, 16, 64]} />
        <meshBasicMaterial color="#C7D2FE" transparent opacity={0.45} />
      </mesh>
    </group>
  );
}

function ParticleSwarm({ count = 65 }: { count?: number }) {
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 1.4 + Math.random() * 2.2;
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);

      p[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      p[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      p[i * 3 + 2] = radius * Math.cos(phi);
    }
    return p;
  }, [count]);

  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.05;
      pointsRef.current.rotation.x += delta * 0.02;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[points, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        color="#818CF8"
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  );
}

function Scene({
  hoveredNode,
  setHoveredNode,
}: {
  hoveredNode: string | null;
  setHoveredNode: (id: string | null) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [isCoreHovered, setIsCoreHovered] = useState(false);
  const { mouse } = useThree();

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Extremely slow rotation + gentle mouse parallax
      groupRef.current.rotation.y += delta * 0.12;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        mouse.y * 0.25,
        delta * 2
      );
      groupRef.current.rotation.z = THREE.MathUtils.lerp(
        groupRef.current.rotation.z,
        -mouse.x * 0.25,
        delta * 2
      );
    }
  });

  return (
    <Float speed={1.4} rotationIntensity={0.2} floatIntensity={0.4}>
      <group ref={groupRef}>
        {/* Central Core */}
        <CentralAICore isCoreHovered={isCoreHovered} setIsCoreHovered={setIsCoreHovered} />

        {/* Satellite Nodes */}
        {NODES.map((node) => (
          <SatelliteNode
            key={node.id}
            node={node}
            hoveredNode={hoveredNode}
            setHoveredNode={setHoveredNode}
          />
        ))}

        {/* Connection Lines from Core to each Satellite */}
        {NODES.map((node) => (
          <ConnectionLine
            key={`line-${node.id}`}
            start={[0, 0, 0]}
            end={node.position}
            isHighlighted={hoveredNode === node.id}
            color={node.glowColor}
          />
        ))}

        {/* Ambient floating data particles */}
        <ParticleSwarm count={65} />
      </group>
    </Float>
  );
}

export default function CampusOrb() {
  const [hoveredNode, setHoveredNode] = useState<string | null>("placement");

  const activeNodeInfo = useMemo(() => {
    return NODES.find((n) => n.id === hoveredNode) || NODES[0];
  }, [hoveredNode]);

  return (
    <div className="relative w-full h-[380px] sm:h-[460px] md:h-[520px] select-none flex items-center justify-center">
      {/* Subtle background ambient radial lighting */}
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-purple-500/5 to-transparent rounded-full filter blur-3xl pointer-events-none" />

      {/* Top Floating HUD Micro-Interaction Info Badge */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-md border border-zinc-200/80 shadow-md">
          <span
            className="w-2.5 h-2.5 rounded-full animate-pulse"
            style={{ backgroundColor: activeNodeInfo.color }}
          />
          <div>
            <span className="font-bold text-xs text-zinc-900 tracking-tight">
              {activeNodeInfo.label}
            </span>
            <span className="text-[10px] text-zinc-500 ml-2 hidden sm:inline">
              ({activeNodeInfo.category})
            </span>
            <p className="text-[11px] text-indigo-950 font-medium">
              {activeNodeInfo.subtext}
            </p>
          </div>
        </div>

        <div className="hidden sm:block text-[10px] font-mono uppercase tracking-wider text-indigo-700 bg-indigo-50/90 border border-indigo-200 px-2.5 py-1 rounded-lg">
          AI CORE ACTIVE
        </div>
      </div>

      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 6, 5]} intensity={1.2} />
        <pointLight position={[-4, -3, 2]} intensity={0.6} color="#A78BFA" />

        <Scene hoveredNode={hoveredNode} setHoveredNode={setHoveredNode} />
      </Canvas>

      {/* Micro-hint badge at the bottom */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 backdrop-blur-md border border-zinc-200/70 text-zinc-500 text-[11px] shadow-sm pointer-events-none">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span>Hover or drag nodes to inspect live campus intelligence stream</span>
      </div>
    </div>
  );
}
