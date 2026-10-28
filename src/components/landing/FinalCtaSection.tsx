"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Monitor } from "lucide-react";
import { GlowCta } from "@/components/GlowCta";
import { AppleIcon } from "@/components/icons/AppleIcon";
import { detectPlatform, type Platform } from "@/lib/platform";

export function FinalCtaSection() {
  const [platform, setPlatform] = useState<Platform | null>(null);

  useEffect(() => {
    setPlatform(detectPlatform());
  }, []);

  const isWindows = platform === "windows";

  return (
    <section data-guide-section="cta" className="mt-8 bg-[var(--foreground)] px-5 py-20 text-[var(--background)] sm:px-6 md:mt-12 md:py-28">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
        className="mx-auto max-w-xl text-center"
      >
        <h2 className="font-display text-[1.7rem] font-semibold tracking-tight sm:text-[2.15rem] md:text-[2.6rem]">
           Your AI buddy is your most powerful tool at work.{" "}
           <em className="italic font-medium text-white/80">Start collaborating with it.</em>
        </h2>
        <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-white/55">
          Hold a hotkey. Speak. Get the finished thing in Slack, email,
          Cursor, anywhere you type.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3">
          <GlowCta
            href="/download"
            variant="light"
          >
            Download for Mac
          </GlowCta>
          <p className="text-[12px] text-white/40">
            3-day Pro trial · starts when you open the app · no card needed
          </p>
        </div>
      </motion.div>
    </section>
  );
}
