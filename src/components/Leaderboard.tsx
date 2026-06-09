"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, Medal, Search, TrendingUp, Users } from "lucide-react";
import { SoftCard } from "@/components/SoftCard";
import {
  fetchLeaderboard,
  getMyReferralCode,
  type LeaderboardData,
  type LeaderboardEntry,
} from "@/lib/referrals";

const PRIZES: Record<number, string> = {
  1: "$100",
  2: "$50",
  3: "$10",
};

const WEEKLY_PRIZES = [
  { place: "1st", amount: "$100" },
  { place: "2nd", amount: "$50" },
  { place: "3rd", amount: "$10" },
];

function initials(name: string) {
  return name.slice(0, 2).toUpperCase();
}

function rankBadgeClass(rank: number) {
  if (rank === 1) return "bg-[var(--foreground)] text-[var(--background)]";
  if (rank === 2) return "bg-[var(--foreground-muted)] text-white";
  if (rank === 3) return "bg-[var(--foreground-faint)] text-white";
  return "bg-[var(--background-deep)] text-[var(--foreground-muted)]";
}

function normalizeSearchQuery(value: string) {
  const base = value.trim().toLowerCase();
  if (!base) return "";

  if (base.includes("ref=")) {
    const refValue = base.split("ref=").pop() ?? "";
    return refValue.split(/[&#?\s]/)[0] ?? "";
  }

  return base
    .replace(/^https?:\/\/[^/]+\//, "")
    .replace(/^ref[:=\s-]*/, "")
    .trim();
}

function toRow(entry: LeaderboardEntry, myCode?: string) {
  return {
    rank: entry.rank,
    name: entry.display_name,
    invites: entry.referral_count,
    prize: PRIZES[entry.rank],
    isYou: myCode ? entry.referral_code === myCode : false,
    referralCode: entry.referral_code,
  };
}

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof Users;
}) {
  return (
    <SoftCard interactive className="px-5 py-4">
      <div className="flex items-center gap-2">
        <Icon className="h-3.5 w-3.5 text-[var(--foreground-faint)]" strokeWidth={1.75} />
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--foreground-faint)]">
          {label}
        </p>
      </div>
      <p className="mt-2 font-display text-2xl font-semibold tracking-tight text-[var(--foreground)]">
        {value}
      </p>
    </SoftCard>
  );
}

export function LeaderboardTable() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [myCode, setMyCode] = useState<string | undefined>();

  useEffect(() => {
    setMyCode(getMyReferralCode());

    fetchLeaderboard()
      .then(setData)
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load leaderboard.");
      })
      .finally(() => setLoading(false));
  }, []);

  const users = useMemo(
    () => (data?.entries ?? []).map((entry) => toRow(entry, myCode)),
    [data, myCode],
  );

  const filtered = useMemo(() => {
    const q = normalizeSearchQuery(query);
    if (!q) return users;
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.referralCode.toLowerCase().includes(q),
    );
  }, [query, users]);

  if (loading) {
    return (
      <div className="flex min-h-[280px] items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-[var(--foreground-faint)]" />
      </div>
    );
  }

  if (error) {
    return (
      <SoftCard hover={false} className="px-6 py-12 text-center">
        <p className="text-[14px] text-red-600">{error}</p>
      </SoftCard>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[12.5rem_minmax(0,1fr)] lg:gap-8">
      <aside className="space-y-3">
        <StatCard
          label="Total invites"
          value={(data?.total_referrals ?? 0).toLocaleString()}
          icon={Users}
        />
        <StatCard
          label="Active referrers"
          value={(data?.active_referrers ?? 0).toLocaleString()}
          icon={TrendingUp}
        />
        <StatCard label="Prize pool" value="$160" icon={Medal} />

        <SoftCard hover={false} className="px-5 py-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--foreground-faint)]">
            Weekly prizes
          </p>
          <div className="mt-3 space-y-2">
            {WEEKLY_PRIZES.map((p) => (
              <div key={p.place} className="flex items-center justify-between text-[13px]">
                <span className="font-medium text-[var(--foreground-muted)]">{p.place}</span>
                <span className="font-display font-semibold text-[var(--foreground)]">
                  {p.amount}
                </span>
              </div>
            ))}
          </div>
        </SoftCard>

        <Link
          href="/login"
          className="btn-dark hidden w-full justify-center lg:inline-flex"
        >
          Get referral link
        </Link>
      </aside>

      <div className="min-w-0 space-y-3">
      {users.length > 0 ? (
        <>
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--foreground-faint)]"
              strokeWidth={1.75}
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name or code…"
              className="soft-card w-full py-3 pl-11 pr-4 text-[14px] text-[var(--foreground)] placeholder:text-[var(--foreground-faint)] outline-none transition-shadow focus:ring-2 focus:ring-[var(--foreground)]/8"
            />
          </div>

          <SoftCard hover={false} className="overflow-hidden p-0">
            <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--foreground-faint)]">
              <span>Rank · User</span>
              <span>Invites</span>
            </div>

            <div className="divide-y divide-[var(--border)]">
              {filtered.length === 0 ? (
                <p className="px-5 py-12 text-center text-[14px] text-[var(--foreground-muted)]">
                  No users match &ldquo;{query}&rdquo;
                </p>
              ) : (
                filtered.map((user, i) => (
                  <motion.div
                    key={user.referralCode}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: Math.min(i * 0.02, 0.3) }}
                    className={`flex items-center justify-between gap-4 px-5 py-3.5 transition-colors hover:bg-[var(--background-deep)]/35 ${
                      user.isYou ? "bg-[var(--background-deep)]/55" : ""
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold ${rankBadgeClass(user.rank)}`}
                      >
                        {user.rank}
                      </span>

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--background-deep)]/70 text-[11px] font-bold text-[var(--foreground-muted)]">
                        {initials(user.name)}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-[14px] font-medium text-[var(--foreground)]">
                          {user.isYou ? "You" : user.name}
                          {user.isYou && (
                            <span className="ml-1.5 rounded-full bg-[var(--foreground)] px-1.5 py-px text-[9px] font-semibold text-[var(--background)]">
                              you
                            </span>
                          )}
                        </p>
                        <p className="truncate text-[12px] text-[var(--foreground-faint)]">
                          {user.referralCode}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-3">
                      {user.prize && (
                        <span className="hidden rounded-full bg-[var(--background-deep)]/80 px-2 py-0.5 text-[11px] font-medium text-[var(--foreground-muted)] sm:inline">
                          {user.prize}
                        </span>
                      )}
                      <span className="font-display text-base font-semibold tabular-nums text-[var(--foreground)]">
                        {user.invites}
                      </span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </SoftCard>

          <Link
            href="/login"
            className="btn-dark inline-flex w-full justify-center lg:hidden"
          >
            Get referral link
          </Link>
        </>
      ) : (
        <SoftCard hover={false} className="px-6 py-12 text-center">
          <p className="font-display text-lg font-semibold text-[var(--foreground)]">
            No referrals yet
          </p>
          <p className="mt-2 text-[14px] text-[var(--foreground-muted)]">
            Share your link — you&apos;ll appear here when friends sign up.
          </p>
          <Link href="/login" className="btn-dark mt-6 inline-flex px-6 py-3 text-[14px]">
            Get referral link
          </Link>
        </SoftCard>
      )}
      </div>
    </div>
  );
}
