"use client";

import { FormEvent, useEffect, useId, useRef, useState } from "react";
import { Check, Copy, Mail } from "lucide-react";
import { submitExclusiveAccessRequest } from "@/lib/exclusiveAccess";
import { track } from "@/lib/productAnalytics";

export const MAC_DOWNLOAD_PAGE_URL = "https://www.lazur.app/download";

const MAILTO_HREF = `mailto:?subject=${encodeURIComponent("Lazur for Mac")}&body=${encodeURIComponent(
  `Download Lazur on your Mac: ${MAC_DOWNLOAD_PAGE_URL}`,
)}`;

type Variant = "card" | "inline" | "bar";

async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through to the textarea fallback
  }
  try {
    const el = document.createElement("textarea");
    el.value = text;
    el.setAttribute("readonly", "");
    el.style.position = "fixed";
    el.style.opacity = "0";
    document.body.appendChild(el);
    el.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(el);
    return ok;
  } catch {
    return false;
  }
}

/** Quiet "Copy link · Send it to myself" row: works without giving us an email. */
function SecondaryActions({ location, variant, mailtoLabel }: { location: string; variant: Variant; mailtoLabel: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const onCopy = async () => {
    track("copy_clicked", { what: "download_link", location });
    const ok = await copyText(MAC_DOWNLOAD_PAGE_URL);
    if (!ok) return;
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2000);
  };

  const linkClass =
    "inline-flex min-h-[44px] items-center gap-1.5 rounded-full px-2 text-[13px] font-medium text-[var(--foreground-muted)] underline decoration-[var(--foreground)]/20 underline-offset-2 transition-colors hover:text-[var(--foreground)]";

  return (
    <div
      className={`flex flex-wrap items-center gap-x-3 gap-y-0 ${variant === "card" ? "justify-center" : "justify-start"}`}
    >
      <button type="button" onClick={onCopy} className={linkClass} aria-live="polite">
        {copied ? <Check className="h-3.5 w-3.5" strokeWidth={2.25} /> : <Copy className="h-3.5 w-3.5" />}
        {copied ? "Copied" : "Copy link"}
      </button>
      <a
        href={MAILTO_HREF}
        onClick={() => track("send_mac_link_mailto_clicked", { location })}
        className={linkClass}
      >
        <Mail className="h-3.5 w-3.5" />
        {mailtoLabel}
      </a>
    </div>
  );
}

/**
 * For visitors who aren't on a Mac (phone, Windows, Linux): one email field that sends them the
 * Mac download link, plus "Copy link" and a mailto fallback for people who won't give an email.
 * The email address is only sent to our backend, never to analytics.
 */
export function SendMacLink({ location, variant = "card" }: { location: string; variant?: "card" | "inline" | "bar" }) {
  const inputId = useId();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;
    setError(null);
    setSubmitting(true);
    try {
      const result = await submitExclusiveAccessRequest(email.trim(), {
        platform: "mac",
        source: `send_mac_link:${location}`,
      });
      track("send_mac_link_submitted", { location, status: result.status });
      setDone(true);
    } catch (err) {
      track("send_mac_link_failed", { location });
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const compact = variant !== "card";

  if (done) {
    return (
      <div
        className={compact ? "flex flex-col gap-1 text-left" : "mx-auto w-full max-w-sm text-center"}
        role="status"
      >
        <div className={`flex items-center gap-2.5 ${compact ? "" : "flex-col"}`}>
          <span
            className={`grid shrink-0 place-items-center rounded-full bg-[var(--foreground)] text-[var(--background)] ${
              compact ? "h-7 w-7" : "mb-1 h-12 w-12"
            }`}
          >
            <Check className={compact ? "h-3.5 w-3.5" : "h-5 w-5"} strokeWidth={2.25} />
          </span>
          <p
            className={
              compact
                ? "text-[14px] font-semibold text-[var(--foreground)]"
                : "font-display text-xl font-semibold tracking-tight text-[var(--foreground)]"
            }
          >
            Saved. Want it on your Mac right now? Send it to yourself or copy the link.
          </p>
        </div>
        <div className={compact ? "" : "mt-3"}>
          <SecondaryActions location={location} variant={variant} mailtoLabel="Send it to myself" />
        </div>
      </div>
    );
  }

  const inputClass =
    "w-full min-h-[52px] rounded-[6px] border border-[var(--border-strong)] bg-white px-5 text-[16px] text-[#1c1917] placeholder:text-[#a8a29e] outline-none transition-shadow focus:ring-2 focus:ring-[var(--brand)]/25 sm:text-[15px]";
  const buttonClass =
    "inline-flex min-h-[52px] w-full shrink-0 items-center justify-center whitespace-nowrap rounded-[6px] border-[1.5px] border-[#2a1c6b] bg-[#e7dfff] px-6 text-[15px] font-semibold text-[#1c1917] transition-colors hover:bg-[#dccfff] disabled:opacity-60";

  if (variant === "bar") {
    return (
      <div className="w-full">
        <form onSubmit={onSubmit} className="flex w-full flex-col gap-2 sm:flex-row sm:items-center">
          <label htmlFor={inputId} className="sr-only">
            Your email
          </label>
          <input
            id={inputId}
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            autoCapitalize="none"
            spellCheck={false}
            enterKeyHint="send"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            className={`${inputClass} sm:flex-1`}
          />
          <button type="submit" disabled={submitting} className={`${buttonClass} sm:w-auto`}>
            {submitting ? "Sending…" : "Email me the Mac link"}
          </button>
        </form>
        {error ? <p className="mt-1.5 text-[13px] text-red-600">{error}</p> : null}
      </div>
    );
  }

  return (
    <div className={compact ? "w-full max-w-md text-left" : "mx-auto w-full max-w-sm text-left"}>
      <form onSubmit={onSubmit} className={`flex w-full flex-col gap-2.5 ${compact ? "sm:flex-row sm:items-center" : ""}`}>
        <label htmlFor={inputId} className="sr-only">
          Your email
        </label>
        <input
          id={inputId}
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          autoCapitalize="none"
          spellCheck={false}
          enterKeyHint="send"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          className={`${inputClass} ${compact ? "sm:flex-1" : ""}`}
        />
        <button type="submit" disabled={submitting} className={`${buttonClass} ${compact ? "sm:w-auto" : ""}`}>
          {submitting ? "Sending…" : "Email me the Mac link"}
        </button>
      </form>
      {error ? <p className="mt-2 text-[13px] text-red-600">{error}</p> : null}
      <div className={compact ? "mt-1" : "mt-2"}>
        <SecondaryActions location={location} variant={variant} mailtoLabel="Send it to myself" />
      </div>
    </div>
  );
}

export default SendMacLink;
