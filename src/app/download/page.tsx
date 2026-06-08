"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Download, ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LogoWordmark } from "@/components/LogoWordmark";
import {
  MAC_DOWNLOAD_FILENAME,
  MAC_DOWNLOAD_URL,
  triggerMacDownload,
} from "@/lib/download";
import { detectPlatform } from "@/lib/platform";

const macSteps = [
  {
    title: "Open your Downloads",
    detail: "Your installer should start downloading automatically.",
  },
  {
    title: `Double-click ${MAC_DOWNLOAD_FILENAME}`,
    detail:
      "If macOS says the file is “damaged”, click Cancel — the app is fine. See the fix below, then open the DMG again.",
  },
  {
    title: "Drag Lazur into Applications",
    detail: "Eject the disk image when you're done.",
  },
  {
    title: "Right-click Lazur → Open",
    detail:
      "This beta isn't signed with Apple yet. Use Open (not double-click) the first time so macOS lets you through.",
  },
  {
    title: "Allow Microphone & Accessibility",
    detail:
      "Lazur needs both so it can hear you and type into Slack, Gmail, Notes, and more.",
  },
  {
    title: "Sign in with Google",
    detail: "Complete onboarding in the app, or use lazur.app/login/app in your browser.",
  },
];

export default function DownloadPage() {
  const [platform, setPlatform] = useState<ReturnType<typeof detectPlatform> | null>(
    null
  );
  const [downloadStarted, setDownloadStarted] = useState(false);

  useEffect(() => {
    setPlatform(detectPlatform());
  }, []);

  useEffect(() => {
    if (platform !== "mac" || !MAC_DOWNLOAD_URL) return;

    const started = triggerMacDownload();
    setDownloadStarted(started);
  }, [platform]);

  const handleRetry = () => {
    if (triggerMacDownload()) {
      setDownloadStarted(true);
    }
  };

  if (platform === null) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <Navbar />
        <main className="flex min-h-[60vh] items-center justify-center px-6 pt-28">
          <p className="text-sm text-[var(--foreground-muted)]">Loading…</p>
        </main>
      </div>
    );
  }

  if (platform === "windows" || platform === "other") {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <Navbar />
        <main className="mx-auto max-w-lg px-6 pb-20 pt-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--foreground-faint)]">
              Windows &amp; Linux
            </p>
            <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
              Coming soon
            </h1>
            <p className="mt-4 text-base leading-relaxed text-[var(--foreground-muted)]">
              Lazur is available on macOS today. Join the waitlist by referring a
              friend — we&apos;ll notify you when Windows launches.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3">
              <Link
                href="/#refer"
                className="btn-primary rounded-full px-8 py-3.5 text-sm font-semibold"
              >
                Refer a friend · join waitlist
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to home
              </Link>
            </div>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navbar />
      <main className="relative min-h-[calc(100svh-4rem)] overflow-hidden pt-24 md:pt-28">
        <div className="pointer-events-none absolute inset-0 grain" />
        <div
          className="ambient-blob pointer-events-none absolute -right-[10%] top-[15%] h-[55vh] w-[50vw] rounded-full bg-[#c8f0d4]"
          aria-hidden
        />

        <div className="relative mx-auto grid max-w-6xl gap-0 px-6 pb-20 md:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] md:gap-12 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col justify-center py-8 md:py-16"
          >
            <LogoWordmark className="mb-10 w-fit" height={32} />

            <h1 className="font-display text-balance text-3xl font-semibold leading-[1.08] tracking-tight md:text-4xl lg:text-[2.75rem]">
              Open Lazur in 3 steps
            </h1>
            <p className="mt-3 text-sm text-[var(--foreground-muted)]">
              {downloadStarted
                ? "Your download has started."
                : MAC_DOWNLOAD_URL
                  ? "Starting your download…"
                  : "Download link is not configured yet."}
            </p>

            <ol className="mt-10 space-y-6">
              {macSteps.slice(0, 3).map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--foreground)] text-sm font-semibold text-[var(--background)]">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-medium text-[var(--foreground)]">{step.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-[var(--foreground-muted)]">
                      {step.detail}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <p className="mt-10 text-sm text-[var(--foreground-muted)]">
              Not working?{" "}
              <button
                type="button"
                onClick={handleRetry}
                className="font-semibold text-[var(--foreground)] underline underline-offset-2 hover:text-[var(--brand)]"
              >
                Try again
              </button>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col justify-center py-8 md:py-16"
          >
            <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-solid)] p-6 shadow-[var(--shadow-soft)] md:p-8">
              <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--foreground-faint)]">
                Beta build · unsigned
              </p>
              <h2 className="font-display text-xl font-semibold tracking-tight md:text-2xl">
                First launch on macOS
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[var(--foreground-muted)]">
                Because this build isn&apos;t notarized yet, macOS may block Lazur
                the first time. That&apos;s normal — follow these steps once.
              </p>

              <div className="mt-5 rounded-2xl border border-amber-200/80 bg-amber-50/90 px-4 py-3">
                <p className="text-sm font-semibold text-amber-950">
                  Saw “Lazur is damaged and can&apos;t be opened”?
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-amber-900/90">
                  Click <strong>Cancel</strong> — do not move it to the Bin. Chrome
                  flagged the download; the file isn&apos;t actually damaged.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-amber-900/90">
                  Open <strong>Terminal</strong> and paste:
                </p>
                <code className="mt-2 block overflow-x-auto rounded-lg bg-[var(--background-deep)] px-3 py-2 font-mono text-[11px] text-[var(--foreground)]">
                  xattr -cr ~/Downloads/{MAC_DOWNLOAD_FILENAME}
                </code>
                <p className="mt-2 text-sm text-amber-900/90">
                  Then double-click the DMG again and continue installing.
                </p>
              </div>

              <ol className="mt-6 space-y-5">
                {macSteps.slice(3).map((step, i) => (
                  <li key={step.title} className="flex gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--brand-soft)] text-xs font-semibold text-[var(--brand-ink)]">
                      {i + 4}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-[var(--foreground)]">
                        {step.title}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-[var(--foreground-muted)]">
                        {step.detail}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleRetry}
                  className="btn-primary inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold"
                >
                  <Download className="h-4 w-4" />
                  Download again
                </button>
                <Link
                  href="/login/app"
                  className="inline-flex items-center justify-center rounded-full border border-[var(--border-strong)] px-6 py-3 text-sm font-semibold text-[var(--foreground-muted)] transition-colors hover:border-[var(--brand)]/30 hover:text-[var(--foreground)]"
                >
                  Sign in after install
                </Link>
              </div>

              <p className="mt-6 text-xs leading-relaxed text-[var(--foreground-faint)]">
                Still blocked? Open Terminal and run{" "}
                <code className="rounded bg-[var(--background-deep)] px-1.5 py-0.5 font-mono text-[11px]">
                  xattr -cr /Applications/Lazur.app
                </code>
                , then right-click Lazur → Open.
              </p>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
