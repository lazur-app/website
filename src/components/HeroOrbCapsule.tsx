"use client";

import { AnimatePresence, motion, useAnimationFrame } from "framer-motion";
import { useCallback, useState } from "react";
import { CapsulePopShow } from "./hero/CapsulePopShow";
import { OrbCapsule } from "./orb/OrbCapsule";

/** Animation stage height — overflows upward so layout stays tight. */
const CAPSULE_STAGE_HEIGHT = 176;
const CAPSULE_LAYOUT_HEIGHT = 56;

type HeroOrbCapsuleProps = {
  className?: string;
  scale?: number;
};

/** Interactive hero capsule — click to trigger letter burst demo. */
export function HeroOrbCapsule({
  className = "",
  scale = 1.05,
}: HeroOrbCapsuleProps) {
  const [activity, setActivity] = useState(0.32);
  const [active, setActive] = useState(false);
  const [runId, setRunId] = useState(0);

  useAnimationFrame((time) => {
    if (active) return;
    const t = time / 1000;
    const base = 0.32 + Math.sin(t * 2.5) * 0.16;
    const burst = Math.sin(t * 4.8) > 0.9 ? 0.22 : 0;
    const swell = Math.sin(t * 1.35 + 0.6) * 0.07;
    setActivity(Math.min(1.05, Math.max(0.22, base + burst + swell)));
  });

  const handleDone = useCallback(() => {
    setActive(false);
  }, []);

  const handleClick = () => {
    if (active) {
      setActive(false);
      return;
    }
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) return;

    setRunId((k) => k + 1);
    setActive(true);
    setActivity(0.95);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.85, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className={`relative mx-auto flex w-full max-w-md flex-col items-center ${className}`}
    >
      <div
        className="relative w-full overflow-visible"
        style={{ height: CAPSULE_LAYOUT_HEIGHT }}
      >
        <div
          className="pointer-events-none absolute bottom-0 left-0 w-full overflow-visible"
          style={{ height: CAPSULE_STAGE_HEIGHT }}
        >
          <div
            className="absolute inset-0"
            style={{
              transform: `translateY(${CAPSULE_STAGE_HEIGHT / 2 - CAPSULE_LAYOUT_HEIGHT / 2}px)`,
            }}
          >
            <CapsulePopShow key={runId} active={active} onDone={handleDone} />
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 flex justify-center">
          <motion.button
            type="button"
            onClick={handleClick}
            aria-label={active ? "Close voice demo" : "Try voice demo"}
            aria-expanded={active}
            className="relative z-20 cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2"
            animate={{
              scale: active ? [1, 1.1, 0] : 1,
              opacity: active ? [1, 1, 0] : 1,
            }}
            transition={{
              duration: active ? 0.4 : 0.3,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <AnimatePresence mode="wait">
              {!active && (
                <motion.span
                  key="capsule"
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.2 }}
                >
                  <OrbCapsule
                    status="listening"
                    activity={activity}
                    scale={scale}
                    tilt={0}
                    shadowVariant="warm"
                  />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      <p
        className={`mt-2.5 text-center text-[11px] font-medium tracking-wide text-[var(--foreground-muted)] transition-opacity duration-200 ${
          active ? "opacity-0" : "opacity-70"
        }`}
        aria-hidden={active}
      >
        Click to try
      </p>
    </motion.div>
  );
}
