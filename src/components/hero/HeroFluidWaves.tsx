"use client";

import { useEffect, useRef } from "react";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";

const BRAND = { r: 107, g: 75, b: 252 };
const PURPLE = { r: 168, g: 85, b: 247 };
const VIOLET = { r: 124, g: 58, b: 237 };

function rgba(c: { r: number; g: number; b: number }, a: number) {
  return `rgba(${c.r},${c.g},${c.b},${a})`;
}

type WaveConfig = {
  baseY: number;
  amp: number;
  freq: number;
  speed: number;
  phase: number;
  color: { r: number; g: number; b: number };
  alpha: number;
  step: number;
  rows: number;
  spread: number;
  size: number;
};

const WAVES_FULL: WaveConfig[] = [
  {
    baseY: 0.52,
    amp: 0.1,
    freq: 1.1,
    speed: 0.35,
    phase: 0,
    color: BRAND,
    alpha: 0.38,
    step: 5,
    rows: 7,
    spread: 0.052,
    size: 1.35,
  },
  {
    baseY: 0.48,
    amp: 0.082,
    freq: 1.45,
    speed: 0.48,
    phase: 1.8,
    color: PURPLE,
    alpha: 0.45,
    step: 4.5,
    rows: 8,
    spread: 0.048,
    size: 1.2,
  },
  {
    baseY: 0.54,
    amp: 0.066,
    freq: 1.75,
    speed: 0.4,
    phase: 3.2,
    color: VIOLET,
    alpha: 0.34,
    step: 5.5,
    rows: 6,
    spread: 0.04,
    size: 1.1,
  },
  {
    baseY: 0.46,
    amp: 0.05,
    freq: 2.1,
    speed: 0.52,
    phase: 0.6,
    color: PURPLE,
    alpha: 0.4,
    step: 4,
    rows: 9,
    spread: 0.038,
    size: 1,
  },
];

const WAVES_REDUCED: WaveConfig[] = [
  {
    baseY: 0.52,
    amp: 0.1,
    freq: 1.1,
    speed: 0.35,
    phase: 0,
    color: BRAND,
    alpha: 0.38,
    step: 8,
    rows: 5,
    spread: 0.052,
    size: 1.2,
  },
  {
    baseY: 0.48,
    amp: 0.082,
    freq: 1.45,
    speed: 0.48,
    phase: 1.8,
    color: PURPLE,
    alpha: 0.42,
    step: 7,
    rows: 5,
    spread: 0.048,
    size: 1.05,
  },
];

function edgeFade(x: number, width: number) {
  const t = x / width;
  if (t < 0.1) return t / 0.1;
  if (t > 0.9) return (1 - t) / 0.1;
  return 1;
}

function waveY(
  x: number,
  width: number,
  height: number,
  time: number,
  wave: WaveConfig,
) {
  const nx = (x / width) * Math.PI * 2;
  const cy = height * wave.baseY;
  const a = height * wave.amp;
  const p = time * wave.speed + wave.phase;

  return (
    cy +
    Math.sin(nx * wave.freq + p) * a +
    Math.sin(nx * wave.freq * 1.7 - p * 0.75) * a * 0.38 +
    Math.cos(nx * wave.freq * 0.55 + p * 0.4) * a * 0.18
  );
}

function drawParticle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: { r: number; g: number; b: number },
  alpha: number,
) {
  if (alpha < 0.02 || size < 0.2) return;

  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fillStyle = rgba(color, alpha);
  ctx.fill();
}

function drawWaveParticles(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  wave: WaveConfig,
) {
  const band = height * wave.spread;

  for (let x = -20; x <= width + 20; x += wave.step) {
    const fade = edgeFade(Math.max(0, Math.min(width, x)), width);
    if (fade < 0.02) continue;

    const centerY = waveY(x, width, height, time, wave);
    const col = x / wave.step;

    for (let row = 0; row < wave.rows; row++) {
      const rowT = row / Math.max(1, wave.rows - 1);
      const offset = (rowT - 0.5) * band;
      const wobble =
        Math.sin(col * 0.55 + row * 1.4 + time * 1.15) * band * 0.12 +
        Math.cos(col * 0.28 - row * 0.9 + time * 0.7) * band * 0.08;

      const y = centerY + offset + wobble;
      const sparkle =
        0.45 + 0.55 * Math.abs(Math.sin(col * 0.42 + row * 0.85 + wave.phase));
      const alpha =
        wave.alpha * fade * sparkle * (0.55 + 0.45 * (1 - Math.abs(rowT - 0.5) * 1.6));
      const size = wave.size * (0.65 + 0.35 * Math.sin(col * 0.33 + row));

      drawParticle(ctx, x, y, size * 2.1, wave.color, alpha * 0.07);
      drawParticle(ctx, x, y, size * 1.1, wave.color, alpha * 0.22);
      drawParticle(ctx, x, y, size * 0.42, wave.color, Math.min(0.85, alpha * 0.75));
    }
  }
}

function drawFrame(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  waves: WaveConfig[],
) {
  ctx.clearRect(0, 0, width, height);

  const wash = ctx.createRadialGradient(
    width * 0.5,
    height * 0.5,
    0,
    width * 0.5,
    height * 0.5,
    width * 0.55,
  );
  wash.addColorStop(0, rgba(PURPLE, 0.04));
  wash.addColorStop(0.5, rgba(BRAND, 0.02));
  wash.addColorStop(1, "transparent");
  ctx.fillStyle = wash;
  ctx.fillRect(0, 0, width, height);

  ctx.globalCompositeOperation = "source-over";

  for (const wave of waves) {
    drawWaveParticles(ctx, width, height, time, wave);
  }
}

/** Wide particle waves — flowing dots that blend into ribbons, lazur purple palette. */
export function HeroFluidWaves() {
  const { isReduced } = usePerformanceTier();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const sizeRef = useRef({ w: 0, h: 0 });
  const pausedRef = useRef(false);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    reducedMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const waves = isReduced ? WAVES_REDUCED : WAVES_FULL;
    const maxDpr = isReduced ? 1 : 2;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
      sizeRef.current = { w, h };
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (pausedRef.current) {
        const { w: rw, h: rh } = sizeRef.current;
        drawFrame(ctx, rw, rh, 0, waves);
      }
    };

    const setPaused = (paused: boolean) => {
      if (pausedRef.current === paused) return;
      pausedRef.current = paused;
      if (!paused) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        const hidden = document.visibilityState === "hidden";
        setPaused(hidden || !entry.isIntersecting);
      },
      { root: null, rootMargin: "10% 0px", threshold: 0 },
    );
    observer.observe(container);

    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        setPaused(true);
        return;
      }
      const rect = container.getBoundingClientRect();
      const inView =
        rect.bottom > 0 && rect.top < window.innerHeight;
      setPaused(!inView);
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    let cancelled = false;
    const start = performance.now();
    const tick = (now: number) => {
      if (cancelled || pausedRef.current) return;
      const t = (now - start) / 1000;
      const time = reducedMotionRef.current ? 0 : t;
      const { w, h } = sizeRef.current;
      drawFrame(ctx, w, h, time, waves);
      rafRef.current = requestAnimationFrame(tick);
    };

    const begin = () => {
      if (cancelled || pausedRef.current) return;
      rafRef.current = requestAnimationFrame(tick);
    };

    const schedule =
      typeof window.requestIdleCallback === "function"
        ? (cb: () => void) => window.requestIdleCallback(cb, { timeout: 400 })
        : (cb: () => void) => window.setTimeout(cb, 120);

    schedule(begin);

    return () => {
      cancelled = true;
      observer.disconnect();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      cancelAnimationFrame(rafRef.current);
    };
  }, [isReduced]);

  return (
    <div
      ref={containerRef}
      className="hero-fluid-waves pointer-events-none absolute inset-x-0 top-1/2 z-[2] h-[min(360px,44vh)] -translate-y-1/2"
      aria-hidden
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
