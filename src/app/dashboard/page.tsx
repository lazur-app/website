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
  fetchWaitlistMe,
  joinWaitlist,
  storeMyReferralCode,
  type WaitlistMe,
} from "@/lib/waitlist";

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
  const [waitlist, setWaitlist] = useState<WaitlistMe | null>(null);
  const [loading, setLoading] = useState(true);
  const [joiningWaitlist, setJoiningWaitlist] = useState(false);
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
      const token = getAccessToken();
      if (!token) return;

      const wl = await fetchWaitlistMe(token);
      setWaitlist(wl);
      if (wl.referral_code) {
        storeMyReferralCode(wl.referral_code);
      }
      setLoading(false);
    }

    load();
  }, [router, refresh]);

  const handleJoinWaitlist = async () => {
    if (!user?.email) return;
    setJoiningWaitlist(true);
    try {
      const result = await joinWaitlist(user.email);
      storeMyReferralCode(result.referral_code);
      setWaitlist({
        on_waitlist: true,
        email: result.email,
        referral_code: result.referral_code,
        referral_link: result.referral_link,
        referral_count: result.referral_count,
        waitlist_position: result.waitlist_position,
        total_count: result.total_count,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setJoiningWaitlist(false);
    }
  };

  const handleCopyReferral = async () => {
    if (!waitlist?.referral_link) return;
    await navigator.clipboard.writeText(waitlist.referral_link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading || !user) {
    return <DashboardSkeleton />;
  }

  const pct = usagePercent(user.word_quota_used, user.word_quota_limit);
  const isPaid = user.plan.toLowerCase() !== "free" && user.plan.toLowerCase() !== "free plan";

  return (
    <div className="min-h-screen bg-[var(--background)] grain">
      <Navbar />

      <main className="mx-auto max-w-3xl px-6 pb-20 pt-28">
        {/* Profile header */}
        <div className="mb-10 flex items-center gap-4">
          {user.avatar_url ? (
            <img
              src={user.avatar_url}
              alt=""
              className="h-14 w-14 rounded-2xl border border-[var(--border)] object-cover"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface-solid)] text-lg font-semibold text-[var(--brand)]">
              {(user.name || user.email)[0]?.toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="font-display text-2xl font-semibold tracking-tight text-[var(--foreground)]">
              {user.name || "Your account"}
            </h1>
            <p className="text-sm text-[var(--foreground-muted)]">{user.email}</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Plan */}
          <section className="glass rounded-2xl p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--foreground-faint)]">
                Plan
              </h2>
              <Sparkles className="h-4 w-4 text-[var(--brand)]" />
            </div>
            <p className="font-display text-2xl font-semibold text-[var(--foreground)]">
              {user.plan}
            </p>
            <p className="mt-1 text-sm text-[var(--foreground-muted)]">
              {isPaid ? "Active subscription" : "Free tier — upgrade anytime"}
            </p>
            {!isPaid && (
              <Link
                href="/pricing"
                className="btn-primary mt-5 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-semibold"
              >
                Upgrade
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </section>

          {/* Usage */}
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

        {/* Referrals / waitlist */}
        <section className="glass mt-4 rounded-2xl p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--foreground-faint)]">
              Referrals
            </h2>
            <Gift className="h-4 w-4 text-[var(--brand)]" />
          </div>

          {waitlist?.on_waitlist ? (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-6">
                <div>
                  <p className="text-[12px] text-[var(--foreground-faint)]">Friends invited</p>
                  <p className="font-display text-xl font-semibold text-[var(--foreground)]">
                    {waitlist.referral_count ?? 0}
                  </p>
                </div>
                <div>
                  <p className="text-[12px] text-[var(--foreground-faint)]">Waitlist spot</p>
                  <p className="font-display text-xl font-semibold text-[var(--foreground)]">
                    #{waitlist.waitlist_position}
                  </p>
                </div>
              </div>

              <div>
                <p className="mb-2 text-[12px] text-[var(--foreground-faint)]">
                  Your referral link
                </p>
                <div className="flex gap-2">
                  <input
                    readOnly
                    value={waitlist.referral_link ?? ""}
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
          ) : (
            <div>
              <p className="text-sm text-[var(--foreground-muted)]">
                Join the waitlist to get your referral link and move up the queue.
              </p>
              <button
                type="button"
                onClick={handleJoinWaitlist}
                disabled={joiningWaitlist}
                className="btn-primary mt-4 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-semibold disabled:opacity-60"
              >
                {joiningWaitlist ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Joining…
                  </>
                ) : (
                  "Join waitlist"
                )}
              </button>
            </div>
          )}
        </section>

        {/* Quick links */}
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
            href="/pricing"
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
