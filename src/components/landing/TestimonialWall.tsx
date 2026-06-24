"use client";

import { motion } from "framer-motion";
import { User } from "lucide-react";
import { SoftCard } from "../SoftCard";

const quotes = [
  {
    text: "I dictate all my Slack messages now. What used to take two minutes takes fifteen seconds.",
    name: "Alex Rivera",
    role: "Product lead",
    initials: "AR",
  },
  {
    text: "The code comment rewrites are eerily good. Terse when they should be, detailed when they need to be.",
    name: "Jordan Kim",
    role: "Engineer",
    initials: "JK",
  },
  {
    text: "Finally dictation that doesn't feel like editing a transcript. It just writes like I would.",
    name: "Sam Thompson",
    role: "Writer",
    initials: "ST",
  },
];

function AvatarPlaceholder({ initials }: { initials: string }) {
  return (
    <div
      className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[var(--border)] bg-[var(--background-deep)]"
      aria-hidden
    >
      <User
        className="absolute h-6 w-6 text-[var(--foreground-faint)] opacity-20"
        strokeWidth={1.5}
      />
      <span className="relative text-[11px] font-semibold text-[var(--foreground-muted)]">
        {initials}
      </span>
    </div>
  );
}

export function TestimonialWall() {
  return (
    <section className="landing-section landing-section--social overflow-hidden px-6 py-12 md:py-16">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 text-center md:mb-10"
        >
          <h2 className="font-display text-[1.75rem] font-semibold tracking-tight text-[var(--foreground)] md:text-[2.75rem]">
            People who type all day
          </h2>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-3 md:gap-5">
          {quotes.map((q, i) => (
            <motion.div
              key={q.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.1, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
              <SoftCard interactive className="flex h-full flex-col px-7 py-8 md:px-8 md:py-9">
                <p className="flex-1 text-[15px] leading-[1.7] text-[var(--foreground)]">
                  &ldquo;{q.text}&rdquo;
                </p>
                <div className="mt-6 flex items-center gap-3 border-t border-[var(--border)]/60 pt-5">
                  <AvatarPlaceholder initials={q.initials} />
                  <div>
                    <p className="text-[14px] font-semibold text-[var(--foreground)]">
                      {q.name}
                    </p>
                    <p className="text-[12px] text-[var(--foreground-faint)]">
                      {q.role}
                    </p>
                  </div>
                </div>
              </SoftCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
