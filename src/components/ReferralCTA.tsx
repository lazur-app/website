"use client";

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
    <section id="refer" className="relative border-t border-[var(--border)] py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 grain opacity-40" />

      <div className="relative mx-auto max-w-lg px-6 text-center">
        <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--foreground-faint)]">
          Refer a friend
        </p>
        <h2 className="font-display text-balance text-3xl font-semibold tracking-tight text-[var(--foreground)] md:text-[2.75rem]">
          Share Lazur, earn rewards.
        </h2>
        <p className="mx-auto mt-4 max-w-sm text-[15px] leading-relaxed text-[var(--foreground-muted)]">
          {countLabel}. Create an account to get your personal referral link and
          compete on the leaderboard when friends sign up.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3">
          <Link
            href="/login"
            className="btn-primary inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold"
          >
            Get your referral link
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/leaderboard"
            className="text-[13px] font-semibold text-brand hover:underline"
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
