"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AppMarquee } from "@/components/AppMarquee";
import { HeroDemoGrid } from "./hero/HeroDemoGrid";
import { HeroDemoModal } from "./hero/HeroDemoModal";
import { HeroShowreel } from "./hero/HeroShowreel";
import { HeroFluidWaves } from "./hero/HeroFluidWaves";
import { HeroVoiceWord } from "./hero/HeroMottoWords";
import { HeroDownloadCta } from "./HeroDownloadCta";
import { detectPlatform, type Platform } from "@/lib/platform";

type HeadlinePart =
  | { type: "word"; text: string }
  | { type: "highlight"; text: string }
  | { type: "break" };

const headline: HeadlinePart[] = [
  { type: "word", text: "Stop" },
  { type: "word", text: "explaining" },
  { type: "break" },
  { type: "word", text: "your" },
  { type: "highlight", text: "screen" },
  { type: "break" },
  { type: "word", text: "to" },
  { type: "word", text: "AI." },
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
    <section className="relative min-h-[100svh] overflow-x-clip bg-[var(--background)] md:min-h-[100dvh] md:overflow-hidden">
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
        <HeroFluidWaves />
        <HeroDemoGrid />
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[clamp(4.5rem,16vh,11rem)] md:h-[clamp(7rem,22vh,11rem)]"
        aria-hidden
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, color-mix(in srgb, var(--foreground) 3%, transparent) 35%, color-mix(in srgb, var(--foreground) 12%, transparent) 72%, color-mix(in srgb, var(--foreground) 20%, transparent) 100%)",
        }}
      />

      <div className="relative z-10 landing-container flex flex-col items-center pb-10 pt-24 text-center md:min-h-[100dvh] md:justify-center md:pb-20 md:pt-32 lg:pb-24 lg:pt-36">
        <div className="flex min-h-[78svh] w-full flex-col items-center justify-center md:min-h-0">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="flex max-w-[7.2em] flex-wrap items-baseline justify-center gap-x-[0.2em] font-display text-[clamp(2.9rem,11vw,4.5rem)] font-semibold leading-[1.04] tracking-[-0.04em] text-[var(--foreground)] md:max-w-none md:leading-[1.08]"
          >
            {headline.map((part, i) => {
              if (part.type === "break") {
                return (
                  <span
                    key={`br-${i}`}
                    className="h-0 basis-full md:hidden"
                    aria-hidden
                  />
                );
              }

              const index = wordIndex++;

              if (part.type === "highlight") {
                return <HeroVoiceWord key={part.text}>{part.text}</HeroVoiceWord>;
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
                  className="inline-block shrink-0"
                >
                  {part.text}
                </motion.span>
              );
            })}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32, duration: 0.55 }}
            className="mt-5 max-w-[18rem] text-[16px] leading-relaxed text-[var(--foreground-muted)] md:mt-6 md:max-w-xl md:text-[17px] md:leading-[1.55]"
          >
            Lazur can see it. Say what you want, and the finished text lands at
            your cursor &mdash; in any app.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="mt-8 flex w-full max-w-[17rem] flex-col items-center gap-3 md:mt-10 md:max-w-none md:flex-row md:justify-center"
          >
            <HeroDownloadCta
              align="center"
              variant="minimal"
              className="w-full md:w-auto"
            />
            <button
              type="button"
              onClick={() => setDemoOpen(true)}
              className="btn-outline-dark hidden min-h-[48px] items-center justify-center gap-2 px-5 text-[14px] md:inline-flex"
            >
              Watch it read a screen
            </button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.45 }}
            className="mt-3 text-[12px] text-[var(--foreground-faint)] md:text-[13px]"
          >
            Hold a key, speak, release · Your voice never leaves your computer ·{" "}
            {isWindows ? (
              <Link
                href="/download"
                className="font-medium text-[var(--foreground-muted)] underline-offset-2 transition-colors hover:text-[var(--foreground)] hover:underline"
              >
                Windows waitlist open
              </Link>
            ) : (
              "macOS today, Windows soon"
            )}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65, duration: 0.5 }}
          className="mt-10 hidden w-full max-w-4xl md:mt-12 md:block"
        >
          <p className="mb-3 text-center text-[12px] text-[var(--foreground-faint)] md:text-[13px]">
            It reads the app you&apos;re already in
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

      <HeroDemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
    </section>
  );
}
