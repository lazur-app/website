"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Medal, Search, TrendingUp, Users } from "lucide-react";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { track } from "@/lib/productAnalytics";
import {
  fetchLeaderboard,
  getMyReferralCode,
  type LeaderboardData,
  type LeaderboardEntry,
} from "@/lib/referrals";

const PRIZES: Record<number, string> = {
  1: "$60 + 3 months",
  2: "$40 + 3 months",
  3: "$20 + 3 months",
};

const MONTHLY_PRIZES = [
  { place: "1st", amount: "$60 + 3 months" },
  { place: "2nd", amount: "$40 + 3 months" },
  { place: "3rd", amount: "$20 + 3 months" },
];

const SHADOW = "shadow-[0_2px_0_rgba(28,25,23,0.9),0_10px_24px_-8px_rgba(28,25,23,0.18)]";
const DARK_BUTTON =
  "inline-flex min-h-[48px] items-center justify-center rounded-full bg-[#1c1917] px-6 text-[15px] font-bold text-white transition-colors hover:bg-black";

/** An ink-outlined white card, the homepage's look. */
function InkCard({ children, className = "", radius = "rounded-[20px]" }: { children: React.ReactNode; className?: string; radius?: string }) {
  return <div className={`border-[1.5px] border-[#1c1917] bg-white ${radius} ${SHADOW} ${className}`}>{children}</div>;
}

function initials(name: string) {
  return name.slice(0, 2).toUpperCase();
}

function rankBadgeClass(rank: number) {
  if (rank === 1) return "bg-[#d6246e] text-white";
  if (rank === 2) return "bg-[#5b4bd6] text-white";
  if (rank === 3) return "bg-[#e0621c] text-white";
  return "bg-black/[0.06] text-[var(--foreground-muted)]";
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
    <InkCard className="p-4">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-[var(--foreground)]" strokeWidth={2} />
        <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-[var(--foreground-muted)]">
          {label}
        </p>
      </div>
      <p className="mt-2 text-[28px] font-bold leading-none tracking-[-0.04em] text-[var(--foreground)] tabular-nums">
        {value}
      </p>
    </InkCard>
  );
}

export function LeaderboardTable() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [myCode, setMyCode] = useState<string | undefined>();

  useEffect(() => {
    const code = getMyReferralCode();
    setMyCode(code);

    fetchLeaderboard()
      .then((next) => {
        const mine = code ? next.entries.find((entry) => entry.referral_code === code) : undefined;
        track("leaderboard_loaded", {
          location: "leaderboard_page",
          entry_count: next.entries.length,
          on_leaderboard: Boolean(mine),
          my_rank: mine?.rank ?? null,
        });
        setData(next);
      })
      .catch((err) => {
        track("leaderboard_load_failed", { location: "leaderboard_page" });
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
        <Loader2 className="h-7 w-7 animate-spin text-[var(--foreground-muted)]" />
      </div>
    );
  }

  if (error) {
    return (
      <InkCard className="px-6 py-12 text-center">
        <p className="text-[15px] font-medium text-[#be123c]">{error}</p>
      </InkCard>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[12.5rem_minmax(0,1fr)] lg:gap-8">
      <aside className="space-y-4">
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
        <StatCard label="Prize pool" value="$120" icon={Medal} />

        <InkCard className="p-4">
          <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-[var(--foreground-muted)]">
            Monthly prizes
          </p>
          <div className="mt-3 space-y-2">
            {MONTHLY_PRIZES.map((p) => (
              <div key={p.place} className="flex items-center justify-between text-[13px]">
                <span className="font-medium text-[var(--foreground-muted)]">{p.place}</span>
                <span className="font-bold text-[var(--foreground)]">
                  {p.amount}
                </span>
              </div>
            ))}
          </div>
        </InkCard>

        <TrackedLink
          href="/login"
          eventProps={{ location: "leaderboard_sidebar", label: "Get referral link", destination: "/login" }}
          className={`${DARK_BUTTON} hidden w-full lg:inline-flex`}
        >
          Get referral link
        </TrackedLink>
      </aside>

      <div className="min-w-0 space-y-4">
      {users.length > 0 ? (
        <>
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--foreground-muted)]"
              strokeWidth={2}
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onBlur={() => {
                if (query.trim()) {
                  track("leaderboard_searched", { location: "leaderboard_page", result_count: filtered.length, total_count: users.length });
                }
              }}
              placeholder="Search name or code…"
              className="min-h-[48px] w-full rounded-full border-[1.5px] border-[#1c1917] bg-white py-3 pl-12 pr-4 text-[15px] text-[var(--foreground)] shadow-[0_2px_0_rgba(28,25,23,0.9)] outline-none placeholder:text-[var(--foreground-muted)] focus:ring-2 focus:ring-[#1c1917]/15"
            />
          </div>

          <InkCard className="overflow-hidden">
            <div className="flex items-center justify-between border-b-[1.5px] border-[#1c1917] bg-black/[0.04] px-4 py-3 text-[12px] font-bold uppercase tracking-[0.12em] text-[var(--foreground-muted)] sm:px-6">
              <span>Rank · User</span>
              <span>Invites</span>
            </div>

            <div className="divide-y divide-black/10">
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
                    className={`flex items-center justify-between gap-4 px-4 py-3 transition-colors hover:bg-black/[0.03] sm:px-6 ${
                      user.isYou ? "bg-[#14917a]/[0.08]" : ""
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12px] font-bold ${rankBadgeClass(user.rank)}`}
                      >
                        {user.rank}
                      </span>

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] border-[1.5px] border-[#1c1917] bg-white text-[12px] font-bold text-[var(--foreground)]">
                        {initials(user.name)}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-[15px] font-bold tracking-[-0.01em] text-[var(--foreground)]">
                          {user.isYou ? "You" : user.name}
                          {user.isYou && (
                            <span className="ml-2 rounded-full bg-[#14917a] px-2 py-0.5 text-[11px] font-bold text-white">
                              you
                            </span>
                          )}
                        </p>
                        <p className="truncate text-[13px] text-[var(--foreground-muted)]">
                          {user.referralCode}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-3">
                      {user.prize && (
                        <span className="hidden rounded-full border-[1.5px] border-[#1c1917] bg-white px-3 py-0.5 text-[12px] font-bold text-[var(--foreground)] sm:inline">
                          {user.prize}
                        </span>
                      )}
                      <span className="text-[17px] font-bold tabular-nums text-[var(--foreground)]">
                        {user.invites}
                      </span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </InkCard>

          <TrackedLink
            href="/login"
            eventProps={{ location: "leaderboard_table", label: "Get referral link", destination: "/login" }}
            className={`${DARK_BUTTON} w-full lg:hidden`}
          >
            Get referral link
          </TrackedLink>
        </>
      ) : (
        <InkCard className="px-6 py-12 text-center" radius="rounded-[28px]">
          <p className="text-[22px] font-bold tracking-[-0.03em] text-[var(--foreground)]">
            No referrals yet
          </p>
          <p className="mt-2 text-[14px] text-[var(--foreground-muted)]">
            Share your link, you&apos;ll appear here when friends sign up.
          </p>
          <TrackedLink
            href="/login"
            eventProps={{ location: "leaderboard_empty", label: "Get referral link", destination: "/login" }}
            className={`${DARK_BUTTON} mt-6`}
          >
            Get referral link
          </TrackedLink>
        </InkCard>
      )}
      </div>
    </div>
  );
}
