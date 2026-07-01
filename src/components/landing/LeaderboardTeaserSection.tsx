"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Gift, Loader2, Share2, Trophy, Users } from "lucide-react";
import { SoftCard } from "@/components/SoftCard";
import {
  fetchLeaderboard,
  type LeaderboardData,
  type LeaderboardEntry,
} from "@/lib/referrals";

const MONTHLY_PRIZES = [
  { place: "1st", amount: "$60", bonus: "+ 3 free months" },
  { place: "2nd", amount: "$40", bonus: "+ 3 free months" },
  { place: "3rd", amount: "$20", bonus: "+ 3 free months" },
] as const;

const HOW_IT_WORKS = [
  {
    icon: Share2,
    title: "Share your link",
    detail: "Every account gets a personal referral link after sign-in.",
  },
  {
    icon: Users,
    title: "Friends try Lazur",
    detail: "When they download and create an account, you get credit.",
  },
  {
    icon: Trophy,
    title: "Win monthly prizes",
    detail: "Top referrers each month take cash and free Pro or Power months.",
  },
] as const;

function initials(name: string) {
  return name.slice(0, 2).toUpperCase();
}

function rankStyles(rank: number) {
  if (rank === 1) {
    return {
      badge: "bg-[var(--foreground)] text-[var(--background)]",
      ring: "ring-[var(--foreground)]/15",
    };
  }
  if (rank === 2) {
    return {
      badge: "bg-[var(--foreground-muted)] text-white",
      ring: "ring-[var(--border-strong)]",
    };
  }
  if (rank === 3) {
    return {
      badge: "bg-[var(--foreground-faint)] text-white",
      ring: "ring-[var(--border)]",
    };
  }
  return {
    badge: "bg-[var(--background-deep)] text-[var(--foreground-muted)]",
    ring: "ring-[var(--border)]",
  };
}

function TopReferrerCard({ entry }: { entry: LeaderboardEntry }) {
  const styles = rankStyles(entry.rank);
  const prize = MONTHLY_PRIZES[entry.rank - 1];

  return (
    <SoftCard
      hover={false}
      className={`flex h-full flex-col p-5 ring-1 ${styles.ring}`}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[12px] font-bold ${styles.badge}`}
        >
          {entry.rank}
        </span>
        {prize ? (
          <span className="rounded-full bg-[var(--brand-soft)] px-2.5 py-1 text-[11px] font-semibold text-[var(--brand-ink)]">
            {prize.amount}
          </span>
        ) : null}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--background-deep)] text-[12px] font-bold text-[var(--foreground-muted)]">
          {initials(entry.display_name)}
        </div>
        <div className="min-w-0">
          <p className="truncate font-display text-[15px] font-semibold text-[var(--foreground)]">
            {entry.display_name}
          </p>
          <p className="text-[12px] text-[var(--foreground-faint)]">
            {entry.referral_count} referral
            {entry.referral_count === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      {prize ? (
        <p className="mt-4 text-[12px] text-[var(--foreground-muted)]">
          {prize.place} place · {prize.bonus}
        </p>
      ) : null}
    </SoftCard>
  );
}

export function LeaderboardTeaserSection() {
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard()
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  const topThree = data?.entries.slice(0, 3) ?? [];

  return (
    <section id="leaderboard" className="px-6 py-12 md:py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 text-center md:mb-10">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--foreground-faint)]">
            Referral leaderboard
          </p>
          <h2 className="mt-2 font-display text-[1.75rem] font-semibold tracking-tight text-[var(--foreground)] md:text-[2.5rem]">
            Share Lazur. Climb the board.
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-[15px] leading-relaxed text-[var(--foreground-muted)]">
            Refer friends after you sign up. Top referrers each month win cash
            and free months on Pro or Power.
          </p>
        </div>

        <div className="mb-8 grid gap-3 sm:grid-cols-3">
          {MONTHLY_PRIZES.map((prize) => (
            <SoftCard key={prize.place} hover={false} className="px-5 py-4 text-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--foreground-faint)]">
                {prize.place} place
              </p>
              <p className="mt-1 font-display text-2xl font-semibold tracking-tight text-[var(--foreground)]">
                {prize.amount}
              </p>
              <p className="mt-1 text-[12px] text-[var(--foreground-muted)]">
                {prize.bonus}
              </p>
            </SoftCard>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-start lg:gap-10">
          <div className="space-y-5">
            {HOW_IT_WORKS.map((step) => (
              <div key={step.title} className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-white">
                  <step.icon
                    className="h-[18px] w-[18px] text-[var(--brand)]"
                    strokeWidth={1.75}
                  />
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-[var(--foreground)]">
                    {step.title}
                  </p>
                  <p className="mt-1 text-[13px] leading-relaxed text-[var(--foreground-muted)]">
                    {step.detail}
                  </p>
                </div>
              </div>
            ))}

            <div className="flex flex-wrap gap-3 pt-1">
              <Link
                href="/leaderboard"
                className="btn-dark inline-flex items-center gap-2 px-5 py-2.5 text-[13px]"
              >
                <Trophy className="h-4 w-4" strokeWidth={1.75} />
                View full leaderboard
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] px-5 py-2.5 text-[13px] font-semibold text-[var(--foreground)] transition-colors hover:border-[var(--brand)]/30"
              >
                <Gift className="h-4 w-4" strokeWidth={1.75} />
                Get your link
              </Link>
            </div>
          </div>

          <div>
            <div className="mb-4 flex items-center justify-between gap-4">
              <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[var(--foreground-faint)]">
                This month&apos;s leaders
              </p>
              {!loading && data ? (
                <p className="text-[12px] text-[var(--foreground-faint)]">
                  {data.active_referrers.toLocaleString()} active referrers ·{" "}
                  {data.total_referrals.toLocaleString()} total invites
                </p>
              ) : null}
            </div>

            {loading ? (
              <SoftCard hover={false} className="flex items-center justify-center py-16">
                <Loader2 className="h-5 w-5 animate-spin text-[var(--foreground-faint)]" />
              </SoftCard>
            ) : topThree.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                {topThree.map((entry) => (
                  <TopReferrerCard key={entry.referral_code} entry={entry} />
                ))}
              </div>
            ) : (
              <SoftCard hover={false} className="px-6 py-10 text-center">
                <Trophy
                  className="mx-auto h-8 w-8 text-[var(--foreground-faint)]"
                  strokeWidth={1.5}
                />
                <p className="mt-4 font-display text-lg font-semibold text-[var(--foreground)]">
                  The board is wide open
                </p>
                <p className="mx-auto mt-2 max-w-sm text-[14px] leading-relaxed text-[var(--foreground-muted)]">
                  Download Lazur, sign in, and share your link. First referrers
                  lock in early momentum before prizes reset each month.
                </p>
                <Link
                  href="/download"
                  className="btn-dark mt-6 inline-flex px-6 py-3 text-[14px]"
                >
                  Start your trial
                </Link>
              </SoftCard>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
