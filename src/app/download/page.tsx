"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronDown, Download } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MarketingPageShell } from "@/components/MarketingPageShell";
import {
  MAC_DOWNLOAD_FILENAME,
  MAC_DOWNLOAD_URL,
  triggerMacDownload,
} from "@/lib/download";
import { detectPlatform } from "@/lib/platform";

const installSteps = [
  {
    title: "Install Lazur",
    detail: `Open ${MAC_DOWNLOAD_FILENAME} from Downloads and drag Lazur into Applications.`,
  },
  {
    title: "Open it once",
    detail:
      "Right-click Lazur → Open. macOS may warn you — this beta isn't notarized yet. Choose Open.",
  },
  {
    title: "Allow permissions",
    detail: "Grant Microphone and Accessibility when prompted so Lazur can hear you and type anywhere.",
  },
  {
    title: "Sign in",
    detail: "Launch Lazur and sign in with Google to finish setup.",
  },
];

export default function DownloadPage() {
  const [platform, setPlatform] = useState<ReturnType<typeof detectPlatform> | null>(
    null
  );
  const [downloadStarted, setDownloadStarted] = useState(false);
  const [showTroubleshooting, setShowTroubleshooting] = useState(false);

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
      <MarketingPageShell>
        <Navbar />
        <main className="flex min-h-[60vh] items-center justify-center px-6 pt-28">
          <p className="text-sm text-[var(--foreground-muted)]">Loading…</p>
        </main>
      </MarketingPageShell>
    );
  }

  if (platform === "windows" || platform === "other") {
    return (
      <MarketingPageShell>
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
              Lazur is available on macOS today. Refer a friend to join the waitlist
              for Windows.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3">
              <Link
                href="/#refer"
                className="btn-primary rounded-full px-8 py-3.5 text-sm font-semibold"
              >
                Refer a friend
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
      </MarketingPageShell>
    );
  }

  return (
    <MarketingPageShell>
      <Navbar />
      <main className="relative mx-auto max-w-xl px-6 pb-24 pt-28 md:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="mb-8 text-center">
            <span className="inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--surface-solid)] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--foreground-faint)]">
              macOS · beta
            </span>
            <h1 className="mt-5 font-display text-balance text-3xl font-semibold tracking-tight md:text-4xl">
              Downloading Lazur
            </h1>
            <p className="mt-3 text-sm text-[var(--foreground-muted)]">
              {downloadStarted
                ? "Your download should start automatically. Follow the steps below."
                : MAC_DOWNLOAD_URL
                  ? "Starting your download…"
                  : "Download link is not configured yet."}
            </p>
          </div>

          <div className="glass rounded-[var(--radius-card)] px-6 py-8 md:px-8">
            <ol className="space-y-6">
              {installSteps.map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--brand-soft)] text-sm font-semibold text-[var(--brand-ink)]">
                    {i + 1}
                  </span>
                  <div className="pt-0.5">
                    <p className="font-medium text-[var(--foreground)]">{step.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-[var(--foreground-muted)]">
                      {step.detail}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/login/app"
                className="btn-primary inline-flex flex-1 items-center justify-center rounded-full px-6 py-3 text-sm font-semibold"
              >
                Sign in after install
              </Link>
              <button
                type="button"
                onClick={handleRetry}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-[var(--border-strong)] px-6 py-3 text-sm font-semibold text-[var(--foreground-muted)] transition-colors hover:border-[var(--brand)]/30 hover:text-[var(--foreground)]"
              >
                <Download className="h-4 w-4" />
                Download again
              </button>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="button"
              onClick={() => setShowTroubleshooting((open) => !open)}
              className="flex w-full items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface-solid)]/60 px-5 py-4 text-left text-sm font-medium text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground)]"
              aria-expanded={showTroubleshooting}
            >
              Blocked by macOS?
              <ChevronDown
                className={`h-4 w-4 shrink-0 transition-transform ${showTroubleshooting ? "rotate-180" : ""}`}
              />
            </button>

            <AnimatePresence initial={false}>
              {showTroubleshooting && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="mt-2 rounded-2xl border border-[var(--border)] bg-[var(--surface-solid)] px-5 py-5 text-sm leading-relaxed text-[var(--foreground-muted)]">
                    <p className="font-medium text-[var(--foreground)]">
                      &ldquo;Lazur is damaged&rdquo; or won&apos;t open?
                    </p>
                    <p className="mt-2">
                      Click Cancel if macOS warns you — the file is fine. In Terminal,
                      run:
                    </p>
                    <code className="mt-3 block overflow-x-auto rounded-xl bg-[var(--background-deep)] px-3 py-2.5 font-mono text-[11px] text-[var(--foreground)]">
                      xattr -cr ~/Downloads/{MAC_DOWNLOAD_FILENAME}
                    </code>
                    <p className="mt-3">
                      Then open the DMG again. If Lazur still won&apos;t launch after
                      installing:
                    </p>
                    <code className="mt-2 block overflow-x-auto rounded-xl bg-[var(--background-deep)] px-3 py-2.5 font-mono text-[11px] text-[var(--foreground)]">
                      xattr -cr /Applications/Lazur.app
                    </code>
                    <p className="mt-3">
                      Right-click Lazur → Open one more time.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <p className="mt-8 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--foreground-faint)] transition-colors hover:text-[var(--foreground-muted)]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to home
            </Link>
          </p>
        </motion.div>
      </main>
      <Footer />
    </MarketingPageShell>
  );
}
