import { getAccessToken } from "./auth";

export type PlanType = "pro" | "power";

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
  can_manage_in_portal: boolean;
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

export function isFreeTierPlan(plan: string): boolean {
  const normalized = plan.toLowerCase();
  return normalized.includes("free") || normalized.includes("trial");
}

export function canUpgradeTo(plan: string, target: PlanType): boolean {
  const normalized = plan.toLowerCase();
  if (target === "pro") {
    return isFreeTierPlan(plan);
  }
  return normalized !== "power";
}

export async function createCheckoutSession(planType: PlanType): Promise<string | null> {
  const token = getAccessToken();
  if (!token) return null;

  const response = await fetch(
    `${apiBase()}/billing/create-checkout-session?plan_type=${planType}`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  if (!response.ok) return null;
  const data = (await response.json()) as { url?: string };
  return data.url ?? null;
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
