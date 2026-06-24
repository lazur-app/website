"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SoftCard } from "../SoftCard";

const personas = [
  {
    id: "developers",
    label: "Developers",
    title: "For builders in the IDE",
    body: "Dictate comments, commits, and PR descriptions in the tone your team expects.",
    context: "Cursor · handler.ts",
    before: "todo fix this later when we have time",
    after: "// TODO: Refactor error handling when bandwidth allows",
    mono: true,
  },
  {
    id: "founders",
    label: "Founders",
    title: "For people who move fast",
    body: "Ship updates, investor notes, and team messages without stopping to type.",
    context: "Slack · #general",
    before: "can we push the launch to next week i think we need more time",
    after: "Can we push launch to next week? I think we need more time to polish.",
  },
  {
    id: "sales",
    label: "Sales",
    title: "For people who live in email",
    body: "Follow-ups, proposals, and replies — fast, clear, on-brand.",
    context: "Gmail · follow-up",
    before: "just following up on my last email wanted to check in",
    after:
      "Following up on my previous email — wanted to check if you had a chance to review.",
  },
  {
    id: "creators",
    label: "Creators",
    title: "For people who publish daily",
    body: "Turn voice notes into captions, threads, and scripts without staring at a blank page.",
    context: "Notion · draft",
    before: "so the main idea is users should just talk and get something good",
    after:
      "The core idea: users speak naturally and receive polished, ready-to-use text.",
  },
];

export function PersonaSection() {
  const [active, setActive] = useState(personas[0].id);
  const current = personas.find((p) => p.id === active) ?? personas[0];

  return (
    <section id="personas" className="px-6 py-16 md:py-20">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 text-center md:mb-10"
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--foreground-faint)]">
            Built for how you work
          </p>
          <h2 className="mt-2 font-display text-[1.75rem] font-semibold tracking-tight text-[var(--foreground)] md:text-[2.5rem]">
            For different people
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-[15px] text-[var(--foreground-muted)]">
            Pick your world — see what lands at your cursor.
          </p>
        </motion.div>

        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {personas.map((p) => {
            const on = active === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setActive(p.id)}
                className={`rounded-full px-4 py-2 text-[13px] font-medium transition-colors ${
                  on
                    ? "bg-[var(--foreground)] text-[var(--background)] shadow-md"
                    : "bg-white/60 text-[var(--foreground-muted)] hover:bg-white hover:text-[var(--foreground)]"
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            <SoftCard hover={false} className="overflow-hidden p-0">
              <div className="grid md:grid-cols-2">
                <div className="border-b border-[var(--border)]/60 p-7 md:border-b-0 md:border-r md:p-9">
                  <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--foreground-faint)]">
                    {current.label}
                  </p>
                  <h3 className="mt-3 font-display text-xl font-semibold tracking-tight text-[var(--foreground)] md:text-2xl">
                    {current.title}
                  </h3>
                  <p className="mt-3 text-[14px] leading-relaxed text-[var(--foreground-muted)]">
                    {current.body}
                  </p>
                </div>

                <div className="bg-[var(--background-deep)]/40 p-7 md:p-9">
                  <p className="mb-4 text-[11px] text-[var(--foreground-faint)]">
                    {current.context}
                  </p>
                  <p
                    className={`text-[14px] leading-relaxed text-[var(--foreground-faint)] line-through decoration-[var(--border-strong)] ${
                      current.mono ? "font-mono" : ""
                    }`}
                  >
                    {current.before}
                  </p>
                  <div className="my-4 h-px bg-[var(--border-strong)]" />
                  <p
                    className={`text-[14px] font-medium leading-relaxed text-[var(--foreground)] ${
                      current.mono ? "font-mono" : ""
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
