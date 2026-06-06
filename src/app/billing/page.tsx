"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Check, CreditCard, Loader2, Sparkles } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { DashboardSkeleton } from "@/components/DashboardSkeleton";
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
    <div className="min-h-screen bg-[var(--background)]">
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 pb-20 pt-28">
        <header className="mb-8">
          <Link
            href={fromApp ? "/download" : "/dashboard"}
            className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {fromApp ? "Back to app" : "Back to dashboard"}
          </Link>
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--foreground-faint)]">
            Billing
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-[var(--foreground)]">
            Plans & billing
          </h1>
          <p className="mt-2 text-sm text-[var(--foreground-muted)]">
            {periodEndDescription(user.plan, periodEnd)}
          </p>
          {fromApp && (
            <p className="mt-3 rounded-xl border border-[var(--border)] bg-[var(--surface-solid)] px-4 py-3 text-[13px] text-[var(--foreground-muted)]">
              After upgrading, return to the Lazur desktop app — your plan updates automatically.
            </p>
          )}
        </header>

        <section className="glass mb-6 rounded-2xl p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--foreground-faint)]">
              Current plan
            </h2>
            <Sparkles className="h-4 w-4 text-[var(--brand)]" />
          </div>
          <p className="font-display text-2xl font-semibold text-[var(--foreground)]">{user.plan}</p>
          <p className="mt-2 text-sm text-[var(--foreground-muted)]">
            {periodEndLabel(user.plan)}: {formatSubscriptionDate(periodEnd)}
          </p>
          {paid && (
            <button
              type="button"
              onClick={handleManageBilling}
              disabled={portalLoading}
              className="mt-5 inline-flex items-center gap-2 rounded-xl border border-[var(--border-strong)] bg-[var(--surface-solid)] px-4 py-2.5 text-[13px] font-semibold text-[var(--foreground)] transition-colors hover:border-[var(--brand)]/30 disabled:opacity-50"
            >
              {portalLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CreditCard className="h-4 w-4" />
              )}
              Manage subscription
            </button>
          )}
        </section>

        {error && (
          <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-800">
            {error}
          </p>
        )}

        <div className="space-y-4">
          {UPGRADE_PLANS.map((plan) => {
            const eligible = canUpgradeTo(user.plan, plan.planType);
            const isCurrent =
              user.plan.toLowerCase() === plan.planType ||
              (plan.planType === "pro" && user.plan.toLowerCase().includes("trial"));

            return (
              <section
                key={plan.planType}
                className={`glass rounded-2xl p-6 ${plan.popular ? "ring-2 ring-[var(--brand)]/15" : ""}`}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-display text-xl font-semibold text-[var(--foreground)]">
                        {plan.name}
                      </h3>
                      {plan.popular && (
                        <span className="rounded-full bg-[var(--brand-soft)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--brand-ink)]">
                          Popular
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-[var(--foreground-muted)]">{plan.description}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-display text-3xl font-semibold text-[var(--foreground)]">
                      {plan.price}
                    </span>
                    <span className="text-sm text-[var(--foreground-muted)]">{plan.period}</span>
                  </div>
                </div>

                <ul className="mt-4 space-y-2">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 text-[13px] text-[var(--foreground-muted)]"
                    >
                      <Check className="h-4 w-4 shrink-0 text-[var(--brand)]" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => handleCheckout(plan.planType)}
                  disabled={!eligible || isCurrent || checkoutPlan !== null}
                  className="mt-5 w-full rounded-xl bg-[var(--foreground)] py-3 text-sm font-semibold text-[var(--background)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {checkoutPlan === plan.planType ? (
                    <span className="inline-flex items-center gap-2">
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
              </section>
            );
          })}
        </div>

        <p className="mt-8 text-center text-[12px] text-[var(--foreground-faint)]">
          Questions?{" "}
          <a href="mailto:hello@lazur.app" className="font-medium text-[var(--foreground-muted)] hover:underline">
            Contact support
          </a>
        </p>
      </main>
    </div>
  );
}

export default function BillingPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <BillingContent />
    </Suspense>
  );
}
