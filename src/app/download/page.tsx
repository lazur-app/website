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

export default function DownloadPage() {
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [chip, setChip] = useState<MacChip | null>(null);
  const [started, setStarted] = useState(false);

  const startMacDownload = useCallback(async (nextChip: MacChip) => {
    const url = await resolveMacDownloadUrl(nextChip);
    if (!url) return;
    setStarted(triggerFileDownload(url, SAVE_AS));
  }, []);

  useEffect(() => {
    const detected = detectPlatform();
    setPlatform(detected);

    if (detected !== "mac") return;

    void (async () => {
      const nextChip = await detectMacChip();
      setChip(nextChip);
      await startMacDownload(nextChip);
    })();
  }, [startMacDownload]);

  useEffect(() => {
    if (platform === "windows" && hasWindowsBuild()) {
      setStarted(triggerWindowsDownload());
    }
  }, [platform]);

  const switchChip = (nextChip: MacChip) => {
    setChip(nextChip);
    void startMacDownload(nextChip);
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
            className="aura-stage mx-auto max-w-xl px-5 py-12 text-center sm:px-10 sm:py-14"
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
              <>
                <MacMark />
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--foreground)]/45">
                  {chip === "intel" ? "Intel Mac" : "Mac"}
                </p>
                <h1 className="mt-2 font-display text-[1.85rem] font-semibold tracking-tight md:text-[2.35rem]">
                  {started ? "It's on its way." : "Lazur for Mac"}
                </h1>
                <p className="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-[var(--foreground)]/70">
                  {started
                    ? "Check your Downloads folder. Open the installer, drag Lazur to Applications, then sign in."
                    : MAC_DOWNLOAD_URL
                      ? "Ready when you are."
                      : "The Mac installer isn’t available just yet. Try again in a bit."}
                </p>

                <ol className="mx-auto mt-8 max-w-xs space-y-2.5 text-left text-[14px] text-[var(--foreground)]/70">
                  {[
                    "Open the file from Downloads",
                    "Drag Lazur into Applications",
                    "Sign in and hold Control + Space",
                  ].map((step, i) => (
                    <li key={step} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--foreground)] text-[10px] font-semibold text-[var(--background)]">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>

                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Link
                    href="/login/app"
                    className="btn-dark inline-flex min-h-[48px] w-full items-center justify-center rounded-full px-6 text-[14px] font-semibold sm:w-auto"
                  >
                    Sign in
                  </Link>
                  <button
                    type="button"
                    onClick={() => chip && void startMacDownload(chip)}
                    className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full border border-[var(--border-strong)] bg-white/70 px-6 text-[14px] font-semibold text-[var(--foreground)] transition-colors hover:border-[var(--foreground)]/30 sm:w-auto"
                  >
                    <Download className="h-4 w-4" />
                    Download again
                  </button>
                </div>

                {hasIntelMacBuild() ? (
                  <p className="mt-8 text-[13px] text-[var(--foreground-faint)]">
                    {chip === "intel" ? (
                      <>
                        On Apple silicon?{" "}
                        <button
                          type="button"
                          onClick={() => switchChip("apple-silicon")}
                          className="font-medium text-[var(--foreground-muted)] underline decoration-[var(--foreground)]/20 underline-offset-2 hover:text-[var(--foreground)]"
                        >
                          Get the Mac version
                        </button>
                      </>
                    ) : (
                      <>
                        On an Intel Mac?{" "}
                        <button
                          type="button"
                          onClick={() => switchChip("intel")}
                          className="font-medium text-[var(--foreground-muted)] underline decoration-[var(--foreground)]/20 underline-offset-2 hover:text-[var(--foreground)]"
                        >
                          Get the Intel version
                        </button>
                      </>
                    )}
                  </p>
                ) : null}
              </>
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
