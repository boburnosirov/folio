"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";

export function CursorFollower() {
  const isMobile = useMediaQuery("(max-width: 1024px)");
  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const springX = useSpring(x, { stiffness: 80, damping: 25 });
  const springY = useSpring(y, { stiffness: 80, damping: 25 });

  useEffect(() => {
    if (isMobile || prefersReducedMotion) return;
    const handle = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, [x, y, isMobile, prefersReducedMotion]);

  if (isMobile || prefersReducedMotion) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[1] hidden lg:block"
      style={{ mixBlendMode: "screen" }}
    >
      <motion.div
        className="absolute rounded-full"
        style={{
          x: springX,
          y: springY,
          width: 320,
          height: 320,
          translateX: "-50%",
          translateY: "-50%",
          background:
            "radial-gradient(circle, oklch(0.72 0.13 78 / 0.06) 0%, transparent 70%)",
          filter: "blur(1px)",
        }}
      />
    </motion.div>
  );
}
