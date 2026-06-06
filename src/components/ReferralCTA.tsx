"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { fetchReferralStats } from "@/lib/referrals";

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
    <section id="refer" className="relative py-32 md:py-40">
      <div className="pointer-events-none absolute inset-0 grain" />
      <div
        className="ambient-blob pointer-events-none absolute left-1/2 top-1/2 h-[50vh] w-[70vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#e8e0ff]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-xl px-6 text-center">
        <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--foreground-faint)]">
          Refer a friend
        </p>
        <h2 className="font-display text-balance text-3xl font-semibold tracking-tight text-[var(--foreground)] md:text-5xl">
          Share Lazur,{" "}
          <span className="gradient-word">earn rewards.</span>
        </h2>
        <p className="mx-auto mt-5 max-w-sm text-pretty text-base text-[var(--foreground-muted)]">
          {countLabel}. Create an account to get your personal referral link and compete
          on the leaderboard when friends sign up.
        </p>

        <div className="mt-10 flex flex-col items-center gap-3">
          <Link
            href="/login"
            className="btn-primary inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-sm font-semibold"
          >
            Get your referral link
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/leaderboard"
            className="text-sm font-semibold text-brand hover:underline"
          >
            View the leaderboard
          </Link>
          <p className="text-xs text-[var(--foreground-faint)]">
            Free · No credit card · Share with friends
          </p>
        </div>
      </div>
    </section>
  );
}
