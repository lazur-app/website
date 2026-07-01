"use client";

import Link from "next/link";
import { useState } from "react";
import { motion as m } from "framer-motion";
import { ShieldCheck, Globe, Cpu } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MarketingPageShell } from "@/components/MarketingPageShell";
import { BillingIntervalToggle } from "@/components/pricing/BillingIntervalToggle";
import { PricingPlanCard } from "@/components/pricing/PricingPlanCard";
import { usePricingRegion } from "@/hooks/usePricingRegion";
import { hasValidSessionToken } from "@/lib/auth";
import { loginPathWithReturn } from "@/lib/returnTo";
import {
  FAIR_USE_FOOTNOTE,
  INDIA_GST_NOTE,
  maxAnnualSavings,
  regionCurrencyLabel,
  WEBSITE_PLANS,
  type BillingInterval,
} from "@/lib/pricingPlans";

export default function PricingPage() {
  const { region, loading: regionLoading } = usePricingRegion();
  const [interval, setInterval] = useState<BillingInterval>("monthly");
  const maxSavings = maxAnnualSavings(region);

  const handlePlanAction = (planType: "pro" | "power" | null) => {
    if (!planType) {
      window.location.href = "/download";
      return;
    }

    const query = new URLSearchParams({ plan: planType });
    if (interval === "annual") query.set("interval", "year");

    if (!hasValidSessionToken()) {
      window.location.href = loginPathWithReturn(`/billing?${query.toString()}`);
      return;
    }

    window.location.href = `/billing?${query.toString()}`;
  };

  return (
    <MarketingPageShell>
      <Navbar />

      <main className="relative mx-auto flex max-w-6xl flex-col items-center px-6 pb-16 pt-24 md:pt-28">
        <div className="mb-8 space-y-3 text-center md:mb-10">
          <m.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-3xl font-semibold tracking-[-0.03em] text-[var(--foreground)] md:text-[2.75rem]"
          >
            Pro and Power. Try Pro free first.
          </m.h1>
          <m.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto max-w-xl text-[15px] leading-relaxed text-[var(--foreground-muted)] md:text-base"
          >
            Every new account starts with a 7-day Pro trial — full features, same
            quotas as Pro. After that, choose Pro or Power to keep going.
          </m.p>
          {!regionLoading ? (
            <m.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[12px] text-[var(--foreground-faint)]"
            >
              Showing {regionCurrencyLabel(region)} · INR + USD listed on each
              plan
            </m.p>
          ) : null}
        </div>

        <m.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8"
        >
          <BillingIntervalToggle
            interval={interval}
            maxSavings={maxSavings}
            onChange={setInterval}
          />
        </m.div>

        {region === "india" ? (
          <m.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8 max-w-xl text-center text-[13px] leading-relaxed text-[var(--foreground-muted)]"
          >
            {INDIA_GST_NOTE}
          </m.p>
        ) : null}

        <div className="grid w-full items-stretch gap-4 md:grid-cols-3 md:gap-5">
          {WEBSITE_PLANS.map((plan, idx) => (
            <m.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + idx * 0.08 }}
              className="h-full"
            >
              <PricingPlanCard
                plan={plan}
                region={region}
                interval={interval}
                onAction={() => handlePlanAction(plan.planType)}
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
          {FAIR_USE_FOOTNOTE}
          {region === "india" ? ` ${INDIA_GST_NOTE}` : null}{" "}
          <Link
            href="/download"
            className="font-medium text-[var(--foreground-muted)] underline-offset-2 hover:underline"
          >
            Download the app
          </Link>{" "}
          to start your trial.
        </m.p>

        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-10 flex flex-wrap justify-center gap-8 text-[var(--foreground-faint)]"
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" strokeWidth={1.5} />
            <span className="text-[10px] font-semibold uppercase tracking-[0.14em]">
              Secure SSL Encryption
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4" strokeWidth={1.5} />
            <span className="text-[10px] font-semibold uppercase tracking-[0.14em]">
              Privacy First AI
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4" strokeWidth={1.5} />
            <span className="text-[10px] font-semibold uppercase tracking-[0.14em]">
              Worldwide Support
            </span>
          </div>
        </m.div>
      </main>

      <Footer />
    </MarketingPageShell>
  );
}
