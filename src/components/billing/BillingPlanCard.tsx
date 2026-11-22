"use client";

import type { LucideIcon } from "lucide-react";
import { Check, Gauge, Loader2, Sparkles } from "lucide-react";
import { Sticker } from "@/components/landing/Sticker";
import type { PlanPriceDisplay } from "@/lib/pricingPlans";
import type { PlanType } from "@/lib/billing";

const PLAN_ICONS: Record<"pro" | "power", LucideIcon> = {
  pro: Sparkles,
  power: Gauge,
};

const PLAN_TONES: Record<"pro" | "power", string> = {
  pro: "#5b4bd6",
  power: "#e0621c",
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

/** A plan on the billing page, drawn like the homepage's pricing cards: an ink-outlined window. */
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
  const tone = PLAN_TONES[planType];
  const disabled = !eligible || isCurrent || checkoutLoading;

  return (
    <div className="relative flex h-full flex-col rounded-[20px] border-[1.5px] border-[#1c1917] bg-white shadow-[0_2px_0_rgba(28,25,23,0.9),0_10px_24px_-8px_rgba(28,25,23,0.18)]">
      {popular ? (
        <span className="absolute -top-4 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full border-[1.5px] border-[#1c1917] bg-white px-3 py-1 text-[12px] font-bold text-[#1c1917]">
          Most popular
        </span>
      ) : null}
      {popular ? <Sticker name="crown" size={64} rotate={14} className="absolute -right-6 top-8 hidden sm:block" /> : null}

      {/* the window's title bar */}
      <div
        className={`flex h-9 items-center gap-2 rounded-t-[18px] border-b-[1.5px] border-[#1c1917] px-4 ${popular ? "bg-[#1c1917]" : "bg-[#1c1917]/[0.05]"}`}
        aria-hidden
      >
        {[0, 1, 2].map((dot) => (
          <span key={dot} className={`h-2.5 w-2.5 rounded-full ${popular ? "bg-white/70" : "bg-[#1c1917]/55"}`} />
        ))}
      </div>

      <div className="flex flex-1 flex-col p-5 md:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-sans text-[1.5rem] font-bold leading-[1.1] tracking-[-0.04em] text-[var(--foreground)]">
              {name}
            </h3>
            <p className="mt-2 text-[14px] leading-relaxed text-[var(--foreground-muted)]">
              {description}
            </p>
          </div>
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-[12px]" style={{ backgroundColor: tone }}>
            <Icon className="h-4 w-4 text-white" strokeWidth={2} />
          </div>
        </div>

        <div className="my-6 border-t border-dashed border-[#1c1917]/15" />

        <div className="min-h-[4.5rem]">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="font-sans text-[2.75rem] font-bold leading-none tracking-[-0.05em] tabular-nums text-[var(--foreground)]">
              {priceDisplay?.price ?? "-"}
            </span>
            {priceDisplay?.period ? (
              <span className="text-[14px] font-medium text-[var(--foreground-muted)]">
                {priceDisplay.period}
              </span>
            ) : null}
            {priceDisplay?.savingsLabel ? (
              <span className="rounded-full bg-[#14917a] px-2 py-0.5 text-[12px] font-bold text-white">
                {priceDisplay.savingsLabel}
              </span>
            ) : null}
          </div>
          <p className="mt-2 min-h-[1.25rem] text-[13px] text-[var(--foreground-muted)]">
            {priceDisplay?.savingsNote ?? " "}
          </p>
        </div>

        <ul className="mb-6 mt-4 flex-1 space-y-3">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-3">
              <span className="mt-0.5 grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full bg-[#1c1917]">
                <Check className="h-3 w-3 text-white" strokeWidth={3} />
              </span>
              <span className="text-[14px] font-medium leading-snug text-[var(--foreground)]">
                {feature}
              </span>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={onCheckout}
          disabled={disabled}
          className={`inline-flex min-h-[48px] w-full items-center justify-center rounded-full border-[1.5px] border-[#1c1917] px-6 text-[15px] font-bold transition-[transform,box-shadow,background-color] duration-200 disabled:cursor-not-allowed ${
            isCurrent || !eligible
              ? "bg-[#1c1917]/[0.05] text-[var(--foreground-muted)] opacity-70"
              : popular
                ? "bg-[#1c1917] text-white hover:bg-black"
                : "bg-white text-[#1c1917] shadow-[0_2px_0_rgba(28,25,23,0.9)] hover:-translate-y-0.5"
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
      </div>
    </div>
  );
}
