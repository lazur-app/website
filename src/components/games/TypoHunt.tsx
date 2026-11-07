"use client";

import { useEffect, useRef, useState } from "react";
import { gameBySlug } from "@/lib/games";
import { Chip, GameFrame, confetti, nextId, now, sfx, useBest, type Phase } from "./kit";

const GAME = gameBySlug("typo-hunt")!;

/** Clean paragraphs; typos are injected at random each round. */
const PAGES = [
  "Every morning the office smells like fresh coffee and printer toner. Someone always forgets their badge, someone always brings donuts, and the meeting that could have been an email starts exactly four minutes late. By lunch the whiteboard is covered in arrows that nobody can explain anymore.",
  "The best travel advice is simple. Pack half the clothes and twice the snacks you think you need. Charge everything the night before, download your maps, and always keep a pen in your pocket because every airport form wants one at the worst possible moment.",
  "Our team finally finished the new website after three long weeks. The homepage loads faster, the buttons are bigger, and the pricing page no longer hides the free plan. Tomorrow we celebrate with pizza, then we start fixing everything the launch broke.",
  "A good cup of tea needs patience. Boil the water, let it cool for a moment, and steep the leaves for three minutes. Add milk only after the tea is done, and never squeeze the bag unless you enjoy bitter surprises and disappointed grandparents.",
  "The library downtown opens at nine and closes at eight. Upstairs there is a quiet room with large windows, comfortable chairs and surprisingly strong wifi. Students arrive early to claim the corner tables, and the librarian pretends not to notice the sandwiches.",
  "My neighbor started growing tomatoes on her balcony last spring. Now she has basil, peppers, strawberries and a lemon tree that refuses to produce a single lemon. Every evening she waters them while explaining her plans to a very uninterested cat.",
  "Writing a clear email is a small superpower. Put the question in the first line, keep each paragraph short, and end with exactly what you need and by when. Your future self will thank you when the reply arrives before lunch.",
  "The weekend market sells everything from honey to handmade guitars. There is a man who juggles oranges, a bakery that runs out of croissants by ten, and a flower stall where the owner remembers the name of every regular customer.",
];

/** Make a believable typo out of a word (≥ 4 letters). */
function typo(w: string): string {
  const m = w.match(/^([A-Za-z]+)(.*)$/);
  if (!m) return w;
  const [, core, tail] = m;
  const i = 1 + Math.floor(Math.random() * (core.length - 2));
  const kind = Math.floor(Math.random() * 4);
  let out = core;
  if (kind === 0) out = core.slice(0, i) + core[i + 1] + core[i] + core.slice(i + 2); // swap
  else if (kind === 1) out = core.slice(0, i) + core.slice(i + 1); // drop
  else if (kind === 2) out = core.slice(0, i) + core[i] + core.slice(i); // double
  else {
    const near: Record<string, string> = { a: "s", e: "r", i: "o", o: "i", u: "y", s: "a", t: "r", n: "m", r: "t", l: "k", c: "v", d: "f", m: "n", p: "o", h: "j", g: "h" };
    const ch = core[i].toLowerCase();
    out = core.slice(0, i) + (near[ch] ?? "e") + core.slice(i + 1);
  }
  return out === core ? core.slice(0, i) + core.slice(i + 1) + tail : out + tail;
}

type Word = { text: string; original: string; isTypo: boolean; found: boolean; missed: boolean; wrongFlash: number };

function buildPage(seed: number): Word[] {
  const words = PAGES[seed % PAGES.length].split(" ");
  const candidates = words.map((w, i) => ({ w, i })).filter(({ w }) => /^[A-Za-z]{4,}/.test(w));
  const chosen = new Set<number>();
  while (chosen.size < 5 && chosen.size < candidates.length) chosen.add(candidates[Math.floor(Math.random() * candidates.length)].i);
  return words.map((w, i) => {
    const isTypo = chosen.has(i);
    return { text: isTypo ? typo(w) : w, original: w, isTypo, found: false, missed: false, wrongFlash: 0 };
  });
}

export function TypoHunt() {
  const [phase, setPhase] = useState<Phase>("ready");
  const [words, setWords] = useState<Word[]>([]);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(40);
  const [page, setPage] = useState(1);
  const [found, setFound] = useState(0);
  const [penalty, setPenalty] = useState<{ id: number; text: string; good: boolean } | null>(null);
  const [newBest, setNewBest] = useState(false);
  const [clearing, setClearing] = useState(false);
  const { best, submit } = useBest(GAME.slug);
  const st = useRef({ score: 0, time: 40, page: 1, found: 0, order: [] as number[] });
  const timer = useRef<number | null>(null);

  const clear = () => { if (timer.current) window.clearInterval(timer.current); timer.current = null; };
  useEffect(() => clear, []);

  const runClock = () => {
    clear();
    let last = now();
    timer.current = window.setInterval(() => {
      const t = now();
      st.current.time -= (t - last) / 1000;
      last = t;
      if (st.current.time <= 0) {
        st.current.time = 0;
        setTime(0);
        clear();
        setWords((ws) => ws.map((w) => (w.isTypo && !w.found ? { ...w, missed: true } : w)));
        setPhase("over");
        sfx("over");
        const isNew = submit(st.current.score);
        setNewBest(isNew);
        if (isNew && st.current.score > 0) confetti(["#9333ea", "#ec4899", "#f0abfc", "#fff"]);
        return;
      }
      setTime(st.current.time);
    }, 100);
  };

  const newPage = (n: number) => {
    if (!st.current.order.length) st.current.order = Array.from(PAGES.keys()).sort(() => Math.random() - 0.5);
    setWords(buildPage(st.current.order.pop()!));
    setPage(n);
    setClearing(false);
  };

  const start = () => {
    st.current = { score: 0, time: 40, page: 1, found: 0, order: [] };
    setScore(0); setTime(40); setFound(0); setNewBest(false);
    newPage(1);
    setPhase("playing");
    sfx("level");
    runClock();
  };

  const tap = (i: number) => {
    if (phase !== "playing" || clearing) return;
    const w = words[i];
    if (w.found) return;
    const s = st.current;
    if (w.isTypo) {
      const pts = 50 + Math.round(s.time) * 2 + (s.page - 1) * 20;
      s.score += pts; s.found += 1; s.time += 4;
      setScore(s.score); setFound(s.found); setTime(s.time);
      setPenalty({ id: nextId(), text: `+${pts} · +4s`, good: true });
      const next = words.map((x, j) => (j === i ? { ...x, found: true } : x));
      setWords(next);
      sfx("good");
      if (next.filter((x) => x.isTypo && !x.found).length === 0) {
        setClearing(true);
        sfx("level");
        s.score += 200; setScore(s.score);
        setPenalty({ id: nextId(), text: "PAGE CLEAR +200", good: true });
        window.setTimeout(() => { s.page += 1; newPage(s.page); }, 1200);
      }
    } else {
      s.time = Math.max(0, s.time - 3);
      setTime(s.time);
      setPenalty({ id: nextId(), text: "−3s", good: false });
      const flash = nextId();
      setWords(words.map((x, j) => (j === i ? { ...x, wrongFlash: flash } : x)));
      window.setTimeout(() => setWords((ws) => ws.map((x) => (x.wrongFlash === flash ? { ...x, wrongFlash: 0 } : x))), 600);
      sfx("bad");
    }
  };

  const remaining = words.filter((w) => w.isTypo && !w.found).length;

  return (
    <GameFrame
      game={GAME}
      phase={phase}
      score={score}
      best={best}
      onStart={start}
      newBest={newBest}
      aspect="min-h-[600px]"
      summary={<>Found {found} typos across {page} page{page > 1 ? "s" : ""}</>}
      hud={<><Chip label="Page" value={page} /><Chip label="Left" value={`${remaining}/5`} /><Chip label="Time" value={`${Math.ceil(time)}s`} accent={time < 10 ? "#ef4444" : undefined} /></>}
    >
      <div className="absolute inset-0 overflow-auto bg-[radial-gradient(circle_at_50%_0%,#3b0764_0%,#0b0d17_65%)] p-4 sm:p-8">
        {/* time bar */}
        <div className="mx-auto mb-5 h-2.5 max-w-3xl overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full transition-[width] duration-100" style={{ width: `${Math.min(100, (time / 40) * 100)}%`, background: time < 10 ? "#ef4444" : "linear-gradient(90deg,#a855f7,#ec4899)" }} />
        </div>

        {/* the page */}
        <div key={page} className={`games-pop relative mx-auto max-w-3xl rounded-[22px] bg-[#fffdf7] p-6 text-[#292524] shadow-[0_20px_60px_-10px_rgba(0,0,0,0.6)] sm:p-10 ${clearing ? "games-clear" : ""}`}>
          <div className="pointer-events-none absolute inset-x-0 top-0 h-full rounded-[22px] bg-[repeating-linear-gradient(transparent,transparent_35px,rgba(147,51,234,0.08)_36px)]" aria-hidden />
          <p className="relative text-[clamp(1.05rem,2.2vw,1.35rem)] leading-[2.2rem]">
            {words.map((w, i) => (
              <span key={i}>
                <button
                  type="button"
                  onClick={() => tap(i)}
                  className={`relative inline rounded-md px-0.5 transition-colors ${
                    w.found ? "text-[#2563eb]" : w.missed ? "bg-rose-200 text-rose-700" : "hover:bg-purple-100"
                  } ${w.wrongFlash ? "games-shake bg-rose-200" : ""}`}
                >
                  {w.found ? w.original : w.text}
                  {w.found ? (
                    // Lazur's blue pen circles each find
                    <svg className="pointer-events-none absolute -inset-x-2 -inset-y-1.5 h-[calc(100%+12px)] w-[calc(100%+16px)] overflow-visible" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden>
                      <path className="games-draw" d="M6 20 C6 6 94 4 95 19 C96 34 10 37 5 22 C3 14 30 6 52 6" fill="none" stroke="#2563eb" strokeWidth="2.6" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                    </svg>
                  ) : null}
                </button>{" "}
              </span>
            ))}
          </p>
          {penalty ? (
            <span key={penalty.id} className={`games-rise pointer-events-none absolute right-6 top-4 font-display text-xl font-bold ${penalty.good ? "text-purple-600" : "text-rose-500"}`}>{penalty.text}</span>
          ) : null}
        </div>
        <p className="mx-auto mt-4 max-w-3xl text-center text-[12px] text-white/40">Found typos get circled in Lazur blue. On a Mac, Lazur cleans up your writing as you talk.</p>
      </div>
    </GameFrame>
  );
}
