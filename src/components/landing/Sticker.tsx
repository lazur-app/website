import type { CSSProperties, ReactNode } from "react";

/**
 * Lazur's own sticker set: little liquid-chrome objects drawn here as SVG. Each body is lit by an
 * SVG lighting filter (so it reads as a puffy 3D piece of metal, not a flat gradient), carries a
 * sky / horizon / ground reflection, a bright rim, and a glint that sweeps across it; most have a
 * small glossy face. Each has one motion of its own (the .ms-* rules in globals.css).
 * Purely decorative. Position one with `className` inside a `relative` parent, or with `x`/`y`
 * when it sits inside another SVG.
 */
export type StickerName =
  | "star"
  | "heart"
  | "smiley"
  | "notch"
  | "cursor"
  | "key"
  | "puzzle"
  | "mic"
  | "bolt"
  | "flower"
  | "bubble"
  | "cd"
  | "cloud"
  | "lock"
  | "crown"
  | "planet"
  | "gem"
  | "check"
  | "ghost"
  | "clover"
  | "moon"
  | "drop"
  | "play"
  | "donut"
  | "eye"
  | "arrow"
  | "pointer"
  | "pointer2"
  | "youtube"
  | "camera"
  | "doc"
  | "pencil"
  | "mail"
  | "speaker"
  | "grid"
  | "clock"
  | "globe"
  | "briefcase"
  | "code"
  | "text";

type Tone = "silver" | "pink" | "blue" | "gold" | "lilac" | "mint" | "holo" | "onyx" | "indigo" | "ember" | "nightholo" | "ruby" | "keygold";
type Motion = "bob" | "spin" | "beat" | "wiggle" | "press" | "flick" | "still";

const INK = "#0b0c11";

/**
 * Chrome as a reflection: bright sky at the top, a hard dark horizon just past the middle, a lit
 * ground below, and a bright lip at the very bottom.
 */
const TONES: Record<Tone, [number, string][]> = {
  silver: [[0, "#ffffff"], [0.16, "#e3ecf7"], [0.4, "#93a3bb"], [0.5, "#2a3142"], [0.56, "#12151e"], [0.62, "#6d7486"], [0.82, "#d5dbe6"], [1, "#ffffff"]],
  pink: [[0, "#ffffff"], [0.16, "#ffdcee"], [0.4, "#ff7fbe"], [0.5, "#8c1458"], [0.56, "#3c0626"], [0.62, "#c2408a"], [0.82, "#ffb8dc"], [1, "#fff4fa"]],
  blue: [[0, "#ffffff"], [0.16, "#d6ecff"], [0.4, "#5aa2ff"], [0.5, "#123c9c"], [0.56, "#061a4a"], [0.62, "#2f6fd6"], [0.82, "#a9d4ff"], [1, "#f2f9ff"]],
  gold: [[0, "#ffffff"], [0.16, "#fff3c2"], [0.4, "#f2b632"], [0.5, "#8a5a00"], [0.56, "#3d2600"], [0.62, "#c78a12"], [0.82, "#ffe08a"], [1, "#fffbe6"]],
  lilac: [[0, "#ffffff"], [0.16, "#ecdfff"], [0.4, "#a57bff"], [0.5, "#431c98"], [0.56, "#1c0a47"], [0.62, "#7b4fe0"], [0.82, "#d2bcff"], [1, "#f9f4ff"]],
  mint: [[0, "#ffffff"], [0.16, "#d5fbea"], [0.4, "#3fd69a"], [0.5, "#0b6e49"], [0.56, "#03301f"], [0.62, "#1fa873"], [0.82, "#a6f2d2"], [1, "#f1fef8"]],
  // Dark metals, for stickers that sit on the light page and need to stand out.
  onyx: [[0, "#b4bdce"], [0.16, "#5b6475"], [0.4, "#222631"], [0.5, "#07080c"], [0.56, "#000000"], [0.62, "#2b3040"], [0.82, "#727b8e"], [1, "#cfd6e2"]],
  indigo: [[0, "#c0bbff"], [0.16, "#6a5cf0"], [0.4, "#3320b0"], [0.5, "#150a5c"], [0.56, "#07032b"], [0.62, "#2a1a9a"], [0.82, "#6f60f2"], [1, "#cfc9ff"]],
  ember: [[0, "#ffd6b0"], [0.16, "#ff8a3c"], [0.4, "#d9480f"], [0.5, "#6e1c02"], [0.56, "#2e0a00"], [0.62, "#b53a0a"], [0.82, "#ff8b45"], [1, "#ffdcc2"]],
  nightholo: [[0, "#8a6cff"], [0.18, "#1f4fd6"], [0.36, "#0a8f8a"], [0.5, "#3a1c8f"], [0.64, "#b0237a"], [0.8, "#2a2fb5"], [0.92, "#0c7fa8"], [1, "#9a86ff"]],
  ruby: [[0, "#ffc6d8"], [0.16, "#ff4d88"], [0.4, "#c20f4e"], [0.5, "#5c0322"], [0.56, "#26000d"], [0.62, "#a00c40"], [0.82, "#ff5c93"], [1, "#ffd3e1"]],
  // Warm gold, only for the "fn" key, so it pops on the page instead of reading as plain chrome.
  keygold: [[0, "#fffbe8"], [0.16, "#fff4c2"], [0.4, "#f5c542"], [0.5, "#b8860b"], [0.56, "#7a5a00"], [0.62, "#d9a21f"], [0.82, "#ffe58a"], [1, "#fff8d6"]],
  holo: [[0, "#ffe1f3"], [0.18, "#c8d6ff"], [0.36, "#b4f5e2"], [0.5, "#fff1b0"], [0.64, "#ffc2e2"], [0.8, "#c9c4ff"], [0.92, "#b9f0ff"], [1, "#ffffff"]],
};

function Defs({ name, d }: { name: StickerName; d?: string }) {
  return (
    <defs>
      {(Object.keys(TONES) as Tone[]).map((tone) => (
        <linearGradient key={tone} id={`ms-${tone}`} x1="0.32" y1="0" x2="0.5" y2="1">
          {TONES[tone].map(([offset, color]) => (
            <stop key={offset} offset={offset} stopColor={color} />
          ))}
        </linearGradient>
      ))}
      {/* The lip of light round the edge: bright above, dark below. */}
      <linearGradient id="ms-rim" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity="0.95" />
        <stop offset="0.5" stopColor="#fff" stopOpacity="0.1" />
        <stop offset="1" stopColor="#000" stopOpacity="0.55" />
      </linearGradient>
      {/* Lights the flat shape as if it were a puffed-up piece of metal: a key light from the upper left, a cool kick from below. */}
      <filter id="ms-metal" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
        <feGaussianBlur in="SourceAlpha" stdDeviation="3.2" result="dome" />
        <feSpecularLighting in="dome" surfaceScale="7" specularConstant="1.15" specularExponent="26" lightingColor="#ffffff" result="key">
          <fePointLight x="18" y="-6" z="70" />
        </feSpecularLighting>
        <feSpecularLighting in="dome" surfaceScale="6" specularConstant="0.7" specularExponent="18" lightingColor="#bcd6ff" result="kick">
          <fePointLight x="96" y="112" z="46" />
        </feSpecularLighting>
        <feComposite in="key" in2="SourceAlpha" operator="in" result="keyIn" />
        <feComposite in="kick" in2="SourceAlpha" operator="in" result="kickIn" />
        <feComposite in="SourceGraphic" in2="keyIn" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="lit" />
        <feComposite in="lit" in2="kickIn" operator="arithmetic" k1="0" k2="1" k3="0.55" k4="0" />
      </filter>
      {d ? (
        <clipPath id={`ms-clip-${name}`}>
          <path d={d} />
        </clipPath>
      ) : null}
    </defs>
  );
}

/** A chrome body: the lit metal, a dark edge, a lip of light inside it, and the glint sweeping across. */
function Body({ name, d, tone, delay = 0 }: { name: StickerName; d: string; tone: Tone; delay?: number }) {
  return (
    <>
      <path d={d} fill={`url(#ms-${tone})`} filter="url(#ms-metal)" />
      <g clipPath={`url(#ms-clip-${name})`}>
        <path d={d} fill="none" stroke="url(#ms-rim)" strokeWidth={5} strokeLinejoin="round" />
        <rect className="ms-sweep" x={-70} y={-30} width={16} height={160} fill="#fff" opacity={0.85} style={{ animationDelay: `${delay}s` }} />
        <rect className="ms-sweep" x={-92} y={-30} width={5} height={160} fill="#fff" opacity={0.7} style={{ animationDelay: `${delay}s` }} />
      </g>
      <path d={d} fill="none" stroke={INK} strokeWidth={1.8} strokeLinejoin="round" />
    </>
  );
}

/** A lit chrome ball, for stickers built from circles. */
function Orb({ cx, cy, r, tone }: { cx: number; cy: number; r: number; tone: Tone }) {
  return (
    <>
      <circle cx={cx} cy={cy} r={r} fill={`url(#ms-${tone})`} filter="url(#ms-metal)" />
      <circle cx={cx} cy={cy} r={r - 1.6} fill="none" stroke="url(#ms-rim)" strokeWidth={3} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={INK} strokeWidth={1.8} />
    </>
  );
}

/** Two glossy blinking eyes and a small smile. `light` draws them in white, for dark bodies. */
function Face({ cx, cy, s = 1, smile = true, light = false }: { cx: number; cy: number; s?: number; smile?: boolean; light?: boolean }) {
  const eye = light ? "#ffffff" : INK;
  const spark = light ? INK : "#ffffff";
  return (
    <g>
      {[-1, 1].map((side) => (
        <g key={side} className="ms-blink">
          <ellipse cx={cx + side * 9 * s} cy={cy} rx={3.6 * s} ry={5 * s} fill={eye} />
          <circle cx={cx + side * 9 * s + 1.2 * s} cy={cy - 1.9 * s} r={1.4 * s} fill={spark} />
          <circle cx={cx + side * 9 * s - 1.1 * s} cy={cy + 2.1 * s} r={0.7 * s} fill={spark} opacity={0.7} />
        </g>
      ))}
      {smile ? <path d={`M ${cx - 4.6 * s} ${cy + 7.5 * s} Q ${cx} ${cy + 12 * s} ${cx + 4.6 * s} ${cy + 7.5 * s}`} fill="none" stroke={eye} strokeWidth={2.2 * s} strokeLinecap="round" /> : null}
    </g>
  );
}

const STAR = "M50 5 C54 31 69 46 95 50 C69 54 54 69 50 95 C46 69 31 54 5 50 C31 46 46 31 50 5 Z";
const HEART = "M50 88 C20 66 7 48 7 31 C7 17 18 9 29 9 C38 9 46 14 50 23 C54 14 62 9 71 9 C82 9 93 17 93 31 C93 48 80 66 50 88 Z";
const BALL = "M50 7 A43 43 0 1 1 49.9 7 Z";
const PILL = "M29 31 H71 A19 19 0 0 1 71 69 H29 A19 19 0 0 1 29 31 Z";
const ARROW = "M24 8 L24 78 L41 63 L53 90 L65 85 L53 59 L78 59 Z";
const KEY = "M25 14 H75 A12 12 0 0 1 87 26 V74 A12 12 0 0 1 75 86 H25 A12 12 0 0 1 13 74 V26 A12 12 0 0 1 25 14 Z";
const PIECE = "M14 37 H36 C31 25 38 15 48 15 C58 15 65 25 60 37 H82 V55 C92 51 98 58 98 66 C98 74 92 81 82 77 V93 H14 Z";
const MIC = "M50 7 A19 19 0 0 1 69 26 V46 A19 19 0 0 1 31 46 V26 A19 19 0 0 1 50 7 Z";
const BOLT = "M59 5 L18 57 H44 L36 95 L82 41 H55 Z";
const BUBBLE = "M19 14 H81 A12 12 0 0 1 93 26 V58 A12 12 0 0 1 81 70 H49 L29 90 V70 H19 A12 12 0 0 1 7 58 V26 A12 12 0 0 1 19 14 Z";
const DISC = "M50 6 A44 44 0 1 1 49.9 6 Z";
const CLOUD = "M26 76 C13 76 6 66 6 57 C6 47 14 40 23 40 C25 26 37 17 50 17 C64 17 75 26 77 40 C87 41 94 49 94 58 C94 68 86 76 76 76 Z";
const LOCK = "M22 44 H78 A8 8 0 0 1 86 52 V84 A8 8 0 0 1 78 92 H22 A8 8 0 0 1 14 84 V52 A8 8 0 0 1 22 44 Z";
const CROWN = "M10 80 L15 30 L35 52 L50 18 L65 52 L85 30 L90 80 Z";
const GEM = "M28 14 H72 L93 40 L50 92 L7 40 Z";
const GHOST = "M18 90 V44 A32 32 0 0 1 82 44 V90 L71 80 L60 90 L50 80 L40 90 L29 80 Z";

const MOON = "M62 8 A44 44 0 1 0 92 62 A34 34 0 1 1 62 8 Z";
const DROP = "M50 6 C50 6 16 46 16 64 A34 34 0 0 0 84 64 C84 46 50 6 50 6 Z";
const PLAY = "M27 13 C22 11 17 14 17 20 V80 C17 86 22 89 27 87 L85 56 C90 53 90 47 85 44 Z";
const DONUT = "M50 6 A44 44 0 1 1 49.9 6 Z M50 32 A18 18 0 1 0 50.1 32 Z";
const EYE = "M4 50 C22 20 78 20 96 50 C78 80 22 80 4 50 Z";
const UPRIGHT = "M32 18 H82 V68 H65 V47 L30 82 L18 70 L53 35 H32 Z";

const YOUTUBE = "M22 22 H78 A18 18 0 0 1 96 40 V60 A18 18 0 0 1 78 78 H22 A18 18 0 0 1 4 60 V40 A18 18 0 0 1 22 22 Z";
const CAMERA = "M14 26 H30 L36 16 H64 L70 26 H86 A10 10 0 0 1 96 36 V78 A10 10 0 0 1 86 88 H14 A10 10 0 0 1 4 78 V36 A10 10 0 0 1 14 26 Z";
const DOC = "M22 6 H62 L84 28 V86 A8 8 0 0 1 76 94 H22 A8 8 0 0 1 14 86 V14 A8 8 0 0 1 22 6 Z";
const PENCIL = "M68 6 L94 32 L38 88 L8 94 L12 64 Z";
const MAIL = "M10 22 H90 A6 6 0 0 1 96 28 V74 A6 6 0 0 1 90 80 H10 A6 6 0 0 1 4 74 V28 A6 6 0 0 1 10 22 Z";
const SPEAKER = "M8 38 H28 L52 14 V86 L28 62 H8 Z";
const GRID = "M14 10 H86 A8 8 0 0 1 94 18 V82 A8 8 0 0 1 86 90 H14 A8 8 0 0 1 6 82 V18 A8 8 0 0 1 14 10 Z";
const CASE = "M10 30 H90 A6 6 0 0 1 96 36 V80 A6 6 0 0 1 90 86 H10 A6 6 0 0 1 4 80 V36 A6 6 0 0 1 10 30 Z";

/** A scalloped seal: a circle with twelve soft bumps. */
const SEAL = (() => {
  const bumps = 12;
  const parts: string[] = [];
  for (let i = 0; i <= bumps * 2; i++) {
    const a = (i / (bumps * 2)) * Math.PI * 2 - Math.PI / 2;
    const r = i % 2 === 0 ? 44 : 37;
    const x = (50 + Math.cos(a) * r).toFixed(1);
    const y = (50 + Math.sin(a) * r).toFixed(1);
    if (i === 0) parts.push(`M ${x} ${y}`);
    else if (i % 2 === 1) parts.push(`Q ${x} ${y}`);
    else parts[parts.length - 1] += ` ${x} ${y}`;
  }
  return `${parts.join(" ")} Z`;
})();

type Design = { motion: Motion; d?: string; art: ReactNode };

const DESIGNS: Record<StickerName, Design> = {
  star: { motion: "wiggle", d: STAR, art: (<><Body name="star" d={STAR} tone="onyx" /><Face cx={50} cy={47} s={0.85} light /></>) },
  heart: { motion: "beat", d: HEART, art: (<><Body name="heart" d={HEART} tone="pink" delay={-1.2} /><Face cx={50} cy={40} /></>) },
  smiley: { motion: "bob", d: BALL, art: (<><Body name="smiley" d={BALL} tone="gold" delay={-2} /><Face cx={50} cy={46} s={1.3} /></>) },
  notch: {
    motion: "bob",
    d: PILL,
    art: (
      <>
        <Body name="notch" d={PILL} tone="silver" delay={-0.6} />
        {[9, 15, 11, 17, 10].map((h, i) => (
          <rect key={i} className="ms-bar" x={36.4 + i * 6} y={50 - h / 2} width={3.2} height={h} rx={1.6} fill={INK} style={{ animationDelay: `${-i * 0.21}s` }} />
        ))}
      </>
    ),
  },
  cursor: { motion: "wiggle", d: ARROW, art: (<><Body name="cursor" d={ARROW} tone="blue" delay={-2.6} /><Face cx={40} cy={44} s={0.72} smile={false} /></>) },
  key: {
    motion: "press",
    d: KEY,
    art: (
      <>
        <Body name="key" d={KEY} tone="keygold" delay={-1.7} />
        <rect x={23} y={21} width={54} height={48} rx={9} fill="#fff4c2" opacity={0.35} stroke={INK} strokeWidth={1.4} />
        <text x={50} y={55} textAnchor="middle" fontSize={25} fontWeight={700} fill={INK} className="font-sans" letterSpacing="-0.04em">
          fn
        </text>
      </>
    ),
  },
  puzzle: { motion: "wiggle", d: PIECE, art: (<><Body name="puzzle" d={PIECE} tone="lilac" delay={-0.9} /><Face cx={46} cy={60} s={0.9} /></>) },
  mic: {
    motion: "bob",
    d: MIC,
    art: (
      <>
        <path d="M22 44 A28 28 0 0 0 78 44 M50 72 V88 M36 91 H64" fill="none" stroke={INK} strokeWidth={7} strokeLinecap="round" />
        <path d="M22 44 A28 28 0 0 0 78 44 M50 72 V88 M36 91 H64" fill="none" stroke="url(#ms-silver)" strokeWidth={4} strokeLinecap="round" />
        <Body name="mic" d={MIC} tone="indigo" delay={-3.1} />
        <Face cx={50} cy={32} s={0.8} light />
      </>
    ),
  },
  // No popping: it floats, and its glint crosses half a cycle after the gem's, so the two never shine at once.
  bolt: { motion: "bob", d: BOLT, art: <Body name="bolt" d={BOLT} tone="ember" delay={-2.1} /> },
  flower: {
    motion: "spin",
    art: (
      <>
        {[0, 60, 120, 180, 240, 300].map((a) => {
          const rad = (a * Math.PI) / 180;
          // Rounded, so the server and the browser print the same numbers.
          return <Orb key={a} cx={Math.round((50 + Math.sin(rad) * 28) * 100) / 100} cy={Math.round((50 - Math.cos(rad) * 28) * 100) / 100} r={18} tone="pink" />;
        })}
        <Orb cx={50} cy={50} r={17} tone="gold" />
        <g className="ms-unspin">
          <Face cx={50} cy={47} s={0.72} />
        </g>
      </>
    ),
  },
  bubble: {
    motion: "bob",
    d: BUBBLE,
    art: (
      <>
        <Body name="bubble" d={BUBBLE} tone="blue" delay={-1.4} />
        {[0, 1, 2].map((i) => (
          <circle key={i} className="ms-dot" cx={34 + i * 16} cy={42} r={5} fill={INK} style={{ animationDelay: `${i * 0.18}s` }} />
        ))}
      </>
    ),
  },
  cd: {
    motion: "spin",
    d: DISC,
    art: (
      <>
        <Body name="cd" d={DISC} tone="nightholo" delay={-2.2} />
        <path d="M50 6 A44 44 0 0 1 94 50 L62 50 A12 12 0 0 0 50 38 Z" fill="#fff" opacity={0.22} />
        <path d="M50 94 A44 44 0 0 1 6 50 L38 50 A12 12 0 0 0 50 62 Z" fill="#fff" opacity={0.14} />
        <Orb cx={50} cy={50} r={13} tone="silver" />
        <circle cx={50} cy={50} r={4.6} fill={INK} />
      </>
    ),
  },
  cloud: { motion: "bob", d: CLOUD, art: (<><Body name="cloud" d={CLOUD} tone="blue" delay={-0.4} /><Face cx={50} cy={52} /></>) },
  lock: {
    motion: "bob",
    d: LOCK,
    art: (
      <>
        {/* the shackle lifts and swings open, then clicks shut again */}
        <g className="ms-shackle">
          <path d="M31 46 V30 A19 19 0 0 1 69 30 V46" fill="none" stroke={INK} strokeWidth={13} strokeLinecap="round" />
          <path d="M31 46 V30 A19 19 0 0 1 69 30 V46" fill="none" stroke="url(#ms-silver)" strokeWidth={9.4} strokeLinecap="round" />
        </g>
        <Body name="lock" d={LOCK} tone="gold" delay={-1.9} />
        <Face cx={50} cy={64} s={0.9} />
      </>
    ),
  },
  crown: {
    motion: "bob",
    d: CROWN,
    art: (
      <>
        <Body name="crown" d={CROWN} tone="gold" delay={-2.8} />
        {[[15, 28, "pink"], [50, 16, "blue"], [85, 28, "mint"]].map(([x, y, tone]) => (
          <Orb key={String(x)} cx={x as number} cy={y as number} r={6.5} tone={tone as Tone} />
        ))}
        <Face cx={50} cy={62} s={0.8} />
      </>
    ),
  },
  planet: {
    motion: "wiggle",
    art: (
      <>
        <g transform="rotate(-20 50 50)">
          <ellipse cx={50} cy={50} rx={47} ry={13} fill="none" stroke={INK} strokeWidth={9} />
          <ellipse cx={50} cy={50} rx={47} ry={13} fill="none" stroke="url(#ms-silver)" strokeWidth={5.6} />
        </g>
        <Orb cx={50} cy={50} r={29} tone="lilac" />
        <Face cx={50} cy={46} s={0.85} />
        {/* the near side of the ring, in front of the planet */}
        <g transform="rotate(-20 50 50)">
          <path d="M3 50 A47 13 0 0 0 97 50" fill="none" stroke={INK} strokeWidth={9} strokeLinecap="round" />
          <path d="M3 50 A47 13 0 0 0 97 50" fill="none" stroke="url(#ms-silver)" strokeWidth={5.6} strokeLinecap="round" />
        </g>
      </>
    ),
  },
  gem: {
    motion: "bob",
    d: GEM,
    art: (
      <>
        <Body name="gem" d={GEM} tone="ruby" delay={0} />
        <path d="M7 40 H93 M28 14 L38 40 L50 92 L62 40 L72 14 M50 14 L38 40 M50 14 L62 40" fill="none" stroke="#fff" strokeWidth={1.1} strokeLinejoin="round" opacity={0.6} />
      </>
    ),
  },
  check: {
    motion: "spin",
    d: SEAL,
    art: (
      <>
        <Body name="check" d={SEAL} tone="mint" delay={-3.4} />
        <g className="ms-unspin">
          <path d="M31 51 L44 64 L70 36" fill="none" stroke={INK} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </>
    ),
  },
  ghost: { motion: "bob", d: GHOST, art: (<><Body name="ghost" d={GHOST} tone="silver" delay={-2.4} /><Face cx={50} cy={46} s={1.05} /></>) },
  moon: { motion: "wiggle", d: MOON, art: (<><Body name="moon" d={MOON} tone="gold" delay={-0.7} /><Face cx={38} cy={52} s={0.7} /></>) },
  drop: { motion: "bob", d: DROP, art: (<><Body name="drop" d={DROP} tone="blue" delay={-1.6} /><Face cx={50} cy={62} s={0.85} /></>) },
  play: { motion: "beat", d: PLAY, art: <Body name="play" d={PLAY} tone="ember" delay={-2.1} /> },
  donut: { motion: "spin", d: DONUT, art: <Body name="donut" d={DONUT} tone="pink" delay={-0.2} /> },
  eye: {
    motion: "bob",
    d: EYE,
    art: (
      <>
        <Body name="eye" d={EYE} tone="silver" delay={-2.9} />
        <Orb cx={50} cy={50} r={17} tone="blue" />
        <g className="ms-blink">
          <circle cx={50} cy={50} r={8} fill={INK} />
          <circle cx={53} cy={46.5} r={2.6} fill="#fff" />
        </g>
      </>
    ),
  },
  // The same cursor shape as the one further down the page, in pink chrome, with no face and standing still, for the pair that flank the
  // headline. The two differ only in when the glint crosses, half a cycle apart, so they never shine at the same time.
  pointer: { motion: "still", d: ARROW, art: <Body name="pointer" d={ARROW} tone="ruby" delay={0} /> },
  pointer2: { motion: "still", d: ARROW, art: <Body name="pointer2" d={ARROW} tone="ruby" delay={-2.1} /> },
  arrow: { motion: "flick", d: UPRIGHT, art: <Body name="arrow" d={UPRIGHT} tone="indigo" delay={-1.3} /> },
  clover: {
    motion: "wiggle",
    art: (
      <>
        <path d="M52 58 C56 74 62 86 72 94" fill="none" stroke={INK} strokeWidth={7} strokeLinecap="round" />
        <path d="M52 58 C56 74 62 86 72 94" fill="none" stroke="url(#ms-mint)" strokeWidth={4} strokeLinecap="round" />
        {[[34, 28], [66, 28], [34, 58], [66, 58]].map(([x, y]) => (
          <Orb key={`${x}-${y}`} cx={x} cy={y} r={19} tone="mint" />
        ))}
        <Face cx={50} cy={41} s={0.8} />
      </>
    ),
  },
  youtube: {
    motion: "beat",
    d: YOUTUBE,
    art: (
      <>
        <Body name="youtube" d={YOUTUBE} tone="ruby" delay={-1.1} />
        <path d="M41 35 L67 50 L41 65 Z" fill="#fff" stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />
      </>
    ),
  },
  camera: {
    motion: "bob",
    d: CAMERA,
    art: (
      <>
        <Body name="camera" d={CAMERA} tone="onyx" delay={-0.8} />
        <Orb cx={50} cy={57} r={23} tone="silver" />
        <Orb cx={50} cy={57} r={12} tone="indigo" />
        <circle cx={44} cy={51} r={3.2} fill="#fff" opacity={0.85} />
        <circle cx={81} cy={40} r={3.4} fill="#ff6b6b" stroke={INK} strokeWidth={1.2} />
      </>
    ),
  },
  doc: {
    motion: "wiggle",
    d: DOC,
    art: (
      <>
        <Body name="doc" d={DOC} tone="silver" delay={-1.5} />
        <path d="M62 6 V28 H84" fill="none" stroke={INK} strokeWidth={2.2} strokeLinejoin="round" />
        <path d="M28 48 H70 M28 62 H70 M28 76 H52" fill="none" stroke={INK} strokeWidth={4.4} strokeLinecap="round" />
      </>
    ),
  },
  pencil: {
    motion: "wiggle",
    d: PENCIL,
    art: (
      <>
        <Body name="pencil" d={PENCIL} tone="gold" delay={-2.3} />
        <path d="M60 14 L86 40" fill="none" stroke={INK} strokeWidth={2} />
        <path d="M12 64 L38 88 L8 94 Z" fill="#f3d9b5" stroke={INK} strokeWidth={1.8} strokeLinejoin="round" />
        <path d="M10 80 L22 92 L8 94 Z" fill={INK} />
        <path d="M68 6 L94 32 L86 40 L60 14 Z" fill="#ff7fbe" stroke={INK} strokeWidth={1.8} strokeLinejoin="round" />
      </>
    ),
  },
  mail: {
    motion: "bob",
    d: MAIL,
    art: (
      <>
        <Body name="mail" d={MAIL} tone="blue" delay={-1.8} />
        <path d="M6 28 L50 58 L94 28" fill="none" stroke={INK} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6 76 L36 50 M94 76 L64 50" fill="none" stroke={INK} strokeWidth={1.6} strokeLinecap="round" opacity={0.7} />
      </>
    ),
  },
  speaker: {
    motion: "beat",
    d: SPEAKER,
    art: (
      <>
        <path d="M66 36 A20 20 0 0 1 66 64 M77 25 A35 35 0 0 1 77 75" fill="none" stroke={INK} strokeWidth={8} strokeLinecap="round" />
        <path d="M66 36 A20 20 0 0 1 66 64 M77 25 A35 35 0 0 1 77 75" fill="none" stroke="url(#ms-mint)" strokeWidth={4.6} strokeLinecap="round" />
        <Body name="speaker" d={SPEAKER} tone="mint" delay={-2.7} />
      </>
    ),
  },
  grid: {
    motion: "bob",
    d: GRID,
    art: (
      <>
        <Body name="grid" d={GRID} tone="mint" delay={-0.5} />
        <path d="M6 28 H94 V18 A8 8 0 0 0 86 10 H14 A8 8 0 0 0 6 18 Z" fill={INK} opacity={0.88} />
        <path d="M6 48 H94 M6 68 H94 M36 10 V90 M64 10 V90" fill="none" stroke={INK} strokeWidth={2.4} />
      </>
    ),
  },
  clock: {
    motion: "wiggle",
    d: BALL,
    art: (
      <>
        <Body name="clock" d={BALL} tone="lilac" delay={-1.3} />
        <circle cx={50} cy={50} r={33} fill="#fff" opacity={0.55} stroke={INK} strokeWidth={1.6} />
        <path d="M50 50 V27 M50 50 L66 59" fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />
        <circle cx={50} cy={50} r={3.6} fill={INK} />
      </>
    ),
  },
  globe: {
    motion: "spin",
    d: BALL,
    art: (
      <>
        <Body name="globe" d={BALL} tone="blue" delay={-2.5} />
        <path d="M7 50 H93 M50 7 C26 26 26 74 50 93 M50 7 C74 26 74 74 50 93 M14 28 H86 M14 72 H86" fill="none" stroke="#fff" strokeWidth={1.8} opacity={0.75} />
      </>
    ),
  },
  briefcase: {
    motion: "bob",
    d: CASE,
    art: (
      <>
        <path d="M36 30 V20 A6 6 0 0 1 42 14 H58 A6 6 0 0 1 64 20 V30" fill="none" stroke={INK} strokeWidth={9} strokeLinecap="round" />
        <path d="M36 30 V20 A6 6 0 0 1 42 14 H58 A6 6 0 0 1 64 20 V30" fill="none" stroke="url(#ms-silver)" strokeWidth={5.4} strokeLinecap="round" />
        <Body name="briefcase" d={CASE} tone="onyx" delay={-0.3} />
        <path d="M4 56 H96" fill="none" stroke={INK} strokeWidth={2.2} />
        <rect x={42} y={50} width={16} height={12} rx={3} fill="#f5c542" stroke={INK} strokeWidth={1.8} />
      </>
    ),
  },
  code: {
    motion: "press",
    d: KEY,
    art: (
      <>
        <Body name="code" d={KEY} tone="indigo" delay={-1.9} />
        <text x={50} y={56} textAnchor="middle" fontSize={27} fontWeight={800} fill="#fff" className="font-sans" letterSpacing="-0.06em">
          {"</>"}
        </text>
      </>
    ),
  },
  text: {
    motion: "press",
    d: KEY,
    art: (
      <>
        <Body name="text" d={KEY} tone="mint" delay={-0.6} />
        <text x={50} y={57} textAnchor="middle" fontSize={27} fontWeight={800} fill={INK} className="font-sans" letterSpacing="-0.05em">
          abc
        </text>
      </>
    ),
  },
};

export function Sticker({ name, className = "", size = 72, rotate = 0, x, y }: {
  name: StickerName;
  /** Where it sits, e.g. "absolute -right-6 -top-8". */
  className?: string;
  /** Width and height in px (or in the parent SVG's units, with x/y). */
  size?: number;
  /** Tilt in degrees. */
  rotate?: number;
  /** Position inside a parent SVG. */
  x?: number;
  y?: number;
}) {
  const design = DESIGNS[name];
  const nested = x !== undefined || y !== undefined;
  const style: CSSProperties | undefined = nested ? undefined : { width: size, height: size, transform: `rotate(${rotate}deg)` };
  return (
    <svg
      viewBox="-6 -6 112 112"
      x={x}
      y={y}
      width={size}
      height={size}
      aria-hidden
      focusable="false"
      overflow="visible"
      className={`ms-sticker z-10 select-none ${nested ? "pointer-events-none" : "ms-hover max-w-none"} ${className}`}
      style={style}
    >
      <Defs name={name} d={design.d} />
      <g className={`ms-${design.motion}`}>{design.art}</g>
    </svg>
  );
}
