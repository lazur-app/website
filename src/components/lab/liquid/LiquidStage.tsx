"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { createLiquid, type LiquidHandle } from "./engine";
import { DH, DW } from "./shapes";
import styles from "./liquid.module.css";

/**
 * The centre stage of the /lab/5 hero: one blob of liquid chrome that is the word "lazur", then a
 * voice waveform, a pen straightening a line, a tick and a cursor, each with its verb beside it,
 * and the word again. The metal is drawn by `engine.ts` (WebGL); this component gives it a box,
 * feeds it the pointer, stops it while it is off screen, and writes the verbs.
 *
 * With reduced motion the word is drawn once and stays. Without WebGL a drawn chrome word (plain
 * SVG gradients, no filters) takes its place.
 */

/** In loop order after the word. */
const VERBS = ["transcribes", "remembers", "executes", "teaches"];

/** The silver the chrome stickers use, for the drawn fallback. */
const SILVER: [number, string][] = [[0, "#ffffff"], [0.16, "#e3ecf7"], [0.4, "#93a3bb"], [0.5, "#2a3142"], [0.56, "#12151e"], [0.62, "#6d7486"], [0.82, "#d5dbe6"], [1, "#ffffff"]];

function DrawnWord() {
  return (
    <svg viewBox={`0 0 ${DW} ${DH}`} className="absolute inset-0 h-full w-full" aria-hidden focusable="false">
      <defs>
        <linearGradient id="liquid-silver" x1="0.3" y1="0" x2="0.5" y2="1">
          {SILVER.map(([offset, color]) => (
            <stop key={offset} offset={offset} stopColor={color} />
          ))}
        </linearGradient>
        <linearGradient id="liquid-rim" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.95" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.1" />
          <stop offset="1" stopColor="#000" stopOpacity="0.5" />
        </linearGradient>
      </defs>
      <g fontFamily="var(--font-unbounded), sans-serif" fontWeight={800} fontSize={212} textAnchor="middle" letterSpacing="-0.02em">
        <text x={DW / 2 + 4} y={DH / 2 + 74} fill="#1c1917" opacity={0.14}>lazur</text>
        <text x={DW / 2} y={DH / 2 + 62} fill="url(#liquid-silver)" stroke="#0b0c11" strokeWidth={9} strokeLinejoin="round" paintOrder="stroke">lazur</text>
        <text x={DW / 2} y={DH / 2 + 62} fill="none" stroke="url(#liquid-rim)" strokeWidth={3}>lazur</text>
      </g>
    </svg>
  );
}

export function LiquidStage({ className = "" }: { className?: string }) {
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  const [state, setState] = useState<"waiting" | "live" | "drawn">("waiting");
  const [phase, setPhase] = useState(-1);

  useEffect(() => {
    const box = stage.current;
    const surface = canvas.current;
    if (!box || !surface) return;
    let handle: LiquidHandle | null = null;
    let cancelled = false;
    let visible = false;
    const cleanups: (() => void)[] = [];

    const start = async () => {
      // The word is drawn in the headline's face, so wait for it (briefly) before sampling the letters.
      const family = getComputedStyle(box).getPropertyValue("--font-unbounded").trim();
      if (family && document.fonts?.load) {
        await Promise.race([
          document.fonts.load(`800 120px ${family}`, "lazur").catch(() => undefined),
          new Promise((done) => setTimeout(done, 2500)),
        ]);
      }
      if (cancelled) return;
      try {
        handle = createLiquid(surface, {
          fontFamily: family,
          still: Boolean(reduced),
          onPhase: setPhase,
          onLost: () => setState("drawn"),
        });
      } catch {
        handle = null;
      }
      if (!handle) {
        setState("drawn");
        return;
      }
      setState("live");
      handle.setRunning(visible);

      const resizer = new ResizeObserver(() => handle?.resize());
      resizer.observe(surface);
      cleanups.push(() => resizer.disconnect());

      if (!reduced) {
        const move = (event: PointerEvent) => {
          if (event.pointerType === "touch") return;
          const rect = surface.getBoundingClientRect();
          const x = ((event.clientX - rect.left) / rect.width) * DW;
          const y = ((event.clientY - rect.top) / rect.height) * DH;
          const over = x > -40 && x < DW + 40 && y > -40 && y < DH + 40;
          handle?.setPointer((event.clientX / window.innerWidth) * 2 - 1, (event.clientY / window.innerHeight) * 2 - 1, over ? { x, y } : null);
        };
        window.addEventListener("pointermove", move, { passive: true });
        cleanups.push(() => window.removeEventListener("pointermove", move));
      }
    };

    const watcher = new IntersectionObserver(
      (entries) => {
        visible = entries.some((entry) => entry.isIntersecting);
        handle?.setRunning(visible);
      },
      { rootMargin: "80px 0px" },
    );
    watcher.observe(box);
    void start();

    return () => {
      cancelled = true;
      watcher.disconnect();
      cleanups.forEach((clean) => clean());
      handle?.destroy();
    };
  }, [reduced]);

  return (
    <div ref={stage} className={`${styles.stage} ${className}`}>
      <canvas ref={canvas} aria-hidden className={`${styles.canvas} ${state === "live" ? styles.canvasOn : ""}`} />
      {state === "drawn" ? <DrawnWord /> : null}
      <noscript>
        <DrawnWord />
      </noscript>

      {/* The verb, beside the shape it names. */}
      <div className={styles.verbs} aria-hidden>
        {VERBS.map((verb, n) => (
          <span key={verb} className={`${styles.verb} ${state === "live" && phase === n + 1 ? styles.verbOn : ""}`}>
            <i className={styles.rule} />
            {verb}
          </span>
        ))}
      </div>

      <p className="sr-only">
        An animation: the word lazur in liquid chrome melts and forms, in turn, a voice waveform (Lazur transcribes), a pen straightening
        a wobbly line (Lazur remembers), a tick (Lazur executes) and a pointing cursor (Lazur teaches), then becomes the word again.
      </p>
    </div>
  );
}
