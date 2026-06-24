"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { AppleIcon } from "@/components/icons/AppleIcon";

export function FinalCtaSection() {
  return (
    <section className="bg-[var(--foreground)] px-6 py-20 text-center md:py-28">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-lg"
      >
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white p-3 shadow-[0_6px_24px_rgba(0,0,0,0.22)]">
          <Image
            src="/logo.png"
            alt="Lazur"
            width={40}
            height={40}
            className="h-full w-full object-contain"
          />
        </div>
        <h2 className="font-display text-[2rem] font-semibold tracking-tight text-[var(--background)] md:text-[2.75rem]">
          Never break your flow.
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-white/60">
          Try free on macOS — speak naturally, write everywhere.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3">
          <div className="final-cta-btn-wrap">
            <div className="final-cta-orbit rounded-full" aria-hidden>
              <div className="final-cta-orbit__ring overflow-hidden rounded-full">
                <div className="final-cta-orbit__spin final-cta-orbit__spin--trail" />
                <div className="final-cta-orbit__spin final-cta-orbit__spin--dot" />
              </div>
            </div>
            <Link href="/download" className="final-cta-btn">
              <AppleIcon className="h-5 w-5" />
              Download Free for Mac
            </Link>
          </div>
          <Link
            href="/pricing"
            className="text-[13px] font-medium text-white/50 transition-colors hover:text-white/80"
          >
            View pricing →
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
