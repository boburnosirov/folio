"use client";

import { useRef, MutableRefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

// ─── Book data — lightened for visibility on dark background ─
const BOOKS = [
  { pos: [-3.4, 0.6, -1.5] as [number,number,number], rot: [0.05, 0.28, 0.06] as [number,number,number], color: "#2a4d7a", size: [1.2, 1.85, 0.14] as [number,number,number], speed: 0.9,  parallax: 0.045 },
  { pos: [3.1, -0.4, -2.5]  as [number,number,number], rot: [0.02, -0.38, -0.04] as [number,number,number], color: "#6d2828", size: [1.1, 1.70, 0.11] as [number,number,number], speed: 0.65, parallax: 0.03  },
  { pos: [-1.4, -1.6, -0.8] as [number,number,number], rot: [0.09, 0.16, 0.10]  as [number,number,number], color: "#2a5e38", size: [1.3, 1.95, 0.16] as [number,number,number], speed: 1.05, parallax: 0.055 },
  { pos: [2.1, 1.9, -4.2]   as [number,number,number], rot: [0.03, 0.22, -0.04] as [number,number,number], color: "#38385e", size: [1.0, 1.55, 0.09] as [number,number,number], speed: 0.50, parallax: 0.018 },
  { pos: [-3.9, -0.5, -3.8] as [number,number,number], rot: [0.06, -0.24, 0.02] as [number,number,number], color: "#4a2868", size: [1.4, 2.05, 0.13] as [number,number,number], speed: 0.72, parallax: 0.022 },
  { pos: [0.9, -2.1, -1.2]  as [number,number,number], rot: [0.04, 0.44, -0.09] as [number,number,number], color: "#6d4518", size: [1.1, 1.65, 0.12] as [number,number,number], speed: 0.88, parallax: 0.048 },
  { pos: [-0.4, 2.3, -5.2]  as [number,number,number], rot: [0.02, -0.10, 0.03] as [number,number,number], color: "#1e5870", size: [1.6, 2.15, 0.10] as [number,number,number], speed: 0.42, parallax: 0.012 },
] as const;

// ─── Single book mesh ───────────────────────────────────────
interface BookProps {
  pos: [number, number, number];
  rot: [number, number, number];
  color: string;
  size: [number, number, number];
  speed: number;
  parallax: number;
  mouseRef: MutableRefObject<{ x: number; y: number }>;
}

function Book({ pos, rot, color, size, speed, parallax, mouseRef }: BookProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const [bx, by, bz] = pos;

  useFrame(() => {
    if (!groupRef.current) return;
    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;
    // Smooth lerp toward mouse offset
    groupRef.current.position.x = THREE.MathUtils.lerp(
      groupRef.current.position.x,
      bx + mx * parallax * 18,
      0.04
    );
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      by + my * parallax * 10,
      0.04
    );
  });

  return (
    <group ref={groupRef} position={pos}>
      <Float
        speed={speed}
        rotationIntensity={0.12}
        floatIntensity={0.35}
        floatingRange={[-0.18, 0.18]}
      >
        <mesh rotation={rot}>
          <boxGeometry args={size} />
          <meshStandardMaterial
            color={color}
            roughness={0.18}
            metalness={0.12}
            emissive={color}
            emissiveIntensity={0.55}
          />
        </mesh>
        {/* Spine highlight strip */}
        <mesh position={[-size[0] / 2 + 0.01, 0, 0]} rotation={rot}>
          <boxGeometry args={[0.04, size[1] * 0.96, size[2] * 1.02]} />
          <meshStandardMaterial
            color="#d4a843"
            roughness={0.1}
            metalness={0.6}
            emissive="#d4a843"
            emissiveIntensity={0.5}
          />
        </mesh>
      </Float>
    </group>
  );
}

// ─── Scene internals ────────────────────────────────────────
function Scene({ mouseRef }: { mouseRef: MutableRefObject<{ x: number; y: number }> }) {
  return (
    <>
      {/* Lighting — boosted for visibility */}
      <ambientLight intensity={1.2} color="#b0a8d0" />
      <directionalLight position={[4, 6, 4]} intensity={2.5} color="#f5d898" />
      <directionalLight position={[-4, -2, 3]} intensity={1.2} color="#8090ff" />
      <pointLight position={[0, 0, 4]} intensity={8} color="#d4a843" distance={14} decay={2} />
      <pointLight position={[-4, 3, -1]} intensity={2.5} color="#6070d0" distance={12} decay={2} />
      <pointLight position={[3, -2, 1]} intensity={2.0} color="#d06060" distance={10} decay={2} />

      {/* Books */}
      {BOOKS.map((book, i) => (
        <Book key={i} {...book} mouseRef={mouseRef} />
      ))}

      {/* Bloom */}
      <EffectComposer>
        <Bloom
          mipmapBlur
          luminanceThreshold={0.35}
          luminanceSmoothing={0.85}
          intensity={0.9}
        />
      </EffectComposer>
    </>
  );
}

// ─── Canvas export ──────────────────────────────────────────
interface HeroScene3DProps {
  mouseRef: MutableRefObject<{ x: number; y: number }>;
}

export default function HeroScene3D({ mouseRef }: HeroScene3DProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 44 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
    >
      <color attach="background" args={["#0b0b12"]} />
      <fog attach="fog" args={["#0b0b12", 10, 22]} />
      <Scene mouseRef={mouseRef} />
    </Canvas>
  );
}
