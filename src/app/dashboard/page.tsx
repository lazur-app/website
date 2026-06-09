"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Copy,
  Check,
  Download,
  Gift,
  Loader2,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { DashboardSkeleton } from "@/components/DashboardSkeleton";
import { MarketingPageShell } from "@/components/MarketingPageShell";
import { SoftCard } from "@/components/SoftCard";
import { useAuth } from "@/components/AuthProvider";
import {
  getAccessToken,
  hasValidSessionToken,
  storeTokens,
  type UserProfile,
} from "@/lib/auth";
import {
  fetchReferralMe,
  storeMyReferralCode,
  type ReferralMe,
} from "@/lib/referrals";
import {
  daysRemaining,
  formatSubscriptionDate,
  periodEndDescription,
  periodEndLabel,
} from "@/lib/subscriptionDates";

function usagePercent(used: number, limit: number) {
  if (limit <= 0) return 0;
  return Math.min(100, Math.round((used / limit) * 100));
}

function formatWords(n: number) {
  return n.toLocaleString();
}

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refresh } = useAuth();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [referrals, setReferrals] = useState<ReferralMe | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const accessToken = searchParams.get("access_token");
    const refreshToken = searchParams.get("refresh_token");
    if (accessToken) {
      storeTokens(accessToken, refreshToken);
      router.replace("/dashboard");
    }
  }, [searchParams, router]);

  useEffect(() => {
    async function load() {
      if (!hasValidSessionToken()) {
        router.replace("/login");
        return;
      }

      const profile = await refresh({ force: true });
      if (!profile) {
        router.replace("/login");
        return;
      }

      setUser(profile);
      if (profile.referral_code) {
        storeMyReferralCode(profile.referral_code);
      }

      const token = getAccessToken();
      if (token) {
        const ref = await fetchReferralMe(token);
        setReferrals(ref);
      }
      setLoading(false);
    }

    load();
  }, [router, refresh]);

  const handleCopyReferral = async () => {
    const link = user?.referral_link ?? referrals?.referral_link;
    if (!link) return;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  if (loading || !user) {
    return <DashboardSkeleton />;
  }

  const pct = usagePercent(user.word_quota_used, user.word_quota_limit);
  const periodEnd = user.current_period_end ?? user.trial_ends_at;
  const daysLeft = daysRemaining(periodEnd);
  const endLabel = periodEndLabel(user.plan);
  const endDate = formatSubscriptionDate(periodEnd);
  const isTrial = user.plan.toLowerCase().includes("trial");
  const referralLink = user.referral_link ?? referrals?.referral_link ?? "";

  return (
    <MarketingPageShell>
      <Navbar />
      <main className="relative mx-auto max-w-4xl px-6 pb-20 pt-24 md:pt-28">
        <motion.header
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--foreground-faint)]">
            Account
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-[-0.03em] text-[var(--foreground)] md:text-[2.5rem]">
            Welcome back{user.name ? `, ${user.name.split(" ")[0]}` : ""}
          </h1>
          <p className="mt-2 text-[15px] leading-relaxed text-[var(--foreground-muted)]">
            {periodEndDescription(user.plan, periodEnd)}
          </p>
        </motion.header>

        <div className="grid gap-4 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.45 }}
          >
            <SoftCard hover={false} className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--foreground-faint)]">
                  Your plan
                </h2>
                <Sparkles className="h-4 w-4 text-[var(--foreground-faint)]" strokeWidth={1.75} />
              </div>
              <p className="font-display text-2xl font-semibold tracking-tight text-[var(--foreground)]">
                {user.plan}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-[14px] text-[var(--foreground-muted)]">
                <span>
                  {endLabel}: {endDate}
                </span>
                {isTrial && daysLeft !== null && (
                  <span className="rounded-full bg-[var(--background-deep)] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--foreground-muted)]">
                    {daysLeft} {daysLeft === 1 ? "day" : "days"} left
                  </span>
                )}
              </div>
            </SoftCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.45 }}
          >
            <SoftCard hover={false} className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--foreground-faint)]">
                  Usage this month
                </h2>
                <TrendingUp className="h-4 w-4 text-[var(--foreground-faint)]" strokeWidth={1.75} />
              </div>
              <p className="font-display text-2xl font-semibold tracking-tight text-[var(--foreground)]">
                {formatWords(user.word_quota_used)}{" "}
                <span className="text-base font-normal text-[var(--foreground-muted)]">
                  / {formatWords(user.word_quota_limit)} words
                </span>
              </p>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--background-deep)]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full rounded-full bg-[var(--foreground)]/70"
                />
              </div>
              <p className="mt-2 text-[12px] text-[var(--foreground-faint)]">
                {pct}% of monthly word budget used
              </p>
            </SoftCard>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.45 }}
        >
          <SoftCard hover={false} className="mt-4 p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--foreground-faint)]">
                Refer a friend
              </h2>
              <Gift className="h-4 w-4 text-[var(--foreground-faint)]" strokeWidth={1.75} />
            </div>

            <div className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--foreground-faint)]">
                    Friends invited
                  </p>
                  <p className="mt-1 font-display text-xl font-semibold text-[var(--foreground)]">
                    {referrals?.referral_count ?? 0}
                  </p>
                </div>
                {referrals?.leaderboard_rank != null && (
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--foreground-faint)]">
                      Leaderboard rank
                    </p>
                    <p className="mt-1 font-display text-xl font-semibold text-[var(--foreground)]">
                      #{referrals.leaderboard_rank}
                    </p>
                  </div>
                )}
                {user.referral_code && (
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--foreground-faint)]">
                      Your code
                    </p>
                    <p className="mt-1 font-mono text-lg font-semibold text-[var(--foreground)]">
                      {user.referral_code}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--foreground-faint)]">
                  Your referral link
                </p>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <input
                    readOnly
                    value={referralLink}
                    className="soft-card min-w-0 flex-1 px-4 py-2.5 text-[13px] text-[var(--foreground-muted)] outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleCopyReferral}
                    className="btn-dark inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-[14px]"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy link
                      </>
                    )}
                  </button>
                </div>
              </div>

              <Link
                href="/leaderboard"
                className="inline-flex items-center gap-1 text-[13px] font-medium text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground)]"
              >
                View leaderboard
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </SoftCard>
        </motion.div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.45 }}
          >
            <Link href="/login/app" className="block">
              <SoftCard hover={false} className="flex items-center gap-4 p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--background-deep)]/70">
                  <Download className="h-4 w-4 text-[var(--foreground-muted)]" strokeWidth={1.75} />
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-[var(--foreground)]">Desktop app</p>
                  <p className="text-[13px] text-[var(--foreground-muted)]">
                    Sign in on Mac to sync your account
                  </p>
                </div>
              </SoftCard>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.45 }}
          >
            <Link href="/billing" className="block">
              <SoftCard hover={false} className="flex items-center gap-4 p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--background-deep)]/70">
                  <Sparkles className="h-4 w-4 text-[var(--foreground-muted)]" strokeWidth={1.75} />
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-[var(--foreground)]">Plans & billing</p>
                  <p className="text-[13px] text-[var(--foreground-muted)]">
                    Compare tiers and manage subscription
                  </p>
                </div>
              </SoftCard>
            </Link>
          </motion.div>
        </div>
      </main>
    </MarketingPageShell>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}
