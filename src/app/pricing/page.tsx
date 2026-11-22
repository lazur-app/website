"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion as m } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MarketingPageShell } from "@/components/MarketingPageShell";
import { BillingIntervalToggle } from "@/components/pricing/BillingIntervalToggle";
import { PricingPlanCard } from "@/components/pricing/PricingPlanCard";
import { PricingStudentOffer } from "@/components/pricing/PricingStudentOffer";
import { PricingTimeCalculator } from "@/components/pricing/PricingTimeCalculator";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { DOWNLOAD_REASSURANCE } from "@/components/landing/DownloadReassurance";
import { TESTIMONIALS, TestimonialAvatar } from "@/components/landing/TestimonialsSection";
import { useTrackInView } from "@/hooks/useTrackInView";
import { hasValidSessionToken } from "@/lib/auth";
import {
  consumeCheckoutIntent,
  redirectToCheckout,
  storeCheckoutIntent,
  type PlanType,
} from "@/lib/billing";
import { loginPathWithReturn } from "@/lib/returnTo";
import { track } from "@/lib/productAnalytics";
import {
  FAIR_USE_FOOTNOTE,
  maxAnnualSavings,
  WEBSITE_PLANS,
  type BillingInterval,
} from "@/lib/pricingPlans";

function toBillingInterval(interval: BillingInterval): "month" | "year" {
  return interval === "annual" ? "year" : "month";
}

type Plan = (typeof WEBSITE_PLANS)[number];

/** The marketing page's button copy: verb + free + what you get, where the plan is free to start. */
function planButtonText(plan: Plan): string {
  return plan.id === "free" ? "Download for Mac" : plan.buttonText;
}

/** Risk reducers under each plan's button. Download plans: the trial facts; checkout: cancel anytime. */
function planNote(plan: Plan): string {
  return plan.cta === "download" ? DOWNLOAD_REASSURANCE.join(" · ") : "Secure checkout · Cancel anytime";
}

/** A real early-user quote (verbatim fragment of Veer's testimonial on the homepage). */
const PROOF = TESTIMONIALS.find((t) => t.name === "Veer Adyani");
const PROOF_QUOTE = "it understands what i'm looking at and helps me move faster.";

/** Only answers already stated in the terms, FAQ and billing copy. */
const PRICING_FAQ = [
  {
    q: "What happens after the 3 days?",
    a: "The trial ends and Lazur tells you so and shows how to subscribe. To keep using it, pick Pro ($18/month) or Power ($120/month); billed annually, that's $15 or $96 a month. There's no card on file during the trial, so nothing is charged unless you choose a plan.",
  },
  {
    q: "Do I need a credit card to try it?",
    a: "No. Download Lazur and the 3-day Pro trial starts when you first open it on your Mac.",
  },
  {
    q: "Which Macs does it run on?",
    a: "macOS on Apple Silicon and Intel. Windows is on the way.",
  },
] as const;

export default function PricingPage() {
  const [interval, setInterval] = useState<BillingInterval>("monthly");
  const [checkoutPlan, setCheckoutPlan] = useState<PlanType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const intentHandled = useRef(false);
  const studentOfferRef = useRef<HTMLDivElement>(null);
  const maxSavings = maxAnnualSavings("international");
  useTrackInView(studentOfferRef, "section_viewed", { section: "student_offer", location: "pricing_page" });
  const faqRef = useRef<HTMLElement>(null);
  useTrackInView(faqRef, "section_viewed", { section: "pricing_faq", location: "pricing_page" });

  const startCheckout = useCallback(
    async (planType: PlanType, billingInterval: "month" | "year") => {
      setError(null);
      setCheckoutPlan(planType);
      const result = await redirectToCheckout(planType, billingInterval, "international");
      if (!result.ok) {
        setError(result.error);
        setCheckoutPlan(null);
      }
    },
    [],
  );

  useEffect(() => {
    if (intentHandled.current) return;
    if (!hasValidSessionToken()) return;

    const intent = consumeCheckoutIntent();
    if (!intent) return;

    intentHandled.current = true;
    track("checkout_intent_resumed", { plan: intent.plan, interval: intent.interval, location: "pricing_page" });
    void startCheckout(intent.plan, intent.interval);
  }, [startCheckout]);

  const handlePlanAction = async (plan: Plan) => {
    const signedIn = hasValidSessionToken();
    track("plan_selected", {
      plan: plan.id,
      interval: toBillingInterval(interval),
      location: "pricing_page",
      label: planButtonText(plan),
      next_step: plan.cta === "download" ? "download" : signedIn ? "checkout" : "login",
      signed_in: signedIn,
    });
    if (plan.cta === "download") {
      window.location.href = "/download";
      return;
    }

    const planType = plan.planType;
    if (!planType) return;

    const billingInterval = toBillingInterval(interval);

    if (!signedIn) {
      storeCheckoutIntent({ plan: planType, interval: billingInterval });
      window.location.href = loginPathWithReturn("/pricing");
      return;
    }

    await startCheckout(planType, billingInterval);
  };

  const checkoutBusy = checkoutPlan !== null;

  return (
    <MarketingPageShell>
      <Navbar />

      <main className="relative mx-auto flex max-w-6xl flex-col items-center px-6 pb-16 pt-24 md:pt-28">
        <div className="mb-8 text-center md:mb-10">
          <m.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl font-semibold tracking-[-0.035em] text-[var(--foreground)] md:text-[3.5rem]"
          >
            Simple pricing.
          </m.h1>
          <p className="mx-auto mt-3 max-w-md text-[17px] leading-relaxed text-[var(--foreground-muted)]">
            Every plan starts with a free 3-day trial: 30 AI actions and 10,000 words.
          </p>
        </div>

        <m.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 flex w-full justify-center overflow-visible"
        >
          <BillingIntervalToggle
            interval={interval}
            maxSavings={maxSavings}
            onChange={(next) => {
              if (next !== interval) {
                track("pricing_interval_toggled", { interval: toBillingInterval(next), location: "pricing_page" });
              }
              setInterval(next);
            }}
          />
        </m.div>

        {error ? (
          <p className="mb-6 w-full max-w-2xl rounded-[var(--radius-card)] border border-red-200 bg-red-50 px-4 py-3 text-center text-[13px] text-red-800">
            {error}
          </p>
        ) : null}

        <div className="grid w-full max-w-5xl items-center gap-4 md:grid-cols-3 md:gap-5">
          {WEBSITE_PLANS.map((plan, idx) => (
            <m.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + idx * 0.08 }}
              className="h-full overflow-visible"
            >
              <PricingPlanCard
                plan={plan}
                region="international"
                interval={interval}
                onAction={() => void handlePlanAction(plan)}
                actionLoading={
                  plan.cta === "checkout" && checkoutPlan === plan.planType
                }
                actionDisabled={checkoutBusy && plan.cta === "checkout"}
                buttonText={planButtonText(plan)}
                note={planNote(plan)}
              />
            </m.div>
          ))}
        </div>

        <m.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="mt-6 max-w-2xl text-center text-[12px] leading-relaxed text-[var(--foreground-faint)]"
        >
          An AI action is one thing you ask Lazur to do: a question, a reminder, a pointed-at button
          or a background job. Dictation doesn&apos;t count. {FAIR_USE_FOOTNOTE}{" "}
          <TrackedLink
            href="/download"
            eventProps={{ location: "pricing_footnote", label: "Download Lazur", destination: "/download" }}
            className="font-medium text-[var(--foreground-muted)] underline-offset-2 hover:underline"
          >
            Download Lazur
          </TrackedLink>{" "}
          to start your 3-day Pro trial.
        </m.p>

        {PROOF ? (
          <m.figure
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 flex max-w-xl items-center gap-4 text-left"
          >
            <TestimonialAvatar testimonial={PROOF} size={44} />
            <div>
              <blockquote className="font-display text-[17px] leading-snug tracking-tight text-[var(--foreground)]">
                &ldquo;{PROOF_QUOTE}&rdquo;
              </blockquote>
              <figcaption className="mt-1 text-[12.5px] text-[var(--foreground-faint)]">
                {PROOF.name}, {PROOF.role}
                {PROOF.company ? ` of ${PROOF.company.label}` : ""}
              </figcaption>
            </div>
          </m.figure>
        ) : null}

        <section ref={faqRef} className="mt-14 w-full max-w-2xl" aria-labelledby="pricing-faq">
          <h2 id="pricing-faq" className="font-display text-[1.5rem] font-semibold tracking-tight text-[var(--foreground)]">
            Questions before you start
          </h2>
          <div className="mt-4 border-t border-[var(--border)]">
            {PRICING_FAQ.map((item, i) => (
              <details
                key={item.q}
                className="group border-b border-[var(--border)]"
                onToggle={(e) =>
                  track(e.currentTarget.open ? "faq_opened" : "faq_closed", { question: item.q, index: i, location: "pricing_page" })
                }
              >
                <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-4 py-4 font-display text-[16px] font-semibold tracking-tight text-[var(--foreground)] [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <ChevronDown className="h-4 w-4 shrink-0 text-[var(--foreground-faint)] transition-transform duration-200 group-open:rotate-180" strokeWidth={2} aria-hidden />
                </summary>
                <p className="pb-5 pr-8 text-[15px] leading-relaxed text-[var(--foreground-muted)]">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <m.div
          ref={studentOfferRef}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.48 }}
          className="mt-16 w-full max-w-5xl"
        >
          <PricingStudentOffer />
        </m.div>

        {/* <m.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.56 }}
          className="mt-16 flex w-full justify-center md:mt-20"
        >
          <PricingTimeCalculator />
        </m.div> */}
      </main>

      <Footer />
    </MarketingPageShell>
  );
}
