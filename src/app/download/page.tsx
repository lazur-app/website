"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { HandUnderline } from "@/components/buddy/HandLoop";
import { Check } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MarketingPageShell } from "@/components/MarketingPageShell";
import { AppleIcon } from "@/components/icons/AppleIcon";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import {
  hasIntelMacBuild,
  hasWindowsBuild,
  resolveMacDownloadUrl,
  triggerFileDownload,
  triggerWindowsDownload,
} from "@/lib/download";
import { submitExclusiveAccessRequest } from "@/lib/exclusiveAccess";
import { track } from "@/lib/productAnalytics";
import { INSTALL_STEPS, InstallDemo, useInstallStep } from "@/components/download/InstallDemo";
import { isMacDesktopVisitor } from "@/hooks/useIsMacVisitor";
import {
  detectMacChip,
  detectPlatform,
  type MacChip,
  type Platform,
} from "@/lib/platform";

const SAVE_AS = "Lazur.dmg";

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
      const result = await submitExclusiveAccessRequest(email, {
        platform: "windows",
        source: "download-page",
      });
      track("exclusive_access_requested", { platform: "windows", location: "download_page", status: result.status });
      setDone(true);
    } catch (err) {
      track("exclusive_access_failed", { platform: "windows", location: "download_page" });
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

const INK = "#e11d48";

/** The download button: the homepage's white pill, black outline and text. */
function DownloadPill({ label, onClick, icon }: { label: string; onClick: () => void; icon: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-[84px] min-w-[300px] items-center justify-center gap-3 rounded-[36px] border-[1.5px] border-[#1c1917] bg-white px-10 text-[22px] font-bold tracking-[-0.03em] text-[#1c1917] shadow-[0_2px_0_rgba(28,25,23,0.9),0_10px_24px_-8px_rgba(28,25,23,0.18)] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_0_rgba(28,25,23,0.9),0_16px_30px_-10px_rgba(28,25,23,0.24)] active:translate-y-0.5 active:shadow-[0_0_0_rgba(28,25,23,0.9)]"
    >
      {icon}
      {label}
    </button>
  );
}

/**
 * The download page, in the homepage's style: one headline, one button that downloads the app,
 * then what to do with the file. Nothing starts until the button is pressed.
 *
 * Mac visitors get the build for their chip. Everyone else gets the same button; for now it
 * downloads the Apple silicon Mac build (what it should do off a Mac is still to be decided).
 * A Windows build, when there is one, gets its own button.
 */
export default function DownloadPage() {
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [chip, setChip] = useState<MacChip>("apple-silicon");
  const [started, setStarted] = useState(false);
  const [missing, setMissing] = useState(false);
  const [showWaitlist, setShowWaitlist] = useState(false);
  const step = useInstallStep();

  useEffect(() => {
    const raw = detectPlatform();
    // iPadOS Safari claims to be a Mac.
    const detected: Platform = raw === "mac" && !isMacDesktopVisitor() ? "ios" : raw;
    void (async () => {
      const nextChip: MacChip = detected === "mac" ? await detectMacChip() : "apple-silicon";
      setPlatform(detected);
      setChip(nextChip);
    })();
  }, []);

  const windowsBuild = platform === "windows" && hasWindowsBuild();
  const location = `download_page_${platform ?? "unknown"}`;

  const downloadMac = useCallback(
    async (nextChip: MacChip, how: "button" | "again" | "switch") => {
      const url = await resolveMacDownloadUrl(nextChip);
      if (!url) {
        track("download_unavailable", { platform: "mac", chip: nextChip, how });
        setMissing(true);
        return;
      }
      track("download_clicked", { platform: "mac", chip: nextChip, how, visitor: platform ?? "unknown" });
      setStarted(triggerFileDownload(url, SAVE_AS));
    },
    [platform],
  );

  const download = (how: "button" | "again") => {
    if (windowsBuild) {
      track("download_clicked", { platform: "windows", how });
      setStarted(triggerWindowsDownload());
      return;
    }
    void downloadMac(chip, how);
  };

  const switchChip = () => {
    const next: MacChip = chip === "intel" ? "apple-silicon" : "intel";
    track("download_page_chip_selected", { chip: next, previous_chip: chip });
    setChip(next);
    void downloadMac(next, "switch");
  };

  const facts = ["Free 3-day Pro trial", "No credit card", hasIntelMacBuild() ? "Apple silicon & Intel" : "Apple silicon"];
  const buttonLabel = windowsBuild ? "Download for Windows" : "Download for Mac";

  return (
    <MarketingPageShell>
      <Navbar />
      <main className="relative overflow-x-clip px-4 pb-24 pt-32 sm:px-6 md:pt-40">
        <div className="landing-container flex flex-col items-center text-center">
          <h1 className="max-w-4xl font-sans text-[clamp(2.4rem,5.4vw,4.6rem)] font-bold leading-[1.04] tracking-[-0.05em] text-[var(--foreground)]">
            {started ? (
              <>
                It&apos;s on its way
                <br />
                to{" "}
                <span className="relative inline-block whitespace-nowrap">
                  your Mac.
                  <HandUnderline show color={INK} delay={0.3} duration={0.9} offset={2} />
                </span>
              </>
            ) : (
              <>
                Get{" "}
                <span className="relative inline-block whitespace-nowrap">
                  Lazur
                  <HandUnderline show color={INK} delay={0.4} duration={0.9} offset={2} />
                </span>{" "}
                on your Mac.
              </>
            )}
          </h1>
          <p className="mt-5 max-w-[30rem] text-[clamp(1rem,1.4vw,1.12rem)] font-medium leading-snug text-[var(--foreground-muted)]">
            {started
              ? "Check your Downloads folder. Three steps and I'm by your cursor."
              : platform !== null && platform !== "mac" && !windowsBuild
                ? "Lazur is a Mac app. Download it and open it on your Mac."
                : "One download. Hold two keys and talk, in any app."}
          </p>

          {started ? null : (
            <motion.div
              className="mt-12"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <DownloadPill
                label={buttonLabel}
                icon={windowsBuild ? null : <AppleIcon className="h-6 w-6" />}
                onClick={() => {
                  track("cta_clicked", { location, label: buttonLabel, destination: "file" });
                  download("button");
                }}
              />
            </motion.div>
          )}

          {missing ? (
            <p className="mt-5 text-[14px] text-[var(--foreground-muted)]">The installer isn&apos;t available just yet. Try again in a bit.</p>
          ) : null}

          <ul className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-[14px] text-[var(--foreground-muted)]">
            {facts.map((fact) => (
              <li key={fact} className="inline-flex items-center gap-1.5">
                <Check className="h-4 w-4 text-[var(--foreground)]" strokeWidth={2.5} aria-hidden />
                {fact}
              </li>
            ))}
          </ul>

          {/* After the download: the install, acted out. */}
          {started ? (
            <motion.div
              className="mt-14 grid w-full max-w-4xl items-center gap-8 text-left md:grid-cols-[1fr_1.35fr]"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <ol className="space-y-2">
                {INSTALL_STEPS.map((s, i) => {
                  const on = i === step;
                  return (
                    <li
                      key={s.title}
                      className={`flex gap-3 rounded-2xl border-[1.5px] px-4 py-3 transition-colors duration-300 ${on ? "border-[#1c1917] bg-white" : "border-transparent"}`}
                    >
                      <span
                        className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full text-[13px] font-bold transition-colors duration-300 ${on ? "bg-[#1c1917] text-white" : "bg-black/[0.06] text-[var(--foreground-muted)]"}`}
                      >
                        {i + 1}
                      </span>
                      <span>
                        <span className={`block text-[16px] font-bold tracking-[-0.02em] transition-colors duration-300 ${on ? "text-[var(--foreground)]" : "text-[var(--foreground)]/50"}`}>
                          {s.title}
                        </span>
                        <span className="block text-[13.5px] text-[var(--foreground-muted)]">{s.detail}</span>
                      </span>
                    </li>
                  );
                })}
              </ol>
              <InstallDemo step={step} />
            </motion.div>
          ) : null}

          {started ? (
            <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
              <TrackedLink
                href="/login/app"
                eventProps={{ location: "download_page", label: "Already installed? Sign in", destination: "/login/app" }}
                className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-[#1c1917] px-7 text-[15px] font-bold text-white transition-colors hover:bg-black"
              >
                Already installed? Sign in
              </TrackedLink>
              <button
                type="button"
                onClick={() => download("again")}
                className="inline-flex min-h-[48px] items-center justify-center rounded-full border-[1.5px] border-[#1c1917] bg-white px-7 text-[15px] font-bold text-[#1c1917] transition-colors hover:bg-black/[0.04]"
              >
                Download again
              </button>
            </div>
          ) : null}

          {hasIntelMacBuild() && !windowsBuild ? (
            <p className="mt-6 text-[13.5px] text-[var(--foreground-muted)]">
              {chip === "intel" ? "On Apple silicon? " : "On an Intel Mac? "}
              <button
                type="button"
                onClick={switchChip}
                className="font-semibold text-[var(--foreground)] underline decoration-[var(--foreground)]/25 underline-offset-4 hover:decoration-[var(--foreground)]"
              >
                {chip === "intel" ? "Get the Apple silicon version" : "Get the Intel version"}
              </button>
            </p>
          ) : null}

          {platform === "windows" && !windowsBuild ? (
            <div className="mt-10 w-full max-w-sm">
              {showWaitlist ? (
                <WindowsWaitlist />
              ) : (
                <p className="text-[13.5px] text-[var(--foreground-muted)]">
                  Want Lazur on this PC?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      track("windows_waitlist_opened", { location });
                      setShowWaitlist(true);
                    }}
                    className="font-semibold text-[var(--foreground)] underline decoration-[var(--foreground)]/25 underline-offset-4"
                  >
                    Get told when Windows is ready
                  </button>
                </p>
              )}
            </div>
          ) : null}
        </div>
      </main>
      <Footer />
    </MarketingPageShell>
  );
}
