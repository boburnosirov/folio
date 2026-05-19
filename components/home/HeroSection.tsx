"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { HeroContent } from "./HeroContent";

// ─── Static fallback for mobile / SSR ───────────────────────
function HeroFallback() {
  return (
    <div
      className="absolute inset-0"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 30% 50%, #1a1a3a 0%, #0b0b14 55%, #070710 100%)",
      }}
    >
      {/* CSS-animated floating shapes as book silhouettes */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden>
        {[
          { cls: "left-[8%] top-[20%] w-14 h-20 rotate-6", delay: "0s" },
          { cls: "right-[12%] top-[15%] w-10 h-16 -rotate-8", delay: "0.7s" },
          { cls: "left-[18%] bottom-[25%] w-12 h-18 -rotate-3", delay: "1.4s" },
          { cls: "right-[20%] bottom-[30%] w-16 h-22 rotate-4", delay: "0.4s" },
          { cls: "left-[42%] top-[10%] w-9 h-14 rotate-2", delay: "1.0s" },
        ].map((b, i) => (
          <div
            key={i}
            className={`absolute rounded-sm bg-white/[0.03] border border-white/[0.05] ${b.cls}`}
            style={{
              animation: `floatBook 4s ease-in-out ${b.delay} infinite alternate`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── 3D scene — loaded only on client, never SSR'd ──────────
const HeroScene3D = dynamic(() => import("./HeroScene3D"), {
  ssr: false,
  loading: () => <HeroFallback />,
});

// ─── Hero section ────────────────────────────────────────────
export function HeroSection() {
  const mouseRef = useRef({ x: 0, y: 0 });
  const isMobile = useMediaQuery("(max-width: 768px)");
  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseRef.current.x = (e.clientX - rect.width / 2) / (rect.width / 2);
    mouseRef.current.y = -(e.clientY - rect.height / 2) / (rect.height / 2);
  };

  return (
    <section
      className="relative h-screen w-full overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { mouseRef.current = { x: 0, y: 0 }; }}
    >
      {/* 3D background — mobile gets static fallback */}
      <div className="absolute inset-0">
        {isMobile || prefersReducedMotion ? (
          <HeroFallback />
        ) : (
          <HeroScene3D mouseRef={mouseRef} />
        )}
      </div>

      {/* Vignette — darkens far edges for text legibility, keeps centre open */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 75% 85% at 50% 45%, transparent 0%, rgba(11,11,18,0.65) 100%)",
        }}
        aria-hidden
      />

      {/* Text content */}
      <HeroContent mouseRef={mouseRef} />
    </section>
  );
}
