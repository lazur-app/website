"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

const LETTER_POOL = "abcdefghijklmnopqrstuvwxyz";
const PARTICLE_COUNT = 42;

const RAW = "um so like can you review the deck";
const POLISHED = "Could you review the deck when you have a moment?";

type Phase = "pop" | "scatter" | "reveal";

type LetterParticle = {
  id: number;
  char: string;
  scatter: { x: number; y: number; rotate: number };
  motion: { duration: number; delay: number; fadeDelay: number };
  visual: { opacity: number; scale: number };
};

function buildParticles(count: number): LetterParticle[] {
  return Array.from({ length: count }, (_, i) => {
    const angle = Math.random() * Math.PI * 2;
    const radius = 35 + Math.random() * 95;
    const jitterX = (Math.random() - 0.5) * 70;
    const jitterY = (Math.random() - 0.5) * 55;

    return {
      id: i,
      char: LETTER_POOL[Math.floor(Math.random() * LETTER_POOL.length)],
      scatter: {
        x: Math.cos(angle) * radius + jitterX,
        y: Math.sin(angle) * radius + jitterY,
        rotate: (Math.random() - 0.5) * 96,
      },
      motion: {
        duration: 0.32 + Math.random() * 0.62,
        delay: Math.random() * 0.14,
        fadeDelay: Math.random() * 0.2,
      },
      visual: {
        opacity: 0.72 + Math.random() * 0.22,
        scale: 0.85 + Math.random() * 0.35,
      },
    };
  });
}

type CapsulePopShowProps = {
  active: boolean;
  onDone: () => void;
};

export function CapsulePopShow({ active, onDone }: CapsulePopShowProps) {
  const [phase, setPhase] = useState<Phase>("pop");
  const [showPolished, setShowPolished] = useState(false);
  const timersRef = useRef<number[]>([]);
  const particles = useMemo(() => buildParticles(PARTICLE_COUNT), []);

  useEffect(() => {
    if (!active) {
      setPhase("pop");
      setShowPolished(false);
      return;
    }

    const schedule = (fn: () => void, ms: number) => {
      timersRef.current.push(window.setTimeout(fn, ms));
    };

    setPhase("pop");
    setShowPolished(false);
    schedule(() => setPhase("scatter"), 280);
    schedule(() => setPhase("reveal"), 900);
    schedule(() => setShowPolished(true), 2800);
    schedule(() => onDone(), 7200);

    return () => {
      timersRef.current.forEach((id) => window.clearTimeout(id));
      timersRef.current = [];
    };
  }, [active, onDone]);

  if (!active) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible">
      <AnimatePresence>
        {(phase === "pop" || phase === "scatter") && (
          <>
            {[0, 1].map((ring) => (
              <motion.span
                key={ring}
                className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--brand)]/40"
                initial={{ scale: 0.5, opacity: 0.35 }}
                animate={{ scale: 2.8 + ring * 0.7, opacity: 0 }}
                transition={{
                  duration: 0.8 + ring * 0.12,
                  delay: ring * 0.06,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {particles.map((particle) => {
        const isReveal = phase === "reveal";

        return (
          <motion.span
            key={particle.id}
            className="absolute left-1/2 top-1/2 select-none font-mono text-[10px] font-medium text-[var(--brand)]/80"
            initial={{ x: 0, y: 0, opacity: 0, scale: 0.3, rotate: 0 }}
            animate={{
              x: particle.scatter.x,
              y: particle.scatter.y,
              opacity: isReveal ? 0 : particle.visual.opacity,
              scale: isReveal ? 0.5 : particle.visual.scale,
              rotate: particle.scatter.rotate,
              filter: isReveal ? "blur(4px)" : "blur(0px)",
            }}
            transition={{
              duration: isReveal ? 0.45 : particle.motion.duration,
              delay: isReveal ? particle.motion.fadeDelay : particle.motion.delay,
              ease: isReveal
                ? [0.4, 0, 0.2, 1]
                : [0.12, 0.82, 0.22, 1],
            }}
          >
            {particle.char}
          </motion.span>
        );
      })}

      <AnimatePresence>
        {phase === "reveal" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.94, width: 112 }}
            animate={{ opacity: 1, scale: 1, width: "min(300px, 100%)" }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-lg border border-[var(--border)] bg-white px-4 py-3.5 text-left shadow-[0_4px_24px_rgba(28,25,23,0.07)]"
          >
            <AnimatePresence mode="wait">
              <motion.p
                key={showPolished ? "polished-label" : "raw-label"}
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3 }}
                transition={{ duration: 0.2 }}
                className={`mb-1.5 text-[11px] font-medium ${
                  showPolished
                    ? "text-[var(--brand)]"
                    : "text-[var(--foreground-faint)]"
                }`}
              >
                {showPolished ? "What you meant" : "What you said"}
              </motion.p>
            </AnimatePresence>
            <AnimatePresence mode="wait">
              {!showPolished ? (
                <motion.p
                  key="raw"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.35 }}
                  className="text-[13px] italic leading-relaxed text-[var(--foreground-muted)]"
                >
                  {RAW}
                </motion.p>
              ) : (
                <motion.p
                  key="polished"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="text-[13px] leading-relaxed text-[var(--foreground)]"
                >
                  {POLISHED}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
