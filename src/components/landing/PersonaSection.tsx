"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SoftCard } from "../SoftCard";

const personas = [
  {
    id: "creators",
    label: "Creators",
    title: "For people who publish daily",
    body: "Turn voice notes into captions, threads, and scripts without staring at a blank page.",
    context: "Notion · draft",
    before: "so the main idea is users should just talk and get something good",
    after:
      "The core idea: users should speak naturally and receive polished, ready-to-use text.",
  },
  {
    id: "writers",
    label: "Writers",
    title: "For long-form thinkers",
    body: "Draft essays and articles at speaking pace — then refine with a single pass.",
    context: "Docs · chapter",
    before: "i think the opening needs to be more like hooky you know grab attention",
    after:
      "The opening needs a stronger hook — something that grabs attention immediately.",
  },
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
    id: "teams",
    label: "Teams",
    title: "For people in back-to-back meetings",
    body: "Slack updates, follow-ups, and status notes — fast, clear, on-brand.",
    context: "Slack · #product",
    before: "hey team quick update on the thing we talked about yesterday",
    after: "Quick update on yesterday's discussion — here's where we landed.",
  },
];

export function PersonaSection() {
  const [active, setActive] = useState(personas[0].id);
  const current = personas.find((p) => p.id === active) ?? personas[0];

  return (
    <section id="personas" className="landing-section landing-section--personas px-6 py-12 md:py-16">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 md:mb-10"
        >
          <h2 className="font-display text-[1.75rem] font-semibold tracking-tight text-[var(--foreground)] md:text-[2.75rem]">
            Built for how{" "}
            <span className="italic text-[var(--foreground-muted)]">you</span>{" "}
            work
          </h2>
          <p className="mt-3 max-w-lg text-[15px] text-[var(--foreground-muted)]">
            Pick your world — see what lands at your cursor.
          </p>
        </motion.div>

        <div className="mb-8 flex flex-wrap gap-2">
          {personas.map((p) => {
            const on = active === p.id;
            return (
              <motion.button
                key={p.id}
                type="button"
                onClick={() => setActive(p.id)}
                onMouseEnter={() => setActive(p.id)}
                whileHover={{ scale: 1.04, y: -1 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 450, damping: 28 }}
                className={`rounded-full px-4 py-2 text-[13px] font-medium transition-colors duration-300 ${
                  on
                    ? "bg-[var(--foreground)] text-[var(--background)] shadow-md"
                    : "bg-white/60 text-[var(--foreground-muted)] hover:bg-white hover:text-[var(--foreground)] hover:shadow-sm"
                }`}
              >
                {p.label}
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
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
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="my-4 h-px origin-left bg-[var(--border-strong)]"
                  />
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
