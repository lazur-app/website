"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { HeroDownloadCta } from "@/components/HeroDownloadCta";
import {
  LandingBand,
  LandingBandInner,
} from "@/components/landing/LandingBand";
import { usePricingRegion } from "@/hooks/usePricingRegion";
import { TRIAL_LABEL } from "@/lib/pricingPlans";

export function LandingPricingSection() {
  const { region } = usePricingRegion();
  const proPrice = region === "india" ? "₹300/mo" : "$14/mo";

  return (
    <LandingBand id="pricing" variant="light" className="py-10 md:py-16">
      <LandingBandInner>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mx-auto max-w-2xl rounded-[1.75rem] bg-white px-6 py-14 text-center shadow-[0_12px_40px_rgba(28,25,23,0.05)] md:rounded-[2rem] md:px-12 md:py-16"
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--foreground-faint)]">
            · Simple pricing ·
          </p>
          <h2 className="mt-3 font-display text-[1.75rem] font-semibold tracking-tight text-[var(--foreground)] md:text-[2.75rem]">
            {TRIAL_LABEL}. Then {proPrice}.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-[var(--foreground-muted)]">
            No credit card to download. Cancel anytime.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <HeroDownloadCta variant="minimal" />
            <Link
              href="/pricing"
              className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[var(--border)] bg-white px-6 text-[14px] font-semibold text-[var(--foreground)] transition-colors hover:border-[var(--border-strong)]"
            >
              See all plans
            </Link>
          </div>

          {region === "india" ? (
            <p className="mt-4 text-[12px] text-[var(--foreground-faint)]">
              India pricing is tax-exclusive. GST added at checkout.
            </p>
          ) : null}
        </motion.div>
      </LandingBandInner>
    </LandingBand>
  );
}
