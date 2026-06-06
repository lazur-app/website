"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
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
    <div className="min-h-screen bg-[var(--background)]">
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 pb-20 pt-28">
        <header className="mb-8">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--foreground-faint)]">
            Dashboard
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-[var(--foreground)]">
            Welcome back{user.name ? `, ${user.name.split(" ")[0]}` : ""}
          </h1>
          <p className="mt-2 text-sm text-[var(--foreground-muted)]">
            {periodEndDescription(user.plan, periodEnd)}
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-2">
          <section className="glass rounded-2xl p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--foreground-faint)]">
                Your plan
              </h2>
              <Sparkles className="h-4 w-4 text-[var(--brand)]" />
            </div>
            <p className="font-display text-2xl font-semibold text-[var(--foreground)]">
              {user.plan}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-[var(--foreground-muted)]">
              <span>
                {endLabel}: {endDate}
              </span>
              {isTrial && daysLeft !== null && (
                <span className="rounded-full bg-[var(--brand-soft)] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--brand-ink)]">
                  {daysLeft} {daysLeft === 1 ? "day" : "days"} left
                </span>
              )}
            </div>
          </section>

          <section className="glass rounded-2xl p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--foreground-faint)]">
                Usage this month
              </h2>
              <TrendingUp className="h-4 w-4 text-[var(--brand)]" />
            </div>
            <p className="font-display text-2xl font-semibold text-[var(--foreground)]">
              {formatWords(user.word_quota_used)}{" "}
              <span className="text-base font-normal text-[var(--foreground-muted)]">
                / {formatWords(user.word_quota_limit)} words
              </span>
            </p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--background-deep)]">
              <div
                className="h-full rounded-full bg-[var(--brand)] transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="mt-2 text-[12px] text-[var(--foreground-faint)]">
              {pct}% of monthly word budget used
            </p>
          </section>
        </div>

        <section className="glass mt-4 rounded-2xl p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--foreground-faint)]">
              Refer a friend
            </h2>
            <Gift className="h-4 w-4 text-[var(--brand)]" />
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap gap-6">
              <div>
                <p className="text-[12px] text-[var(--foreground-faint)]">Friends invited</p>
                <p className="font-display text-xl font-semibold text-[var(--foreground)]">
                  {referrals?.referral_count ?? 0}
                </p>
              </div>
              {referrals?.leaderboard_rank != null && (
                <div>
                  <p className="text-[12px] text-[var(--foreground-faint)]">Leaderboard rank</p>
                  <p className="font-display text-xl font-semibold text-[var(--foreground)]">
                    #{referrals.leaderboard_rank}
                  </p>
                </div>
              )}
              {user.referral_code && (
                <div>
                  <p className="text-[12px] text-[var(--foreground-faint)]">Your code</p>
                  <p className="font-mono text-xl font-semibold text-[var(--foreground)]">
                    {user.referral_code}
                  </p>
                </div>
              )}
            </div>

            <div>
              <p className="mb-2 text-[12px] text-[var(--foreground-faint)]">
                Your referral link
              </p>
              <div className="flex gap-2">
                <input
                  readOnly
                  value={referralLink}
                  className="min-w-0 flex-1 rounded-xl border border-[var(--border)] bg-[var(--surface-solid)] px-3 py-2.5 text-[13px] text-[var(--foreground-muted)]"
                />
                <button
                  type="button"
                  onClick={handleCopyReferral}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border-strong)] bg-[var(--surface-solid)] px-4 py-2.5 text-[13px] font-semibold text-[var(--foreground)] transition-colors hover:border-[var(--brand)]/30"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-600" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>

            <Link
              href="/leaderboard"
              className="inline-flex items-center gap-1 text-[13px] font-medium text-[var(--brand)] hover:underline"
            >
              View leaderboard
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </section>

        <section className="mt-4 grid gap-3 sm:grid-cols-2">
          <Link
            href="/login/app"
            className="glass flex items-center gap-3 rounded-2xl p-5 transition-colors hover:border-[var(--brand)]/20"
          >
            <Download className="h-5 w-5 text-[var(--brand)]" />
            <div>
              <p className="text-sm font-semibold text-[var(--foreground)]">Desktop app</p>
              <p className="text-[12px] text-[var(--foreground-muted)]">
                Sign in on Mac to sync your account
              </p>
            </div>
          </Link>
          <Link
            href="/billing"
            className="glass flex items-center gap-3 rounded-2xl p-5 transition-colors hover:border-[var(--brand)]/20"
          >
            <Sparkles className="h-5 w-5 text-[var(--brand)]" />
            <div>
              <p className="text-sm font-semibold text-[var(--foreground)]">Plans & billing</p>
              <p className="text-[12px] text-[var(--foreground-muted)]">
                Compare tiers and manage subscription
              </p>
            </div>
          </Link>
        </section>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}
