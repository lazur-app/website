"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const EXAMPLES = [
  {
    id: "slack",
    label: "Slack",
    icon: "/slack-new-50.png",
    title: "Team update",
    before: "hey team quick update on the thing",
    after: "Quick update for the team on project status.",
    featured: true,
  },
  {
    id: "gmail",
    label: "Gmail",
    icon: "/gmail-50.png",
    title: "Follow-up",
    before: "just following up on my last email wanted to check in",
    after:
      "Following up on my previous email — wanted to check if you had a chance to review.",
  },
  {
    id: "cursor",
    label: "Cursor",
    icon: "/cursor-ai-48.png",
    title: "PR description",
    before: "this pr adds auth and fixes the login bug",
    after: "This PR adds authentication and fixes the login redirect bug.",
    mono: true as const,
  },
] as const;

function ExampleBubble({
  app,
  spoken,
  polished,
  mono,
  delay = 0,
}: {
  app: (typeof EXAMPLES)[number];
  spoken: string;
  polished: string;
  mono?: boolean;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] }}
      className="flex gap-4"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-white shadow-sm">
        <Image
          src={app.icon}
          alt=""
          width={18}
          height={18}
          className="h-[18px] w-[18px] object-contain"
        />
      </div>

      <div className="min-w-0 flex-1 space-y-2.5">
        <div className="flex items-baseline gap-2">
          <span className="text-[13px] font-semibold text-[var(--foreground)]">
            {app.label}
          </span>
          <span className="text-[11px] text-[var(--foreground-faint)]">
            {app.title}
          </span>
        </div>

        <div className="max-w-md rounded-2xl rounded-tl-md bg-[var(--background-deep)] px-4 py-3">
          <p className="text-[14px] italic leading-relaxed text-[var(--foreground-muted)]">
            &ldquo;{spoken}&rdquo;
          </p>
        </div>

        <div
          className={`ml-6 max-w-md rounded-2xl rounded-tr-md border border-[var(--brand)]/14 bg-[var(--brand-soft)] px-4 py-3 ${
            mono ? "font-mono text-[13px]" : ""
          }`}
        >
          <p className="text-[14px] leading-relaxed text-[var(--foreground)]">
            {polished}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export function RealExamplesSection() {
  return (
    <section
      id="examples"
      className="border-t border-[var(--border)] px-6 py-16 md:py-24"
    >
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5 }}
            className="lg:sticky lg:top-28"
          >
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--foreground-faint)]">
              Real examples
            </p>
            <h2 className="mt-2 font-display text-[1.75rem] font-semibold tracking-tight text-[var(--foreground)] md:text-[2.75rem] md:leading-[1.08]">
              Messy speech becomes writing you&apos;d actually send.
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-[var(--foreground-muted)]">
              Hold the key, ramble naturally, release — lazur lands polished
              text in whatever app you&apos;re already in.
            </p>
            <p className="mt-6 hidden text-[12px] font-medium uppercase tracking-[0.12em] text-[var(--foreground-faint)] lg:block">
              Spoken ↓ · Lazur ↓
            </p>
          </motion.div>

          <div className="relative space-y-10">
            <div
              className="absolute bottom-4 left-[17px] top-4 hidden w-px bg-gradient-to-b from-[var(--border)] via-[var(--brand)]/25 to-[var(--border)] lg:block"
              aria-hidden
            />

            {EXAMPLES.map((ex, i) => (
              <ExampleBubble
                key={ex.id}
                app={ex}
                spoken={ex.before}
                polished={ex.after}
                mono={"mono" in ex ? ex.mono : false}
                delay={i * 0.06}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
