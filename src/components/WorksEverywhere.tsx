"use client";

import { motion } from "framer-motion";

const apps = [
  { name: "Slack", x: "8%", y: "12%", delay: 0 },
  { name: "Gmail", x: "72%", y: "8%", delay: 0.08 },
  { name: "Notion", x: "85%", y: "42%", delay: 0.16 },
  { name: "VS Code", x: "62%", y: "68%", delay: 0.24 },
  { name: "Cursor", x: "28%", y: "72%", delay: 0.32 },
  { name: "Discord", x: "5%", y: "48%", delay: 0.4 },
  { name: "Linear", x: "42%", y: "18%", delay: 0.48 },
  { name: "Chrome", x: "18%", y: "82%", delay: 0.56 },
];

export function WorksEverywhere() {
  return (
    <section className="relative overflow-hidden py-32 md:py-40">
      <div className="pointer-events-none absolute inset-0 bg-[var(--background-deep)]" />
      <div className="relative mx-auto max-w-5xl px-6 text-center">
        <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--foreground-faint)]">
          Everywhere you type
        </p>
        <h2 className="font-display text-balance text-3xl font-semibold tracking-tight text-[var(--foreground)] md:text-5xl">
          No plugins. No switching.
          <br />
          <span className="text-[var(--foreground-muted)]">Just your cursor.</span>
        </h2>
        <p className="mx-auto mt-5 max-w-md text-pretty text-base text-[var(--foreground-muted)]">
          Lazur lives in your menu bar and writes wherever you&apos;re already
          working — hold a key, speak, release.
        </p>

        <div className="relative mx-auto mt-16 h-[22rem] max-w-2xl md:h-[26rem]">
          <div
            className="pointer-events-none absolute inset-[20%] rounded-full bg-[var(--brand-glow)] blur-3xl"
            aria-hidden
          />

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="font-display text-center">
              <p className="text-5xl font-semibold text-[var(--foreground)] md:text-6xl">
                ⌃ Space
              </p>
              <p className="mt-2 text-sm text-[var(--foreground-faint)]">
                hold anywhere
              </p>
            </div>
          </div>

          {apps.map((app) => (
            <motion.span
              key={app.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: app.delay, duration: 0.5 }}
              className="absolute rounded-full border border-[var(--border)] bg-[var(--surface-solid)]/80 px-4 py-2 text-[13px] font-medium text-[var(--foreground-muted)] shadow-[var(--shadow-soft)] backdrop-blur-sm"
              style={{ left: app.x, top: app.y }}
            >
              {app.name}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}
