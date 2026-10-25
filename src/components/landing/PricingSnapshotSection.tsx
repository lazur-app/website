"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { BillingIntervalToggle } from "@/components/pricing/BillingIntervalToggle";
import { PricingPlanCard } from "@/components/pricing/PricingPlanCard";
import {
  maxAnnualSavings,
  PRICING_SNAPSHOT,
  type BillingInterval,
} from "@/lib/pricingPlans";

export function PricingSnapshotSection() {
  const [interval, setInterval] = useState<BillingInterval>("monthly");
  const maxSavings = maxAnnualSavings("international");

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
            Choose Pro or Power.
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-[15px] text-[var(--foreground-muted)]">
            Start with a 7-day Pro trial · then choose Pro or Power
          </p>
          <div className="mt-6 flex justify-center">
            <BillingIntervalToggle
              interval={interval}
              maxSavings={maxSavings}
              onChange={setInterval}
            />
          </div>
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
                region="international"
                interval={interval}
                compact
                onAction={() => {
                  window.location.href =
                    plan.cta === "download" ? "/download" : "/pricing";
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
