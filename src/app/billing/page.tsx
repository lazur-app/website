"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CreditCard,
  ExternalLink,
  Gauge,
  History,
  Loader2,
  Receipt,
  Sparkles,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { TrackedAnchor, TrackedLink } from "@/components/analytics/TrackedLink";
import { BillingPlanCard } from "@/components/billing/BillingPlanCard";
import { DashboardSkeleton } from "@/components/DashboardSkeleton";
import { MarketingPageShell } from "@/components/MarketingPageShell";
import { HandUnderline } from "@/components/buddy/HandLoop";
import { Sticker } from "@/components/landing/Sticker";
import { useAuth } from "@/components/AuthProvider";
import {
  hasValidSessionToken,
  storeTokens,
  type UserProfile,
} from "@/lib/auth";
import {
  canUpgradeTo,
  createCheckoutSession,
  fetchBillingActivity,
  fetchBillingInvoices,
  fetchBillingStatus,
  fetchCustomerPortalUrl,
  formatMoney,
  invoiceLabel,
  isPaidPlan,
  syncBillingSubscription,
  type BillingActivityItem,
  type BillingInvoiceItem,
  type BillingInterval,
  type BillingStatus,
  type PlanType,
} from "@/lib/billing";
import { loginPathWithReturn } from "@/lib/returnTo";
import { BillingIntervalToggle } from "@/components/pricing/BillingIntervalToggle";
import {
  maxAnnualSavings,
  planPrices,
  TRIAL_DAYS,
  WEBSITE_PLANS,
} from "@/lib/pricingPlans";
import {
  daysRemaining,
  formatSubscriptionDate,
  periodEndDescription,
  periodEndLabel,
} from "@/lib/subscriptionDates";
import { LAZUR_APP_OPEN_URL } from "@/lib/appDeepLink";
import { track } from "@/lib/productAnalytics";

const UPGRADE_PLAN_META: {
  name: string;
  planType: PlanType;
  planId: "pro" | "power";
  description: string;
  features: string[];
  popular: boolean;
}[] = [
  {
    name: "Pro",
    planType: "pro",
    planId: "pro",
    description: "For everyday help: questions, pointing, reminders and jobs.",
    features: [
      "10× more usage than free",
      "Unlimited dictation",
      "Background jobs, Chrome agent and reports",
      "Snippets, Words and 9 clipboard slots",
    ],
    popular: true,
  },
  {
    name: "Power",
    planType: "power",
    planId: "power",
    description: "For people who live in Lazur all day.",
    features: [
      "60× more usage than free",
      "Unlimited dictation",
      "Priority support",
      "Everything in Pro",
    ],
    popular: false,
  },
];

function formatDateTime(iso?: string | null): string {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function planStatusLabel(
  plan: string,
  paid: boolean,
  trialExpired: boolean,
  cancelScheduled?: boolean,
) {
  const normalized = plan.toLowerCase();
  if (trialExpired && !paid) return "Trial ended";
  if (cancelScheduled && paid) return "Canceling";
  if (normalized.includes("trial")) return "Trial active";
  if (paid) return "Subscribed";
  return "Free";
}

function ActivityTimeline({ items }: { items: BillingActivityItem[] }) {
  return (
    <ul className="space-y-0">
      {items.map((item, i) => (
        <li key={item.id} className="relative flex gap-4 pb-6 last:pb-0">
          {i < items.length - 1 ? (
            <span
              aria-hidden
              className="absolute left-[6px] top-4 h-[calc(100%-4px)] w-[1.5px] bg-[#1c1917]/15"
            />
          ) : null}
          <span className="relative z-[1] mt-1 h-3.5 w-3.5 shrink-0 rounded-full border-[1.5px] border-[#1c1917] bg-white" />
          <div className="min-w-0 flex-1 pt-0.5">
            <p className="text-[14px] font-semibold text-[var(--foreground)]">
              {item.label}
              {item.detail ? (
                <span className="font-normal text-[var(--foreground-muted)]">
                  {" "}
                  · {item.detail}
                </span>
              ) : null}
            </p>
            <p className="mt-1 text-[13px] text-[var(--foreground-muted)]">
              {formatDateTime(item.occurred_at)}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

function BillingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refresh } = useAuth();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [billingStatus, setBillingStatus] = useState<BillingStatus | null>(null);
  const [activity, setActivity] = useState<BillingActivityItem[]>([]);
  const [invoices, setInvoices] = useState<BillingInvoiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkoutPlan, setCheckoutPlan] = useState<PlanType | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [interval, setInterval] = useState<BillingInterval>(
    searchParams.get("interval") === "year" ? "year" : "month",
  );
  const fromApp = searchParams.get("source") === "app";
  const preselectedPlan = searchParams.get("plan");
  const preselectStarted = useRef(false);
  const maxSavings = maxAnnualSavings("international");

  useEffect(() => {
    const accessToken = searchParams.get("access_token");
    const refreshToken = searchParams.get("refresh_token");
    if (accessToken) {
      storeTokens(accessToken, refreshToken);
      const params = new URLSearchParams(searchParams.toString());
      params.delete("access_token");
      params.delete("refresh_token");
      const query = params.toString();
      router.replace(query ? `/billing?${query}` : "/billing");
    }
  }, [searchParams, router]);

  useEffect(() => {
    async function load() {
      if (!hasValidSessionToken()) {
        router.replace(loginPathWithReturn("/billing"));
        return;
      }

      // Pull latest cancel/renew state from Polar when webhooks are delayed.
      await syncBillingSubscription().catch(() => null);
      const profile = await refresh({ force: true });
      if (!profile) {
        router.replace(loginPathWithReturn("/billing"));
        return;
      }

      const [status, activityItems, invoiceItems] = await Promise.all([
        fetchBillingStatus(),
        fetchBillingActivity(),
        fetchBillingInvoices(),
      ]);

      setUser(profile);
      setBillingStatus(status);
      setActivity(activityItems);
      setInvoices(invoiceItems);
      setLoading(false);
      track("billing_page_viewed", {
        plan: profile.plan_slug || profile.plan,
        billing_source: status?.billing_source ?? profile.billing_source ?? null,
        cancel_scheduled: Boolean(status?.cancel_at_period_end ?? profile.cancel_at_period_end),
        trial_expired: Boolean(profile.requires_subscription || profile.trial_status === "expired"),
        from_app: fromApp,
        invoice_count: invoiceItems.length,
      });
    }

    load();
  }, [router, refresh, fromApp]);

  const handleCheckout = useCallback(
    async (planType: PlanType) => {
      setError(null);
      setCheckoutPlan(planType);
      track("checkout_started", { plan: planType, interval, source: "website", location: "billing_page" });
      try {
        const url = await createCheckoutSession(planType, interval, "US");
        if (url) {
          window.location.href = url;
          return;
        }
        track("checkout_failed", { plan: planType, interval, location: "billing_page", reason: "api_error" });
        setError("Could not start checkout. Please try again.");
      } catch {
        track("checkout_failed", { plan: planType, interval, location: "billing_page", reason: "network_error" });
        setError("Could not start checkout. Please try again.");
      } finally {
        setCheckoutPlan(null);
      }
    },
    [interval],
  );

  useEffect(() => {
    if (loading || !user || preselectStarted.current) return;
    if (preselectedPlan !== "pro" && preselectedPlan !== "power") return;
    if (!canUpgradeTo(user.plan, preselectedPlan)) return;

    preselectStarted.current = true;
    track("plan_selected", { plan: preselectedPlan, interval, location: "billing_preselected", from_app: fromApp });
    void handleCheckout(preselectedPlan);
  }, [loading, user, preselectedPlan, handleCheckout, interval, fromApp]);

  const handleManageBilling = async () => {
    setError(null);
    setPortalLoading(true);
    try {
      const { url, error: portalError } = await fetchCustomerPortalUrl();
      if (url) {
        track("billing_portal_opened", { location: "billing_page", plan: user?.plan_slug || user?.plan });
        window.location.href = url;
        return;
      }
      track("billing_portal_failed", { location: "billing_page", reason: "api_error" });
      setError(portalError ?? "Could not open billing portal. Please try again.");
    } catch {
      track("billing_portal_failed", { location: "billing_page", reason: "network_error" });
      setError("Could not open billing portal. Please try again.");
    } finally {
      setPortalLoading(false);
    }
  };

  if (loading || !user) {
    return <DashboardSkeleton />;
  }

  const periodEnd = billingStatus?.current_period_end ?? user.current_period_end ?? user.trial_ends_at;
  const paid = isPaidPlan(user.plan);
  const trialExpired =
    user.requires_subscription ||
    user.trial_status === "expired" ||
    user.plan_slug === "expired";
  const isComp = billingStatus?.billing_source === "admin_comp";
  const canManagePortal = billingStatus?.can_manage_in_portal ?? (paid && !isComp);
  const cancelScheduled = billingStatus?.cancel_at_period_end ?? user.cancel_at_period_end;
  const onTrial = user.plan.toLowerCase().includes("trial") && !trialExpired;
  const trialDays = onTrial ? daysRemaining(periodEnd) : null;
  const trialProgress =
    trialDays !== null && trialDays <= TRIAL_DAYS ? Math.max(0, ((TRIAL_DAYS - trialDays) / TRIAL_DAYS) * 100) : null;
  const statusLabel = planStatusLabel(user.plan, paid, trialExpired, cancelScheduled);

  return (
    <MarketingPageShell>
      <Navbar />
      <main className="relative mx-auto max-w-5xl overflow-x-clip px-4 pb-24 pt-32 sm:px-6 md:pt-40">
        <motion.header
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-12 flex flex-col items-center text-center md:mb-16"
        >
          <Sticker name="cd" size={72} rotate={-10} className="absolute left-[6%] top-8 hidden md:block" />
          <Sticker name="gem" size={64} rotate={12} className="absolute right-[6%] top-16 hidden md:block" />
          {fromApp ? (
            <TrackedAnchor
              href={LAZUR_APP_OPEN_URL}
              event="cta_clicked"
              eventProps={{ location: "billing_page_header", label: "Back to app", destination: "app" }}
              className="mb-6 inline-flex min-h-[44px] items-center gap-2 text-[14px] font-semibold text-[var(--foreground-muted)] underline decoration-[var(--foreground)]/20 underline-offset-4 transition-colors hover:text-[var(--foreground)]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to app
            </TrackedAnchor>
          ) : (
            <TrackedLink
              href="/dashboard"
              event="nav_link_clicked"
              eventProps={{ location: "billing_page_header", label: "Back to account", destination: "/dashboard" }}
              className="mb-6 inline-flex min-h-[44px] items-center gap-2 text-[14px] font-semibold text-[var(--foreground-muted)] underline decoration-[var(--foreground)]/20 underline-offset-4 transition-colors hover:text-[var(--foreground)]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to account
            </TrackedLink>
          )}
          <span className="inline-flex min-h-[28px] items-center rounded-full bg-[#1c1917] px-3 text-[12px] font-bold text-white">
            Billing
          </span>
          <h1 className="mt-6 font-sans text-[clamp(2.4rem,5.4vw,4.2rem)] font-bold leading-[1.04] tracking-[-0.05em] text-[var(--foreground)]">
            Plans &amp;{" "}
            <span className="relative inline-block whitespace-nowrap">
              billing
              <HandUnderline show color="#e11d48" delay={0.4} duration={0.9} offset={2} />
            </span>
          </h1>
        </motion.header>

        {error ? (
          <p className="mb-6 rounded-[12px] border-[1.5px] border-[#e11d48] bg-white px-4 py-3 text-[14px] font-medium text-[#be123c]">
            {error}
          </p>
        ) : null}

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.04, duration: 0.45 }}
          className="mb-8"
        >
          <div className="overflow-hidden rounded-[28px] border-[1.5px] border-[#1c1917] bg-white shadow-[0_2px_0_rgba(28,25,23,0.9),0_10px_24px_-8px_rgba(28,25,23,0.18)]">
            <div className="border-b-[1.5px] border-[#1c1917] bg-[#1c1917] px-5 py-6 text-white md:px-8 md:py-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-[12px] font-bold text-white ${
                        trialExpired && !paid
                          ? "bg-[#e0621c]"
                          : onTrial
                            ? "bg-[#5b4bd6]"
                            : paid
                              ? "bg-[#14917a]"
                              : "bg-white/15"
                      }`}
                    >
                      {statusLabel}
                    </span>
                    <span className="text-[11px] font-medium text-[var(--foreground-faint)]">
                    </span>
                  </div>
                  <p className="mt-4 font-sans text-[1.75rem] font-bold leading-[1.1] tracking-[-0.04em] text-white md:text-[2.25rem]">
                    {user.plan}
                  </p>
                  <p className="mt-3 text-[14px] leading-relaxed text-white/70">
                    {periodEndDescription(user.plan, periodEnd, {
                      cancelAtPeriodEnd: cancelScheduled,
                      billingSource: billingStatus?.billing_source ?? user.billing_source,
                    })}
                  </p>
                </div>
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] bg-white text-[#1c1917]">
                  {onTrial ? (
                    <Sparkles className="h-5 w-5" strokeWidth={1.5} />
                  ) : (
                    <Gauge className="h-5 w-5" strokeWidth={1.5} />
                  )}
                </div>
              </div>

              {trialProgress !== null ? (
                <div className="mt-6">
                  <div className="mb-2 flex items-center justify-between text-[13px]">
                    <span className="font-semibold text-white/70">
                      Trial progress
                    </span>
                    <span className="tabular-nums text-white/60">
                      {trialDays} {trialDays === 1 ? "day" : "days"} left
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/15">
                    <div
                      className="h-full rounded-full bg-[#5b4bd6] transition-all"
                      style={{ width: `${trialProgress}%` }}
                    />
                  </div>
                </div>
              ) : null}
            </div>

            <div className="space-y-3 px-5 py-6 md:px-8">
              <p className="text-[14px] text-[var(--foreground-muted)]">
                {periodEndLabel(user.plan, { cancelAtPeriodEnd: cancelScheduled })}:{" "}
                <span className="font-medium text-[var(--foreground)]">
                  {formatSubscriptionDate(periodEnd)}
                </span>
              </p>

              {isComp && billingStatus?.comp_reason ? (
                <p className="text-[13px] text-[var(--foreground-muted)]">
                  {billingStatus.comp_reason}
                </p>
              ) : null}

              {cancelScheduled ? (
                <p className="rounded-[12px] border-[1.5px] border-[#e0621c] bg-white px-4 py-3 text-[14px] text-[#1c1917]">
                  Cancellation scheduled, you keep access until the date above.
                </p>
              ) : null}

              {trialExpired && !paid ? (
                <p className="rounded-[12px] border-[1.5px] border-[#e0621c] bg-white px-4 py-3 text-[14px] font-semibold text-[#1c1917]">
                  Your Pro trial has ended. Subscribe to keep using Lazur.
                </p>
              ) : null}

              {fromApp ? (
                <p className="text-[13px] text-[var(--foreground-muted)]">
                  After upgrading, return to the Lazur desktop app, your plan updates
                  automatically.
                </p>
              ) : null}

              {canManagePortal ? (
                <button
                  type="button"
                  onClick={handleManageBilling}
                  disabled={portalLoading}
                  className="mt-2 inline-flex min-h-[48px] items-center gap-2 rounded-full border-[1.5px] border-[#1c1917] bg-white px-6 text-[15px] font-bold text-[#1c1917] shadow-[0_2px_0_rgba(28,25,23,0.9),0_10px_24px_-8px_rgba(28,25,23,0.18)] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 disabled:opacity-50"
                >
                  {portalLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CreditCard className="h-4 w-4" />
                  )}
                  Manage subscription
                </button>
              ) : null}

              {paid && isComp ? (
                <p className="text-[13px] text-[var(--foreground-muted)]">
                  Complimentary access, contact{" "}
                  <TrackedAnchor
                    href="mailto:hello@lazur.app"
                    event="support_contact_clicked"
                    eventProps={{ channel: "email", location: "billing_page_comp" }}
                    className="font-semibold text-[var(--foreground)] underline underline-offset-4"
                  >
                    support
                  </TrackedAnchor>{" "}
                  to change your plan.
                </p>
              ) : null}
            </div>
          </div>
        </motion.div>

        {!paid ? (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.45 }}
            className="mb-12 md:mb-16"
          >
            <div className="mb-6 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="font-sans text-[1.75rem] font-bold leading-[1.1] tracking-[-0.04em] text-[var(--foreground)] md:text-[2.25rem]">
                  Choose a plan
                </h2>
                <p className="mt-3 max-w-md text-[15px] leading-relaxed text-[var(--foreground-muted)]">
                  {onTrial
                    ? "Pick a plan before your trial ends and nothing changes. Checkout is secure; cancel anytime."
                    : "Subscribe to keep your AI companion: questions, pointing, jobs and dictation."}
                </p>
              </div>
              <BillingIntervalToggle
                interval={interval === "year" ? "annual" : "monthly"}
                maxSavings={maxSavings}
                onChange={(next) => {
                  const nextInterval = next === "annual" ? "year" : "month";
                  if (nextInterval !== interval) {
                    track("pricing_interval_toggled", { interval: nextInterval, location: "billing_page" });
                  }
                  setInterval(nextInterval);
                }}
              />
            </div>

            <div className="grid items-stretch gap-4 md:grid-cols-2 md:gap-6">
              {UPGRADE_PLAN_META.map((plan) => {
                const eligible = canUpgradeTo(user.plan, plan.planType);
                const normalizedPlan = user.plan.toLowerCase();
                const isCurrent =
                  normalizedPlan === plan.planType && !normalizedPlan.includes("trial");
                const websitePlan = WEBSITE_PLANS.find((p) => p.id === plan.planId);
                const priceDisplay = websitePlan
                  ? planPrices(
                      websitePlan,
                      "international",
                      interval === "year" ? "annual" : "monthly",
                    )
                  : null;

                return (
                  <BillingPlanCard
                    key={plan.planType}
                    name={plan.name}
                    planType={plan.planType}
                    description={plan.description}
                    features={plan.features}
                    popular={plan.popular}
                    priceDisplay={priceDisplay}
                    eligible={eligible}
                    isCurrent={isCurrent}
                    checkoutLoading={checkoutPlan === plan.planType}
                    onCheckout={() => {
                      track("plan_selected", {
                        plan: plan.planType,
                        interval,
                        location: "billing_page",
                        label: `Upgrade to ${plan.name}`,
                        next_step: "checkout",
                        signed_in: true,
                      });
                      void handleCheckout(plan.planType);
                    }}
                  />
                );
              })}
            </div>
          </motion.section>
        ) : null}

        <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.45 }}
          >
            <div className="h-full rounded-[20px] border-[1.5px] border-[#1c1917] bg-white shadow-[0_2px_0_rgba(28,25,23,0.9),0_10px_24px_-8px_rgba(28,25,23,0.18)] p-5 md:p-6">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#5b4bd6]">
                  <History className="h-4 w-4 text-white" strokeWidth={2} />
                </div>
                <div>
                  <h2 className="text-[18px] font-bold tracking-[-0.03em] text-[var(--foreground)]">
                    Billing activity
                  </h2>
                  <p className="text-[13px] text-[var(--foreground-muted)]">
                    Account and checkout events
                  </p>
                </div>
              </div>
              {activity.length === 0 ? (
                <p className="text-[14px] text-[var(--foreground-muted)]">
                  No activity yet.
                </p>
              ) : (
                <ActivityTimeline items={activity} />
              )}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14, duration: 0.45 }}
          >
            <div className="h-full rounded-[20px] border-[1.5px] border-[#1c1917] bg-white shadow-[0_2px_0_rgba(28,25,23,0.9),0_10px_24px_-8px_rgba(28,25,23,0.18)] p-5 md:p-6">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#e0621c]">
                  <Receipt className="h-4 w-4 text-white" strokeWidth={2} />
                </div>
                <div>
                  <h2 className="text-[18px] font-bold tracking-[-0.03em] text-[var(--foreground)]">
                    Billing history
                  </h2>
                  <p className="text-[13px] text-[var(--foreground-muted)]">
                    Invoices
                  </p>
                </div>
              </div>
              {invoices.length === 0 ? (
                <p className="text-[14px] leading-relaxed text-[var(--foreground-muted)]">
                  No invoices yet. Paid subscriptions will appear here once you
                  subscribe.
                </p>
              ) : (
                <ul className="space-y-3">
                  {invoices.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-start justify-between gap-3 rounded-[12px] border-[1.5px] border-[#1c1917] bg-white px-4 py-3 shadow-[0_2px_0_rgba(28,25,23,0.9)]"
                    >
                      <div className="min-w-0">
                        <p className="text-[14px] font-semibold text-[var(--foreground)]">
                          {invoiceLabel(item)}
                        </p>
                        <p className="mt-1 text-[13px] text-[var(--foreground-muted)]">
                          {formatDateTime(item.paid_at ?? item.created_at)} · {item.status}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="font-sans text-[16px] font-bold tabular-nums tracking-[-0.02em] text-[var(--foreground)]">
                          {formatMoney(item.amount_cents, item.currency)}
                        </p>
                        {item.invoice_url ? (
                          <TrackedAnchor
                            href={item.invoice_url}
                            event="invoice_opened"
                            eventProps={{ location: "billing_page", status: item.status }}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-1 inline-flex items-center gap-1 text-[13px] font-semibold text-[var(--foreground)] underline decoration-[var(--foreground)]/25 underline-offset-4 hover:decoration-[var(--foreground)]"
                          >
                            Invoice
                            <ExternalLink className="h-3 w-3" />
                          </TrackedAnchor>
                        ) : null}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.section>
        </div>

        <p className="mt-12 text-center text-[14px] text-[var(--foreground-muted)]">
          Questions?{" "}
          <TrackedAnchor
            href="mailto:hello@lazur.app"
            event="support_contact_clicked"
            eventProps={{ channel: "email", location: "billing_page_footer" }}
            className="font-semibold text-[var(--foreground)] underline decoration-[var(--foreground)]/25 underline-offset-4 hover:decoration-[var(--foreground)]"
          >
            Contact support
          </TrackedAnchor>
        </p>
      </main>
    </MarketingPageShell>
  );
}

export default function BillingPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <BillingContent />
    </Suspense>
  );
}
