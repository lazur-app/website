import { getAccessToken } from "./auth";

export type PlanType = "pro" | "power";
export type BillingInterval = "month" | "year";

const CHECKOUT_INTENT_KEY = "lazur_checkout_intent";

export type CheckoutIntent = {
  plan: PlanType;
  interval: BillingInterval;
};

export function storeCheckoutIntent(intent: CheckoutIntent) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(CHECKOUT_INTENT_KEY, JSON.stringify(intent));
}

export function consumeCheckoutIntent(): CheckoutIntent | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(CHECKOUT_INTENT_KEY);
  sessionStorage.removeItem(CHECKOUT_INTENT_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as CheckoutIntent;
    if (
      (parsed.plan === "pro" || parsed.plan === "power") &&
      (parsed.interval === "month" || parsed.interval === "year")
    ) {
      return parsed;
    }
  } catch {
    /* ignore */
  }
  return null;
}

export type BillingSource = "polar" | "admin_comp" | "trial" | null;

export type BillingActivityItem = {
  id: string;
  event_type: string;
  label: string;
  detail: string | null;
  occurred_at: string | null;
};

export type BillingInvoiceItem = {
  id: string;
  status: string;
  amount_cents: number;
  currency: string;
  billing_reason: string | null;
  description: string | null;
  invoice_url: string | null;
  created_at: string | null;
  paid_at: string | null;
};

export type BillingStatus = {
  plan: string;
  plan_slug: string;
  billing_source: BillingSource;
  subscription_status: string | null;
  cancel_at_period_end: boolean;
  comp_reason: string | null;
  current_period_end: string | null;
  billing_interval: BillingInterval | null;
  presentment_currency: string | null;
  billing_region: string | null;
  can_manage_in_portal: boolean;
};

export type PriceInterval = {
  amount: number;
  amount_cents: number;
  currency: string;
  equiv_monthly?: number;
  savings_percent?: number;
};

export type PriceCatalog = {
  region: "IN" | "INTL";
  currency: string;
  gst_exclusive: boolean;
  plans: {
    pro: { month: PriceInterval; year: PriceInterval };
    power: { month: PriceInterval; year: PriceInterval };
  };
};

function apiBase() {
  return process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:8000";
}

async function billingFetch<T>(path: string): Promise<T | null> {
  const token = getAccessToken();
  if (!token) return null;

  const response = await fetch(`${apiBase()}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) return null;
  return (await response.json()) as T;
}

async function billingFetchWithError(path: string): Promise<{ url?: string; detail?: string }> {
  const token = getAccessToken();
  if (!token) return { detail: "Not signed in" };

  const response = await fetch(`${apiBase()}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { detail?: string };
    return { detail: body.detail || "Request failed" };
  }

  return (await response.json()) as { url?: string };
}

export function isPaidPlan(plan: string): boolean {
  const normalized = plan.toLowerCase();
  return normalized === "pro" || normalized === "power";
}

export function isTrialOrUnpaid(plan: string): boolean {
  const normalized = plan.toLowerCase();
  return (
    normalized.includes("trial") ||
    normalized.includes("subscription required") ||
    normalized.includes("expired")
  );
}

/** @deprecated use isTrialOrUnpaid */
export function isFreeTierPlan(plan: string): boolean {
  return isTrialOrUnpaid(plan);
}

export function canUpgradeTo(plan: string, target: PlanType): boolean {
  const normalized = plan.toLowerCase();
  if (normalized === "power") return false;
  if (target === "pro") {
    return !isPaidPlan(plan) || normalized.includes("trial");
  }
  return normalized !== "power";
}

export async function fetchPrices(country?: string): Promise<PriceCatalog | null> {
  const query = country ? `?country=${encodeURIComponent(country)}` : "";
  const response = await fetch(`${apiBase()}/billing/prices${query}`);
  if (!response.ok) return null;
  return (await response.json()) as PriceCatalog;
}

export async function createCheckoutSession(
  planType: PlanType,
  interval: BillingInterval = "month",
  country?: string,
): Promise<string | null> {
  const token = getAccessToken();
  if (!token) return null;

  const params = new URLSearchParams({
    plan_type: planType,
    interval,
  });
  if (country) params.set("country", country);

  const response = await fetch(
    `${apiBase()}/billing/create-checkout-session?${params.toString()}`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  if (!response.ok) return null;
  const data = (await response.json()) as { url?: string };
  return data.url ?? null;
}

export async function redirectToCheckout(
  planType: PlanType,
  interval: BillingInterval,
  region: "international" | "india",
): Promise<{ ok: true } | { ok: false; error: string }> {
  const country = region === "india" ? "IN" : "US";
  const url = await createCheckoutSession(planType, interval, country);
  if (!url) {
    return { ok: false, error: "Could not start checkout. Please try again." };
  }
  window.location.href = url;
  return { ok: true };
}

export async function fetchCustomerPortalUrl(): Promise<{
  url: string | null;
  error: string | null;
}> {
  const result = await billingFetchWithError("/billing/customer-portal");
  if (result.url) return { url: result.url, error: null };
  return { url: null, error: result.detail ?? "Could not open billing portal." };
}

export async function fetchBillingStatus(): Promise<BillingStatus | null> {
  return billingFetch<BillingStatus>("/billing/status");
}

export async function fetchBillingActivity(): Promise<BillingActivityItem[]> {
  const data = await billingFetch<{ items: BillingActivityItem[] }>("/billing/activity");
  return data?.items ?? [];
}

export async function fetchBillingInvoices(): Promise<BillingInvoiceItem[]> {
  const data = await billingFetch<{ items: BillingInvoiceItem[] }>("/billing/invoices");
  return data?.items ?? [];
}

export function formatMoney(amountCents: number, currency = "usd"): string {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amountCents / 100);
}

export function invoiceLabel(item: BillingInvoiceItem): string {
  if (item.description) return item.description;
  switch (item.billing_reason) {
    case "subscription_create":
      return "New subscription";
    case "subscription_cycle":
      return "Subscription renewal";
    case "subscription_update":
      return "Plan change";
    default:
      return "Payment";
  }
}
