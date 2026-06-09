"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { fetchReferralStats } from "@/lib/referrals";
import { SoftCard } from "./SoftCard";

export function ReferralCTA() {
  const [totalCount, setTotalCount] = useState<number | null>(null);

  useEffect(() => {
    fetchReferralStats()
      .then((stats) => setTotalCount(stats.total_users))
      .catch(() => setTotalCount(null));
  }, []);

  const countLabel =
    totalCount !== null && totalCount > 0
      ? `${totalCount.toLocaleString()}+ people on Lazur`
      : "Invite friends and climb the leaderboard";

  return (
    <section id="refer" className="relative px-6 pb-24 md:pb-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-lg"
      >
        <SoftCard hover={false} className="px-8 py-12 text-center md:px-12 md:py-14">
          <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--foreground-faint)]">
            Refer a friend
          </p>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-[var(--foreground)]">
            Share Lazur, earn rewards.
          </h2>
          <p className="mx-auto mt-4 max-w-sm text-[15px] leading-relaxed text-[var(--foreground-muted)]">
            {countLabel}. Get your personal referral link and compete on the
            leaderboard.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3">
            <Link
              href="/login"
              className="btn-dark inline-flex items-center justify-center gap-2 px-7 py-3.5 text-[15px]"
            >
              Get your referral link
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/leaderboard"
              className="text-[13px] font-medium text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground)]"
            >
              View the leaderboard →
            </Link>
          </div>
        </SoftCard>
      </motion.div>
    </section>
  );
}
