"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { MARQUEE_APPS } from "@/components/AppMarquee";
import { HotkeyPressDemo } from "@/components/landing/HotkeyPressDemo";
import { SoftCard } from "@/components/SoftCard";
import { LandingBand, LandingBandInner } from "@/components/landing/LandingBand";

export function WorksEverywhereSection() {
  return (
    <LandingBand
      id="works-everywhere"
      variant="light"
      className="py-16 md:py-24"
    >
      <LandingBandInner>
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14 lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
          >
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--foreground-faint)]">
              Anywhere you have a cursor
            </p>
            <h2 className="mt-2 font-display text-[1.75rem] font-semibold tracking-tight text-[var(--foreground)] md:text-[2.75rem]">
              One hotkey. Every app.
            </h2>
            <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-[var(--foreground-muted)]">
              System-wide on macOS. Hold ⌃ Space, speak, release — polished text
              lands where you&apos;re already working.
            </p>

            <SoftCard hover={false} className="mt-8 p-5 md:p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--foreground-faint)]">
                  Works in your stack
                </p>
                <p className="text-[11px] text-[var(--foreground-faint)]">
                  No plugins required
                </p>
              </div>
              <ul className="grid grid-cols-4 gap-2 sm:grid-cols-4 sm:gap-3">
                {MARQUEE_APPS.map((app, i) => (
                  <motion.li
                    key={app.name}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.04, duration: 0.35 }}
                  >
                    <div
                      className="flex flex-col items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--background-deep)]/35 px-2 py-3 transition-colors hover:border-[var(--border-strong)] hover:bg-white"
                      title={app.name}
                    >
                      <Image
                        src={app.icon}
                        alt={app.name}
                        width={28}
                        height={28}
                        className="h-7 w-7 object-contain"
                      />
                      <span className="w-full truncate text-center text-[10px] font-medium text-[var(--foreground-muted)]">
                        {app.name}
                      </span>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </SoftCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08, duration: 0.45 }}
            className="lg:pt-2"
          >
            <SoftCard
              hover={false}
              className="mx-auto max-w-sm border-[var(--border-strong)]/60 bg-white/95 p-6 md:p-8 lg:max-w-none"
            >
              <HotkeyPressDemo />
            </SoftCard>
          </motion.div>
        </div>
      </LandingBandInner>
    </LandingBand>
  );
}
