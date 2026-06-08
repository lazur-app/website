"use client";

import { motion } from "framer-motion";
import { Mic, Wand2, ClipboardPaste } from "lucide-react";
import { VoiceMorph } from "./VoiceMorph";

const steps = [
  {
    icon: Mic,
    step: "01",
    title: "Hold & speak",
    description:
      "Press ⌃ Space anywhere on your Mac. Talk like you're explaining to a friend — messy is fine.",
  },
  {
    icon: Wand2,
    step: "02",
    title: "AI rewrites",
    description:
      "Smart Rewrite reads your active app and shapes your words to the right format and tone.",
  },
  {
    icon: ClipboardPaste,
    step: "03",
    title: "Release & paste",
    description:
      "Let go of the key. Polished text lands at your cursor — no copy-paste, no app switching.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative border-t border-[var(--border)] py-20 md:py-28"
    >
      <div className="pointer-events-none absolute inset-0 grain opacity-40" />

      <div className="relative mx-auto max-w-7xl px-8 lg:px-14 xl:px-16">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-12 xl:gap-16">
          <div>
            <div className="mb-10 max-w-xl md:mb-12">
              <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--foreground-faint)]">
                How it works
              </p>
              <h2 className="font-display text-balance text-3xl font-semibold tracking-tight text-[var(--foreground)] md:text-[2.75rem]">
                Three beats to flow state.
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-[var(--foreground-muted)]">
                No plugins. No switching apps. Lazur lives in your menu bar and
                writes wherever your cursor is.
              </p>
            </div>

            <div className="flex max-w-xl flex-col gap-8">
              {steps.map((step, i) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: i * 0.08, duration: 0.45 }}
                >
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--brand)] text-white">
                      <step.icon className="h-4 w-4" />
                    </div>
                    <span className="text-[11px] font-semibold uppercase tracking-widest text-[var(--foreground-faint)]">
                      Step {step.step}
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-semibold tracking-tight text-[var(--foreground)]">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--foreground-muted)]">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-auto w-full max-w-[18rem] sm:max-w-[19rem] lg:sticky lg:top-28 lg:mx-0 lg:max-w-[20rem] xl:max-w-[21rem]"
          >
            <VoiceMorph />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
