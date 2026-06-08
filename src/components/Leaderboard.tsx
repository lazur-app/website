"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, Medal, Search, TrendingUp, Users } from "lucide-react";
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

function avatarGradient(rank: number) {
  if (rank === 1) return "from-[#6b4bfc] to-[#a855f7]";
  if (rank === 2) return "from-[#a8a29e] to-[#78716c]";
  if (rank === 3) return "from-[#f97316] to-[#fb923c]";
  return "from-[var(--background-deep)] to-[#d6d3d1]";
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

function SidebarStat({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof Users;
}) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-solid)]/80 px-3.5 py-3">
      <div className="flex items-center gap-2 text-[var(--brand)]">
        <Icon className="h-3.5 w-3.5" />
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--foreground-faint)]">
          {label}
        </p>
      </div>
      <p className="mt-1 font-display text-xl font-semibold text-[var(--foreground)]">
        {value}
      </p>
    </div>
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

  const topThree = users.slice(0, 3);

  if (loading) {
    return (
      <div className="flex min-h-[240px] items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-[var(--brand)]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[11.5rem_minmax(0,1fr)] lg:gap-8">
      {/* Left sidebar — stats & prizes */}
      <aside className="space-y-4">
        <div className="space-y-2">
          <SidebarStat
            label="Total invites"
            value={(data?.total_referrals ?? 0).toLocaleString()}
            icon={Users}
          />
          <SidebarStat
            label="Active referrers"
            value={(data?.active_referrers ?? 0).toLocaleString()}
            icon={TrendingUp}
          />
          <SidebarStat label="Prize pool" value="$160" icon={Medal} />
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-solid)]/80 p-3.5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--foreground-faint)]">
            Weekly prizes
          </p>
          <ul className="mt-2.5 space-y-2">
            {WEEKLY_PRIZES.map((p) => (
              <li
                key={p.place}
                className="flex items-center justify-between text-[13px]"
              >
                <span className="font-medium text-[var(--foreground-muted)]">
                  {p.place}
                </span>
                <span className="font-display font-semibold text-[var(--foreground)]">
                  {p.amount}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {topThree.length > 0 && (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-solid)]/80 p-3.5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--foreground-faint)]">
              Top 3
            </p>
            <ul className="mt-2.5 space-y-2.5">
              {topThree.map((user) => (
                <li key={user.referralCode} className="flex items-center gap-2">
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[10px] font-bold ${
                      user.rank === 1
                        ? "bg-[var(--brand)] text-white"
                        : user.rank === 2
                          ? "bg-stone-400 text-white"
                          : "bg-orange-400 text-white"
                    }`}
                  >
                    {user.rank}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12px] font-medium text-[var(--foreground)]">
                      {user.isYou ? "You" : user.name}
                    </p>
                    <p className="text-[11px] text-[var(--foreground-faint)]">
                      {user.invites} invites
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Link
          href="/login"
          className="hidden rounded-lg border border-[var(--border)] bg-[var(--background-deep)]/60 px-3 py-2 text-center text-[12px] font-medium text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground)] lg:block"
        >
          Get referral link →
        </Link>
      </aside>

      {/* Main — search + table */}
      <div className="min-w-0 space-y-3">
        {users.length > 0 ? (
          <>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--foreground-faint)]" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name or code…"
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-solid)]/80 py-2.5 pl-10 pr-4 text-[13px] text-[var(--foreground)] placeholder:text-[var(--foreground-faint)] outline-none transition-shadow focus:ring-2 focus:ring-[var(--brand)]/20"
              />
            </div>

            <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface-solid)]/80">
              <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--background-deep)]/50 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--foreground-faint)]">
                <span>Rank · User</span>
                <span>Invites</span>
              </div>

              <div className="divide-y divide-[var(--border)]">
                {filtered.length === 0 ? (
                  <p className="px-4 py-10 text-center text-[13px] text-[var(--foreground-muted)]">
                    No users match &ldquo;{query}&rdquo;
                  </p>
                ) : (
                  filtered.map((user, i) => (
                    <motion.div
                      key={user.referralCode}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.02 }}
                      className={`flex items-center justify-between gap-3 px-4 py-3 ${
                        user.isYou ? "bg-[var(--brand-soft)]/50" : ""
                      }`}
                    >
                      <div className="flex min-w-0 items-center gap-2.5">
                        {user.rank <= 3 ? (
                          <span
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[10px] font-bold ${
                              user.rank === 1
                                ? "bg-[var(--brand)] text-white"
                                : user.rank === 2
                                  ? "bg-stone-400 text-white"
                                  : "bg-orange-400 text-white"
                            }`}
                          >
                            {user.rank}
                          </span>
                        ) : (
                          <span className="w-6 shrink-0 text-center text-[12px] font-semibold text-[var(--foreground-faint)]">
                            {user.rank}
                          </span>
                        )}

                        <div
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-[10px] font-bold text-white ${avatarGradient(user.rank)}`}
                        >
                          {initials(user.name)}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-[13px] font-medium text-[var(--foreground)]">
                            {user.isYou ? "You" : user.name}
                            {user.isYou && (
                              <span className="ml-1.5 rounded-full bg-[var(--brand-soft)] px-1.5 py-px text-[9px] font-semibold text-[var(--brand-ink)]">
                                you
                              </span>
                            )}
                          </p>
                          <p className="truncate text-[11px] text-[var(--foreground-faint)]">
                            {user.referralCode}
                          </p>
                        </div>
                      </div>

                      <span className="shrink-0 font-display text-sm font-semibold tabular-nums text-[var(--foreground)]">
                        {user.invites}
                      </span>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-solid)]/80 px-5 py-10 text-center">
            <p className="font-display text-base font-semibold text-[var(--foreground)]">
              No referrals yet
            </p>
            <p className="mt-1.5 text-[13px] text-[var(--foreground-muted)]">
              Share your link — you&apos;ll appear here when friends sign up.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
