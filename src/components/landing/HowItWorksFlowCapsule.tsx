"use client";

import { useState } from "react";
import { useAnimationFrame } from "framer-motion";
import { OrbCapsule } from "@/components/orb/OrbCapsule";

type HowItWorksFlowCapsuleProps = {
  processing?: boolean;
  /** True while dictation is active — drives the listening waveform. */
  listening?: boolean;
};

export function HowItWorksFlowCapsule({
  processing = false,
  listening = false,
}: HowItWorksFlowCapsuleProps) {
  const [activity, setActivity] = useState(0.26);

  useAnimationFrame((time) => {
    if (processing) return;
    const t = time / 1000;
    if (listening) {
      const base = 0.7 + Math.sin(t * 5.4) * 0.2;
      const burst = Math.sin(t * 9.8) > 0.8 ? 0.22 : 0;
      setActivity(Math.min(1.15, Math.max(0.52, base + burst)));
      return;
    }
    const idle = 0.26 + Math.sin(t * 2.4) * 0.1;
    setActivity(Math.min(0.42, Math.max(0.2, idle)));
  });

  return (
    <OrbCapsule
      status={processing ? "processing" : "listening"}
      activity={activity}
      scale={1}
      shadowVariant="warm"
    />
  );
}
