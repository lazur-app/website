"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Gift } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { ReferralCapture } from "@/components/ReferralCapture";
import { LeaderboardTable } from "@/components/Leaderboard";
import { ReferralSystem } from "@/components/ReferralSystem";
import { Footer } from "@/components/Footer";

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <ReferralCapture />
      <div className="pointer-events-none fixed inset-0 grain" aria-hidden />
      <div
        className="ambient-blob pointer-events-none fixed -left-[10%] top-[0%] h-[40vh] w-[45vw] rounded-full bg-[#e8e0ff]"
        aria-hidden
      />

      <Navbar />

      <main className="relative mx-auto max-w-6xl px-6 pb-16 pt-24 md:pt-28">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-2 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-solid)] px-3 py-1 text-[11px] font-medium text-[var(--foreground-muted)]"
            >
              <Gift className="h-3 w-3 text-[var(--brand)]" />
              Referral rewards
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04 }}
              className="font-display text-2xl font-semibold tracking-tight text-[var(--foreground)] md:text-3xl"
            >
              Climb the{" "}
              <span className="gradient-word">leaderboard</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="mt-1.5 text-[13px] text-[var(--foreground-muted)]"
            >
              Share your link and move up the ranks.
            </motion.p>
          </div>
          <Link
            href="/login"
            className="btn-primary shrink-0 rounded-lg px-5 py-2 text-[13px] font-semibold"
          >
            Get your referral link
          </Link>
        </div>

        <LeaderboardTable />

        <ReferralSystem />
      </main>

      <Footer />
    </div>
  );
}
