"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AppMarquee } from "@/components/AppMarquee";
import { HeroDemoGrid } from "./hero/HeroDemoGrid";
import { HeroDemoModal } from "./hero/HeroDemoModal";
import { HeroShowreel } from "./hero/HeroShowreel";
import { HeroFluidWaves } from "./hero/HeroFluidWaves";
import {
  HeroPromptsWord,
  HeroVoiceWord,
} from "./hero/HeroMottoWords";
import { HeroDownloadCta } from "./HeroDownloadCta";
import { detectPlatform, type Platform } from "@/lib/platform";

type HeadlinePart =
  | { type: "word"; text: string }
  | { type: "voice" }
  | { type: "prompts" }
  | { type: "break" };

const headline: HeadlinePart[] = [
  { type: "word", text: "Work" },
  { type: "word", text: "by" },
  { type: "voice" },
  { type: "word", text: "." },
  { type: "break" },
  { type: "word", text: "Not" },
  { type: "word", text: "by" },
  { type: "prompts" },
  { type: "word", text: "." },
];

export function Hero() {
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [demoOpen, setDemoOpen] = useState(false);

  useEffect(() => {
    setPlatform(detectPlatform());
  }, []);

  const isWindows = platform === "windows";

  let wordIndex = 0;

  return (
    <section className="relative min-h-[100dvh] overflow-hidden bg-[var(--background)]">
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
        <HeroFluidWaves />
        <HeroDemoGrid />
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[clamp(7rem,22vh,11rem)]"
        aria-hidden
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, color-mix(in srgb, var(--foreground) 3%, transparent) 35%, color-mix(in srgb, var(--foreground) 12%, transparent) 72%, color-mix(in srgb, var(--foreground) 20%, transparent) 100%)",
        }}
      />

      <div className="relative z-10 landing-container flex min-h-[100dvh] flex-col items-center justify-center pb-16 pt-28 text-center md:pb-20 md:pt-32 lg:pb-24 lg:pt-36">
        <div className="flex w-full flex-col items-center">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="flex max-w-[18ch] flex-wrap items-baseline justify-center gap-x-[0.22em] font-display text-[clamp(2.05rem,5.4vw,4.5rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-[var(--foreground)] sm:max-w-none"
          >
            {headline.map((part, i) => {
              if (part.type === "break") {
                return (
                  <span key={`br-${i}`} className="basis-full h-0" aria-hidden />
                );
              }

              const index = wordIndex++;

              if (part.type === "voice") {
                return <HeroVoiceWord key="voice" />;
              }

              if (part.type === "prompts") {
                return <HeroPromptsWord key="prompts" />;
              }

              return (
                <motion.span
                  key={`${part.text}-${i}`}
                  initial={{ y: 16 }}
                  animate={{ y: 0 }}
                  transition={{
                    delay: 0.15 + index * 0.1,
                    duration: 0.7,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={`inline-block shrink-0 ${
                    part.text === "." ? "-ml-[0.12em]" : ""
                  }`}
                >
                  {part.text}
                </motion.span>
              );
            })}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.55 }}
            className="mt-5 max-w-xl text-[16px] leading-relaxed text-[var(--foreground-muted)] md:mt-6 md:max-w-2xl md:text-[17px] md:leading-[1.55]"
          >
            AI should understand your work—not make you explain it.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.48, duration: 0.5 }}
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row md:mt-10"
          >
            <HeroDownloadCta align="center" variant="minimal" />
            <button
              type="button"
              onClick={() => setDemoOpen(true)}
              className="btn-outline-dark inline-flex min-h-[48px] items-center justify-center gap-2 px-5 text-[14px]"
            >
              See how it works
            </button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.58, duration: 0.45 }}
            className="mt-3 text-[12px] text-[var(--foreground-faint)] md:text-[13px]"
          >
            {isWindows ? (
              <>
                Windows waitlist open ·{" "}
                <Link
                  href="/download"
                  className="font-medium text-[var(--foreground-muted)] underline-offset-2 transition-colors hover:text-[var(--foreground)] hover:underline"
                >
                  macOS available now
                </Link>
              </>
            ) : (
              "7-day Pro trial · macOS"
            )}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65, duration: 0.5 }}
            className="mt-10 w-full max-w-4xl md:mt-12"
          >
            <p className="mb-3 text-center text-[12px] text-[var(--foreground-faint)] md:text-[13px]">
              Understands the app you&apos;re already in
            </p>
            <AppMarquee
              iconSize={20}
              iconClassName="h-5 w-5 shrink-0 object-contain opacity-45 grayscale"
              groupClassName="gap-7 pr-7"
            />
          </motion.div>

          <HeroShowreel
            onOpen={() => setDemoOpen(true)}
            paused={demoOpen}
          />
        </div>
      </div>

      <HeroDemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
    </section>
  );
}
