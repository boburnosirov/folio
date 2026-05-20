"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Zap, Clock } from "lucide-react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { HOME_CATEGORIES } from "@/components/home/homeData";
import type { HomeBook } from "@/components/home/homeData";

const DEMO_BOOKS: HomeBook[] = [
  HOME_CATEGORIES[0].covers[0],
  HOME_CATEGORIES[0].covers[1],
  HOME_CATEGORIES[1].covers[0],
  HOME_CATEGORIES[1].covers[1],
  HOME_CATEGORIES[2].covers[0],
  HOME_CATEGORIES[2].covers[3],
  HOME_CATEGORIES[3].covers[0],
  HOME_CATEGORIES[3].covers[3],
  HOME_CATEGORIES[6].covers[1],
  HOME_CATEGORIES[7].covers[0],
];

const VARIANT_COLORS: Record<string, [string, string]> = {
  anna:     ["#a83a32", "#221014"],
  crime:    ["#273c62", "#0b1020"],
  babur:    ["#2b806d", "#10241f"],
  austen:   ["#d8bba3", "#7b4b44"],
  sherlock: ["#4c6345", "#121a14"],
  navai:    ["#256b98", "#10253a"],
  verne:    ["#246480", "#071722"],
  franklin: ["#a06126", "#241207"],
  gogol:    ["#604278", "#150d1e"],
  chekhov:  ["#b66b45", "#25120c"],
  hugo:     ["#566179", "#0d1018"],
  marcus:   ["#6b6256", "#141311"],
};

function makeBookTexture(
  title: string,
  author: string,
  variant: string
): THREE.CanvasTexture {
  const [top, bot] = VARIANT_COLORS[variant] ?? ["#333", "#000"];
  const W = 256, H = 384;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  // Background
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, top);
  bg.addColorStop(1, bot);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Spine shadow
  ctx.fillStyle = "rgba(0,0,0,0.28)";
  ctx.fillRect(0, 0, 22, H);

  // Top/bottom decorative lines
  ctx.strokeStyle = "rgba(255,255,255,0.22)";
  ctx.lineWidth = 1;
  [[32, 58], [32, H - 58]].forEach(([x, y]) => {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(W - 10, y);
    ctx.stroke();
  });

  // Subtle radial light
  const radial = ctx.createRadialGradient(W / 2, 60, 10, W / 2, 60, 120);
  radial.addColorStop(0, "rgba(255,255,255,0.18)");
  radial.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = radial;
  ctx.fillRect(0, 0, W, H);

  // Author text
  ctx.fillStyle = "rgba(255,255,255,0.50)";
  ctx.font = "500 13px system-ui,sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(author.substring(0, 22), W / 2, 80);

  // Title — wrap up to 3 lines
  ctx.fillStyle = "rgba(255,255,255,0.92)";
  ctx.font = "bold 21px Georgia,serif";
  const words = title.split(" ");
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const test = cur ? `${cur} ${w}` : w;
    if (ctx.measureText(test).width > 198) {
      if (cur) lines.push(cur);
      cur = w;
    } else {
      cur = test;
    }
  }
  if (cur) lines.push(cur);
  const lineH = 26;
  const startY = H / 2 - ((lines.length - 1) * lineH) / 2;
  lines.slice(0, 3).forEach((l, i) => {
    ctx.fillText(l, W / 2, startY + i * lineH);
  });

  return new THREE.CanvasTexture(canvas);
}

// ── FPS counter (inside Canvas) ──────────────────────────────────────────────
function FPSTracker({ onFps }: { onFps: (v: number) => void }) {
  const count = useRef(0);
  const last = useRef(performance.now());

  useFrame(() => {
    count.current++;
    const now = performance.now();
    if (now - last.current >= 1000) {
      onFps(Math.round((count.current * 1000) / (now - last.current)));
      count.current = 0;
      last.current = now;
    }
  });
  return null;
}

// ── Single book mesh ─────────────────────────────────────────────────────────
function BookMesh({
  book,
  index,
  active,
  total,
  onSelect,
}: {
  book: HomeBook;
  index: number;
  active: number;
  total: number;
  onSelect: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const texture = useMemo(
    () => makeBookTexture(book.title, book.author, book.variant),
    [book]
  );

  const isActive = index === active;
  const RADIUS = 4.2;

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const targetAngle =
      ((index - active) / total) * Math.PI * 2 - Math.PI / 2;
    const tx = Math.cos(targetAngle) * RADIUS;
    const tz = Math.sin(targetAngle) * RADIUS;
    const ty = isActive ? 0.35 : 0;
    const ts = isActive ? 1.12 : hovered ? 1.05 : 0.88;

    const m = meshRef.current;
    m.position.x = THREE.MathUtils.lerp(m.position.x, tx, delta * 5);
    m.position.z = THREE.MathUtils.lerp(m.position.z, tz, delta * 5);
    m.position.y = THREE.MathUtils.lerp(m.position.y, ty, delta * 5);
    m.scale.setScalar(THREE.MathUtils.lerp(m.scale.x, ts, delta * 6));

    // Face origin (camera is at 0,0,8)
    const angle = Math.atan2(m.position.x, m.position.z);
    m.rotation.y = THREE.MathUtils.lerp(m.rotation.y, angle, delta * 6);
  });

  return (
    <mesh
      ref={meshRef}
      position={[0, 0, RADIUS]}
      onClick={(e) => { e.stopPropagation(); onSelect(); }}
      onPointerOver={() => { setHovered(true); document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = ""; }}
    >
      <planeGeometry args={[1.2, 1.8]} />
      <meshBasicMaterial map={texture} side={THREE.DoubleSide} />
    </mesh>
  );
}

// ── Ambient light + scene ────────────────────────────────────────────────────
function Scene({
  books,
  active,
  onSelect,
}: {
  books: HomeBook[];
  active: number;
  onSelect: (i: number) => void;
}) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 5]} intensity={0.5} />
      {books.map((book, i) => (
        <BookMesh
          key={book.title + i}
          book={book}
          index={i}
          active={active}
          total={books.length}
          onSelect={() => onSelect(i)}
        />
      ))}
    </>
  );
}

// ── Metric helper ─────────────────────────────────────────────────────────────
function Metric({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-1.5 text-xs">
      {icon}
      <span className="text-white/35">{label}:</span>
      {children}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function R3fDemoPage() {
  const [active, setActive] = useState(0);
  const [fps, setFps] = useState(60);
  const [loadTime, setLoadTime] = useState<number | null>(null);
  const mountTime = useRef(Date.now());

  useEffect(() => {
    setLoadTime(Date.now() - mountTime.current);
  }, []);

  const go = useCallback(
    (dir: 1 | -1) =>
      setActive((a) => (a + dir + DEMO_BOOKS.length) % DEMO_BOOKS.length),
    []
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  return (
    <div className="flex min-h-screen flex-col bg-[#050505] text-white">
      {/* ── Header ── */}
      <header className="flex items-center justify-between border-b border-white/8 px-6 py-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Folio
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/demo/css"
            className="rounded-full border border-white/12 px-3 py-1 text-xs text-white/50 transition-all hover:border-white/25 hover:text-white"
          >
            ← CSS 3D
          </Link>
          <span className="rounded-full border border-violet-500/40 bg-violet-500/15 px-3 py-1 text-xs font-semibold text-violet-400">
            React Three Fiber
          </span>
        </div>
      </header>

      {/* ── Metrics ── */}
      <div className="flex items-center justify-center gap-6 border-b border-white/5 bg-black/20 px-6 py-2.5">
        <Metric
          icon={<Zap className="h-3.5 w-3.5 text-yellow-400" />}
          label="FPS"
        >
          <span
            className={`font-mono font-bold tabular-nums ${
              fps >= 55
                ? "text-green-400"
                : fps >= 30
                ? "text-yellow-400"
                : "text-red-400"
            }`}
          >
            {fps}
          </span>
        </Metric>
        <div className="h-3 w-px bg-white/10" />
        <Metric
          icon={<Clock className="h-3.5 w-3.5 text-blue-400" />}
          label="Загрузка"
        >
          <span className="font-mono font-bold tabular-nums text-blue-400">
            {loadTime !== null ? `${loadTime}мс` : "…"}
          </span>
        </Metric>
        <div className="h-3 w-px bg-white/10" />
        <span className="hidden text-xs text-white/20 sm:block">
          WebGL · Three.js · React Three Fiber
        </span>
      </div>

      {/* ── Title ── */}
      <div className="pt-10 pb-4 text-center">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/25">
          Демо Б
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">
          React Three Fiber
        </h1>
        <p className="mt-2 text-sm text-white/35">
          WebGL-рендеринг · ← → или клик по книге в сцене
        </p>
      </div>

      {/* ── Canvas ── */}
      <div className="mx-auto w-full max-w-3xl flex-1 px-4" style={{ minHeight: 360 }}>
        <Canvas
          camera={{ position: [0, 0.5, 8], fov: 50 }}
          style={{ borderRadius: 16 }}
          gl={{ antialias: true }}
        >
          <FPSTracker onFps={setFps} />
          <Scene
            books={DEMO_BOOKS}
            active={active}
            onSelect={setActive}
          />
        </Canvas>
      </div>

      {/* ── Book label ── */}
      <div className="min-h-12 py-3 text-center transition-all duration-300">
        <p className="text-base font-semibold">{DEMO_BOOKS[active].title}</p>
        <p className="text-sm text-white/40">{DEMO_BOOKS[active].author}</p>
      </div>

      {/* ── Controls ── */}
      <div className="flex items-center justify-center gap-5 pb-6">
        <button
          onClick={() => go(-1)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/5 transition-colors hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex gap-1.5">
          {DEMO_BOOKS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === active ? "w-6 bg-white" : "w-1.5 bg-white/20"
              }`}
            />
          ))}
        </div>
        <button
          onClick={() => go(1)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/5 transition-colors hover:bg-white/10"
        >
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* ── Footer CTA ── */}
      <div className="border-t border-white/8 px-6 py-6 text-center">
        <p className="mb-4 text-xs text-white/30">
          Сравни оба варианта и выбери лучший для главной страницы Folio
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/demo/css"
            className="rounded-full border border-white/15 px-5 py-2 text-sm text-white/55 transition-colors hover:text-white"
          >
            ← Смотреть CSS версию
          </Link>
          <Link
            href="/"
            className="rounded-full bg-violet-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-violet-500"
          >
            Выбрать R3F вариант ✓
          </Link>
        </div>
      </div>
    </div>
  );
}
