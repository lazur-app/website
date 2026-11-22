"use client";

import { FounderSticker } from "@/components/landing/FounderSticker";
import Link from "next/link";
import { useRef } from "react";
import { Check } from "lucide-react";
import { Sticker } from "@/components/landing/Sticker";
import { TRIAL_LABEL, WEBSITE_PLANS, formatAmount, type WebsitePlan } from "@/lib/pricingPlans";
import { useTrackInView } from "@/hooks/useTrackInView";
import { track } from "@/lib/productAnalytics";

/**
 * Pricing on the homepage: the three plans side by side as little windows, so they can be compared
 * line by line. Everything shown comes from WEBSITE_PLANS (lib/pricingPlans); nothing is restated here.
 */

/** Where a plan's button goes from the homepage: trial and Pro start with the download, Power on the pricing page. */
function planHref(plan: WebsitePlan) {
  return plan.cta === "checkout" ? "/pricing" : "/download";
}

function PlanCard({ plan }: { plan: WebsitePlan }) {
  const pricing = plan.international;
  const free = !pricing || pricing.monthly === 0;
  const price = pricing ? formatAmount(pricing.monthly, pricing.currency) : "$0";
  const under = free ? "free for 3 days, no card needed" : `per month, or ${formatAmount(pricing!.annual, pricing!.currency)} a year`;
  const href = planHref(plan);
  const featured = Boolean(plan.featured);

  return (
    <li
      data-guide={featured ? "pricing-pro" : plan.id === "free" ? "pricing-trial" : undefined}
      className={`relative flex flex-col overflow-visible rounded-[14px] border-[1.5px] border-[#0c0b0a] bg-white ${featured ? "lg:-mt-4" : ""}`}
    >
      {featured && plan.featuredBadge ? (
        <span className="absolute -top-3.5 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full border-[1.5px] border-[#0c0b0a] bg-white px-3 py-0.5 text-[13px] font-medium lowercase text-[#0c0b0a]">
          {plan.featuredBadge}
        </span>
      ) : null}
      {featured ? <Sticker name="crown" size={78} rotate={14} className="absolute -right-6 top-10 hidden sm:block" /> : null}

      {/* the window's title bar (the trial card goes without one) */}
      {plan.id === "free" ? null : <div className={`flex h-9 items-center gap-1.5 rounded-t-[12px] border-b-[1.5px] border-[#0c0b0a] px-3.5 ${featured ? "bg-[#0c0b0a]" : "bg-black/[0.05]"}`} aria-hidden>
        {[0, 1, 2].map((dot) => (
          <span key={dot} className={`h-2.5 w-2.5 rounded-full ${featured ? "bg-white/70" : "bg-[#0c0b0a]/55"}`} />
        ))}
      </div>}

      <div className="flex flex-1 flex-col px-6 pb-7 pt-7 text-center md:px-7">
        <h3 className="font-display text-[30px] font-medium lowercase leading-none tracking-[-0.04em] text-[var(--foreground)]">{plan.name}</h3>
        <p className="mt-3 text-[17px] lowercase leading-snug text-[var(--foreground)]">{plan.descriptionLines[0]}</p>
        {plan.descriptionLines[1] ? <p className="mt-1 text-[14px] lowercase text-[var(--foreground-faint)]">{plan.descriptionLines[1]}</p> : null}

        <div className="my-6 border-t border-dashed border-black/15" />

        <p className="font-display text-[64px] font-medium leading-none tracking-[-0.05em] text-[var(--foreground)] tabular-nums">{price}</p>
        <p className="mt-3 text-[14px] lowercase text-[var(--foreground-muted)]">{under}</p>

        <Link
          href={href}
          onClick={() => track("cta_clicked", { location: "landing_pricing", label: plan.buttonText, destination: href, plan: plan.id })}
          className={`mx-auto mt-6 inline-flex min-h-[48px] items-center justify-center rounded-full border-[1.5px] border-[#0c0b0a] px-7 text-[16px] font-semibold lowercase transition-colors ${
            featured ? "bg-[#0c0b0a] text-white hover:bg-[#2a2826]" : "bg-white text-[#0c0b0a] hover:bg-black/[0.05]"
          }`}
        >
          {plan.buttonText}
        </Link>

        <div className="my-6 border-t border-dashed border-black/15" />

        <ul className="flex flex-col gap-2.5 text-left">
          {plan.features
            .filter((feature) => feature.included)
            .map((feature) => (
              <li key={feature.text} className="flex items-start gap-2.5 text-[15px] lowercase text-[var(--foreground)]">
                <span className="mt-0.5 grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full bg-[#0c0b0a]">
                  <Check className="h-3 w-3 text-white" strokeWidth={3} />
                </span>
                {feature.text}
              </li>
            ))}
        </ul>
      </div>
    </li>
  );
}

export function LandingPricingSection() {
  const ref = useRef<HTMLDivElement>(null);
  useTrackInView(ref, "section_viewed", { section: "pricing" });

  return (
    <section id="pricing" className="relative overflow-x-clip py-20 md:py-32">
      {/* Stickers scattered round the edges, well apart, on screens wide enough to have edges. */}
      <div className="pointer-events-none absolute inset-0 hidden xl:block" aria-hidden>
        <Sticker name="cloud" size={92} rotate={-10} className="absolute left-[7%] top-[60px]" />
        <Sticker name="flower" size={96} rotate={8} className="absolute right-[7%] top-[50px]" />
        <Sticker name="ghost" size={92} rotate={8} className="absolute left-[2.5%] top-[44%]" />
        <Sticker name="bubble" size={88} rotate={-9} className="absolute right-[2.5%] top-[54%]" />
        <FounderSticker who="vaidik" pose="thumbs" size={130} className="!absolute left-[3%] top-[72%]" />
      </div>
      <div className="landing-container relative">
        <div ref={ref} data-guide-section="pricing" className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="font-display text-[clamp(2.3rem,4.6vw,4rem)] font-medium lowercase leading-[1] tracking-[-0.04em] text-[var(--foreground)]">
              {TRIAL_LABEL}. then <span className="font-[family-name:var(--font-garamond)] text-[1.12em] font-normal italic tracking-[-0.02em]">$18</span> a month.
            </h2>
            <p className="mt-5 text-[17px] lowercase text-[var(--foreground-muted)]">three simple plans. no credit card to download. cancel anytime.</p>
          </div>

          <ul className="mx-auto mt-14 grid max-w-md gap-8 md:mt-20 lg:max-w-none lg:grid-cols-3 lg:gap-6">
            {WEBSITE_PLANS.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </ul>

          <p className="mt-10 text-center">
            <Link
              href="/pricing"
              onClick={() => track("cta_clicked", { location: "landing_pricing", label: "See all plans", destination: "/pricing" })}
              className="text-[15px] font-medium text-[var(--foreground)] underline decoration-black/25 underline-offset-4 transition-colors hover:decoration-black"
            >
              See all plans and yearly prices
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
