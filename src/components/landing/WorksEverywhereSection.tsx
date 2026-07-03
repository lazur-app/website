"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { AppMarquee, MARQUEE_APPS } from "@/components/AppMarquee";
import { HotkeyPressDemo } from "@/components/landing/HotkeyPressDemo";
import { LandingBand, LandingBandInner } from "@/components/landing/LandingBand";

export function WorksEverywhereSection() {
  return (
    <LandingBand id="works-everywhere" variant="muted" className="py-16 md:py-24">
      <LandingBandInner>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="text-center lg:text-left"
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--foreground-faint)]">
            Anywhere you have a cursor
          </p>
          <h2 className="mt-2 font-display text-[1.75rem] font-semibold tracking-tight text-[var(--foreground)] md:text-[2.75rem]">
            One hotkey. Every app.
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-[15px] leading-relaxed text-[var(--foreground-muted)] lg:mx-0">
            System-wide on macOS. Hold ⌃ Space, speak, release — polished text
            lands where you&apos;re already working.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.08, duration: 0.45 }}
          className="mt-10 grid items-center gap-10 lg:mt-12 lg:grid-cols-[1fr_auto] lg:gap-12"
        >
          <div className="min-w-0 overflow-hidden">
            <AppMarquee
              maskVariant="right"
              iconSize={32}
              iconClassName="h-8 w-8 shrink-0 object-contain opacity-75"
              groupClassName="gap-12 pr-12"
            />
          </div>

          <HotkeyPressDemo />
        </motion.div>

        <motion.ul
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.12, duration: 0.45 }}
          className="mt-10 grid grid-cols-4 gap-3 sm:grid-cols-8 sm:gap-4 md:mt-12"
        >
          {MARQUEE_APPS.map((app) => (
            <li
              key={app.name}
              className="flex aspect-square items-center justify-center rounded-2xl border border-[var(--border)] bg-white/90 shadow-sm transition-transform hover:scale-105"
              title={app.name}
            >
              <Image
                src={app.icon}
                alt={app.name}
                width={32}
                height={32}
                className="h-8 w-8 object-contain opacity-80"
              />
            </li>
          ))}
        </motion.ul>
      </LandingBandInner>
    </LandingBand>
  );
}
