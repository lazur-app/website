"use client";

import { useMemo, useState } from "react";
import { useMomentWhen } from "./Letter";
import { Field, Panel, Stat, inputClass } from "./ui";

const PACES = [
  { id: "slow", label: " Slow", wpm: 110 },
  { id: "normal", label: " Normal", wpm: 130 },
  { id: "fast", label: " Fast", wpm: 160 },
  { id: "custom", label: " Custom", wpm: 0 },
];

const DURATIONS = [1, 2, 3, 5, 10, 15, 20];

function mmss(minutes: number) {
  const total = Math.round(minutes * 60);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

/** Turn a word count (or pasted text) into speaking time at a chosen pace. */
export function WordsToMinutes(props: { page?: string }) {
  const initial = PACES.find((p) => p.id !== "custom" && props.page?.toLowerCase().includes(p.id))?.id ?? "normal";
  const [text, setText] = useState("");
  const [count, setCount] = useState("");
  const [pace, setPace] = useState(initial);
  const [custom, setCustom] = useState("140");

  const textWords = useMemo(() => (text.match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu) ?? []).length, [text]);
  const words = text.trim() ? textWords : Math.max(0, Math.floor(Number(count) || 0));
  const wpm = pace === "custom" ? Math.max(1, Number(custom) || 130) : (PACES.find((p) => p.id === pace)?.wpm ?? 130);
  const minutes = words / wpm;

  const compare = [
    `A 1-minute talk is ~${wpm} words`,
    `A 5-minute speech is ~${wpm * 5} words`,
    `A 10-minute presentation is ~${wpm * 10} words`,
    `A single page (500 words) takes ${mmss(500 / wpm)} to read aloud`,
  ];

  useMomentWhen(words >= 30, `${words} words takes ${mmss(minutes)} to say`, 3500);
  return (
    <Panel className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label=" Paste your text" hint="We count the words for you.">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={5}
            className={`${inputClass} resize-y`}
            placeholder="Paste your script or speech…"
          />
        </Field>
        <Field label=" …or type a word count" hint={text.trim() ? "Using the pasted text instead." : undefined}>
          <input
            type="number"
            min={0}
            inputMode="numeric"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            disabled={!!text.trim()}
            className={inputClass}
            placeholder="e.g. 650"
          />
        </Field>
      </div>

      <div>
        <h3 className="mb-2 text-[15px] font-semibold"> Speaking pace</h3>
        <div className="flex flex-wrap gap-2">
          {PACES.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPace(p.id)}
              className={`rounded-full border px-4 py-2 text-[14px] font-medium transition ${pace === p.id ? "border-[var(--brand)] bg-[var(--brand)] text-white" : "border-[var(--border-strong)] hover:bg-[var(--background-deep)]"}`}
            >
              {p.label}
              {p.wpm ? ` · ${p.wpm}` : ""}
            </button>
          ))}
        </div>
        {pace === "custom" ? (
          <div className="mt-3 max-w-[200px]">
            <Field label="Words per minute">
              <input type="number" min={1} value={custom} onChange={(e) => setCustom(e.target.value)} className={inputClass} />
            </Field>
          </div>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-[var(--brand-soft)] px-4 py-5 text-center sm:col-span-1">
          <div className="text-[44px] font-semibold leading-none tabular-nums text-[var(--brand-ink)]">{mmss(minutes)}</div>
          <div className="mt-2 text-[13px] text-[var(--brand-ink)]"> speaking time (mm:ss)</div>
        </div>
        <Stat label="Words" value={words.toLocaleString()} />
        <Stat label=" Pages" value={(words / 500).toFixed(1)} sub="at 500 words per page" />
      </div>

      <ul className="space-y-1.5 text-[15px] text-[var(--foreground-muted)]">
        {compare.map((c) => (
          <li key={c}> {c}</li>
        ))}
      </ul>

      <div>
        <h3 className="mb-2 text-[15px] font-semibold">Words for each duration at {wpm} wpm</h3>
        <div className="overflow-hidden rounded-2xl border border-[var(--border-strong)]">
          <table className="w-full text-[15px]">
            <thead className="bg-[var(--background-deep)] text-left text-[13px] text-[var(--foreground-muted)]">
              <tr>
                <th className="px-4 py-2 font-medium">Minutes</th>
                <th className="px-4 py-2 text-right font-medium">Words</th>
              </tr>
            </thead>
            <tbody>
              {DURATIONS.map((d) => (
                <tr key={d} className="border-t border-[var(--border-strong)]">
                  <td className="px-4 py-2">{d} min</td>
                  <td className="px-4 py-2 text-right font-semibold tabular-nums">{(d * wpm).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Panel>
  );
}
