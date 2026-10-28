"use client";

import { motion } from "framer-motion";
import { HeroDownloadCta } from "@/components/HeroDownloadCta";
import { NotchStage } from "./NotchStage";

export function BuddyHero() {
  return (
    <section className="relative overflow-x-clip bg-[var(--background)]">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 60% 45% at 50% 0%, rgba(107, 75, 252, 0.12), transparent 70%), radial-gradient(ellipse 40% 35% at 85% 30%, rgba(249, 115, 22, 0.08), transparent 70%)",
        }}
      />
      <div className="landing-container relative flex flex-col items-center pb-16 pt-28 text-center md:pb-24 md:pt-36">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-full border border-[var(--border-strong)] bg-white/70 px-3 py-1 text-[13px] font-medium text-[var(--foreground-muted)]"
        >
          AI buddy for Mac
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="mt-5 max-w-4xl font-display text-[clamp(2.5rem,5.4vw,5rem)] font-medium leading-[0.98] tracking-[-0.04em] text-[var(--foreground)]"
        >
          Your AI buddy,
          <br />
          right in the notch.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.55 }}
          className="mt-5 max-w-[40rem] text-[clamp(1.05rem,2.2vw,1.35rem)] leading-snug text-[var(--foreground-muted)]"
        >
          Hold a key and talk. Lazur sees your screen, points at things, answers out loud and gets
          things done, in any app.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32, duration: 0.5 }}
          className="mt-8 flex w-full max-w-[17rem] justify-center md:max-w-none"
        >
          <HeroDownloadCta align="center" variant="minimal" className="w-full md:w-auto" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 w-full max-w-5xl md:mt-16"
        >
          <NotchStage />
        </motion.div>
      </div>
    </section>
  );
}
