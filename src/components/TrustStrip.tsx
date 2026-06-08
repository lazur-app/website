"use client";

import { motion } from "framer-motion";
import { Zap, Shield, Wand2 } from "lucide-react";

const items = [
  { icon: Zap, stat: "<200ms", label: "Streaming latency" },
  { icon: Shield, stat: "Local-first", label: "Privacy by design" },
  { icon: Wand2, stat: "On-device", label: "STT when it matters" },
];

export function TrustStrip() {
  return (
    <section
      id="speed"
      className="relative border-y border-[var(--border)] bg-[var(--background-deep)]/50 py-8 md:py-10"
    >
      <div className="mx-auto grid max-w-6xl gap-6 px-6 md:grid-cols-3 md:gap-4">
        {items.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06, duration: 0.35 }}
            className={`flex items-center gap-3.5 ${
              i === 0
                ? "md:justify-start"
                : i === 2
                  ? "md:justify-end"
                  : "md:justify-center"
            }`}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--border-strong)] bg-white">
              <item.icon className="h-4 w-4 text-[var(--brand)]" />
            </div>
            <div>
              <p className="font-display text-base font-semibold text-[var(--foreground)]">
                {item.stat}
              </p>
              <p className="text-[13px] text-[var(--foreground-muted)]">
                {item.label}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
