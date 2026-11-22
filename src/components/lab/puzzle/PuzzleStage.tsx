"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import { useTrackInView } from "@/hooks/useTrackInView";
import { track } from "@/lib/productAnalytics";
import { LAYER_OUTLINES, OUTLINES, PAD, PIECES, PILL_H, PILL_W, TONES } from "./geometry";
import styles from "./puzzle.module.css";

/**
 * The "Puzzle" hero stage. Four chrome jigsaw pieces, one per thing Lazur does (transcribes,
 * remembers, executes, teaches), drift loose around a plain "Get Lazur" button. One by one they fly in and snap
 * together; on the last lock the four colours turn into one piece of black chrome that reads
 * "Get Lazur" and is the download button. After a beat they pop apart again, and it loops.
 *
 * React draws the plain button once, with the pieces hidden. A single requestAnimationFrame loop
 * then shows the pieces loose and writes transforms and opacities straight onto the layers (nothing
 * re-renders, nothing is laid out again). It stops while the stage is off screen. With reduced
 * motion it never starts, and the stylesheet shows the finished button instead.
 * Add `?freeze=<seconds>` to the address to hold the loop at one moment.
 */

const INK = "#0b0c11";
const LAYER_W = PILL_W + PAD * 2;
const LAYER_H = PILL_H + PAD * 2;
const VIEW_BOX = `${-PAD} ${-PAD} ${LAYER_W} ${LAYER_H}`;

const APPLE =
  "M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z";

/* ------------------------------------------------------------------ the loop, in seconds */

/** When each piece leaves for the tray, and how long the flight takes. */
const FLY = [1.2, 1.75, 2.3, 2.85];
const FLIGHT = 0.6;
/** The four become one. */
const UNITE = FLY[3] + FLIGHT + 0.1;
/** They pop apart. */
const POP = UNITE + 3.5;
/** A moment before that, the one pill gives the four colours back. */
const BREAK = POP - 0.42;
const LOOP = POP + 2.2;
/** Where the loop opens: all four pieces loose. The finished button is never shown first. */
const OPENING = 0;
/** Glints across the whole pill: [start, length]. */
const GLINTS: [number, number][] = [
  [UNITE + 0.02, 0.75],
  [UNITE + 1.9, 0.95],
];

/** The glint bar's width, and how far its lean (20 degrees) carries it over half a layer's height. */
const GLINT_W = 96;
const LEAN = Math.tan((20 * Math.PI) / 180) * (LAYER_H / 2);

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const smooth = (x: number) => {
  const c = clamp01(x);
  return c * c * (3 - 2 * c);
};
/** A damped spring let go at 0, heading for 1. */
function spring(time: number, speed: number, damping: number) {
  if (time <= 0) return 0;
  const wd = speed * Math.sqrt(1 - damping * damping);
  return 1 - Math.exp(-damping * speed * time) * (Math.cos(wd * time) + ((damping * speed) / wd) * Math.sin(wd * time));
}
/** A short ring: 0, a kick, then quiet. */
const ring = (time: number, decay: number, rate: number) => (time <= 0 || time > 0.9 ? 0 : Math.exp(-decay * time) * Math.sin(rate * time));

/** How loose piece `i` is: 1 drifting, 0 locked. Goes a little past 1 as it pops out. */
function looseness(i: number, t: number) {
  if (t < FLY[i]) return spring(t + LOOP - POP, 9, 0.5);
  if (t < FLY[i] + FLIGHT) {
    // Eases off, then is pulled in faster and faster: it lands hard.
    const x = (t - FLY[i]) / FLIGHT;
    return 1 - (0.3 * smooth(x) + 0.7 * x ** 4);
  }
  if (t < POP) return 0;
  return spring(t - POP, 9, 0.5);
}

/** Its tilt, as a share of the loose tilt: it straightens up before it arrives, or the knob would not go in. */
function tilt(i: number, t: number) {
  if (t >= FLY[i] && t < FLY[i] + FLIGHT) return 1 - smooth((t - FLY[i]) / (FLIGHT * 0.78));
  return looseness(i, t);
}

type Pose = { x: number; y: number; r: number };

/** Where a loose piece floats, as an offset from its place in the pill. Wide: either side. Tall: above and below. */
function loosePose(i: number, wide: boolean, half: number): Pose {
  if (wide) {
    return [
      { x: -(0.5 * half + 20), y: -42, r: -13 },
      { x: 0.52 * half + 10, y: -54, r: 10 },
      { x: -(0.42 * half), y: 70, r: 14 },
      { x: 0.4 * half, y: 62, r: -9 },
    ][i];
  }
  return [
    { x: -22, y: -100, r: -9 },
    { x: 22, y: -112, r: 7 },
    { x: -24, y: 104, r: 11 },
    { x: 20, y: 114, r: -6 },
  ][i];
}

/** How far each loose piece follows the pointer, in px: nearer pieces move more. */
const DEPTH = [14, 24, 19, 10];

/** `flat` draws the pieces and the finished button in plain colours: no metal, no glints. */
export function PuzzleStage({ flat = false }: { flat?: boolean }) {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const assemblyRef = useRef<HTMLDivElement>(null);
  const pieceRefs = useRef<(HTMLDivElement | null)[]>([]);
  const shadowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const unitedRef = useRef<HTMLDivElement>(null);
  const glintRef = useRef<HTMLDivElement>(null);
  const barRefs = useRef<(HTMLDivElement | null)[]>([]);
  const haloRef = useRef<HTMLDivElement>(null);

  useTrackInView(sectionRef, "section_viewed", { section: "puzzle_hero" });

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || reduced) return;

    const frozen = new URLSearchParams(window.location.search).get("freeze");
    const wideQuery = window.matchMedia("(min-width: 900px)");
    let wide = wideQuery.matches;
    let half = 600;
    const measure = () => {
      wide = wideQuery.matches;
      half = Math.min(680, Math.max(450, stage.clientWidth / 2));
    };
    measure();

    let t = frozen === null ? OPENING : ((Number(frozen) % LOOP) + LOOP) % LOOP;
    let clock = 0;
    let raf = 0;
    let last = 0;
    let visible = false;
    // The pointer, -1 to 1 across the window, and the same eased.
    const aim = { x: 0, y: 0 };
    const eased = { x: 0, y: 0 };

    const draw = () => {
      let nudgeX = 0;
      let nudgeY = 0;
      // The glint: a bar of light that crosses the whole pill. The first one is also a wipe: behind it the
      // four colours turn into the one black pill. Just before the pop the pill gives the colours back.
      const glint = GLINTS.find(([start, length]) => t >= start && t < start + length);
      const glintX = glint ? -130 + (PILL_W + 190) * smooth((t - glint[0]) / glint[1]) : 0;
      const glintBar = glintRef.current;
      if (glintBar) {
        glintBar.style.opacity = glint ? Math.min(1, Math.sin((Math.PI * (t - glint[0])) / glint[1]) * 1.8).toFixed(3) : "0";
        if (glint) glintBar.style.transform = `translate3d(${glintX.toFixed(1)}px, 0, 0) skewX(-20deg)`;
      }
      const united = unitedRef.current;
      if (united) {
        const wiping = glint === GLINTS[0];
        if (wiping) {
          // The wipe's edge runs down the middle of the bar, leaning with it.
          const mid = glintX + GLINT_W / 2;
          united.style.opacity = "1";
          united.style.clipPath = `polygon(0 0, ${(mid + LEAN).toFixed(1)}px 0, ${(mid - LEAN).toFixed(1)}px 100%, 0 100%)`;
        } else {
          united.style.clipPath = "none";
          united.style.opacity = t < GLINTS[0][0] ? "0" : t < BREAK ? "1" : (1 - smooth((t - BREAK) / 0.16)).toFixed(3);
        }
      }

      PIECES.forEach((piece, i) => {
        const pose = loosePose(i, wide, half);
        const loose = looseness(i, t);
        const float = clamp01(loose);
        const reach = Math.hypot(pose.x, pose.y) || 1;
        // The way it travels home.
        const dirX = -pose.x / reach;
        const dirY = -pose.y / reach;
        const landed = t - (FLY[i] + FLIGHT);
        const kick = t < POP ? ring(landed, 10, 24) : 0;
        const swell = t < POP ? ring(landed, 9, 17) : 0;
        nudgeX += dirX * 2.6 * kick;
        nudgeY += dirY * 2.6 * kick;

        // A slow float of its own while loose.
        const a = clock * (0.52 + i * 0.07) + i * 1.9;
        const driftX = Math.sin(a) * 7;
        const driftY = Math.cos(a * 0.83 + i) * 9;
        const driftR = Math.sin(a * 0.71 + i * 0.6) * 2.4;

        const x = loose * pose.x + float * (driftX + eased.x * DEPTH[i]) + dirX * 5 * kick;
        const y = loose * pose.y + float * (driftY + eased.y * DEPTH[i] * 0.7) + dirY * 5 * kick;
        const r = tilt(i, t) * pose.r + float * driftR;
        const s = 1 + 0.05 * swell;

        const el = pieceRefs.current[i];
        if (el) {
          el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) rotate(${r.toFixed(2)}deg) scale(${s.toFixed(4)})`;
          // Pieces are drawn hidden until this loop has put them in their loose places.
          el.style.opacity = "1";
        }
        // The shadow falls further away and fainter the higher the piece floats.
        const shadow = shadowRefs.current[i];
        if (shadow) {
          shadow.style.transform = `translate3d(${(x + 3 * float).toFixed(2)}px, ${(y + 7 + 15 * float).toFixed(2)}px, 0) rotate(${r.toFixed(2)}deg) scale(${(s * (1 + 0.04 * float)).toFixed(4)})`;
          shadow.style.opacity = (0.5 - 0.2 * float).toFixed(3);
        }

        // A quick shine across the piece as it locks.
        const bar = barRefs.current[i];
        if (bar) {
          if (t < POP && landed >= 0 && landed < 0.5) {
            const q = landed / 0.5;
            const from = piece.span[0] + PAD - 100;
            const to = piece.span[1] + PAD + 20;
            bar.style.opacity = Math.sin(Math.PI * q).toFixed(3);
            bar.style.transform = `translate3d(${(from + (to - from) * smooth(q)).toFixed(1)}px, 0, 0) skewX(-20deg)`;
          } else {
            bar.style.opacity = "0";
          }
        }
      });

      // The whole puzzle takes each landing, and squeezes a touch just before it pops.
      const squeeze = t < POP ? 1 - 0.045 * smooth((t - (POP - 0.24)) / 0.24) : 1;
      const assembly = assemblyRef.current;
      if (assembly) assembly.style.transform = `translate3d(${nudgeX.toFixed(2)}px, ${nudgeY.toFixed(2)}px, 0) scale(${squeeze.toFixed(4)})`;

      const halo = haloRef.current;
      if (halo) {
        const q = (t - UNITE) / 0.8;
        const on = q > 0 && q < 1;
        halo.style.opacity = on ? (0.5 * (1 - q)).toFixed(3) : "0";
        if (on) halo.style.transform = `scale(${(1 + 0.2 * (1 - (1 - q) ** 3)).toFixed(4)})`;
      }
    };

    if (frozen !== null) {
      draw();
      window.addEventListener("resize", measure);
      const redraw = () => draw();
      window.addEventListener("resize", redraw);
      return () => {
        window.removeEventListener("resize", measure);
        window.removeEventListener("resize", redraw);
      };
    }

    const tick = (now: number) => {
      raf = 0;
      if (!visible) return;
      const dt = Math.min(64, now - last) / 1000;
      last = now;
      t = (t + dt) % LOOP;
      clock += dt;
      eased.x += (aim.x - eased.x) * Math.min(1, dt * 5);
      eased.y += (aim.y - eased.y) * Math.min(1, dt * 5);
      draw();
      raf = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        visible = entries.some((entry) => entry.isIntersecting);
        if (visible && !raf) {
          last = performance.now();
          raf = requestAnimationFrame(tick);
        }
      },
      { rootMargin: "120px 0px" },
    );
    observer.observe(stage);

    const onPointer = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      aim.x = (event.clientX / window.innerWidth) * 2 - 1;
      aim.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("resize", measure);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return (
    <section ref={sectionRef} data-guide-section="sentence-splits" className={`relative ${flat ? styles.flat : ""}`}>
      <div ref={stageRef} className={styles.stage}>
        <div className={styles.rig}>
          {/* The button itself: an unseen link laid over everything, so it is there whatever the pieces are doing. */}
          <Link
            href="/download"
            aria-label="Download Lazur for Mac"
            onClick={() => track("cta_clicked", { location: "hero", label: "Get Lazur", destination: "/download" })}
            className={styles.hit}
          />
          {/* The button before the puzzle is done: a plain, flat pill. The metal is earned when the pieces join. */}
          <div className={styles.tray} aria-hidden>
            <div className={styles.trayLabel}>
              <svg viewBox="0 0 24 24" width={30} height={30} focusable="false">
                <path d={APPLE} fill="currentColor" />
              </svg>
              <span>Get Lazur</span>
            </div>
          </div>

          <div ref={assemblyRef} className={styles.assembly} aria-hidden>
            {PIECES.map((piece, i) => (
              <div
                key={piece.verb}
                ref={(el) => {
                  shadowRefs.current[i] = el;
                }}
                className={`${styles.layer} ${styles.shadow}`}
                style={{ transformOrigin: `${piece.center[0] + PAD}px ${piece.center[1] + PAD}px` }}
              >
                <svg viewBox={VIEW_BOX} width={LAYER_W} height={LAYER_H} focusable="false">
                  <path d={OUTLINES[i]} fill="#1c1410" />
                </svg>
              </div>
            ))}

            {PIECES.map((piece, i) => (
              <div
                key={piece.verb}
                ref={(el) => {
                  pieceRefs.current[i] = el;
                }}
                className={`${styles.layer} ${styles.piece}`}
                style={{ transformOrigin: `${piece.center[0] + PAD}px ${piece.center[1] + PAD}px` }}
              >
                <PieceArt index={i} flat={flat} />
                <div className={styles.clip} style={{ clipPath: `path("${LAYER_OUTLINES[i]}")` }}>
                  <div
                    ref={(el) => {
                      barRefs.current[i] = el;
                    }}
                    className={styles.bar}
                  />
                </div>
              </div>
            ))}

            {/* The four as one: a single piece of black chrome, the seams only just engraved in it. */}
            <div ref={unitedRef} className={`${styles.layer} ${styles.united}`}>
              <UnitedArt flat={flat} />
              <div className={styles.labelBox}>
                <div className={styles.label}>
                  <svg viewBox="0 0 24 24" width={30} height={30} focusable="false">
                    <defs>
                      <linearGradient id="pz-apple" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0" stopColor="#ffffff" />
                        <stop offset="0.42" stopColor="#eef1f6" />
                        <stop offset="0.56" stopColor="#a4adbf" />
                        <stop offset="0.66" stopColor="#dde2ec" />
                        <stop offset="1" stopColor="#ffffff" />
                      </linearGradient>
                    </defs>
                    <path d={APPLE} fill={flat ? "#ffffff" : "url(#pz-apple)"} />
                  </svg>
                  <span className={styles.labelText}>Get Lazur</span>
                </div>
              </div>
              <div className={styles.clip} style={{ clipPath: `inset(${PAD}px round 44px)` }}>
                <div ref={glintRef} className={styles.bar} style={{ width: GLINT_W, top: (LAYER_H - 280) / 2 }} />
              </div>
            </div>

            <div ref={haloRef} className={styles.halo} />

          </div>

        </div>
      </div>

      {/* With reduced motion nothing moves, so the four words are simply written out. */}
      <p className="mx-auto -mt-2 hidden max-w-md px-5 text-center text-[14px] font-medium text-[var(--foreground-muted)] motion-reduce:block">
        transcribes · remembers · executes · teaches
      </p>

      <p className="sr-only">
        An animation: four metal jigsaw pieces, marked transcribes, remembers, executes and teaches, fly together and lock into one piece that reads
        Get Lazur. The four things Lazur does are one app.
      </p>
    </section>
  );
}

/** Lights a flat shape as a domed piece of metal: a key light from the upper left, a cool kick from below. */
function MetalFilter({ id }: { id: string }) {
  return (
    <filter id={id} x="-15%" y="-25%" width="130%" height="150%" colorInterpolationFilters="sRGB">
      <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="dome" />
      <feSpecularLighting in="dome" surfaceScale="6" specularConstant="1.05" specularExponent="30" lightingColor="#ffffff" result="key">
        <feDistantLight azimuth="235" elevation="42" />
      </feSpecularLighting>
      <feSpecularLighting in="dome" surfaceScale="5" specularConstant="0.5" specularExponent="22" lightingColor="#bcd6ff" result="kick">
        <feDistantLight azimuth="55" elevation="38" />
      </feSpecularLighting>
      <feComposite in="key" in2="SourceAlpha" operator="in" result="keyIn" />
      <feComposite in="kick" in2="SourceAlpha" operator="in" result="kickIn" />
      <feComposite in="SourceGraphic" in2="keyIn" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="lit" />
      <feComposite in="lit" in2="kickIn" operator="arithmetic" k1="0" k2="1" k3="0.5" k4="0" />
    </filter>
  );
}

/** One piece in its own colour, with its word. */
function PieceArt({ index, flat }: { index: number; flat: boolean }) {
  const piece = PIECES[index];
  const d = OUTLINES[index];
  const id = `pz-piece-${index}`;
  const [lip, bright, body, shade, horizon] = TONES[piece.tone];
  if (flat) {
    return (
      <svg className={styles.art} viewBox={VIEW_BOX} width={LAYER_W} height={LAYER_H} focusable="false">
        <path d={d} fill={body} stroke={INK} strokeWidth={1.5} strokeLinejoin="round" />
        <text className={styles.verb} x={piece.text[0]} y={piece.text[1]} fill="#fff" textAnchor="middle" dominantBaseline="central">
          {piece.verb}
        </text>
      </svg>
    );
  }
  return (
    <svg className={styles.art} viewBox={VIEW_BOX} width={LAYER_W} height={LAYER_H} focusable="false">
      <defs>
        <linearGradient id={`${id}-fill`} x1="0.36" y1="0" x2="0.5" y2="1">
          <stop offset="0" stopColor={lip} />
          <stop offset="0.08" stopColor={bright} />
          <stop offset="0.3" stopColor={body} />
          <stop offset="0.6" stopColor={shade} />
          <stop offset="0.75" stopColor={horizon} />
          <stop offset="0.81" stopColor={shade} />
          <stop offset="0.94" stopColor={bright} />
          <stop offset="1" stopColor={lip} />
        </linearGradient>
        <linearGradient id={`${id}-rim`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.9" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.08" />
          <stop offset="1" stopColor="#000" stopOpacity="0.5" />
        </linearGradient>
        <MetalFilter id={`${id}-metal`} />
        <clipPath id={`${id}-clip`}>
          <path d={d} />
        </clipPath>
      </defs>
      <path d={d} fill={`url(#${id}-fill)`} filter={`url(#${id}-metal)`} />
      <g clipPath={`url(#${id}-clip)`}>
        <path d={d} fill="none" stroke={`url(#${id}-rim)`} strokeWidth={4.6} strokeLinejoin="round" />
      </g>
      <path d={d} fill="none" stroke={INK} strokeWidth={1.5} strokeLinejoin="round" />
      <g className={styles.verb} textAnchor="middle" dominantBaseline="central">
        <text x={piece.text[0]} y={piece.text[1] + 1.4} fill="#000" fillOpacity={0.42}>
          {piece.verb}
        </text>
        <text x={piece.text[0]} y={piece.text[1]} fill="#fff">
          {piece.verb}
        </text>
      </g>
    </svg>
  );
}

/** The finished pill: one reflection across the whole of it, with the seams left as fine engraved lines. */
function UnitedArt({ flat }: { flat: boolean }) {
  const r = 44;
  if (flat) {
    return (
      <svg className={styles.art} viewBox={VIEW_BOX} width={LAYER_W} height={LAYER_H} focusable="false">
        <defs>
          <clipPath id="pz-united-inner">
            <rect x={3} y={3} width={PILL_W - 6} height={PILL_H - 6} rx={r - 3} />
          </clipPath>
        </defs>
        <rect x={0} y={0} width={PILL_W} height={PILL_H} rx={r} fill={INK} />
        <g clipPath="url(#pz-united-inner)" fill="none" strokeLinejoin="round">
          {OUTLINES.map((d) => (
            <path key={d} d={d} stroke="#fff" strokeOpacity={0.14} strokeWidth={1} />
          ))}
        </g>
      </svg>
    );
  }
  return (
    <svg className={styles.art} viewBox={VIEW_BOX} width={LAYER_W} height={LAYER_H} focusable="false">
      <defs>
        <linearGradient id="pz-united-fill" gradientUnits="userSpaceOnUse" x1={PILL_W / 2 - 14} y1={0} x2={PILL_W / 2 + 14} y2={PILL_H}>
          <stop offset="0" stopColor="#d3d9e4" />
          <stop offset="0.05" stopColor="#7c8496" />
          <stop offset="0.2" stopColor="#2c303c" />
          <stop offset="0.44" stopColor="#0e0f14" />
          <stop offset="0.58" stopColor="#000000" />
          <stop offset="0.7" stopColor="#1a1d26" />
          <stop offset="0.88" stopColor="#474d5c" />
          <stop offset="0.96" stopColor="#a3abba" />
          <stop offset="1" stopColor="#e6eaf1" />
        </linearGradient>
        <linearGradient id="pz-united-rim" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.75" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.06" />
          <stop offset="1" stopColor="#000" stopOpacity="0.5" />
        </linearGradient>
        <MetalFilter id="pz-united-metal" />
        <clipPath id="pz-united-clip">
          <rect x={0} y={0} width={PILL_W} height={PILL_H} rx={r} />
        </clipPath>
        {/* Keeps the engraved seams off the outer edge. */}
        <clipPath id="pz-united-inner">
          <rect x={3} y={3} width={PILL_W - 6} height={PILL_H - 6} rx={r - 3} />
        </clipPath>
      </defs>
      <rect x={0} y={0} width={PILL_W} height={PILL_H} rx={r} fill="url(#pz-united-fill)" filter="url(#pz-united-metal)" />
      <g clipPath="url(#pz-united-inner)" fill="none" strokeLinejoin="round">
        {OUTLINES.map((d) => (
          <path key={`dark-${d}`} d={d} stroke="#000" strokeOpacity={0.55} strokeWidth={0.9} transform="translate(0 0.8)" />
        ))}
        {OUTLINES.map((d) => (
          <path key={`light-${d}`} d={d} stroke="#fff" strokeOpacity={0.13} strokeWidth={0.8} />
        ))}
      </g>
      <g clipPath="url(#pz-united-clip)">
        <rect x={0} y={0} width={PILL_W} height={PILL_H} rx={r} fill="none" stroke="url(#pz-united-rim)" strokeWidth={4.2} />
      </g>
      <rect x={0} y={0} width={PILL_W} height={PILL_H} rx={r} fill="none" stroke={INK} strokeWidth={1.5} />
    </svg>
  );
}
