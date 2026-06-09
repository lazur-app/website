"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useRef } from "react";
import { HeroDownloadCta } from "./HeroDownloadCta";
import { HeroOrbCapsule } from "./HeroOrbCapsule";

const headline = ["Typing", "is", "optional", "now."];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.55], [1, 0.96]);
  const y = useTransform(scrollYProgress, [0, 0.55], [0, -40]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden"
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[46%] h-[min(420px,55vh)] w-[min(560px,80vw)] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(107,75,252,0.07) 0%, rgba(168,85,247,0.03) 45%, transparent 72%)",
        }}
        animate={{ opacity: [0.55, 0.85, 0.55], scale: [1, 1.04, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        style={{ opacity, scale, y }}
        className="relative z-10 flex flex-col items-center px-6 text-center"
      >
        <h1 className="font-display text-[2.75rem] font-semibold leading-[1.06] tracking-[-0.03em] text-[var(--foreground)] sm:text-[3.5rem] md:text-[4.25rem] lg:text-[4.75rem]">
          {headline.map((word, i) => (
            <motion.span
              key={word}
              initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                delay: 0.2 + i * 0.11,
                duration: 0.75,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="mr-[0.22em] inline-block last:mr-0"
            >
              {word}
            </motion.span>
          ))}
        </h1>

        <HeroOrbCapsule />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.72, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="mt-9"
        >
          <HeroDownloadCta align="center" variant="minimal" />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.6 }}
        style={{ opacity: hintOpacity }}
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center text-[var(--foreground-faint)]"
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
