export type PlanFeature = {
  text: string;
  included: boolean;
};

export type PricingRegion = "international" | "india";
export type BillingInterval = "monthly" | "annual";

type RegionalPricing = {
  currency: "USD" | "INR";
  monthly: number;
  annual: number;
  gstExclusive?: boolean;
};

export type PlanPriceDisplay = {
  price: string;
  period?: string;
  savingsLabel?: string;
  equivMonthly?: string;
  alternateHint?: string;
  /** Shown on monthly view so users see the annual option. */
  annualTeaser?: string;
};

export type WebsitePlan = {
  id: "pro_trial" | "pro" | "power";
  name: string;
  international: RegionalPricing | null;
  india: RegionalPricing | null;
  /** One or two lines shown under the plan title. */
  descriptionLines: string[];
  featured?: boolean;
  featuredBadge?: string;
  planType: "pro" | "power" | null;
  isTrial?: boolean;
  buttonText: string;
  features: PlanFeature[];
};

export const INDIA_GST_RATE_LABEL = "18%";
export const INDIA_GST_SUFFIX = "+ GST";
export const INDIA_GST_NOTE =
  "India pricing is tax-exclusive. GST is added at checkout on top of listed INR amounts (Polar).";

const TRIAL_PRICING: RegionalPricing = {
  currency: "USD",
  monthly: 0,
  annual: 0,
};

export const WEBSITE_PLANS: WebsitePlan[] = [
  {
    id: "pro_trial",
    name: "Pro Trial",
    international: { ...TRIAL_PRICING },
    india: { currency: "INR", monthly: 0, annual: 0, gstExclusive: true },
    descriptionLines: [
      "Full Pro experience when you sign up.",
      "No credit card to start.",
    ],
    planType: null,
    isTrial: true,
    buttonText: "Start 7-day trial",
    features: [
      {
        text: "Unlimited words* (150,000 words/month fair-use cap)",
        included: true,
      },
      { text: "50 Command Mode uses per month", included: true },
      { text: "Polish + style matching", included: true },
      { text: "Zen Mode + 9 clipboard slots", included: true },
      { text: "Dictionary, snippets, and history", included: true },
      { text: "Voice Profiling (coming soon)", included: false },
      { text: "Priority support", included: false },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    international: { currency: "USD", monthly: 14, annual: 108 },
    india: {
      currency: "INR",
      monthly: 300,
      annual: 3000,
      gstExclusive: true,
    },
    descriptionLines: ["For professionals who dictate every day."],
    featured: true,
    featuredBadge: "Most popular",
    planType: "pro",
    buttonText: "Get Pro",
    features: [
      {
        text: "Unlimited words* (150,000 words/month fair-use cap)",
        included: true,
      },
      { text: "50 Command Mode uses per month", included: true },
      { text: "Polish + style matching", included: true },
      { text: "Zen Mode + 9 clipboard slots", included: true },
      { text: "Dictionary, snippets, and history", included: true },
      { text: "Voice Profiling (coming soon)", included: false },
      { text: "Priority support", included: false },
    ],
  },
  {
    id: "power",
    name: "Power",
    international: { currency: "USD", monthly: 35, annual: 270 },
    india: {
      currency: "INR",
      monthly: 750,
      annual: 7500,
      gstExclusive: true,
    },
    descriptionLines: [
      "Built for power users and heavy daily workflows.",
    ],
    planType: "power",
    buttonText: "Get Power",
    features: [
      {
        text: "Unlimited words* (500,000 words/month fair-use cap)",
        included: true,
      },
      { text: "300 Command Mode uses per month", included: true },
      { text: "Polish + style matching", included: true },
      { text: "Zen Mode + 9 clipboard slots", included: true },
      { text: "Dictionary, snippets, and history", included: true },
      { text: "Voice Profiling (coming soon)", included: true },
      { text: "Priority support", included: true },
    ],
  },
];

export function annualSavingsPercent(monthly: number, annual: number): number {
  if (monthly <= 0) return 0;
  const yearlyAtMonthly = monthly * 12;
  return Math.round((1 - annual / yearlyAtMonthly) * 100);
}

export function formatAmount(amount: number, currency: "USD" | "INR"): string {
  if (currency === "INR") {
    return `₹${amount.toLocaleString("en-IN")}`;
  }
  return `$${amount.toFixed(2)}`;
}

function regionalPricing(
  plan: WebsitePlan,
  region: PricingRegion,
): RegionalPricing | null {
  return region === "india" ? plan.india : plan.international;
}

function alternateRegion(region: PricingRegion): PricingRegion {
  return region === "india" ? "international" : "india";
}

export function planPrices(
  plan: WebsitePlan,
  region: PricingRegion,
  interval: BillingInterval,
  options?: { includeAlternate?: boolean },
): PlanPriceDisplay {
  const pricing = regionalPricing(plan, region);

  if (!pricing || plan.isTrial) {
    const symbol = region === "india" ? "₹" : "$";
    return {
      price: region === "india" ? "₹0" : "$0.00",
      period: "for 7 days",
    };
  }

  const gst = pricing.gstExclusive ? ` ${INDIA_GST_SUFFIX}` : "";

  let display: PlanPriceDisplay;

  if (interval === "monthly") {
    display = {
      price: formatAmount(pricing.monthly, pricing.currency),
      period: `/ month${gst}`,
    };
    const annual = planPrices(plan, region, "annual");
    display.annualTeaser = `or ${annual.price}/year (${annual.equivMonthly})`;
  } else {
    const savings = annualSavingsPercent(pricing.monthly, pricing.annual);
    const equiv = pricing.annual / 12;
    display = {
      price: formatAmount(pricing.annual, pricing.currency),
      period: `/ year${gst}`,
      savingsLabel: `Save ${savings}%`,
      equivMonthly: `${formatAmount(equiv, pricing.currency)}/mo billed annually`,
    };
  }

  if (options?.includeAlternate) {
    const alt = planPrices(plan, alternateRegion(region), interval);
    const altLabel = alternateRegion(region) === "india" ? "India" : "International";
    display.alternateHint = `${altLabel}: ${alt.price}${alt.period ? ` ${alt.period}` : ""}${
      alt.equivMonthly ? ` (${alt.equivMonthly})` : ""
    }`;
  }

  return display;
}

export function maxAnnualSavings(region: PricingRegion): number {
  return WEBSITE_PLANS.reduce((max, plan) => {
    const pricing = regionalPricing(plan, region);
    if (!pricing || plan.isTrial) return max;
    return Math.max(max, annualSavingsPercent(pricing.monthly, pricing.annual));
  }, 0);
}

export function regionCurrencyLabel(region: PricingRegion): string {
  return region === "india" ? "INR" : "USD";
}

export const PRICING_SNAPSHOT = WEBSITE_PLANS;

export const TRIAL_LABEL = "7-day Pro trial";
export const TRIAL_NOTE = "Full Pro features · no credit card to download";
export const PRO_FROM_LABEL = "From $14/mo";
export const PRO_FROM_LABEL_IN = "From ₹300/mo + GST";
export const PRO_PRICE_NOTE = "Pro $14/mo · $108/yr";
export const PRO_PRICE_NOTE_IN = "Pro ₹300/mo + GST · ₹3,000/yr + GST";
export const POWER_FROM_LABEL = "From $35/mo";
export const POWER_FROM_LABEL_IN = "From ₹750/mo + GST";
export const POWER_PRICE_NOTE = "Power $35/mo · 300 Command Mode uses";
export const POWER_PRICE_NOTE_IN = "Power ₹750/mo + GST · 300 Command Mode uses";

export const FAIR_USE_FOOTNOTE =
  "* Marketed as unlimited with fair-usage limits enforced per plan.";
