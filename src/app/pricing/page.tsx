"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion as m } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MarketingPageShell } from "@/components/MarketingPageShell";
import { BillingIntervalToggle } from "@/components/pricing/BillingIntervalToggle";
import { PricingPlanCard } from "@/components/pricing/PricingPlanCard";
import { PricingStudentOffer } from "@/components/pricing/PricingStudentOffer";
import { PricingTimeCalculator } from "@/components/pricing/PricingTimeCalculator";
import { usePricingRegion } from "@/hooks/usePricingRegion";
import { hasValidSessionToken } from "@/lib/auth";
import {
  consumeCheckoutIntent,
  redirectToCheckout,
  storeCheckoutIntent,
  type PlanType,
} from "@/lib/billing";
import { loginPathWithReturn } from "@/lib/returnTo";
import {
  FAIR_USE_FOOTNOTE,
  maxAnnualSavings,
  WEBSITE_PLANS,
  type BillingInterval,
  type PricingRegion,
} from "@/lib/pricingPlans";

function toBillingInterval(interval: BillingInterval): "month" | "year" {
  return interval === "annual" ? "year" : "month";
}

export default function PricingPage() {
  const { region, loading: regionLoading } = usePricingRegion();
  const [interval, setInterval] = useState<BillingInterval>("monthly");
  const [checkoutPlan, setCheckoutPlan] = useState<PlanType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const intentHandled = useRef(false);
  const maxSavings = maxAnnualSavings(region);

  const startCheckout = useCallback(
    async (planType: PlanType, billingInterval: "month" | "year", pricingRegion: PricingRegion) => {
      setError(null);
      setCheckoutPlan(planType);
      const result = await redirectToCheckout(planType, billingInterval, pricingRegion);
      if (!result.ok) {
        setError(result.error);
        setCheckoutPlan(null);
      }
    },
    [],
  );

  useEffect(() => {
    if (regionLoading || intentHandled.current) return;
    if (!hasValidSessionToken()) return;

    const intent = consumeCheckoutIntent();
    if (!intent) return;

    intentHandled.current = true;
    void startCheckout(intent.plan, intent.interval, region);
  }, [regionLoading, region, startCheckout]);

  const handlePlanAction = async (plan: (typeof WEBSITE_PLANS)[number]) => {
    if (plan.cta === "download") {
      window.location.href = "/download";
      return;
    }

    const planType = plan.planType;
    if (!planType || regionLoading) return;

    const billingInterval = toBillingInterval(interval);

    if (!hasValidSessionToken()) {
      storeCheckoutIntent({ plan: planType, interval: billingInterval });
      window.location.href = loginPathWithReturn("/pricing");
      return;
    }

    await startCheckout(planType, billingInterval, region);
  };

  const checkoutBusy = checkoutPlan !== null;

  return (
    <MarketingPageShell>
      <Navbar />

      <main className="relative mx-auto flex max-w-6xl flex-col items-center px-6 pb-16 pt-24 md:pt-28">
        <div className="mb-8 text-center md:mb-10">
          <m.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-3xl font-semibold tracking-[-0.03em] text-[var(--foreground)] md:text-[2.75rem]"
          >
            Simple pricing. Try Pro free first.
          </m.h1>
          <p className="mx-auto mt-3 max-w-md text-[15px] lowercase leading-relaxed text-[var(--foreground-muted)]">
            three plans. no weird add-ons. start talking.
          </p>
        </div>

        <m.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 flex w-full justify-center overflow-visible"
        >
          <BillingIntervalToggle
            interval={interval}
            maxSavings={maxSavings}
            onChange={setInterval}
          />
        </m.div>

        {error ? (
          <p className="mb-6 w-full max-w-2xl rounded-[var(--radius-card)] border border-red-200 bg-red-50 px-4 py-3 text-center text-[13px] text-red-800">
            {error}
          </p>
        ) : null}

        <div className="grid w-full max-w-5xl items-stretch gap-4 md:grid-cols-3 md:gap-5">
          {WEBSITE_PLANS.map((plan, idx) => (
            <m.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + idx * 0.08 }}
              className="h-full overflow-visible"
            >
              <PricingPlanCard
                plan={plan}
                region={region}
                interval={interval}
                onAction={() => void handlePlanAction(plan)}
                actionLoading={
                  plan.cta === "checkout" && checkoutPlan === plan.planType
                }
                actionDisabled={checkoutBusy && plan.cta === "checkout"}
              />
            </m.div>
          ))}
        </div>

        <m.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="mt-6 max-w-2xl text-center text-[12px] leading-relaxed text-[var(--foreground-faint)]"
        >
          {FAIR_USE_FOOTNOTE}{" "}
          <Link
            href="/download"
            className="font-medium text-[var(--foreground-muted)] underline-offset-2 hover:underline"
          >
            Download the app
          </Link>{" "}
          to start your trial.
        </m.p>

        <m.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.48 }}
          className="mt-16 w-full max-w-5xl"
        >
          <PricingStudentOffer />
        </m.div>

        <m.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.56 }}
          className="mt-16 flex w-full justify-center md:mt-20"
        >
          <PricingTimeCalculator />
        </m.div>
      </main>

      <Footer />
    </MarketingPageShell>
  );
}
