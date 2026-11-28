"use client";

import { useMemo, useState } from "react";
import { Btn, CopyBtn, Panel, Stat, inputClass } from "./ui";

const STOP = new Set(
  "a an and are as at be but by for from had has have he her his i if in is it its me my not of on or our she so that the their them there they this to was we were what when which who will with you your".split(" "),
);

const LIMITS = [
  { label: " Tweet", n: 280 },
  { label: " SMS", n: 160 },
  { label: " Meta description", n: 160 },
  { label: " LinkedIn post", n: 3000 },
];

function fmtTime(minutes: number) {
  if (minutes <= 0) return "0 sec";
  const total = Math.round(minutes * 60);
  if (total < 60) return `${total} sec`;
  const m = Math.floor(total / 60);
  const s = total % 60;
  return s ? `${m} min ${s} sec` : `${m} min`;
}

/** Live word, character, sentence and reading-time counter. Nothing leaves the browser. */
export function WordCounter(props: { page?: string }) {
  void props.page;
  const [text, setText] = useState("");
  const [limit, setLimit] = useState<number | null>(null);

  const s = useMemo(() => {
    const words = text.match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu) ?? [];
    const sentences = text.match(/[^.!?…]+[.!?…]*/g)?.filter((x) => /[\p{L}\p{N}]/u.test(x)).length ?? 0;
    const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim()).length;
    const letters = words.reduce((a, w) => a + w.replace(/['’-]/g, "").length, 0);
    const freq = new Map<string, number>();
    for (const w of words) {
      const k = w.toLowerCase().replace(/^['’-]+|['’-]+$/g, "");
      if (k.length < 2 || STOP.has(k)) continue;
      freq.set(k, (freq.get(k) ?? 0) + 1);
    }
    const top = [...freq.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 8);
    return {
      words: words.length,
      chars: [...text].length,
      noSpaces: [...text.replace(/\s/g, "")].length,
      sentences,
      paragraphs,
      avg: words.length ? letters / words.length : 0,
      top,
    };
  }, [text]);

  const remaining = limit === null ? null : limit - s.chars;
  const maxTop = s.top[0]?.[1] ?? 1;

  return (
    <Panel className="space-y-5">
      <div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder=" Type or paste your text here…"
          rows={10}
          className={`${inputClass} min-h-[220px] resize-y leading-[1.6]`}
          aria-label="Text to count"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <CopyBtn text={text} label="Copy text" />
          <Btn tone="ghost" disabled={!text} onClick={() => setText("")}>
             Clear
          </Btn>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Words" value={s.words.toLocaleString()} />
        <Stat label="Characters" value={s.chars.toLocaleString()} sub="with spaces" />
        <Stat label="Characters" value={s.noSpaces.toLocaleString()} sub="no spaces" />
        <Stat label="Sentences" value={s.sentences.toLocaleString()} />
        <Stat label="Paragraphs" value={s.paragraphs.toLocaleString()} />
        <Stat label=" Reading time" value={fmtTime(s.words / 238)} />
        <Stat label=" Speaking time" value={fmtTime(s.words / 130)} />
        <Stat label="Avg word length" value={s.avg.toFixed(1)} sub="letters" />
      </div>

      <div>
        <h3 className="mb-2 text-[15px] font-semibold"> Character limit</h3>
        <div className="flex flex-wrap gap-2">
          {LIMITS.map((l) => (
            <button
              key={l.label}
              type="button"
              onClick={() => setLimit(limit === l.n ? null : l.n)}
              className={`rounded-full border px-4 py-2 text-[14px] font-medium transition ${limit === l.n ? "border-[var(--brand)] bg-[var(--brand)] text-white" : "border-[var(--border-strong)] hover:bg-[var(--background-deep)]"}`}
            >
              {l.label} · {l.n}
            </button>
          ))}
        </div>
        {remaining !== null ? (
          <p
            aria-live="polite"
            className={`mt-3 rounded-2xl px-4 py-3 text-[15px] font-medium ${remaining < 0 ? "bg-[#fdecec] text-[#8a1f1f]" : "bg-[var(--brand-soft)] text-[var(--brand-ink)]"}`}
          >
            {remaining < 0
              ? ` ${Math.abs(remaining).toLocaleString()} characters over the limit`
              : ` ${remaining.toLocaleString()} characters left`}
          </p>
        ) : null}
      </div>

      <div>
        <h3 className="mb-2 text-[15px] font-semibold"> Most used words</h3>
        {s.top.length === 0 ? (
          <p className="text-[14px] text-[var(--foreground-muted)]">Start typing and your top words will show up here.</p>
        ) : (
          <ul className="space-y-2">
            {s.top.map(([w, n]) => (
              <li key={w} className="flex items-center gap-3 text-[14px]">
                <span className="w-28 truncate font-medium">{w}</span>
                <span className="h-3 flex-1 overflow-hidden rounded-full bg-[var(--background-deep)]">
                  <span className="block h-full rounded-full bg-[var(--brand)]" style={{ width: `${(n / maxTop) * 100}%` }} />
                </span>
                <span className="w-8 text-right tabular-nums text-[var(--foreground-muted)]">{n}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Panel>
  );
}
