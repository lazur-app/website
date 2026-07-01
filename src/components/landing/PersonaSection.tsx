"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const personas = [
  {
    id: "developers",
    label: "Developers",
    icon: "/cursor-ai-48.png",
    title: "For builders in the IDE",
    body: "Dictate comments, commits, and PR descriptions in the tone your team expects.",
    context: "Cursor · handler.ts",
    snippet: "// TODO: Refactor error handling when bandwidth allows",
    mono: true,
    accent: "from-violet-500/10 to-purple-500/5",
  },
  {
    id: "founders",
    label: "Founders",
    icon: "/slack-new-50.png",
    title: "For people who move fast",
    body: "Ship updates, investor notes, and team messages without stopping to type.",
    context: "Slack · #general",
    snippet:
      "Can we push launch to next week? I think we need more time to polish.",
    accent: "from-orange-500/10 to-amber-500/5",
  },
  {
    id: "sales",
    label: "Sales",
    icon: "/gmail-50.png",
    title: "For people who live in email",
    body: "Follow-ups, proposals, and replies — fast, clear, on-brand.",
    context: "Gmail · follow-up",
    snippet:
      "Following up on my previous email — wanted to check if you had a chance to review.",
    accent: "from-sky-500/10 to-blue-500/5",
  },
  {
    id: "creators",
    label: "Creators",
    icon: "/notion.png",
    title: "For people who publish daily",
    body: "Turn voice notes into captions, threads, and scripts without staring at a blank page.",
    context: "Notion · draft",
    snippet:
      "The core idea: users speak naturally and receive polished, ready-to-use text.",
    accent: "from-emerald-500/10 to-teal-500/5",
  },
];

export function PersonaSection() {
  return (
    <section id="personas" className="bg-[var(--background-deep)]/50 px-6 py-16 md:py-24">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5 }}
          className="mb-12 max-w-2xl md:mb-16"
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--foreground-faint)]">
            Built for how you work
          </p>
          <h2 className="mt-2 font-display text-[1.75rem] font-semibold tracking-tight text-[var(--foreground)] md:text-[2.5rem]">
            For different people
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-[var(--foreground-muted)]">
            Same hotkey — tuned to how you actually write.
          </p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2">
          {personas.map((p, i) => (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className={`group flex flex-col rounded-2xl border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-card-hover)] ${
                i === 0 ? "sm:col-span-2 sm:grid sm:grid-cols-2 sm:gap-8 sm:p-8" : ""
              }`}
            >
              <div className={i === 0 ? "sm:flex sm:flex-col sm:justify-center" : ""}>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--background)]">
                    <Image
                      src={p.icon}
                      alt=""
                      width={20}
                      height={20}
                      className="h-5 w-5 object-contain"
                    />
                  </div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--foreground-faint)]">
                    {p.label}
                  </p>
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold tracking-tight text-[var(--foreground)] md:text-xl">
                  {p.title}
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-[var(--foreground-muted)]">
                  {p.body}
                </p>
              </div>

              <div
                className={`mt-5 rounded-xl bg-gradient-to-br ${p.accent} p-4 ${
                  i === 0 ? "sm:mt-0 sm:flex sm:flex-col sm:justify-center" : "mt-auto"
                }`}
              >
                <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-[var(--foreground-faint)]">
                  {p.context}
                </p>
                <p
                  className={`mt-2 text-[13px] leading-relaxed text-[var(--foreground)] ${
                    p.mono ? "font-mono" : ""
                  }`}
                >
                  {p.snippet}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
