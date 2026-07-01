"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  CreditCard,
  ExternalLink,
  History,
  Loader2,
  Receipt,
  Sparkles,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
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
  WEBSITE_PLANS,
} from "@/lib/pricingPlans";
import {
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
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-[-0.03em] text-[var(--foreground)] md:text-[2.5rem]">
            Plans & billing
          </h1>
          <p className="mt-2 text-[15px] leading-relaxed text-[var(--foreground-muted)]">
            {periodEndDescription(user.plan, periodEnd, {
              cancelAtPeriodEnd: cancelScheduled,
              billingSource: billingStatus?.billing_source ?? user.billing_source,
            })}
          </p>
          {trialExpired && !paid && (
            <SoftCard hover={false} className="mt-4 border border-amber-200/80 bg-amber-50/80 px-4 py-3">
              <p className="text-[13px] font-medium text-amber-950">
                Your 7-day Pro trial has ended. Subscribe to keep dictating with Lazur.
              </p>
              {region === "india" ? (
                <p className="mt-1 text-[12px] text-amber-900/80">{INDIA_GST_NOTE}</p>
              ) : null}
            </SoftCard>
          )}
          {fromApp && (
            <SoftCard hover={false} className="mt-4 px-4 py-3">
              <p className="text-[13px] text-[var(--foreground-muted)]">
                After upgrading, return to the Lazur desktop app — your plan updates
                automatically.
              </p>
            </SoftCard>
          )}
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.45 }}
        >
          <SoftCard hover={false} className="mb-6 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--foreground-faint)]">
                Current plan
              </h2>
              <Sparkles className="h-4 w-4 text-[var(--foreground-faint)]" strokeWidth={1.75} />
            </div>
            <p className="font-display text-2xl font-semibold tracking-tight text-[var(--foreground)]">
              {user.plan}
            </p>
            {isComp && billingStatus?.comp_reason && (
              <p className="mt-1 text-[13px] text-[var(--foreground-muted)]">
                {billingStatus.comp_reason}
              </p>
            )}
            <p className="mt-2 text-[14px] text-[var(--foreground-muted)]">
              {periodEndLabel(user.plan, { cancelAtPeriodEnd: cancelScheduled })}:{" "}
              {formatSubscriptionDate(periodEnd)}
            </p>
            {cancelScheduled && (
              <p className="mt-2 text-[13px] text-amber-800">
                Cancellation scheduled — you keep access until the date above.
              </p>
            )}
            {canManagePortal && (
              <button
                type="button"
                onClick={handleManageBilling}
                disabled={portalLoading}
                className="btn-outline-dark mt-5 inline-flex items-center gap-2 disabled:opacity-50"
              >
                {portalLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CreditCard className="h-4 w-4" />
                )}
                Manage subscription
              </button>
            )}
            {paid && isComp && (
              <p className="mt-4 text-[13px] text-[var(--foreground-muted)]">
                Complimentary access — contact{" "}
                <a href="mailto:hello@lazur.app" className="font-medium underline">
                  support
                </a>{" "}
                to change your plan.
              </p>
            )}
          </SoftCard>
        </motion.div>

        {error && (
          <p className="mb-4 rounded-[var(--radius-card)] border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-800">
            {error}
          </p>
        )}

        {!paid && (
          <div className="mb-6 flex justify-center">
            <BillingIntervalToggle
              interval={interval === "year" ? "annual" : "monthly"}
              maxSavings={maxSavings}
              onChange={(next) => setInterval(next === "annual" ? "year" : "month")}
            />
          </div>
        )}

        {(activity.length > 0 || invoices.length > 0) && (
          <div className="mb-8 grid gap-6 lg:grid-cols-2">
            {activity.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08, duration: 0.45 }}
              >
                <SoftCard hover={false} className="p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <History className="h-4 w-4 text-[var(--foreground-faint)]" />
                    <h2 className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--foreground-faint)]">
                      Billing activity
                    </h2>
                  </div>
                  <ul className="space-y-3">
                    {activity.map((item) => (
                      <li
                        key={item.id}
                        className="border-b border-[var(--foreground)]/5 pb-3 last:border-0 last:pb-0"
                      >
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
                      </li>
                    ))}
                  </ul>
                </SoftCard>
              </motion.section>
            )}

            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.45 }}
            >
              <SoftCard hover={false} className="p-6">
                <div className="mb-4 flex items-center gap-2">
                  <Receipt className="h-4 w-4 text-[var(--foreground-faint)]" />
                  <h2 className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--foreground-faint)]">
                    Billing history
                  </h2>
                </div>
                {invoices.length === 0 ? (
                  <p className="text-[13px] text-[var(--foreground-muted)]">
                    No invoices yet. Payments through Polar will appear here.
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {invoices.map((item) => (
                      <li
                        key={item.id}
                        className="flex items-start justify-between gap-3 border-b border-[var(--foreground)]/5 pb-3 last:border-0 last:pb-0"
                      >
                        <div>
                          <p className="text-[14px] font-medium text-[var(--foreground)]">
                            {invoiceLabel(item)}
                          </p>
                          <p className="mt-0.5 text-[12px] text-[var(--foreground-faint)]">
                            {formatDateTime(item.paid_at ?? item.created_at)} · {item.status}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[14px] font-semibold text-[var(--foreground)]">
                            {formatMoney(item.amount_cents, item.currency)}
                          </p>
                          {item.invoice_url && (
                            <a
                              href={item.invoice_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-1 inline-flex items-center gap-1 text-[12px] font-medium text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                            >
                              Invoice
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </SoftCard>
            </motion.section>
          </div>
        )}

        <div className="space-y-4">
          {UPGRADE_PLAN_META.map((plan, idx) => {
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
              <motion.div
                key={plan.planType}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + idx * 0.06, duration: 0.45 }}
              >
                <SoftCard
                  hover={false}
                  className={`relative p-6 md:p-7 ${
                    plan.popular ? "ring-1 ring-[var(--foreground)]/10" : ""
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-6 rounded-full bg-[var(--foreground)] px-3 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--background)]">
                      Popular
                    </div>
                  )}

                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h3 className="font-display text-xl font-semibold text-[var(--foreground)]">
                        {plan.name}
                      </h3>
                      <p className="mt-1.5 text-[14px] leading-relaxed text-[var(--foreground-muted)]">
                        {plan.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-display text-3xl font-semibold tracking-tight text-[var(--foreground)]">
                        {priceDisplay?.price ?? "—"}
                      </span>
                      {priceDisplay?.period ? (
                        <span className="text-[14px] text-[var(--foreground-muted)]">
                          {" "}
                          {priceDisplay.period}
                        </span>
                      ) : null}
                      {priceDisplay?.equivMonthly ? (
                        <p className="mt-1 text-[12px] text-[var(--foreground-faint)]">
                          {priceDisplay.equivMonthly}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <ul className="mt-5 space-y-2.5">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2.5 text-[13px] text-[var(--foreground-muted)]"
                      >
                        <div className="mt-0.5 rounded-full bg-[var(--background-deep)] p-0.5 text-[var(--foreground-muted)]">
                          <Check className="h-3.5 w-3.5" strokeWidth={2} />
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    onClick={() => handleCheckout(plan.planType)}
                    disabled={!eligible || isCurrent || checkoutPlan !== null}
                    className={`mt-6 w-full rounded-full py-3 text-[14px] font-semibold transition-opacity active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 ${
                      isCurrent || !eligible
                        ? "bg-[var(--background-deep)] text-[var(--foreground-faint)]"
                        : "btn-dark"
                    }`}
                  >
                    {checkoutPlan === plan.planType ? (
                      <span className="inline-flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Redirecting…
                      </span>
                    ) : isCurrent ? (
                      "Current plan"
                    ) : eligible ? (
                      `Upgrade to ${plan.name}`
                    ) : (
                      "Not available"
                    )}
                  </button>
                </SoftCard>
              </motion.div>
            );
          })}
        </div>

        <p className="mt-8 text-center text-[12px] text-[var(--foreground-faint)]">
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
