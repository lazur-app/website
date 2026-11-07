"use client";

/**
 * Shared game kit: sound effects, best score, confetti and the frame every game sits in
 * (start screen, HUD, game over). Nothing here leaves the browser.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Volume2, VolumeX, RotateCcw, Play, Trophy } from "lucide-react";
import type { GameInfo } from "@/lib/games";

/* ---------- clock & ids (kept out of components so the compiler treats them as event-time) ---------- */

export const now = () => performance.now();
let idSeq = 0;
export const nextId = () => ++idSeq;

/* ---------- sound ---------- */

let ctx: AudioContext | null = null;
let soundOn = true;
try {
  soundOn = typeof window !== "undefined" ? window.localStorage.getItem("lz-games-sound") !== "off" : true;
} catch {}

type Tone = "good" | "bad" | "combo" | "level" | "tick" | "over" | "pop" | "drop";
const TONES: Record<Tone, Array<[number, number, OscillatorType]>> = {
  good: [[660, 0.07, "triangle"], [990, 0.09, "triangle"]],
  pop: [[880, 0.05, "sine"]],
  combo: [[523, 0.06, "square"], [659, 0.06, "square"], [784, 0.06, "square"], [1046, 0.12, "square"]],
  bad: [[220, 0.12, "sawtooth"], [150, 0.18, "sawtooth"]],
  level: [[392, 0.08, "triangle"], [523, 0.08, "triangle"], [659, 0.08, "triangle"], [784, 0.2, "triangle"]],
  tick: [[1200, 0.03, "square"]],
  drop: [[180, 0.06, "triangle"]],
  over: [[392, 0.15, "sawtooth"], [311, 0.15, "sawtooth"], [262, 0.35, "sawtooth"]],
};

export function sfx(tone: Tone) {
  if (!soundOn || typeof window === "undefined") return;
  try {
    ctx ??= new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    let t = ctx.currentTime;
    for (const [freq, dur, type] of TONES[tone]) {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = type;
      o.frequency.value = freq;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.08, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g).connect(ctx.destination);
      o.start(t);
      o.stop(t + dur + 0.02);
      t += dur * 0.85;
    }
  } catch {}
}

function SoundToggle() {
  const [on, setOn] = useState(() => soundOn);
  return (
    <button
      type="button"
      onClick={() => {
        soundOn = !soundOn;
        setOn(soundOn);
        try {
          window.localStorage.setItem("lz-games-sound", soundOn ? "on" : "off");
        } catch {}
        if (soundOn) sfx("pop");
      }}
      className="grid h-9 w-9 place-items-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
      aria-label={on ? "Mute sounds" : "Turn sounds on"}
    >
      {on ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
    </button>
  );
}

/* ---------- best score ---------- */

export function useBest(slug: string) {
  // Games render client-side only (ssr: false), so localStorage is safe to read here.
  const [best, setBest] = useState(() => {
    try {
      return Number(window.localStorage.getItem(`lz-best-${slug}`) || 0);
    } catch {
      return 0;
    }
  });
  const submit = useCallback(
    (score: number) => {
      let isNew = false;
      setBest((b) => {
        if (score > b) {
          isNew = true;
          try {
            window.localStorage.setItem(`lz-best-${slug}`, String(score));
          } catch {}
          return score;
        }
        return b;
      });
      return isNew;
    },
    [slug],
  );
  return { best, submit };
}

/* ---------- confetti ---------- */

export function confetti(colors = ["#2563eb", "#f97316", "#22c55e", "#e11d48", "#eab308", "#9333ea"]) {
  if (typeof document === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const c = document.createElement("canvas");
  c.style.cssText = "position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:9999";
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  c.width = innerWidth * dpr;
  c.height = innerHeight * dpr;
  document.body.appendChild(c);
  const g = c.getContext("2d")!;
  g.scale(dpr, dpr);
  const parts = Array.from({ length: 140 }, () => ({
    x: innerWidth / 2 + (Math.random() - 0.5) * 200,
    y: innerHeight * 0.45,
    vx: (Math.random() - 0.5) * 16,
    vy: -Math.random() * 16 - 6,
    r: Math.random() * Math.PI,
    vr: (Math.random() - 0.5) * 0.4,
    w: 6 + Math.random() * 6,
    h: 8 + Math.random() * 8,
    c: colors[Math.floor(Math.random() * colors.length)],
  }));
  const start = performance.now();
  const tick = (now: number) => {
    g.clearRect(0, 0, innerWidth, innerHeight);
    for (const p of parts) {
      p.vy += 0.45;
      p.vx *= 0.99;
      p.x += p.vx;
      p.y += p.vy;
      p.r += p.vr;
      g.save();
      g.translate(p.x, p.y);
      g.rotate(p.r);
      g.fillStyle = p.c;
      g.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      g.restore();
    }
    if (now - start < 2600) requestAnimationFrame(tick);
    else c.remove();
  };
  requestAnimationFrame(tick);
}

/* ---------- frame ---------- */

export type Phase = "ready" | "playing" | "over";

type FrameProps = {
  game: GameInfo;
  phase: Phase;
  score: number;
  best: number;
  /** Extra HUD chips: lives, level, streak... */
  hud?: React.ReactNode;
  onStart: () => void;
  /** Game-over summary line(s). */
  summary?: React.ReactNode;
  newBest?: boolean;
  /** Aspect of the stage; games with their own layout pass "auto". */
  aspect?: string;
  children: React.ReactNode;
};

/** The arcade cabinet: a coloured stage with a HUD, plus start and game-over screens laid over it. */
export function GameFrame({ game, phase, score, best, hud, onStart, summary, newBest, aspect = "aspect-[4/5] sm:aspect-[16/10]", children }: FrameProps) {
  const startBtn = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (phase !== "playing") startBtn.current?.focus({ preventScroll: true });
  }, [phase]);

  const share = async () => {
    const text = `I scored ${score} in ${game.name} on lazur.app/games/${game.slug} 🎮 Beat that.`;
    try {
      if (navigator.share) await navigator.share({ text, url: `https://www.lazur.app/games/${game.slug}` });
      else await navigator.clipboard.writeText(text);
    } catch {}
  };

  return (
    <div
      className="relative overflow-hidden rounded-[28px] p-[3px] shadow-[0_30px_80px_-20px_rgba(28,25,23,0.45)]"
      style={{ background: `linear-gradient(135deg, ${game.color}, ${game.color2})` }}
    >
      <div className="relative overflow-hidden rounded-[25px] bg-[#0b0d17]">
        {/* HUD */}
        <div className="relative z-20 flex flex-wrap items-center gap-2 border-b border-white/10 bg-black/30 px-3 py-2.5 text-white sm:px-4">
          <Chip label="Score" value={score} accent={game.color} big />
          <Chip label="Best" value={Math.max(best, phase === "over" ? score : 0)} icon={<Trophy className="h-3.5 w-3.5" />} />
          {hud}
          <div className="ml-auto">
            <SoundToggle />
          </div>
        </div>

        <div className={`relative ${aspect}`}>
          {children}

          {phase !== "playing" ? (
            <div className="absolute inset-0 z-30 grid place-items-center bg-[#0b0d17]/80 p-6 text-center text-white backdrop-blur-sm">
              <div className="games-pop max-w-sm">
                <div className="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-3xl text-4xl shadow-lg" style={{ background: `linear-gradient(135deg, ${game.color}, ${game.color2})` }}>
                  {phase === "over" ? (newBest ? "🏆" : "💥") : game.emoji}
                </div>
                {phase === "over" ? (
                  <>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/60">{newBest ? "New best!" : "Game over"}</p>
                    <p className="font-display text-6xl font-semibold tracking-tight">{score}</p>
                    {summary ? <div className="mt-2 text-[15px] text-white/75">{summary}</div> : null}
                  </>
                ) : (
                  <>
                    <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">{game.name}</h2>
                    <p className="mt-2 text-white/70">{game.tagline}</p>
                  </>
                )}
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <button
                    ref={startBtn}
                    type="button"
                    onClick={onStart}
                    className="games-glow inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-[16px] font-bold text-white shadow-lg transition hover:scale-[1.04] active:scale-95"
                    style={{ background: `linear-gradient(135deg, ${game.color}, ${game.color2})` }}
                  >
                    {phase === "over" ? <RotateCcw className="h-5 w-5" /> : <Play className="h-5 w-5 fill-current" />}
                    {phase === "over" ? "Play again" : "Play"}
                  </button>
                  {phase === "over" ? (
                    <button type="button" onClick={share} className="rounded-full bg-white/15 px-5 py-3.5 text-[15px] font-semibold text-white transition hover:bg-white/25">
                      Share score
                    </button>
                  ) : null}
                </div>
                {phase === "over" ? (
                  <Link href="/games" className="mt-5 inline-block text-sm text-white/55 underline-offset-4 hover:text-white hover:underline">
                    More games
                  </Link>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function Chip({ label, value, icon, accent, big }: { label: string; value: React.ReactNode; icon?: React.ReactNode; accent?: string; big?: boolean }) {
  return (
    <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5">
      {icon}
      <span className="text-[11px] font-semibold uppercase tracking-wider text-white/55">{label}</span>
      <span className={`font-display font-semibold tabular-nums ${big ? "text-lg" : "text-[15px]"}`} style={accent ? { color: "#fff", textShadow: `0 0 12px ${accent}` } : undefined}>
        {value}
      </span>
    </div>
  );
}

export function Hearts({ lives, max = 3 }: { lives: number; max?: number }) {
  return (
    <div className="flex items-center gap-0.5 rounded-full bg-white/10 px-2.5 py-1.5 text-[15px]" aria-label={`${lives} lives left`}>
      {Array.from({ length: max }, (_, i) => (
        <span key={i} className={i < lives ? "" : "opacity-25 grayscale"}>
          ❤️
        </span>
      ))}
    </div>
  );
}

/** requestAnimationFrame loop that runs while `active`, passing seconds since last frame (capped). */
export function useLoop(active: boolean, step: (dt: number) => void) {
  const cb = useRef(step);
  useEffect(() => {
    cb.current = step;
  });
  useEffect(() => {
    if (!active) return;
    let last = performance.now();
    let id = requestAnimationFrame(function frame(now) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      cb.current(dt);
      id = requestAnimationFrame(frame);
    });
    return () => cancelAnimationFrame(id);
  }, [active]);
}
