"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import { useTrackInView } from "@/hooks/useTrackInView";
import { Sticker, type StickerName } from "@/components/landing/Sticker";
import styles from "./SentenceSplits.module.css";

/**
 * "Just say it": an endless stream of spoken words (grey, as said, ums and all) flows along a
 * looping path into the Lazur notch. Out of the other side come three black ribbons, one per job:
 * what Lazur typed (dictates), what it got done (does) and the steps it showed (teaches). Each
 * thing said goes in, and a moment later its result streams out on the matching ribbon.
 *
 * It plays by itself at a constant speed, forever. One requestAnimationFrame loop moves the text
 * (SVG textPath startOffset); it stops while the band is off screen, and with reduced motion a
 * single still frame is drawn instead. Black, white and grey only. Two compositions: wide from
 * 1024px, tall below.
 */

const BLACK = "#0c0a09";
const WHITE = "#fffdfb";
const GREY = "#a8a29e";
const SPOKEN_GREY = "#8f8983";
/** The light ribbons: one flat tone a little darker than the page, and the quiet words on them. */
const CLOTH = "#eae7e1";
const CLOTH_DIM = "#7d7770";
const NBSP = " ";

type Part = { text: string; dim?: boolean };
type Item = {
  /** What you say, as it comes out of your mouth. */
  say: string;
  /** Which ribbon the result leaves on: 0 dictates, 1 does, 2 teaches. */
  lane: 0 | 1 | 2;
  /** The result. `dim` parts are marks (ticks, step numbers) drawn in grey. */
  out: Part[];
};

const step = (n: number, text: string, last = false): Part[] => [
  { text: `${n}${NBSP}`, dim: true },
  { text },
  ...(last ? [] : [{ text: `${NBSP}${NBSP}›${NBSP}${NBSP}`, dim: true }]),
];

const ITEMS: Item[] = [
  { say: "um tell sam we should meet thursday, no wait, friday at 3", lane: 0, out: [{ text: "Hi Sam, let’s meet Friday at 3." }] },
  { say: "find me 3 flights to goa", lane: 1, out: [{ text: `✓${NBSP}`, dim: true }, { text: "Found 3 flights to Goa, from ₹3,950" }] },
  { say: "how do i turn on dark mode", lane: 2, out: [...step(1, "System Settings"), ...step(2, "Appearance"), ...step(3, "Dark", true)] },
  { say: "ok so reply to priya, uh, thursday works for me", lane: 0, out: [{ text: "Hi Priya, Thursday works for me." }] },
  { say: "and put that on my calendar", lane: 1, out: [{ text: `✓${NBSP}`, dim: true }, { text: "On your calendar: Priya, Thursday 3:00" }] },
  { say: "wait how do i share my screen on this call", lane: 2, out: [...step(1, "Bottom bar"), ...step(2, "Share"), ...step(3, "Entire screen", true)] },
];

const GAP = `${NBSP}${NBSP}${NBSP}·${NBSP}${NBSP}${NBSP}`;
const PERIOD = ITEMS.map((item) => item.say + GAP).join("");
/** Enough copies of the stream to cover the whole input path while it loops. */
const COPIES = 3;
const STREAM = PERIOD.repeat(COPIES);
/** Character index where each thing said ends, within one period. */
const SAY_ENDS = ITEMS.reduce<number[]>((ends, item, i) => {
  const start = i === 0 ? 0 : ends[i - 1] + GAP.length;
  return [...ends, start + item.say.length];
}, []);

const LANES = [
  { name: "transcribes and corrects", note: "what you said, minus the ums" },
  { name: "does", note: "the job, start to finish" },
  { name: "teaches", note: "where to click, step by step" },
];

/** Points along a path written with absolute M, C, S and L commands (what the ribbons use). */
function samplePath(d: string, perCurve = 70): [number, number][] {
  const tokens = d.match(/[MCSL]|-?\d*\.?\d+/g) ?? [];
  const points: [number, number][] = [];
  let i = 0;
  let cur: [number, number] = [0, 0];
  let lastControl: [number, number] = [0, 0];
  const read = (): [number, number] => [Number(tokens[i++]), Number(tokens[i++])];
  while (i < tokens.length) {
    const command = tokens[i++];
    if (command === "M" || command === "L") {
      cur = read();
      lastControl = cur;
      points.push(cur);
    } else if (command === "C" || command === "S") {
      const c1: [number, number] = command === "C" ? read() : [2 * cur[0] - lastControl[0], 2 * cur[1] - lastControl[1]];
      const c2 = read();
      const end = read();
      for (let n = 1; n <= perCurve; n++) {
        const t = n / perCurve;
        const u = 1 - t;
        points.push([
          u * u * u * cur[0] + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t * t * t * end[0],
          u * u * u * cur[1] + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t * t * t * end[1],
        ]);
      }
      lastControl = c2;
      cur = end;
    }
  }
  return points;
}

/** Distance between the stitches along a ribbon's edges, in drawing units. */
const STITCH = 28;

/** How many steps of shade a bend can take, and how tight a bend takes the deepest one (radians turned per unit travelled). */
const SHADE_STEPS = 7;
const TIGHT_BEND = 0.0052;

/**
 * Where a ribbon bends, as stretches of path grouped by how hard it is turning there: element n
 * holds the stretches that take n + 1 steps of shade. Straight stretches are in none of them, so
 * they keep the flat colour; the shade deepens into a bend and eases out of it, like cloth turning.
 */
function bendShade(d: string): string[] {
  const points = samplePath(d).filter(([x]) => x < 1800);
  const turn = points.map((point, n) => {
    if (n === 0 || n === points.length - 1) return 0;
    const [ax, ay] = [point[0] - points[n - 1][0], point[1] - points[n - 1][1]];
    const [bx, by] = [points[n + 1][0] - point[0], points[n + 1][1] - point[1]];
    const angle = Math.abs(Math.atan2(ax * by - ay * bx, ax * bx + ay * by));
    return angle / ((Math.hypot(ax, ay) + Math.hypot(bx, by)) / 2 || 1);
  });
  const bands = Array.from({ length: SHADE_STEPS }, () => "");
  for (let n = 0; n < points.length - 1; n++) {
    // Average the turning over a short stretch, so the shade comes and goes gradually.
    let sum = 0;
    let count = 0;
    for (let k = Math.max(0, n - 8); k <= Math.min(points.length - 1, n + 8); k++) {
      sum += turn[k];
      count++;
    }
    const level = Math.min(SHADE_STEPS, Math.round(((sum / count) / TIGHT_BEND) * SHADE_STEPS));
    if (level > 0) bands[level - 1] += `M${points[n][0].toFixed(1)} ${points[n][1].toFixed(1)}L${points[n + 1][0].toFixed(1)} ${points[n + 1][1].toFixed(1)}`;
  }
  return bands;
}

type Geometry = {
  width: number;
  height: number;
  /** Units (viewBox px) per second. */
  speed: number;
  /** Results drift out a little slower than the words go in, so every ribbon always carries one. */
  outPace: number;
  notch: { cx: number; cy: number; w: number; h: number };
  /** Path the spoken words ride; ends at the notch centre. */
  input: string;
  inSize: number;
  /** Per lane: the whole black ribbon, and the part of it that carries text (they may be the same). */
  ribbons: string[];
  texts: string[];
  ribbonWidth: number;
  outSize: number;
  captions: { x: number; y: number }[];
  captionSize: number;
  notes: boolean;
  /** Write this on the notch (with an Apple mark) instead of the listening waveform: it is a button. */
  notchLabel?: string;
  /** Per lane: how far along its ribbon the lane's name sits, riding just above the ribbon and following its curve. */
  captionAlong?: number[];
  /** Stickers dropped around the drawing. */
  stickers?: { name: StickerName; x: number; y: number; size: number; rotate: number; flip?: boolean }[];
  /** Draw the ribbons light instead of solid black: one tone a little darker than the page that deepens only where the ribbon bends, a thin black edge, black words. */
  cloth?: boolean;
  /** Per lane: a tiny sticker placed just after the lane's name, tilted with the ribbon. */
  labelStickers?: StickerName[];
  /** Little text faces dropped around the drawing. */
  faces?: { text: string; x: number; y: number; rotate: number }[];
};

// Wide: the words come in from the left, do a loop, and run into the notch; three ribbons swoop
// away to the right. Paths run far past the drawing so they reach the screen edge at any width.
const WIDE: Geometry = {
  width: 1200,
  height: 470,
  speed: 80,
  outPace: 0.85,
  notch: { cx: 520, cy: 250, w: 132, h: 38 },
  input: "M-900 270 L-80 270 C 60 270 250 262 290 170 C 322 96 270 30 190 30 C 110 30 70 100 92 170 C 116 246 300 280 380 262 C 420 253 430 250 454 250 L520 250",
  inSize: 16,
  ribbons: [
    "M520 250 C 640 250 660 96 830 92 S 1120 160 1300 96 S 1800 60 2400 110",
    "M520 250 C 700 250 820 296 980 262 S 1210 214 1340 240 S 1800 290 2400 250",
    "M520 250 C 640 250 660 404 830 408 S 1120 340 1300 398 S 1800 440 2400 390",
  ],
  texts: [],
  ribbonWidth: 30,
  outSize: 15.5,
  captions: [
    { x: 838, y: 62 },
    { x: 812, y: 236 },
    { x: 838, y: 446 },
  ],
  captionSize: 12.5,
  notes: true,
};
WIDE.texts = WIDE.ribbons;

// Hero: the pill is the centre of the homepage hero and is the button ("Get Lazur"). The words
// come in from the left edge on a long wave (the SVG overflows upward) and run into it. The results leave from three different places on the pill and use the empty space
// above it, so all three show on first load: the first sweeps up to the top right corner beside
// the headline, the second rises to the middle of the right edge, the third drops just under the
// pill and runs level to the right.
const HERO: Geometry = {
  ...WIDE,
  height: 220,
  notch: { cx: 600, cy: 90, w: 236, h: 68 },
  notchLabel: "Get Lazur",
  // A long easy wave in from the left edge, no loop, leaving the space beside the headline free for stickers.
  input: "M-900 40 L-420 40 C -330 40 -300 -120 -190 -120 C -80 -120 -60 30 50 40 C 150 49 170 -40 250 -20 C 330 0 340 84 440 92 C 490 96 505 90 534 90 L600 90",
  ribbons: [
    "M640 70 C 690 -6 860 2 1040 -46 S 1290 -120 1390 -260 S 1560 -480 1900 -490 S 2300 -480 2700 -510",
    "M706 92 C 800 98 950 100 1090 62 S 1320 -40 1500 -86 S 1900 -130 2700 -110",
    "M536 96 C 536 156 610 192 780 186 S 1100 160 1300 178 S 1800 200 2700 176",
  ],
  captions: [],
  // Two pink cursors either side of the headline's second line, exact mirror images, each lying at a shallow angle with its tip towards the words. They stay put.
  stickers: [
    // right of the line: lying at a shallow angle, tip towards the headline; left of it: the mirror image
    { name: "pointer", x: 151, y: -212, size: 94, rotate: -38, flip: true },
    { name: "pointer2", x: 955, y: -212, size: 94, rotate: -38 },
  ],
  cloth: true,
  outPace: 1,
  ribbonWidth: 34,
  captionAlong: [330, 262, 306],
  captionSize: 15,
  notes: false,
};
HERO.texts = HERO.ribbons;

// Tall: the words wave in along the top to the notch; one ribbon sweeps down the left and opens
// into three lanes that run off to the right.
const TALL_LANES = [204, 270, 336];
const tallLane = (y: number) => `C 150 ${y - 9} 250 ${y + 9} 340 ${y} S 600 ${y - 6} 1100 ${y}`;
const TALL: Geometry = {
  width: 340,
  height: 366,
  speed: 50,
  outPace: 0.5,
  notch: { cx: 256, cy: 62, w: 112, h: 34 },
  input: "M-300 34 L-40 34 C 30 34 50 98 112 92 S 176 62 256 62",
  inSize: 13.5,
  ribbons: TALL_LANES.map((y) => `M256 62 C 256 154 40 92 40 172 L40 ${y - 22} Q40 ${y} 62 ${y} ${tallLane(y)}`),
  texts: TALL_LANES.map((y) => `M62 ${y} ${tallLane(y)}`),
  ribbonWidth: 25,
  outSize: 13,
  captions: TALL_LANES.map((y) => ({ x: 64, y: y - 19 })),
  captionSize: 11,
  notes: false,
};

const mod = (a: number, n: number) => ((a % n) + n) % n;

function Stream({ g, id, className }: { g: Geometry; id: string; className: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const inPathRef = useRef<SVGPathElement>(null);
  const inTextRef = useRef<SVGTextElement>(null);
  const inRideRef = useRef<SVGTextPathElement>(null);
  const ribbonRefs = useRef<(SVGPathElement | null)[]>([]);
  const textPathRefs = useRef<(SVGPathElement | null)[]>([]);
  const outRideRefs = useRef<(SVGTextPathElement | null)[]>([]);
  const reduced = useReducedMotion();
  const shade = useMemo(() => (g.cloth ? g.ribbons.map(bendShade) : []), [g]);
  const captionRefs = useRef<(SVGTextElement | null)[]>([]);
  // Where the tiny sticker after each lane's name goes: measured once the names are drawn, since it depends on how wide each name is.
  const [labelSpots, setLabelSpots] = useState<{ x: number; y: number; angle: number }[]>([]);
  useEffect(() => {
    if (!g.labelStickers || !g.captionAlong) return;
    const place = () => {
      const spots = g.captionAlong!.map((start, lane) => {
        const path = textPathRefs.current[lane];
        const label = captionRefs.current[lane];
        if (!path || !label) return null;
        const width = label.getComputedTextLength();
        if (width === 0) return null; // this composition is hidden
        const at = start + width + 24;
        const here = path.getPointAtLength(at);
        const ahead = path.getPointAtLength(at + 2);
        const angle = Math.atan2(ahead.y - here.y, ahead.x - here.x);
        const lift = g.ribbonWidth / 2 + 14; // level with the name, above the ribbon
        return { x: here.x + Math.sin(angle) * lift, y: here.y - Math.cos(angle) * lift, angle: (angle * 180) / Math.PI };
      });
      if (spots.every(Boolean)) setLabelSpots(spots as { x: number; y: number; angle: number }[]);
    };
    place();
    document.fonts?.ready.then(place).catch(() => {});
  }, [g]);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    /** Lengths read from the DOM: the stream period, when each result leaves, how far it has to go first. */
    let m: { period: number; leaveAt: number[]; lead: number[] } | null = null;
    let phase = 0;
    let started = false;
    let visible = false;
    let raf = 0;
    let last = 0;

    const draw = () => {
      if (!m) return;
      inRideRef.current?.setAttribute("startOffset", (phase - m.period).toFixed(2));
      ITEMS.forEach((item, k) => {
        // How far this result's leading edge is along its ribbon, from the notch centre.
        const along = mod(phase - m!.leaveAt[k], m!.period) * g.outPace;
        outRideRefs.current[k]?.setAttribute("startOffset", (along - m!.lead[item.lane]).toFixed(2));
      });
    };

    const measure = () => {
      const inPath = inPathRef.current;
      const inText = inTextRef.current;
      if (!inPath || !inText || inText.getComputedTextLength() === 0) return; // this composition is hidden
      let period: number;
      let ends: number[];
      try {
        period = inText.getSubStringLength(0, PERIOD.length);
        ends = SAY_ENDS.map((n) => inText.getSubStringLength(0, n));
      } catch {
        period = inText.getComputedTextLength() / COPIES;
        ends = SAY_ENDS.map((n) => (n / PERIOD.length) * period);
      }
      // A result starts out from the notch centre as the last word said reaches the notch's near edge.
      const entry = inPath.getTotalLength() - g.notch.w;
      // In step (cloth ribbons): a result shows at the housing's edge at the moment its words reach the housing on the other
      // side. Each ribbon starts under the housing, so allow for the stretch of it that is hidden there.
      const hidden = g.ribbons.map((_, lane) => {
        const ribbon = ribbonRefs.current[lane];
        if (!g.cloth || !ribbon) return 0;
        for (let along = 0; along < 400; along += 2) {
          const at = ribbon.getPointAtLength(along);
          if (Math.abs(at.x - g.notch.cx) > g.notch.w / 2 || Math.abs(at.y - g.notch.cy) > g.notch.h / 2) return along;
        }
        return 0;
      });
      const nearEdge = inPath.getTotalLength() - g.notch.w / 2;
      m = {
        period,
        leaveAt: ends.map((end, k) => mod((g.cloth ? nearEdge - hidden[ITEMS[k].lane] : entry) - end, period)),
        lead: g.ribbons.map((_, lane) => (ribbonRefs.current[lane]?.getTotalLength() ?? 0) - (textPathRefs.current[lane]?.getTotalLength() ?? 0)),
      };
      if (!started) {
        started = true;
        phase = mod(m.leaveAt[0] + 0.3 * period, period); // open mid-flow, with results already out
      }
      draw();
    };

    const tick = (now: number) => {
      raf = 0;
      if (!visible) return;
      if (!m) measure();
      if (m) {
        phase = mod(phase + (g.speed * Math.min(64, now - last)) / 1000, m.period);
        draw();
      }
      last = now;
      raf = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        visible = entries.some((e) => e.isIntersecting);
        if (visible && !reduced && !raf) {
          last = performance.now();
          raf = requestAnimationFrame(tick);
        }
      },
      { rootMargin: "120px 0px" },
    );
    observer.observe(svg);

    measure();
    document.fonts?.ready.then(measure).catch(() => {});
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [g, reduced]);

  const { notch } = g;
  const bars = [7, 13, 9, 15, 8];
  return (
    <svg ref={svgRef} className={`${styles.svg} ${className}`} viewBox={`0 0 ${g.width} ${g.height}`} aria-hidden focusable="false">
      {/* a few things lying around the page */}
      {(g.stickers ?? []).map((st) => {
        const cx = st.x + st.size / 2;
        const cy = st.y + st.size / 2;
        return (
          <g key={st.name} transform={`translate(${cx} ${cy}) ${st.flip ? "scale(-1 1) " : ""}rotate(${st.rotate}) translate(${-cx} ${-cy})`}>
            <Sticker name={st.name} x={st.x} y={st.y} size={st.size} />
          </g>
        );
      })}
      {(g.faces ?? []).map((face) => (
        <text key={face.text} x={face.x} y={face.y} fontSize={22} fontWeight={600} fill={BLACK} textAnchor="middle" transform={`rotate(${face.rotate} ${face.x} ${face.y})`}>
          {face.text}
        </text>
      ))}

      {/* in: what you say */}
      <path ref={inPathRef} id={`${id}-in`} d={g.input} fill="none" />
      <text ref={inTextRef} fontSize={g.inSize} fill={SPOKEN_GREY} dy="0.34em" letterSpacing="0.01em" className={styles.riding}>
        <textPath ref={inRideRef} href={`#${id}-in`}>
          {STREAM}
        </textPath>
      </text>

      {/* out: three ribbons */}
      {g.cloth ? (
        <g>
          {g.ribbons.map((d, lane) => (
            <g key={lane}>
              {/* a thin black edge, then one flat colour */}
              <path
                ref={(el) => {
                  ribbonRefs.current[lane] = el;
                }}
                d={d}
                fill="none"
                stroke={BLACK}
                strokeWidth={g.ribbonWidth + 3.2}
              />
              <path d={d} fill="none" stroke={CLOTH} strokeWidth={g.ribbonWidth} />
              {/* The ribbon itself is seen to move: fine stitches along both edges travel out at the speed of the words.
                  (Hairlines across the ribbon, with the middle covered over again, so only their ends show.) */}
              <path
                className={styles.stitch}
                d={d}
                fill="none"
                stroke={BLACK}
                strokeOpacity={0.5}
                strokeWidth={g.ribbonWidth}
                strokeDasharray={`1.5 ${STITCH - 1.5}`}
                style={{ animationDuration: `${(STITCH / (g.speed * g.outPace)).toFixed(3)}s`, ["--stitch" as string]: `${-STITCH}` }}
              />
              <path d={d} fill="none" stroke={CLOTH} strokeWidth={g.ribbonWidth - 5.5} />
              {/* a deeper shade only where the ribbon turns, easing in and out; straight runs stay flat */}
              {(shade[lane] ?? []).map((band, step) =>
                band ? <path key={step} d={band} fill="none" stroke="#000" strokeOpacity={0.019 * (step + 1)} strokeWidth={g.ribbonWidth} /> : null,
              )}
            </g>
          ))}
        </g>
      ) : (
        g.ribbons.map((d, lane) => (
          <path
            key={lane}
            ref={(el) => {
              ribbonRefs.current[lane] = el;
            }}
            d={d}
            fill="none"
            stroke={BLACK}
            strokeWidth={g.ribbonWidth}
          />
        ))
      )}
      {g.texts.map((d, lane) => (
        <path
          key={lane}
          ref={(el) => {
            textPathRefs.current[lane] = el;
          }}
          id={`${id}-lane-${lane}`}
          d={d}
          fill="none"
        />
      ))}
      {ITEMS.map((item, k) => (
        <text key={k} fontSize={g.outSize} fontWeight={600} fill={g.cloth ? BLACK : WHITE} textAnchor="end" dy="0.35em" className={styles.riding}>
          <textPath
            ref={(el) => {
              outRideRefs.current[k] = el;
            }}
            href={`#${id}-lane-${item.lane}`}
          >
            {item.out.map((part, i) => (
              <tspan key={i} fill={part.dim ? (g.cloth ? CLOTH_DIM : GREY) : undefined} fontWeight={part.dim ? 500 : undefined}>
                {part.text}
              </tspan>
            ))}
          </textPath>
        </text>
      ))}

      {/* the notch, with a small listening waveform */}
      {g.cloth ? (
        // Built like the ribbons it feeds (the same thin black edge), but brighter and raised, so it reads as the housing they run out of.
        <g className={styles.housing}>
          <rect
            x={notch.cx - notch.w / 2}
            y={notch.cy - notch.h / 2}
            width={notch.w}
            height={notch.h}
            rx={notch.h / 2}
            fill="#ffffff"
            stroke={BLACK}
            strokeWidth={1.8}
          />
          <rect
            x={notch.cx - notch.w / 2 + 5}
            y={notch.cy - notch.h / 2 + 5}
            width={notch.w - 10}
            height={notch.h - 10}
            rx={(notch.h - 10) / 2}
            fill="none"
            stroke={BLACK}
            strokeWidth={1.4}
          />
        </g>
      ) : (
        <rect
          x={notch.cx - notch.w / 2}
          y={notch.cy - notch.h / 2}
          width={notch.w}
          height={notch.h}
          rx={notch.h / 2}
          fill={BLACK}
          stroke="var(--background)"
          strokeWidth={4}
        />
      )}
      {g.notchLabel ? (
        // One colour at a time for the metal band, the Apple mark and the words: they all read `currentColor`, which this group changes slowly.
        <g className={styles.tint}>
          <defs>
            {/* Metal in the shared colour, kept dark: slightly lighter and deeper bands of it, so it reads as a polished surface. */}
            <linearGradient id={`${id}-band`} x1="0" y1="0" x2="1" y2="0.35">
              <stop offset="0" stopColor="currentColor" stopOpacity="0.7" />
              <stop offset="0.16" stopColor="currentColor" stopOpacity="1" />
              <stop offset="0.34" stopColor="currentColor" stopOpacity="0.62" />
              <stop offset="0.52" stopColor="currentColor" stopOpacity="1" />
              <stop offset="0.7" stopColor="currentColor" stopOpacity="0.66" />
              <stop offset="0.86" stopColor="currentColor" stopOpacity="1" />
              <stop offset="1" stopColor="currentColor" stopOpacity="0.75" />
            </linearGradient>
            <linearGradient id={`${id}-label`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="currentColor" stopOpacity="0.72" />
              <stop offset="0.46" stopColor="currentColor" stopOpacity="0.92" />
              <stop offset="0.54" stopColor="currentColor" stopOpacity="1" />
              <stop offset="1" stopColor="currentColor" stopOpacity="0.8" />
            </linearGradient>
          </defs>
          {/* The band of metal between the housing's outer and inner black edges; it changes colour in place, with the words. */}
          <rect
            x={notch.cx - notch.w / 2 + 2.9}
            y={notch.cy - notch.h / 2 + 2.9}
            width={notch.w - 5.8}
            height={notch.h - 5.8}
            rx={(notch.h - 5.8) / 2}
            fill="none"
            stroke={`url(#${id}-band)`}
            strokeWidth={3.6}
          />
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" fill={`url(#${id}-label)`} transform={`translate(${notch.cx - 70} ${notch.cy - 13.5}) scale(1.05)`} />
          <text x={notch.cx + 16} y={notch.cy} fontSize={22} fontWeight={700} fill={`url(#${id}-label)`} textAnchor="middle" dominantBaseline="central" letterSpacing="-0.01em">
            {g.notchLabel}
          </text>
        </g>
      ) : (
        bars.map((height, i) => (
          <rect
            key={i}
            className={styles.bar}
            x={notch.cx - 12 + i * 5.4}
            y={notch.cy - height / 2}
            width={2.4}
            height={height}
            rx={1.2}
            fill={WHITE}
            style={{ animationDelay: `${-i * 0.23}s` }}
          />
        ))
      )}

      {/* which ribbon is which */}
      {g.captionAlong
        ? LANES.map((lane, i) => (
            <text
              key={lane.name}
              ref={(el) => {
                captionRefs.current[i] = el;
              }}
              fontSize={g.captionSize}
              fill={BLACK}
              fontWeight={600}
              dy={-(g.ribbonWidth / 2 + 9)}
              letterSpacing="0.01em"
            >
              <textPath href={`#${id}-lane-${i}`} startOffset={g.captionAlong![i]}>
                {lane.name}
              </textPath>
            </text>
          ))
        : null}
      {(g.labelStickers ?? []).map((name, lane) => {
        const spot = labelSpots[lane];
        const size = 32;
        return spot ? (
          <g key={name} transform={`rotate(${spot.angle.toFixed(1)} ${spot.x.toFixed(1)} ${spot.y.toFixed(1)})`}>
            <Sticker name={name} x={spot.x - size / 2} y={spot.y - size / 2} size={size} />
          </g>
        ) : null;
      })}
      {(g.captionAlong ? [] : LANES).map((lane, i) => (
        <text key={lane.name} x={g.captions[i].x} y={g.captions[i].y} fontSize={g.captionSize} fill={BLACK} fontWeight={600} letterSpacing="-0.005em">
          {lane.name}
          {g.notes ? (
            <tspan fill={SPOKEN_GREY} fontWeight={400} dx={8}>
              {lane.note}
            </tspan>
          ) : null}
        </text>
      ))}
    </svg>
  );
}

/**
 * `heading={false}` leaves out the title and line of copy, for use inside another section.
 * `variant="hero"` draws the wide composition around the homepage button; `children` are laid over
 * the stage on wide screens (position them with percentages of the stage) and sit above it on
 * narrow ones.
 */
export function SentenceSplits({ heading = true, variant = "band", children }: {
  heading?: boolean;
  variant?: "band" | "hero";
  children?: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  useTrackInView(ref, "section_viewed", { section: "sentence_splits" });

  return (
    <section ref={ref} data-guide-section="sentence-splits" className={`relative overflow-x-clip ${heading ? "py-20 md:py-28" : ""}`}>
      {heading ? (
        <div className="landing-container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-[clamp(2rem,4vw,3.25rem)] font-medium lowercase leading-[1.02] tracking-[-0.035em] text-[var(--foreground)]">
              just say it.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-[16px] lowercase leading-relaxed text-[var(--foreground-muted)] md:text-[17px]">
              lazur types it, does it, or shows you how. all by voice.
            </p>
          </div>
        </div>
      ) : null}

      <div className={`${styles.stage} ${heading ? "mt-10 md:mt-12" : ""}`}>
        {children ? <div className="relative z-10 lg:absolute lg:inset-0">{children}</div> : null}
        <Stream g={variant === "hero" ? HERO : WIDE} id="sentence-splits-wide" className={styles.wide} />
        <Stream g={TALL} id="sentence-splits-tall" className={styles.tall} />
      </div>

      <p className="sr-only">
        An animation: a stream of spoken words flows into Lazur and comes out as three kinds of result. Dictation: &ldquo;um tell sam we
        should meet thursday, no wait, friday at 3&rdquo; is typed as &ldquo;Hi Sam, let&rsquo;s meet Friday at 3.&rdquo; Doing: &ldquo;find me 3
        flights to goa&rdquo; comes back as three flights found, and &ldquo;put that on my calendar&rdquo; as an event added. Teaching:
        &ldquo;how do i turn on dark mode&rdquo; comes back as the steps: System Settings, Appearance, Dark.
      </p>
    </section>
  );
}
