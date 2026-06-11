"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useRef } from "react";
import { HeroAppLogos } from "./hero/HeroAppLogos";
import { HeroFluidWaves } from "./hero/HeroFluidWaves";
import { HeroOptionalWord } from "./hero/HeroOptionalWord";
import { HeroDownloadCta } from "./HeroDownloadCta";
import { HeroOrbCapsule } from "./HeroOrbCapsule";

const headline = ["Typing", "is", "optional", "now."];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const headlineOpacity = useTransform(scrollYProgress, [0, 0.72], [1, 0]);
  const headlineScale = useTransform(scrollYProgress, [0, 0.72], [1, 0.97]);
  const headlineY = useTransform(scrollYProgress, [0, 0.72], [0, -32]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-[100dvh] overflow-hidden"
    >
      <HeroFluidWaves />

      <div className="relative z-10 flex min-h-[100dvh] flex-col">
        <motion.div
          style={{
            opacity: headlineOpacity,
            scale: headlineScale,
            y: headlineY,
          }}
          className="flex flex-1 flex-col items-center justify-center px-6 text-center translate-y-9 sm:translate-y-11"
        >
          <h1 className="font-display text-[2.75rem] font-semibold leading-[1.06] tracking-[-0.03em] text-[var(--foreground)] sm:text-[3.5rem] md:text-[4.25rem] lg:text-[4.75rem]">
            {headline.map((word, i) =>
              word === "optional" ? (
                <HeroOptionalWord key={word} />
              ) : (
                <motion.span
                  key={word}
                  initial={{ y: 20 }}
                  animate={{ y: 0 }}
                  transition={{
                    delay: 0.2 + i * 0.11,
                    duration: 0.75,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="mr-[0.22em] inline-block last:mr-0"
                >
                  {word}
                </motion.span>
              ),
            )}
          </h1>

          <motion.p
            initial={{ y: 12 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.55, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mt-4 max-w-md text-[15px] leading-relaxed text-[var(--foreground-muted)] md:mt-5 md:text-[16px]"
          >
            Hold a key, speak, release — lazur reads what you meant and lands it
            at your cursor, in any app.
          </motion.p>

          <motion.div
            initial={{ y: 16 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.68, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8"
          >
            <HeroDownloadCta align="center" variant="minimal" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.78, duration: 0.5 }}
            className="mt-5 md:mt-6"
          >
            <HeroAppLogos />
          </motion.div>
        </motion.div>

        {/* Capsule stays full opacity while in view — scroll fade only on headline */}
        <div className="relative z-20 shrink-0 px-6 pb-14 sm:pb-16">
          <HeroOrbCapsule />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.6 }}
        style={{ opacity: hintOpacity }}
        className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center text-[var(--foreground-faint)]"
        aria-hidden
      >
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
        >
          <ChevronDown className="h-4 w-4" strokeWidth={1.5} />
        </motion.div>
      </motion.div>
    </section>
  );
}
