"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Gift } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { ReferralCapture } from "@/components/ReferralCapture";
import { LeaderboardTable } from "@/components/Leaderboard";
import { ReferralSystem } from "@/components/ReferralSystem";
import { Footer } from "@/components/Footer";

const prizes = [
  { place: "1st", amount: "$100", desc: "Most qualified invites" },
  { place: "2nd", amount: "$50", desc: "Runner-up" },
  { place: "3rd", amount: "$10", desc: "Bronze finish" },
];

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <ReferralCapture />
      <div className="pointer-events-none fixed inset-0 grain" aria-hidden />
      <div
        className="ambient-blob pointer-events-none fixed -left-[10%] top-[0%] h-[45vh] w-[50vw] rounded-full bg-[#e8e0ff]"
        aria-hidden
      />
      <div
        className="ambient-blob pointer-events-none fixed -right-[5%] top-[15%] h-[40vh] w-[45vw] rounded-full bg-[#fde8d8]"
        aria-hidden
      />

      <Navbar />

      <main className="relative pb-24 pt-28 md:pt-32">
        <section className="mx-auto max-w-4xl px-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-3 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-solid)] px-3.5 py-1 text-[11px] font-medium text-[var(--foreground-muted)]"
              >
                <Gift className="h-3.5 w-3.5 text-[var(--brand)]" />
                Referral rewards
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.04 }}
                className="font-display text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl md:text-5xl"
              >
                Climb the{" "}
                <span className="gradient-word">leaderboard</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mt-3 text-sm leading-relaxed text-[var(--foreground-muted)] md:text-base"
              >
                Share your link, invite friends, and move up the ranks.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.14 }}
              className="shrink-0"
            >
              <Link
                href="/#refer"
                className="btn-primary inline-flex rounded-full px-6 py-3 text-sm font-semibold"
              >
                Get your referral link
              </Link>
            </motion.div>
          </div>
        </section>

        <section className="mt-8">
          <LeaderboardTable />
        </section>

        <section className="mx-auto mt-16 max-w-4xl px-6">
          <div className="mb-6">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-[var(--foreground)]">
              Top prizes
            </h2>
            <p className="mt-2 text-sm text-[var(--foreground-muted)]">
              Cash rewards for the top three referrers each week.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {prizes.map((p) => (
              <div key={p.place} className="glass rounded-2xl px-5 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--foreground-faint)]">
                  {p.place} place
                </p>
                <p className="mt-1 font-display text-2xl font-semibold text-[var(--foreground)]">
                  {p.amount}
                </p>
                <p className="mt-0.5 text-xs text-[var(--foreground-muted)]">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="rewards" className="scroll-mt-28">
          <ReferralSystem />
        </section>
      </main>

      <Footer />
    </div>
  );
}
