"use client";

import { useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { copyGuard, useLazurNudge } from "./Letter";

/**
 * Shared pieces for every free-tool widget, so all 49 look like one product (Lazur's warm
 * off-white, purple brand, rounded corners). Colours come from the CSS variables in globals.css.
 */

export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`mx-auto w-full max-w-[720px] keep-case rounded-[28px] border-[1.5px] border-[#1c1917] bg-white p-5 shadow-[0_2px_0_rgba(28,25,23,0.9),0_18px_40px_-16px_rgba(28,25,23,0.22)] sm:p-8 ${className}`}>
      {children}
    </div>
  );
}

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & { tone?: "brand" | "dark" | "ghost" | "danger" };

export function Btn({ tone = "brand", className = "", ...rest }: BtnProps) {
  const tones = {
    brand: "bg-[#1c1917] text-white hover:bg-black",
    dark: "bg-[#1c1917] text-white hover:bg-black",
    ghost: "border-[1.5px] border-[#1c1917] bg-white text-[var(--foreground)] hover:bg-[#f3f1ec]",
    danger: "bg-[#d94040] text-white hover:opacity-90",
  };
  return (
    <button
      type="button"
      {...rest}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-[15px] font-bold tracking-[-0.01em] transition disabled:cursor-not-allowed disabled:opacity-50 ${tones[tone]} ${className}`}
    />
  );
}

/** Copies text. Uses the clipboard API, then an old-fashioned fallback (some browsers and in-app views block the API). */
export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const el = document.createElement("textarea");
      el.value = text;
      el.setAttribute("readonly", "");
      el.style.cssText = "position:fixed;top:0;left:0;opacity:0";
      document.body.appendChild(el);
      el.select();
      // The old copy command fires a "copy" event; tell the hand-copy listener it's ours.
      copyGuard.on = true;
      const ok = document.execCommand("copy");
      copyGuard.on = false;
      el.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

export function CopyBtn({ text, label = "Copy" }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  const nudge = useLazurNudge();
  return (
    <Btn
      tone="ghost"
      disabled={!text}
      onClick={async () => {
        const ok = await copyText(text);
        if (ok) {
          setDone(true);
          setTimeout(() => setDone(false), 1500);
        }
        nudge(ok, text);
      }}
    >
      {done ? "✓ Copied" : label}
    </Btn>
  );
}

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[14px] font-medium text-[var(--foreground)]">{label}</span>
      {children}
      {hint ? <span className="mt-1 block text-[13px] text-[var(--foreground-muted)]">{hint}</span> : null}
    </label>
  );
}

export const inputClass =
  "w-full keep-case rounded-2xl border-[1.5px] border-[#1c1917]/25 bg-white px-4 py-3 text-[16px] text-[var(--foreground)] outline-none transition placeholder:text-[var(--foreground-faint)] focus:border-[#1c1917] focus:ring-4 focus:ring-[#1c1917]/10";

export function Stat({ label, value, sub }: { label: string; value: ReactNode; sub?: string }) {
  return (
    <div className="rounded-2xl bg-[var(--background-deep)] px-4 py-3 text-center">
      <div className="text-[28px] font-semibold leading-none tabular-nums">{value}</div>
      <div className="mt-1 text-[13px] text-[var(--foreground-muted)]">{label}</div>
      {sub ? <div className="text-[12px] text-[var(--foreground-faint)]">{sub}</div> : null}
    </div>
  );
}

export function Notice({ children, tone = "info" }: { children: ReactNode; tone?: "info" | "warn" }) {
  return (
    <p
      role={tone === "warn" ? "alert" : undefined}
      className={`rounded-2xl px-4 py-3 text-[15px] leading-[1.55] ${tone === "warn" ? "bg-[#fdecec] text-[#8a1f1f]" : "bg-[var(--brand-soft)] text-[var(--brand-ink)]"}`}
    >
      {children}
    </p>
  );
}

/** Message used by every widget when the browser doesn't support what it needs. */
export function Unsupported({ what }: { what: string }) {
  return <Notice tone="warn">{what} isn&apos;t supported in this browser. Try Chrome, Edge or Safari on a computer.</Notice>;
}
