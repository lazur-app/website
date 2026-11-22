"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion as m } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { HandUnderline } from "@/components/buddy/HandLoop";
import { Sticker } from "@/components/landing/Sticker";
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
const PROOF = TESTIMONIALS.find((t) => t.name === "Akshat Thakur");
const PROOF_QUOTE = "it's one of those tools that quietly becomes part of your daily workflow. it feels like having a smart teammate in every app.";

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

      <main className="relative overflow-x-clip px-4 pb-24 pt-32 sm:px-6 md:pt-40">
        {/* A couple of stickers either side of the header, on screens wide enough to have edges. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 hidden h-[420px] xl:block" aria-hidden>
          <Sticker name="cloud" size={92} rotate={-10} className="absolute left-[8%] top-[160px]" />
          <Sticker name="flower" size={96} rotate={8} className="absolute right-[8%] top-[150px]" />
        </div>
        <div className="relative mx-auto flex max-w-6xl flex-col items-center">
        <div className="mb-12 text-center">
          <m.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-sans text-[clamp(2.4rem,5.4vw,4.6rem)] font-bold leading-[1.04] tracking-[-0.05em] text-[var(--foreground)]"
          >
            <span className="relative inline-block whitespace-nowrap">
              Simple
              <HandUnderline show color="#e11d48" delay={0.4} duration={0.9} offset={2} />
            </span>{" "}
            pricing.
          </m.h1>
          <p className="mx-auto mt-6 max-w-[30rem] text-[clamp(1rem,1.4vw,1.12rem)] font-medium leading-snug text-[var(--foreground-muted)]">
            Every plan starts with a free 3-day trial: about 25 AI requests and 10,000 words.
          </p>
        </div>

        <m.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12 flex w-full justify-center overflow-visible"
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
          <p className="mb-6 w-full max-w-2xl rounded-[12px] border-[1.5px] border-[#e11d48] bg-white px-4 py-3 text-center text-[14px] font-medium text-[#9f1239]">
            {error}
          </p>
        ) : null}

        <div className="mx-auto grid w-full max-w-md items-stretch gap-6 md:max-w-5xl md:grid-cols-3">
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
          className="mt-8 max-w-2xl text-center text-[13px] leading-relaxed text-[var(--foreground-muted)]"
        >
          AI usage shows in the app as a percentage of your monthly allowance that resets with your plan.
          Quick questions use a little, long lessons and background jobs use more; the request counts are
          typical, not exact. Dictation doesn&apos;t count. {FAIR_USE_FOOTNOTE}{" "}
          <TrackedLink
            href="/download"
            eventProps={{ location: "pricing_footnote", label: "Download Lazur", destination: "/download" }}
            className="font-semibold text-[var(--foreground)] underline decoration-[var(--foreground)]/25 underline-offset-4 hover:decoration-[var(--foreground)]"
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
            className="mt-16 flex w-full max-w-[680px] items-center gap-4 rounded-[20px] border-[1.5px] border-[#1c1917] bg-white p-6 text-left shadow-[0_2px_0_rgba(28,25,23,0.9),0_10px_24px_-8px_rgba(28,25,23,0.18)]"
          >
            <TestimonialAvatar testimonial={PROOF} size={44} />
            <div>
              <blockquote className="text-[17px] font-bold leading-snug tracking-[-0.02em] text-[var(--foreground)]">
                &ldquo;{PROOF_QUOTE}&rdquo;
              </blockquote>
              <figcaption className="mt-2 text-[13px] text-[var(--foreground-muted)]">
                {PROOF.name}, {PROOF.role}
                {PROOF.company ? ` of ${PROOF.company.label}` : ""}
              </figcaption>
            </div>
          </m.figure>
        ) : null}

        <section ref={faqRef} className="mt-24 w-full max-w-[680px]" aria-labelledby="pricing-faq">
          <h2 id="pricing-faq" className="text-[clamp(1.75rem,3vw,2.25rem)] font-bold leading-[1.1] tracking-[-0.04em] text-[var(--foreground)]">
            Questions before you start
          </h2>
          <div className="mt-6 space-y-3">
            {PRICING_FAQ.map((item, i) => (
              <details
                key={item.q}
                className="group rounded-[20px] border-[1.5px] border-[#1c1917] bg-white px-6 shadow-[0_2px_0_rgba(28,25,23,0.9)]"
                onToggle={(e) =>
                  track(e.currentTarget.open ? "faq_opened" : "faq_closed", { question: item.q, index: i, location: "pricing_page" })
                }
              >
                <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-4 py-4 text-[17px] font-bold tracking-[-0.02em] text-[var(--foreground)] [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <ChevronDown className="h-4 w-4 shrink-0 text-[var(--foreground)] transition-transform duration-200 group-open:rotate-180" strokeWidth={2} aria-hidden />
                </summary>
                <p className="pb-6 pr-8 text-[15px] leading-relaxed text-[var(--foreground-muted)]">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <m.div
          ref={studentOfferRef}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.48 }}
          className="mt-24 w-full max-w-5xl"
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
        </div>
      </main>

      <Footer />
    </MarketingPageShell>
  );
}
