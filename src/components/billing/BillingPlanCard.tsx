"use client";

import type { LucideIcon } from "lucide-react";
import { Check, Gauge, Loader2, Sparkles } from "lucide-react";
import { SoftCard } from "@/components/SoftCard";
import type { PlanPriceDisplay } from "@/lib/pricingPlans";
import type { PlanType } from "@/lib/billing";

const PLAN_ICONS: Record<"pro" | "power", LucideIcon> = {
  pro: Sparkles,
  power: Gauge,
};

type BillingPlanCardProps = {
  name: string;
  planType: PlanType;
  description: string;
  features: string[];
  popular?: boolean;
  priceDisplay: PlanPriceDisplay | null;
  eligible: boolean;
  isCurrent: boolean;
  checkoutLoading: boolean;
  onCheckout: () => void;
};

export function BillingPlanCard({
  name,
  planType,
  description,
  features,
  popular = false,
  priceDisplay,
  eligible,
  isCurrent,
  checkoutLoading,
  onCheckout,
}: BillingPlanCardProps) {
  const Icon = PLAN_ICONS[planType];

  return (
    <SoftCard
      hover={false}
      className={`relative flex h-full flex-col p-6 md:p-7 ${
        popular ? "!border-transparent !bg-[#1c1917] text-white shadow-[0_24px_60px_rgba(28,25,23,0.28)]" : ""
      }`}
    >
      <div className="mb-5 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className={`font-display text-lg font-semibold ${popular ? "text-white" : "text-[var(--foreground)]"}`}>
              {name}
            </h3>
            {popular ? (
              <span className="rounded-full bg-[#ef5350] px-2.5 py-0.5 text-[11px] font-semibold text-white">
                Most popular
              </span>
            ) : null}
          </div>
          <p className={`mt-2 text-[13px] leading-relaxed ${popular ? "text-white/65" : "text-[var(--foreground-muted)]"}`}>
            {description}
          </p>
        </div>
        <div className={`shrink-0 rounded-xl p-2 ${popular ? "bg-white/10 text-white" : "border border-[var(--border)] bg-[var(--background)] text-[var(--foreground-muted)]"}`}>
          <Icon className="h-4 w-4" strokeWidth={1.5} />
        </div>
      </div>

      <div className="mb-6 min-h-[4.5rem]">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className={`font-display text-3xl font-semibold tracking-tight ${popular ? "text-white" : "text-[var(--foreground)]"}`}>
            {priceDisplay?.price ?? "-"}
          </span>
          {priceDisplay?.period ? (
            <span className={`text-sm font-medium ${popular ? "text-white/50" : "text-[var(--foreground-faint)]"}`}>
              {priceDisplay.period}
            </span>
          ) : null}
          {priceDisplay?.savingsLabel ? (
            <span className="rounded-full bg-[var(--brand-soft)] px-2 py-0.5 text-[11px] font-semibold text-[var(--brand-ink)]">
              {priceDisplay.savingsLabel}
            </span>
          ) : null}
        </div>
        <p className={`mt-1.5 min-h-[1.125rem] text-[12px] ${popular ? "text-white/55" : "text-[var(--foreground-muted)]"}`}>
          {priceDisplay?.savingsNote ?? "\u00a0"}
        </p>
      </div>

      <ul className="mb-6 flex-1 space-y-2.5">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5">
            <div className={`mt-0.5 rounded-full p-0.5 ${popular ? "bg-white/10 text-[#ff8a80]" : "bg-[var(--background-deep)] text-[var(--foreground-muted)]"}`}>
              <Check className="h-3.5 w-3.5" strokeWidth={2} />
            </div>
            <span className={`text-[13px] font-medium leading-snug ${popular ? "text-white/85" : "text-[var(--foreground-muted)]"}`}>
              {feature}
            </span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={onCheckout}
        disabled={!eligible || isCurrent || checkoutLoading}
        className={`w-full rounded-full py-3 text-sm font-semibold transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 ${
          isCurrent || !eligible
            ? popular ? "bg-white/10 text-white/50" : "bg-[var(--background-deep)] text-[var(--foreground-faint)]"
            : popular ? "bg-white text-[#1c1917] hover:opacity-90" : "btn-dark"
        }`}
      >
        {checkoutLoading ? (
          <span className="inline-flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Redirecting…
          </span>
        ) : isCurrent ? (
          "Current plan"
        ) : eligible ? (
          `Upgrade to ${name}`
        ) : (
          "Not available"
        )}
      </button>
    </SoftCard>
  );
}
