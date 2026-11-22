"use client";

import { Check, Loader2, X } from "lucide-react";
import {
  planPrices,
  type BillingInterval,
  type PlanFeature,
  type PricingRegion,
  type WebsitePlan,
} from "@/lib/pricingPlans";

const SHADOW = "shadow-[0_2px_0_rgba(28,25,23,0.9),0_10px_24px_-8px_rgba(28,25,23,0.18)]";

function FeatureRow({ feature }: { feature: PlanFeature }) {
  return (
    <div className="flex items-start gap-3">
      {feature.included ? (
        <span className="mt-0.5 grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full bg-[#1c1917]">
          <Check className="h-3 w-3 text-white" strokeWidth={3} />
        </span>
      ) : (
        <span className="mt-0.5 grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full border-[1.5px] border-[#1c1917]/25">
          <X className="h-3 w-3 text-[var(--foreground-faint)]" strokeWidth={3} />
        </span>
      )}
      <span className={`text-[15px] leading-snug ${feature.included ? "text-[var(--foreground)]" : "text-[var(--foreground-faint)]"}`}>
        {feature.text}
      </span>
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
  /** Overrides plan.buttonText (e.g. the marketing page's "Download for Mac"). */
  buttonText?: string;
  /** A quiet risk-reducer line under the button. */
  note?: string;
};

/**
 * One plan, as a little ink-outlined window like the homepage's pricing cards. The featured plan
 * gets a dark title bar and a solid dark button; the others a light bar and a white pill.
 */
export function PricingPlanCard({
  plan,
  region,
  interval,
  onAction,
  compact = false,
  actionLoading = false,
  actionDisabled = false,
  buttonText,
  note,
}: PricingPlanCardProps) {
  const prices = planPrices(plan, region, interval);
  const featured = Boolean(plan.featured);

  return (
    <article
      className={`relative flex h-full flex-col rounded-[20px] border-[1.5px] border-[#1c1917] bg-white text-[var(--foreground)] ${SHADOW}`}
    >
      {featured && plan.featuredBadge ? (
        <span className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full border-[1.5px] border-[#1c1917] bg-[#d6246e] px-3 py-1 text-[12px] font-bold text-white">
          {plan.featuredBadge}
        </span>
      ) : null}

      {/* the window's title bar */}
      <div
        className={`flex h-9 items-center gap-1.5 rounded-t-[18px] border-b-[1.5px] border-[#1c1917] px-4 ${featured ? "bg-[#1c1917]" : "bg-black/[0.05]"}`}
        aria-hidden
      >
        {[0, 1, 2].map((dot) => (
          <span key={dot} className={`h-2.5 w-2.5 rounded-full ${featured ? "bg-white/70" : "bg-[#1c1917]/55"}`} />
        ))}
      </div>

      <div className={`flex flex-1 flex-col ${compact ? "p-4 md:p-6" : "p-6"}`}>
        <h3 className="text-[22px] font-bold leading-none tracking-[-0.03em]">{plan.name}</h3>

        <div className="mt-6 flex items-baseline gap-2">
          <span className={`font-sans font-bold leading-none tracking-[-0.05em] tabular-nums ${compact ? "text-[40px]" : "text-[52px]"}`}>
            {prices.price}
          </span>
          {prices.period ? <span className="text-[15px] text-[var(--foreground-muted)]">{prices.period}</span> : null}
        </div>
        <p className="mt-2 min-h-[1.25rem] text-[13px] text-[var(--foreground-muted)]">
          {interval === "annual" ? prices.savingsLabel ?? "" : ""}
        </p>

        <div className="my-6 border-t border-dashed border-black/15" />

        <div className="flex-1 space-y-3">
          {plan.features.map((feature) => (
            <FeatureRow key={feature.text} feature={feature} />
          ))}
        </div>

        <button
          type="button"
          onClick={onAction}
          disabled={actionDisabled || actionLoading}
          className={`mt-8 inline-flex min-h-[52px] w-full items-center justify-center rounded-full border-[1.5px] border-[#1c1917] px-6 text-[16px] font-bold tracking-[-0.01em] transition-[transform,box-shadow,background-color] duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${
            featured
              ? "bg-[#1c1917] text-white hover:bg-black"
              : "bg-white text-[#1c1917] shadow-[0_2px_0_rgba(28,25,23,0.9)] hover:-translate-y-0.5 hover:shadow-[0_4px_0_rgba(28,25,23,0.9)] active:translate-y-0.5 active:shadow-none"
          }`}
        >
          {actionLoading ? (
            <span className="inline-flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Redirecting…
            </span>
          ) : (
            buttonText ?? plan.buttonText
          )}
        </button>
        {note ? (
          <p className="mt-3 min-h-[2.5em] text-center text-[12px] leading-snug text-[var(--foreground-muted)]">
            {/* Wrap between items, never inside one. */}
            {note.split(" · ").map((item, i) => (
              <span key={item}>
                {i > 0 ? " · " : null}
                <span className="whitespace-nowrap">{item}</span>
              </span>
            ))}
          </p>
        ) : null}
      </div>
    </article>
  );
}
