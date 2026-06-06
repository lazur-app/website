import { getAccessToken } from "./auth";

export type PlanType = "pro" | "power";

function apiBase() {
  return process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:8000";
}

export function isPaidPlan(plan: string): boolean {
  const normalized = plan.toLowerCase();
  return normalized === "pro" || normalized === "power";
}

export function canUpgradeTo(plan: string, target: PlanType): boolean {
  const normalized = plan.toLowerCase();
  if (target === "pro") {
    return normalized === "free" || normalized.includes("trial");
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

export async function fetchCustomerPortalUrl(): Promise<string | null> {
  const token = getAccessToken();
  if (!token) return null;

  const response = await fetch(`${apiBase()}/billing/customer-portal`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) return null;
  const data = (await response.json()) as { url?: string };
  return data.url ?? null;
}
