"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Vaidik, Veer and Ayush as little cartoon stickers (the same drawings as the launch film's
 * ending), in a few poses to tuck around the page. Each one moves a little while it is on screen.
 */

const INK = "#1C1917";
const SKIN = "#C98D62";
const SKIN_SHADE = "#B07650";
const WHITE = "#FFFFFF";

export type Who = "vaidik" | "veer" | "ayush";
export type Pose = "wave" | "thumbs" | "yay" | "point" | "laptop" | "lying" | "sitwave" | "lean" | "hang" | "sitcross";

type Part = { d: string; fill?: string; w?: number; stroke?: string };

const P: React.FC<{ p: Part }> = ({ p }) => (
  <path d={p.d} fill={p.fill ?? "none"} stroke={p.stroke ?? INK} strokeWidth={p.w ?? 4} strokeLinecap="round" strokeLinejoin="round" />
);

const FACE: Part[] = [
  { d: "M135 184 L135 206 L165 206 L165 184", fill: SKIN_SHADE },
  { d: "M97 112 C82 106 80 140 99 142", fill: SKIN },
  { d: "M203 112 C218 106 220 140 201 142", fill: SKIN },
  { d: "M95 118 C95 70 120 48 150 48 C180 48 205 70 205 118 C205 166 182 192 150 192 C118 192 95 166 95 118 Z", fill: SKIN },
  { d: "M150 120 q-7 14 3 17", w: 3.5 },
];
const CHEEKS: Part = { d: "M110 140 q8 4 14 0 M176 140 q8 4 14 0", w: 2.5, stroke: "#D9775F" };

const LOOK: Record<Who, { sleeve: string; forearm: string; hair: Part[]; extra: Part[]; torso: Part[]; pants: string; shoe: string; eyes: "dots" | "glasses" }> = {
  vaidik: {
    sleeve: "#EDB7B1",
    forearm: SKIN,
    hair: [
      { d: "M90 120 C80 68 112 32 154 34 C196 34 220 66 210 118 C204 98 194 86 178 80 C172 94 156 98 140 90 C126 100 108 106 90 120 Z", fill: INK },
      { d: "M150 56 C172 60 188 74 192 96", w: 3, stroke: "#4A4440" },
    ],
    extra: [{ d: "M118 104 q11 -7 22 -2 M160 102 q12 -5 22 2", w: 4 }],
    torso: [
      { d: "M100 212 C112 204 126 200 136 202 L150 222 L164 202 C174 200 188 204 200 212 L208 300 L204 332 L96 332 L92 300 Z", fill: "#EDB7B1" },
      { d: "M136 202 L127 224 L150 222 Z M164 202 L173 224 L150 222 Z", fill: "#E2A39C" },
      { d: "M150 222 L150 332", w: 3 },
      { d: "M160 244 h36 v44 h-36 Z", fill: "#E8762E" },
      { d: "M166 252 l8 6 l6 -8 l8 10 M164 268 h30 M166 278 l10 -4 l12 6", w: 2.5 },
    ],
    pants: "#3A3633",
    shoe: WHITE,
    eyes: "dots",
  },
  veer: {
    sleeve: "#CDB59B",
    forearm: "#CDB59B",
    hair: [
      {
        d: "M88 122 C76 96 84 66 102 60 C98 40 122 26 138 36 C146 20 172 20 180 36 C198 28 220 44 214 64 C228 76 226 106 212 122 C206 100 196 90 184 86 C176 98 160 100 150 92 C138 102 118 102 106 96 C98 104 92 112 88 122 Z",
        fill: INK,
      },
      { d: "M112 54 q8 -8 14 2 M150 38 q8 -8 14 2 M186 50 q8 -6 12 4", w: 2.5, stroke: "#4A4440" },
    ],
    extra: [{ d: "M118 104 q10 -5 20 0 M162 104 q10 -5 20 0", w: 4 }],
    torso: [
      { d: "M98 214 C112 204 130 202 150 210 C170 202 188 204 202 214 L208 300 L204 340 L96 340 L92 300 Z", fill: "#CDB59B" },
      { d: "M96 330 L204 330", w: 2.5 },
      { d: "M130 207 Q150 222 170 207", w: 3.5 },
    ],
    pants: "#5E83B8",
    shoe: "#F3EEE6",
    eyes: "dots",
  },
  ayush: {
    sleeve: "#F7F4EE",
    forearm: "#F7F4EE",
    hair: [{ d: "M93 114 C90 66 120 42 152 42 C186 42 210 64 207 114 C198 90 186 78 170 74 C150 68 126 72 110 84 C102 92 96 102 93 114 Z", fill: INK }],
    extra: [
      { d: "M110 110 h36 v14 q-18 15 -36 0 Z M154 110 h36 v14 q-18 15 -36 0 Z", fill: INK },
      { d: "M146 114 h8 M110 112 l-12 -4 M190 112 l12 -4", w: 3 },
    ],
    torso: [
      { d: "M98 214 C112 204 128 200 136 202 L150 222 L164 202 C172 200 188 204 202 214 L208 330 L92 330 Z", fill: "#F7F4EE" },
      { d: "M136 202 L128 222 L150 222 Z M164 202 L172 222 L150 222 Z", fill: WHITE },
    ],
    pants: "#222020",
    shoe: WHITE,
    eyes: "glasses",
  },
};

const rad = (d: number) => (d * Math.PI) / 180;
type Hand = "fist" | "thumb" | "open" | "point" | "none";

function Arm({ sx, sy, a, b, sleeve, forearm, hand, k = 1 }: { sx: number; sy: number; a: number; b: number; sleeve: string; forearm: string; hand: Hand; k?: number }) {
  const ex = sx + 58 * k * Math.cos(rad(a));
  const ey = sy + 58 * k * Math.sin(rad(a));
  const wx = ex + 54 * k * Math.cos(rad(b));
  const wy = ey + 54 * k * Math.sin(rad(b));
  const finger = (o: number, len: number, k: number) => {
    const fa = rad(b + o);
    return (
      <g key={k}>
        <path d={`M${wx} ${wy} L${wx + len * Math.cos(fa)} ${wy + len * Math.sin(fa)}`} stroke={INK} strokeWidth={11} strokeLinecap="round" />
        <path d={`M${wx} ${wy} L${wx + len * Math.cos(fa)} ${wy + len * Math.sin(fa)}`} stroke={SKIN} strokeWidth={5} strokeLinecap="round" />
      </g>
    );
  };
  return (
    <g>
      <path d={`M${sx} ${sy} L${ex} ${ey}`} stroke={INK} strokeWidth={31} strokeLinecap="round" />
      <path d={`M${ex} ${ey} L${wx} ${wy}`} stroke={INK} strokeWidth={27} strokeLinecap="round" />
      <path d={`M${sx} ${sy} L${ex} ${ey}`} stroke={sleeve} strokeWidth={23} strokeLinecap="round" />
      <path d={`M${ex} ${ey} L${wx} ${wy}`} stroke={forearm} strokeWidth={19} strokeLinecap="round" />
      {hand === "fist" ? <circle cx={wx} cy={wy} r={12} fill={SKIN} stroke={INK} strokeWidth={4} /> : null}
      {hand === "thumb" ? (
        // A thumbs-up, drawn upright and then turned to follow the forearm: a chunky rounded fist with the
        // curled fingers stacked down its inner side, and a fat thumb rising off its outer top corner, leaning
        // away from the body. (A thin bar centred on a small block read as the wrong finger.)
        <g transform={`translate(${wx} ${wy}) rotate(${b + 90}) scale(${sx < 150 ? -1 : 1} 1)`}>
          <rect x={-3} y={-50} width={19} height={36} rx={9.5} fill={SKIN} stroke={INK} strokeWidth={4} transform="rotate(22 8 -18)" />
          <rect x={-18} y={-24} width={34} height={38} rx={13} fill={SKIN} stroke={INK} strokeWidth={4} />
          <path d="M-18 -14 q8 -1 12 2 M-18 -4 q8 -1 13 2 M-18 6 q8 -1 12 2" stroke={INK} strokeWidth={3} strokeLinecap="round" fill="none" />
        </g>
      ) : null}
      {hand === "open" ? (
        <g>
          {[-34, -12, 10, 32].map((o, i) => finger(o, 25, i))}
          {finger(80, 20, 9)}
          <circle cx={wx} cy={wy} r={14} fill={SKIN} stroke={INK} strokeWidth={4} />
        </g>
      ) : null}
      {hand === "point" ? (
        <g>
          {finger(0, 30, 1)}
          <circle cx={wx} cy={wy} r={13} fill={SKIN} stroke={INK} strokeWidth={4} />
        </g>
      ) : null}
    </g>
  );
}

function Mouth({ o, w = 26, y = 150 }: { o: number; w?: number; y?: number }) {
  return (
    <path
      d={`M${150 - w} ${y} Q150 ${y + 12 + 24 * o} ${150 + w} ${y} Q150 ${y + 4 + 6 * o} ${150 - w} ${y} Z`}
      fill={o > 0.15 ? WHITE : INK}
      stroke={INK}
      strokeWidth={4}
      strokeLinejoin="round"
    />
  );
}

function Head({ who, happy, tilt = 0, scream }: { who: Who; happy: number; tilt?: number; scream?: number }) {
  const L = LOOK[who];
  return (
    <g transform={`rotate(${tilt} 150 190)`}>
      {FACE.map((p, i) => (
        <P key={i} p={p} />
      ))}
      {L.hair.map((p, i) => (
        <P key={`h${i}`} p={p} />
      ))}
      {scream !== undefined && who === "vaidik"
        ? null
        : L.extra.map((p, i) => <P key={`e${i}`} p={p} />)}
      {scream !== undefined ? (
        // Yelling: brows up in the middle, eyes wide, mouth wide open.
        <g>
          <path d="M116 100 L140 90 M184 100 L160 90" stroke={INK} strokeWidth={4.5} fill="none" strokeLinecap="round" />
          {L.eyes === "dots" ? (
            <g>
              <circle cx={128} cy={120} r={9} fill={WHITE} stroke={INK} strokeWidth={3.5} />
              <circle cx={172} cy={120} r={9} fill={WHITE} stroke={INK} strokeWidth={3.5} />
              <circle cx={129} cy={122} r={3.5} fill={INK} />
              <circle cx={171} cy={122} r={3.5} fill={INK} />
            </g>
          ) : null}
          <ellipse cx={150} cy={161} rx={15 + 2 * scream} ry={15 + 6 * scream} fill="#5A1A1A" stroke={INK} strokeWidth={4} />
          <path d={`M138 ${168 + 5 * scream} Q150 ${160 + 4 * scream} 162 ${168 + 5 * scream} Q150 ${175 + 6 * scream} 138 ${168 + 5 * scream} Z`} fill="#E06A6A" />
        </g>
      ) : L.eyes === "dots" ? (
        happy > 0.6 ? (
          <path d="M120 122 q10 -10 20 0 M160 122 q10 -10 20 0" stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round" />
        ) : (
          <path d="M123 121 a5 5 0 1 0 10 0 a5 5 0 1 0 -10 0 M167 121 a5 5 0 1 0 10 0 a5 5 0 1 0 -10 0" fill={INK} />
        )
      ) : null}
      {scream !== undefined ? null : who === "ayush" ? (
        <path d={`M132 154 Q154 ${163 + 3 * happy} ${174} ${150 - 2 * happy}`} stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round" />
      ) : (
        <Mouth o={happy} w={18 + 10 * happy} />
      )}
      {who !== "ayush" ? <P p={CHEEKS} /> : null}
    </g>
  );
}

function Legs({ who }: { who: Who }) {
  const L = LOOK[who];
  return (
    <>
      <path d="M94 330 L206 330 L202 420 L158 420 L150 352 L142 420 L98 420 Z" fill={L.pants} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      <path d="M96 420 h46 q7 0 7 11 h-58 q-2 -11 5 -11 Z M158 420 h46 q7 0 5 11 h-56 q-2 -11 5 -11 Z" fill={L.shoe} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
    </>
  );
}

/** Leaning on a wall: one leg straight, the other bent with its foot tucked back against the wall. */
function LeanLegs({ who }: { who: Who }) {
  const L = LOOK[who];
  const leg = (d: string) => (
    <g>
      <path d={d} stroke={INK} strokeWidth={40} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d={d} stroke={L.pants} strokeWidth={32} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </g>
  );
  return (
    <>
      {/* bent leg, behind: knee forward, foot back on the wall */}
      {leg("M168 340 L196 382 L150 404")}
      <path d="M128 400 h30 q8 0 6 10 h-40 q-2 -10 4 -10 Z" fill={L.shoe} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      {/* standing leg */}
      {leg("M128 340 L122 418")}
      <path d="M100 418 h42 q8 0 7 11 h-54 q-2 -11 5 -11 Z" fill={L.shoe} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      <path d="M96 322 L204 322 L206 346 Q150 356 94 346 Z" fill={L.pants} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
    </>
  );
}

/** Sitting on a ledge: a short lap, shins hanging straight down, feet dangling a little. */
function DanglingLegs({ who, swing }: { who: Who; swing: number }) {
  const L = LOOK[who];
  const shin = (x: number, s: number) => {
    const fx = x + s;
    return (
      <g>
        <path d={`M${x} 334 L${fx} 404`} stroke={INK} strokeWidth={36} strokeLinecap="round" />
        <path d={`M${x} 334 L${fx} 404`} stroke={L.pants} strokeWidth={28} strokeLinecap="round" />
        <path d={`M${fx - 22} 404 h38 q8 0 8 10 h-50 q-4 -10 4 -10 Z`} fill={L.shoe} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      </g>
    );
  };
  return (
    <>
      {shin(124, -swing)}
      {shin(176, swing)}
      <path d="M92 322 L208 322 L210 346 Q150 356 90 346 Z" fill={L.pants} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
    </>
  );
}

/** Hanging from a ledge: legs straight down, kicking about. */
function HangLegs({ who, kick }: { who: Who; kick: number }) {
  const L = LOOK[who];
  const leg = (x: number, s: number) => {
    const kx = x + s * 0.4;
    const fx = x + s;
    const d = `M${x} 340 L${kx} 384 L${fx} 426`;
    return (
      <g>
        <path d={d} stroke={INK} strokeWidth={36} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d={d} stroke={L.pants} strokeWidth={28} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d={`M${fx - 16} 424 h32 q8 0 8 10 h-44 q-4 -10 4 -10 Z`} fill={L.shoe} stroke={INK} strokeWidth={4} strokeLinejoin="round" transform={`rotate(${s * 0.8} ${fx} 428)`} />
      </g>
    );
  };
  return (
    <>
      {leg(126, kick)}
      {leg(174, -kick * 0.8)}
      <path d="M96 322 L204 322 L206 346 Q150 356 94 346 Z" fill={L.pants} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
    </>
  );
}

function CrossedLegs({ who }: { who: Who }) {
  const L = LOOK[who];
  return (
    <>
      <path d="M70 360 C70 322 120 318 150 336 C180 318 230 322 230 360 C230 384 196 392 150 380 C104 392 70 384 70 360 Z" fill={L.pants} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      <path d="M118 352 C134 344 166 344 182 352" stroke={INK} strokeWidth={3} fill="none" strokeLinecap="round" />
      <path d="M62 366 q-4 14 12 16 h22 q4 -10 -4 -16 Z M238 366 q4 14 -12 16 h-22 q-4 -10 4 -16 Z" fill={L.shoe} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
    </>
  );
}

/** Seconds since mount, ticking only while the sticker is on screen. */
function useTime(ref: React.RefObject<Element | null>) {
  const [t, setT] = useState(0);
  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let on = false;
    const t0 = performance.now();
    const loop = () => {
      setT((performance.now() - t0) / 1000);
      if (on) raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(([e]) => {
      on = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (on) raf = requestAnimationFrame(loop);
    });
    if (ref.current) io.observe(ref.current);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [ref]);
  return t;
}

export function FounderSticker({ who, pose, size = 120, className = "", style, label, flip = false }: {
  who: Who;
  pose: Pose;
  /** Height in px, or any CSS length (lying stickers use it as their width). */
  size?: number | string;
  className?: string;
  style?: React.CSSProperties;
  /** A handwritten note beside the sticker ("click here!", "yay!"). */
  label?: string;
  flip?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const t = useTime(ref);
  // When the pointer came over the sticker (in sticker time), for the hover reaction.
  const [hoverAt, setHoverAt] = useState<number | null>(null);
  const h = hoverAt === null ? -1 : t - hoverAt;
  const L = LOOK[who];
  const S = { l: [106, 222] as const, r: [194, 222] as const };
  let left = { a: 100, b: 92, hand: "fist" as Hand };
  let right = { a: 80, b: 88, hand: "fist" as Hand };
  let happy = 0.35;
  let bob = Math.sin(t * 2.2) * 2;
  let tilt = Math.sin(t * 1.3) * 1.5;
  let body: React.ReactNode = <Legs who={who} />;
  let extras: React.ReactNode = null;
  let view = "0 0 300 460";
  let armK = 1;
  let scream: number | undefined;
  let sway = "";

  if (pose === "wave") {
    right = { a: -20, b: -95 + Math.sin(t * 9) * 16, hand: "open" };
    happy = 0.7;
  } else if (pose === "thumbs") {
    const k = Math.sin(t * 5) * 3;
    left = { a: 150, b: -80 + k, hand: "thumb" };
    right = { a: 30, b: -100 - k, hand: "thumb" };
    happy = 1;
  } else if (pose === "yay") {
    const k = Math.sin(t * 7) * 6;
    left = { a: -130 + k, b: -110 + k, hand: "open" };
    right = { a: -50 - k, b: -70 - k, hand: "open" };
    happy = 1;
    bob = -Math.abs(Math.sin(t * 3.4)) * 14;
    extras = (
      <g opacity={0.9}>
        <path d="M40 60 l8 -14 M260 50 l-6 -16 M30 150 l-14 -4 M272 140 l16 -6" stroke="#6B4BFC" strokeWidth={5} strokeLinecap="round" />
        <circle cx={58} cy={100} r={5} fill="#e11d48" />
        <circle cx={246} cy={96} r={5} fill="#E8762E" />
      </g>
    );
  } else if (pose === "point") {
    right = { a: -8 + Math.sin(t * 3) * 3, b: -14 + Math.sin(t * 3) * 3, hand: "point" };
    happy = 0.8;
  } else if (pose === "laptop") {
    view = "0 20 300 380";
    body = <CrossedLegs who={who} />;
    bob = Math.sin(t * 2) * 1;
    tilt = -6 + Math.sin(t * 1.1) * 2;
    left = { a: 105, b: 30 + Math.sin(t * 14) * 4, hand: "fist" };
    right = { a: 75, b: 150 - Math.sin(t * 13) * 4, hand: "fist" };
    happy = 0.3;
    extras = (
      <g transform={`translate(0 ${-Math.abs(Math.sin(t * 14)) * 0.6})`}>
        <path d="M86 268 L214 268 L226 346 L74 346 Z" fill="#2A2725" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
        <path d="M60 346 L240 346 L232 358 L68 358 Z" fill="#8A837D" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
        <g transform="translate(140 292) scale(0.9)" fill="#FBFAF8">
          <rect x="0" y="0" width="5" height="22" rx="1.5" />
          <rect x="8" y="6" width="5" height="16" rx="1.5" />
          <rect x="16" y="0" width="5" height="22" rx="1.5" />
        </g>
      </g>
    );
  } else if (pose === "lean") {
    // Leaning back on a wall, hands in pockets, cool and unbothered.
    body = <LeanLegs who={who} />;
    left = { a: 97, b: 80, hand: "none" };
    right = { a: 83, b: 100, hand: "none" };
    happy = 0.2;
    bob = 0;
    tilt = 10 + Math.sin(t * 0.9) * 2;
  } else if (pose === "sitwave") {
    // Perched on a ledge, waving hi, feet swinging.
    view = "0 20 300 410";
    body = <DanglingLegs who={who} swing={Math.sin(t * 2.6) * 6} />;
    left = { a: 100, b: 70, hand: "fist" };
    right = { a: -20, b: -95 + Math.sin(t * 9) * 16, hand: "open" };
    happy = 0.6;
    bob = 0;
  } else if (pose === "hang") {
    // Hanging off a ledge by both hands (the grip sits at the top of the view), kicking and yelling for help.
    armK = 1.72;
    left = { a: -95, b: -92, hand: "fist" };
    right = { a: -85, b: -88, hand: "fist" };
    body = <HangLegs who={who} kick={Math.sin(t * 7) * 16} />;
    scream = 0.5 + 0.5 * Math.sin(t * 6);
    bob = 0;
    tilt = Math.sin(t * 5) * 3;
    sway = `rotate(${Math.sin(t * 2.4) * 5} 150 22)`;
    extras = (
      <g>
        {/* little yell lines by the mouth and a drop of sweat */}
        <g opacity={0.5 + 0.5 * Math.sin(t * 6)}>
          <path d="M84 150 l-22 -6 M82 168 l-24 4 M86 184 l-18 12" stroke="#e11d48" strokeWidth={5} strokeLinecap="round" />
        </g>
        <path d="M212 92 q8 12 0 18 q-8 -6 0 -18 Z" fill="#9ED3F5" stroke={INK} strokeWidth={3} />
      </g>
    );
  } else if (pose === "sitcross") {
    // Sitting cross-legged on a ledge, hands on his knees, swaying a little. Hover and he waves.
    view = "0 20 300 380";
    body = <CrossedLegs who={who} />;
    left = { a: 118, b: 100, hand: "fist" };
    right = h >= 0 ? { a: -20, b: -95 + Math.sin(t * 9) * 16, hand: "open" } : { a: 62, b: 80, hand: "fist" };
    happy = 0.6;
    bob = 0;
    tilt = Math.sin(t * 1.2) * 3;
  } else if (pose === "lying") {
    // On his side, elbow on the ground, head propped on his hand (an L), the other arm along his side.
    view = "-70 100 450 250";
    left = { a: -160, b: -62 + Math.sin(t * 1.2) * 1.5, hand: "fist" };
    right = { a: 78, b: 96, hand: "none" };
    happy = 0.25;
    bob = Math.sin(t * 1.4) * 1.2;
    tilt = -14;
  }

  // Hover: a quick hop, a big grin and little hearts floating up.
  let hearts: React.ReactNode = null;
  if (h >= 0) {
    happy = 1;
    if (pose !== "lying") bob -= Math.max(0, Math.sin(Math.min(h, 0.45) * 7)) * 14;
    hearts = [0, 1, 2].map((i) => {
      const p = (h * 0.7 + i / 3) % 1;
      const x = [96, 150, 206][i] + Math.sin((h + i) * 4) * 6;
      const y = 60 - p * 70;
      return (
        <path
          key={i}
          d={`M${x} ${y + 8} c-12 -9 -14 -16 -8 -20 c4 -3 8 -1 8 3 c0 -4 4 -6 8 -3 c6 4 4 11 -8 20 Z`}
          fill="#e11d48"
          stroke={INK}
          strokeWidth={2.5}
          opacity={Math.min(1, (1 - p) * 2)}
          transform={`scale(${1.4}) translate(${-x * 0.2857} ${-y * 0.2857})`}
        />
      );
    });
  }

  const arms = (
    <>
      <Arm sx={S.l[0]} sy={S.l[1]} a={left.a} b={left.b} sleeve={L.sleeve} forearm={L.forearm} hand={left.hand} k={armK} />
      <Arm sx={S.r[0]} sy={S.r[1]} a={right.a} b={right.b} sleeve={L.sleeve} forearm={L.forearm} hand={right.hand} k={armK} />
    </>
  );
  const lying = pose === "lying";
  const lean = pose === "lean" ? `rotate(-7 130 430)` : "";
  const figure = (
    <g transform={`translate(0 ${bob}) ${lean} ${sway}`}>
      {body}
      <g>{L.torso.map((p, i) => <P key={i} p={p} />)}</g>
      {arms}
      {extras}
      <Head who={who} happy={happy} tilt={tilt} scream={scream} />
      {hearts}
      {/* Hanging, the hands grip above the head, so the fists go back on top of the hair. */}
      {pose === "hang"
        ? [
            [S.l, left],
            [S.r, right],
          ].map(([sh, arm], i) => {
            const [sx, sy] = sh as readonly [number, number];
            const { a, b } = arm as typeof left;
            const wx = sx + armK * (58 * Math.cos(rad(a)) + 54 * Math.cos(rad(b)));
            const wy = sy + armK * (58 * Math.sin(rad(a)) + 54 * Math.sin(rad(b)));
            return <circle key={i} cx={wx} cy={wy} r={13} fill={SKIN} stroke={INK} strokeWidth={4} />;
          })
        : null}
    </g>
  );

  return (
    <span
      ref={ref}
      onPointerEnter={() => setHoverAt(t)}
      onPointerLeave={() => setHoverAt(null)}
      className={`pointer-events-auto relative inline-block select-none ${className}`}
      style={style}
      aria-hidden
    >
      <svg
        viewBox={view}
        style={{ height: lying ? undefined : size, width: lying ? size : undefined, overflow: "visible", transform: flip ? "scaleX(-1)" : undefined }}
        className="block drop-shadow-[0_6px_10px_rgba(28,25,23,0.18)]"
      >
        {lying ? (
          <g transform="rotate(-90 150 230)">
            {figure}
          </g>
        ) : (
          figure
        )}
        {pose === "hang" ? (
          <text
            x={56}
            y={-34}
            className="font-[family-name:var(--font-caveat)]"
            fontSize={96}
            fontWeight={700}
            fill="#e11d48"
            transform={`rotate(${-8 + Math.sin(t * 6) * 3} 170 -60)`}
          >
            help!!
          </text>
        ) : null}
        {lying ? (
          <text x={-30} y={128} className="font-[family-name:var(--font-caveat)]" fontSize={42} fill="#6B4BFC" opacity={0.6 + 0.4 * Math.sin(t * 2)}>
            z z
          </text>
        ) : null}
      </svg>
      {label ? (
        <span className="absolute -top-2 left-full ml-1 whitespace-nowrap font-[family-name:var(--font-caveat)] text-[26px] font-semibold leading-none text-[#e11d48]">
          {label}
        </span>
      ) : null}
    </span>
  );
}
