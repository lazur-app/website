"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Check, CreditCard, Loader2, Sparkles } from "lucide-react";
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
  fetchCustomerPortalUrl,
  isPaidPlan,
  type PlanType,
} from "@/lib/billing";
import { loginPathWithReturn } from "@/lib/returnTo";
import {
  formatSubscriptionDate,
  periodEndDescription,
  periodEndLabel,
} from "@/lib/subscriptionDates";

const UPGRADE_PLANS = [
  {
    name: "Pro",
    planType: "pro" as PlanType,
    price: "$10",
    period: "/ month",
    description: "150,000 words / month plus Command Mode for daily use.",
    features: ["Command Mode", "Smart Rewrite", "Unlimited devices", "Priority support"],
    popular: true,
  },
  {
    name: "Power",
    planType: "power" as PlanType,
    price: "$25",
    period: "/ month",
    description: "500,000 words / month for heavy writers and engineers.",
    features: ["200 Command Mode uses", "Maximum word budget", "Priority support"],
    popular: false,
  },
];

function BillingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refresh } = useAuth();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutPlan, setCheckoutPlan] = useState<PlanType | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fromApp = searchParams.get("source") === "app";
  const preselectedPlan = searchParams.get("plan");
  const preselectStarted = useRef(false);

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

      setUser(profile);
      setLoading(false);
    }

    load();
  }, [router, refresh]);

  const handleCheckout = useCallback(async (planType: PlanType) => {
    setError(null);
    setCheckoutPlan(planType);
    try {
      const url = await createCheckoutSession(planType);
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
  }, []);

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
      const url = await fetchCustomerPortalUrl();
      if (url) {
        window.location.href = url;
        return;
      }
      setError("Billing portal is not available yet. Contact support if you need help.");
    } catch {
      setError("Could not open billing portal. Please try again.");
    } finally {
      setPortalLoading(false);
    }
  };

  if (loading || !user) {
    return <DashboardSkeleton />;
  }

  const periodEnd = user.current_period_end ?? user.trial_ends_at;
  const paid = isPaidPlan(user.plan);

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
            {periodEndDescription(user.plan, periodEnd)}
          </p>
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
            <p className="mt-2 text-[14px] text-[var(--foreground-muted)]">
              {periodEndLabel(user.plan)}: {formatSubscriptionDate(periodEnd)}
            </p>
            {paid && (
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
          </SoftCard>
        </motion.div>

        {error && (
          <p className="mb-4 rounded-[var(--radius-card)] border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-800">
            {error}
          </p>
        )}

        <div className="space-y-4">
          {UPGRADE_PLANS.map((plan, idx) => {
            const eligible = canUpgradeTo(user.plan, plan.planType);
            const normalizedPlan = user.plan.toLowerCase();
            const isCurrent =
              normalizedPlan === plan.planType && !normalizedPlan.includes("trial");

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
                        {plan.price}
                      </span>
                      <span className="text-[14px] text-[var(--foreground-muted)]">
                        {plan.period}
                      </span>
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
