"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { GlowCta } from "@/components/GlowCta";
import {
  LandingBand,
  LandingBandInner,
} from "@/components/landing/LandingBand";
import { TRIAL_LABEL } from "@/lib/pricingPlans";

export function LandingPricingSection() {
  const proPrice = "$18/mo";
  const plans = [
    { name: "Free trial", price: "$0", per: "3 days", detail: "Full Pro from the moment you open the app. No card.", featured: false },
    { name: "Pro", price: "$18", per: "/mo", detail: "150 AI actions a month · unlimited dictation", featured: true },
    { name: "Power", price: "$120", per: "/mo", detail: "1,000 AI actions a month · unlimited dictation", featured: false },
  ] as const;

  return (
    <LandingBand id="pricing" variant="light" className="py-16 md:py-24">
      <LandingBandInner>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          data-guide-section="pricing"
          className="aura-stage px-5 py-8 sm:px-8 sm:py-10 md:px-12 md:py-14"
        >
          <div className="grid items-start gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:gap-16">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--foreground-faint)]">
              Simple pricing
            </p>
            <h2 className="mt-3 max-w-md font-display text-[1.85rem] font-semibold tracking-tight text-[var(--foreground)] md:text-[2.75rem]">
              {TRIAL_LABEL}. Then {proPrice}.
            </h2>
            <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-[var(--foreground-muted)]">
              Full AI buddy access for the whole trial. No credit card to
              download. Cancel anytime.
            </p>

            <div className="mt-8 flex w-full flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              <GlowCta
                href="/download"
                variant="light"
                className="final-cta-btn--on-light w-full sm:w-auto"
                wrapClassName="w-full sm:w-auto"
              >
                Download for Mac
              </GlowCta>
              <Link
                href="/pricing"
                className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full border border-[var(--border)] px-6 text-[14px] font-semibold text-[var(--foreground)] transition-colors hover:border-[var(--border-strong)] sm:w-auto"
              >
                See all plans
              </Link>
            </div>

          </div>

          <ul className="space-y-2.5 md:space-y-3">
            {plans.map((plan) => (
              <li
                key={plan.name}
                data-guide={plan.featured ? "pricing-pro" : plan.name === "Free trial" ? "pricing-trial" : undefined}
                className={`rounded-2xl border px-4 py-3.5 sm:px-5 sm:py-4 ${
                  plan.featured
                    ? "border-transparent bg-[#1c1917] text-white shadow-[0_14px_36px_-18px_rgba(28,25,23,0.55)]"
                    : "border-[var(--border)] bg-white/60"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2">
                    <span className={`font-display text-[16px] font-semibold tracking-tight ${plan.featured ? "text-white" : "text-[var(--foreground)]"}`}>
                      {plan.name}
                    </span>
                    {plan.featured ? (
                      <span className="rounded-full bg-[#ff6b5e] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                        Most popular
                      </span>
                    ) : null}
                  </span>
                  <span className="shrink-0 font-display tabular-nums">
                    <span className={`text-[20px] font-semibold tracking-tight ${plan.featured ? "text-white" : "text-[var(--foreground)]"}`}>{plan.price}</span>
                    <span className={`ml-0.5 text-[12px] ${plan.featured ? "text-white/55" : "text-[var(--foreground-faint)]"}`}>{plan.per}</span>
                  </span>
                </div>
                <p className={`mt-1 text-[13px] leading-snug ${plan.featured ? "text-white/70" : "text-[var(--foreground-muted)]"}`}>
                  {plan.detail}
                </p>
              </li>
            ))}
          </ul>
          </div>
        </motion.div>
      </LandingBandInner>
    </LandingBand>
  );
}
