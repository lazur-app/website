/**
 * The four jigsaw pieces of the "Get Lazur" pill. Together they tile a rounded rectangle, two by
 * two; every seam carries one knob, and each piece has exactly one knob and one socket (a
 * pinwheel), so they really interlock. All numbers are in the pill's own units (CSS px at scale 1),
 * with the pill's top left corner at 0, 0.
 */
export const PILL_W = 352;
export const PILL_H = 136;
export const PILL_R = 44;
/** Room around the pill inside every layer, for knobs, shadows and rotation. */
export const PAD = 40;

type Point = [number, number];

/** Knob outline, as cubic segments: `a` runs along the seam, `b` out of it. It starts at (-8, 0). */
const KNOB_SIZE = 1.08;
const KNOB: Point[][] = [
  [[-3, 0], [-4.5, 6], [-7, 9]],
  [[-13, 15], [-9, 24], [0, 24]],
  [[9, 24], [13, 15], [7, 9]],
  [[4.5, 6], [3, 0], [8, 0]],
];
/** How far a knob sticks out of its piece. */
export const KNOB_OUT = 24 * KNOB_SIZE;

const n2 = (value: number) => Number(value.toFixed(2));

/**
 * A knob centred on `c`, drawn while travelling along `u`, bulging towards `out`. The outline is
 * symmetric, so the two pieces that share a seam (and walk it in opposite directions) draw the
 * very same curve.
 */
function knob(c: Point, u: Point, out: Point) {
  const at = ([a, b]: Point) => `${n2(c[0] + (u[0] * a + out[0] * b) * KNOB_SIZE)} ${n2(c[1] + (u[1] * a + out[1] * b) * KNOB_SIZE)}`;
  return `L ${at([-8, 0])} ${KNOB.map((segment) => `C ${segment.map(at).join(" ")}`).join(" ")}`;
}

/** The four outlines (top left, top right, bottom left, bottom right), shifted by `o` on both axes. */
function outlines(o: number) {
  const W = PILL_W;
  const H = PILL_H;
  const R = PILL_R;
  const mx = W / 2;
  const my = H / 2;
  const pt = (x: number, y: number) => `${n2(x + o)} ${n2(y + o)}`;
  const arc = (x: number, y: number) => `A ${R} ${R} 0 0 1 ${pt(x, y)}`;
  const k = (x: number, y: number, u: Point, out: Point) => knob([x + o, y + o], u, out);
  // Seams: upper upright (knob to the right), lower upright (knob to the left),
  // left level (knob up), right level (knob down).
  return [
    `M ${pt(0, my)} L ${pt(0, R)} ${arc(R, 0)} L ${pt(mx, 0)} ${k(mx, my / 2, [0, 1], [1, 0])} L ${pt(mx, my)} ${k(mx / 2, my, [-1, 0], [0, -1])} Z`,
    `M ${pt(mx, 0)} L ${pt(W - R, 0)} ${arc(W, R)} L ${pt(W, my)} ${k(mx * 1.5, my, [-1, 0], [0, 1])} L ${pt(mx, my)} ${k(mx, my / 2, [0, -1], [1, 0])} Z`,
    `M ${pt(mx, H)} L ${pt(R, H)} ${arc(0, H - R)} L ${pt(0, my)} ${k(mx / 2, my, [1, 0], [0, -1])} L ${pt(mx, my)} ${k(mx, my * 1.5, [0, 1], [-1, 0])} L ${pt(mx, H)} Z`,
    `M ${pt(W, my)} L ${pt(W, H - R)} ${arc(W - R, H)} L ${pt(mx, H)} ${k(mx, my * 1.5, [0, -1], [-1, 0])} L ${pt(mx, my)} ${k(mx * 1.5, my, [1, 0], [0, 1])} L ${pt(W, my)} Z`,
  ];
}

/** Outlines in the pill's units, for drawing inside an SVG. */
export const OUTLINES = outlines(0);
/** The same outlines in a layer's CSS px (the pill sits PAD in from the layer's corner), for clip-path. */
export const LAYER_OUTLINES = outlines(PAD);

export type Tone = "ruby" | "indigo" | "ember" | "teal";

export type Piece = {
  verb: string;
  tone: Tone;
  /** Middle of the piece: what it turns about. */
  center: Point;
  /** Where its word is centred. */
  text: Point;
  /** Left and right edge, knob included. */
  span: [number, number];
};

export const PIECES: Piece[] = [
  { verb: "transcribes", tone: "ruby", center: [88, 34], text: [91, 31], span: [0, 176 + KNOB_OUT] },
  { verb: "remembers", tone: "indigo", center: [264, 34], text: [279, 31], span: [176, 352] },
  { verb: "executes", tone: "ember", center: [88, 102], text: [80, 108], span: [0, 176] },
  { verb: "teaches", tone: "teal", center: [264, 102], text: [266, 110], span: [176 - KNOB_OUT, 352] },
];

/** Deep jewel metals: lip of light, bright band, body, shade, horizon. */
export const TONES: Record<Tone, [string, string, string, string, string]> = {
  ruby: ["#ffd9e5", "#ff6a9c", "#d41a5e", "#a30d43", "#5e0424"],
  indigo: ["#dcd8ff", "#8577f7", "#4c37d6", "#2c1ba0", "#160b60"],
  ember: ["#ffe4cf", "#ff9d52", "#e45a11", "#b63c0b", "#702003"],
  teal: ["#d0f8ed", "#45d8b4", "#0f9f85", "#0a7c6d", "#044139"],
};
