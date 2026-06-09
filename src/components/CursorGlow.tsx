"use client";

import { motion, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

/** Soft pointer glow — desktop only, respects reduced motion. */
export function CursorGlow() {
  const [enabled, setEnabled] = useState(false);
  const x = useSpring(0, { stiffness: 120, damping: 22, mass: 0.4 });
  const y = useSpring(0, { stiffness: 120, damping: 22, mass: 0.4 });

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (reduced || !fine) return;

    setEnabled(true);
    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[1] hidden md:block" aria-hidden>
      <motion.div
        className="absolute h-[min(480px,50vw)] w-[min(480px,50vw)] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          x,
          y,
          background:
            "radial-gradient(circle, rgba(28,25,23,0.045) 0%, rgba(28,25,23,0.015) 40%, transparent 70%)",
        }}
      />
    </div>
  );
}
