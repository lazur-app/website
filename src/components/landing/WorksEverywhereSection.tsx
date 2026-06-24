"use client";

import { motion } from "framer-motion";
import { AppMarquee } from "@/components/AppMarquee";

const SIGNALS = [
  { value: "⌃ Space", label: "One hotkey" },
  { value: "Any app", label: "System-wide" },
  { value: "Local STT", label: "On-device first" },
] as const;

export function WorksEverywhereSection() {
  return (
    <section id="works-everywhere" className="relative -mt-[100px] px-6 pt-[140px] pb-16 md:pt-[160px] md:pb-20">
      <div className="mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--foreground-faint)]">
            Works everywhere
          </p>
          <h2 className="mt-2 font-display text-[1.75rem] font-semibold tracking-tight text-[var(--foreground)] md:text-[2.5rem]">
            One hotkey. Every app you use.
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-[15px] leading-relaxed text-[var(--foreground-muted)]">
            Slack, Gmail, Notion, Cursor, Chrome — lazur writes where your
            cursor already is.
          </p>
        </motion.div>

        <div className="mx-auto mt-10 max-w-2xl">
          <AppMarquee />
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-10 border-t border-[var(--border)] pt-10">
          {SIGNALS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-2xl font-semibold text-[var(--foreground)] md:text-3xl">
                {s.value}
              </p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--foreground-faint)]">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
