"use client";

import { motion } from "framer-motion";
import { OrbListeningWave, OrbProcessingWave } from "./OrbWave";

const CAPSULE_W = 112;
const CAPSULE_H = 32;
const GLOW_W = 128;
const GLOW_H = 44;

const ORB_FADE_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

type OrbStatus = "listening" | "processing" | "hidden";

type OrbCapsuleProps = {
  status: OrbStatus;
  activity?: number;
  scale?: number;
  tilt?: number;
  shadowVariant?: "default" | "warm";
};

export function OrbCapsule({
  status,
  activity = 0.6,
  scale = 1,
  tilt = 0,
  shadowVariant = "default",
}: OrbCapsuleProps) {
  if (status === "hidden") return null;

  const isListening = status === "listening";
  const isProcessing = status === "processing";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ duration: 0.38, ease: ORB_FADE_EASE }}
      className="relative flex items-center justify-center"
      style={{
        width: GLOW_W * scale,
        height: GLOW_H * scale,
        transform: `rotate(${tilt}deg)`,
      }}
    >
      <motion.div
        animate={{
          opacity: isListening ? [0.45, 0.75, 0.45] : [0.45, 0.7, 0.45],
          scale: [1, 1.04, 1],
        }}
        transition={{
          duration: isListening ? 2.2 : 1.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute rounded-full blur-xl"
        style={{
          width: GLOW_W * scale,
          height: GLOW_H * scale,
          background: isListening
            ? "radial-gradient(circle, rgba(60,60,67,0.18) 0%, rgba(28,28,30,0.06) 55%, transparent 75%)"
            : "radial-gradient(circle, rgba(96,165,250,0.22) 0%, rgba(168,85,247,0.08) 50%, transparent 75%)",
        }}
      />

      <motion.div
        initial={{ width: 0, opacity: 0, scale: 0.92 }}
        animate={{
          width: CAPSULE_W * scale,
          height: CAPSULE_H * scale,
          opacity: 1,
          scale: 1,
        }}
        transition={{
          width: { type: "spring", damping: 22, stiffness: 180 },
          height: { type: "spring", damping: 22, stiffness: 180 },
          opacity: { duration: 0.38, ease: ORB_FADE_EASE },
          scale: { duration: 0.38, ease: ORB_FADE_EASE },
        }}
        className="relative flex items-center justify-center overflow-hidden rounded-full border"
        style={{
          background: "rgba(255, 255, 255, 0.94)",
          borderColor: isListening
            ? "rgba(58, 58, 60, 0.35)"
            : "rgba(129, 140, 248, 0.35)",
          boxShadow: isListening
            ? shadowVariant === "warm"
              ? "3px 6px 18px rgba(28, 28, 30, 0.14), 0 0 0 1px rgba(72, 72, 74, 0.22), inset 0 1px 0 rgba(255,255,255,0.95)"
              : "0 4px 16px rgba(28, 28, 30, 0.1), 0 0 0 1px rgba(72, 72, 74, 0.2), inset 0 1px 0 rgba(255,255,255,0.95)"
            : shadowVariant === "warm"
              ? "4px 8px 20px rgba(99, 102, 241, 0.16), 0 0 0 1px rgba(129, 140, 248, 0.3), inset 0 0 8px rgba(129,140,248,0.06)"
              : "0 4px 16px rgba(99, 102, 241, 0.12), 0 0 0 1px rgba(129, 140, 248, 0.28), inset 0 0 8px rgba(129,140,248,0.05)",
        }}
      >
        {isListening && <OrbListeningWave activity={activity} />}
        {isProcessing && <OrbProcessingWave />}
      </motion.div>
    </motion.div>
  );
}
