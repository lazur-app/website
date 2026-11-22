"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { GlowCta } from "@/components/GlowCta";
import { AppleIcon } from "@/components/icons/AppleIcon";
import { FilmSlot } from "@/components/landing/FilmSlot";
import { Sticker } from "@/components/landing/Sticker";
import { SendMacLink } from "@/components/download/SendMacLink";
import { DownloadReassurance } from "@/components/landing/DownloadReassurance";
import { useIsMacVisitor } from "@/hooks/useIsMacVisitor";
import { useTrackInView } from "@/hooks/useTrackInView";

export function FinalCtaSection() {
  const isMac = useIsMacVisitor();
  const ref = useRef<HTMLElement>(null);
  useTrackInView(ref, "section_viewed", { section: "final_cta" });

  return (
    <section ref={ref} data-guide-section="cta" className="mt-8 bg-[var(--foreground)] px-5 py-20 text-[var(--background)] sm:px-6 md:mt-12 md:py-28">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
        className="mx-auto max-w-xl text-center"
      >
        <h2 className="font-display text-[1.7rem] font-semibold tracking-tight sm:text-[2.15rem] md:text-[2.6rem]">
           Your AI companion is your most powerful tool at work.{" "}
           <em className="font-[family-name:var(--font-garamond)] text-[1.12em] font-normal italic tracking-[-0.02em] text-white/85">Start collaborating with it.</em>
        </h2>
        <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-white/55">
          Hold a hotkey. Speak. Get the finished thing in Slack, email,
          Cursor, anywhere you type.
        </p>
        {isMac === false ? (
          // Phones and PCs: send the Mac link instead of a download that can't run here.
          <div className="mx-auto mt-8 flex max-w-md flex-col items-center gap-3 rounded-[1.25rem] bg-[var(--background)] px-4 py-5 text-[var(--foreground)] sm:px-5">
            <p className="text-[13px] text-[var(--foreground-muted)]">
              Lazur runs on Mac. Get the download link by email:
            </p>
            <SendMacLink location="home_final" variant="inline" />
          </div>
        ) : (
          <div className="mt-8 flex flex-col items-center gap-3">
            <GlowCta
              href="/download"
              eventProps={{ location: "final_cta", label: "Download free for Mac", destination: "/download", platform: isMac ? "mac" : "unknown" }}
              variant="light"
            >
              <AppleIcon />
              Download free for Mac
            </GlowCta>
            <DownloadReassurance tone="dark" />
          </div>
        )}
      </motion.div>
      <div className="relative mx-auto mt-12 max-w-3xl">
        <Sticker name="heart" size={92} rotate={-12} className="absolute -left-4 -top-10 md:-left-10" />
        <Sticker name="puzzle" size={84} rotate={12} className="absolute -bottom-6 -right-3 md:-right-9" />
        <FilmSlot label="Setup in under a minute" tone="dark" size="lg" />
        <p className="mt-3 text-center text-[12px] text-white/40">Install, sign in, and Lazur shows you around. About a minute.</p>
      </div>
    </section>
  );
}
