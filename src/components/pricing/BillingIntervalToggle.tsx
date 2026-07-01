"use client";

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
  return (
    <div
      className="inline-flex gap-1 rounded-full border border-[var(--border)] bg-white/70 p-1"
      role="group"
      aria-label="Billing interval"
    >
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
        {maxSavings > 0 ? (
          <span
            className={`ml-1.5 text-[11px] font-semibold ${
              interval === "annual"
                ? "text-white/75"
                : "text-[var(--brand-ink)]"
            }`}
          >
            · Save up to {maxSavings}%
          </span>
        ) : null}
      </button>
    </div>
  );
}
