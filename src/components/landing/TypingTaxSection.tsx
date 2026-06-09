"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Keyboard, Mic } from "lucide-react";
import { SoftCard } from "../SoftCard";

const APPS = ["Slack", "Gmail", "Notion", "Cursor"];

const keyboardSteps = [
  "Open the app",
  "Type it out",
  "Switch apps",
  "Type it again",
];

function AppPills({ lit = false, delay = 0 }: { lit?: boolean; delay?: number }) {
  return (
    <div className="flex flex-wrap gap-2">
      {APPS.map((app, i) => (
        <motion.span
          key={app}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + i * 0.06, duration: 0.4 }}
          className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
            lit
              ? "bg-[var(--foreground)]/10 text-[var(--foreground)]/78"
              : "bg-[var(--background-deep)] text-[var(--foreground-faint)]"
          }`}
        >
          {app}
        </motion.span>
      ))}
    </div>
  );
}

function TypingBars({
  count,
  short,
  inView,
  delay,
}: {
  count: number;
  short?: boolean;
  inView: boolean;
  delay: number;
}) {
  const widths = short ? [0.55, 0.4, 0.48] : [0.7, 0.5, 0.62, 0.38];

  return (
    <div className="space-y-2">
      {widths.slice(0, count).map((w, i) => (
        <motion.div
          key={i}
          initial={{ scaleX: 0, opacity: 0.3 }}
          animate={inView ? { scaleX: 1, opacity: 1 } : {}}
          transition={{
            delay: delay + i * 0.12,
            duration: 0.45,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="h-2 origin-left rounded-full bg-[var(--foreground-faint)]/55"
          style={{ width: `${w * 100}%` }}
        />
      ))}
    </div>
  );
}

export function TypingTaxSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="voice-era" ref={ref} className="px-6 py-12 md:py-16">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 text-center md:mb-10"
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--foreground-faint)]">
            Outdated default
          </p>
          <h2 className="mx-auto mt-2 max-w-2xl font-display text-[1.75rem] font-semibold leading-[1.12] tracking-[-0.03em] text-[var(--foreground)] md:text-[2.75rem]">
            You think in speech.
            <br />
            Apps still ask you to type.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-[var(--foreground-muted)]">
            The keyboard made sense when writing meant sitting at a desk. Now you
            jump between a dozen apps — and retype the same idea every time.
            Voice is the faster input. Lazur makes it read like you wrote it.
          </p>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-2 md:gap-5">
          {/* Old way — keyboard */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <SoftCard hover={false} className="relative h-full overflow-hidden p-6 md:p-7">
              <div className="absolute inset-0 bg-[var(--background-deep)]/20" aria-hidden />
              <div className="relative">
                <div className="mb-5 flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--background-deep)] text-[var(--foreground-faint)]">
                    <Keyboard className="h-4 w-4" strokeWidth={1.75} />
                  </div>
                  <div>
                    <p className="text-[15px] font-semibold text-[var(--foreground-muted)]">
                      Keyboard
                    </p>
                    <p className="text-[12px] text-[var(--foreground-faint)]">
                      Slow · manual · repeated
                    </p>
                  </div>
                </div>

                <ol className="mb-5 space-y-2">
                  {keyboardSteps.map((step, i) => (
                    <motion.li
                      key={step}
                      initial={{ opacity: 0, x: -8 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.2 + i * 0.08 }}
                      className="flex items-center gap-2 text-[13px] text-[var(--foreground-faint)]"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--background-deep)] text-[10px] font-semibold">
                        {i + 1}
                      </span>
                      {step}
                    </motion.li>
                  ))}
                </ol>

                <AppPills delay={0.35} />
                <div className="mt-4 rounded-xl bg-[var(--background-deep)]/50 p-3">
                  <TypingBars count={4} inView={inView} delay={0.45} />
                  <p className="mt-3 text-[11px] text-[var(--foreground-faint)]">
                    Same thought, typed four separate times
                  </p>
                </div>
              </div>
            </SoftCard>
          </motion.div>

          {/* New way — voice */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <SoftCard interactive hover className="relative h-full p-6 md:p-7">
              <div className="mb-5 flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--foreground)] text-[var(--background)]">
                  <Mic className="h-4 w-4" strokeWidth={1.75} />
                </div>
                <div>
                  <p className="text-[15px] font-semibold text-[var(--foreground)]/78">
                    Voice with lazur
                  </p>
                  <p className="text-[12px] text-[var(--foreground-muted)]">
                    Fast · natural · polished
                  </p>
                </div>
              </div>

              <div className="mb-5 flex items-center gap-3">
                <div className="flex items-center gap-2 rounded-full bg-[var(--background-deep)] px-3 py-1.5 text-[12px] font-medium text-[var(--foreground-muted)]">
                  <Mic className="h-3 w-3" strokeWidth={2} />
                  Speak once
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-[var(--foreground-faint)]" />
                <span className="text-[12px] font-medium text-[var(--foreground)]/72">
                  Done
                </span>
              </div>

              <AppPills lit delay={0.3} />
              <div className="mt-4 rounded-xl bg-[var(--background-deep)]/45 p-3">
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={inView ? { scaleX: 1 } : {}}
                  transition={{ delay: 0.5, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="h-2 origin-left rounded-full bg-[var(--foreground)]/55"
                  style={{ width: "92%" }}
                />
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={inView ? { scaleX: 1 } : {}}
                  transition={{ delay: 0.62, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-2 h-2 origin-left rounded-full bg-[var(--foreground)]/45"
                  style={{ width: "78%" }}
                />
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={inView ? { scaleX: 1 } : {}}
                  transition={{ delay: 0.72, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-2 h-2 origin-left rounded-full bg-[var(--foreground)]/38"
                  style={{ width: "65%" }}
                />
                <p className="mt-3 text-[11px] text-[var(--foreground-muted)]">
                  One pass of speech → polished text everywhere
                </p>
              </div>
            </SoftCard>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.55, duration: 0.5 }}
          className="mt-8 text-center text-[14px] font-medium text-[var(--foreground)]/70"
        >
          The keyboard isn&apos;t wrong — it&apos;s just outdated for how you work
          today.
        </motion.p>
      </div>
    </section>
  );
}
