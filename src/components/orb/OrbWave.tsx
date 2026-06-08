"use client";

import { useRef } from "react";
import { motion, useAnimationFrame } from "framer-motion";

const WAVE_BARS = 20;

type BarBand = "low" | "mid" | "high";

type BarConfig = {
  band: BarBand;
  phase: number;
  freq: number;
  idleAmp: number;
  reactGain: number;
  mix: { low: number; mid: number; high: number };
};

function buildBarConfigs(): BarConfig[] {
  return Array.from({ length: WAVE_BARS }, (_, i) => {
    const band: BarBand = i < 7 ? "low" : i < 14 ? "mid" : "high";
    const spread = i % 5;
    const t = i / (WAVE_BARS - 1);

    if (band === "low") {
      return {
        band,
        phase: i * 0.85,
        freq: 0.65 + spread * 0.12,
        idleAmp: 4 + (i % 3),
        reactGain: 1.05 + spread * 0.08,
        mix: { low: 0.72, mid: 0.22, high: 0.06 },
      };
    }
    if (band === "mid") {
      return {
        band,
        phase: i * 1.15,
        freq: 1.35 + spread * 0.2,
        idleAmp: 4 + (i % 3),
        reactGain: 1.0 + spread * 0.09,
        mix: { low: 0.2, mid: 0.62, high: 0.18 },
      };
    }
    return {
      band,
      phase: i * 1.45 + t * 0.8,
      freq: 2.1 + spread * 0.28,
      idleAmp: 3.5 + (i % 4),
      reactGain: 0.88 + spread * 0.1,
      mix: { low: 0.08, mid: 0.28, high: 0.64 },
    };
  });
}

const BAR_CONFIGS = buildBarConfigs();

function bandColor(band: BarBand, speaking: boolean): string {
  if (speaking) {
    if (band === "low")
      return "linear-gradient(to top, rgba(58,58,60,0.55), rgba(28,28,30,0.96))";
    if (band === "mid")
      return "linear-gradient(to top, rgba(72,72,74,0.5), rgba(44,44,46,0.92))";
    return "linear-gradient(to top, rgba(99,99,102,0.45), rgba(58,58,60,0.88))";
  }
  return "linear-gradient(to top, rgba(142,142,147,0.32), rgba(72,72,74,0.68))";
}

function waveGlow(speaking: boolean): string {
  return speaking
    ? "0 0 5px rgba(28,28,30,0.45)"
    : "0 0 4px rgba(72,72,74,0.25)";
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function OrbListeningWave({ activity }: { activity: number }) {
  const barRefs = useRef<(HTMLDivElement | null)[]>([]);
  const envelopes = useRef({ low: 0, mid: 0, high: 0, raw: 0 });

  useAnimationFrame((time) => {
    const t = time / 1000;
    const target = Math.min(activity, 1.5);
    const e = envelopes.current;

    e.raw = target;
    e.low = lerp(e.low, target, target > e.low ? 0.11 : 0.06);
    e.mid = lerp(e.mid, target, target > e.mid ? 0.18 : 0.1);
    e.high = lerp(e.high, target, target > e.high ? 0.28 : 0.14);

    const speaking = e.mid > 0.035 || e.low > 0.03;

    BAR_CONFIGS.forEach((cfg, i) => {
      const el = barRefs.current[i];
      if (!el) return;

      const voice =
        cfg.mix.low * e.low + cfg.mix.mid * e.mid + cfg.mix.high * e.high;
      const waveA = Math.sin(t * cfg.freq * Math.PI * 2 + cfg.phase);
      const waveB = Math.sin(t * cfg.freq * 1.55 * Math.PI * 2 + cfg.phase * 1.2);
      const idle = cfg.idleAmp + cfg.idleAmp * 0.4 * waveA;

      let react = 0;
      if (speaking) {
        const body = 6 + Math.abs(waveB) * 5;
        const sparkle = Math.abs(waveA) * 3;
        react = voice * cfg.reactGain * (body + sparkle);
      }

      const height = Math.min(22, Math.max(3, idle + react));
      el.style.height = `${height}px`;
      el.style.opacity = speaking
        ? `${0.42 + voice * 0.45 + Math.abs(waveA) * 0.12}`
        : `${0.18 + Math.abs(waveA) * 0.18}`;
    });
  });

  return (
    <div className="absolute inset-x-0 flex h-full items-center justify-center gap-[2px] px-3">
      {BAR_CONFIGS.map((cfg, i) => (
        <div
          key={i}
          ref={(el) => {
            barRefs.current[i] = el;
          }}
          className="w-[2px] origin-center rounded-full"
          style={{
            height: 4,
            background: bandColor(cfg.band, activity > 0.04),
            boxShadow: waveGlow(activity > 0.04),
          }}
        />
      ))}
    </div>
  );
}

function ProcessingCenterLoader() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 0.85, repeat: Infinity, ease: "linear" }}
        className="rounded-full"
        style={{
          width: 16,
          height: 16,
          background:
            "conic-gradient(from 0deg, transparent 0deg, transparent 55deg, rgba(191,219,254,0.95) 120deg, rgba(167,139,250,1) 200deg, transparent 300deg)",
          WebkitMask:
            "radial-gradient(farthest-side, transparent calc(100% - 2.5px), #000 calc(100% - 1.5px))",
          mask: "radial-gradient(farthest-side, transparent calc(100% - 2.5px), #000 calc(100% - 1.5px))",
          filter: "drop-shadow(0 0 4px rgba(129,140,248,0.9))",
        }}
      />
      <motion.div
        animate={{ scale: [0.9, 1.08, 0.9], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute rounded-full"
        style={{
          width: 5,
          height: 5,
          background:
            "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(167,139,250,0.4) 70%, transparent 100%)",
        }}
      />
    </div>
  );
}

export function OrbProcessingWave() {
  const barRefs = useRef<(HTMLDivElement | null)[]>([]);

  useAnimationFrame((time) => {
    const t = time / 1000;
    const sweep = (t * 1.35) % (WAVE_BARS + 4);

    BAR_CONFIGS.forEach((cfg, i) => {
      const el = barRefs.current[i];
      if (!el) return;

      const dist = Math.abs(i - sweep);
      const pulse = Math.max(0, 1 - dist / 3.2);
      const breathe =
        0.55 + 0.45 * Math.sin(t * cfg.freq * Math.PI * 2 + cfg.phase);
      const shimmer = 0.35 + 0.65 * Math.sin(t * 2.4 + i * 0.55);

      const height = Math.min(16, Math.max(3, 4 + pulse * 11 * shimmer * breathe));
      const opacity = 0.28 + pulse * 0.42 + breathe * 0.12;

      el.style.height = `${height}px`;
      el.style.opacity = `${opacity}`;
    });
  });

  return (
    <div className="absolute inset-0">
      <div className="absolute inset-x-0 flex h-full items-center justify-center gap-[2px] px-3 opacity-90">
        {BAR_CONFIGS.map((_, i) => (
          <div
            key={i}
            ref={(el) => {
              barRefs.current[i] = el;
            }}
            className="w-[2px] origin-center rounded-full"
            style={{
              height: 5,
              background:
                "linear-gradient(to top, rgba(96,165,250,0.45), rgba(196,181,253,0.85))",
              boxShadow: "0 0 5px rgba(129,140,248,0.5)",
            }}
          />
        ))}
      </div>
      <ProcessingCenterLoader />
    </div>
  );
}
