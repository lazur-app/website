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
    india: null,
    descriptionLines: ["try Pro free for 7 days", "no credit card needed"],
    trialNote: "Starts when you first open Lazur on your Mac",
    cta: "download",
    buttonText: "Download for Mac",
    features: [
      { text: "Full Pro for 7 days", included: true },
      { text: "Starts when you open the app", included: true },
      { text: "No credit card required", included: true },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    international: { currency: "USD", monthly: 18, annual: 180 },
    india: null,
    descriptionLines: ["speak all day. no word math.", "best for everyday use"],
    featured: true,
    featuredBadge: "Popular",
    planType: "pro",
    cta: "download",
    buttonText: "Start free trial",
    features: [
      { text: "Unlimited dictation", included: true },
      { text: "150 AI actions a month (commands and background jobs)", included: true },
      { text: "Agents in Chrome, reports, reminders and app control", included: true },
    ],
  },
  {
    id: "power",
    name: "Power",
    international: { currency: "USD", monthly: 120, annual: 1152 },
    india: null,
    descriptionLines: ["intent on tap.", "best for people who live in it"],
    planType: "power",
    cta: "checkout",
    buttonText: "Get Power",
    features: [
      { text: "Unlimited dictation", included: true },
      { text: "1,000 AI actions a month (commands and background jobs)", included: true },
      { text: "Everything in Pro, for people who live in it", included: true },
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
      period: "for 7 days",
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
      price: formatAmount(pricing.annual / 12, pricing.currency),
      period: `/ month, billed annually${gst}`,
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
export const TRIAL_NOTE = "Full Pro for 7 days · starts when you open the app";
export const PRO_FROM_LABEL = "From $18/mo";
export const PRO_FROM_LABEL_IN = "From ₹300/mo + GST";
export const PRO_PRICE_NOTE = "Pro $18/mo · $180/yr";
export const PRO_PRICE_NOTE_IN = "Pro ₹300/mo + GST · ₹3,000/yr + GST";
export const POWER_FROM_LABEL = "From $120/mo";
export const POWER_FROM_LABEL_IN = "From ₹750/mo + GST";
export const POWER_PRICE_NOTE = "Power $120/mo · unlimited AI buddy requests";
export const POWER_PRICE_NOTE_IN = "Power ₹750/mo + GST · unlimited Intent";

export const FAIR_USE_FOOTNOTE =
  "* Marketed as unlimited with fair-usage limits enforced per plan.";
