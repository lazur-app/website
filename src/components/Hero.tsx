"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AppMarquee } from "@/components/AppMarquee";
import { HeroDemoGrid } from "./hero/HeroDemoGrid";
import { HeroFluidWaves } from "./hero/HeroFluidWaves";
import { HeroOptionalWord } from "./hero/HeroOptionalWord";
import { HeroDownloadCta } from "./HeroDownloadCta";
import { HeroLiveDemo } from "./landing/HeroLiveDemo";
import { detectPlatform, type Platform } from "@/lib/platform";

const headline = ["Typing", "is", "optional", "now."];

export function Hero() {
  const [platform, setPlatform] = useState<Platform | null>(null);

  useEffect(() => {
    setPlatform(detectPlatform());
  }, []);

  const isWindows = platform === "windows";

  return (
    <section className="relative min-h-[100dvh] overflow-hidden bg-[var(--background)]">
      <HeroFluidWaves />
      <HeroDemoGrid />

      {/* Soft fade — stays translucent so no hard line at section edge */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[clamp(7rem,22vh,11rem)]"
        aria-hidden
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, color-mix(in srgb, var(--foreground) 3%, transparent) 35%, color-mix(in srgb, var(--foreground) 12%, transparent) 72%, color-mix(in srgb, var(--foreground) 20%, transparent) 100%)",
        }}
      />

      <div className="relative z-10 landing-container flex min-h-[100dvh] flex-col items-center justify-center pb-12 pt-36 text-center md:pb-16 md:pt-44 lg:pt-48">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="flex max-w-full flex-nowrap items-baseline justify-center gap-x-[0.22em] font-display text-[clamp(2.15rem,5.8vw,4.75rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-[var(--foreground)]"
        >
          {headline.map((word, i) =>
            word === "optional" ? (
              <HeroOptionalWord key={word} />
            ) : (
              <motion.span
                key={word}
                initial={{ y: 16 }}
                animate={{ y: 0 }}
                transition={{
                  delay: 0.15 + i * 0.1,
                  duration: 0.7,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="inline-block shrink-0"
              >
                {word}
              </motion.span>
            ),
          )}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.55 }}
          className="mt-5 max-w-xl text-[16px] leading-relaxed text-[var(--foreground-muted)] md:mt-6 md:max-w-2xl md:text-[17px] md:leading-[1.55]"
        >
          <p>AI voice dictation for ambient writing on Mac.</p>
          <p className="mt-1">
            Hold a key. Speak naturally. Lazur writes exactly what you mean{" "}
            <strong className="font-semibold text-[var(--foreground)]">
              in any app.
            </strong>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.48, duration: 0.5 }}
          className="mt-8 flex flex-col items-center gap-3 sm:flex-row md:mt-10"
        >
          <HeroDownloadCta align="center" variant="minimal" />
          <Link
            href="#how-it-works"
            className="btn-outline-dark inline-flex min-h-[48px] items-center justify-center px-5 text-[14px]"
          >
            See how it works
          </Link>
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
          className="mt-12 w-full max-w-4xl md:mt-14"
        >
          <p className="mb-3 text-center text-[12px] text-[var(--foreground-faint)] md:text-[13px]">
            Works in the tools you already use
          </p>
          <AppMarquee
            iconSize={20}
            iconClassName="h-5 w-5 shrink-0 object-contain opacity-45 grayscale"
            groupClassName="gap-7 pr-7"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-10 w-full px-1 md:mt-11 md:px-2"
        >
          <div className="relative z-10 mx-auto w-full max-w-5xl">
            <HeroLiveDemo />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
