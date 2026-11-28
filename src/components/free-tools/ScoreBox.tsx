"use client";

import { useEffect, useRef, useState } from "react";
import { track } from "@/lib/productAnalytics";
import { beatPercent, MIN_TESTS, type ScoreStats } from "@/lib/free-tools/stats";
import { Check, Link2, MessageCircle, Share2 } from "lucide-react";
import { Sticker } from "@/components/landing/Sticker";
import { useLazurMoment } from "./Letter";
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
  const moment = useLazurMoment();

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
      moment({ label: "your score link is copied", every: true, delay: 700 });
    }
  }

  const enough = stats && stats.n >= MIN_TESTS;
  const btn =
    "inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full border-[1.5px] border-[#1c1917] bg-white px-4 text-[14px] font-bold text-[#1c1917] transition hover:-translate-y-[1px] hover:shadow-[0_2px_0_#1c1917]";
  return (
    <div className="relative mt-5 overflow-hidden rounded-[24px] border-[1.5px] border-[#1c1917] bg-[linear-gradient(135deg,#fff6dc_0%,#ffeef3_55%,#efeaff_100%)] p-5 shadow-[0_3px_0_#1c1917] sm:p-6">
      <Sticker name="crown" size={58} rotate={14} className="pointer-events-none absolute -right-1 -top-1 sm:right-3 sm:top-3" />
      <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-[#1c1917]/55">your score</p>
      <p className="mt-1 flex items-baseline gap-2 text-[#1c1917]">
        <span className="text-[52px] font-bold leading-none tracking-[-0.04em] tabular-nums">
          {unit === "%" ? `${value}%` : value.toFixed(1)}
        </span>
        {unit === "%" ? null : <span className="text-[18px] font-bold text-[#1c1917]/60">{unit}</span>}
      </p>
      <p className="mt-3 max-w-[30rem] text-[15.5px] leading-[1.5] text-[#3d3834]">
        {enough ? (
          <>
            You beat <b className="text-[#1c1917]">{beatPercent(stats, value)}%</b> of people this week. Average {stats.avg}
            {unit === "%" ? "%" : ` ${unit}`} from {stats.n.toLocaleString()} tests.
          </>
        ) : (
          <>Send it to a friend and see who wins. The link opens the test with your score on it.</>
        )}
      </p>
      <div className="mt-4 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
        <button
          type="button"
          onClick={() => share(typeof navigator !== "undefined" && "share" in navigator ? "native" : "copy")}
          className="col-span-2 inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full bg-[#1c1917] px-5 text-[14px] font-bold text-white transition hover:-translate-y-[1px] hover:bg-black"
        >
          <Share2 className="h-4 w-4" aria-hidden />
          Share my score
        </button>
        <button type="button" onClick={() => share("copy")} className={btn}>
          {copied ? <Check className="h-4 w-4" strokeWidth={3} aria-hidden /> : <Link2 className="h-4 w-4" aria-hidden />}
          {copied ? "Link copied" : "Copy link"}
        </button>
        <button type="button" onClick={() => share("x")} className={btn}>
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden fill="currentColor">
            <path d="M18.9 2H22l-6.8 7.8L23 22h-6.2l-4.8-6.3L6.4 22H3.3l7.3-8.3L1 2h6.3l4.4 5.8L18.9 2Zm-1.1 18h1.7L6.3 3.9H4.5L17.8 20Z" />
          </svg>
          Post on X
        </button>
        <button type="button" onClick={() => share("whatsapp")} className={`${btn} col-span-2 sm:col-span-1`}>
          <MessageCircle className="h-4 w-4" aria-hidden />
          WhatsApp
        </button>
      </div>
    </div>
  );
}
