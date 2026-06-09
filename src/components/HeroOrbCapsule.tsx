"use client";

import { motion, useAnimationFrame } from "framer-motion";
import { useState } from "react";
import { OrbCapsule } from "./orb/OrbCapsule";

/** Idle listening orb for the hero — same capsule as the desktop app. */
export function HeroOrbCapsule() {
  const [activity, setActivity] = useState(0.32);

  useAnimationFrame((time) => {
    const t = time / 1000;
    const base = 0.32 + Math.sin(t * 2.5) * 0.16;
    const burst = Math.sin(t * 4.8) > 0.9 ? 0.22 : 0;
    const swell = Math.sin(t * 1.35 + 0.6) * 0.07;
    setActivity(Math.min(1.05, Math.max(0.22, base + burst + swell)));
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.62, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="mt-8 flex justify-center"
      aria-hidden
    >
      <OrbCapsule
        status="listening"
        activity={activity}
        scale={1.18}
        tilt={0}
        shadowVariant="warm"
      />
    </motion.div>
  );
}
