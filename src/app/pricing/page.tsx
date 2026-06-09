"use client";

import { motion as m } from "framer-motion";
import { Check, ShieldCheck, Zap, Globe, Cpu } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SoftCard } from "@/components/SoftCard";
import { MarketingPageShell } from "@/components/MarketingPageShell";
import { hasValidSessionToken } from "@/lib/auth";
import { loginPathWithReturn } from "@/lib/returnTo";

const plans = [
  {
    name: "Free",
    price: "$0",
    planType: null,
    description:
      "Try Lazur without a meter running on minutes — a generous monthly word budget for light use.",
    buttonText: "Current Plan",
    features: [
      "5,000 AI-polished words / month",
      "Standard rewriting & formatting",
      "Smart Rewrite preview (included in word budget)",
      "1 Mac · community support",
    ],
    icon: Zap,
    featured: false,
  },
  {
    name: "Pro",
    price: "$10",
    period: "/ month",
    planType: "pro",
    description:
      "For daily knowledge workers — large word allowance plus Command Mode for voice-driven writing.",
    buttonText: "Upgrade to Pro",
    features: [
      "150,000 AI-polished words / month",
      "Command Mode — 30 voice commands / month",
      "Smart Rewrite — context-aware rewrites",
      "Unlimited devices",
      "Priority support",
    ],
    icon: Zap,
    featured: true,
  },
  {
    name: "Power",
    price: "$25",
    period: "/ month",
    planType: "power",
    description:
      "For heavy writers and engineers — maximum words and Command Mode for all-day use.",
    buttonText: "Upgrade to Power",
    features: [
      "500,000 AI-polished words / month",
      "Command Mode — 200 voice commands / month",
      "Smart Rewrite — context-aware rewrites",
      "Unlimited devices",
      "Priority support",
    ],
    icon: Cpu,
    featured: false,
  },
];

export default function PricingPage() {
  const handleUpgrade = (planType: string | null) => {
    if (!planType) return;

    if (!hasValidSessionToken()) {
      window.location.href = loginPathWithReturn("/billing");
      return;
    }

    window.location.href = `/billing?plan=${planType}`;
  };

  return (
    <MarketingPageShell>
      <Navbar />

      <main className="relative mx-auto flex max-w-6xl flex-col items-center px-6 pb-16 pt-24 md:pt-28">
        <div className="mb-10 space-y-3 text-center md:mb-12">
          <m.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-3xl font-semibold tracking-[-0.03em] text-[var(--foreground)] md:text-[2.75rem]"
          >
            Simple, transparent pricing.
          </m.h1>
          <m.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto max-w-lg text-[15px] leading-relaxed text-[var(--foreground-muted)] md:text-base"
          >
            Pay for polished output — word counts reset each month so you always
            know where you stand.
          </m.p>
        </div>

        <div className="grid w-full gap-4 md:grid-cols-3 md:gap-5">
          {plans.map((plan, idx) => (
            <m.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + idx * 0.08 }}
            >
              <SoftCard
                hover={false}
                className={`relative flex h-full flex-col p-6 md:p-7 ${
                  plan.featured ? "ring-1 ring-[var(--foreground)]/10" : ""
                }`}
              >
                {plan.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--foreground)] px-3 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--background)]">
                    Most popular
                  </div>
                )}

                <div className="mb-5 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-display text-lg font-semibold text-[var(--foreground)]">
                      {plan.name}
                    </h3>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--foreground-muted)]">
                      {plan.description}
                    </p>
                  </div>
                  <div className="shrink-0 rounded-xl bg-[var(--background-deep)] p-2 text-[var(--foreground-muted)]">
                    <plan.icon className="h-4 w-4" strokeWidth={1.75} />
                  </div>
                </div>

                <div className="mb-6 flex items-baseline gap-1">
                  <span className="font-display text-4xl font-semibold tracking-tight text-[var(--foreground)]">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-sm font-medium text-[var(--foreground-faint)]">
                      {plan.period}
                    </span>
                  )}
                </div>

                <div className="mb-6 flex-1 space-y-2.5">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-2.5">
                      <div className="mt-0.5 rounded-full bg-[var(--background-deep)] p-0.5 text-[var(--foreground-muted)]">
                        <Check className="h-3.5 w-3.5" strokeWidth={2} />
                      </div>
                      <span className="text-[13px] font-medium leading-snug text-[var(--foreground-muted)]">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleUpgrade(plan.planType)}
                  disabled={!plan.planType}
                  className={`w-full rounded-full py-3 text-sm font-semibold transition-all active:scale-[0.98] ${
                    !plan.planType
                      ? "cursor-default bg-[var(--background-deep)] text-[var(--foreground-faint)]"
                      : "btn-dark"
                  }`}
                >
                  {plan.buttonText}
                </button>
              </SoftCard>
            </m.div>
          ))}
        </div>

        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 flex flex-wrap justify-center gap-8 text-[var(--foreground-faint)]"
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" strokeWidth={1.5} />
            <span className="text-[10px] font-semibold uppercase tracking-[0.14em]">
              Secure SSL Encryption
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4" strokeWidth={1.5} />
            <span className="text-[10px] font-semibold uppercase tracking-[0.14em]">
              Privacy First AI
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4" strokeWidth={1.5} />
            <span className="text-[10px] font-semibold uppercase tracking-[0.14em]">
              Worldwide Support
            </span>
          </div>
        </m.div>
      </main>

      <Footer />
    </MarketingPageShell>
  );
}
