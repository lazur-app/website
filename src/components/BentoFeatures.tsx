"use client";

import { motion } from "framer-motion";
import { BulletRevealList } from "./BulletRevealList";

export function BentoFeatures() {
  return (
    <section id="smart-rewrite" className="relative px-6 py-20 md:py-28">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mb-12 max-w-lg md:mb-16"
        >
          <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--foreground-faint)]">
            Smart Rewrite
          </p>
          <h2 className="font-display text-[1.75rem] font-semibold tracking-tight text-[var(--foreground)] md:text-4xl">
            Context-aware rewrites.
            <br />
            Not copy-paste.
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-[var(--foreground-muted)]">
            Hover a feature to preview how Lazur shapes your words in each app.
          </p>
        </motion.div>

        <BulletRevealList />
      </div>
    </section>
  );
}
