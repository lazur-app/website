"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { ReferralCapture } from "@/components/ReferralCapture";
import { LeaderboardTable } from "@/components/Leaderboard";
import { ReferralSystem } from "@/components/ReferralSystem";
import { Footer } from "@/components/Footer";
import { MarketingPageShell } from "@/components/MarketingPageShell";
import { HandUnderline } from "@/components/buddy/HandLoop";
import { Sticker } from "@/components/landing/Sticker";

export default function LeaderboardPage() {
  return (
    <MarketingPageShell>
      <ReferralCapture />
      <Navbar />

      <main className="relative overflow-x-clip px-4 pb-24 pt-32 sm:px-6 md:pt-40">
        <div className="pointer-events-none absolute inset-x-0 top-0 hidden h-[400px] xl:block" aria-hidden>
          <Sticker name="crown" size={92} rotate={-10} className="absolute left-[9%] top-[150px]" />
          <Sticker name="star" size={84} rotate={10} className="absolute right-[9%] top-[170px]" />
        </div>

        <div className="relative mx-auto max-w-6xl">
          <header className="mx-auto mb-16 flex max-w-3xl flex-col items-center text-center">
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[13px] font-bold uppercase tracking-[0.14em] text-[var(--foreground-muted)]"
            >
              Referral rewards
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04 }}
              className="mt-4 font-sans text-[clamp(2.4rem,5.4vw,4.6rem)] font-bold leading-[1.04] tracking-[-0.05em] text-[var(--foreground)]"
            >
              Climb the{" "}
              <span className="relative inline-block whitespace-nowrap">
                leaderboard
                <HandUnderline show color="#e11d48" delay={0.4} duration={0.9} offset={2} />
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="mt-6 max-w-[30rem] text-[clamp(1rem,1.4vw,1.12rem)] font-medium leading-snug text-[var(--foreground-muted)]"
            >
              Share your link and move up the ranks.
            </motion.p>
            <TrackedLink
              href="/login"
              eventProps={{ location: "leaderboard_header", label: "Get your referral link", destination: "/login" }}
              className="mt-8 inline-flex min-h-[52px] items-center justify-center rounded-full border-[1.5px] border-[#1c1917] bg-white px-8 text-[16px] font-bold tracking-[-0.01em] text-[#1c1917] shadow-[0_2px_0_rgba(28,25,23,0.9),0_10px_24px_-8px_rgba(28,25,23,0.18)] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_0_rgba(28,25,23,0.9),0_16px_30px_-10px_rgba(28,25,23,0.24)]"
            >
              Get your referral link
            </TrackedLink>
          </header>

          <LeaderboardTable />

          <ReferralSystem />
        </div>
      </main>

      <Footer />
    </MarketingPageShell>
  );
}
