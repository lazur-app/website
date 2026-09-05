"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Monitor } from "lucide-react";
import { GlowCta } from "@/components/GlowCta";
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
    { name: "Free", detail: "Dictation only · 5,000 words/month", featured: false },
    {
      name: "Pro",
      detail: `Unlimited dictation · 300 Intent · ${proPrice}`,
      featured: true,
    },
    { name: "Power", detail: `Unlimited everything · ${powerPrice}`, featured: false },
  ] as const;

  return (
    <LandingBand id="pricing" variant="light" className="py-16 md:py-24">
      <LandingBandInner>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
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
              Full Intent access for the whole trial. No credit card to
              download. Cancel anytime.
            </p>

            <div className="mt-8 flex w-full flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              <GlowCta
                href={isWindows ? "/exclusive-access" : "/download"}
                variant="light"
                className="final-cta-btn--on-light"
              >
                {isWindows ? (
                  <>
                    <Monitor className="h-4 w-4" strokeWidth={2} />
                    Get notified for Windows
                  </>
                ) : (
                  <>
                    <AppleIcon className="h-4 w-4" />
                    Download for Mac. Free
                  </>
                )}
              </GlowCta>
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
          </div>
        </motion.div>
      </LandingBandInner>
    </LandingBand>
  );
}
