"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Monitor } from "lucide-react";
import { AppleIcon } from "@/components/icons/AppleIcon";
import {
  LandingBand,
  LandingBandInner,
} from "@/components/landing/LandingBand";
import { usePricingRegion } from "@/hooks/usePricingRegion";
import { detectPlatform, type Platform } from "@/lib/platform";
import { TRIAL_LABEL } from "@/lib/pricingPlans";

export function LandingPricingSection() {
  const { region } = usePricingRegion();
  const proPrice = region === "india" ? "₹300/mo" : "$14/mo";
  const powerPrice = region === "india" ? "₹750/mo" : "$35/mo";
  const [platform, setPlatform] = useState<Platform | null>(null);

  useEffect(() => {
    setPlatform(detectPlatform());
  }, []);

  const isWindows = platform === "windows";

  const plans = [
    { name: "Free", detail: "5,000 words every month" },
    { name: "Pro", detail: `${proPrice} after a 7-day trial`, featured: true },
    { name: "Power", detail: powerPrice },
  ] as const;

  return (
    <LandingBand id="pricing" variant="light" className="py-16 md:py-24">
      <LandingBandInner>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="grid items-start gap-10 border-t border-[var(--border)] pt-12 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:gap-16 md:pt-16"
        >
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--foreground-faint)]">
              Simple pricing
            </p>
            <h2 className="mt-3 max-w-md font-display text-[1.85rem] font-semibold tracking-tight text-[var(--foreground)] md:text-[2.75rem]">
              {TRIAL_LABEL}. Then {proPrice}.
            </h2>
            <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-[var(--foreground-muted)]">
              No credit card to download. Cancel anytime.
            </p>

            <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
              <Link
                href={isWindows ? "/exclusive-access" : "/download"}
                className="btn-dark inline-flex min-h-[48px] w-full items-center justify-center gap-2 px-6 text-[14px] sm:w-auto"
              >
                {isWindows ? (
                  <>
                    <Monitor className="h-4 w-4" strokeWidth={2} />
                    Get notified for Windows
                  </>
                ) : (
                  <>
                    <AppleIcon className="h-4 w-4" />
                    Download Free for Mac
                  </>
                )}
              </Link>
              <Link
                href="/pricing"
                className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full border border-[var(--border)] px-6 text-[14px] font-semibold text-[var(--foreground)] transition-colors hover:border-[var(--border-strong)] sm:w-auto"
              >
                See all plans
              </Link>
            </div>

            {region === "india" ? (
              <p className="mt-4 text-[12px] text-[var(--foreground-faint)]">
                India pricing is tax-exclusive. GST added at checkout.
              </p>
            ) : null}
          </div>

          <ul className="border-t border-[var(--border)]">
            {plans.map((plan) => (
              <li
                key={plan.name}
                className="flex items-baseline justify-between gap-6 border-b border-[var(--border)] py-4 last:border-b-0"
              >
                <span
                  className={`font-display text-[17px] tracking-tight text-[var(--foreground)] ${
                    plan.featured ? "font-semibold" : "font-medium"
                  }`}
                >
                  {plan.name}
                </span>
                <span className="text-right text-[14px] text-[var(--foreground-muted)]">
                  {plan.detail}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>
      </LandingBandInner>
    </LandingBand>
  );
}
