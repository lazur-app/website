"use client";
/* eslint-disable react-hooks/immutability -- canvas game: per-frame state in refs is mutated on purpose; the component opts out of the compiler ("use no memo"). */

import { useCallback, useEffect, useRef, useState } from "react";
import { gameBySlug } from "@/lib/games";
import { Chip, GameFrame, Hearts, confetti, sfx, useBest, useLoop, type Phase } from "./kit";

const GAME = gameBySlug("notch-catcher")!;

type Kind = "good" | "bad" | "sparkle" | "heart";
type Item = { x: number; y: number; vy: number; rot: number; vr: number; e: string; kind: Kind; pts: number; r: number };
type Particle = { x: number; y: number; vx: number; vy: number; life: number; c: string; s: number };
type Floater = { x: number; y: number; text: string; life: number; c: string };

const GOOD: Array<[string, number]> = [["☕", 10], ["📧", 10], ["💡", 15], ["🎵", 10], ["⭐", 25], ["🍩", 15]];
const BAD = ["🐛", "🔥", "💣"];

export function NotchCatcher() {
  "use no memo"; // imperative canvas game: mutable state lives in refs and is drawn every frame
  const canvas = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<Phase>("ready");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [combo, setCombo] = useState(0);
  const [newBest, setNewBest] = useState(false);
  const [caught, setCaught] = useState(0);
  const { best, submit } = useBest(GAME.slug);

  // Mutable game state lives in a ref so the loop doesn't re-render 60 times a second.
  const s = useRef({
    w: 800, h: 500, px: 400, target: 400, items: [] as Item[], parts: [] as Particle[], floats: [] as Floater[],
    spawn: 0, t: 0, score: 0, lives: 3, combo: 0, level: 1, caught: 0, magnet: 0, shake: 0, keys: { l: false, r: false }, flash: 0,
  });

  const resize = useCallback(() => {
    const c = canvas.current;
    if (!c) return;
    const r = c.getBoundingClientRect();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    c.width = r.width * dpr;
    c.height = r.height * dpr;
    c.getContext("2d")!.setTransform(dpr, 0, 0, dpr, 0, 0);
    const st = s.current;
    st.w = r.width;
    st.h = r.height;
    st.px = Math.min(st.px, r.width);
    st.target = st.px;
  }, []);

  useEffect(() => {
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [resize]);

  const start = () => {
    const st = s.current;
    Object.assign(st, { items: [], parts: [], floats: [], spawn: 0, t: 0, score: 0, lives: 3, combo: 0, level: 1, caught: 0, magnet: 0, shake: 0, flash: 0, px: st.w / 2, target: st.w / 2 });
    setScore(0); setLives(3); setLevel(1); setCombo(0); setCaught(0); setNewBest(false);
    setPhase("playing");
    sfx("level");
  };

  const end = () => {
    setPhase("over");
    sfx("over");
    const isNew = submit(s.current.score);
    setNewBest(isNew);
    if (isNew && s.current.score > 0) confetti();
  };

  // Input
  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const move = (clientX: number) => {
      const r = c.getBoundingClientRect();
      s.current.target = Math.max(0, Math.min(r.width, clientX - r.left));
    };
    const pm = (e: PointerEvent) => move(e.clientX);
    const tm = (e: TouchEvent) => { if (e.touches[0]) { move(e.touches[0].clientX); e.preventDefault(); } };
    c.addEventListener("pointermove", pm);
    c.addEventListener("pointerdown", pm);
    c.addEventListener("touchmove", tm, { passive: false });
    const kd = (e: KeyboardEvent) => {
      if (phase !== "playing") return;
      if (e.key === "ArrowLeft" || e.key === "a") { s.current.keys.l = true; e.preventDefault(); }
      if (e.key === "ArrowRight" || e.key === "d") { s.current.keys.r = true; e.preventDefault(); }
    };
    const ku = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a") s.current.keys.l = false;
      if (e.key === "ArrowRight" || e.key === "d") s.current.keys.r = false;
    };
    window.addEventListener("keydown", kd);
    window.addEventListener("keyup", ku);
    return () => {
      c.removeEventListener("pointermove", pm);
      c.removeEventListener("pointerdown", pm);
      c.removeEventListener("touchmove", tm);
      window.removeEventListener("keydown", kd);
      window.removeEventListener("keyup", ku);
    };
  }, [phase]);

  const burst = (x: number, y: number, c: string, n = 14) => {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const v = 2 + Math.random() * 5;
      s.current.parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 2, life: 1, c, s: 2 + Math.random() * 4 });
    }
  };

  const draw = useCallback(() => {
    const c = canvas.current;
    if (!c) return;
    const g = c.getContext("2d")!;
    const st = s.current;
    const { w, h } = st;
    g.save();
    if (st.shake > 0) g.translate((Math.random() - 0.5) * 10 * st.shake * 3, (Math.random() - 0.5) * 10 * st.shake * 3);

    // background: night gradient + stars + grid floor
    const bg = g.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, "#0b0d17");
    bg.addColorStop(1, "#1e1b4b");
    g.fillStyle = bg;
    g.fillRect(-20, -20, w + 40, h + 40);
    for (let i = 0; i < 60; i++) {
      const x = (i * 137.5 + st.t * (6 + (i % 5) * 4)) % w;
      const y = (i * 71.3) % (h * 0.8);
      g.globalAlpha = 0.25 + ((i * 13) % 10) / 20;
      g.fillStyle = "#fff";
      g.fillRect(x, y, 1.6, 1.6);
    }
    g.globalAlpha = 1;
    g.strokeStyle = "rgba(124,58,237,0.25)";
    g.lineWidth = 1;
    for (let i = 0; i < 14; i++) {
      const y = h - 70 + i * i * 1.6;
      if (y > h) break;
      g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke();
    }

    // items
    g.textAlign = "center";
    g.textBaseline = "middle";
    for (const it of st.items) {
      g.save();
      g.translate(it.x, it.y);
      g.rotate(it.rot);
      if (it.kind === "sparkle") {
        g.shadowColor = "#3b82f6"; g.shadowBlur = 24;
        g.fillStyle = "#60a5fa";
        sparkle(g, 0, 0, 18);
      } else {
        if (it.kind === "bad") { g.shadowColor = "#ef4444"; g.shadowBlur = 16; }
        else { g.shadowColor = "rgba(253,230,138,0.6)"; g.shadowBlur = 12; }
        g.font = "34px system-ui, 'Apple Color Emoji', 'Segoe UI Emoji'";
        g.fillText(it.e, 0, 2);
      }
      g.restore();
    }

    // the notch paddle
    const notchW = Math.max(90, Math.min(150, w * 0.17));
    const notchY = h - 34;
    const glow = st.magnet > 0 ? "#3b82f6" : st.combo >= 5 ? "#60a5fa" : "rgba(255,255,255,0.15)";
    g.save();
    g.shadowColor = glow;
    g.shadowBlur = st.combo >= 5 || st.magnet > 0 ? 30 : 10;
    g.fillStyle = "#000";
    roundRect(g, st.px - notchW / 2, notchY - 14, notchW, 30, 15);
    g.fill();
    g.restore();
    g.strokeStyle = glow;
    g.lineWidth = 2;
    roundRect(g, st.px - notchW / 2, notchY - 14, notchW, 30, 15);
    g.stroke();
    // camera dot + tiny blue sparkle
    g.fillStyle = "#1f2937";
    g.beginPath(); g.arc(st.px + notchW / 2 - 18, notchY + 1, 4, 0, Math.PI * 2); g.fill();
    g.fillStyle = "#3b82f6";
    sparkle(g, st.px - notchW / 2 + 18, notchY + 1, 6);
    if (st.magnet > 0) {
      g.strokeStyle = `rgba(96,165,250,${0.3 + Math.sin(st.t * 10) * 0.2})`;
      g.lineWidth = 3;
      g.beginPath(); g.arc(st.px, notchY, notchW * 0.75 + Math.sin(st.t * 6) * 6, Math.PI, 0); g.stroke();
    }

    for (const p of st.parts) { g.globalAlpha = Math.max(0, p.life); g.fillStyle = p.c; g.fillRect(p.x, p.y, p.s, p.s); }
    g.globalAlpha = 1;
    for (const f of st.floats) {
      g.globalAlpha = Math.min(1, f.life * 1.5);
      g.fillStyle = f.c;
      g.font = f.text.startsWith("LEVEL") ? "bold 44px var(--font-clash), system-ui" : "bold 20px system-ui";
      g.fillText(f.text, f.x, f.y);
    }
    g.globalAlpha = 1;
    if (st.flash > 0) { g.fillStyle = `rgba(239,68,68,${st.flash})`; g.fillRect(0, 0, w, h); }
    g.restore();
  }, []);

  useLoop(phase === "playing", (dt) => {
    const st = s.current;
    const { w, h } = st;
    st.t += dt;
    const notchW = Math.max(90, Math.min(150, w * 0.17));
    const notchY = h - 34;

    // move paddle
    if (st.keys.l) st.target -= 700 * dt;
    if (st.keys.r) st.target += 700 * dt;
    st.target = Math.max(notchW / 2, Math.min(w - notchW / 2, st.target));
    st.px += (st.target - st.px) * Math.min(1, dt * 16);

    // spawn
    const speed = 1 + (st.level - 1) * 0.18;
    st.spawn -= dt;
    if (st.spawn <= 0) {
      st.spawn = Math.max(0.28, 0.95 - st.level * 0.07) * (0.7 + Math.random() * 0.6);
      const roll = Math.random();
      let item: Pick<Item, "e" | "kind" | "pts">;
      if (roll < Math.min(0.38, 0.18 + st.level * 0.03)) item = { e: BAD[Math.floor(Math.random() * BAD.length)], kind: "bad", pts: 0 };
      else if (roll > 0.975) item = { e: "✦", kind: "sparkle", pts: 0 };
      else if (roll > 0.962 && st.lives < 3) item = { e: "❤️", kind: "heart", pts: 0 };
      else { const [e, pts] = GOOD[Math.floor(Math.random() * GOOD.length)]; item = { e, kind: "good", pts }; }
      st.items.push({ ...item, x: 24 + Math.random() * (w - 48), y: -30, vy: (120 + Math.random() * 90) * speed, rot: 0, vr: (Math.random() - 0.5) * 3, r: 20 });
    }

    // update items
    if (st.magnet > 0) st.magnet -= dt;
    const pull = st.magnet > 0 ? Math.min(1, dt * 4) : 0;
    st.items = st.items.map((it) => ({
      ...it,
      y: it.y + it.vy * dt,
      rot: it.rot + it.vr * dt,
      x: pull && it.kind !== "bad" ? it.x + (st.px - it.x) * pull : it.x,
    }));
    const keep: Item[] = [];
    for (const it of st.items) {
      const hit = it.y > notchY - 22 && it.y < notchY + 14 && Math.abs(it.x - st.px) < notchW / 2 + 12;
      if (hit) {
        if (it.kind === "bad") {
          st.lives -= 1; st.combo = 0; st.shake = 0.35; st.flash = 0.25;
          setLives(st.lives); setCombo(0);
          burst(it.x, notchY, "#ef4444", 22);
          st.floats.push({ x: it.x, y: notchY - 30, text: "OUCH", life: 1, c: "#f87171" });
          sfx("bad");
          if (st.lives <= 0) { end(); return; }
        } else if (it.kind === "sparkle") {
          st.magnet = 6;
          burst(it.x, notchY, "#60a5fa", 30);
          st.floats.push({ x: it.x, y: notchY - 30, text: "MAGNET!", life: 1.3, c: "#93c5fd" });
          sfx("combo");
        } else if (it.kind === "heart") {
          st.lives = Math.min(3, st.lives + 1); setLives(st.lives);
          burst(it.x, notchY, "#f472b6", 18);
          sfx("level");
        } else {
          st.combo += 1;
          const mult = 1 + Math.floor(st.combo / 5);
          const pts = it.pts * mult;
          st.score += pts; st.caught += 1;
          setScore(st.score); setCombo(st.combo); setCaught(st.caught);
          burst(it.x, notchY - 6, st.combo >= 5 ? "#60a5fa" : "#fde68a");
          st.floats.push({ x: it.x, y: notchY - 30, text: `+${pts}${mult > 1 ? ` ×${mult}` : ""}`, life: 1, c: mult > 1 ? "#93c5fd" : "#fde68a" });
          sfx(st.combo % 5 === 0 ? "combo" : "good");
          if (st.caught % 15 === 0) {
            st.level += 1; setLevel(st.level);
            st.floats.push({ x: w / 2, y: h / 2, text: `LEVEL ${st.level}`, life: 1.6, c: "#fff" });
            sfx("level");
          }
        }
        continue;
      }
      if (it.y > h + 40) {
        if (it.kind === "good") { st.combo = 0; setCombo(0); }
        continue;
      }
      keep.push(it);
    }
    st.items = keep;

    for (const p of st.parts) { p.x += p.vx; p.y += p.vy; p.vy += 0.25; p.life -= dt * 1.6; }
    st.parts = st.parts.filter((p) => p.life > 0);
    for (const f of st.floats) { f.y -= 40 * dt; f.life -= dt; }
    st.floats = st.floats.filter((f) => f.life > 0);
    if (st.shake > 0) st.shake -= dt;
    if (st.flash > 0) st.flash -= dt;

    draw();
  });


  // draw an idle frame behind the start screen
  useEffect(() => {
    if (phase !== "playing") draw();
  }, [phase, draw]);

  return (
    <GameFrame
      game={GAME}
      phase={phase}
      score={score}
      best={best}
      onStart={start}
      newBest={newBest}
      summary={<>Caught {caught} things · reached level {level}</>}
      hud={
        <>
          <Hearts lives={lives} />
          <Chip label="Lvl" value={level} />
          {combo >= 5 ? <Chip label="Combo" value={`×${1 + Math.floor(combo / 5)}`} accent="#3b82f6" /> : null}
        </>
      }
    >
      <canvas ref={canvas} className="absolute inset-0 h-full w-full touch-none cursor-none" aria-label="Notch Catcher game area" />
    </GameFrame>
  );
}

function roundRect(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}

/** Lazur's four-point sparkle. */
function sparkle(g: CanvasRenderingContext2D, x: number, y: number, r: number) {
  g.beginPath();
  g.moveTo(x, y - r);
  g.quadraticCurveTo(x + r * 0.15, y - r * 0.15, x + r, y);
  g.quadraticCurveTo(x + r * 0.15, y + r * 0.15, x, y + r);
  g.quadraticCurveTo(x - r * 0.15, y + r * 0.15, x - r, y);
  g.quadraticCurveTo(x - r * 0.15, y - r * 0.15, x, y - r);
  g.fill();
}
