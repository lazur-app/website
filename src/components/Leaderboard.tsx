"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Crown, Loader2, Medal, Search, TrendingUp, Users } from "lucide-react";
import {
  fetchLeaderboard,
  getMyReferralCode,
  type LeaderboardData,
  type LeaderboardEntry,
} from "@/lib/waitlist";

const PRIZES: Record<number, string> = {
  1: "$100",
  2: "$50",
  3: "$10",
};

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

function PodiumCard({
  user,
  place,
  height,
}: {
  user: ReturnType<typeof toRow>;
  place: 1 | 2 | 3;
  height: string;
}) {
  const order =
    place === 1 ? "order-1 md:order-2" : place === 2 ? "order-2 md:order-1" : "order-3";
  const isFirst = place === 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: place * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`flex flex-col items-center ${order}`}
    >
      <div className="mb-4 flex flex-col items-center text-center">
        <div
          className={`mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-sm font-bold text-white shadow-lg ${avatarGradient(place)}`}
        >
          {initials(user.name)}
        </div>
        {user.prize && (
          <span
            className={`mb-1 text-[10px] font-bold uppercase tracking-[0.14em] ${
              isFirst ? "text-[var(--brand)]" : "text-[var(--foreground-faint)]"
            }`}
          >
            {user.prize}
          </span>
        )}
        <span className="font-display text-base font-semibold tracking-tight text-[var(--foreground)]">
          {user.isYou ? "You" : user.name}
        </span>
        <span className="mt-0.5 text-xs font-medium text-[var(--foreground-muted)]">
          {user.invites} {user.invites === 1 ? "invite" : "invites"}
        </span>
      </div>

      <div
        className={`relative flex w-full max-w-[11rem] items-end justify-center rounded-t-3xl ${height} ${
          isFirst
            ? "bg-gradient-to-t from-[#4c3d99] via-[#6b4bfc] to-[#a855f7] shadow-xl shadow-[var(--brand-glow)]"
            : place === 2
              ? "bg-gradient-to-t from-stone-400 to-stone-300"
              : "border border-[var(--border)] bg-[var(--surface-solid)]"
        }`}
      >
        <span
          className={`pb-4 font-display text-4xl font-bold ${
            isFirst ? "text-white/90" : place === 2 ? "text-white/80" : "text-[var(--foreground-faint)]"
          }`}
        >
          {place}
        </span>
        {isFirst && (
          <div className="absolute -right-2 -top-3 flex items-center gap-1 rounded-full bg-[#f97316] px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white shadow-lg">
            <Crown className="h-3 w-3" />
            Top
          </div>
        )}
      </div>
    </motion.div>
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
    [data, myCode]
  );

  const filtered = useMemo(() => {
    const q = normalizeSearchQuery(query);
    if (!q) return users;
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.referralCode.toLowerCase().includes(q)
    );
  }, [query, users]);

  const topThree = users.slice(0, 3);

  if (loading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center px-6">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--brand)]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-lg px-6 py-16 text-center">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 px-6">
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          {
            label: "Total invites",
            value: (data?.total_referrals ?? 0).toLocaleString(),
            icon: Users,
          },
          {
            label: "Active referrers",
            value: (data?.active_referrers ?? 0).toLocaleString(),
            icon: TrendingUp,
          },
          { label: "Prize pool", value: "$160", icon: Medal },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="glass flex items-center gap-3 rounded-2xl px-4 py-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--brand-soft)] text-[var(--brand)]">
              <stat.icon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--foreground-faint)]">
                {stat.label}
              </p>
              <p className="font-display text-lg font-semibold text-[var(--foreground)]">
                {stat.value}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {users.length > 0 ? (
        <>
          <div className="relative">
            <Search className="absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--foreground-faint)]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or referral code…"
              className="glass w-full rounded-2xl border border-[var(--border)] py-3.5 pl-12 pr-5 text-[15px] font-medium text-[var(--foreground)] placeholder:text-[var(--foreground-faint)] outline-none transition-shadow focus:ring-2 focus:ring-[var(--brand)]/25"
            />
          </div>

          <div className="glass overflow-hidden rounded-3xl">
            <div className="grid grid-cols-12 gap-2 border-b border-[var(--border)] bg-[var(--background-deep)]/50 px-6 py-3.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--foreground-faint)]">
              <div className="col-span-2 sm:col-span-1">#</div>
              <div className="col-span-7 sm:col-span-8">User</div>
              <div className="col-span-3 text-right">Invites</div>
            </div>

            <div className="divide-y divide-[var(--border)]">
              {filtered.length === 0 ? (
                <p className="px-6 py-12 text-center text-sm text-[var(--foreground-muted)]">
                  No users match &ldquo;{query}&rdquo;
                </p>
              ) : (
                filtered.map((user, i) => (
                  <motion.div
                    key={user.referralCode}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className={`grid grid-cols-12 items-center gap-2 px-6 py-4 transition-colors hover:bg-[var(--brand-soft)]/40 ${
                      user.isYou ? "bg-[var(--brand-soft)]/60" : ""
                    }`}
                  >
                    <div className="col-span-2 sm:col-span-1">
                      {user.rank <= 3 ? (
                        <span
                          className={`inline-flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold ${
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
                        <span className="font-display text-sm font-semibold text-[var(--foreground-faint)]">
                          {user.rank}
                        </span>
                      )}
                    </div>

                    <div className="col-span-7 flex items-center gap-3 sm:col-span-8">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-xs font-bold text-white ${avatarGradient(user.rank)}`}
                      >
                        {initials(user.name)}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-[var(--foreground)]">
                          {user.isYou ? "You" : user.name}
                          {user.isYou && (
                            <span className="ml-2 rounded-full bg-[var(--brand-soft)] px-2 py-0.5 text-[10px] font-semibold text-[var(--brand-ink)]">
                              Your rank
                            </span>
                          )}
                        </p>
                        <p className="mt-0.5 truncate text-[11px] text-[var(--foreground-faint)]">
                          Code: {user.referralCode}
                        </p>
                      </div>
                    </div>

                    <div className="col-span-3 text-right">
                      <span className="font-display text-base font-semibold text-[var(--foreground)]">
                        {user.invites}
                      </span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {topThree.length > 0 && (
            <div className="flex flex-col items-end justify-center gap-3 pt-2 md:flex-row md:items-end md:gap-5">
              {topThree[1] && (
                <PodiumCard user={topThree[1]} place={2} height="h-24 md:h-28" />
              )}
              {topThree[0] && (
                <PodiumCard user={topThree[0]} place={1} height="h-32 md:h-36" />
              )}
              {topThree[2] && (
                <PodiumCard user={topThree[2]} place={3} height="h-20 md:h-24" />
              )}
            </div>
          )}
        </>
      ) : (
        <div className="glass rounded-3xl px-6 py-14 text-center">
          <p className="font-display text-lg font-semibold text-[var(--foreground)]">
            No referrals yet
          </p>
          <p className="mt-2 text-sm text-[var(--foreground-muted)]">
            Join the waitlist, share your link, and you&apos;ll appear here when friends sign up.
          </p>
        </div>
      )}
    </div>
  );
}
