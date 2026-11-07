"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, RotateCw, ChevronsDown } from "lucide-react";
import { gameBySlug } from "@/lib/games";
import { Chip, GameFrame, confetti, sfx, useBest, useLoop, type Phase } from "./kit";

const GAME = gameBySlug("desk-tetris")!;
const COLS = 10;
const ROWS = 20;

/** Desk things as tetrominoes. */
const PIECES: Record<string, { cells: number[][]; color: string; dark: string; e: string; name: string }> = {
  I: { cells: [[0, 1], [1, 1], [2, 1], [3, 1]], color: "#38bdf8", dark: "#0369a1", e: "💻", name: "laptop" },
  O: { cells: [[1, 0], [2, 0], [1, 1], [2, 1]], color: "#d6a77a", dark: "#7c4a21", e: "☕", name: "mug" },
  T: { cells: [[1, 0], [0, 1], [1, 1], [2, 1]], color: "#4ade80", dark: "#15803d", e: "🪴", name: "plant" },
  S: { cells: [[1, 0], [2, 0], [0, 1], [1, 1]], color: "#fde047", dark: "#a16207", e: "📝", name: "sticky note" },
  Z: { cells: [[0, 0], [1, 0], [1, 1], [2, 1]], color: "#f472b6", dark: "#9d174d", e: "📌", name: "pin" },
  L: { cells: [[2, 0], [0, 1], [1, 1], [2, 1]], color: "#fb923c", dark: "#c2410c", e: "💡", name: "lamp" },
  J: { cells: [[0, 0], [0, 1], [1, 1], [2, 1]], color: "#a78bfa", dark: "#6d28d9", e: "📚", name: "books" },
};
const KINDS = Object.keys(PIECES);

type Piece = { kind: string; cells: number[][]; x: number; y: number };
type Grid = (string | null)[][];

const emptyGrid = (): Grid => Array.from({ length: ROWS }, () => Array<string | null>(COLS).fill(null));

function rotate(cells: number[][]): number[][] {
  // rotate clockwise around the piece's bounding box
  const size = Math.max(...cells.flat()) + 1;
  return cells.map(([x, y]) => [size - 1 - y, x]);
}

export function DeskTetris() {
  "use no memo"; // imperative canvas game: mutable state lives in refs and is drawn every frame
  const board = useRef<HTMLCanvasElement>(null);
  const preview = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<Phase>("ready");
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [newBest, setNewBest] = useState(false);
  const { best, submit } = useBest(GAME.slug);
  const st = useRef({
    grid: emptyGrid(), cur: null as Piece | null, next: "T", bag: [] as string[], drop: 0, score: 0, lines: 0, level: 1,
    clearing: [] as number[], clearT: 0, popups: [] as { text: string; life: number }[], soft: false,
  });

  const fromBag = () => {
    const s = st.current;
    if (!s.bag.length) s.bag = [...KINDS].sort(() => Math.random() - 0.5);
    return s.bag.pop()!;
  };

  const fits = (cells: number[][], x: number, y: number) => {
    const g = st.current.grid;
    return cells.every(([cx, cy]) => {
      const gx = x + cx, gy = y + cy;
      return gx >= 0 && gx < COLS && gy < ROWS && (gy < 0 || !g[gy][gx]);
    });
  };

  const spawn = () => {
    const s = st.current;
    const kind = s.next;
    s.next = fromBag();
    const p: Piece = { kind, cells: PIECES[kind].cells.map((c) => [...c]), x: 3, y: -1 };
    if (!fits(p.cells, p.x, p.y + 1)) { gameOver(); return; }
    s.cur = p;
    drawPreview();
  };

  const gameOver = () => {
    st.current.cur = null;
    setPhase("over");
    sfx("over");
    const isNew = submit(st.current.score);
    setNewBest(isNew);
    if (isNew && st.current.score > 0) confetti(["#ea580c", "#eab308", "#38bdf8", "#4ade80", "#a78bfa"]);
    draw();
  };

  const lock = () => {
    const s = st.current;
    const p = s.cur!;
    for (const [cx, cy] of p.cells) {
      const gy = p.y + cy;
      if (gy < 0) { gameOver(); return; }
      s.grid[gy][p.x + cx] = p.kind;
    }
    sfx("drop");
    const full = s.grid.map((row, i) => (row.every(Boolean) ? i : -1)).filter((i) => i >= 0);
    if (full.length) {
      s.clearing = full;
      s.clearT = 0.35;
      const pts = [0, 100, 300, 500, 800][full.length] * s.level;
      s.score += pts;
      s.lines += full.length;
      const lvl = 1 + Math.floor(s.lines / 10);
      if (lvl > s.level) { s.level = lvl; setLevel(lvl); sfx("level"); s.popups.push({ text: `LEVEL ${lvl}`, life: 1.4 }); }
      else sfx(full.length >= 3 ? "combo" : "good");
      s.popups.push({ text: full.length === 4 ? "DESK CLEARED! +" + pts : `+${pts}`, life: 1.1 });
      setScore(s.score); setLines(s.lines);
      s.cur = null;
    } else spawn();
  };

  const move = useCallback((dx: number) => {
    const s = st.current;
    if (!s.cur || s.clearing.length) return;
    if (fits(s.cur.cells, s.cur.x + dx, s.cur.y)) { s.cur.x += dx; sfx("tick"); draw(); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const turn = useCallback(() => {
    const s = st.current;
    if (!s.cur || s.clearing.length || s.cur.kind === "O") return;
    const r = rotate(s.cur.cells);
    for (const kick of [0, -1, 1, -2, 2]) {
      if (fits(r, s.cur.x + kick, s.cur.y)) { s.cur.cells = r; s.cur.x += kick; sfx("pop"); draw(); return; }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hardDrop = useCallback(() => {
    const s = st.current;
    if (!s.cur || s.clearing.length) return;
    let d = 0;
    while (fits(s.cur.cells, s.cur.x, s.cur.y + 1)) { s.cur.y += 1; d++; }
    s.score += d * 2; setScore(s.score);
    lock();
    draw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const start = () => {
    const s = st.current;
    Object.assign(s, { grid: emptyGrid(), cur: null, bag: [], drop: 0, score: 0, lines: 0, level: 1, clearing: [], clearT: 0, popups: [], soft: false });
    s.next = fromBag();
    setScore(0); setLines(0); setLevel(1); setNewBest(false);
    setPhase("playing");
    sfx("level");
    spawn();
  };

  // keyboard
  useEffect(() => {
    if (phase !== "playing") return;
    const kd = (e: KeyboardEvent) => {
      const k = e.key;
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", " "].includes(k)) e.preventDefault();
      if (k === "ArrowLeft" || k === "a") move(-1);
      else if (k === "ArrowRight" || k === "d") move(1);
      else if (k === "ArrowUp" || k === "w" || k === "x") turn();
      else if (k === "ArrowDown" || k === "s") st.current.soft = true;
      else if (k === " ") hardDrop();
    };
    const ku = (e: KeyboardEvent) => { if (e.key === "ArrowDown" || e.key === "s") st.current.soft = false; };
    window.addEventListener("keydown", kd);
    window.addEventListener("keyup", ku);
    return () => { window.removeEventListener("keydown", kd); window.removeEventListener("keyup", ku); };
  }, [phase, move, turn, hardDrop]);

  useLoop(phase === "playing", (dt) => {
    const s = st.current;
    for (const p of s.popups) p.life -= dt;
    s.popups = s.popups.filter((p) => p.life > 0);
    if (s.clearing.length) {
      s.clearT -= dt;
      if (s.clearT <= 0) {
        s.grid = s.grid.filter((_, i) => !s.clearing.includes(i));
        while (s.grid.length < ROWS) s.grid.unshift(Array<string | null>(COLS).fill(null));
        s.clearing = [];
        spawn();
      }
      draw();
      return;
    }
    if (!s.cur) return;
    const interval = Math.max(0.06, 0.8 * Math.pow(0.85, s.level - 1));
    s.drop += dt * (s.soft ? 12 : 1);
    if (s.drop >= interval) {
      s.drop = 0;
      if (fits(s.cur.cells, s.cur.x, s.cur.y + 1)) { s.cur.y += 1; if (s.soft) { s.score += 1; setScore(s.score); } }
      else lock();
    }
    draw();
  });

  const draw = useCallback(() => {
    const c = board.current;
    if (!c) return;
    const r = c.getBoundingClientRect();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    if (c.width !== Math.round(r.width * dpr)) { c.width = Math.round(r.width * dpr); c.height = Math.round(r.height * dpr); }
    const g = c.getContext("2d")!;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    const size = r.width / COLS;
    const s = st.current;

    // desk surface
    const bg = g.createLinearGradient(0, 0, 0, r.height);
    bg.addColorStop(0, "#1c1917");
    bg.addColorStop(1, "#292524");
    g.fillStyle = bg;
    g.fillRect(0, 0, r.width, r.height);
    g.strokeStyle = "rgba(255,255,255,0.04)";
    for (let x = 0; x <= COLS; x++) { g.beginPath(); g.moveTo(x * size, 0); g.lineTo(x * size, r.height); g.stroke(); }
    for (let y = 0; y <= ROWS; y++) { g.beginPath(); g.moveTo(0, y * size); g.lineTo(r.width, y * size); g.stroke(); }

    s.grid.forEach((row, y) => row.forEach((k, x) => {
      if (!k) return;
      if (s.clearing.includes(y)) {
        g.fillStyle = `rgba(255,255,255,${0.5 + Math.sin(performance.now() / 40) * 0.5})`;
        g.fillRect(x * size, y * size, size, size);
      } else cell(g, x * size, y * size, size, k, 1);
    }));

    if (s.cur) {
      // ghost
      let gy = s.cur.y;
      while (fits(s.cur.cells, s.cur.x, gy + 1)) gy++;
      for (const [cx, cy] of s.cur.cells) if (gy + cy >= 0) cell(g, (s.cur.x + cx) * size, (gy + cy) * size, size, s.cur.kind, 0.18);
      for (const [cx, cy] of s.cur.cells) if (s.cur.y + cy >= 0) cell(g, (s.cur.x + cx) * size, (s.cur.y + cy) * size, size, s.cur.kind, 1);
    }

    g.textAlign = "center";
    for (const p of s.popups) {
      g.globalAlpha = Math.min(1, p.life * 1.5);
      g.fillStyle = p.text.startsWith("LEVEL") ? "#fde047" : "#fff";
      g.font = `bold ${Math.round(size * 0.9)}px system-ui`;
      g.shadowColor = "#000"; g.shadowBlur = 8;
      g.fillText(p.text, r.width / 2, r.height * 0.4 - (1.4 - p.life) * 30);
      g.shadowBlur = 0;
    }
    g.globalAlpha = 1;
  }, []);

  const drawPreview = () => {
    const c = preview.current;
    if (!c) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    c.width = 96 * dpr; c.height = 64 * dpr;
    const g = c.getContext("2d")!;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, 96, 64);
    const p = PIECES[st.current.next];
    const size = 20;
    const w = (Math.max(...p.cells.map((q) => q[0])) + 1) * size;
    const h = (Math.max(...p.cells.map((q) => q[1])) - Math.min(...p.cells.map((q) => q[1])) + 1) * size;
    const minY = Math.min(...p.cells.map((q) => q[1]));
    for (const [x, y] of p.cells) cell(g, (96 - w) / 2 + x * size, (64 - h) / 2 + (y - minY) * size, size, st.current.next, 1);
  };

  useEffect(() => {
    draw();
    const onResize = () => draw();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [draw]);

  const btn = "grid h-14 flex-1 place-items-center rounded-2xl bg-white/10 text-white active:scale-95 active:bg-white/25 transition";

  return (
    <GameFrame
      game={GAME}
      phase={phase}
      score={score}
      best={best}
      onStart={start}
      newBest={newBest}
      aspect="h-auto"
      summary={<>{lines} rows cleared · level {level}</>}
      hud={<><Chip label="Lines" value={lines} /><Chip label="Lvl" value={level} /></>}
    >
      <div className="flex flex-col items-center gap-4 bg-[radial-gradient(circle_at_50%_0%,#7c2d12_0%,#0b0d17_70%)] px-3 py-5 sm:flex-row sm:items-start sm:justify-center sm:gap-6 sm:py-7">
        <div className="relative rounded-2xl p-1.5 shadow-[0_0_0_2px_rgba(251,146,60,0.4),0_20px_50px_rgba(0,0,0,0.6)]" style={{ background: "linear-gradient(135deg,#ea580c,#eab308)" }}>
          <canvas ref={board} className="block aspect-[1/2] w-[min(78vw,300px)] rounded-xl sm:w-[300px]" aria-label="Desk Tetris board" />
        </div>
        <div className="flex w-[min(78vw,300px)] flex-row items-start gap-3 sm:w-40 sm:flex-col">
          <div className="rounded-2xl bg-white/10 p-3 text-center text-white">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-white/55">Next</p>
            <canvas ref={preview} className="mx-auto h-16 w-24" />
          </div>
          <div className="hidden rounded-2xl bg-white/5 p-3 text-[12px] leading-relaxed text-white/55 sm:block">
            <p className="mb-1 font-semibold text-white/80">Keys</p>
            ← → move<br />↑ rotate<br />↓ faster<br />Space drop
          </div>
        </div>
        {/* touch controls */}
        <div className="flex w-[min(78vw,300px)] gap-2 sm:hidden">
          <button type="button" className={btn} onClick={() => move(-1)} aria-label="Move left"><ArrowLeft /></button>
          <button type="button" className={btn} onClick={turn} aria-label="Rotate"><RotateCw /></button>
          <button type="button" className={btn} onClick={() => move(1)} aria-label="Move right"><ArrowRight /></button>
          <button type="button" className={btn} onPointerDown={() => (st.current.soft = true)} onPointerUp={() => (st.current.soft = false)} onPointerLeave={() => (st.current.soft = false)} aria-label="Drop faster"><ArrowDown /></button>
          <button type="button" className={btn} onClick={hardDrop} aria-label="Drop"><ChevronsDown /></button>
        </div>
      </div>
    </GameFrame>
  );
}

function cell(g: CanvasRenderingContext2D, x: number, y: number, size: number, kind: string, alpha: number) {
  const p = PIECES[kind];
  const pad = 1.5;
  g.globalAlpha = alpha;
  const grad = g.createLinearGradient(x, y, x, y + size);
  grad.addColorStop(0, p.color);
  grad.addColorStop(1, p.dark);
  g.fillStyle = grad;
  const r = size * 0.2;
  g.beginPath();
  g.roundRect(x + pad, y + pad, size - pad * 2, size - pad * 2, r);
  g.fill();
  if (alpha === 1) {
    g.fillStyle = "rgba(255,255,255,0.35)";
    g.beginPath();
    g.roundRect(x + pad + 2, y + pad + 2, size - pad * 2 - 4, size * 0.25, r * 0.6);
    g.fill();
    g.font = `${Math.round(size * 0.5)}px system-ui, 'Apple Color Emoji', 'Segoe UI Emoji'`;
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.globalAlpha = 0.85;
    g.fillText(p.e, x + size / 2, y + size / 2 + 1);
  }
  g.globalAlpha = 1;
}
