"use client";

import { motion } from "framer-motion";
import { VoiceMorph } from "./VoiceMorph";

export function SeeItInAction() {
  return (
    <section
      id="how-it-works"
      className="relative border-t border-[var(--border)] py-24 md:py-32"
    >
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="label mb-4">See it in action</p>
          <h2 className="font-display text-balance text-[2rem] leading-[1.12] tracking-[-0.02em] text-[var(--foreground)] md:text-[3rem]">
            Write faster in all your apps
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-[16px] leading-[1.65] text-[var(--foreground-muted)]">
            Seamless speech-to-text in every application on your Mac — Gmail,
            Slack, Cursor, and everywhere else you type.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-14 max-w-xl"
        >
          <VoiceMorph />
        </motion.div>

        <p className="mt-8 text-center text-[13px] text-[var(--foreground-faint)]">
          No plugins · No browser extensions · One hotkey everywhere
        </p>
      </div>
    </section>
  );
}
