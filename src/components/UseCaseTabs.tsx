"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const useCases = [
  {
    id: "developer",
    label: "Developers",
    context: "Cursor · api/handler.ts",
    raw: "todo fix this later when we have time",
    polished: "// TODO: Refactor error handling when bandwidth allows",
    mono: true,
  },
  {
    id: "teams",
    label: "Teams",
    context: "Slack · #product",
    raw: "hey team quick update on the thing we talked about",
    polished: "Quick update for the team on project status.",
    mono: false,
  },
  {
    id: "email",
    label: "Email",
    context: "Gmail · compose",
    raw: "just following up on my last email about the proposal",
    polished:
      "Following up on my previous email — wanted to check if you had a chance to review the proposal.",
    mono: false,
  },
  {
    id: "writing",
    label: "Writing",
    context: "Notion · draft",
    raw: "so the main idea is that users should be able to just talk and get something good",
    polished:
      "The core idea: users should be able to speak naturally and receive polished, ready-to-use text.",
    mono: false,
  },
];

export function UseCaseTabs() {
  const [active, setActive] = useState(0);
  const current = useCases[active];

  return (
    <section id="use-cases" className="relative border-t border-[var(--border)] py-24 md:py-32">
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="label mb-4">Use cases</p>
          <h2 className="font-display text-balance text-[2rem] leading-[1.12] tracking-[-0.02em] text-[var(--foreground)] md:text-[3rem]">
            Built for how you actually work
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-[16px] leading-[1.65] text-[var(--foreground-muted)]">
            Lazur adapts to the app you&apos;re in — terse in code, casual in
            Slack, formal in email.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {useCases.map((uc, i) => (
            <button
              key={uc.id}
              type="button"
              onClick={() => setActive(i)}
              className={`rounded-full px-4 py-2 text-[13px] font-medium transition-all ${
                i === active
                  ? "bg-[var(--foreground)] text-white"
                  : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
              }`}
            >
              {uc.label}
            </button>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mt-10 max-w-3xl"
        >
          <div className="demo-surface overflow-hidden">
            <div className="flex items-center gap-2 border-b border-[var(--border-strong)] bg-[#f8f6f2] px-4 py-2.5 sm:px-5">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              </div>
              <span className="text-[12px] font-medium text-[var(--foreground-muted)]">
                {current.context}
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="grid gap-0 md:grid-cols-2"
              >
                <div className="border-b border-[var(--border)] p-5 sm:p-6 md:border-b-0 md:border-r">
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--foreground-faint)]">
                    You speak
                  </p>
                  <p
                    className={`text-[14px] leading-[1.7] text-[var(--foreground-faint)] line-through decoration-[var(--border-strong)] sm:text-[15px] ${
                      current.mono ? "font-mono" : ""
                    }`}
                  >
                    {current.raw}
                  </p>
                </div>
                <div className="p-5 sm:p-6">
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--foreground-faint)]">
                    Lazur writes
                  </p>
                  <p
                    className={`text-[14px] font-medium leading-[1.7] text-[var(--foreground)] sm:text-[15px] ${
                      current.mono ? "font-mono" : ""
                    }`}
                  >
                    {current.polished}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
