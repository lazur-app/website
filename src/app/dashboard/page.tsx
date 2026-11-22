"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Copy, Check, Download, Gauge, Gift, Mic, Sparkles } from "lucide-react";
import { HandUnderline } from "@/components/buddy/HandLoop";
import { Sticker } from "@/components/landing/Sticker";
import { Navbar } from "@/components/Navbar";
import { DashboardSkeleton } from "@/components/DashboardSkeleton";
import { MarketingPageShell } from "@/components/MarketingPageShell";
import { AppleIcon } from "@/components/icons/AppleIcon";
import { TrackedAnchor, TrackedLink } from "@/components/analytics/TrackedLink";
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
      track("login", { method: "google", source: "web" });
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
    track("referral_link_copied", { location: "dashboard", referral_count: referrals?.referral_count ?? 0 });
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
  const preview = user.upgrade_preview ?? null;

  return (
    <MarketingPageShell>
      <Navbar />
      <main className="relative mx-auto max-w-5xl overflow-x-clip px-4 pb-24 pt-32 sm:px-6 md:pt-40">
        {/* Who */}
        <motion.header
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="relative flex flex-col items-center text-center"
        >
          <Sticker name="star" size={72} rotate={-10} className="absolute left-[6%] top-0 hidden md:block" />
          <Sticker name="smiley" size={68} rotate={12} className="absolute right-[6%] top-12 hidden md:block" />
          <Avatar user={user} />
          <h1 className="mt-6 max-w-3xl font-sans text-[clamp(2.2rem,5vw,3.8rem)] font-bold leading-[1.04] tracking-[-0.05em] text-[var(--foreground)]">
            {greeting()}
            {firstName ? (
              <>
                ,{" "}
                <span className="relative inline-block whitespace-nowrap">
                  {firstName}.
                  <HandUnderline show color={INK} delay={0.4} duration={0.9} offset={2} />
                </span>
              </>
            ) : "."}
          </h1>
          <p className="mt-4 text-[16px] font-medium text-[var(--foreground-muted)]">{user.email}</p>
          <TrackedAnchor
            href={LAZUR_APP_OPEN_URL}
            event="cta_clicked"
            eventProps={{ location: "dashboard_header", label: "Open Lazur", destination: "app" }}
            className={`mt-8 ${PRIMARY_PILL}`}
          >
            <AppleIcon className="h-5 w-5" /> Open Lazur
          </TrackedAnchor>
        </motion.header>

        <div className="mt-16 grid gap-4 md:grid-cols-3 md:gap-6">
          {/* Plan */}
          <Reveal delay={0.05} className="md:col-span-1">
            <Card>
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between gap-3">
                  <CardLabel icon={<Gauge className="h-3.5 w-3.5" />} tone="#1c1917">Your plan</CardLabel>
                  <span
                    className={`rounded-full px-3 py-1 text-[12px] font-bold text-white ${
                      trialExpired ? "bg-[#e0621c]" : isTrial ? "bg-[#5b4bd6]" : cancelScheduled ? "bg-[#1c1917]" : "bg-[#14917a]"
                    }`}
                  >
                    {trialExpired ? "Trial ended" : isTrial ? "Trial" : cancelScheduled ? "Canceling" : "Active"}
                  </span>
                </div>
                <p className="mt-6 font-sans text-[2rem] font-bold leading-none tracking-[-0.04em] text-[var(--foreground)]">{user.plan}</p>

                {isTrial && daysLeft !== null ? (
                  <div className="mt-6">
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="font-sans text-[2.5rem] font-bold leading-none tracking-[-0.04em] tabular-nums text-[var(--foreground)]">{daysLeft}</span>
                      <span className="text-right text-[13px] text-[var(--foreground-muted)]">{daysLeft === 1 ? "day" : "days"} left · ends {endDate}</span>
                    </div>
                    <div className="mt-3 flex gap-2">
                      {Array.from({ length: trialTotal }, (_, i) => (
                        <motion.span
                          key={i}
                          initial={{ opacity: 0, scaleY: 0.4 }}
                          animate={{ opacity: 1, scaleY: 1 }}
                          transition={{ delay: 0.2 + i * 0.06, duration: 0.3 }}
                          className={`h-2 flex-1 rounded-full ${i < trialTotal - daysLeft ? "bg-[#1c1917]/10" : "bg-[#5b4bd6]"}`}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="mt-4 text-[14px] leading-relaxed text-[var(--foreground-muted)]">
                    {periodEndDescription(user.plan, periodEnd, {
                      cancelAtPeriodEnd: cancelScheduled,
                      billingSource: user.billing_source,
                      trialStatus: user.trial_status,
                    })}
                  </p>
                )}

                <div className="mt-auto pt-6">
                  <TrackedLink
                    href="/billing"
                    eventProps={{
                      location: "dashboard_plan_card",
                      label: isTrial || trialExpired ? "Choose a plan" : "Manage billing",
                      destination: "/billing",
                      plan: user.plan_slug || user.plan,
                    }}
                    className={`w-full ${DARK_PILL}`}
                  >
                    {isTrial || trialExpired ? "Choose a plan" : "Manage billing"} <ArrowRight className="h-4 w-4" />
                  </TrackedLink>
                </div>
              </div>
            </Card>
          </Reveal>

          {/* AI actions */}
          <Reveal delay={0.1}>
            <Card>
              <CardLabel icon={<Sparkles className="h-3.5 w-3.5" />} tone="#5b4bd6">AI actions this month</CardLabel>
              <div className="mt-6 flex items-center gap-6">
                <Ring value={actionsLimit ? actionsUsed / actionsLimit : 0} />
                <div>
                  <p className="font-sans text-[2rem] font-bold leading-none tracking-[-0.04em] tabular-nums text-[var(--foreground)]">
                    {actionsUsed.toLocaleString()}
                  </p>
                  <p className="mt-2 text-[14px] text-[var(--foreground-muted)]">
                    of {actionsLimit ? actionsLimit.toLocaleString() : "-"} used
                  </p>
                  {preview?.commands_more ? (
                    <p className="mt-2 inline-flex rounded-full bg-[#14917a] px-3 py-1 text-[12px] font-bold text-white">+{preview.commands_more} with Pro</p>
                  ) : null}
                </div>
              </div>
              <p className="mt-6 text-[13px] leading-relaxed text-[var(--foreground-muted)]">
                Questions, pointing, reminders and background jobs. Dictation doesn&apos;t count.
              </p>
            </Card>
          </Reveal>

          {/* Dictation */}
          <Reveal delay={0.15}>
            <Card>
              <CardLabel icon={<Mic className="h-3.5 w-3.5" />} tone="#d6246e">Dictation this month</CardLabel>
              <p className="mt-6 font-sans text-[2rem] font-bold leading-none tracking-[-0.04em] tabular-nums text-[var(--foreground)]">
                {user.word_quota_used.toLocaleString()}
              </p>
              <p className="mt-2 text-[14px] text-[var(--foreground-muted)]">
                {preview ? `of ${(user.word_quota_limit ?? 0).toLocaleString()} trial words` : "words typed for you"}
              </p>
              <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#14917a] px-3 py-1 text-[12px] font-bold text-white">
                <Check className="h-3.5 w-3.5" strokeWidth={3} /> {preview ? "+unlimited with Pro" : "Unlimited on your plan"}
              </p>
              <p className="mt-3 text-[13px] text-[var(--foreground-muted)]">
                That&apos;s about {Math.max(1, Math.round(user.word_quota_used / 40))} minutes of typing saved.
              </p>
            </Card>
          </Reveal>
        </div>

        {/* Your Mac */}
        <Reveal delay={0.2} className="mt-4 md:mt-6">
          <Card>
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <CardLabel icon={<AppleIcon className="h-3.5 w-3.5" />} tone="#1c1917">Lazur on your Mac</CardLabel>
                <p className="mt-4 text-[15px] leading-relaxed text-[var(--foreground-muted)]">
                  Hold <Kbd>⌥ ⌘</Kbd> to ask, <Kbd>fn</Kbd> to dictate. Lazur updates itself.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <TrackedAnchor href={LAZUR_APP_OPEN_URL} event="cta_clicked" eventProps={{ location: "dashboard_mac_card", label: "Open app", destination: "app" }} className={SMALL_PILL}>Open app</TrackedAnchor>
                <TrackedLink href="/login/app" eventProps={{ location: "dashboard_mac_card", label: "Sign in on this Mac", destination: "/login/app" }} className={SMALL_PILL}>Sign in on this Mac</TrackedLink>
                <TrackedLink href="/download" eventProps={{ location: "dashboard_mac_card", label: "Download", destination: "/download" }} className={SMALL_PILL}><Download className="h-4 w-4" /> Download for Mac</TrackedLink>
              </div>
            </div>
          </Card>
        </Reveal>

        {/* Invite */}
        <Reveal delay={0.25} className="mt-4 md:mt-6">
          <div className={`relative rounded-[28px] border-[1.5px] border-[#1c1917] bg-white p-5 md:p-8 ${SHADOW}`}>
            <Sticker name="bubble" size={64} rotate={10} className="absolute -right-4 -top-8 hidden md:block" />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:items-center">
              <div className="min-w-0">
                <CardLabel icon={<Gift className="h-3.5 w-3.5" />} tone="#e0621c">Invite friends</CardLabel>
                <p className="mt-4 font-sans text-[1.6rem] font-bold leading-[1.1] tracking-[-0.04em] text-[var(--foreground)]">
                  Know someone who&apos;d love a companion?
                </p>
                <p className="mt-3 text-[14px] leading-relaxed text-[var(--foreground-muted)]">
                  {referrals?.referral_count ? (
                    <>You&apos;ve invited <span className="font-semibold text-[var(--foreground)]">{referrals.referral_count}</span> {referrals.referral_count === 1 ? "friend" : "friends"}{referrals.leaderboard_rank != null ? <> · #{referrals.leaderboard_rank} on the leaderboard</> : null}.</>
                  ) : (
                    "Share your link. Your friends start with three days of Pro, free."
                  )}
                </p>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 rounded-full border-[1.5px] border-[#1c1917] bg-white p-1 pl-4 shadow-[0_2px_0_rgba(28,25,23,0.9)]">
                  <span className="min-w-0 flex-1 truncate font-mono text-[13px] text-[var(--foreground-muted)]">{referralLink || "Your link is on its way…"}</span>
                  <button
                    type="button"
                    onClick={handleCopyReferral}
                    disabled={!referralLink}
                    className="inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-full bg-[#1c1917] px-4 text-[14px] font-bold text-white transition-colors hover:bg-black disabled:opacity-40"
                  >
                    {copied ? <><Check className="h-4 w-4" /> Copied</> : <><Copy className="h-4 w-4" /> Copy</>}
                  </button>
                </div>
                {user.referral_code ? (
                  <p className="mt-3 pl-4 text-[13px] text-[var(--foreground-muted)]">
                    Or share your code <span className="font-mono font-semibold text-[var(--foreground)]">{user.referral_code}</span>
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </Reveal>

        <nav className="mt-12 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[14px] text-[var(--foreground-muted)]">
          <TrackedLink href="/changelog" event="nav_link_clicked" eventProps={{ location: "dashboard_footer", label: "What's new", destination: "/changelog" }} className={FOOT_LINK}>What&apos;s new</TrackedLink>
          <TrackedLink href="/support" event="nav_link_clicked" eventProps={{ location: "dashboard_footer", label: "Help & support", destination: "/support" }} className={FOOT_LINK}>Help &amp; support</TrackedLink>
          <TrackedLink href="/privacy" event="nav_link_clicked" eventProps={{ location: "dashboard_footer", label: "Privacy", destination: "/privacy" }} className={FOOT_LINK}>Privacy</TrackedLink>
        </nav>
      </main>
    </MarketingPageShell>
  );
}

const EASE = [0.16, 1, 0.3, 1] as const;
/** The homepage's red hand-drawn ink. */
const INK = "#e11d48";
const SHADOW = "shadow-[0_2px_0_rgba(28,25,23,0.9),0_10px_24px_-8px_rgba(28,25,23,0.18)]";
const PRIMARY_PILL = `inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full border-[1.5px] border-[#1c1917] bg-white px-8 text-[16px] font-bold tracking-[-0.02em] text-[#1c1917] ${SHADOW} transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_0_rgba(28,25,23,0.9),0_16px_30px_-10px_rgba(28,25,23,0.24)] active:translate-y-0.5`;
const DARK_PILL = "inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[#1c1917] px-6 text-[15px] font-bold text-white transition-colors hover:bg-black";
const SMALL_PILL = "inline-flex min-h-[44px] items-center gap-2 rounded-full border-[1.5px] border-[#1c1917] bg-white px-4 text-[14px] font-bold text-[#1c1917] shadow-[0_2px_0_rgba(28,25,23,0.9)] transition-transform hover:-translate-y-0.5";
const FOOT_LINK = "font-medium underline decoration-[var(--foreground)]/25 underline-offset-4 hover:text-[var(--foreground)] hover:decoration-[var(--foreground)]";

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
}

function Avatar({ user }: { user: UserProfile }) {
  const initial = (user.name || user.email || "?").trim().charAt(0).toUpperCase();
  return user.avatar_url ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={user.avatar_url} alt="" className="h-16 w-16 rounded-full border-[1.5px] border-[#1c1917] object-cover shadow-[0_2px_0_rgba(28,25,23,0.9)]" />
  ) : (
    <span className="grid h-16 w-16 place-items-center rounded-full border-[1.5px] border-[#1c1917] bg-[#5b4bd6] font-sans text-[1.5rem] font-bold text-white shadow-[0_2px_0_rgba(28,25,23,0.9)]">{initial}</span>
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
  return <div className={`h-full rounded-[20px] border-[1.5px] border-[#1c1917] bg-white p-5 md:p-6 ${SHADOW}`}>{children}</div>;
}

function CardLabel({ icon, tone, children }: { icon: React.ReactNode; tone: string; children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.12em] text-[var(--foreground-muted)]">
      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-white" style={{ backgroundColor: tone }}>{icon}</span>
      {children}
    </p>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return <kbd className="mx-1 rounded-md border-[1.5px] border-[#1c1917] bg-white px-2 py-0.5 font-sans text-[13px] font-bold text-[var(--foreground)] shadow-[0_2px_0_rgba(28,25,23,0.9)]">{children}</kbd>;
}

/** Share of the month's AI actions used, as a ring. */
function Ring({ value }: { value: number }) {
  const r = 30;
  const c = 2 * Math.PI * r;
  const v = Math.max(0, Math.min(1, value));
  return (
    <svg width="76" height="76" viewBox="0 0 76 76" className="shrink-0 -rotate-90" aria-hidden>
      <circle cx="38" cy="38" r={r} fill="none" stroke="rgba(28,25,23,0.1)" strokeWidth="8" />
      <motion.circle
        cx="38" cy="38" r={r} fill="none" stroke={v > 0.9 ? INK : "#5b4bd6"} strokeWidth="8" strokeLinecap="round"
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
