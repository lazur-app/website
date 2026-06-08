"use client";

import { motion } from "framer-motion";
import { HeroDownloadCta } from "./HeroDownloadCta";
import { WorksInBar } from "./WorksInBar";

const trust = ["No setup", "Works everywhere", "Private by default"];

export function Hero() {
  return (
    <section className="relative flex min-h-[calc(100vh-4.5rem)] flex-col items-center justify-center overflow-hidden pb-16 pt-28 md:min-h-[calc(100vh-5rem)] md:pb-20 md:pt-32 lg:pt-36">
      <div
        className="ambient-blob pointer-events-none absolute -right-[12%] top-[8%] h-[38vh] w-[44vw] rounded-full bg-[#e8e0ff]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto w-full max-w-3xl px-8 text-center lg:px-12 xl:px-16">
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-white/90 px-3 py-2 text-[var(--text-sm)] font-medium text-[var(--foreground-muted)] backdrop-blur-sm"
        >
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Ambient writing for macOS
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-[52px] font-semibold leading-[1.08] tracking-[-0.03em] text-[var(--foreground)] sm:text-[56px] lg:text-[60px] xl:text-[64px]"
        >
          Typing is optional now.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14, duration: 0.5 }}
          className="mx-auto mt-6 max-w-[520px] text-[var(--text-lg)] leading-[var(--leading-body-lg)] text-[var(--foreground-muted)] lg:text-[var(--text-xl)]"
        >
          Hold a key. Speak. Lazur rewrites your words for whatever app
          you&apos;re in — then pastes at your cursor.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.45 }}
          className="mt-8 flex justify-center"
        >
          <HeroDownloadCta align="center" />
        </motion.div>

        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[var(--text-sm)] text-[var(--foreground-muted)]"
        >
          {trust.map((label) => (
            <li key={label}>{label}</li>
          ))}
        </motion.ul>
      </div>

      <WorksInBar />
    </section>
  );
}
