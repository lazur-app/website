"use client";

import { useEffect, useState } from "react";
import { useMomentWhen } from "./Letter";
import { Btn, Notice, Panel, Stat, Unsupported, inputClass } from "./ui";
import { ScoreBox } from "./ScoreBox";
import { diffWords, splitWords } from "./PronunciationChecker";

type Level = "Easy" | "Medium" | "Hard";

const SENTENCES: Record<Level, string[]> = {
  Easy: [
    "The cat sat on the warm mat.",
    "I like to eat apples after school.",
    "My brother has a red bike.",
    "We went to the park on Sunday.",
    "The sun is bright and the sky is blue.",
    "She drinks a glass of milk every morning.",
    "Please close the door when you leave.",
    "Our dog loves to run on the beach.",
  ],
  Medium: [
    "Yesterday, we walked through the market and bought fresh vegetables for dinner.",
    "The train was delayed, so she waited patiently on the crowded platform.",
    "Although it was raining, the children continued to play outside.",
    "He carefully folded the map and put it back into his backpack.",
    "Learning a new language takes time, but practice makes it easier every day.",
    "The museum opens at nine o'clock and closes at five in the evening.",
    "My grandmother tells wonderful stories about the village where she grew up.",
    "Please remember to submit your assignment before Friday afternoon.",
  ],
  Hard: [
    "The committee's decision, which was announced unexpectedly, surprised even its most loyal supporters.",
    "Environmental scientists emphasise that renewable energy is essential for a sustainable future.",
    "Despite the unprecedented difficulties, the entrepreneur remained determined to succeed.",
    "The archaeologist discovered an extraordinary collection of ancient pottery beneath the ruins.",
    "Neither the manager nor the employees were aware of the necessary changes to the schedule.",
    "Conscientious students often review their notes thoroughly before an examination.",
    "The restaurant's atmosphere was sophisticated, yet surprisingly comfortable and welcoming.",
    "Her presentation about international economics fascinated the entire audience, including sceptical professors.",
  ],
};

const LEVELS: { id: Level; emoji: string }[] = [
  { id: "Easy", emoji: "" },
  { id: "Medium", emoji: "" },
  { id: "Hard", emoji: "" },
];

/** Listening dictation practice: hear a sentence, type it, get a word-by-word check. */
export function DictationPractice(_props: { page?: string }) {
  void _props;
  const [supported, setSupported] = useState<boolean | null>(null);
  const [level, setLevel] = useState<Level>("Easy");
  const [index, setIndex] = useState(0);
  const [speed, setSpeed] = useState(0.9);
  const [input, setInput] = useState("");
  const [checked, setChecked] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [session, setSession] = useState({ right: 0, total: 0, sentences: 0 });

  useEffect(() => {
    const ok = "speechSynthesis" in window;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSupported(ok);
    return () => {
      if (ok) window.speechSynthesis.cancel();
    };
  }, []);

  const sentence = SENTENCES[level][index];
  const targetWords = splitWords(sentence);
  const result = checked ? diffWords(targetWords, splitWords(input)) : null;
  const right = result ? result.items.filter((x) => x.ok).length : 0;
  const accuracy = result && targetWords.length ? Math.round((right / targetWords.length) * 100) : 0;

  const speak = (rate: number) => {
    const synth = window.speechSynthesis;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(sentence);
    const en = synth.getVoices().find((v) => v.lang.toLowerCase().startsWith("en"));
    if (en) u.voice = en;
    u.lang = en?.lang ?? "en-US";
    u.rate = rate;
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    setSpeaking(true);
    synth.speak(u);
  };

  const reset = () => {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
    setInput("");
    setChecked(false);
  };

  const check = () => {
    setChecked(true);
    const r = diffWords(targetWords, splitWords(input));
    const ok = r.items.filter((x) => x.ok).length;
    setSession((s) => ({ right: s.right + ok, total: s.total + targetWords.length, sentences: s.sentences + 1 }));
  };

  const next = () => {
    reset();
    setIndex((i) => (i + 1) % SENTENCES[level].length);
  };

  useMomentWhen(session.sentences >= 3, `${session.total ? Math.round((session.right / session.total) * 100) : 0}% across ${session.sentences} sentences`, 2200);
  if (supported === false) {
    return (
      <Panel>
        <Unsupported what="Speech playback" />
      </Panel>
    );
  }

  const sessionPct = session.total ? Math.round((session.right / session.total) * 100) : 0;

  return (
    <Panel>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Difficulty">
        {LEVELS.map((l) => (
          <button
            key={l.id}
            type="button"
            role="tab"
            aria-selected={level === l.id}
            onClick={() => {
              setLevel(l.id);
              setIndex(0);
              reset();
            }}
            className={`rounded-full px-4 py-2 text-[15px] font-semibold transition ${
              level === l.id ? "bg-[var(--brand)] text-white" : "border border-[var(--border-strong)] bg-white text-[var(--foreground)] hover:bg-[var(--brand-soft)]"
            }`}
          >
            {l.emoji} {l.id}
          </button>
        ))}
        <span className="ml-auto self-center text-[14px] text-[var(--foreground-muted)]">
          Sentence {index + 1} of {SENTENCES[level].length}
        </span>
      </div>

      <div className="mt-6 rounded-2xl bg-[var(--background-deep)] p-5 text-center">
        <p className="mb-3 text-[15px] text-[var(--foreground-muted)]">Listen, then type what you hear</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Btn onClick={() => speak(speed)} className="!px-6 !py-3.5 !text-[16px]">
            {speaking ? " Playing…" : "Play"}
          </Btn>
          <Btn tone="ghost" onClick={() => speak(speed)}>
             Replay
          </Btn>
          <Btn tone="ghost" onClick={() => speak(0.55)}>
             Slow replay
          </Btn>
        </div>
        <label className="mx-auto mt-4 block max-w-[320px] text-left">
          <span className="mb-1 flex justify-between text-[13px] text-[var(--foreground-muted)]">
            <span>Speed</span>
            <span className="tabular-nums">{speed.toFixed(1)}x</span>
          </span>
          <input type="range" min={0.5} max={1.5} step={0.1} value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-full accent-[var(--brand)]" />
        </label>
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={checked}
        rows={3}
        placeholder="Type the sentence here…"
        aria-label="What you heard"
        autoCapitalize="off"
        spellCheck={false}
        className={`${inputClass} mt-5 resize-y text-[18px] disabled:opacity-70`}
      />

      {!checked ? (
        <div className="mt-4">
          <Btn onClick={check} disabled={!input.trim()}>
             Check
          </Btn>
        </div>
      ) : null}

      {result ? (
        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Stat label={accuracy === 100 ? " Perfect!" : "accuracy"} value={`${accuracy}%`} />
            <Stat label="words right" value={`${right}/${targetWords.length}`} />
          </div>
          <p className="flex flex-wrap gap-x-2 gap-y-2 text-[18px] leading-[1.5]">
            {result.items.map((it, k) =>
              it.ok ? (
                <span key={k} className="rounded-lg bg-[#e6f5e9] px-2 py-0.5 text-[#1f5c2c]">
                  {it.word}
                </span>
              ) : (
                <span key={k} className="rounded-lg bg-[#fdecec] px-2 py-0.5 text-[#8a1f1f]">
                  {it.heard ? <s className="mr-1 opacity-70">{it.heard}</s> : <span className="mr-1 opacity-70">(missing)</span>}
                  <strong>{it.word}</strong>
                </span>
              ),
            )}
          </p>
          {result.extra.length ? <Notice>Extra words you typed: {result.extra.join(", ")}</Notice> : null}
          <Btn onClick={next}> Next sentence</Btn>
        </div>
      ) : null}

      <div className="mt-8 grid grid-cols-3 gap-3 border-t border-[var(--border-strong)] pt-6">
        <Stat label="sentences" value={session.sentences} />
        <Stat label="session score" value={session.total ? `${sessionPct}%` : "–"} />
        <Stat label="words right" value={`${session.right}/${session.total}`} />
      </div>
      {session.sentences >= 3 ? <ScoreBox tool="dictation-practice" value={sessionPct} unit="%" noun="English dictation practice" /> : null}
      <p className="mt-4 text-[13px] text-[var(--foreground-muted)]">Your browser reads each sentence aloud. Nothing is uploaded.</p>
    </Panel>
  );
}
