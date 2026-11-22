/**
 * The footer sign-off: the Lazur mark and name, built out of small jigsaw pieces. A fine grid of
 * interlocking pieces, each in one of a handful of dark colours picked at random, is shown only
 * where the mark and the letters are, so the word itself is the finished puzzle. Every piece
 * slowly changes colour on its own clock (CSS, see .puzzle-piece in globals.css), and the whole
 * word is finished as metal: a chrome reflection and a bevel on every piece.
 * The layout is seeded, so the server and the browser draw the same puzzle.
 */
const W = 1200;
const H = 340;
const COLS = 36;
const ROWS = 10;
const CELL_W = W / COLS;
const CELL_H = H / ROWS;

/** Deep, saturated colours for the pieces. */
const COLORS = ["#1d3fa8", "#6a1fb0", "#0a7d6e", "#b3123f", "#3f7d12", "#1c1917", "#b85a00", "#0b63c4", "#4b2fc0", "#0a8a43", "#c23a0e", "#8a0f6b"];

/** A small seeded random number generator (mulberry32). */
function seeded(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * One side of a piece, from (x0, y0) to (x1, y1), with a knob pushed out by `side` (0 = straight,
 * for the outer border). Returns the path commands after the starting point.
 */
function side(x0: number, y0: number, x1: number, y1: number, knob: number) {
  if (knob === 0) return `L ${x1.toFixed(1)} ${y1.toFixed(1)}`;
  const dx = x1 - x0;
  const dy = y1 - y0;
  const length = Math.hypot(dx, dy);
  // Unit normal; `knob` is +1 or -1 in a fixed screen direction (down for horizontal sides, right for vertical).
  const horizontal = Math.abs(dx) > Math.abs(dy);
  const nx = horizontal ? 0 : knob;
  const ny = horizontal ? knob : 0;
  const bump = length * 0.24;
  const p = (along: number, across: number) => `${(x0 + dx * along + nx * bump * across).toFixed(1)} ${(y0 + dy * along + ny * bump * across).toFixed(1)}`;
  return [`L ${p(0.37, 0)}`, `C ${p(0.46, 0)} ${p(0.3, 1)} ${p(0.5, 1)}`, `C ${p(0.7, 1)} ${p(0.54, 0)} ${p(0.63, 0)}`, `L ${p(1, 0)}`].join(" ");
}

function buildPieces() {
  const random = seeded(20261122);
  const sign = () => (random() < 0.5 ? 1 : -1);
  // across[r][c]: the seam above piece (r, c); down[r][c]: the seam to its left.
  const across = Array.from({ length: ROWS + 1 }, (_, r) => Array.from({ length: COLS }, () => (r === 0 || r === ROWS ? 0 : sign())));
  const down = Array.from({ length: ROWS }, () => Array.from({ length: COLS + 1 }, (_, c) => (c === 0 || c === COLS ? 0 : sign())));
  const pieces: { d: string; fill: string; cycle: number; seconds: number; delay: number }[] = [];
  let last = "";
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const x0 = c * CELL_W;
      const y0 = r * CELL_H;
      const x1 = x0 + CELL_W;
      const y1 = y0 + CELL_H;
      const d = [
        `M ${x0.toFixed(1)} ${y0.toFixed(1)}`,
        side(x0, y0, x1, y0, across[r][c]),
        side(x1, y0, x1, y1, down[r][c + 1]),
        side(x1, y1, x0, y1, across[r + 1][c]),
        side(x0, y1, x0, y0, down[r][c]),
        "Z",
      ].join(" ");
      // Never the same colour twice in a row along a line.
      let fill = COLORS[Math.floor(random() * COLORS.length)];
      if (fill === last) fill = COLORS[(COLORS.indexOf(fill) + 1 + Math.floor(random() * (COLORS.length - 1))) % COLORS.length];
      last = fill;
      // Each piece changes colour on its own clock: one of four colour orders, its own pace, its own start.
      pieces.push({ d, fill, cycle: Math.floor(random() * 4), seconds: 3 + random() * 6, delay: -random() * 9 });
    }
  }
  return pieces;
}

const PIECES = buildPieces();
/** Every seam in one path, for the bevels drawn over the pieces. */
const SEAMS = PIECES.map((piece) => piece.d).join(" ");

export function PuzzleWordmark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="100 46 986 244" className={`block h-auto w-full ${className}`} aria-hidden focusable="false">
      <defs>
        {/* Only the mark and the letters let the puzzle show through. */}
        <mask id="puzzle-wordmark-shape" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x={0} y={0} width={W} height={H}>
          <image href="/logo.png" x={104} y={58} width={224} height={224} preserveAspectRatio="xMidYMid meet" />
          {/* textLength pins the word's width, so it fills the frame whichever font loads. */}
          <text x={356} y={270} fontSize={292} fontWeight={700} textLength={722} lengthAdjust="spacingAndGlyphs" fill="#000" className="font-sans">
            lazur
          </text>
        </mask>
        {/* The chrome reflection laid over the colours: bright sky, a hard dark horizon, lit ground. */}
        <linearGradient id="puzzle-chrome" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.95" />
          <stop offset="0.3" stopColor="#fff" stopOpacity="0.35" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.05" />
          <stop offset="0.53" stopColor="#000" stopOpacity="0.6" />
          <stop offset="0.6" stopColor="#000" stopOpacity="0.2" />
          <stop offset="0.82" stopColor="#fff" stopOpacity="0.25" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.7" />
        </linearGradient>
      </defs>
      {/* a soft shadow under the whole word */}
      <g mask="url(#puzzle-wordmark-shape)" transform="translate(0 5)" opacity={0.28}>
        <rect x={0} y={0} width={W} height={H} fill="#000" />
      </g>
      <g mask="url(#puzzle-wordmark-shape)">
        {PIECES.map((piece, i) => (
          <path
            key={i}
            d={piece.d}
            fill={piece.fill}
            className={`puzzle-piece puzzle-piece--${piece.cycle}`}
            style={{ animationDuration: `${piece.seconds.toFixed(1)}s`, animationDelay: `${piece.delay.toFixed(1)}s` }}
          />
        ))}
        {/* metal: the reflection across the whole word */}
        <rect x={0} y={40} width={W} height={260} fill="url(#puzzle-chrome)" style={{ mixBlendMode: "overlay" }} />
        <rect x={0} y={40} width={W} height={260} fill="url(#puzzle-chrome)" opacity={0.35} />
        {/* each piece gets a bevel: a lit edge up and to the left, a shaded edge down and to the right */}
        <path d={SEAMS} fill="none" stroke="#fff" strokeOpacity={0.75} strokeWidth={1.1} transform="translate(-0.8 -0.8)" />
        <path d={SEAMS} fill="none" stroke="#000" strokeOpacity={0.6} strokeWidth={1.1} transform="translate(0.8 0.8)" />
        <path d={SEAMS} fill="none" stroke="#0b0c11" strokeWidth={0.7} />
      </g>
    </svg>
  );
}
