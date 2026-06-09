"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { ReferralCapture } from "@/components/ReferralCapture";
import { LeaderboardTable } from "@/components/Leaderboard";
import { ReferralSystem } from "@/components/ReferralSystem";
import { Footer } from "@/components/Footer";
import { MarketingPageShell } from "@/components/MarketingPageShell";

export default function LeaderboardPage() {
  return (
    <MarketingPageShell>
      <ReferralCapture />
      <Navbar />

      <main className="relative mx-auto max-w-6xl px-6 pb-16 pt-24 md:pt-28">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-3 text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--foreground-faint)]"
            >
              Referral rewards
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04 }}
              className="font-display text-3xl font-semibold tracking-[-0.03em] text-[var(--foreground)] md:text-[2.75rem]"
            >
              Climb the leaderboard
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="mt-2 max-w-md text-[15px] leading-relaxed text-[var(--foreground-muted)]"
            >
              Share your link and move up the ranks.
            </motion.p>
          </div>
          <Link
            href="/login"
            className="btn-dark inline-flex shrink-0 items-center justify-center px-6 py-3 text-[14px]"
          >
            Get your referral link
          </Link>
        </div>

        <LeaderboardTable />

        <ReferralSystem />
      </main>

      <Footer />
    </MarketingPageShell>
  );
}
