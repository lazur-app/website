"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Download, KeyRound, Shield } from "lucide-react";
import { SoftCard } from "@/components/SoftCard";

const STEPS = [
  {
    icon: Download,
    step: "01",
    title: "Download",
    body: "Install the macOS app — under a minute on Apple Silicon.",
  },
  {
    icon: Shield,
    step: "02",
    title: "Grant permissions",
    body: "Microphone + Accessibility. We walk you through both on first launch.",
  },
  {
    icon: KeyRound,
    step: "03",
    title: "Hold ⌃ Space",
    body: "Speak in any app. Release to paste polished text at your cursor.",
  },
] as const;

export function SetupOverviewSection() {
  return (
    <section id="setup" className="bg-[var(--background-deep)]/45 px-6 py-14 md:py-20">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center md:mb-12"
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--foreground-faint)]">
            60-second setup
          </p>
          <h2 className="mt-2 font-display text-[1.75rem] font-semibold tracking-tight text-[var(--foreground)] md:text-[2.5rem]">
            Up and dictating in three steps.
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-[15px] text-[var(--foreground-muted)]">
            No plugins. No per-app extensions. One menu bar app for your whole Mac.
          </p>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-3">
          {STEPS.map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
            >
              <SoftCard hover={false} className="h-full p-6">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--brand-soft)]">
                    <item.icon
                      className="h-[18px] w-[18px] text-[var(--brand)]"
                      strokeWidth={1.75}
                    />
                  </div>
                  <span className="font-display text-[2rem] font-semibold leading-none text-[var(--foreground-faint)]/40">
                    {item.step}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold text-[var(--foreground)]">
                  {item.title}
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-[var(--foreground-muted)]">
                  {item.body}
                </p>
              </SoftCard>
            </motion.div>
          ))}
        </div>

        <p className="mt-8 text-center text-[13px] text-[var(--foreground-faint)]">
          Already installed?{" "}
          <Link
            href="/login/app"
            className="font-medium text-[var(--foreground-muted)] underline-offset-2 hover:text-[var(--foreground)] hover:underline"
          >
            Sign in to the app
          </Link>
        </p>
      </div>
    </section>
  );
}
