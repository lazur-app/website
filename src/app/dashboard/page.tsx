"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Copy, Check, Download, Gift, Mic, Sparkles } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { DashboardSkeleton } from "@/components/DashboardSkeleton";
import { MarketingPageShell } from "@/components/MarketingPageShell";
import { AppleIcon } from "@/components/icons/AppleIcon";
import { track } from "@/lib/productAnalytics";
import { LAZUR_APP_OPEN_URL } from "@/lib/appDeepLink";
import { useAuth } from "@/components/AuthProvider";
import {
  getAccessToken,
  getCachedUser,
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
} from "@/lib/subscriptionDates";

function DashboardContent() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [referrals, setReferrals] = useState<ReferralMe | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useLayoutEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");
    if (accessToken) {
      storeTokens(accessToken, refreshToken);
      track("login", { method: "google" });
      window.history.replaceState({}, "", "/dashboard");
    }

    const cached = getCachedUser();
    if (cached) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage is only readable after hydration
      setUser(cached);
      setLoading(false);
      if (cached.referral_code) {
        storeMyReferralCode(cached.referral_code);
      }
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!hasValidSessionToken()) {
        router.replace("/login");
        return;
      }

      const cached = getCachedUser();
      if (cached) {
        setUser(cached);
        setLoading(false);
      }

      const token = getAccessToken();
      const referralsPromise = token
        ? fetchReferralMe(token).catch(() => null)
        : Promise.resolve(null);

      const profile = await refresh();
      if (cancelled) return;
      if (!profile) {
        router.replace("/login");
        return;
      }

      setUser(profile);
      setLoading(false);
      if (profile.referral_code) {
        storeMyReferralCode(profile.referral_code);
      }

      const ref = await referralsPromise;
      if (!cancelled) {
        setReferrals(ref);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
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

  const periodEnd = user.current_period_end ?? user.trial_ends_at;
  const daysLeft = daysRemaining(periodEnd);
  const cancelScheduled = Boolean(user.cancel_at_period_end);
  const endDate = formatSubscriptionDate(periodEnd);
  const trialExpired = Boolean(user.requires_subscription) || user.trial_status === "expired";
  const isTrial = user.plan.toLowerCase().includes("trial") && !trialExpired;
  const trialTotal =
    user.trial_started_at && user.trial_ends_at
      ? Math.max(1, Math.round((new Date(user.trial_ends_at).getTime() - new Date(user.trial_started_at).getTime()) / 86_400_000))
      : 3;
  const referralLink = user.referral_link ?? referrals?.referral_link ?? "";
  const firstName = user.name ? user.name.split(" ")[0] : "";
  const actionsUsed = user.command_quota_used ?? 0;
  const actionsLimit = user.command_quota_limit ?? 0;

  return (
    <MarketingPageShell>
      <Navbar />
      <main className="relative mx-auto max-w-5xl px-5 pb-24 pt-28 md:pt-36">
        {/* Who */}
        <motion.header
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-4">
            <Avatar user={user} />
            <div>
              <h1 className="font-display text-[2rem] font-semibold leading-tight tracking-[-0.03em] text-[var(--foreground)] md:text-[2.5rem]">
                {greeting()}{firstName ? `, ${firstName}` : ""}
              </h1>
              <p className="text-[14px] text-[var(--foreground-muted)]">{user.email}</p>
            </div>
          </div>
          <a
            href={LAZUR_APP_OPEN_URL}
            className="inline-flex items-center justify-center gap-2 self-start rounded-full bg-[var(--foreground)] px-5 py-2.5 text-[14px] font-semibold text-white transition-opacity hover:opacity-90 sm:self-auto"
          >
            <AppleIcon className="h-4 w-4" /> Open Lazur
          </a>
        </motion.header>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {/* Plan */}
          <Reveal delay={0.05} className="md:col-span-1">
            <div className="flex h-full flex-col rounded-[24px] bg-[#1c1917] p-6 text-white shadow-[0_20px_50px_rgba(28,25,23,0.22)]">
              <div className="flex items-center justify-between">
                <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-white/45">Your plan</p>
                <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${trialExpired ? "bg-amber-400/20 text-amber-200" : isTrial ? "bg-[#2563eb] text-white" : "bg-white/10 text-white/80"}`}>
                  {trialExpired ? "Trial ended" : isTrial ? "Trial" : cancelScheduled ? "Canceling" : "Active"}
                </span>
              </div>
              <p className="mt-4 font-display text-[1.9rem] font-semibold leading-none tracking-[-0.03em]">{user.plan}</p>

              {isTrial && daysLeft !== null ? (
                <div className="mt-6">
                  <div className="flex items-baseline justify-between">
                    <span className="font-display text-[2.6rem] font-semibold leading-none tabular-nums">{daysLeft}</span>
                    <span className="text-[13px] text-white/55">{daysLeft === 1 ? "day" : "days"} left · ends {endDate}</span>
                  </div>
                  <div className="mt-3 flex gap-1.5">
                    {Array.from({ length: trialTotal }, (_, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, scaleY: 0.4 }}
                        animate={{ opacity: 1, scaleY: 1 }}
                        transition={{ delay: 0.2 + i * 0.06, duration: 0.3 }}
                        className={`h-2 flex-1 rounded-full ${i < trialTotal - daysLeft ? "bg-white/15" : "bg-[#2563eb]"}`}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <p className="mt-4 text-[14px] leading-relaxed text-white/60">
                  {periodEndDescription(user.plan, periodEnd, {
                    cancelAtPeriodEnd: cancelScheduled,
                    billingSource: user.billing_source,
                    trialStatus: user.trial_status,
                  })}
                </p>
              )}

              <div className="mt-auto pt-6">
                <Link
                  href="/billing"
                  className="flex items-center justify-center gap-1.5 rounded-full bg-white py-2.5 text-[14px] font-semibold text-[#1c1917] transition-opacity hover:opacity-90"
                >
                  {isTrial || trialExpired ? "Choose a plan" : "Manage billing"} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </Reveal>

          {/* AI actions */}
          <Reveal delay={0.1}>
            <Card>
              <CardLabel icon={<Sparkles className="h-4 w-4" />}>AI actions this month</CardLabel>
              <div className="mt-5 flex items-center gap-5">
                <Ring value={actionsLimit ? actionsUsed / actionsLimit : 0} />
                <div>
                  <p className="font-display text-[2rem] font-semibold leading-none tabular-nums text-[var(--foreground)]">
                    {actionsUsed.toLocaleString()}
                  </p>
                  <p className="mt-1 text-[14px] text-[var(--foreground-muted)]">
                    of {actionsLimit ? actionsLimit.toLocaleString() : "—"} used
                  </p>
                </div>
              </div>
              <p className="mt-5 text-[13px] leading-relaxed text-[var(--foreground-faint)]">
                Questions, pointing, reminders and background jobs. Dictation doesn&apos;t count.
              </p>
            </Card>
          </Reveal>

          {/* Dictation */}
          <Reveal delay={0.15}>
            <Card>
              <CardLabel icon={<Mic className="h-4 w-4" />}>Dictation this month</CardLabel>
              <p className="mt-5 font-display text-[2rem] font-semibold leading-none tabular-nums text-[var(--foreground)]">
                {user.word_quota_used.toLocaleString()}
              </p>
              <p className="mt-1 text-[14px] text-[var(--foreground-muted)]">words typed for you</p>
              <p className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[12px] font-semibold text-emerald-700">
                <Check className="h-3.5 w-3.5" /> Unlimited on your plan
              </p>
              <p className="mt-3 text-[13px] text-[var(--foreground-faint)]">
                That&apos;s about {Math.max(1, Math.round(user.word_quota_used / 40))} minutes of typing saved.
              </p>
            </Card>
          </Reveal>
        </div>

        {/* Your Mac */}
        <Reveal delay={0.2} className="mt-4">
          <Card>
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <CardLabel icon={<AppleIcon className="h-4 w-4" />}>Lazur on your Mac</CardLabel>
                <p className="mt-3 text-[15px] text-[var(--foreground-muted)]">
                  Hold <Kbd>⌥ ⌘</Kbd> to ask, <Kbd>fn</Kbd> to dictate. Lazur updates itself.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <a href={LAZUR_APP_OPEN_URL} className="rounded-full border border-[var(--border-strong)] bg-white px-4 py-2 text-[14px] font-medium text-[var(--foreground)] hover:bg-black/[0.03]">Open app</a>
                <Link href="/login/app" className="rounded-full border border-[var(--border-strong)] bg-white px-4 py-2 text-[14px] font-medium text-[var(--foreground)] hover:bg-black/[0.03]">Sign in on this Mac</Link>
                <Link href="/download" className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-strong)] bg-white px-4 py-2 text-[14px] font-medium text-[var(--foreground)] hover:bg-black/[0.03]"><Download className="h-4 w-4" /> Download</Link>
              </div>
            </div>
          </Card>
        </Reveal>

        {/* Invite */}
        <Reveal delay={0.25} className="mt-4">
          <div className="relative overflow-hidden rounded-[24px] border border-[#2563eb]/15 bg-gradient-to-br from-[#2563eb]/[0.07] via-white to-white p-6 md:p-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:items-center">
              <div className="min-w-0">
                <CardLabel icon={<Gift className="h-4 w-4" />}>Invite friends</CardLabel>
                <p className="mt-3 font-display text-[1.6rem] font-semibold leading-tight tracking-[-0.02em] text-[var(--foreground)]">
                  Know someone who&apos;d love a buddy?
                </p>
                <p className="mt-2 text-[14px] text-[var(--foreground-muted)]">
                  {referrals?.referral_count ? (
                    <>You&apos;ve invited <span className="font-semibold text-[var(--foreground)]">{referrals.referral_count}</span> {referrals.referral_count === 1 ? "friend" : "friends"}{referrals.leaderboard_rank != null ? <> · #{referrals.leaderboard_rank} on the leaderboard</> : null}.</>
                  ) : (
                    "Share your link. Your friends start with three days of Pro, free."
                  )}
                </p>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 rounded-2xl border border-[var(--border-strong)] bg-white p-1.5 pl-4">
                  <span className="min-w-0 flex-1 truncate font-mono text-[13px] text-[var(--foreground-muted)]">{referralLink || "Your link is on its way…"}</span>
                  <button
                    type="button"
                    onClick={handleCopyReferral}
                    disabled={!referralLink}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-[var(--foreground)] px-4 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
                  >
                    {copied ? <><Check className="h-4 w-4" /> Copied</> : <><Copy className="h-4 w-4" /> Copy</>}
                  </button>
                </div>
                {user.referral_code ? (
                  <p className="mt-2 pl-1 text-[12.5px] text-[var(--foreground-faint)]">
                    Or share your code <span className="font-mono font-semibold text-[var(--foreground-muted)]">{user.referral_code}</span>
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </Reveal>

        <nav className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[13px] text-[var(--foreground-faint)]">
          <Link href="/changelog" className="hover:text-[var(--foreground-muted)]">What&apos;s new</Link>
          <Link href="/support" className="hover:text-[var(--foreground-muted)]">Help &amp; support</Link>
          <Link href="/privacy" className="hover:text-[var(--foreground-muted)]">Privacy</Link>
        </nav>
      </main>
    </MarketingPageShell>
  );
}

const EASE = [0.16, 1, 0.3, 1] as const;

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
}

function Avatar({ user }: { user: UserProfile }) {
  const initial = (user.name || user.email || "?").trim().charAt(0).toUpperCase();
  return user.avatar_url ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={user.avatar_url} alt="" className="h-14 w-14 rounded-full object-cover ring-4 ring-white shadow-sm" />
  ) : (
    <span className="grid h-14 w-14 place-items-center rounded-full bg-[#2563eb] font-display text-[1.4rem] font-semibold text-white ring-4 ring-white shadow-sm">{initial}</span>
  );
}

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.45, ease: EASE }} className={className}>
      {children}
    </motion.div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="h-full rounded-[24px] border border-[var(--border)] bg-white/80 p-6 shadow-[var(--shadow-card)]">{children}</div>;
}

function CardLabel({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-[var(--foreground-faint)]">
      <span className="text-[#2563eb]">{icon}</span>
      {children}
    </p>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return <kbd className="mx-0.5 rounded-md border border-[var(--border-strong)] bg-white px-1.5 py-0.5 font-sans text-[12.5px] font-semibold text-[var(--foreground)] shadow-[0_1px_0_rgba(28,25,23,0.12)]">{children}</kbd>;
}

/** Share of the month's AI actions used, as a ring. */
function Ring({ value }: { value: number }) {
  const r = 30;
  const c = 2 * Math.PI * r;
  const v = Math.max(0, Math.min(1, value));
  return (
    <svg width="76" height="76" viewBox="0 0 76 76" className="-rotate-90" aria-hidden>
      <circle cx="38" cy="38" r={r} fill="none" stroke="rgba(28,25,23,0.08)" strokeWidth="8" />
      <motion.circle
        cx="38" cy="38" r={r} fill="none" stroke={v > 0.9 ? "#ef5350" : "#2563eb"} strokeWidth="8" strokeLinecap="round"
        strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        animate={{ strokeDashoffset: c * (1 - v) }}
        transition={{ delay: 0.3, duration: 1, ease: EASE }}
      />
    </svg>
  );
}

export default function DashboardPage() {
  return <DashboardContent />;
}
