"use client";

import { Check, Loader2, X } from "lucide-react";
import {
  planPrices,
  type BillingInterval,
  type PlanFeature,
  type PricingRegion,
  type WebsitePlan,
} from "@/lib/pricingPlans";

function FeatureRow({ feature, dark }: { feature: PlanFeature; dark: boolean }) {
  const Icon = feature.included ? Check : X;
  return (
    <div className="flex items-start gap-2.5">
      <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${dark ? "text-[#ff8a80]" : "text-[var(--foreground-muted)]"}`} strokeWidth={2.2} />
      <span className={`text-[14px] leading-snug ${dark ? "text-white/85" : "text-[var(--foreground-muted)]"}`}>{feature.text}</span>
    </div>
  );
}

type PricingPlanCardProps = {
  plan: WebsitePlan;
  region: PricingRegion;
  interval: BillingInterval;
  onAction: () => void;
  compact?: boolean;
  actionLoading?: boolean;
  actionDisabled?: boolean;
};

/** One plan. The featured plan is the dark card with the only dark-on-light flip of the page. */
export function PricingPlanCard({
  plan,
  region,
  interval,
  onAction,
  compact = false,
  actionLoading = false,
  actionDisabled = false,
}: PricingPlanCardProps) {
  const prices = planPrices(plan, region, interval);
  const dark = Boolean(plan.featured);

  return (
    <article
      className={`relative flex h-full flex-col rounded-[1.5rem] ${compact ? "p-6" : "p-7"} ${
        dark
          ? "bg-[#1c1917] text-white shadow-[0_24px_60px_rgba(28,25,23,0.28)] md:-my-3 md:py-10"
          : "border border-[var(--border-strong)] bg-white/80 text-[var(--foreground)] shadow-[var(--shadow-card)]"
      }`}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-[17px] font-semibold">{plan.name}</h3>
        {dark && plan.featuredBadge ? (
          <span className="rounded-full px-2.5 py-1 text-[11px] font-semibold text-white" style={{ background: "#ef5350" }}>
            {plan.featuredBadge}
          </span>
        ) : null}
      </div>

      <div className="mt-6 flex items-baseline gap-1.5">
        <span className={`font-display font-semibold tracking-[-0.03em] ${compact ? "text-4xl" : "text-5xl"}`}>{prices.price}</span>
        {prices.period ? <span className={`text-[14px] ${dark ? "text-white/55" : "text-[var(--foreground-faint)]"}`}>{prices.period}</span> : null}
      </div>
      <p className={`mt-2 min-h-[1.25rem] text-[13px] ${dark ? "text-white/55" : "text-[var(--foreground-faint)]"}`}>
        {interval === "annual" ? prices.savingsLabel ?? "" : ""}
      </p>

      <div className="mt-7 flex-1 space-y-3">
        {plan.features.map((feature) => (
          <FeatureRow key={feature.text} feature={feature} dark={dark} />
        ))}
      </div>

      <button
        type="button"
        onClick={onAction}
        disabled={actionDisabled || actionLoading}
        className={`mt-8 w-full rounded-full py-3.5 text-[15px] font-semibold transition-[opacity,transform] hover:opacity-90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 ${
          dark ? "bg-white text-[#1c1917]" : "border border-[var(--border-strong)] bg-white text-[var(--foreground)]"
        }`}
      >
        {actionLoading ? (
          <span className="inline-flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Redirecting…
          </span>
        ) : (
          plan.buttonText
        )}
      </button>
    </article>
  );
}
