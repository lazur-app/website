"use client";

import { useEffect, useRef, useState } from "react";
import { track } from "@/lib/productAnalytics";
import { beatPercent, MIN_TESTS, type ScoreStats } from "@/lib/free-tools/stats";
import { copyText } from "./ui";

/**
 * Shown when a test finishes with a score (click speed, pronunciation, dictation practice):
 * how it compares with everyone else this week (only once enough people have taken it, so the
 * number is real) and a link to share the score. The shared link opens the tool with a challenge
 * banner and a score card image (see score-image/route.tsx).
 */
export function ScoreBox({ tool, value, unit, noun }: { tool: string; value: number; unit: string; noun: string }) {
  const [stats, setStats] = useState<ScoreStats | null>(null);
  const [copied, setCopied] = useState(false);
  const sent = useRef<number | null>(null);

  useEffect(() => {
    if (sent.current === value) return;
    sent.current = value;
    fetch("/api/free-tools/score", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ tool, value }) })
      .then((r) => (r.ok ? r.json() : null))
      .then((d: ScoreStats | null) => d && typeof d.n === "number" && setStats(d))
      .catch(() => {});
  }, [tool, value]);

  const shown = `${value}${unit === "%" ? "%" : ` ${unit}`}`;
  const link = `https://${tool}.lazur.app/?score=${encodeURIComponent(String(value))}`;
  const text = `I got ${shown} on the ${noun}. Can you beat it?`;

  async function share(via: "native" | "copy" | "x" | "whatsapp") {
    track("tool_score_shared", { tool, via, value });
    if (via === "native" && navigator.share) {
      try {
        await navigator.share({ text, url: link });
      } catch {
        /* closed */
      }
      return;
    }
    if (via === "x") window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(link)}`, "_blank", "noopener");
    else if (via === "whatsapp") window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${link}`)}`, "_blank", "noopener");
    else if (await copyText(`${text} ${link}`)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    }
  }

  const enough = stats && stats.n >= MIN_TESTS;
  return (
    <div className="mt-4 rounded-2xl border-[1.5px] border-[#1c1917] bg-white p-4">
      {enough ? (
        <p className="text-[16px] leading-[1.5]">
          You beat <b>{beatPercent(stats, value)}%</b> of people this week.{" "}
          <span className="text-[var(--foreground-muted)]">
            Average {stats.avg}
            {unit === "%" ? "%" : ` ${unit}`} from {stats.n.toLocaleString()} tests.
          </span>
        </p>
      ) : (
        <p className="text-[16px] leading-[1.5]">Your score: <b>{shown}</b>. Send it to a friend and see who wins.</p>
      )}
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={() => share(typeof navigator !== "undefined" && "share" in navigator ? "native" : "copy")} className="inline-flex min-h-[44px] items-center rounded-full bg-[#1c1917] px-5 text-[14px] font-bold text-white hover:bg-black">
          Share my score
        </button>
        <button type="button" onClick={() => share("copy")} className="inline-flex min-h-[44px] items-center rounded-full border-[1.5px] border-[#1c1917] bg-white px-4 text-[14px] font-bold">
          {copied ? "✓ Link copied" : "Copy link"}
        </button>
        <button type="button" onClick={() => share("x")} className="inline-flex min-h-[44px] items-center rounded-full border-[1.5px] border-[#1c1917] bg-white px-4 text-[14px] font-bold">
          Post on X
        </button>
        <button type="button" onClick={() => share("whatsapp")} className="inline-flex min-h-[44px] items-center rounded-full border-[1.5px] border-[#1c1917] bg-white px-4 text-[14px] font-bold">
          WhatsApp
        </button>
      </div>
    </div>
  );
}
