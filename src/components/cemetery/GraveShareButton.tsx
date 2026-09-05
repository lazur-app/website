"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cemeteryUrl } from "@/lib/cemetery";

export function GraveShareButton({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    const url = cemeteryUrl(slug, window.location.origin);
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="btn-dark inline-flex flex-1 items-center justify-center gap-1.5 px-5 py-3 text-[14px]"
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
