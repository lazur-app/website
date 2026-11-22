"use client";

import type { BillingInterval } from "@/lib/pricingPlans";

type BillingIntervalToggleProps = {
  interval: BillingInterval;
  maxSavings: number;
  onChange: (interval: BillingInterval) => void;
};

/** Monthly / Annual, as an ink-outlined pill; a small teal chip says what a year saves. */
export function BillingIntervalToggle({
  interval,
  maxSavings,
  onChange,
}: BillingIntervalToggleProps) {
  const savingsLabel = maxSavings > 0 ? `Save ${maxSavings}%` : null;

  const option = (value: BillingInterval, label: string) => {
    const on = interval === value;
    return (
      <button
        type="button"
        onClick={() => onChange(value)}
        aria-pressed={on}
        className={`inline-flex min-h-[44px] items-center gap-2 rounded-full px-6 text-[15px] font-bold tracking-[-0.01em] transition-colors ${
          on ? "bg-[#1c1917] text-white" : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
        }`}
      >
        {label}
        {value === "annual" && savingsLabel ? (
          <span className="rounded-full bg-[#14917a] px-2 py-0.5 text-[12px] font-bold leading-[1.4] text-white">
            {savingsLabel}
          </span>
        ) : null}
      </button>
    );
  };

  return (
    <div className="flex items-center justify-center" role="group" aria-label="Billing interval">
      <div className="inline-flex shrink-0 gap-1 rounded-full border-[1.5px] border-[#1c1917] bg-white p-1 shadow-[0_2px_0_rgba(28,25,23,0.9)]">
        {option("monthly", "Monthly")}
        {option("annual", "Annual")}
      </div>
    </div>
  );
}
