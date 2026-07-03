"use client";

import type { LucideIcon } from "lucide-react";
import { Check, Gauge, Loader2, Mic, X } from "lucide-react";
import { SoftCard } from "@/components/SoftCard";
import {
  planPrices,
  type BillingInterval,
  type PlanFeature,
  type PricingRegion,
  type WebsitePlan,
} from "@/lib/pricingPlans";

const PLAN_ICONS: Record<WebsitePlan["id"], LucideIcon> = {
  pro: Mic,
  power: Gauge,
};

function FeatureRow({ feature }: { feature: PlanFeature }) {
  const Icon = feature.included ? Check : X;

  return (
    <div className="flex items-start gap-2.5">
      <div
        className={`mt-0.5 rounded-full p-0.5 ${
          feature.included
            ? "bg-[var(--background-deep)] text-[var(--foreground-muted)]"
            : "text-[var(--foreground-faint)]"
        }`}
      >
        <Icon className="h-3.5 w-3.5" strokeWidth={2} />
      </div>
      <span
        className={`text-[13px] font-medium leading-snug ${
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
  const Icon = PLAN_ICONS[plan.id];
  const prices = planPrices(plan, region, interval);

  return (
    <SoftCard
      hover={false}
      className={`relative flex h-full flex-col ${
        compact ? "p-6" : "p-6 md:p-7"
      } ${plan.featured ? "ring-1 ring-[var(--foreground)]/12" : ""}`}
    >
        <div className="mb-5 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3
                className={`font-display font-semibold text-[var(--foreground)] ${
                  compact ? "text-lg" : "text-lg"
                }`}
              >
                {plan.name}
              </h3>
              {plan.featured && plan.featuredBadge ? (
                <span className="rounded-full bg-[var(--foreground)] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--background)]">
                  {plan.featuredBadge}
                </span>
              ) : null}
            </div>
            {plan.descriptionLines.length > 0 ? (
              <div className="mt-2 space-y-0.5">
                {plan.descriptionLines.map((line) => (
                  <p
                    key={line}
                    className="text-[13px] leading-snug text-[var(--foreground-muted)]"
                  >
                    {line}
                  </p>
                ))}
              </div>
            ) : null}
          </div>
          <div className="shrink-0 rounded-xl border border-[var(--border)] bg-[var(--background)] p-2 text-[var(--foreground-muted)]">
            <Icon className="h-4 w-4" strokeWidth={1.5} />
          </div>
        </div>

        {/* Fixed-height price block — aligned across monthly / annual */}
        <div className="mb-6 min-h-[5.25rem]">
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
            {prices.savingsLabel ? (
              <span className="rounded-full bg-[var(--brand-soft)] px-2 py-0.5 text-[11px] font-semibold text-[var(--brand-ink)]">
                {prices.savingsLabel}
              </span>
            ) : null}
          </div>
          <p className="mt-1.5 min-h-[1.125rem] text-[12px] text-[var(--foreground-muted)]">
            {prices.savingsNote ?? "\u00a0"}
          </p>
          {plan.trialNote ? (
            <p className="mt-2 text-[12px] font-semibold text-[var(--brand-ink)]">
              {plan.trialNote}
            </p>
          ) : null}
        </div>

        <div className="mb-6 flex-1 space-y-2.5">
          {plan.features.map((feature) => (
            <FeatureRow key={feature.text} feature={feature} />
          ))}
        </div>

        <button
          type="button"
          onClick={onAction}
          disabled={actionDisabled || actionLoading}
          className={`w-full rounded-full py-3 text-sm font-semibold transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 ${
            plan.cta === "download"
              ? "border border-[var(--border-strong)] bg-white text-[var(--foreground)] hover:border-[var(--brand)]/30"
              : "btn-dark"
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
    </SoftCard>
  );
}
