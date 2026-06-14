export function parseApiDate(iso?: string | null): Date | null {
  if (!iso) return null;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function formatSubscriptionDate(iso?: string | null): string {
  const d = parseApiDate(iso);
  if (!d) return "—";
  return d.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function daysRemaining(iso?: string | null): number | null {
  const d = parseApiDate(iso);
  if (!d) return null;
  const ms = d.getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

export function periodEndLabel(
  plan: string,
  options?: { cancelAtPeriodEnd?: boolean },
): string {
  if (options?.cancelAtPeriodEnd) return "Cancels on";
  const normalized = plan.toLowerCase();
  if (normalized.includes("trial")) return "Trial ends";
  if (normalized.includes("free")) return "Billing";
  return "Renews on";
}

export function periodEndDescription(
  plan: string,
  iso?: string | null,
  options?: { cancelAtPeriodEnd?: boolean; billingSource?: string | null },
): string {
  const date = formatSubscriptionDate(iso);
  const days = daysRemaining(iso);
  const normalized = plan.toLowerCase();

  if (options?.billingSource === "admin_comp") {
    return iso
      ? `Complimentary access · valid until ${date}`
      : "Complimentary access";
  }

  if (options?.cancelAtPeriodEnd && iso) {
    return `Cancels on ${date} — access remains until then`;
  }

  if (normalized.includes("free")) {
    return "Free tier — upgrade anytime";
  }
  if (normalized.includes("trial") && days !== null) {
    return days === 0
      ? `Trial ends today (${date})`
      : `${days} ${days === 1 ? "day" : "days"} left · ends ${date}`;
  }
  if (iso) {
    return `${periodEndLabel(plan, options)} ${date}`;
  }
  return "Active subscription";
}
