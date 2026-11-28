"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Sticker } from "@/components/landing/Sticker";
import { useIsWindowsVisitor } from "@/hooks/useIsWindowsVisitor";
import { rememberVisitorEmail, track } from "@/lib/productAnalytics";
import { SITE_URL } from "@/lib/seo/constants";
import { AI_TOOLS, type AiField } from "./ai-config";
import { useLazurMoment, useLazurNudge, useMomentWhen } from "./Letter";
import { useEmailGate } from "./EmailGate";
import { Btn, copyText, Field, inputClass, Notice, Panel } from "./ui";

/**
 * One template for every "put something in, get text out" AI tool. The fields come from
 * ai-config.ts. It posts to /api/free-tools/run, where the daily limit is enforced
 * (3 free runs a day, more after the visitor leaves an email).
 *
 * What the visitor sees: a loading state that says what is happening, the page moving to the
 * result when it arrives, and a result box whose Copy button copies exactly the answer (an
 * explanation such as "what changed" is shown apart, never copied). Tools that give several
 * options show each option as its own card with its own Copy. At the limit there is a short
 * sign-up card instead of a dead end.
 */
type Stage = "free" | "unlocked" | "pass";
type Status = { left: number | null; stage: Stage; email: string | null };
type Result = { text: string; notes?: string; options?: string[] };

export function AiTool({ tool }: { tool: string }) {
  const config = AI_TOOLS[tool];
  const nudge = useLazurNudge();
  const [values, setValues] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<Record<string, File | null>>({});
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const [limited, setLimited] = useState(false);
  const [status, setStatus] = useState<Status>({ left: null, stage: "free", email: null });
  const [passJustUnlocked, setPassJustUnlocked] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const anchor = useRef<HTMLDivElement>(null);

  // How many free runs are left today (hidden if the server doesn't say).
  useEffect(() => {
    fetch("/api/free-tools/status")
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { left?: number; stage?: Stage; email?: string | null } | null) => d && typeof d.left === "number" && setStatus({ left: d.left, stage: d.stage ?? "free", email: d.email ?? null }))
      .catch(() => {});
  }, []);

  // Bring the loading state, then the result, to the middle of the screen with one smooth scroll
  // (once per change, so it never fights the visitor's own scrolling). A result taller than the
  // screen lines up its top just under the navbar instead, so its start is never cut off.
  useEffect(() => {
    if (!(busy || result || error || limited)) return;
    const id = requestAnimationFrame(() => {
      const el = anchor.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const navbar = 112;
      const vh = window.innerHeight;
      if (r.top >= navbar && r.bottom <= vh - 16) return; // already fully on screen
      const room = vh - navbar;
      const target = r.height > room - 32 ? window.scrollY + r.top - navbar - 16 : window.scrollY + r.top + r.height / 2 - (navbar + vh) / 2;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: Math.max(0, target), behavior: reduce ? "auto" : "smooth" });
    });
    return () => cancelAnimationFrame(id);
  }, [busy, result, error, limited]);

  const copy = useCallback(
    async (key: string, text: string) => {
      const ok = await copyText(text);
      if (ok) {
        setCopiedKey(key);
        setTimeout(() => setCopiedKey((k) => (k === key ? null : k)), 1600);
      }
      nudge(ok, text);
    },
    [nudge],
  );

  const moment = useLazurMoment();
  const gate = useEmailGate();
  // Copying opens the note right away; someone who only reads the result gets it once, after a while.
  useMomentWhen(!!result && !busy, "your result is ready", 9000);
  if (!config) return null;

  const hasFile = config.fields.some((f) => f.kind === "file");
  const filled = (f: AiField) => (f.kind === "file" ? !!files[f.id] : f.kind === "select" ? false : !!values[f.id]?.trim());
  const inputs = config.fields.filter((f) => f.kind !== "select");
  // Every required field filled, and, when all fields are optional (photo OR description), at least one.
  const missing = inputs.some((f) => !f.optional && !filled(f)) || (inputs.every((f) => f.optional) && !inputs.some(filled));

  async function run() {
    const started = Date.now();
    const kinds = config.fields.filter((f) => (f.kind === "file" ? files[f.id] : f.kind !== "select" && values[f.id]?.trim())).map((f) => f.kind);
    track("tool_run_started", { tool, inputs: kinds.join(",") || "none" });
    setBusy(true);
    setError("");
    setResult(null);
    setLimited(false);
    try {
      const body = new FormData();
      body.set("tool", tool);
      for (const f of config.fields) {
        if (f.kind === "file") {
          const file = files[f.id];
          if (file) body.set(f.id, file);
        } else body.set(f.id, values[f.id] ?? (f.kind === "select" ? f.options?.[0] ?? "" : ""));
      }
      // If the AI is busy everywhere, wait a moment and try once more before showing anything.
      let res = await fetch("/api/free-tools/run", { method: "POST", body });
      if (res.status === 503) {
        await new Promise((r) => setTimeout(r, 2500));
        res = await fetch("/api/free-tools/run", { method: "POST", body });
      }
      const left = res.headers.get("x-free-uses-left");
      if (left !== null && !Number.isNaN(Number(left))) setStatus((s) => ({ ...s, left: Number(left) }));
      const data = (await res.json().catch(() => ({}))) as Partial<Result> & { message?: string; limit?: boolean; stage?: Stage; email?: string | null };
      if (res.status === 429 && data.limit) {
        track("tool_limit_hit", { tool, stage: data.stage ?? "free" });
        setStatus((s) => ({ left: 0, stage: data.stage ?? s.stage, email: data.email ?? s.email }));
        setLimited(true);
      } else if (!res.ok || !data.text) {
        track("tool_run_failed", { tool, status: res.status, reason: (data.message ?? "").slice(0, 80) });
        setError(data.message ?? "Something went wrong. Please try again.");
      } else {
        track("tool_run_succeeded", { tool, ms: Date.now() - started, options: data.options?.length ?? 0, has_notes: !!data.notes, chars: data.text.length });
        setResult({ text: data.text, notes: data.notes, options: data.options });
      }
    } catch {
      track("tool_run_failed", { tool, status: 0, reason: "network" });
      setError("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  const sample = (f: AiField) =>
    f.kind === "text" || f.kind === "textarea" || f.kind === "url" ? f.example ?? (f.placeholder && !/^(paste|e\.g\.)/i.test(f.placeholder) ? f.placeholder : undefined) : undefined;
  const hasExample = config.fields.some((f) => sample(f));
  const useExample = () => {
    track("tool_example_used", { tool });
    fillExample();
  };
  const fillExample = () =>
    setValues((s) => {
      const next = { ...s };
      for (const f of config.fields) {
        const ex = sample(f);
        if (ex && !next[f.id]) next[f.id] = ex;
      }
      return next;
    });

  const download = () => gate("spreadsheet", () => {
    const url = URL.createObjectURL(new Blob([result?.text ?? ""], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `${tool}.csv`;
    a.click();
    moment({ label: "your spreadsheet is downloading", every: true, delay: 500 });
    URL.revokeObjectURL(url);
  });

  return (
    <Panel>
      <div
        className="space-y-5"
        onKeyDown={(e) => {
          if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && !busy && !missing) void run();
        }}
      >
        {config.fields.map((f) => (
          <Field key={f.id} label={f.label} hint={f.kind === "file" ? undefined : f.hint}>
            <FieldInput
              f={f}
              value={values[f.id] ?? ""}
              onValue={(v) => setValues((s) => ({ ...s, [f.id]: v }))}
              file={files[f.id] ?? null}
              onFile={(file) => setFiles((s) => ({ ...s, [f.id]: file }))}
            />
          </Field>
        ))}

        <div>
          <Btn onClick={run} disabled={busy || missing} className="w-full py-4 text-[17px]" aria-busy={busy}>
            {busy ? (
              <>
                <Spinner /> Working…
              </>
            ) : (
              config.button
            )}
          </Btn>
          <div className="mt-3 flex flex-col items-center gap-1 text-[14px] text-[var(--foreground-muted)] sm:flex-row sm:justify-center sm:gap-4">
            {hasExample && !result ? (
              <button type="button" onClick={useExample} className="min-h-[44px] underline underline-offset-4 hover:text-[var(--foreground)]">
                Not sure? Try an example
              </button>
            ) : null}
            {status.stage === "pass" ? (
              <span>Your 20-day free pass is on</span>
            ) : status.left !== null ? (
              <span>{status.left > 0 ? `${status.left} free ${status.left === 1 ? "run" : "runs"} left today` : "You've used today's free runs"}</span>
            ) : null}
          </div>
        </div>

        <div ref={anchor} aria-live="polite">
          {busy ? <Loading hasFile={hasFile} hasUrl={config.fields.some((f) => f.kind === "url")} /> : null}
          {!busy && error ? <Notice tone="warn">{error}</Notice> : null}
          {!busy && passJustUnlocked && !limited ? <Notice>Done. This tool is yours free for the next 20 days. Thank you for the feedback.</Notice> : null}
          {!busy && limited && status.stage === "free" ? (
            <SignUp
              tool={tool}
              onDone={(left, email) => {
                setLimited(false);
                setStatus({ left, stage: "unlocked", email });
              }}
            />
          ) : null}
          {!busy && limited && status.stage === "unlocked" ? (
            <FeedbackPass
              tool={tool}
              email={status.email}
              onDone={(left) => {
                setLimited(false);
                setPassJustUnlocked(true);
                setStatus((s) => ({ ...s, left, stage: "pass" }));
              }}
            />
          ) : null}
          {!busy && limited && status.stage === "pass" ? <Notice>That&apos;s all for today. Your free runs come back tomorrow.</Notice> : null}
          {!busy && result ? (
            result.options ? (
              <OptionList options={result.options} copiedKey={copiedKey} onCopy={copy} />
            ) : (
              <div className="space-y-3">
                <ResultBox label={config.outputLabel ?? "Result"} text={result.text} copied={copiedKey === "main"} onCopy={() => copy("main", result.text)} onDownload={config.download ? download : undefined} />
                {result.notes ? <Notes label={config.notesLabel ?? "Notes"} text={result.notes} /> : null}
              </div>
            )
          ) : null}
        </div>
      </div>
    </Panel>
  );
}

function Spinner() {
  return <span aria-hidden className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />;
}

/** Shows that something is happening, and what, instead of a frozen button. */
function Loading({ hasFile, hasUrl }: { hasFile: boolean; hasUrl: boolean }) {
  const steps = hasUrl
    ? ["Opening the video…", "Watching it closely…", "Writing the result…", "Almost there. Longer videos take a little more time…"]
    : hasFile
      ? ["Uploading your file…", "Reading it carefully…", "Writing the result…", "Almost there. Long files take a little longer…"]
      : ["Reading what you wrote…", "Working on it…", "Polishing the result…", "Almost there…"];
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => Math.min(n + 1, steps.length - 1)), 3000);
    return () => clearInterval(t);
  }, [steps.length]);
  return (
    <div className="rounded-2xl border-[1.5px] border-[#1c1917]/15 bg-[var(--background-deep)] p-4" role="status">
      <p className="flex items-center gap-2 text-[15px] font-medium">
        <span aria-hidden className="h-2.5 w-2.5 animate-pulse rounded-full bg-[var(--brand)]" />
        {steps[i]}
      </p>
      <div className="mt-4 space-y-2.5" aria-hidden>
        <div className="h-3 w-full animate-pulse rounded-full bg-[#1c1917]/10" />
        <div className="h-3 w-[92%] animate-pulse rounded-full bg-[#1c1917]/10 [animation-delay:150ms]" />
        <div className="h-3 w-[78%] animate-pulse rounded-full bg-[#1c1917]/10 [animation-delay:300ms]" />
      </div>
    </div>
  );
}

/** Click anywhere on the text to copy it, unless the visitor is selecting some of it. */
function CopyArea({ text, onCopy }: { text: string; onCopy: () => void }) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Click to copy"
      title="Click to copy"
      onClick={() => {
        if (!window.getSelection()?.toString()) onCopy();
      }}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), onCopy())}
      className="cursor-copy whitespace-pre-wrap p-4 text-[16px] leading-[1.7] outline-none hover:bg-[#faf8f4] focus-visible:ring-4 focus-visible:ring-[#1c1917]/10"
    >
      {text}
    </div>
  );
}

/** The answer, with Copy inside the box. */
function ResultBox({ label, text, copied, onCopy, onDownload }: { label: string; text: string; copied: boolean; onCopy: () => void; onDownload?: () => void }) {
  return (
    <div className="overflow-hidden rounded-2xl border-[1.5px] border-[#1c1917] bg-white">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b-[1.5px] border-[#1c1917]/15 bg-[var(--background-deep)] px-4 py-2.5">
        <span className="text-[14px] font-bold">{label}</span>
        <span className="ml-auto flex gap-2">
          {onDownload ? (
            <Btn tone="ghost" className="min-h-[42px] !px-4 !py-2 !text-[14px]" onClick={onDownload}>
              Download
            </Btn>
          ) : null}
          <Btn tone="brand" className="min-h-[42px] !px-4 !py-2 !text-[14px]" onClick={onCopy}>
            {copied ? "✓ Copied" : "Copy"}
          </Btn>
        </span>
      </div>
      <CopyArea text={text} onCopy={onCopy} />
    </div>
  );
}

/** The explanation ("what changed", "how it works"). Shown, never copied. */
function Notes({ label, text }: { label: string; text: string }) {
  return (
    <div className="rounded-2xl border-[1.5px] border-dashed border-[#1c1917]/25 bg-[var(--background-deep)]/60 px-4 py-3">
      <p className="text-[13px] font-bold uppercase tracking-[0.08em] text-[var(--foreground-muted)]">{label}</p>
      <p className="mt-1.5 whitespace-pre-wrap text-[15px] leading-[1.65] text-[var(--foreground-muted)]">{text}</p>
    </div>
  );
}

/** Several options, each its own card with its own Copy. */
function OptionList({ options, copiedKey, onCopy }: { options: string[]; copiedKey: string | null; onCopy: (key: string, text: string) => void }) {
  return (
    <div className="space-y-3">
      <p className="text-[14px] font-bold">Pick the one you like</p>
      {options.map((text, i) => (
        <div key={i} className="overflow-hidden rounded-2xl border-[1.5px] border-[#1c1917] bg-white">
          <div className="flex items-center justify-between gap-2 border-b-[1.5px] border-[#1c1917]/15 bg-[var(--background-deep)] px-4 py-2">
            <span className="text-[13px] font-bold">Option {i + 1}</span>
            <Btn tone="brand" className="!px-4 !py-1.5 !text-[13px]" onClick={() => onCopy(`o${i}`, text)}>
              {copiedKey === `o${i}` ? "✓ Copied" : "Copy"}
            </Btn>
          </div>
          <CopyArea text={text} onCopy={() => onCopy(`o${i}`, text)} />
        </div>
      ))}
    </div>
  );
}

/** Shown at the daily limit: an email unlocks more runs today. */
function SignUp({ tool, onDone }: { tool: string; onDone: (left: number, email: string) => void }) {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      const res = await fetch("/api/free-tools/signup", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email, tool }) });
      const d = (await res.json().catch(() => ({}))) as { ok?: boolean; left?: number; message?: string };
      if (res.ok && d.ok) {
        const clean = email.trim().toLowerCase();
        rememberVisitorEmail(clean);
        track("tool_signup_completed", { tool });
        onDone(d.left ?? 3, clean);
      } else {
        track("tool_signup_failed", { tool, reason: (d.message ?? "").slice(0, 80) });
        setErr(d.message ?? "That didn't work. Check the email and try again.");
      }
    } catch {
      setErr("Couldn't reach the server. Try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <form onSubmit={submit} className="relative rounded-[24px] border-[1.5px] border-[#1c1917] bg-[linear-gradient(135deg,#fff6dc_0%,#fff1f4_100%)] p-5 pr-16 shadow-[0_3px_0_#1c1917] sm:p-6 sm:pr-24">
      <Sticker name="heart" size={56} rotate={10} className="absolute right-3 top-3" />
      <h3 className="text-[20px] font-bold tracking-[-0.02em]">That&apos;s your 3 free runs for today</h3>
      <p className="mt-1 text-[15px] leading-[1.55] text-[var(--foreground-muted)]">Leave your email and we&apos;ll immediately unlock 3 more runs today. We&apos;ll only write about Lazur and new tools.</p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" autoComplete="email" className={`${inputClass} sm:flex-1`} />
        <Btn type="submit" disabled={busy || !email} className="sm:shrink-0">
          {busy ? "Unlocking…" : "Unlock 3 more"}
        </Btn>
      </div>
      {err ? <p className="mt-2 text-[14px] text-[#8a1f1f]">{err}</p> : null}
    </form>
  );
}

/**
 * After the extra runs: download Lazur, send feedback from the app (signed in with the same email),
 * come back and unlock the tool free for 20 days. The daily cap during the pass is in the terms only.
 * Windows has no app yet, so Windows visitors get the waitlist instead.
 */
function FeedbackPass({ tool, email, onDone }: { tool: string; email: string | null; onDone: (left: number) => void }) {
  const windows = useIsWindowsVisitor();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const download = `${SITE_URL}/download?src=tool-${tool}-pass`;
  useEffect(() => {
    track("tool_pass_card_shown", { tool, platform: windows ? "windows" : "mac" });
  }, [tool, windows]);
  async function claim() {
    track("tool_pass_claim_clicked", { tool });
    setBusy(true);
    setMsg("");
    try {
      const res = await fetch("/api/free-tools/claim", { method: "POST" });
      const d = (await res.json().catch(() => ({}))) as { ok?: boolean; left?: number; message?: string };
      if (res.ok && d.ok) {
        track("tool_pass_claimed", { tool });
        onDone(d.left ?? 1);
      } else {
        track("tool_pass_claim_refused", { tool, reason: (d.message ?? "").slice(0, 80) });
        setMsg(d.message ?? "That didn't work. Try again in a minute.");
      }
    } catch {
      setMsg("Couldn't reach the server. Try again.");
    } finally {
      setBusy(false);
    }
  }
  if (windows) {
    return (
      <div className="relative rounded-[24px] border-[1.5px] border-[#1c1917] bg-[linear-gradient(135deg,#fff6dc_0%,#fff1f4_100%)] p-5 pr-16 shadow-[0_3px_0_#1c1917] sm:p-6 sm:pr-24">
        <Sticker name="star" size={56} rotate={-10} className="absolute right-3 top-3" />
        <h3 className="text-[20px] font-bold tracking-[-0.02em]">That&apos;s all the free runs for today</h3>
        <p className="mt-1 text-[15px] leading-[1.55] text-[var(--foreground-muted)]">Lazur for Windows is still being built. Join the waitlist and we&apos;ll tell you the day it&apos;s ready. Your free runs come back tomorrow.</p>
        <a href={download} target="_blank" rel="noopener" onClick={() => track("tool_pass_waitlist_clicked", { tool })} className="mt-4 inline-flex min-h-[48px] items-center rounded-full bg-[#1c1917] px-6 text-[15px] font-bold text-white hover:bg-black">
          Join the Windows waitlist
        </a>
      </div>
    );
  }
  return (
    <div className="relative rounded-[24px] border-[1.5px] border-[#1c1917] bg-[linear-gradient(135deg,#fff6dc_0%,#fff1f4_100%)] p-5 pr-16 shadow-[0_3px_0_#1c1917] sm:p-6 sm:pr-24">
      <Sticker name="star" size={56} rotate={-10} className="absolute right-3 top-3" />
      <h3 className="text-[20px] font-bold tracking-[-0.02em]">Want this tool free for 20 days?</h3>
      <p className="mt-1 text-[15px] leading-[1.55] text-[var(--foreground-muted)]">Download Lazur, send us a little feedback from inside the app, and this tool is yours free for 20 days.</p>
      <ol className="mt-4 space-y-2 text-[15px] leading-[1.5]">
        <li className="flex gap-2">
          <span className="font-bold">1.</span>
          <span>Download Lazur and open it.</span>
        </li>
        <li className="flex gap-2">
          <span className="font-bold">2.</span>
          <span>
            Sign in{" "}
            {email ? (
              <>
                with <b className="break-all">{email}</b>
              </>
            ) : (
              "with the email you gave us"
            )}{" "}
            and send us feedback from the app.
          </span>
        </li>
        <li className="flex gap-2">
          <span className="font-bold">3.</span>
          <span>Come back here and press the button below.</span>
        </li>
      </ol>
      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <a href={download} target="_blank" rel="noopener" onClick={() => track("tool_pass_download_clicked", { tool })} className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-[#1c1917] px-6 text-[15px] font-bold text-white hover:bg-black">
          Download Lazur
        </a>
        <Btn tone="ghost" onClick={claim} disabled={busy} className="min-h-[48px]">
          {busy ? "Checking…" : "I've sent feedback, unlock it"}
        </Btn>
      </div>
      {msg ? <p className="mt-3 text-[14px] text-[#8a1f1f]">{msg}</p> : null}
      <p className="mt-3 text-[12px] text-[var(--foreground-faint)]">
        <a href={`${SITE_URL}/terms#free-tools`} target="_blank" rel="noopener" className="underline underline-offset-2">
          Terms apply
        </a>
      </p>
    </div>
  );
}

function FieldInput({ f, value, onValue, file, onFile }: { f: AiField; value: string; onValue: (v: string) => void; file: File | null; onFile: (f: File | null) => void }) {
  if (f.kind === "textarea") return <textarea className={inputClass} rows={f.rows ?? 5} placeholder={f.placeholder} value={value} onChange={(e) => onValue(e.target.value)} />;
  if (f.kind === "select")
    return (
      <select className={inputClass} value={value || f.options?.[0]} onChange={(e) => onValue(e.target.value)}>
        {f.options?.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    );
  if (f.kind === "file") return <DropZone f={f} file={file} onFile={onFile} />;
  return <input className={inputClass} type={f.kind === "url" ? "url" : "text"} placeholder={f.placeholder} value={value} onChange={(e) => onValue(e.target.value)} />;
}

function DropZone({ f, file, onFile }: { f: AiField; file: File | null; onFile: (f: File | null) => void }) {
  const [over, setOver] = useState(false);
  const accept = f.accept ?? "";
  const sticker = accept.includes("audio") ? "mic" : accept.includes("pdf") ? "doc" : "camera";
  return (
    <label
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        onFile(e.dataTransfer.files?.[0] ?? null);
      }}
      className={`flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed px-4 py-9 text-center transition ${over ? "border-[#1c1917] bg-[#f3f1ec]" : "border-[#1c1917]/25 bg-white hover:bg-[#faf8f4]"}`}
    >
      <Sticker name={file ? "check" : sticker} size={56} rotate={file ? 0 : -8} />
      <span className="break-all text-[17px] font-bold tracking-[-0.01em]">{file ? file.name : "Drop a file here, or tap to choose"}</span>
      <span className="text-[13px] text-[var(--foreground-muted)]">{file ? `${(file.size / 1024 / 1024).toFixed(1)} MB. Tap to change it.` : f.hint ?? "Up to 15 MB"}</span>
      <input type="file" accept={f.accept} className="sr-only" onChange={(e) => onFile(e.target.files?.[0] ?? null)} />
    </label>
  );
}
