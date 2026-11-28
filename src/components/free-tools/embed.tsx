"use client";

import { useState } from "react";
import { track } from "@/lib/productAnalytics";
import { Check, Copy } from "lucide-react";
import { Sticker } from "@/components/landing/Sticker";
import { useLazurMoment } from "./Letter";
import { copyText } from "./ui";

/** "Put this tool on your site": the iframe code, ready to copy. */
export function EmbedCode({ tool, name }: { tool: string; name: string }) {
  const [copied, setCopied] = useState(false);
  const moment = useLazurMoment();
  const code = `<iframe src="https://${tool}.lazur.app/embed" title="${name} by Lazur" width="100%" height="620" style="border:0;border-radius:16px" allow="microphone; camera; fullscreen" loading="lazy"></iframe>`;
  async function copy() {
    if (await copyText(code)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
      moment({ label: "your embed code is copied", every: true, delay: 700 });
    }
    track("tool_embed_code_copied", { tool });
  }
  return (
    <div className="relative overflow-hidden rounded-[24px] border-[1.5px] border-[#1c1917] bg-[linear-gradient(160deg,#f1f6ff_0%,#f6f1ff_100%)] p-5 shadow-[0_3px_0_#1c1917] sm:p-7">
      <Sticker name="puzzle" size={56} rotate={-12} className="pointer-events-none absolute right-3 top-3 hidden sm:block" />
      <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-[#1c1917]/55">for your website</p>
      <p className="mt-1 text-[22px] font-bold leading-[1.15] tracking-[-0.02em] text-[#1c1917] sm:pr-16">Put this {name.toLowerCase()} on your site</p>
      <p className="mt-2 max-w-[32rem] text-[15px] leading-[1.55] text-[#3d3834]">Free for blogs, schools, help pages and streams. Paste this where you want it to show.</p>
      <div className="relative mt-4 rounded-[16px] bg-[#1c1917] p-4 pt-12">
        <button
          type="button"
          onClick={copy}
          className="absolute right-2.5 top-2.5 inline-flex min-h-[34px] items-center gap-1.5 rounded-full bg-white px-3.5 text-[13px] font-bold text-[#1c1917] transition hover:bg-[#f3f1ec]"
        >
          {copied ? <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden /> : <Copy className="h-3.5 w-3.5" aria-hidden />}
          {copied ? "Copied" : "Copy code"}
        </button>
        <span className="absolute left-4 top-4 flex gap-1.5" aria-hidden>
          <i className="h-2.5 w-2.5 rounded-full bg-[#ff6b6b]" />
          <i className="h-2.5 w-2.5 rounded-full bg-[#ffd84d]" />
          <i className="h-2.5 w-2.5 rounded-full bg-[#5bd17a]" />
        </span>
        <pre className="keep-case overflow-x-auto whitespace-pre-wrap break-all font-mono text-[12.5px] leading-[1.6] text-[#f5f1ea]">{code}</pre>
      </div>
    </div>
  );
}
