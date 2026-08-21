"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Monitor } from "lucide-react";
import { AppleIcon } from "@/components/icons/AppleIcon";
import { detectPlatform, type Platform } from "@/lib/platform";

export function FinalCtaSection() {
  const [platform, setPlatform] = useState<Platform | null>(null);

  useEffect(() => {
    setPlatform(detectPlatform());
  }, []);

  const isWindows = platform === "windows";

  return (
    <section className="px-4 pb-16 pt-6 md:px-6 md:pb-24 md:pt-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="landing-container"
      >
        <div className="aura-stage px-5 py-16 md:px-10 md:py-24">
          <div className="glass-panel mx-auto max-w-xl rounded-[1.75rem] px-6 py-10 text-center md:rounded-[2rem] md:px-12 md:py-14">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--foreground-faint)]">
              · A world of ease ·
            </p>
            <h2 className="mt-4 font-display text-[1.85rem] font-semibold tracking-tight text-[var(--foreground)] md:text-[2.75rem]">
              Your voice is your most powerful tool.{" "}
              <em className="italic font-medium">Start using it.</em>
            </h2>
            <div className="mt-8 flex flex-col items-center gap-3">
              <Link
                href={isWindows ? "/exclusive-access" : "/download"}
                className="btn-dark inline-flex min-h-[48px] items-center justify-center gap-2 px-7 text-[15px]"
              >
                {isWindows ? (
                  <>
                    <Monitor className="h-5 w-5" strokeWidth={2} />
                    Get notified for Windows
                  </>
                ) : (
                  <>
                    <AppleIcon className="h-5 w-5" />
                    Download for Mac — free
                  </>
                )}
              </Link>
              <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--foreground-faint)]">
                {isWindows ? (
                  <Link
                    href="/download"
                    className="font-medium text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                  >
                    Have a Mac? Download →
                  </Link>
                ) : (
                  "macOS · 7-day Pro trial · no credit card"
                )}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
