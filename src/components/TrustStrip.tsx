"use client";

import { motion } from "framer-motion";
import { Zap, Shield, Wand2 } from "lucide-react";
import { SoftCard } from "./SoftCard";

const items = [
  { icon: Zap, stat: "<200ms", label: "Streaming latency" },
  { icon: Shield, stat: "Local-first", label: "Privacy by design" },
  { icon: Wand2, stat: "On-device", label: "STT when it matters" },
];

export function TrustStrip() {
  return (
    <section id="speed" className="relative px-6 py-16 md:py-20">
      <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-3 md:gap-5">
        {items.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07, duration: 0.45 }}
          >
            <SoftCard className="flex items-center gap-4 p-6">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--background-deep)]">
                <item.icon
                  className="h-[18px] w-[18px] text-[var(--foreground)]"
                  strokeWidth={1.75}
                />
              </div>
              <div>
                <p className="font-display text-lg font-semibold text-[var(--foreground)]">
                  {item.stat}
                </p>
                <p className="text-[13px] text-[var(--foreground-muted)]">
                  {item.label}
                </p>
              </div>
            </SoftCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
