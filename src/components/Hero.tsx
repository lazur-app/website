"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AppMarquee } from "@/components/AppMarquee";
import { HeroDemoGrid } from "./hero/HeroDemoGrid";
import { HeroDemoModal } from "./hero/HeroDemoModal";
import { HeroShowreel } from "./hero/HeroShowreel";
import { HeroFluidWaves } from "./hero/HeroFluidWaves";
import { HeroDownloadCta } from "./HeroDownloadCta";
import { detectPlatform, type Platform } from "@/lib/platform";

const ROTATING_HEADLINES = [
  "Learn anything.",
  "Present with confidence.",
  "Debug your code.",
  "Translate instantly.",
  "Create better docs.",
  "Structure your ideas.",
];

export function Hero() {
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [demoOpen, setDemoOpen] = useState(false);
  const [headlineIndex, setHeadlineIndex] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    setPlatform(detectPlatform());
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const interval = window.setInterval(() => {
      setHeadlineIndex((currentIndex) =>
        (currentIndex + 1) % ROTATING_HEADLINES.length,
      );
    }, 2800);

    return () => window.clearInterval(interval);
  }, [prefersReducedMotion]);

  const isWindows = platform === "windows";

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
            className="max-w-4xl font-display text-[clamp(2.5rem,5vw,4.75rem)] font-medium leading-[0.96] tracking-[-0.04em] text-[var(--foreground)]"
          >
            <span className="block">Talk to your computer.</span>
            <span
              className="relative mt-1 block min-h-[1em] [perspective:900px]"
              aria-live="polite"
              aria-atomic="true"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={ROTATING_HEADLINES[headlineIndex]}
                  className="block origin-bottom"
                  initial={
                    prefersReducedMotion
                      ? false
                      : { opacity: 0, y: 16, rotateX: -12, scale: 0.985 }
                  }
                  animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                  exit={
                    prefersReducedMotion
                      ? undefined
                      : { opacity: 0, y: -16, rotateX: 12, scale: 0.985 }
                  }
                  transition={{
                    duration: 0.52,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {ROTATING_HEADLINES[headlineIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.55 }}
            className="mt-5 max-w-[52rem] text-[clamp(1.15rem,2.6vw,1.55rem)] font-medium leading-tight tracking-[-0.015em] text-[var(--foreground)] md:mt-6"
          >
            <span className="block">
              Your AI buddy that understands your screen, helps you think
            </span>
            <span className="block">and turns what you say into actions in any app.</span>
          </motion.p>

          {/* <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32, duration: 0.55 }}
            className="mt-5 max-w-[18rem] text-[16px] leading-relaxed text-[var(--foreground-muted)] md:mt-6 md:max-w-xl md:text-[17px] md:leading-[1.55]"
          >
            Honestly? Just talk. Lazur already sees your screen, gets what you mean,
            and drops finished text right at your cursor in any app.
          </motion.p> */}

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
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65, duration: 0.5 }}
          className="mt-10 hidden w-full max-w-4xl md:mt-12 md:block"
        >
          {/* <p className="mb-3 text-center text-[12px] text-[var(--foreground-faint)] md:text-[13px]">
            It reads the app you&apos;re already in
          </p> */}
          <AppMarquee
            iconSize={20}
            iconClassName="h-5 w-5 shrink-0 object-contain opacity-45 grayscale"
            groupClassName="gap-7 pr-7"
          />
        </motion.div>

        {/* Temporarily hidden while the product story is being repositioned around the AI buddy. */}
        {/* <HeroShowreel onOpen={() => setDemoOpen(true)} paused={demoOpen} /> */}
      </div>

      <HeroDemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
    </section>
  );
}
