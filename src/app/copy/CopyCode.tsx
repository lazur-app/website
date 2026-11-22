"use client";

import { useEffect, useState } from "react";

/**
 * What the "Copy code" button in a code email opens. The code is after the # in the address, so
 * it stays in the browser and never reaches a server. It tries to copy straight away; browsers
 * that only allow copying after a click get the button.
 */
export function CopyCode() {
  const [code, setCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const copy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch {
      // Needs a click first in this browser: the button below does it.
    }
  };

  useEffect(() => {
    const value = decodeURIComponent(window.location.hash.slice(1)).replace(/[^0-9A-Za-z]/g, "").slice(0, 12);
    // Read once from the address after the page is up; there is nothing to subscribe to.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCode(value || null);
    if (value) void copy(value);
  }, []);

  if (code === null) {
    return <p className="text-[16px] text-[var(--foreground-muted)]">This link has no code in it. Open the email again and use the code shown there.</p>;
  }

  return (
    <>
      <p className="font-mono text-[44px] font-bold tracking-[0.25em] text-[var(--foreground)]">{code}</p>
      <button
        type="button"
        onClick={() => void copy(code)}
        className="mt-8 inline-flex min-h-[56px] items-center justify-center rounded-full border-[1.5px] border-[#1c1917] bg-white px-9 text-[18px] font-bold text-[#1c1917] shadow-[0_2px_0_rgba(28,25,23,0.9)] transition-transform hover:-translate-y-0.5"
      >
        {copied ? "Copied" : "Copy code"}
      </button>
      <p className="mt-5 text-[15px] text-[var(--foreground-muted)]">
        {copied ? "Now paste it into Lazur." : "Tap the button, then paste it into Lazur."}
      </p>
    </>
  );
}
