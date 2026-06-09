"use client";

import { motion } from "framer-motion";
import { Mic, Sparkles, Zap, Shield, Globe } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "Smart Rewrite",
    description:
      "Context-aware polish that reads your active app and shapes tone, format, and brevity automatically.",
    span: "md:col-span-2",
  },
  {
    icon: Zap,
    title: "Streaming speed",
    description: "Sub-200ms latency so words appear as you speak — no waiting, no lag.",
    span: "",
  },
  {
    icon: Mic,
    title: "Natural speech",
    description:
      "Talk like you think. Umms, false starts, and rambling get cleaned up in real time.",
    span: "",
  },
  {
    icon: Globe,
    title: "Works everywhere",
    description:
      "Menu bar app that types wherever your cursor is. No plugins or extensions required.",
    span: "",
  },
  {
    icon: Shield,
    title: "Private by design",
    description:
      "Local-first architecture with on-device STT when it matters. Your voice stays yours.",
    span: "md:col-span-2",
  },
];

export function FeatureShowcase() {
  return (
    <section id="features" className="relative py-24 md:py-32">
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="label mb-4">Features</p>
          <h2 className="font-display text-balance text-[2rem] leading-[1.12] tracking-[-0.02em] text-[var(--foreground)] md:text-[3rem]">
            Everything you need to stay in flow
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-[16px] leading-[1.65] text-[var(--foreground-muted)]">
            Voice dictation that feels invisible — fast, accurate, and tuned to
            every app you use.
          </p>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-3 md:gap-5">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              className={`demo-surface p-6 md:p-7 ${feature.span}`}
            >
              <feature.icon
                className="mb-4 h-5 w-5 text-[var(--brand)]"
                strokeWidth={1.75}
              />
              <h3 className="text-[17px] font-semibold tracking-[-0.01em] text-[var(--foreground)]">
                {feature.title}
              </h3>
              <p className="mt-2 text-[14px] leading-[1.65] text-[var(--foreground-muted)]">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
