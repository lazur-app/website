/**
 * The five things the mercury turns into. Each exists twice:
 *   - as a drawing (`paintShape`), used while the shape is held, so its outline is exact;
 *   - as the same number of points filling that drawing (`buildShapes`), used while the metal melts
 *     from one shape to the next: the engine moves one small disc per point and the blur and
 *     threshold fuse the discs into liquid.
 * The small motions a held shape has (the bars speaking, the pen straightening its line) are the
 * same functions in both, so drawing and discs always agree.
 *
 * Everything here is in "design units": a 1000 x 375 stage, whatever size it is shown at.
 */

export const DW = 1000;
export const DH = 375;
/** Discs in the blob. Every shape has exactly this many points. */
export const COUNT = 1100;

/** Where the icons sit: dead centre of the stage; the verb hangs to their right. */
export const ICON_X = 500;
export const ICON_Y = 188;

export const LAZUR = 0;
export const WAVE = 1;
export const PEN = 2;
export const CHECK = 3;
export const CURSOR = 4;
export const DROP = 5;

/** Seconds the pen is on stage; its pass along the line is timed to this. */
export const PEN_HOLD = 3;

export type Shape = {
  x: Float32Array;
  y: Float32Array;
  /** Which part of the shape a point belongs to (a bar of the waveform, the line or the pen). */
  tag: Float32Array;
  /** A second number per point: how far along the line it is. */
  aux: Float32Array;
  /** Disc radius, in design units. */
  r: number;
  cx: number;
  cy: number;
};

type Point = { x: number; y: number; tag: number; aux: number };
type Ctx = CanvasRenderingContext2D;

/** The waveform: bar heights, left to right. */
const BARS = [64, 128, 196, 112, 168, 92, 50];
const BAR_W = 31;
const BAR_PITCH = 46;
const WAVE_LEFT = ICON_X - ((BARS.length - 1) * BAR_PITCH) / 2;

/** The line the pen straightens. */
const LINE = { x0: 356, x1: 614, y: 258, wave: 54, amp: 15, width: 18 };
const LINE_LENGTH = LINE.x1 - LINE.x0;

/** The same arrow the chrome cursor stickers use. */
const ARROW = "M24 8 L24 78 L41 63 L53 90 L65 85 L53 59 L78 59 Z";
const ARROW_SCALE = 2.5;

/** A cheap repeatable random number in 0..1 for an index. */
export function hash(n: number): number {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
}

const smooth = (a: number, b: number, t: number) => {
  const u = Math.min(1, Math.max(0, (t - a) / (b - a)));
  return u * u * (3 - 2 * u);
};

// ---- the small motions of a held shape ---------------------------------------------------

/** How tall a bar of the waveform is right now, 0.3..1 of its drawn height: each bar on its own beat. */
export function barLevel(bar: number, time: number): number {
  const level = 0.62 + 0.38 * Math.sin(time * 5.1 + bar * 1.9) * Math.sin(time * 1.7 + bar * 0.6);
  return 0.3 + 0.7 * level;
}

/** How far along the line (0..1) the pen tip is, `held` seconds after the shape formed. */
export function penAlong(held: number): number {
  return 0.2 + 0.66 * smooth(0.3, PEN_HOLD - 0.55, held);
}

/** How far the line is off straight at a point along it: wobbly ahead of the pen, straight behind it. */
export function lineWobble(along: number, pen: number): number {
  return LINE.amp * Math.sin(((along * LINE_LENGTH) / LINE.wave) * Math.PI * 2) * smooth(pen + 0.01, pen + 0.09, along);
}

/** The tick lands with a small bounce: its scale, `held` seconds after it formed. */
export function tickScale(held: number): number {
  return 1 + Math.exp(-held * 5) * Math.sin(held * 16) * 0.07;
}

/** The cursor nudges up and left, towards what it points at. */
export function cursorNudge(held: number): number {
  return Math.sin(held * 3.4) * 5;
}

// ---- drawing -----------------------------------------------------------------------------

function roundRect(ctx: Ctx, x: number, y: number, w: number, h: number, r: number) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
  ctx.fill();
}

/** The pen alone, its tip `along` the line. */
function paintPen(ctx: Ctx, along: number, lift = 0) {
  ctx.save();
  ctx.translate(LINE.x0 + along * LINE_LENGTH, LINE.y - 13 + lift);
  ctx.rotate((-52 * Math.PI) / 180);
  // nib
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(46, -21);
  ctx.lineTo(46, 21);
  ctx.closePath();
  ctx.fill();
  // barrel, with a collar near the top
  roundRect(ctx, 40, -21, 150, 42, 9);
  roundRect(ctx, 150, -25, 16, 50, 6);
  ctx.restore();
}

let wordSize: { family: string; size: number; baseline: number } | null = null;

function paintWord(ctx: Ctx, fontFamily: string) {
  const family = fontFamily || "sans-serif";
  if (!wordSize || wordSize.family !== family) {
    ctx.font = `800 200px ${family}`;
    const size = Math.min(236, (200 * 790) / (ctx.measureText("lazur").width || 700));
    ctx.font = `800 ${size}px ${family}`;
    const box = ctx.measureText("lazur");
    const up = box.actualBoundingBoxAscent || size * 0.72;
    const down = box.actualBoundingBoxDescent || 0;
    wordSize = { family, size, baseline: DH / 2 + (up - down) / 2 };
  }
  ctx.font = `800 ${wordSize.size}px ${family}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillText("lazur", DW / 2, wordSize.baseline);
}

/**
 * Draw a shape as it is `held` seconds after forming, in design units, in the context's current
 * fill and stroke colour (set both). `time` drives the motions that never stop (the waveform).
 */
export function paintShape(ctx: Ctx, k: number, fontFamily: string, held: number, time: number) {
  if (k === LAZUR) {
    paintWord(ctx, fontFamily);
  } else if (k === WAVE) {
    BARS.forEach((h, n) => {
      const tall = h * barLevel(n, time);
      roundRect(ctx, WAVE_LEFT + n * BAR_PITCH - BAR_W / 2, ICON_Y - tall / 2, BAR_W, tall, BAR_W / 2);
    });
  } else if (k === PEN) {
    const pen = penAlong(held);
    ctx.lineWidth = LINE.width;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    for (let n = 0; n <= 96; n++) {
      const along = n / 96;
      const x = LINE.x0 + along * LINE_LENGTH;
      const y = LINE.y + lineWobble(along, pen);
      if (n === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    paintPen(ctx, pen, Math.sin(held * 9) * 1.4);
  } else if (k === CHECK) {
    const scale = tickScale(held);
    ctx.save();
    ctx.translate(ICON_X, ICON_Y);
    ctx.scale(scale, scale);
    ctx.lineWidth = 46;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(-100, 8);
    ctx.lineTo(-34, 74);
    ctx.lineTo(100, -72);
    ctx.stroke();
    ctx.restore();
  } else if (k === CURSOR) {
    const nudge = cursorNudge(held);
    ctx.save();
    ctx.translate(ICON_X - 51 * ARROW_SCALE - nudge, ICON_Y - 49 * ARROW_SCALE - nudge);
    ctx.scale(ARROW_SCALE, ARROW_SCALE);
    ctx.lineWidth = 5;
    ctx.lineJoin = "round";
    const arrow = new Path2D(ARROW);
    ctx.fill(arrow);
    ctx.stroke(arrow);
    ctx.restore();
  } else {
    // One bead in the middle: what the blob is before it first becomes the word.
    ctx.beginPath();
    ctx.arc(DW / 2, DH / 2, 70, 0, Math.PI * 2);
    ctx.fill();
  }
}

// ---- points ------------------------------------------------------------------------------

function alphaOf(draw: (ctx: Ctx) => void): Uint8ClampedArray | null {
  const canvas = document.createElement("canvas");
  canvas.width = DW;
  canvas.height = DH;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;
  ctx.fillStyle = "#000";
  ctx.strokeStyle = "#000";
  draw(ctx);
  const data = ctx.getImageData(0, 0, DW, DH).data;
  const alpha = new Uint8ClampedArray(DW * DH);
  for (let i = 0; i < alpha.length; i++) alpha[i] = data[i * 4 + 3];
  return alpha;
}

/** An even (honeycomb) grid of points, `gap` apart, over the inside of a drawn shape. */
function fill(alpha: Uint8ClampedArray, gap: number, tag: (x: number, y: number) => number): Point[] {
  const points: Point[] = [];
  const rowGap = gap * 0.866;
  let row = 0;
  for (let y = rowGap / 2; y < DH; y += rowGap, row++) {
    for (let x = row % 2 ? gap : gap / 2; x < DW; x += gap) {
      if (alpha[Math.round(y) * DW + Math.round(x)] > 127) points.push({ x, y, tag: tag(x, y), aux: 0 });
    }
  }
  return points;
}

type Recipe = {
  draw: (ctx: Ctx) => void;
  tag?: (x: number, y: number) => number;
  /** Points placed by rule instead of by filling the drawing. */
  extra?: (gap: number) => Point[];
};

function build(recipe: Recipe): Shape | null {
  const alpha = alphaOf(recipe.draw);
  if (!alpha) return null;
  const at = (gap: number) => [...fill(alpha, gap, recipe.tag ?? (() => 0)), ...(recipe.extra ? recipe.extra(gap) : [])];
  // The tightest grid that still needs no more than COUNT points.
  let lo = 1.5;
  let hi = 60;
  for (let n = 0; n < 18; n++) {
    const mid = (lo + hi) / 2;
    if (at(mid).length > COUNT) lo = mid;
    else hi = mid;
  }
  const points = at(hi);
  if (points.length === 0) return null;
  // Top up with doubles of points already there, so every shape has the same number.
  const real = points.length;
  for (let n = 0; points.length < COUNT; n++) points.push({ ...points[Math.floor(hash(n + 3) * real)] });

  // Roughly left to right, so a disc on the left of one shape goes to the left of the next.
  const keyed = points.map((p, n) => ({ p, key: p.x + (hash(n * 1.37 + 9) - 0.5) * 150 }));
  keyed.sort((a, b) => a.key - b.key);

  const shape: Shape = {
    x: new Float32Array(COUNT),
    y: new Float32Array(COUNT),
    tag: new Float32Array(COUNT),
    aux: new Float32Array(COUNT),
    r: hi * 0.68,
    cx: 0,
    cy: 0,
  };
  keyed.forEach(({ p }, n) => {
    shape.x[n] = p.x;
    shape.y[n] = p.y;
    shape.tag[n] = p.tag;
    shape.aux[n] = p.aux;
    shape.cx += p.x / COUNT;
    shape.cy += p.y / COUNT;
  });
  return shape;
}

/** All six shapes as points (the five in the loop and the bead the blob starts as), or null where canvas is not available. */
export function buildShapes(fontFamily: string): Shape[] | null {
  const recipes: Recipe[] = [];
  recipes[LAZUR] = { draw: (ctx) => paintShape(ctx, LAZUR, fontFamily, 60, 0) };
  // The bars at full height; the engine squeezes each towards the middle.
  recipes[WAVE] = {
    draw: (ctx) => BARS.forEach((h, n) => roundRect(ctx, WAVE_LEFT + n * BAR_PITCH - BAR_W / 2, ICON_Y - h / 2, BAR_W, h, BAR_W / 2)),
    tag: (x) => Math.max(0, Math.min(BARS.length - 1, Math.round((x - WAVE_LEFT) / BAR_PITCH))),
  };
  // The pen with its tip at the start of the line (the engine slides it along), and the line as rows of points.
  recipes[PEN] = {
    draw: (ctx) => paintPen(ctx, 0),
    tag: () => 2,
    extra: (gap) => {
      const points: Point[] = [];
      const rows = Math.max(2, Math.round(LINE.width / gap) + 1);
      for (let row = 0; row < rows; row++) {
        const dy = (row / (rows - 1) - 0.5) * (LINE.width - 4);
        for (let x = (row % 2) * (gap / 2); x <= LINE_LENGTH; x += gap) points.push({ x: LINE.x0 + x, y: LINE.y + dy, tag: 1, aux: x / LINE_LENGTH });
      }
      return points;
    },
  };
  recipes[CHECK] = { draw: (ctx) => paintShape(ctx, CHECK, fontFamily, 60, 0) };
  recipes[CURSOR] = { draw: (ctx) => paintShape(ctx, CURSOR, fontFamily, 0, 0) };
  recipes[DROP] = { draw: (ctx) => paintShape(ctx, DROP, fontFamily, 0, 0) };

  const shapes: Shape[] = [];
  for (const recipe of recipes) {
    const shape = build(recipe);
    if (!shape) return null;
    shapes.push(shape);
  }
  return shapes;
}

/** The length of the pen's line, for the engine's disc motion. */
export { LINE_LENGTH };
