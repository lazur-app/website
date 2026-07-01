"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { BillingIntervalToggle } from "@/components/pricing/BillingIntervalToggle";
import { PricingPlanCard } from "@/components/pricing/PricingPlanCard";
import { usePricingRegion } from "@/hooks/usePricingRegion";
import {
  INDIA_GST_NOTE,
  maxAnnualSavings,
  PRICING_SNAPSHOT,
  regionCurrencyLabel,
  type BillingInterval,
} from "@/lib/pricingPlans";

export function PricingSnapshotSection() {
  const { region, loading: regionLoading } = usePricingRegion();
  const [interval, setInterval] = useState<BillingInterval>("monthly");
  const maxSavings = maxAnnualSavings(region);

  return (
    <section id="pricing-snapshot" className="px-6 py-14 md:py-20">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center md:mb-10"
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--foreground-faint)]">
            Pricing
          </p>
          <h2 className="mt-2 font-display text-[1.75rem] font-semibold tracking-tight text-[var(--foreground)] md:text-[2.5rem]">
            Try Pro free. Stay on Pro or Power.
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-[15px] text-[var(--foreground-muted)]">
            7-day Pro trial · then Pro or Power
          </p>
          {!regionLoading ? (
            <p className="mt-2 text-[12px] text-[var(--foreground-faint)]">
              {regionCurrencyLabel(region)} + alternate currency on each card
            </p>
          ) : null}
          <div className="mt-6 flex justify-center">
            <BillingIntervalToggle
              interval={interval}
              maxSavings={maxSavings}
              onChange={setInterval}
            />
          </div>
          {region === "india" ? (
            <p className="mx-auto mt-4 max-w-md text-[12px] leading-relaxed text-[var(--foreground-faint)]">
              {INDIA_GST_NOTE}
            </p>
          ) : null}
        </motion.div>

        <div className="grid items-stretch gap-4 md:grid-cols-3">
          {PRICING_SNAPSHOT.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              className="h-full"
            >
              <PricingPlanCard
                plan={plan}
                region={region}
                interval={interval}
                compact
                onAction={() => {
                  window.location.href = plan.isTrial ? "/download" : "/pricing";
                }}
              />
            </motion.div>
          ))}
        </div>

        <p className="mt-8 text-center text-[13px] text-[var(--foreground-faint)]">
          <Link
            href="/pricing"
            className="font-medium text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
          >
            Full pricing details →
          </Link>
        </p>
      </div>
    </section>
  );
}
