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
    baseY: 0.44,
    amp: 0.1,
    freq: 1.1,
    speed: 0.35,
    phase: 0,
    color: BRAND,
    alpha: 0.38,
    step: 8,
    rows: 7,
    spread: 0.052,
    size: 1.35,
  },
  {
    baseY: 0.4,
    amp: 0.082,
    freq: 1.45,
    speed: 0.48,
    phase: 1.8,
    color: PURPLE,
    alpha: 0.45,
    step: 7,
    rows: 8,
    spread: 0.048,
    size: 1.2,
  },
  {
    baseY: 0.46,
    amp: 0.066,
    freq: 1.75,
    speed: 0.4,
    phase: 3.2,
    color: VIOLET,
    alpha: 0.34,
    step: 9,
    rows: 6,
    spread: 0.04,
    size: 1.1,
  },
  {
    baseY: 0.38,
    amp: 0.05,
    freq: 2.1,
    speed: 0.52,
    phase: 0.6,
    color: PURPLE,
    alpha: 0.4,
    step: 6.5,
    rows: 9,
    spread: 0.038,
    size: 1,
  },
];

const WAVES_REDUCED: WaveConfig[] = [
  {
    baseY: 0.44,
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
    baseY: 0.4,
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

/**
 * One soft dot (outer glow, halo, core) pre-rendered per wave colour. Stamping this with
 * drawImage is far cheaper than filling three arc paths per particle, which at ~9k particles a
 * frame was the main cause of hero jank.
 */
type Sprite = { img: HTMLCanvasElement; radius: number };
const SPRITE_PX = 32;

function makeSprite(color: { r: number; g: number; b: number }): Sprite {
  const img = document.createElement("canvas");
  img.width = img.height = SPRITE_PX;
  const c = img.getContext("2d")!;
  const mid = SPRITE_PX / 2;
  // Radii relative to the outer glow (2.1 : 1.1 : 0.42), alphas relative to the core.
  const layers: Array<[number, number]> = [[1, 0.07 / 0.75], [1.1 / 2.1, 0.22 / 0.75], [0.42 / 2.1, 1]];
  for (const [r, a] of layers) {
    c.beginPath();
    c.arc(mid, mid, r * mid, 0, Math.PI * 2);
    c.fillStyle = rgba(color, a);
    c.fill();
  }
  return { img, radius: 2.1 };
}

function drawWaveParticles(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  wave: WaveConfig,
  sprite: Sprite,
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
      const alpha = Math.min(
        0.85,
        0.75 * wave.alpha * fade * sparkle * (0.55 + 0.45 * (1 - Math.abs(rowT - 0.5) * 1.6)),
      );
      if (alpha < 0.02) continue;
      const size = wave.size * (0.65 + 0.35 * Math.sin(col * 0.33 + row));
      const r = size * sprite.radius;
      if (r < 0.2) continue;

      ctx.globalAlpha = alpha;
      ctx.drawImage(sprite.img, x - r, y - r, r * 2, r * 2);
    }
  }
}

function drawFrame(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  waves: WaveConfig[],
  sprites: Sprite[],
) {
  ctx.globalAlpha = 1;
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

  waves.forEach((wave, i) => drawWaveParticles(ctx, width, height, time, wave, sprites[i]));
  ctx.globalAlpha = 1;
}

/** Wide particle waves, flowing dots that blend into ribbons, lazur purple palette. */
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
    const sprites = waves.map((w) => makeSprite(w.color));
    const maxDpr = isReduced ? 1 : 1.5;

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
        drawFrame(ctx, rw, rh, 0, waves, sprites);
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
    // A slow ambient wave reads the same at 30fps and costs half the main thread.
    const FRAME_MS = 1000 / 30;
    let last = -Infinity;
    const tick = (now: number) => {
      if (cancelled || pausedRef.current) return;
      rafRef.current = requestAnimationFrame(tick);
      if (now - last < FRAME_MS - 1) return;
      last = now;
      const t = (now - start) / 1000;
      const time = reducedMotionRef.current ? 0 : t;
      const { w, h } = sizeRef.current;
      drawFrame(ctx, w, h, time, waves, sprites);
      // Reduced motion: one still frame is enough.
      if (reducedMotionRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      }
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
      className="hero-fluid-waves pointer-events-none absolute inset-x-0 top-[30%] z-[1] h-[min(460px,52vh)] w-full -translate-y-1/2"
      aria-hidden
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
