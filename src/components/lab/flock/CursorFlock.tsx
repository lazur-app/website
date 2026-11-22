"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import styles from "./flock.module.css";

/**
 * A flock of tiny metal arrow cursors. They fly in like starlings, then settle into the word
 * "lazur"; every few seconds the flock lifts off and comes back down as one of the four things
 * Lazur does, and then as "lazur" again. The pointer parts them, a click sends a ring through them.
 *
 * One canvas, one requestAnimationFrame loop. The arrows are drawn once into small sprite sheets
 * (one per metal, one cell per heading) and stamped from there, so a frame is a few hundred
 * `drawImage` calls. The loop stops while the stage is off screen or the tab is hidden; with
 * reduced motion one still frame of "lazur" is drawn instead.
 */

const WORDS = ["lazur", "transcribes", "remembers", "executes", "teaches"] as const;
/** Seconds each word is held once the flock has been called down to it ("lazur" the longest). */
const HOLD = [7.4, 3.1, 3.1, 3.1, 3.1];
/** Seconds the flock flies free between two words, and on the way in. */
const FREE = 0.7;
const FREE_INTRO = 1.25;
/** How long one arrow takes to go from flying free to fully called to its place. */
const RAMP = 0.5;

/** The cursor from the site's sticker set (Sticker.tsx, ARROW), as points in a 100 x 100 box. */
const ARROW: [number, number][] = [[24, 8], [24, 78], [41, 63], [53, 90], [65, 85], [53, 59], [78, 59]];
const MID: [number, number] = [47, 51];
/** Which way the tip points in the drawing: the heading an arrow rests at, so a settled flock is a field of ordinary cursors. */
const REST = Math.atan2(ARROW[0][1] - MID[1], ARROW[0][0] - MID[0]);
/** Headings per sprite sheet. */
const HEADINGS = 48;
const TAU = Math.PI * 2;

/** Metals, as a reflection: sky, horizon, ground, lip. Ruby, pink and blush, the same family as the chrome letters in the headline. */
const METALS: { stops: [number, string][]; edge: string }[] = [
  { stops: [[0, "#ffd9e5"], [0.2, "#ff4d88"], [0.46, "#c20f4e"], [0.6, "#5c0322"], [0.74, "#a00c40"], [0.9, "#ff5c93"], [1, "#ffd3e1"]], edge: "#2b0412" },
  { stops: [[0, "#ffffff"], [0.2, "#ffc4e0"], [0.46, "#ff6fb4"], [0.6, "#a31a66"], [0.74, "#d2489a"], [0.9, "#ffb1d8"], [1, "#fff4fa"]], edge: "#3c0626" },
  { stops: [[0, "#ffffff"], [0.22, "#ffe6f1"], [0.46, "#ffb3d4"], [0.6, "#d86a9f"], [0.74, "#f291be"], [0.9, "#ffd9ea"], [1, "#ffffff"]], edge: "#5c0f3a" },
];

/** Where the flock lands for one word: a place per arrow, and how far apart the places are. */
type Landing = { points: Float32Array; pitch: number };

type Sheets = { cell: number; sheets: HTMLCanvasElement[] };

/**
 * One sheet per metal: the arrow at every heading, lit from the upper left whichever way it points.
 * `cell` is the size of one arrow's square in device pixels: the sheets are drawn at exactly the size
 * the landed arrows are shown, so a landed arrow is copied pixel for pixel and stays sharp.
 */
function makeSheets(cell: number): Sheets {
  const k = (cell * 0.76) / 84; // the arrow is about 84 units long
  const sheets = METALS.map((metal) => {
    const sheet = document.createElement("canvas");
    sheet.width = cell * HEADINGS;
    sheet.height = cell;
    const c = sheet.getContext("2d");
    if (!c) return sheet;
    c.lineJoin = "round";
    for (let h = 0; h < HEADINGS; h++) {
      const turn = (h / HEADINGS) * TAU - REST;
      const cos = Math.cos(turn);
      const sin = Math.sin(turn);
      // The points are turned by hand (not with the canvas transform), so the gradient stays fixed to the page: the light does not turn with the arrow.
      const trace = () => {
        c.beginPath();
        ARROW.forEach(([x, y], n) => {
          const dx = (x - MID[0]) * k;
          const dy = (y - MID[1]) * k;
          const px = dx * cos - dy * sin;
          const py = dx * sin + dy * cos;
          if (n === 0) c.moveTo(px, py);
          else c.lineTo(px, py);
        });
        c.closePath();
      };
      c.setTransform(1, 0, 0, 1, h * cell + cell / 2, cell / 2);
      const metalFill = c.createLinearGradient(-cell * 0.12, -cell * 0.4, cell * 0.08, cell * 0.4);
      metal.stops.forEach(([at, color]) => metalFill.addColorStop(at, color));

      // a soft shadow under it, then the metal
      c.save();
      c.shadowColor = "rgba(50, 4, 24, 0.22)";
      c.shadowBlur = cell * 0.06;
      c.shadowOffsetY = cell * 0.04;
      trace();
      c.fillStyle = metalFill;
      c.fill();
      c.restore();

      // a lip of light inside the upper left edge
      c.save();
      trace();
      c.clip();
      c.translate(cell * 0.035, cell * 0.04);
      trace();
      c.strokeStyle = "rgba(255, 255, 255, 0.6)";
      c.lineWidth = cell * 0.05;
      c.stroke();
      c.restore();

      trace();
      c.strokeStyle = metal.edge;
      c.lineWidth = Math.max(1, cell * 0.042);
      c.stroke();
    }
    return sheet;
  });
  return { cell, sheets };
}

/** Evenly spread points inside the word, drawn in the display face as large as the box allows. */
function wordPoints(word: string, fontFamily: string, width: number, height: number, boxWidth: number, boxHeight: number, count: number): Landing {
  const w = Math.max(1, Math.round(width));
  const h = Math.max(1, Math.round(height));
  const off = document.createElement("canvas");
  off.width = w;
  off.height = h;
  const c = off.getContext("2d", { willReadFrequently: true });
  const points = new Float32Array(count * 2);
  if (!c) return { points, pitch: 8 };

  const spaced = c as CanvasRenderingContext2D & { letterSpacing?: string };
  const setFont = (size: number) => {
    c.font = `900 ${size}px ${fontFamily}`;
    if ("letterSpacing" in spaced) spaced.letterSpacing = `${(size * 0.035).toFixed(2)}px`;
  };
  setFont(200);
  const probe = c.measureText(word);
  const probeWidth = probe.actualBoundingBoxLeft + probe.actualBoundingBoxRight || probe.width;
  const probeHeight = probe.actualBoundingBoxAscent + probe.actualBoundingBoxDescent || 200;
  const size = Math.min((boxWidth / probeWidth) * 200, (boxHeight / probeHeight) * 200);
  setFont(size);
  const m = c.measureText(word);
  const inkWidth = m.actualBoundingBoxLeft + m.actualBoundingBoxRight;
  const inkHeight = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
  c.fillStyle = "#000";
  c.textBaseline = "alphabetic";
  c.fillText(word, (w - inkWidth) / 2 + m.actualBoundingBoxLeft, (h - inkHeight) / 2 + m.actualBoundingBoxAscent);

  const data = c.getImageData(0, 0, w, h).data;
  const inked = (x: number, y: number) => x >= 0 && y >= 0 && x < w && y < h && data[(Math.floor(y) * w + Math.floor(x)) * 4 + 3] > 110;

  let ink = 0;
  for (let y = 0; y < h; y += 2) for (let x = 0; x < w; x += 2) if (inked(x, y)) ink++;
  if (ink === 0) return { points, pitch: 8 };

  // A regular staggered grid, its pitch tightened until it holds a place for every arrow: one arrow per place, none doubled up.
  const scan = (pitch: number) => {
    const found: number[] = [];
    let row = 0;
    for (let y = pitch * 0.5; y < h; y += pitch * 0.866, row++) {
      for (let x = row % 2 ? pitch : pitch * 0.5; x < w; x += pitch) {
        if (inked(x, y)) found.push(x, y);
      }
    }
    return found;
  };
  let pitch = Math.sqrt((ink * 4) / (count * 0.866));
  let found = scan(pitch);
  for (let pass = 0; pass < 60 && found.length / 2 < count; pass++) {
    pitch *= 0.985;
    found = scan(pitch);
  }

  // A few places too many: leave some empty, spread through the word.
  let got = found.length / 2;
  while (got > count) {
    const drop = Math.floor(Math.random() * got);
    found[drop * 2] = found[(got - 1) * 2];
    found[drop * 2 + 1] = found[(got - 1) * 2 + 1];
    got--;
  }
  for (let i = 0; i < count; i++) {
    const from = i < got ? i : Math.floor(Math.random() * got); // only if the letters are too fine for the grid
    points[i * 2] = Math.round(found[from * 2]);
    points[i * 2 + 1] = Math.round(found[from * 2 + 1]);
  }
  return { points, pitch };
}

/** Few enough that every arrow has air around it and reads as a cursor. */
const flockSize = (width: number) => (width < 520 ? 300 : width < 960 ? 460 : 640);

export function CursorFlock({ fontFamily, className = "" }: {
  /** The CSS font-family the words are drawn in (already loaded on the page). */
  fontFamily: string;
  className?: string;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!stage || !canvas || !ctx) return;

    let W = 0;
    let H = 0;
    let dpr = 1;
    let N = 0;
    let sprites: Sheets | null = null;
    const sheetsBySize = new Map<number, Sheets>();
    /** Shown size over sheet size: off 1 only while the flock is between two words of different arrow sizes. */
    let stretch = 1;
    let fontReady = false;
    let disposed = false;

    // The flock, one slot per arrow.
    let px = new Float32Array(0);
    let py = new Float32Array(0);
    let vx = new Float32Array(0);
    let vy = new Float32Array(0);
    let tx = new Float32Array(0);
    let ty = new Float32Array(0);
    let heading = new Float32Array(0);
    let delay = new Float32Array(0);
    let seed = new Float32Array(0);
    let metal = new Uint8Array(0);

    let word = 0;
    let wordAt = 0; // when the current word was called
    let free = FREE_INTRO;
    let swirl = 1;
    let clock = 0;
    let last = 0;
    let raf = 0;
    let onScreen = false;
    let started = false;
    const cache = new Map<string, Landing>();
    const pointer = { x: 0, y: 0, on: false };
    const rings: { x: number; y: number; at: number }[] = [];

    const targetsFor = (index: number) => {
      const key = WORDS[index];
      let landing = cache.get(key);
      if (!landing) {
        const boxHeight = stage.clientHeight * 0.9;
        const boxWidth = Math.min(W * 0.9, 1140);
        landing = wordPoints(key, fontFamily, W, H, boxWidth, boxHeight, N);
        cache.set(key, landing);
      }
      return landing;
    };

    /** Give every arrow a place in the word. Arrows on the left take places on the left, loosely, so the flock pours across and does not just swap. */
    const call = (index: number) => {
      const { points, pitch } = targetsFor(index);
      // Arrows are sized to the grid they land on, so neighbours never touch; long words get smaller arrows.
      const cell = Math.max(6, Math.min(Math.round(16 * dpr), Math.round(pitch * 1.06 * dpr)));
      const shown = sprites ? (sprites.cell / dpr) * stretch : cell / dpr;
      let sheets = sheetsBySize.get(cell);
      if (!sheets) {
        sheets = makeSheets(cell);
        sheetsBySize.set(cell, sheets);
      }
      sprites = sheets;
      stretch = shown / (cell / dpr);
      const byPlace = Array.from({ length: N }, (_, i) => i).sort((a, b) => points[a * 2] - points[b * 2]);
      const spread = W * 0.22;
      const keys = new Float32Array(N);
      for (let i = 0; i < N; i++) keys[i] = px[i] + (Math.random() - 0.5) * spread;
      const byFlight = Array.from({ length: N }, (_, i) => i).sort((a, b) => keys[a] - keys[b]);
      for (let n = 0; n < N; n++) {
        const i = byFlight[n];
        const p = byPlace[n];
        tx[i] = points[p * 2];
        ty[i] = points[p * 2 + 1];
        // the word is written left to right
        delay[i] = (tx[i] / W) * 0.22 + Math.random() * 0.22;
      }
    };

    const populate = () => {
      px = new Float32Array(N);
      py = new Float32Array(N);
      vx = new Float32Array(N);
      vy = new Float32Array(N);
      tx = new Float32Array(N);
      ty = new Float32Array(N);
      heading = new Float32Array(N);
      delay = new Float32Array(N);
      seed = new Float32Array(N);
      metal = new Uint8Array(N);
      for (let i = 0; i < N; i++) {
        seed[i] = Math.random();
        const pick = Math.random();
        metal[i] = pick < 0.52 ? 0 : pick < 0.88 ? 1 : 2;
        // two flocks, one from each side of the screen
        const fromLeft = Math.random() < 0.5;
        px[i] = fromLeft ? -30 - Math.random() * W * 0.4 : W + 30 + Math.random() * W * 0.4;
        py[i] = H * (0.5 + (Math.random() - 0.5) * 1.1 + (fromLeft ? -0.12 : 0.12));
        vx[i] = (fromLeft ? 1 : -1) * (380 + Math.random() * 260);
        vy[i] = (Math.random() - 0.5) * 220;
        heading[i] = Math.atan2(vy[i], vx[i]);
      }
    };

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      // Every arrow is stamped whole and opaque, on a device pixel. Once the flock has landed the stamp is a straight copy of the sprite.
      if (sprites) {
        const cell = sprites.cell;
        const s = (cell / dpr) * stretch;
        for (let i = 0; i < N; i++) {
          let h = Math.round((heading[i] / TAU) * HEADINGS) % HEADINGS;
          if (h < 0) h += HEADINGS;
          const x = Math.round((px[i] - s / 2) * dpr) / dpr;
          const y = Math.round((py[i] - s / 2) * dpr) / dpr;
          ctx.drawImage(sprites.sheets[metal[i]], h * cell, 0, cell, cell, x, y, s, s);
        }
      }

      for (const ring of rings) {
        const age = clock - ring.at;
        const fade = 1 - age / 0.9;
        if (fade <= 0) continue;
        ctx.beginPath();
        ctx.arc(ring.x, ring.y, 20 + age * 820, 0, TAU);
        ctx.strokeStyle = `rgba(194, 15, 78, ${(0.3 * fade * fade).toFixed(3)})`;
        ctx.lineWidth = 1 + 5 * fade;
        ctx.stroke();
      }
    };

    // Each arrow steers by the flock around it: the cell it is in gives it a shared heading and a centre to keep to.
    const CELL = 64;
    let cols = 0;
    let rows = 0;
    let cellVx = new Float32Array(0);
    let cellVy = new Float32Array(0);
    let cellX = new Float32Array(0);
    let cellY = new Float32Array(0);
    let cellN = new Float32Array(0);
    const cellOf = (x: number, y: number) => {
      const cx = Math.min(cols - 1, Math.max(0, Math.floor(x / CELL) + 2));
      const cy = Math.min(rows - 1, Math.max(0, Math.floor(y / CELL) + 2));
      return cy * cols + cx;
    };

    const step = (dt: number) => {
      clock += dt;
      if (clock - wordAt > free + HOLD[word]) {
        // Lift off: a kick outwards and round, then the next word calls them down.
        word = (word + 1) % WORDS.length;
        wordAt = clock;
        free = FREE;
        swirl = -swirl;
        for (let i = 0; i < N; i++) {
          const a = Math.random() * TAU;
          const kick = 90 + Math.random() * 230;
          const ox = px[i] - W / 2;
          const oy = py[i] - H / 2;
          const far = Math.hypot(ox, oy) || 1;
          vx[i] += Math.cos(a) * kick + (-oy / far) * 200 * swirl;
          vy[i] += Math.sin(a) * kick + (ox / far) * 200 * swirl - 70;
        }
        call(word);
      }
      const since = clock - wordAt - free;
      const flocking = since < 0.44 + RAMP + 0.1;
      stretch += (1 - stretch) * Math.min(1, dt * 4);
      if (Math.abs(1 - stretch) < 0.012) stretch = 1;

      if (flocking) {
        cellVx.fill(0);
        cellVy.fill(0);
        cellX.fill(0);
        cellY.fill(0);
        cellN.fill(0);
        for (let i = 0; i < N; i++) {
          const c = cellOf(px[i], py[i]);
          cellVx[c] += vx[i];
          cellVy[c] += vy[i];
          cellX[c] += px[i];
          cellY[c] += py[i];
          cellN[c]++;
        }
      }

      const reach = Math.max(80, Math.min(150, W * 0.11));
      const midX = W / 2;
      const midY = H / 2;

      for (let i = 0; i < N; i++) {
        const x = px[i];
        const y = py[i];
        // 0 while flying free, 1 once called to its place
        let held = (since - delay[i]) / RAMP;
        held = held <= 0 ? 0 : held >= 1 ? 1 : held * held * (3 - 2 * held);
        const loose = 1 - held;
        let ax = 0;
        let ay = 0;

        if (held > 0) {
          ax += (tx[i] - x) * 40 * held;
          ay += (ty[i] - y) * 40 * held;
        }

        if (loose > 0 && flocking) {
          const c = cellOf(x, y);
          const n = cellN[c];
          if (n > 1) {
            ax += (cellVx[c] / n - vx[i]) * 2.4 * loose; // fly the way the neighbours fly
            ay += (cellVy[c] / n - vy[i]) * 2.4 * loose;
            ax += (cellX[c] / n - x) * 1.6 * loose; // and stay with them
            ay += (cellY[c] / n - y) * 1.6 * loose;
          }
          // the air they fly through: slow rolling currents
          const air = (Math.sin(x * 0.0046 + clock * 0.9) + Math.cos(y * 0.0071 - clock * 0.6) + Math.sin((x + y) * 0.003 + clock * 0.35 + seed[i])) * 1.7;
          ax += Math.cos(air) * 430 * loose;
          ay += Math.sin(air) * 430 * loose;
          // keep the flock over the stage, and turning
          const ox = x - midX;
          const oy = y - midY;
          ax += (-ox * 1.5 - oy * 1.1 * swirl) * loose;
          ay += (-oy * 3.4 + ox * 0.5 * swirl) * loose;
        }

        if (pointer.on) {
          const dx = x - pointer.x;
          const dy = y - pointer.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < reach * reach) {
            const d = Math.sqrt(d2) || 1;
            const push = (1 - d / reach) ** 2 * 11500;
            ax += (dx / d) * push;
            ay += (dy / d) * push;
          }
        }

        for (const ring of rings) {
          const age = clock - ring.at;
          if (age > 0.9) continue;
          const dx = x - ring.x;
          const dy = y - ring.y;
          const d = Math.sqrt(dx * dx + dy * dy) || 1;
          const off = Math.abs(d - (20 + age * 820));
          if (off < 70) {
            const push = (1 - off / 70) * (1 - age / 0.9) * 11500;
            ax += (dx / d) * push;
            ay += (dy / d) * push;
          }
        }

        let nvx = vx[i] + ax * dt;
        let nvy = vy[i] + ay * dt;
        const drag = Math.exp(-(0.7 + 7.4 * held) * dt);
        nvx *= drag;
        nvy *= drag;
        const speed = Math.sqrt(nvx * nvx + nvy * nvy);
        if (speed > 900) {
          nvx *= 900 / speed;
          nvy *= 900 / speed;
        }
        vx[i] = nvx;
        vy[i] = nvy;
        px[i] = x + nvx * dt;
        py[i] = y + nvy * dt;

        // Point where it is going; once it has landed, turn back into an ordinary cursor.
        const flying = speed > 26;
        const want = flying ? Math.atan2(nvy, nvx) : REST;
        let turn = want - heading[i];
        turn -= Math.round(turn / TAU) * TAU;
        heading[i] += turn * Math.min(1, (flying ? 13 : 9) * dt);

        // Landed: it is simply there. Exactly on its place, perfectly still, an ordinary cursor.
        if (held === 1 && speed < 6 && Math.abs(tx[i] - px[i]) < 0.45 && Math.abs(ty[i] - py[i]) < 0.45) {
          px[i] = tx[i];
          py[i] = ty[i];
          vx[i] = 0;
          vy[i] = 0;
          if (Math.abs(turn) < 0.04) heading[i] = REST;
        }
      }

      while (rings.length && clock - rings[0].at > 0.9) rings.shift();
    };

    const tick = (now: number) => {
      raf = 0;
      if (!onScreen || document.hidden) return;
      const dt = Math.min(1 / 30, Math.max(0, (now - last) / 1000));
      last = now;
      step(dt);
      draw();
      raf = requestAnimationFrame(tick);
    };

    const wake = () => {
      if (reduced || !started || raf || !onScreen || document.hidden) return;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };

    /** The still frame, for reduced motion: "lazur", already formed. */
    const still = () => {
      call(0);
      for (let i = 0; i < N; i++) {
        px[i] = tx[i];
        py[i] = ty[i];
        vx[i] = 0;
        vy[i] = 0;
        heading[i] = REST;
      }
      wordAt = 0;
      clock = 0;
      free = 0;
      stretch = 1;
      draw();
    };

    const layout = () => {
      if (disposed || !fontReady) return;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (width < 10 || height < 10) return;
      const nextDpr = Math.min(2, window.devicePixelRatio || 1);
      if (width === W && height === H && nextDpr === dpr && started) return;
      const scaleX = W ? width / W : 1;
      const scaleY = H ? height / H : 1;
      if (nextDpr !== dpr) {
        sheetsBySize.clear();
        sprites = null;
      }
      dpr = nextDpr;
      W = width;
      H = height;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      cols = Math.ceil(W / CELL) + 4;
      rows = Math.ceil(H / CELL) + 4;
      cellVx = new Float32Array(cols * rows);
      cellVy = new Float32Array(cols * rows);
      cellX = new Float32Array(cols * rows);
      cellY = new Float32Array(cols * rows);
      cellN = new Float32Array(cols * rows);
      cache.clear();

      const count = flockSize(W);
      if (count !== N || !started) {
        N = count;
        populate();
        word = 0;
        wordAt = clock;
        free = FREE_INTRO;
        call(0);
      } else {
        for (let i = 0; i < N; i++) {
          px[i] *= scaleX;
          py[i] *= scaleY;
        }
        call(word);
      }
      started = true;
      if (reduced) still();
      else wake();
    };

    const watcher = new IntersectionObserver(
      (entries) => {
        onScreen = entries.some((entry) => entry.isIntersecting);
        wake();
      },
      { rootMargin: "80px 0px" },
    );
    watcher.observe(canvas);
    const sizer = new ResizeObserver(layout);
    sizer.observe(canvas);

    const place = (event: PointerEvent) => {
      const box = canvas.getBoundingClientRect();
      pointer.x = event.clientX - box.left;
      pointer.y = event.clientY - box.top;
      return pointer.x > -40 && pointer.x < W + 40 && pointer.y > -40 && pointer.y < H + 40;
    };
    const onMove = (event: PointerEvent) => {
      pointer.on = place(event);
    };
    const onDown = (event: PointerEvent) => {
      const inside = place(event);
      pointer.on = inside;
      if (inside && !reduced && rings.length < 4) rings.push({ x: pointer.x, y: pointer.y, at: clock });
    };
    const onUp = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") pointer.on = false; // a finger lifted: let them regroup
    };
    const onLeave = () => {
      pointer.on = false;
    };
    if (!reduced) {
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerdown", onDown, { passive: true });
      window.addEventListener("pointerup", onUp, { passive: true });
      window.addEventListener("pointercancel", onLeave, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
    }
    document.addEventListener("visibilitychange", wake);

    // The words are drawn in the page's display face, so wait for it (briefly) before measuring them.
    const begin = () => {
      if (fontReady) return;
      fontReady = true;
      layout();
    };
    const patience = window.setTimeout(begin, 2500);
    if (document.fonts?.load) {
      document.fonts.load(`900 120px ${fontFamily}`, "lazur").then(begin, begin);
    } else {
      begin();
    }

    return () => {
      disposed = true;
      window.clearTimeout(patience);
      watcher.disconnect();
      sizer.disconnect();
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onLeave);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", wake);
    };
  }, [fontFamily, reduced]);

  return (
    <div ref={stageRef} className={`${styles.stage} ${className}`}>
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden />
      <p className="sr-only">
        An animation: hundreds of small metal arrow cursors fly in like a flock of birds and settle into the word lazur. Every few
        seconds they lift off and form, in turn, the words transcribes, remembers, executes and teaches, and then lazur again. All of that is
        Lazur.
      </p>
    </div>
  );
}
