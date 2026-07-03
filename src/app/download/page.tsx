"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Download } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MarketingPageShell } from "@/components/MarketingPageShell";
import {
  MAC_DOWNLOAD_FILENAME,
  MAC_DOWNLOAD_URL,
  resolveMacDownloadUrl,
  triggerMacDownload,
} from "@/lib/download";
import { detectPlatform } from "@/lib/platform";

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

    void (async () => {
      const url = await resolveMacDownloadUrl();
      if (!url) return;
      const started = triggerMacDownload(url);
      setDownloadStarted(started);
    })();
  }, [platform]);

  const handleRetry = async () => {
    const url = await resolveMacDownloadUrl();
    if (url && triggerMacDownload(url)) {
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
              Lazur is available on macOS today. Join the waitlist to be first
              when we ship on Windows.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3">
              <Link
                href="/exclusive-access"
                className="btn-primary rounded-full px-8 py-3.5 text-sm font-semibold"
              >
                Join the Windows waitlist
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
      <main className="relative mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-6 pb-24 pt-24 md:min-h-[65vh] md:pt-28">
        <div
          className="pointer-events-none absolute inset-x-0 top-8 -z-10 h-72 opacity-70"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(107,75,252,0.1) 0%, rgba(168,85,247,0.04) 45%, transparent 72%)",
          }}
          aria-hidden
        />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full text-center"
        >
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--foreground-faint)]"
          >
            macOS
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.04 }}
            className="font-display text-balance text-3xl font-semibold tracking-[-0.03em] md:text-[2.75rem]"
          >
            Thanks for downloading
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-[var(--foreground-muted)]"
          >
            {downloadStarted
              ? "Your download should start automatically. Open the installer, then sign in to get started."
              : MAC_DOWNLOAD_URL
                ? "Starting your download…"
                : "Download link is not configured yet."}
          </motion.p>

          {downloadStarted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-solid)] px-4 py-2 text-[13px] font-medium text-[var(--foreground-muted)]"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--brand)] opacity-40" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--brand)]" />
              </span>
              {MAC_DOWNLOAD_FILENAME}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Link
              href="/login/app"
              className="btn-dark inline-flex w-full items-center justify-center rounded-full px-6 py-3 text-sm font-semibold sm:w-auto sm:min-w-[9rem]"
            >
              Sign in
            </Link>
            <button
              type="button"
              onClick={handleRetry}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[var(--border-strong)] px-6 py-3 text-sm font-semibold text-[var(--foreground-muted)] transition-colors hover:border-[var(--brand)]/30 hover:text-[var(--foreground)] sm:w-auto sm:min-w-[9rem]"
            >
              <Download className="h-4 w-4" />
              Download again
            </button>
          </motion.div>

          <p className="mt-10 text-center text-[13px] text-[var(--foreground-faint)]">
            Need more words or Voice Commands?{" "}
            <Link
              href="/pricing"
              className="font-medium text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground)]"
            >
              View pricing
            </Link>
          </p>

          <p className="mt-4 text-center">
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
