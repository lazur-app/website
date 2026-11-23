"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AppleIcon } from "@/components/icons/AppleIcon";
import { WindowsIcon } from "@/components/icons/WindowsIcon";
import { useIsWindowsVisitor, WINDOWS_WAITLIST_LABEL } from "@/hooks/useIsWindowsVisitor";
import { Sticker } from "@/components/landing/Sticker";
import { FounderSticker } from "@/components/landing/FounderSticker";
import { DownloadReassurance } from "@/components/landing/DownloadReassurance";
import { useTrackInView } from "@/hooks/useTrackInView";
import { track } from "@/lib/productAnalytics";
import { MAC_DOWNLOAD_URL, triggerMacDownload } from "@/lib/download";

/** The last ask, in the page's own look: paper, the lowercase heading with one serif word, the black pill, and the three of us. */
export function FinalCtaSection() {
  const ref = useRef<HTMLElement>(null);
  useTrackInView(ref, "section_viewed", { section: "final_cta" });
  const windows = useIsWindowsVisitor();
  const label = windows ? WINDOWS_WAITLIST_LABEL : "Download for Mac";

  return (
    <section ref={ref} data-guide-section="cta" className="landing-container relative pb-24 pt-8 md:pb-32">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
        className="frame-apple relative mx-auto max-w-5xl !overflow-visible px-6 pb-0 pt-16 text-center md:pt-20"
      >
        <Sticker name="heart" size={88} rotate={-12} className="absolute -left-4 -top-8 md:-left-8" />
        <Sticker name="puzzle" size={80} rotate={12} className="absolute -right-3 -top-6 md:-right-7" />
        <h2 className="mx-auto max-w-3xl font-display text-[clamp(2.3rem,4.6vw,4rem)] font-medium lowercase leading-[1] tracking-[-0.04em] text-[var(--foreground)]">
          say hi to your <span className="font-[family-name:var(--font-garamond)] text-[1.12em] font-normal italic tracking-[-0.02em]">companion</span>.
        </h2>
        <p className="mx-auto mt-5 max-w-md text-[17px] lowercase leading-snug text-[var(--foreground-muted)]">
          hold two keys and talk. it sees your screen, answers out loud and gets it done, in any app.
        </p>
        <div className="mt-9 flex flex-col items-center gap-3">
          <Link
            href="/download"
            onClick={(e) => {
              track("cta_clicked", { location: "final_cta", label, destination: MAC_DOWNLOAD_URL && !windows ? "direct_download" : "/download" });
              // Windows visitors go to the download page, which is the waitlist for them.
              if (MAC_DOWNLOAD_URL && !windows) {
                e.preventDefault();
                void triggerMacDownload();
              }
            }}
            className="inline-flex min-h-[56px] items-center gap-2.5 rounded-full bg-[#0c0b0a] px-8 text-[17px] font-bold tracking-[-0.01em] text-white shadow-[0_10px_30px_rgba(12,11,10,0.25)] transition-transform hover:scale-[1.02]"
          >
            {windows ? <WindowsIcon className="h-4 w-4" /> : <AppleIcon className="-mt-0.5 h-4 w-4" />}
            {label}
          </Link>
          {windows ? (
            <p className="text-[12.5px] leading-snug text-[var(--foreground-faint)]">Mac-only for now · we&apos;ll email you when Windows is ready</p>
          ) : (
            <DownloadReassurance tone="light" />
          )}
        </div>
        {/* The three of us, cheering along the bottom edge. */}
        <div className="mt-10 flex items-end justify-center gap-6 sm:gap-12" aria-hidden>
          <FounderSticker who="veer" pose="yay" size={130} />
          <FounderSticker who="vaidik" pose="thumbs" size={140} />
          <FounderSticker who="ayush" pose="yay" size={130} />
        </div>
      </motion.div>
    </section>
  );
}
