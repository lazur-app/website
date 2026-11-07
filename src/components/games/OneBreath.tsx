"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, Keyboard } from "lucide-react";
import { gameBySlug } from "@/lib/games";
import { Chip, GameFrame, confetti, sfx, useBest, type Phase } from "./kit";

const GAME = gameBySlug("one-breath")!;

/** Rounds get longer and meaner. Traditional twisters plus a few desk-life ones. */
const TWISTERS: string[][] = [
  ["Red lorry, yellow lorry, red lorry, yellow lorry.", "Six slippery snails slid slowly seaward.", "Fresh fried fish, fresh fried fish."],
  ["She sells seashells by the seashore.", "Busy bees buzz by the big blue blinds.", "A proper copper coffee pot."],
  ["Fred fed Ted bread, and Ted fed Fred bread.", "Quick clicks quickly click quick clicks.", "Silly Sally swiftly shooed seven silly sheep."],
  ["Peter Piper picked a peck of pickled peppers.", "Mac menus make many minds mumble madly.", "How can a clam cram in a clean cream can?"],
  ["I scream, you scream, we all scream for ice cream, and the ice cream screams back.", "Betty bought a bit of butter but the bit of butter Betty bought was bitter.", "Seven sleek swans swam swiftly southward, so swiftly the seven swans sank."],
];

const norm = (w: string) => w.toLowerCase().replace(/[^a-z0-9']/g, "");

/** Which target words have been said, in order (each spoken word can match one target word). */
function matched(target: string[], spoken: string): boolean[] {
  const said = spoken.split(/\s+/).map(norm).filter(Boolean);
  const out = target.map(() => false);
  let j = 0;
  for (let i = 0; i < target.length && j < said.length; i++) {
    const t = norm(target[i]);
    // look ahead a little so one misheard word doesn't block the rest
    for (let k = j; k < Math.min(said.length, j + 3); k++) {
      if (said[k] === t || (t.length > 4 && said[k].startsWith(t.slice(0, t.length - 1)))) {
        out[i] = true;
        j = k + 1;
        break;
      }
    }
  }
  return out;
}

type Rec = {
  start: () => void; stop: () => void; abort: () => void;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onend: (() => void) | null; onerror: ((e: { error: string }) => void) | null;
  continuous: boolean; interimResults: boolean; lang: string;
};

export function OneBreath() {
  const [phase, setPhase] = useState<Phase>("ready");
  const [mode, setMode] = useState<"voice" | "type">("voice");
  const [hasVoice, setHasVoice] = useState(true);
  const [round, setRound] = useState(0);
  const [text, setText] = useState("");
  const [spoken, setSpoken] = useState("");
  const [state, setState] = useState<"intro" | "go" | "done">("intro");
  const [left, setLeft] = useState(0);
  const [limit, setLimit] = useState(1);
  const [score, setScore] = useState(0);
  const [roundPts, setRoundPts] = useState<number | null>(null);
  const [perfects, setPerfects] = useState(0);
  const [newBest, setNewBest] = useState(false);
  const [micError, setMicError] = useState("");
  const { best, submit } = useBest(GAME.slug);
  const rec = useRef<Rec | null>(null);
  const timer = useRef<number | null>(null);
  const typeBox = useRef<HTMLInputElement>(null);
  const finishing = useRef(false);

  useEffect(() => {
    const W = window as unknown as { SpeechRecognition?: new () => Rec; webkitSpeechRecognition?: new () => Rec };
    const ok = Boolean(W.SpeechRecognition || W.webkitSpeechRecognition);
    setHasVoice(ok);
    if (!ok) setMode("type");
  }, []);

  const words = text.split(/\s+/).filter(Boolean);
  const hits = matched(words, spoken);
  const hitCount = hits.filter(Boolean).length;

  const stopAll = () => {
    if (timer.current) window.clearInterval(timer.current);
    timer.current = null;
    try { rec.current?.abort(); } catch {}
    rec.current = null;
  };
  useEffect(() => stopAll, []);

  const pick = (r: number) => TWISTERS[r][Math.floor(Math.random() * TWISTERS[r].length)];

  const start = () => {
    scoreRef.current = 0;
    setScore(0); setPerfects(0); setNewBest(false); setRound(0);
    setPhase("playing");
    loadRound(0);
  };

  const loadRound = (r: number) => {
    stopAll();
    finishing.current = false;
    const t = pick(r);
    const n = t.split(/\s+/).length;
    const secs = Math.max(3.2, n * 0.42 + 1.2);
    setText(t); setSpoken(""); setRoundPts(null); setMicError("");
    leftRef.current = secs;
    setLimit(secs); setLeft(secs); setState("intro");
  };

  const go = () => {
    setState("go");
    setSpoken("");
    sfx("tick");
    const t0 = performance.now();
    timer.current = window.setInterval(() => {
      const l = Math.max(0, limit - (performance.now() - t0) / 1000);
      leftRef.current = l;
      setLeft(l);
      if (l <= 0) finish(false);
    }, 50);
    if (mode === "voice") {
      const W = window as unknown as { SpeechRecognition?: new () => Rec; webkitSpeechRecognition?: new () => Rec };
      const R = W.SpeechRecognition || W.webkitSpeechRecognition;
      if (!R) return;
      const r = new R();
      r.lang = "en-US";
      r.continuous = true;
      r.interimResults = true;
      r.onresult = (e) => {
        let all = "";
        for (let i = 0; i < e.results.length; i++) all += " " + e.results[i][0].transcript;
        setSpoken(all);
      };
      r.onerror = (e) => {
        if (e.error === "not-allowed" || e.error === "service-not-allowed") {
          setMicError("Microphone blocked. Allow it in the address bar, or switch to typing.");
          finish(false);
        }
      };
      r.onend = () => { if (rec.current === r && !finishing.current) { try { r.start(); } catch {} } };
      rec.current = r;
      try { r.start(); } catch {}
    } else {
      setTimeout(() => typeBox.current?.focus(), 30);
    }
  };

  // finish early when every word is said
  useEffect(() => {
    if (state === "go" && words.length && hitCount === words.length) finish(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hitCount, state]);

  const finish = (all: boolean) => {
    if (finishing.current) return;
    finishing.current = true;
    stopAll();
    setState("done");
    const l = leftRef.current;
    const acc = all ? 1 : matched(words, spokenRef.current).filter(Boolean).length / Math.max(1, words.length);
    const pts = Math.round(acc * 100 * (round + 1) + (all ? l * 25 * (round + 1) : 0));
    setRoundPts(pts);
    scoreRef.current += pts;
    setScore(scoreRef.current);
    if (all) { setPerfects((p) => p + 1); sfx("combo"); } else sfx(acc > 0.5 ? "good" : "bad");
  };
  const leftRef = useRef(0);
  const scoreRef = useRef(0);
  const spokenRef = useRef("");
  useEffect(() => { spokenRef.current = spoken; }, [spoken]);

  const next = () => {
    if (round >= TWISTERS.length - 1) {
      setPhase("over");
      sfx("over");
      const total = scoreRef.current;
      const isNew = submit(total);
      setNewBest(isNew);
      if (isNew && total > 0) confetti(["#e11d48", "#f97316", "#fde047", "#fff"]);
      return;
    }
    setRound(round + 1);
    loadRound(round + 1);
  };

  const pct = left / limit;
  const ring = 2 * Math.PI * 54;

  return (
    <GameFrame
      game={GAME}
      phase={phase}
      score={score}
      best={best}
      onStart={start}
      newBest={newBest}
      aspect="min-h-[560px]"
      summary={<>{perfects} of {TWISTERS.length} twisters said perfectly</>}
      hud={<><Chip label="Round" value={`${round + 1}/${TWISTERS.length}`} />{hasVoice ? (
        <button type="button" onClick={() => setMode(mode === "voice" ? "type" : "voice")} disabled={state === "go"} className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[12px] font-semibold text-white/80 hover:bg-white/20 disabled:opacity-40">
          {mode === "voice" ? <Mic className="h-3.5 w-3.5" /> : <Keyboard className="h-3.5 w-3.5" />}{mode === "voice" ? "Voice" : "Typing"}
        </button>) : null}</>}
    >
      <div className="absolute inset-0 overflow-hidden bg-[radial-gradient(circle_at_50%_0%,#4c0519_0%,#0b0d17_60%)]">
        {/* floating bubbles */}
        <div className="pointer-events-none absolute inset-0 opacity-40" aria-hidden>
          {Array.from({ length: 14 }, (_, i) => (
            <span key={i} className="games-float absolute rounded-full bg-rose-500/30 blur-[1px]" style={{ left: `${(i * 37) % 100}%`, bottom: `-${10 + (i % 4) * 5}%`, width: 10 + (i % 5) * 8, height: 10 + (i % 5) * 8, animationDelay: `${i * 0.7}s`, animationDuration: `${7 + (i % 5)}s` }} />
          ))}
        </div>

        <div className="relative flex h-full flex-col items-center justify-center gap-6 px-4 py-8 text-center text-white sm:px-10">
          <p className="text-[12px] font-bold uppercase tracking-[0.25em] text-rose-300/80">Round {round + 1} · {state === "intro" ? "get ready" : state === "go" ? (mode === "voice" ? "say it!" : "type it!") : roundPts !== null && hitCount === words.length ? "perfect!" : "time"}</p>

          {/* the twister, word by word */}
          <div className="flex max-w-3xl flex-wrap justify-center gap-x-2.5 gap-y-3">
            {words.map((w, i) => (
              <span
                key={`${text}-${i}`}
                className={`rounded-xl px-2.5 py-1 font-display text-[clamp(1.4rem,3.6vw,2.4rem)] font-semibold leading-tight tracking-tight transition-all duration-200 ${
                  hits[i] ? "scale-105 bg-gradient-to-br from-rose-500 to-orange-400 text-white shadow-[0_8px_24px_-6px_rgba(244,63,94,0.8)]" : state === "done" ? "text-white/30 line-through decoration-rose-400/70" : "text-white/85"
                }`}
              >
                {w}
              </span>
            ))}
          </div>

          {/* timer ring + action */}
          <div className="relative grid h-36 w-36 place-items-center">
            <svg viewBox="0 0 120 120" className="absolute inset-0 -rotate-90">
              <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
              <circle cx="60" cy="60" r="54" fill="none" stroke={pct < 0.25 ? "#ef4444" : "url(#ob-grad)"} strokeWidth="8" strokeLinecap="round" strokeDasharray={ring} strokeDashoffset={ring * (1 - pct)} />
              <defs><linearGradient id="ob-grad"><stop offset="0" stopColor="#f43f5e" /><stop offset="1" stopColor="#fb923c" /></linearGradient></defs>
            </svg>
            {state === "intro" ? (
              <button type="button" onClick={go} className="games-glow relative grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-rose-500 to-orange-500 shadow-[0_0_40px_rgba(244,63,94,0.6)] transition hover:scale-105 active:scale-95" aria-label={mode === "voice" ? "Start talking" : "Start typing"}>
                {mode === "voice" ? <Mic className="h-10 w-10" /> : <Keyboard className="h-10 w-10" />}
              </button>
            ) : state === "go" ? (
              <div className="relative grid h-24 w-24 place-items-center">
                {mode === "voice" ? <span className="absolute inset-0 animate-ping rounded-full bg-rose-500/40" /> : null}
                <span className="relative font-display text-4xl font-bold tabular-nums">{left.toFixed(1)}</span>
              </div>
            ) : (
              <div className="games-pop relative text-center">
                <div className="font-display text-4xl font-bold">+{roundPts ?? 0}</div>
                <div className="text-xs text-white/60">{hitCount}/{words.length} words</div>
              </div>
            )}
          </div>

          {state === "go" && mode === "type" ? (
            <input
              ref={typeBox}
              value={spoken}
              onChange={(e) => setSpoken(e.target.value)}
              className="w-full max-w-xl rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-lg text-white outline-none placeholder:text-white/40 focus:border-rose-400"
              placeholder="Type it as fast as you can..."
              autoComplete="off"
              spellCheck={false}
            />
          ) : null}

          {state === "done" ? (
            <button type="button" onClick={next} className="rounded-full bg-white px-7 py-3 text-[15px] font-bold text-rose-600 shadow-lg transition hover:scale-105">
              {round >= TWISTERS.length - 1 ? "See final score" : "Next twister →"}
            </button>
          ) : null}

          <p className="max-w-md text-[12px] leading-relaxed text-white/45">
            {micError ||
              (mode === "voice"
                ? "Your browser turns speech into text (in Chrome, Google processes the audio). Lazur doesn't record or keep anything. Fun fact: Lazur does this on your Mac, in any app."
                : hasVoice
                  ? "Typing mode. Switch to Voice at the top to play out loud."
                  : "Your browser has no speech recognition, so this round is typed. Try Chrome or Safari to play out loud.")}
          </p>
        </div>
      </div>
    </GameFrame>
  );
}
