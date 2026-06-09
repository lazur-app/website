"use client";

import { motion } from "framer-motion";
import { Mic, Sparkles, MousePointerClick } from "lucide-react";
import { SoftCard } from "./SoftCard";
import { WorksInBar } from "./WorksInBar";

const pillars = [
  {
    icon: Mic,
    step: "01",
    title: "Hold & speak",
    body: "Press ⌃ Space anywhere. Talk naturally — messy is fine.",
  },
  {
    icon: Sparkles,
    step: "02",
    title: "AI rewrites",
    body: "Context-aware polish tuned to Slack, email, code, and docs.",
  },
  {
    icon: MousePointerClick,
    step: "03",
    title: "Pastes at cursor",
    body: "Polished text lands exactly where you're typing.",
  },
];

export function ScrollStory() {
  return (
    <div className="relative -mt-6">
      <section className="relative px-6 pb-12 pt-10 md:pb-16 md:pt-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="font-display text-2xl font-semibold tracking-tight text-[var(--foreground)] md:text-[2rem]">
            Your voice, anywhere you type.
          </p>
          <p className="mx-auto mt-4 max-w-md text-[15px] leading-[1.7] text-[var(--foreground-muted)]">
            Lazur lives in your menu bar. Speak once — polished text appears at
            your cursor.
          </p>
        </motion.div>
      </section>

      <section id="how-it-works" className="px-6 pb-20 md:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mb-10 max-w-xl text-center"
        >
          <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--foreground-faint)]">
            How it works
          </p>
          <h2 className="font-display text-[1.75rem] font-semibold tracking-tight text-[var(--foreground)] md:text-4xl">
            Three beats to flow state.
          </h2>
        </motion.div>

        <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-3 md:gap-5">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
            >
              <SoftCard className="flex h-full flex-col p-7 md:p-8">
                <span className="mb-5 text-[11px] font-semibold tabular-nums tracking-widest text-[var(--foreground-faint)]">
                  {pillar.step}
                </span>
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--background-deep)]">
                  <pillar.icon
                    className="h-[18px] w-[18px] text-[var(--foreground)]"
                    strokeWidth={1.75}
                  />
                </div>
                <h3 className="font-display text-lg font-semibold tracking-tight text-[var(--foreground)]">
                  {pillar.title}
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-[var(--foreground-muted)]">
                  {pillar.body}
                </p>
              </SoftCard>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="px-6 pb-20 md:pb-24">
        <SoftCard hover={false} className="mx-auto max-w-4xl px-6 py-10 md:px-10 md:py-12">
          <WorksInBar />
          <ul className="mx-auto mt-8 flex max-w-md flex-wrap justify-center gap-x-6 gap-y-2 text-[13px] text-[var(--foreground-faint)]">
            {["No setup", "Works everywhere", "Private by default"].map(
              (label) => (
                <li key={label}>{label}</li>
              ),
            )}
          </ul>
        </SoftCard>
      </section>
    </div>
  );
}
