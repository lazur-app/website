"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Download } from "lucide-react";
import { Sticker } from "@/components/landing/Sticker";
import { rememberVisitorEmail, track } from "@/lib/productAnalytics";
import { inputClass } from "./ui";

/**
 * Every download on the free tools asks for an email first, once per device. The email goes to
 * the same signup as the AI tools (/api/free-tools/signup), so it also unlocks 3 more AI runs.
 * The device is remembered two ways: this subdomain's localStorage (instant) and the shared
 * lz_dev cookie, which the status endpoint answers for across every *.lazur.app tool.
 */
type Gate = (what: string, run: () => void) => void;

// With no provider (shouldn't happen) the download just runs, so it never breaks.
const Ctx = createContext<Gate>((_what, run) => run());

/** Wrap a download: `gate("recording", () => downloadBlob(...))`. */
export const useEmailGate = () => useContext(Ctx);

const KEY = "lz_email";
const readSaved = () => {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
};
const save = (email: string) => {
  try {
    localStorage.setItem(KEY, email);
  } catch {
    /* storage blocked: the cookie still remembers the device */
  }
};

export function EmailGateProvider({ tool, children }: { tool: string; children: ReactNode }) {
  const known = useRef<string | null>(null);
  const [ask, setAsk] = useState<null | { what: string; run: () => void }>(null);

  const gate = useCallback<Gate>(
    (what, run) => {
      known.current ??= readSaved();
      if (known.current) return run();
      // Someone who left an email on another tool is already known to the shared device cookie.
      fetch("/api/free-tools/status")
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null)
        .then((d: { email?: string | null } | null) => {
          if (d?.email) {
            known.current = d.email;
            save(d.email);
            run();
          } else {
            track("download_email_asked", { tool, what });
            setAsk({ what, run });
          }
        });
    },
    [tool],
  );

  return (
    <Ctx.Provider value={gate}>
      {children}
      {ask ? (
        <Ask
          tool={tool}
          what={ask.what}
          onClose={() => setAsk(null)}
          onDone={(email) => {
            known.current = email;
            save(email);
            const run = ask.run;
            setAsk(null);
            run();
          }}
        />
      ) : null}
    </Ctx.Provider>
  );
}

function Ask({ tool, what, onClose, onDone }: { tool: string; what: string; onClose: () => void; onDone: (email: string) => void }) {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", esc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", esc);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      const res = await fetch("/api/free-tools/signup", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email, tool }) });
      const d = (await res.json().catch(() => ({}))) as { ok?: boolean; message?: string };
      if (res.ok && d.ok) {
        const clean = email.trim().toLowerCase();
        rememberVisitorEmail(clean);
        track("download_email_given", { tool, what });
        onDone(clean);
      } else {
        track("download_email_failed", { tool, reason: (d.message ?? "").slice(0, 80) });
        setErr(d.message ?? "That didn't work. Check the email and try again.");
      }
    } catch {
      setErr("Couldn't reach the server. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[10000] overflow-y-auto bg-[#1c1917]/45 backdrop-blur-[3px]" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="flex min-h-full items-center justify-center p-4" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
        <form
          onSubmit={submit}
          role="dialog"
          aria-modal="true"
          aria-label={`Leave your email to download your ${what}`}
          className="keep-case relative w-full max-w-[440px] rounded-[28px] border-[1.5px] border-[#1c1917] bg-[linear-gradient(135deg,#fff6dc_0%,#fff1f4_100%)] px-6 pb-6 pt-6 shadow-[0_3px_0_rgba(28,25,23,0.9),0_30px_60px_-20px_rgba(28,25,23,0.5)] sm:px-8 sm:pb-7"
        >
          <Sticker name="heart" size={52} rotate={12} className="pointer-events-none absolute -right-3 -top-5 hidden sm:block" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-2 top-2 grid h-11 w-11 place-items-center rounded-full text-[#1c1917]/55 hover:bg-black/5 hover:text-[#1c1917] sm:right-3 sm:top-3"
          >
            <span aria-hidden className="text-[26px] leading-none">
              ×
            </span>
          </button>
          <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-[#1c1917]/55">one quick thing</p>
          <h2 className="mt-1 pr-8 text-[23px] font-bold leading-[1.12] tracking-[-0.03em] text-[#1c1917] sm:text-[26px]">Leave your email to download your {what}</h2>
          <p className="mt-2 text-[15px] leading-[1.55] text-[#3d3834]">It&apos;s free, and you only do this once. We&apos;ll only write about Lazur and new tools.</p>
          <input
            ref={inputRef}
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            autoComplete="email"
            inputMode="email"
            className={`${inputClass} mt-4`}
          />
          {err ? <p className="mt-2 text-[14px] text-[#8a1f1f]">{err}</p> : null}
          <button
            type="submit"
            disabled={busy || !email}
            className="mt-3 inline-flex min-h-[50px] w-full items-center justify-center gap-2 rounded-full bg-[#1c1917] px-6 text-[16px] font-bold text-white transition hover:bg-black disabled:opacity-50"
          >
            <Download className="h-4 w-4" aria-hidden />
            {busy ? "One second…" : `Download my ${what}`}
          </button>
        </form>
      </div>
    </div>
  );
}
