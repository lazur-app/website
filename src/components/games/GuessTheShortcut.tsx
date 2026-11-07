"use client";

import { useEffect, useRef, useState } from "react";
import { gameBySlug } from "@/lib/games";
import { Chip, GameFrame, Hearts, confetti, now, sfx, useBest, type Phase } from "./kit";

const GAME = gameBySlug("guess-the-shortcut")!;

/** macOS shortcuts. `where` is shown when the shortcut belongs to an app. */
const SHORTCUTS: Array<{ keys: string[]; answer: string; where?: string }> = [
  { keys: ["⌘", "C"], answer: "Copy" },
  { keys: ["⌘", "V"], answer: "Paste" },
  { keys: ["⌘", "X"], answer: "Cut" },
  { keys: ["⌘", "Z"], answer: "Undo" },
  { keys: ["⌘", "⇧", "Z"], answer: "Redo" },
  { keys: ["⌘", "A"], answer: "Select all" },
  { keys: ["⌘", "F"], answer: "Find" },
  { keys: ["⌘", "S"], answer: "Save" },
  { keys: ["⌘", "P"], answer: "Print" },
  { keys: ["⌘", "W"], answer: "Close the window or tab" },
  { keys: ["⌘", "Q"], answer: "Quit the app" },
  { keys: ["⌘", "T"], answer: "Open a new tab" },
  { keys: ["⌘", "N"], answer: "New window or document" },
  { keys: ["⌘", "H"], answer: "Hide the app" },
  { keys: ["⌘", "M"], answer: "Minimize the window" },
  { keys: ["⌘", "Tab"], answer: "Switch between apps" },
  { keys: ["⌘", "Space"], answer: "Open Spotlight" },
  { keys: ["⌘", "⇧", "3"], answer: "Screenshot the whole screen" },
  { keys: ["⌘", "⇧", "4"], answer: "Screenshot a selected area" },
  { keys: ["⌘", "⇧", "5"], answer: "Open the screenshot and recording toolbar" },
  { keys: ["⌘", "⌥", "Esc"], answer: "Force quit an app" },
  { keys: ["⌘", ","], answer: "Open the app's settings" },
  { keys: ["⌃", "⌘", "Q"], answer: "Lock the screen" },
  { keys: ["⌘", "⇧", "T"], answer: "Reopen the last closed tab", where: "in browsers" },
  { keys: ["⌘", "L"], answer: "Jump to the address bar", where: "in browsers" },
  { keys: ["⌘", "R"], answer: "Reload the page", where: "in browsers" },
  { keys: ["⌘", "⌫"], answer: "Move to Trash", where: "in Finder" },
  { keys: ["⌘", "⇧", "⌫"], answer: "Empty the Trash", where: "in Finder" },
  { keys: ["⌘", "⇧", "N"], answer: "New folder", where: "in Finder" },
  { keys: ["⌘", "I"], answer: "Get Info", where: "in Finder" },
  { keys: ["⌘", "D"], answer: "Duplicate the file", where: "in Finder" },
  { keys: ["⌘", "⇧", "."], answer: "Show hidden files", where: "in Finder" },
  { keys: ["⌃", "⌘", "Space"], answer: "Open emoji & symbols" },
  { keys: ["⌘", "`"], answer: "Cycle windows of the same app" },
  { keys: ["⌃", "⌘", "F"], answer: "Toggle full screen" },
  { keys: ["⌘", "⌥", "D"], answer: "Show or hide the Dock" },
  { keys: ["⌘", "B"], answer: "Bold", where: "in text editors" },
];

type Q = { keys: string[]; where?: string; options: string[]; answer: string };

function shuffle<T>(a: T[]) {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

export function GuessTheShortcut() {
  const [phase, setPhase] = useState<Phase>("ready");
  const [q, setQ] = useState<Q | null>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [left, setLeft] = useState(1);
  const [gain, setGain] = useState<string | null>(null);
  const [newBest, setNewBest] = useState(false);
  const { best, submit } = useBest(GAME.slug);
  const deck = useRef<typeof SHORTCUTS>([]);
  const timer = useRef<number | null>(null);
  const st = useRef({ score: 0, lives: 3, streak: 0, answered: 0, limit: 6 });

  const clear = () => { if (timer.current) window.clearInterval(timer.current); timer.current = null; };
  useEffect(() => clear, []);

  const nextQ = () => {
    if (!deck.current.length) deck.current = shuffle(SHORTCUTS);
    const s = deck.current.pop()!;
    const others = shuffle(SHORTCUTS.filter((x) => x.answer !== s.answer)).slice(0, 3).map((x) => x.answer);
    setQ({ keys: s.keys, where: s.where, answer: s.answer, options: shuffle([s.answer, ...others]) });
    setPicked(null);
    setGain(null);
    const limit = Math.max(3.2, 6 - st.current.answered * 0.12);
    st.current.limit = limit;
    setLeft(1);
    clear();
    const t0 = now();
    timer.current = window.setInterval(() => {
      const l = 1 - (now() - t0) / 1000 / limit;
      setLeft(Math.max(0, l));
      if (l <= 0) answer(null, s.answer);
    }, 40);
  };

  const start = () => {
    st.current = { score: 0, lives: 3, streak: 0, answered: 0, limit: 6 };
    setScore(0); setLives(3); setStreak(0); setBestStreak(0); setAnswered(0); setNewBest(false);
    deck.current = shuffle(SHORTCUTS);
    setPhase("playing");
    nextQ();
  };

  const answer = (choice: string | null, correct: string) => {
    if (!timer.current) return;
    const leftNow = leftRef.current;
    clear();
    setPicked(choice ?? "__timeout");
    const s = st.current;
    s.answered += 1;
    setAnswered(s.answered);
    if (choice === correct) {
      s.streak += 1;
      const mult = 1 + Math.floor(s.streak / 3);
      const pts = Math.round((100 + leftNow * 150) * mult);
      s.score += pts;
      setScore(s.score); setStreak(s.streak); setBestStreak((b) => Math.max(b, s.streak));
      setGain(`+${pts}${mult > 1 ? ` ×${mult}` : ""}`);
      sfx(s.streak % 3 === 0 ? "combo" : "good");
      window.setTimeout(nextQ, 650);
    } else {
      s.streak = 0;
      s.lives -= 1;
      setStreak(0); setLives(s.lives);
      setGain(choice ? "Nope" : "Too slow");
      sfx("bad");
      window.setTimeout(() => {
        if (s.lives <= 0) {
          setPhase("over");
          sfx("over");
          const isNew = submit(s.score);
          setNewBest(isNew);
          if (isNew && s.score > 0) confetti(["#0f766e", "#22c55e", "#a3e635", "#fff"]);
        } else nextQ();
      }, 1300);
    }
  };
  const leftRef = useRef(1);
  useEffect(() => { leftRef.current = left; }, [left]);

  // 1–4 keys
  useEffect(() => {
    if (phase !== "playing" || !q || picked) return;
    const kd = (e: KeyboardEvent) => {
      const i = Number(e.key) - 1;
      if (i >= 0 && i < 4) answer(q.options[i], q.answer);
    };
    window.addEventListener("keydown", kd);
    return () => window.removeEventListener("keydown", kd);
  });

  const wrong = picked && picked !== q?.answer;

  return (
    <GameFrame
      game={GAME}
      phase={phase}
      score={score}
      best={best}
      onStart={start}
      newBest={newBest}
      aspect="min-h-[560px]"
      summary={<>{answered} answered · best streak {bestStreak}</>}
      hud={<><Hearts lives={lives} />{streak >= 3 ? <Chip label="Streak" value={`🔥 ${streak}`} accent="#22c55e" /> : null}</>}
    >
      <div className={`absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,#064e3b_0%,#0b0d17_65%)] ${wrong ? "games-shake" : ""}`}>
        {/* timer bar */}
        <div className="absolute inset-x-0 top-0 h-2 bg-white/10">
          <div className="h-full transition-[width] duration-75" style={{ width: `${left * 100}%`, background: left < 0.3 ? "#ef4444" : "linear-gradient(90deg,#22c55e,#a3e635)" }} />
        </div>

        {q ? (
          <div className="flex h-full flex-col items-center justify-center gap-7 px-4 py-10 text-white">
            <p className="text-[12px] font-bold uppercase tracking-[0.25em] text-emerald-300/80">What does this do{q.where ? ` ${q.where}` : ""}?</p>

            <div key={q.keys.join("")} className="games-pop flex items-end gap-2.5 sm:gap-4">
              {q.keys.map((k, i) => (
                <span key={i} className="flex items-end gap-2.5 sm:gap-4">
                  {i > 0 ? <span className="pb-6 text-2xl text-white/30">+</span> : null}
                  <Keycap label={k} />
                </span>
              ))}
            </div>

            <div className="relative h-8">
              {gain ? <span key={gain + answered} className={`games-rise font-display text-2xl font-bold ${wrong || picked === "__timeout" ? "text-rose-400" : "text-lime-300"}`}>{gain}</span> : null}
            </div>

            <div className="grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
              {q.options.map((o, i) => {
                const isAnswer = o === q.answer;
                const state = picked ? (isAnswer ? "right" : o === picked ? "wrong" : "dim") : "idle";
                return (
                  <button
                    key={o}
                    type="button"
                    disabled={Boolean(picked)}
                    onClick={() => answer(o, q.answer)}
                    className={`group flex items-center gap-3 rounded-2xl border-2 px-4 py-3.5 text-left text-[16px] font-semibold transition-all duration-150 ${
                      state === "right" ? "scale-[1.03] border-lime-300 bg-lime-400 text-emerald-950 shadow-[0_0_30px_rgba(163,230,53,0.5)]"
                      : state === "wrong" ? "border-rose-400 bg-rose-500/80 text-white"
                      : state === "dim" ? "border-white/5 bg-white/5 text-white/30"
                      : "border-white/10 bg-white/[0.07] text-white hover:-translate-y-0.5 hover:border-emerald-300/60 hover:bg-white/[0.12]"
                    }`}
                  >
                    <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg text-[13px] font-bold ${state === "right" ? "bg-emerald-950/20" : "bg-white/10"}`}>{i + 1}</span>
                    {o}
                  </button>
                );
              })}
            </div>
            <p className="text-[12px] text-white/40">Tip: press 1–4. Or skip shortcuts altogether: with Lazur you just ask.</p>
          </div>
        ) : (
          <div className="grid h-full place-items-center">
            <div className="flex gap-4 opacity-60"><Keycap label="⌘" /><Keycap label="⇧" /><Keycap label="4" /></div>
          </div>
        )}
      </div>
    </GameFrame>
  );
}

function Keycap({ label }: { label: string }) {
  const wide = label.length > 2;
  return (
    <span
      className={`relative grid h-20 place-items-center rounded-2xl bg-gradient-to-b from-[#f8fafc] to-[#cbd5e1] font-display font-semibold text-slate-800 shadow-[0_8px_0_#64748b,0_14px_24px_rgba(0,0,0,0.5)] sm:h-24 ${wide ? "min-w-[7rem] px-4 text-2xl sm:min-w-[8.5rem] sm:text-3xl" : "w-20 text-4xl sm:w-24 sm:text-5xl"}`}
    >
      <span className="absolute inset-1.5 rounded-xl bg-gradient-to-b from-white to-[#e2e8f0]" />
      <span className="relative">{label}</span>
    </span>
  );
}
