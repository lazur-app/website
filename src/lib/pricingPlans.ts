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
  /** Total $/₹ saved vs paying monthly for 12 months, shown under the price */
  savingsNote?: string;
  alternateHint?: string;
};

export type WebsitePlan = {
  id: "free" | "pro" | "power";
  name: string;
  international: RegionalPricing | null;
  india: RegionalPricing | null;
  /** One or two lines shown under the plan title. */
  descriptionLines: string[];
  featured?: boolean;
  featuredBadge?: string;
  planType?: "pro" | "power";
  /** Shown under the price, e.g. trial callout */
  trialNote?: string;
  /** Primary button destination */
  cta: "download" | "checkout";
  buttonText: string;
  features: PlanFeature[];
};

export const INDIA_GST_RATE_LABEL = "18%";
export const INDIA_GST_SUFFIX = "+ GST";
export const INDIA_GST_NOTE =
  "India pricing is tax-exclusive. GST is added at checkout on top of listed INR amounts (Polar).";


export const WEBSITE_PLANS: WebsitePlan[] = [
  {
    id: "free",
    name: "Free",
    international: { currency: "USD", monthly: 0, annual: 0 },
    india: { currency: "INR", monthly: 0, annual: 0 },
    descriptionLines: ["see if voice actually sticks.", "best for trying it out"],
    cta: "download",
    buttonText: "start free",
    features: [
      { text: "Plenty of dictation (5,000 words/month)", included: true },
      { text: "Dictation Mode in every Mac app", included: true },
      { text: "On-device speech-to-text", included: true },
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
    descriptionLines: ["speak all day. no word math.", "best for everyday use"],
    featured: true,
    featuredBadge: "Popular",
    planType: "pro",
    cta: "download",
    buttonText: "get pro",
    features: [
      { text: "Unlimited dictation", included: true },
      { text: "50 Command Mode uses per month", included: true },
      { text: "Polish + style matching", included: true },
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
    descriptionLines: ["command mode on tap.", "best for people who live in it"],
    planType: "power",
    cta: "checkout",
    buttonText: "get power",
    features: [
      { text: "True unlimited dictation", included: true },
      { text: "300 Command Mode uses per month", included: true },
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

function formatMonthlyAnnualNudge(
  monthly: number,
  annual: number,
  currency: "USD" | "INR",
): string {
  const saved = monthly * 12 - annual;
  if (currency === "INR") {
    return `Save ₹${saved.toLocaleString("en-IN")} if billed annually`;
  }
  const dollars = Number.isInteger(saved) ? `$${saved}` : `$${saved.toFixed(2)}`;
  return `Save ${dollars} if billed annually`;
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

  if (!pricing) {
    return {
      price: region === "india" ? "₹0" : "$0.00",
      period: "",
    };
  }

  if (pricing.monthly === 0) {
    return {
      price: "Free",
      period: "forever",
    };
  }

  const gst = pricing.gstExclusive ? ` ${INDIA_GST_SUFFIX}` : "";

  let display: PlanPriceDisplay;

  if (interval === "monthly") {
    display = {
      price: formatAmount(pricing.monthly, pricing.currency),
      period: `/ month${gst}`,
      savingsNote: formatMonthlyAnnualNudge(
        pricing.monthly,
        pricing.annual,
        pricing.currency,
      ),
    };
  } else {
    const savings = annualSavingsPercent(pricing.monthly, pricing.annual);
    display = {
      price: formatAmount(pricing.annual, pricing.currency),
      period: `/ year${gst}`,
      savingsLabel: `Save ${savings}%`,
    };
  }

  if (options?.includeAlternate) {
    const alt = planPrices(plan, alternateRegion(region), interval);
    const altLabel = alternateRegion(region) === "india" ? "India" : "International";
    display.alternateHint = `${altLabel}: ${alt.price}${alt.period ? ` ${alt.period}` : ""}${
      alt.savingsNote ? ` · ${alt.savingsNote}` : ""
    }`;
  }

  return display;
}

export function maxAnnualSavings(region: PricingRegion): number {
  return WEBSITE_PLANS.reduce((max, plan) => {
    const pricing = regionalPricing(plan, region);
    if (!pricing) return max;
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
