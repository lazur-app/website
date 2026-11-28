"use client";

import { useCallback, useEffect, useState } from "react";
import { Btn, Field, Notice, Panel, Stat, Unsupported, inputClass } from "./ui";
import { DICTATION_LANGS, PulseDot, speechErrorMessage, useSpeechRecognition } from "./Dictation";
import { Check, X } from "lucide-react";

export function normWord(w: string): string {
  return w.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "");
}

export function splitWords(s: string): string[] {
  return s.split(/\s+/).filter((w) => normWord(w));
}

export type DiffItem = { word: string; ok: boolean; heard?: string };

/** Word-level diff of target vs spoken/typed words (case and punctuation ignored). */
export function diffWords(target: string[], heard: string[]): { items: DiffItem[]; extra: string[] } {
  const a = target.map(normWord);
  const b = heard.map(normWord);
  const n = a.length;
  const m = b.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const items: DiffItem[] = [];
  const extra: string[] = [];
  let pendT: number[] = [];
  let pendH: number[] = [];
  const flush = () => {
    pendT.forEach((ti, k) => {
      const hi = pendH[k];
      items[ti] = { word: target[ti], ok: false, heard: hi !== undefined ? heard[hi] : undefined };
    });
    pendH.slice(pendT.length).forEach((hi) => extra.push(heard[hi]));
    pendT = [];
    pendH = [];
  };
  let i = 0;
  let j = 0;
  while (i < n || j < m) {
    if (i < n && j < m && a[i] === b[j]) {
      flush();
      items[i] = { word: target[i], ok: true };
      i++;
      j++;
    } else if (i < n && (j >= m || dp[i + 1][j] >= dp[i][j + 1])) {
      pendT.push(i++);
    } else {
      pendH.push(j++);
    }
  }
  flush();
  return { items, extra };
}

const SAMPLES = ["Thorough", "Worcestershire", "She sells seashells by the seashore", "The quick brown fox jumps over the lazy dog", "Entrepreneur", "Would you like a cup of coffee?"];

/** Pronunciation checker: say a word or sentence and see which words the speech engine understood. */
export function PronunciationChecker(_props: { page?: string }) {
  void _props;
  const [target, setTarget] = useState("She sells seashells by the seashore");
  const [lang, setLang] = useState("en-US");
  const [heard, setHeard] = useState<string | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const [synthOk, setSynthOk] = useState(true);

  const onFinal = useCallback((t: string) => setHeard((p) => (p ? p + " " : "") + t), []);
  const { supported, listening, interim, error, start, stop } = useSpeechRecognition({ lang, continuous: false, onFinal });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSynthOk("speechSynthesis" in window);
    return () => {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, []);

  const hear = () => {
    const synth = window.speechSynthesis;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(target);
    u.lang = lang;
    u.rate = 0.85;
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    setSpeaking(true);
    synth.speak(u);
  };

  const sayIt = () => {
    window.speechSynthesis?.cancel();
    setHeard(null);
    start();
  };

  if (supported === false) {
    return (
      <Panel>
        <Unsupported what="Speech recognition" />
      </Panel>
    );
  }

  const targetWords = splitWords(target);
  const result = heard !== null && !listening ? diffWords(targetWords, splitWords(heard)) : null;
  const correct = result ? result.items.filter((x) => x.ok).length : 0;
  const score = result && targetWords.length ? Math.round((correct / targetWords.length) * 100) : 0;
  const verdict = score >= 90 ? " Excellent!" : score >= 60 ? " Getting there" : " Keep practising";

  return (
    <Panel>
      <Field label=" Word or sentence to say">
        <textarea
          value={target}
          onChange={(e) => {
            setTarget(e.target.value);
            setHeard(null);
          }}
          rows={2}
          className={`${inputClass} resize-y text-[18px]`}
        />
      </Field>
      <div className="mt-3 flex flex-wrap gap-2">
        {SAMPLES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => {
              setTarget(s);
              setHeard(null);
            }}
            className="rounded-full border border-[var(--border-strong)] bg-white px-3 py-1.5 text-[13px] text-[var(--foreground)] transition hover:bg-[var(--brand-soft)]"
          >
            {s.length > 28 ? s.slice(0, 26) + "…" : s}
          </button>
        ))}
      </div>

      <div className="mt-5">
        <Field label=" Language you are practising">
          <select
            value={lang}
            onChange={(e) => {
              setLang(e.target.value);
              setHeard(null);
            }}
            className={inputClass}
          >
            {DICTATION_LANGS.map((l) => (
              <option key={l.code} value={l.code}>
                {l.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        {listening ? (
          <Btn tone="danger" onClick={stop}>
             Stop
          </Btn>
        ) : (
          <Btn onClick={sayIt} disabled={!targetWords.length || supported === null} className="!px-7 !py-4 !text-[17px]">
            {result ? " Try again" : " Say it"}
          </Btn>
        )}
        {synthOk ? (
          <Btn tone="ghost" onClick={hear} disabled={!targetWords.length || speaking}>
             Hear it
          </Btn>
        ) : null}
        {listening ? <PulseDot label="Listening… say it now" /> : null}
      </div>

      {listening && interim ? <p className="mt-3 text-[16px] italic text-[var(--foreground-faint)]">{interim}</p> : null}
      {error ? (
        <div className="mt-4">
          <Notice tone="warn">{speechErrorMessage(error)}</Notice>
        </div>
      ) : null}
      {heard === "" && !listening && !error ? <div className="mt-4"><Notice>We didn&apos;t catch anything. Check your microphone and try again.</Notice></div> : null}

      {result ? (
        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Stat label={verdict} value={`${score}%`} />
            <Stat label="words correct" value={`${correct}/${targetWords.length}`} />
          </div>
          <ul className="flex flex-wrap gap-2">
            {result.items.map((it, k) => (
              <li
                key={k}
                className={`rounded-2xl px-3 py-2 text-[16px] ${it.ok ? "bg-[#e6f5e9] text-[#1f5c2c]" : "bg-[#fdecec] text-[#8a1f1f]"}`}
              >
                <span className="font-medium">
                  {it.ok ? <Check className="mr-1 inline h-4 w-4" /> : <X className="mr-1 inline h-4 w-4" />}{it.word}
                </span>
                {!it.ok ? <span className="block text-[13px]">{it.heard ? `heard “${it.heard}”` : "not heard"}</span> : null}
              </li>
            ))}
          </ul>
          <p className="text-[14px] text-[var(--foreground-muted)]">
            <span className="font-medium text-[var(--foreground)]">We heard:</span> {heard || "nothing"}
          </p>
        </div>
      ) : null}
      <p className="mt-5 text-[13px] text-[var(--foreground-muted)]">Your browser&apos;s speech engine does the listening, so results show what a computer understood, a good test of clear speech. Nothing is uploaded to Lazur.</p>
    </Panel>
  );
}
