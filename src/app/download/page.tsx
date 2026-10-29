"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Download, Monitor } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MarketingPageShell } from "@/components/MarketingPageShell";
import { AppleIcon } from "@/components/icons/AppleIcon";
import {
  MAC_DOWNLOAD_URL,
  hasIntelMacBuild,
  hasWindowsBuild,
  resolveMacDownloadUrl,
  triggerFileDownload,
  triggerWindowsDownload,
} from "@/lib/download";
import { submitExclusiveAccessRequest } from "@/lib/exclusiveAccess";
import { track } from "@/lib/productAnalytics";
import { INSTALL_STEPS, InstallDemo, useInstallStep } from "@/components/download/InstallDemo";
import {
  detectMacChip,
  detectPlatform,
  type MacChip,
  type Platform,
} from "@/lib/platform";

const SAVE_AS = "Lazur.dmg";

function MacMark() {
  return (
    <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--foreground)] text-[var(--background)]">
      <AppleIcon className="h-6 w-6" />
    </div>
  );
}

function WindowsWaitlist() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await submitExclusiveAccessRequest(email, {
        platform: "windows",
        source: "download-page",
      });
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="mx-auto mt-8 max-w-sm text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--foreground)] text-[var(--background)]">
          <Check className="h-5 w-5" strokeWidth={2.25} />
        </div>
        <p className="font-display text-xl font-semibold tracking-tight">
          You&apos;re on the list.
        </p>
        <p className="mt-2 text-[15px] leading-relaxed text-[var(--foreground-muted)]">
          We&apos;ll email you the moment Lazur is ready for Windows.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto mt-8 w-full max-w-sm text-left">
      <label
        htmlFor="windows-waitlist-email"
        className="mb-2 block text-[12px] font-medium text-[var(--foreground-muted)]"
      >
        Email
      </label>
      <input
        id="windows-waitlist-email"
        type="email"
        required
        autoComplete="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="you@company.com"
        className="w-full rounded-full border border-[var(--border)] bg-white px-4 py-3 text-[14px] text-[var(--foreground)] outline-none transition-shadow focus:ring-2 focus:ring-[var(--brand)]/25"
      />
      {error ? (
        <p className="mt-2 text-[13px] text-red-600">{error}</p>
      ) : null}
      <button
        type="submit"
        disabled={submitting}
        className="btn-dark mt-3 flex w-full min-h-[48px] items-center justify-center rounded-full text-[14px] font-semibold disabled:opacity-60"
      >
        {submitting ? "Saving…" : "Notify me for Windows"}
      </button>
    </form>
  );
}

/** A small burst of blue sparkles around the check mark, once, when the page opens. */
function SparkleBurst() {
  const rays = Array.from({ length: 10 }, (_, i) => {
    const angle = (i / 10) * Math.PI * 2 + 0.3;
    const dist = 58 + (i % 3) * 14;
    return { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist, size: 9 + (i % 3) * 4, delay: 0.35 + (i % 4) * 0.05 };
  });
  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2" aria-hidden>
      {rays.map((r, i) => (
        <motion.svg
          key={i}
          viewBox="0 0 24 24"
          width={r.size}
          height={r.size}
          className="absolute -ml-1.5 -mt-1.5"
          initial={{ x: 0, y: 0, opacity: 0, scale: 0.4 }}
          animate={{ x: r.x, y: r.y, opacity: [0, 1, 0], scale: 1 }}
          transition={{ duration: 1.4, delay: r.delay, ease: [0.16, 1, 0.3, 1] }}
        >
          <path d="M12 1.5 C12.6 7.4 16.6 11.4 22.5 12 C16.6 12.6 12.6 16.6 12 22.5 C11.4 16.6 7.4 12.6 1.5 12 C7.4 11.4 11.4 7.4 12 1.5 Z" fill="#2563eb" />
        </motion.svg>
      ))}
    </div>
  );
}

/** The Mac download: a small celebration, where the file went, and the install acted out. */
function MacWelcome({ chip, started, available, onAgain, onSwitch }: {
  chip: MacChip | null;
  started: boolean;
  available: boolean;
  onAgain: () => void;
  onSwitch: (chip: MacChip) => void;
}) {
  const step = useInstallStep();
  return (
    <>
      <div className="relative mx-auto mb-7 h-16 w-16">
        {started ? <SparkleBurst /> : null}
        {started ? (
          <motion.span
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.1, duration: 0.4 }}
            className="pointer-events-none absolute left-[calc(100%+1.25rem)] top-1 hidden whitespace-nowrap font-[family-name:var(--font-caveat)] text-[1.6rem] leading-none text-[#2563eb] sm:block"
            aria-hidden
          >
            <svg viewBox="0 0 40 24" className="absolute -left-10 top-2 h-6 w-10 overflow-visible" aria-hidden>
              <motion.path d="M38 6 C26 2 12 6 4 16 M4 16 L5 7 M4 16 L13 15" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.2, duration: 0.5 }} />
            </svg>
            your first step
          </motion.span>
        ) : null}
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="grid h-16 w-16 place-items-center rounded-full bg-[var(--foreground)] text-white shadow-[0_14px_30px_rgba(28,25,23,0.25)]"
        >
          <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden>
            <motion.path
              d="M5 12.5 L10 17.5 L19 7"
              fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.3, duration: 0.5, ease: [0.65, 0, 0.35, 1] }}
            />
          </svg>
        </motion.div>
      </div>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="font-display text-[2rem] font-semibold tracking-[-0.03em] md:text-[2.75rem]"
      >
        {started ? "You just got a buddy." : available ? "Lazur for Mac" : "Almost there"}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.5 }}
        className="mx-auto mt-3 max-w-md text-[16px] leading-relaxed text-[var(--foreground)]/70"
      >
        {started
          ? "It's on its way to your Downloads folder. Three quick steps and I'm in your notch."
          : available
            ? "Ready when you are."
            : "The Mac installer isn't available just yet. Try again in a bit."}
      </motion.p>

      {started ? (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="mx-auto mt-6 flex max-w-xs items-center gap-3 rounded-2xl border border-black/[0.06] bg-white/70 px-4 py-3 text-left"
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#1c1917] text-white"><AppleIcon className="h-4 w-4" /></span>
          <div className="min-w-0 flex-1">
            <p className="text-[13.5px] font-semibold text-[var(--foreground)]">Lazur.dmg</p>
            <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-black/[0.06]">
              <motion.div
                className="h-full rounded-full bg-[#2563eb]"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.7, duration: 2.2, ease: [0.4, 0, 0.2, 1] }}
              />
            </div>
          </div>
          <span className="text-[11.5px] text-[var(--foreground-faint)]">{chip === "intel" ? "Intel" : "Apple silicon"}</span>
        </motion.div>
      ) : null}

      {/* The install, acted out */}
      <div className="mt-10 grid items-center gap-8 text-left md:grid-cols-[1fr_1.35fr]">
        <ol className="space-y-2">
          {INSTALL_STEPS.map((s, i) => {
            const on = i === step;
            return (
              <li
                key={s.title}
                className={`flex gap-3 rounded-2xl px-4 py-3 transition-colors duration-300 ${on ? "bg-white shadow-[var(--shadow-card)]" : ""}`}
              >
                <span className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-[12px] font-semibold transition-colors duration-300 ${on ? "bg-[#2563eb] text-white" : "bg-black/[0.06] text-[var(--foreground-muted)]"}`}>
                  {i + 1}
                </span>
                <span>
                  <span className={`block text-[15px] font-semibold transition-colors duration-300 ${on ? "text-[var(--foreground)]" : "text-[var(--foreground)]/55"}`}>{s.title}</span>
                  <span className="block text-[13px] text-[var(--foreground-faint)]">{s.detail}</span>
                </span>
              </li>
            );
          })}
        </ol>
        <InstallDemo step={step} />
      </div>

      <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link
          href="/login/app"
          className="btn-dark inline-flex min-h-[48px] w-full items-center justify-center rounded-full px-6 text-[14px] font-semibold sm:w-auto"
        >
          Already installed? Sign in
        </Link>
        <button
          type="button"
          onClick={onAgain}
          className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full border border-[var(--border-strong)] bg-white/70 px-6 text-[14px] font-semibold text-[var(--foreground)] transition-colors hover:border-[var(--foreground)]/30 sm:w-auto"
        >
          <Download className="h-4 w-4" />
          Download again
        </button>
      </div>

      <p className="mt-6 text-[13px] text-[var(--foreground-faint)]">
        Your 3 days of Pro start when you first open the app. No card needed.
      </p>

      {hasIntelMacBuild() ? (
        <p className="mt-3 text-[13px] text-[var(--foreground-faint)]">
          {chip === "intel" ? "On Apple silicon? " : "On an Intel Mac? "}
          <button
            type="button"
            onClick={() => onSwitch(chip === "intel" ? "apple-silicon" : "intel")}
            className="font-medium text-[var(--foreground-muted)] underline decoration-[var(--foreground)]/20 underline-offset-2 hover:text-[var(--foreground)]"
          >
            {chip === "intel" ? "Get the Apple silicon version" : "Get the Intel version"}
          </button>
        </p>
      ) : null}
    </>
  );
}

export default function DownloadPage() {
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [chip, setChip] = useState<MacChip | null>(null);
  const [started, setStarted] = useState(false);

  // Every Mac download goes through here: it starts by itself when the page opens, and again
  // if they pick the other chip. Counted in PostHog and GA (download_mac, a key event).
  const startMacDownload = useCallback(async (nextChip: MacChip, how: "auto" | "switch" | "again") => {
    const url = await resolveMacDownloadUrl(nextChip);
    if (!url) return;
    track("download_clicked", { platform: "mac", chip: nextChip, how });
    setStarted(triggerFileDownload(url, SAVE_AS));
  }, []);

  useEffect(() => {
    const detected = detectPlatform();
    setPlatform(detected);

    if (detected !== "mac") return;

    void (async () => {
      const nextChip = await detectMacChip();
      setChip(nextChip);
      await startMacDownload(nextChip, "auto");
    })();
  }, [startMacDownload]);

  useEffect(() => {
    if (platform === "windows" && hasWindowsBuild()) {
      setStarted(triggerWindowsDownload());
    }
  }, [platform]);

  const switchChip = (nextChip: MacChip) => {
    setChip(nextChip);
    void startMacDownload(nextChip, "switch");
  };

  return (
    <MarketingPageShell>
      <Navbar />
      <main className="relative px-4 pb-20 pt-28 sm:px-6 md:pt-32">
        <div className="landing-container">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className={`aura-stage mx-auto px-5 py-12 text-center sm:px-10 sm:py-14 ${platform === "mac" && chip ? "max-w-4xl" : "max-w-xl"}`}
          >
            {platform === null || (platform === "mac" && chip === null) ? (
              <>
                <MacMark />
                <h1 className="font-display text-[1.85rem] font-semibold tracking-tight md:text-[2.25rem]">
                  Finding the right installer
                  <span className="italic font-medium"> for you.</span>
                </h1>
                <p className="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-[var(--foreground)]/65">
                  Hang on, this only takes a second.
                </p>
              </>
            ) : platform === "mac" ? (
              <MacWelcome
                chip={chip}
                started={started}
                available={Boolean(MAC_DOWNLOAD_URL)}
                onAgain={() => chip && void startMacDownload(chip, "again")}
                onSwitch={switchChip}
              />
            ) : platform === "windows" && hasWindowsBuild() ? (
              <>
                <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--foreground)] text-[var(--background)]">
                  <Monitor className="h-6 w-6" strokeWidth={1.75} />
                </div>
                <h1 className="font-display text-[1.85rem] font-semibold tracking-tight md:text-[2.35rem]">
                  {started ? "It's on its way." : "Lazur for Windows"}
                </h1>
                <p className="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-[var(--foreground)]/70">
                  Check your Downloads folder, then run the installer.
                </p>
                <button
                  type="button"
                  onClick={() => setStarted(triggerWindowsDownload())}
                  className="btn-dark mt-8 inline-flex min-h-[48px] items-center justify-center gap-2 px-7 text-[14px]"
                >
                  <Download className="h-4 w-4" />
                  Download again
                </button>
              </>
            ) : platform === "windows" ? (
              <>
                <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--foreground)] text-[var(--background)]">
                  <Monitor className="h-6 w-6" strokeWidth={1.75} />
                </div>
                <h1 className="font-display text-[1.85rem] font-semibold tracking-tight md:text-[2.35rem]">
                  Windows is next.
                </h1>
                <p className="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-[var(--foreground)]/70">
                  Lazur is a Mac app today. Leave your email and we&apos;ll send
                  the Windows build the moment it&apos;s ready.
                </p>
                <WindowsWaitlist />
                <p className="mt-6 text-[13px] text-[var(--foreground-faint)]">
                  Have a Mac?{" "}
                  <Link
                    href="/"
                    className="font-medium text-[var(--foreground-muted)] underline decoration-[var(--foreground)]/20 underline-offset-2 hover:text-[var(--foreground)]"
                  >
                    Go back home
                  </Link>
                  , then open this page from your Mac.
                </p>
              </>
            ) : platform === "ios" ? (
              <>
                <MacMark />
                <h1 className="font-display text-[1.85rem] font-semibold tracking-tight md:text-[2.35rem]">
                  Lazur lives on the Mac.
                </h1>
                <p className="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-[var(--foreground)]/70">
                  Open this page from your Mac to download. We&apos;ll pick the
                  right installer for you.
                </p>
                <Link
                  href="/"
                  className="btn-dark mt-8 inline-flex min-h-[48px] items-center justify-center px-7 text-[14px]"
                >
                  Back to home
                </Link>
              </>
            ) : (
              <>
                <MacMark />
                <h1 className="font-display text-[1.85rem] font-semibold tracking-tight md:text-[2.35rem]">
                  Lazur is a Mac app.
                </h1>
                <p className="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-[var(--foreground)]/70">
                  Open this page on a Mac and we&apos;ll start the download for
                  you. Windows is on the way.
                </p>
                <div className="mt-8 flex flex-col items-center gap-3">
                  <Link
                    href="/exclusive-access"
                    className="btn-dark inline-flex min-h-[48px] items-center justify-center px-7 text-[14px]"
                  >
                    Get notified for Windows
                  </Link>
                </div>
              </>
            )}

            <p className="mt-10">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--foreground-faint)] transition-colors hover:text-[var(--foreground-muted)]"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to home
              </Link>
            </p>
          </motion.div>
        </div>
      </main>
      <Footer />
    </MarketingPageShell>
  );
}
