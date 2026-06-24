"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SoftCard } from "@/components/SoftCard";

const EXAMPLES = [
  {
    id: "slack",
    label: "Slack",
    title: "Slack update",
    before: "hey team quick update on the thing",
    after: "Quick update for the team on project status.",
  },
  {
    id: "gmail",
    label: "Gmail",
    title: "Professional email",
    before: "just following up on my last email wanted to check in",
    after:
      "Following up on my previous email — wanted to check if you had a chance to review.",
  },
  {
    id: "cursor",
    label: "Cursor",
    title: "PR description",
    before: "this pr adds auth and fixes the login bug",
    after: "This PR adds authentication and fixes the login redirect bug.",
    mono: true as const,
  },
] as const;

type ExampleId = (typeof EXAMPLES)[number]["id"];

export function RealExamplesSection() {
  const [activeId, setActiveId] = useState<ExampleId>("slack");
  const current = EXAMPLES.find((e) => e.id === activeId) ?? EXAMPLES[0];

  return (
    <section
      id="examples"
      className="border-t border-[var(--border)] bg-[var(--background-deep)]/50 px-6 py-16 md:py-20"
    >
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center md:mb-10">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--foreground-faint)]">
            Real examples
          </p>
          <h2 className="mt-2 font-display text-[1.75rem] font-semibold tracking-tight text-[var(--foreground)] md:text-[2.5rem]">
            Messy speech → writing you&apos;d send.
          </h2>
        </div>

        <div className="mb-6 flex flex-wrap justify-center gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex.id}
              type="button"
              onClick={() => setActiveId(ex.id)}
              className={`rounded-full px-4 py-2 text-[13px] font-medium transition-colors ${
                activeId === ex.id
                  ? "bg-[var(--foreground)] text-[var(--background)]"
                  : "bg-white/70 text-[var(--foreground-muted)] hover:bg-white hover:text-[var(--foreground)]"
              }`}
            >
              {ex.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            <SoftCard hover={false} className="p-6 md:p-8">
              <h3 className="font-display text-xl font-semibold text-[var(--foreground)]">
                {current.title}
              </h3>
              <div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center">
                <div>
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--foreground-faint)]">
                    Spoken
                  </p>
                  <p className="rounded-xl bg-[var(--background-deep)] px-4 py-3 text-[14px] italic leading-relaxed text-[var(--foreground-muted)]">
                    {current.before}
                  </p>
                </div>
                <p
                  className="hidden text-center text-[var(--foreground-faint)] md:block"
                  aria-hidden
                >
                  →
                </p>
                <div>
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--foreground-faint)]">
                    Lazur
                  </p>
                  <p
                    className={`rounded-xl border border-[var(--brand)]/12 bg-[var(--brand-soft)] px-4 py-3 text-[14px] leading-relaxed text-[var(--foreground)] ${
                      "mono" in current && current.mono ? "font-mono text-[13px]" : ""
                    }`}
                  >
                    {current.after}
                  </p>
                </div>
              </div>
            </SoftCard>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
