"use client";

import { Check, Loader2, X } from "lucide-react";
import {
  planPrices,
  type BillingInterval,
  type PlanFeature,
  type PricingRegion,
  type WebsitePlan,
} from "@/lib/pricingPlans";

function FeatureRow({ feature }: { feature: PlanFeature }) {
  const Icon = feature.included ? Check : X;

  return (
    <div className="flex items-start gap-2.5">
      <Icon
        className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${
          feature.included
            ? "text-[var(--foreground-muted)]"
            : "text-[var(--foreground-faint)]"
        }`}
        strokeWidth={2}
      />
      <span
        className={`text-[13px] leading-snug ${
          feature.included
            ? "text-[var(--foreground-muted)]"
            : "text-[var(--foreground-faint)]"
        }`}
      >
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
};

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

  return (
    <article
      className={`relative flex h-full flex-col rounded-2xl border bg-white ${
        compact ? "p-6" : "p-6 md:p-7"
      } ${
        plan.featured
          ? "border-[var(--foreground)]/18"
          : "border-[var(--border)]"
      }`}
    >
      <div className="mb-5">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-display text-lg font-semibold text-[var(--foreground)]">
            {plan.name}
          </h3>
          {plan.featured && plan.featuredBadge ? (
            <span className="rounded-full bg-[var(--foreground)] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--background)]">
              {plan.featuredBadge}
            </span>
          ) : null}
        </div>
        {plan.descriptionLines.length > 0 ? (
          <div className="mt-1.5 space-y-0.5">
            {plan.descriptionLines.map((line, index) => (
              <p
                key={line}
                className={`lowercase leading-snug ${
                  index === 0
                    ? "text-[14px] text-[var(--foreground-muted)]"
                    : "text-[13px] text-[var(--foreground-faint)]"
                }`}
              >
                {line}
              </p>
            ))}
          </div>
        ) : null}
      </div>

      <div className="mb-6 min-h-[4.5rem]">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span
            className={`font-display font-semibold tracking-tight text-[var(--foreground)] ${
              compact ? "text-3xl" : "text-4xl"
            }`}
          >
            {prices.price}
          </span>
          {prices.period ? (
            <span className="text-sm font-medium text-[var(--foreground-faint)]">
              {prices.period}
            </span>
          ) : null}
        </div>
        {prices.savingsNote ? (
          <p className="mt-1.5 text-[12px] text-[var(--foreground-muted)]">
            {prices.savingsNote}
          </p>
        ) : null}
        {plan.trialNote ? (
          <p className="mt-1.5 text-[12px] text-[var(--foreground-faint)]">
            {plan.trialNote}
          </p>
        ) : null}
      </div>

      <div className="mb-6 flex-1 space-y-2.5">
        <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--foreground-faint)]">
          Includes
        </p>
        {plan.features.map((feature) => (
          <FeatureRow key={feature.text} feature={feature} />
        ))}
      </div>

      <button
        type="button"
        onClick={onAction}
        disabled={actionDisabled || actionLoading}
        className={`w-full rounded-full py-3 text-sm font-semibold transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 ${
          plan.featured || plan.cta === "checkout"
            ? "bg-[var(--foreground)] text-[var(--background)]"
            : "border border-[var(--border-strong)] bg-white text-[var(--foreground)]"
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
