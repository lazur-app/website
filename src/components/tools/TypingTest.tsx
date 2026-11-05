"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { wpm } from "./textMetrics";

const PASSAGES = [
  "The quickest way to learn a new app is to ask someone who already knows it. Most of us do not have that person sitting next to us, so we search, watch a video, and lose ten minutes finding one button.",
  "Open the spreadsheet, select the column with the dates, and sort it from oldest to newest. Then add a filter so you only see last month. It sounds simple, but every app hides these menus in a different place.",
  "Write the reply while the thread is still on your screen. Say what you agree with, what you need from them, and when. Keep it short. People answer short emails faster than long ones.",
];

const DURATION = 60;

/** 60-second typing test, scored as standard WPM (5 characters = 1 word), with accuracy. */
export function TypingTest({ onResult, duration = DURATION, passageIndex }: { onResult?: (r: { wpm: number; accuracy: number }) => void; duration?: number; passageIndex?: number }) {
  const [seed, setSeed] = useState(passageIndex ?? 0);
  const passage = PASSAGES[seed % PASSAGES.length];
  const [typed, setTyped] = useState("");
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [now, setNow] = useState(0);
  const [done, setDone] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const typedRef = useRef("");

  const correct = useMemo(() => [...typed].filter((c, i) => c === passage[i]).length, [typed, passage]);
  const elapsed = startedAt === null ? 0 : Math.min(duration * 1000, Math.max(0, now - startedAt));
  const accuracy = typed.length ? Math.round((correct / typed.length) * 100) : 100;
  const speed = wpm(correct, elapsed);
  const left = Math.max(0, duration - Math.floor(elapsed / 1000));

  function finish(at: number, text: string) {
    if (startedAt === null) return;
    const c = [...text].filter((ch, i) => ch === passage[i]).length;
    setDone(true);
    setNow(at);
    onResult?.({ wpm: wpm(c, Math.min(duration * 1000, at - startedAt)), accuracy: text.length ? Math.round((c / text.length) * 100) : 100 });
  }

  useEffect(() => {
    if (startedAt === null || done) return;
    const t = setInterval(() => {
      const at = Date.now();
      if (at - startedAt >= duration * 1000) finish(at, typedRef.current);
      else setNow(at);
    }, 200);
    return () => clearInterval(t);
  });

  function reset(next = false) {
    typedRef.current = "";
    setTyped("");
    setStartedAt(null);
    setNow(0);
    setDone(false);
    if (next) setSeed((s) => s + 1);
    inputRef.current?.focus();
  }

  return (
    <div className="seo-tool">
      <div className="flex flex-wrap items-center gap-6">
        <Metric label="Words per minute" value={String(speed)} />
        <Metric label="Accuracy" value={`${accuracy}%`} />
        <Metric label="Time left" value={`${left}s`} />
      </div>
      <p className="mt-6 rounded-xl bg-[var(--background-deep)] p-4 font-mono text-[15px] leading-[1.9]" aria-label="Passage to type">
        {[...passage].map((c, i) => (
          <span
            key={i}
            className={i < typed.length ? (typed[i] === c ? "text-[var(--foreground)]" : "bg-[#fde2e1] text-[#b42318]") : i === typed.length ? "border-b-2 border-[var(--brand)] text-[var(--foreground-muted)]" : "text-[var(--foreground-faint)]"}
          >
            {c}
          </span>
        ))}
      </p>
      <label className="mt-4 block">
        <span className="seo-label">Type here. The timer starts with your first key.</span>
        <textarea
          ref={inputRef}
          className="seo-input mt-2 font-mono"
          rows={3}
          value={typed}
          disabled={done}
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          onChange={(e) => {
            const at = Date.now();
            if (startedAt === null) {
              setStartedAt(at);
            }
            setNow(at);
            const text = e.target.value.slice(0, passage.length);
            typedRef.current = text;
            setTyped(text);
            if (startedAt !== null && text.length >= passage.length) finish(at, text);
          }}
          onPaste={(e) => e.preventDefault()}
        />
      </label>
      <div className="mt-4 flex flex-wrap gap-3">
        <button type="button" className="seo-btn" onClick={() => reset(false)}>
          {done ? "Try again" : "Restart"}
        </button>
        <button type="button" className="seo-btn seo-btn--ghost" onClick={() => reset(true)}>
          New passage
        </button>
      </div>
      {done ? (
        <p className="mt-5 text-[15px] leading-relaxed text-[#3d3834]" role="status">
          You typed <strong>{speed} words per minute</strong> at {accuracy}% accuracy. The average in a study of 168,000 typists was 52.
        </p>
      ) : null}
    </div>
  );
}

export function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="seo-label">{label}</p>
      <p className="seo-stats__value mt-1 tabular-nums">{value}</p>
    </div>
  );
}
