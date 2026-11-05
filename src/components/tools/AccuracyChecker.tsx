"use client";

import { useMemo, useState } from "react";
import { Metric } from "./TypingTest";
import { wordErrorRate } from "./textMetrics";

const SAMPLE_REF = "Can you move the design review to Thursday at three and add Priya to the invite";
const SAMPLE_HYP = "can you move the design review to thursday at 3 and add pria to the invite";

/** Word error rate between what you meant and what your dictation app typed. Runs in the browser. */
export function AccuracyChecker() {
  const [ref, setRef] = useState(SAMPLE_REF);
  const [hyp, setHyp] = useState(SAMPLE_HYP);
  const r = useMemo(() => wordErrorRate(ref, hyp), [ref, hyp]);

  return (
    <div className="seo-tool">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="seo-label">What you meant to say</span>
          <textarea className="seo-input mt-2" rows={5} value={ref} onChange={(e) => setRef(e.target.value)} />
        </label>
        <label className="block">
          <span className="seo-label">What your dictation app typed</span>
          <textarea className="seo-input mt-2" rows={5} value={hyp} onChange={(e) => setHyp(e.target.value)} />
        </label>
      </div>
      <div className="mt-6 flex flex-wrap gap-8" role="status">
        <Metric label="Word error rate" value={`${(r.wer * 100).toFixed(1)}%`} />
        <Metric label="Accuracy" value={`${Math.max(0, 100 - r.wer * 100).toFixed(1)}%`} />
        <Metric label="Wrong / missing / extra" value={`${r.S} / ${r.D} / ${r.I}`} />
      </div>
      <p className="mt-6 text-[16px] leading-[2]" aria-label="Word by word comparison">
        {r.align.map((a, i) => (
          <span key={i} className="mr-1.5">
            {a.op === "ok" ? (
              <span>{a.ref}</span>
            ) : a.op === "sub" ? (
              <span className="rounded bg-[#fff4e5] px-1" title={`meant "${a.ref}"`}>
                <s className="text-[var(--foreground-faint)]">{a.ref}</s> <span className="text-[#b54708]">{a.hyp}</span>
              </span>
            ) : a.op === "del" ? (
              <span className="rounded bg-[#fde2e1] px-1 text-[#b42318]" title="missing">
                [{a.ref}]
              </span>
            ) : (
              <span className="rounded bg-[var(--brand-soft)] px-1 text-[var(--brand-ink)]" title="extra">
                +{a.hyp}
              </span>
            )}
          </span>
        ))}
      </p>
      <p className="mt-3 text-[13px] text-[var(--foreground-faint)]">Case and punctuation are ignored, the usual way to score speech recognition. “3” and “three” count as different words. Nothing you paste leaves your browser.</p>
    </div>
  );
}
