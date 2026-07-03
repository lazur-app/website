"use client";

import { GraffitiArrowCallout } from "@/components/pricing/GraffitiScribble";
import type { BillingInterval } from "@/lib/pricingPlans";

type BillingIntervalToggleProps = {
  interval: BillingInterval;
  maxSavings: number;
  onChange: (interval: BillingInterval) => void;
};

export function BillingIntervalToggle({
  interval,
  maxSavings,
  onChange,
}: BillingIntervalToggleProps) {
  const graffitiLabel = maxSavings > 0 ? `${maxSavings}% OFF` : null;

  return (
    <div
      className="flex items-center justify-center"
      role="group"
      aria-label="Billing interval"
    >
      {graffitiLabel ? (
        <GraffitiArrowCallout
          label={graffitiLabel}
          className="invisible shrink-0 -translate-y-2.5 pointer-events-none"
          aria-hidden
        />
      ) : null}

      <div className="inline-flex shrink-0 gap-1 rounded-full border border-[var(--border)] bg-white/70 p-1">
        <button
          type="button"
          onClick={() => onChange("monthly")}
          className={`rounded-full px-4 py-2 text-[13px] font-medium transition-colors ${
            interval === "monthly"
              ? "bg-[var(--foreground)] text-[var(--background)]"
              : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
          }`}
        >
          Monthly
        </button>
        <button
          type="button"
          onClick={() => onChange("annual")}
          className={`rounded-full px-4 py-2 text-[13px] font-medium transition-colors ${
            interval === "annual"
              ? "bg-[var(--foreground)] text-[var(--background)]"
              : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
          }`}
        >
          Annual
        </button>
      </div>

      {graffitiLabel ? (
        <GraffitiArrowCallout
          label={graffitiLabel}
          className="ml-1 shrink-0 -translate-y-2.5"
        />
      ) : null}
    </div>
  );
}
