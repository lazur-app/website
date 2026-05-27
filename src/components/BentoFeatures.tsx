"use client";

import { motion } from "framer-motion";
import { Wand2, Zap, Shield } from "lucide-react";

const magicExamples = [
  { app: "Slack", before: "hey team quick update on the thing", after: "Quick update for the team on project status." },
  { app: "Email", before: "just following up on my last email", after: "Following up on my previous email — wanted to check if you had a chance to review." },
  { app: "VS Code", before: "todo fix this later when we have time", after: "// TODO: Refactor error handling when bandwidth allows" },
];

const moat = [
  {
    icon: Zap,
    stat: "<200ms",
    label: "Streaming latency",
    detail: "Words appear as you speak — no waiting for a full sentence.",
  },
  {
    icon: Shield,
    stat: "Local-first",
    label: "Privacy by design",
    detail: "Your voice stays yours. Never sold, never used to train public models.",
  },
  {
    icon: Wand2,
    stat: "On-device",
    label: "STT when it matters",
    detail: "Fast local transcription with cloud polish only when you need it.",
  },
];

export function BentoFeatures() {
  return (
    <>
      {/* Magic Mode */}
      <section id="magic-mode" className="relative py-32 md:py-40">
        <div className="pointer-events-none absolute inset-0 grain" />
        <div className="relative mx-auto max-w-5xl px-6">
          <div className="max-w-2xl">
            <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--foreground-faint)]">
              Magic Mode
            </p>
            <h2 className="font-display text-balance text-3xl font-semibold tracking-tight text-[var(--foreground)] md:text-5xl">
              Context-aware rewrites.
              <br />
              <span className="gradient-word">Not copy-paste.</span>
            </h2>
            <p className="mt-5 max-w-md text-pretty text-base text-[var(--foreground-muted)]">
              Lazur reads what app you&apos;re in and shapes your words to match —
              casual in Slack, formal in email, terse in code.
            </p>
          </div>

          <div className="mt-16 space-y-6">
            {magicExamples.map((ex, i) => (
              <motion.div
                key={ex.app}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="grid gap-4 border-b border-[var(--border)] pb-6 md:grid-cols-[6rem_1fr_1fr] md:items-start md:gap-8"
              >
                <span className="text-[13px] font-semibold text-[var(--brand)]">
                  {ex.app}
                </span>
                <p className="text-[15px] leading-relaxed text-[var(--foreground-faint)] line-through decoration-[var(--border-strong)]">
                  {ex.before}
                </p>
                <p className="font-display text-[15px] font-medium leading-relaxed text-[var(--foreground)]">
                  {ex.after}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Speed / moat */}
      <section id="speed" className="relative border-t border-[var(--border)] py-32 md:py-40">
        <div className="relative mx-auto max-w-5xl px-6">
          <div className="mb-16 text-center">
            <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--foreground-faint)]">
              Built for flow state
            </p>
            <h2 className="font-display text-balance text-3xl font-semibold tracking-tight text-[var(--foreground)] md:text-5xl">
              Think faster. Write less.
            </h2>
          </div>

          <div className="grid gap-12 md:grid-cols-3 md:gap-8">
            {moat.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="text-center md:text-left"
              >
                <item.icon className="mx-auto mb-4 h-5 w-5 text-[var(--brand)] md:mx-0" />
                <p className="font-display text-3xl font-semibold text-[var(--foreground)]">
                  {item.stat}
                </p>
                <p className="mt-1 text-sm font-semibold text-[var(--foreground)]">
                  {item.label}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--foreground-muted)]">
                  {item.detail}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
