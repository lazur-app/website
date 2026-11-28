"use client";

import { useState } from "react";
import { track } from "@/lib/productAnalytics";
import { copyText } from "./ui";


/** "Put this tool on your site": the iframe code, ready to copy. */
export function EmbedCode({ tool, name }: { tool: string; name: string }) {
  const [copied, setCopied] = useState(false);
  const code = `<iframe src="https://${tool}.lazur.app/embed" title="${name} by Lazur" width="100%" height="620" style="border:0;border-radius:16px" allow="microphone; camera; fullscreen" loading="lazy"></iframe>`;
  return (
    <div className="rounded-2xl border-[1.5px] border-[#1c1917]/15 bg-white p-5">
      <p className="text-[17px] font-bold tracking-[-0.01em]">Put this {name.toLowerCase()} on your site</p>
      <p className="mt-1 text-[15px] text-[var(--foreground-muted)]">Free for blogs, schools, help pages and streams. Paste this where you want it to show.</p>
      <pre className="keep-case mt-3 overflow-x-auto whitespace-pre-wrap break-all rounded-xl bg-[var(--background-deep)] p-3 text-[13px] leading-[1.5]">{code}</pre>
      <button
        type="button"
        onClick={async () => {
          if (await copyText(code)) {
            setCopied(true);
            setTimeout(() => setCopied(false), 1600);
          }
          track("tool_embed_code_copied", { tool });
        }}
        className="mt-3 inline-flex min-h-[44px] items-center rounded-full bg-[#1c1917] px-5 text-[14px] font-bold text-white hover:bg-black"
      >
        {copied ? "✓ Copied" : "Copy embed code"}
      </button>
    </div>
  );
}
