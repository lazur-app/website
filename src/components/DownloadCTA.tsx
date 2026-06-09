"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { SoftCard } from "./SoftCard";

export function DownloadCTA() {
  return (
    <section className="relative px-6 py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-2xl"
      >
        <SoftCard hover={false} className="px-10 py-12 text-center md:px-16 md:py-14">
          <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--foreground-faint)]">
            Get started
          </p>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-[var(--foreground)]">
            Your voice, upgraded.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-[var(--foreground-muted)]">
            Download for macOS. Hold a key, speak, release — polished text lands
            at your cursor.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3">
            <Link
              href="/download"
              className="btn-dark inline-flex items-center gap-2.5 px-7 py-3.5 text-[15px]"
            >
              <Image
                src="/apple-icon.png"
                alt=""
                width={16}
                height={16}
                className="h-4 w-4 object-contain brightness-0 invert"
              />
              Download for Mac
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground)]"
            >
              Refer a friend
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </SoftCard>
      </motion.div>
    </section>
  );
}
