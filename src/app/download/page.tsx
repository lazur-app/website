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
import { Sticker } from "@/components/landing/Sticker";
import { FounderSticker } from "@/components/landing/FounderSticker";
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
      <div className="py-6 text-center">
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
    <form onSubmit={onSubmit} className="w-full text-left">
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
        className="w-full rounded-full border-[1.5px] border-[#1c1917] bg-white px-5 py-3.5 text-[16px] text-[var(--foreground)] outline-none transition-shadow focus:ring-2 focus:ring-[#e11d48]/30"
      />
      {error ? (
        <p className="mt-2 text-[13px] text-red-600">{error}</p>
      ) : null}
      <button
        type="submit"
        disabled={submitting}
        className="mt-3 flex min-h-[52px] w-full items-center justify-center rounded-full bg-[#1c1917] text-[16px] font-bold text-white transition-colors hover:bg-black disabled:opacity-60"
      >
        {submitting ? "Saving…" : "Notify me for Windows"}
      </button>
    </form>
  );
}

const INK = "#e11d48";

/** Mr Bean in a field, checking his watch: us, waiting on the Windows build. Streams from GIPHY, like the homepage's GIFs. */
const WAITING_GIF = "QBd2kLB5qDmysEXre9";

/**
 * What a Windows visitor sees while there is no Windows build: the waitlist up front, in an ink-outlined card with a
 * GIF, Veer and Ayush perched on top (Ayush already hard at work on it). A Mac download stays one tap away below.
 */
function WindowsView({ onMacDownload }: { onMacDownload: () => void }) {
  return (
    <div className="flex w-full flex-col items-center">
      <h1 className="max-w-4xl font-sans text-[clamp(2.2rem,4.8vw,4.2rem)] font-bold leading-[1.04] tracking-[-0.05em] text-[var(--foreground)]">
        Lazur for{" "}
        <span className="relative inline-block whitespace-nowrap">
          Windows
          <HandUnderline show color={INK} delay={0.4} duration={0.9} offset={2} />
        </span>
        <br className="hidden sm:block" /> is on its way.
      </h1>
      <p className="mt-4 max-w-[32rem] text-[clamp(1rem,1.4vw,1.12rem)] font-medium leading-snug text-[var(--foreground-muted)]">
        Lazur is Mac-only for now. Leave your email and we&apos;ll write the day it lands on your PC.
      </p>

      <motion.div
        className="relative mt-24 w-full max-w-[880px] sm:mt-28"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Veer waving and Ayush on his laptop, sitting on the card's top edge. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-full flex items-end justify-between px-5 sm:px-10" aria-hidden>
          <FounderSticker who="veer" pose="wave" size="clamp(96px, 16vw, 132px)" className="-mb-2" />
          <FounderSticker who="ayush" pose="laptop" size="clamp(84px, 13vw, 112px)" label="on it…" className="-mb-1 mr-10 sm:mr-12" />
        </div>
        <Sticker name="cloud" size={64} rotate={-10} className="absolute -left-3 top-1/2 hidden md:-left-9 md:block" />

        <div className="relative grid overflow-hidden rounded-[28px] border-[1.5px] border-[#1c1917] bg-white text-left shadow-[0_2px_0_rgba(28,25,23,0.9),0_18px_40px_-18px_rgba(28,25,23,0.25)] md:grid-cols-[1.05fr_1fr]">
          <figure className="relative border-b-[1.5px] border-[#1c1917] bg-[#1c1917] md:border-b-0 md:border-r-[1.5px]">
            <video
              src={`https://media.giphy.com/media/${WAITING_GIF}/giphy.mp4`}
              poster={`https://media.giphy.com/media/${WAITING_GIF}/giphy_s.gif`}
              autoPlay
              loop
              muted
              playsInline
              aria-label="Mr Bean standing in a field, checking his watch"
              className="block aspect-[5/3] h-full w-full object-cover md:aspect-auto"
            />
            <figcaption className="absolute bottom-3 left-3 rotate-[-2deg] rounded-full border-[1.5px] border-[#1c1917] bg-white px-3 py-1 font-[family-name:var(--font-caveat)] text-[19px] font-semibold leading-none text-[#1c1917]">
              us, checking on the windows build
            </figcaption>
          </figure>
          <div className="flex flex-col justify-center p-6 sm:p-8">
            <p className="font-display text-[22px] font-bold tracking-[-0.03em] text-[var(--foreground)]">Get told first</p>
            <p className="mb-5 mt-1 text-[14.5px] leading-snug text-[var(--foreground-muted)]">One email when it&apos;s ready. Nothing else.</p>
            <WindowsWaitlist />
          </div>
        </div>
        <p className="mt-3 text-center text-[11px] tracking-wide text-[var(--foreground-faint)]">gifs powered by giphy</p>
      </motion.div>

      <p className="mt-10 text-[14px] text-[var(--foreground-muted)]">
        Got a Mac too?{" "}
        <button
          type="button"
          onClick={onMacDownload}
          className="inline-flex items-center gap-1 font-semibold text-[var(--foreground)] underline decoration-[var(--foreground)]/25 underline-offset-4 hover:decoration-[var(--foreground)]"
        >
          <AppleIcon className="-mt-0.5 h-3.5 w-3.5" />
          Download for Mac
        </button>
      </p>
    </div>
  );
}


/** The download button: the homepage's white pill, black outline and text. */
function DownloadPill({ label, onClick, icon }: { label: string; onClick: () => void; icon: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-[72px] min-w-[260px] items-center justify-center gap-3 rounded-[32px] border-[1.5px] border-[#1c1917] bg-white px-8 text-[20px] sm:h-[84px] sm:min-w-[300px] sm:rounded-[36px] sm:px-10 sm:text-[22px] font-bold tracking-[-0.03em] text-[#1c1917] shadow-[0_2px_0_rgba(28,25,23,0.9),0_10px_24px_-8px_rgba(28,25,23,0.18)] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_0_rgba(28,25,23,0.9),0_16px_30px_-10px_rgba(28,25,23,0.24)] active:translate-y-0.5 active:shadow-[0_0_0_rgba(28,25,23,0.9)]"
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
  const step = useInstallStep();

  useEffect(() => {
    // ?platform=windows (or mac / ios) previews another visitor's view of this page.
    const forced = new URLSearchParams(window.location.search).get("platform");
    const raw: Platform = forced === "windows" || forced === "mac" || forced === "ios" ? forced : detectPlatform();
    // iPadOS Safari claims to be a Mac.
    const detected: Platform = raw === "mac" && !forced && !isMacDesktopVisitor() ? "ios" : raw;
    void (async () => {
      const nextChip: MacChip = detected === "mac" ? await detectMacChip() : "apple-silicon";
      setPlatform(detected);
      setChip(nextChip);
    })();
  }, []);

  const windowsBuild = platform === "windows" && hasWindowsBuild();
  // Windows without a build of its own: the waitlist is the page (until the download has started).
  const waitlistView = platform === "windows" && !windowsBuild && !started;
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
        {waitlistView ? (
          <div className="landing-container flex flex-col items-center text-center">
            <WindowsView
              onMacDownload={() => {
                track("cta_clicked", { location, label: "Download for Mac", destination: "file" });
                void downloadMac(chip, "button");
              }}
            />
          </div>
        ) : (
        <div className="landing-container flex flex-col items-center text-center">
          <div className="relative">
            {/* A couple of stickers tucked around the headline. */}
            <Sticker name="cursor" size={64} rotate={-14} className="absolute -left-2 -top-12 origin-bottom-left scale-[0.75] sm:-left-14 sm:-top-8 sm:scale-100" />
            <Sticker name="heart" size={60} rotate={12} className="absolute -right-1 -top-14 origin-bottom-right scale-[0.75] sm:-right-14 sm:-top-6 sm:scale-100" />
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
          </div>
          <p className="mt-5 max-w-[30rem] text-[clamp(1rem,1.4vw,1.12rem)] font-medium leading-snug text-[var(--foreground-muted)]">
            {started
              ? "Check your Downloads folder. Three steps and I'm by your cursor."
              : platform !== null && platform !== "mac" && !windowsBuild
                ? "Lazur is a Mac app. Download it and open it on your Mac."
                : "One download. Hold two keys and talk, in any app."}
          </p>

          {started ? null : (
            <motion.div
              className="relative mt-16 sm:mt-12"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Vaidik: pointing at the button from its left on wider screens, perched on its corner on phones. */}
              <FounderSticker who="vaidik" pose="point" size={150} className="!absolute bottom-[-18px] right-full mr-6 max-sm:!hidden" />
              <FounderSticker who="vaidik" pose="sitwave" size={74} className="!absolute bottom-[calc(100%-14px)] right-5 sm:hidden" />
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

        </div>
        )}
      </main>
      <Footer />
    </MarketingPageShell>
  );
}
