"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
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
import { BillingPlanCard } from "@/components/billing/BillingPlanCard";
import { DashboardSkeleton } from "@/components/DashboardSkeleton";
import { MarketingPageShell } from "@/components/MarketingPageShell";
import { SoftCard } from "@/components/SoftCard";
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
  type BillingActivityItem,
  type BillingInvoiceItem,
  type BillingInterval,
  type BillingStatus,
  type PlanType,
} from "@/lib/billing";
import { loginPathWithReturn } from "@/lib/returnTo";
import { BillingIntervalToggle } from "@/components/pricing/BillingIntervalToggle";
import { usePricingRegion } from "@/hooks/usePricingRegion";
import {
  INDIA_GST_NOTE,
  maxAnnualSavings,
  planPrices,
  regionCurrencyLabel,
  WEBSITE_PLANS,
} from "@/lib/pricingPlans";
import {
  daysRemaining,
  formatSubscriptionDate,
  periodEndDescription,
  periodEndLabel,
} from "@/lib/subscriptionDates";

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
    description: "150,000 words / month and 50 Command Mode uses.",
    features: [
      "50 Command Mode uses",
      "Smart Rewrite + Zen Mode",
      "9 clipboard slots",
      "Dictionary & snippets",
    ],
    popular: true,
  },
  {
    name: "Power",
    planType: "power",
    planId: "power",
    description: "500,000 words / month and 300 Command Mode uses.",
    features: [
      "300 Command Mode uses",
      "Voice Profiling (coming soon)",
      "Priority support",
      "Everything in Pro",
    ],
    popular: false,
  },
];

function formatDateTime(iso?: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function planStatusLabel(plan: string, paid: boolean, trialExpired: boolean) {
  const normalized = plan.toLowerCase();
  if (trialExpired && !paid) return "Trial ended";
  if (normalized.includes("trial")) return "Trial active";
  if (paid) return "Subscribed";
  return "Free";
}

function ActivityTimeline({ items }: { items: BillingActivityItem[] }) {
  return (
    <ul className="space-y-0">
      {items.map((item, i) => (
        <li key={item.id} className="relative flex gap-4 pb-5 last:pb-0">
          {i < items.length - 1 ? (
            <span
              aria-hidden
              className="absolute left-[7px] top-4 h-[calc(100%-4px)] w-px bg-[var(--border)]"
            />
          ) : null}
          <span className="relative z-[1] mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full border-2 border-[var(--foreground)]/20 bg-white" />
          <div className="min-w-0 flex-1 pt-0.5">
            <p className="text-[14px] font-medium text-[var(--foreground)]">
              {item.label}
              {item.detail ? (
                <span className="font-normal text-[var(--foreground-muted)]">
                  {" "}
                  · {item.detail}
                </span>
              ) : null}
            </p>
            <p className="mt-0.5 text-[12px] text-[var(--foreground-faint)]">
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
  const { region } = usePricingRegion();
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
  const maxSavings = maxAnnualSavings(region);

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
    }

    load();
  }, [router, refresh]);

  const handleCheckout = useCallback(
    async (planType: PlanType) => {
      setError(null);
      setCheckoutPlan(planType);
      try {
        const country = region === "india" ? "IN" : "US";
        const url = await createCheckoutSession(planType, interval, country);
        if (url) {
          window.location.href = url;
          return;
        }
        setError("Could not start checkout. Please try again.");
      } catch {
        setError("Could not start checkout. Please try again.");
      } finally {
        setCheckoutPlan(null);
      }
    },
    [interval, region],
  );

  useEffect(() => {
    if (loading || !user || preselectStarted.current) return;
    if (preselectedPlan !== "pro" && preselectedPlan !== "power") return;
    if (!canUpgradeTo(user.plan, preselectedPlan)) return;

    preselectStarted.current = true;
    void handleCheckout(preselectedPlan);
  }, [loading, user, preselectedPlan, handleCheckout]);

  const handleManageBilling = async () => {
    setError(null);
    setPortalLoading(true);
    try {
      const { url, error: portalError } = await fetchCustomerPortalUrl();
      if (url) {
        window.location.href = url;
        return;
      }
      setError(portalError ?? "Could not open billing portal. Please try again.");
    } catch {
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
    trialDays !== null && trialDays <= 7 ? Math.max(0, ((7 - trialDays) / 7) * 100) : null;
  const statusLabel = planStatusLabel(user.plan, paid, trialExpired);

  return (
    <MarketingPageShell>
      <Navbar />
      <main className="relative mx-auto max-w-5xl px-6 pb-20 pt-24 md:pt-28">
        <motion.header
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <Link
            href={fromApp ? "/download" : "/dashboard"}
            className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground)]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {fromApp ? "Back to app" : "Back to dashboard"}
          </Link>
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--foreground-faint)]">
            Billing
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-[-0.03em] text-[var(--foreground)] md:text-[2.75rem]">
            Plans & billing
          </h1>
        </motion.header>

        {error ? (
          <p className="mb-6 rounded-[var(--radius-card)] border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-800">
            {error}
          </p>
        ) : null}

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.04, duration: 0.45 }}
          className="mb-8"
        >
          <SoftCard hover={false} className="overflow-hidden p-0">
            <div className="border-b border-[var(--border)] bg-gradient-to-br from-[var(--brand-soft)]/55 via-white to-white px-6 py-6 md:px-7 md:py-7">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${
                        trialExpired && !paid
                          ? "bg-amber-100 text-amber-900"
                          : onTrial
                            ? "bg-[var(--brand-soft)] text-[var(--brand-ink)]"
                            : "bg-white/90 text-[var(--foreground-muted)]"
                      }`}
                    >
                      {statusLabel}
                    </span>
                    <span className="text-[11px] font-medium text-[var(--foreground-faint)]">
                      {regionCurrencyLabel(region)}
                    </span>
                  </div>
                  <p className="mt-3 font-display text-2xl font-semibold tracking-tight text-[var(--foreground)] md:text-[2rem]">
                    {user.plan}
                  </p>
                  <p className="mt-2 text-[14px] leading-relaxed text-[var(--foreground-muted)]">
                    {periodEndDescription(user.plan, periodEnd, {
                      cancelAtPeriodEnd: cancelScheduled,
                      billingSource: billingStatus?.billing_source ?? user.billing_source,
                    })}
                  </p>
                </div>
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[var(--border)] bg-white/80 text-[var(--foreground-muted)] shadow-sm">
                  {onTrial ? (
                    <Sparkles className="h-5 w-5" strokeWidth={1.5} />
                  ) : (
                    <Gauge className="h-5 w-5" strokeWidth={1.5} />
                  )}
                </div>
              </div>

              {trialProgress !== null ? (
                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between text-[12px]">
                    <span className="font-medium text-[var(--foreground-muted)]">
                      Trial progress
                    </span>
                    <span className="tabular-nums text-[var(--foreground-faint)]">
                      {trialDays} {trialDays === 1 ? "day" : "days"} left
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/80">
                    <div
                      className="h-full rounded-full bg-[var(--foreground)] transition-all"
                      style={{ width: `${trialProgress}%` }}
                    />
                  </div>
                </div>
              ) : null}
            </div>

            <div className="space-y-3 px-6 py-5 md:px-7">
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
                <p className="rounded-lg border border-amber-200/80 bg-amber-50/70 px-3 py-2 text-[13px] text-amber-900">
                  Cancellation scheduled — you keep access until the date above.
                </p>
              ) : null}

              {trialExpired && !paid ? (
                <p className="rounded-lg border border-amber-200/80 bg-amber-50/70 px-3 py-2 text-[13px] font-medium text-amber-950">
                  Your 7-day Pro trial has ended. Subscribe to keep dictating with Lazur.
                </p>
              ) : null}

              {fromApp ? (
                <p className="text-[13px] text-[var(--foreground-muted)]">
                  After upgrading, return to the Lazur desktop app — your plan updates
                  automatically.
                </p>
              ) : null}

              {canManagePortal ? (
                <button
                  type="button"
                  onClick={handleManageBilling}
                  disabled={portalLoading}
                  className="btn-outline-dark mt-1 inline-flex items-center gap-2 disabled:opacity-50"
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
                  Complimentary access — contact{" "}
                  <a href="mailto:hello@lazur.app" className="font-medium underline">
                    support
                  </a>{" "}
                  to change your plan.
                </p>
              ) : null}
            </div>
          </SoftCard>
        </motion.div>

        {!paid ? (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.45 }}
            className="mb-10"
          >
            <div className="mb-6 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="font-display text-xl font-semibold tracking-tight text-[var(--foreground)] md:text-2xl">
                  Choose a plan
                </h2>
                <p className="mt-1.5 max-w-md text-[14px] leading-relaxed text-[var(--foreground-muted)]">
                  {onTrial
                    ? "Lock in Pro or Power before your trial ends — checkout is handled securely via Polar."
                    : "Subscribe to keep full access to dictation, Command Mode, and polish."}
                </p>
                {region === "india" ? (
                  <p className="mt-2 text-[12px] text-[var(--foreground-faint)]">
                    {INDIA_GST_NOTE}
                  </p>
                ) : null}
              </div>
              <BillingIntervalToggle
                interval={interval === "year" ? "annual" : "monthly"}
                maxSavings={maxSavings}
                onChange={(next) => setInterval(next === "annual" ? "year" : "month")}
              />
            </div>

            <div className="grid items-stretch gap-5 md:grid-cols-2">
              {UPGRADE_PLAN_META.map((plan) => {
                const eligible = canUpgradeTo(user.plan, plan.planType);
                const normalizedPlan = user.plan.toLowerCase();
                const isCurrent =
                  normalizedPlan === plan.planType && !normalizedPlan.includes("trial");
                const websitePlan = WEBSITE_PLANS.find((p) => p.id === plan.planId);
                const priceDisplay = websitePlan
                  ? planPrices(
                      websitePlan,
                      region,
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
                    onCheckout={() => handleCheckout(plan.planType)}
                  />
                );
              })}
            </div>
          </motion.section>
        ) : null}

        <div className="grid gap-5 lg:grid-cols-2">
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.45 }}
          >
            <SoftCard hover={false} className="h-full p-6">
              <div className="mb-5 flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--background-deep)]/50">
                  <History className="h-4 w-4 text-[var(--foreground-muted)]" strokeWidth={1.75} />
                </div>
                <div>
                  <h2 className="text-[14px] font-semibold text-[var(--foreground)]">
                    Billing activity
                  </h2>
                  <p className="text-[12px] text-[var(--foreground-faint)]">
                    Account and checkout events
                  </p>
                </div>
              </div>
              {activity.length === 0 ? (
                <p className="text-[13px] text-[var(--foreground-muted)]">
                  No activity yet.
                </p>
              ) : (
                <ActivityTimeline items={activity} />
              )}
            </SoftCard>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14, duration: 0.45 }}
          >
            <SoftCard hover={false} className="h-full p-6">
              <div className="mb-5 flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--background-deep)]/50">
                  <Receipt className="h-4 w-4 text-[var(--foreground-muted)]" strokeWidth={1.75} />
                </div>
                <div>
                  <h2 className="text-[14px] font-semibold text-[var(--foreground)]">
                    Billing history
                  </h2>
                  <p className="text-[12px] text-[var(--foreground-faint)]">
                    Invoices from Polar
                  </p>
                </div>
              </div>
              {invoices.length === 0 ? (
                <p className="text-[13px] leading-relaxed text-[var(--foreground-muted)]">
                  No invoices yet. Payments through Polar will appear here once you
                  subscribe.
                </p>
              ) : (
                <ul className="space-y-3">
                  {invoices.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-start justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--background-deep)]/25 px-4 py-3"
                    >
                      <div className="min-w-0">
                        <p className="text-[14px] font-medium text-[var(--foreground)]">
                          {invoiceLabel(item)}
                        </p>
                        <p className="mt-0.5 text-[12px] text-[var(--foreground-faint)]">
                          {formatDateTime(item.paid_at ?? item.created_at)} · {item.status}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="font-display text-base font-semibold tabular-nums text-[var(--foreground)]">
                          {formatMoney(item.amount_cents, item.currency)}
                        </p>
                        {item.invoice_url ? (
                          <a
                            href={item.invoice_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-1 inline-flex items-center gap-1 text-[12px] font-medium text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                          >
                            Invoice
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : null}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </SoftCard>
          </motion.section>
        </div>

        <p className="mt-10 text-center text-[12px] text-[var(--foreground-faint)]">
          Questions?{" "}
          <a
            href="mailto:hello@lazur.app"
            className="font-medium text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground)]"
          >
            Contact support
          </a>
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
