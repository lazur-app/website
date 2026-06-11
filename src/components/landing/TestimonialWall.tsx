"use client";

import { motion } from "framer-motion";
import { SoftCard } from "../SoftCard";

const quotes = [
  {
    text: "I dictate all my Slack messages now. What used to take two minutes takes fifteen seconds.",
    name: "Alex R.",
    role: "Product lead",
  },
  {
    text: "The code comment rewrites are eerily good. Terse when they should be, detailed when they need to be.",
    name: "Jordan K.",
    role: "Engineer",
  },
  {
    text: "Finally dictation that doesn't feel like editing a transcript. It just writes like I would.",
    name: "Sam T.",
    role: "Writer",
  },
];

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
            <SoftCard interactive className="flex h-full flex-col p-7">
                <p className="flex-1 text-[15px] leading-[1.7] text-[var(--foreground)]">
                  &ldquo;{q.text}&rdquo;
                </p>
                <div className="mt-6 border-t border-[var(--border)]/60 pt-5">
                  <p className="text-[14px] font-semibold text-[var(--foreground)]">
                    {q.name}
                  </p>
                  <p className="text-[12px] text-[var(--foreground-faint)]">
                    {q.role}
                  </p>
                </div>
              </SoftCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
