import { rememberVisitorEmail } from "@/lib/productAnalytics";

export const EXCLUSIVE_ACCESS_PATH = "/exclusive-access";

function apiBase() {
  return process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:8000";
}

export type ExclusiveAccessResult = {
  status: "registered" | "already_registered";
  message: string;
};

export async function submitExclusiveAccessRequest(
  email: string,
  options?: {
    platform?: string;
    source?: string;
    excitedToUseFor?: string;
    aboutYourself?: string;
  }
): Promise<ExclusiveAccessResult> {
  const res = await fetch(`${apiBase()}/exclusive-access`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      platform: options?.platform,
      source: options?.source,
      // The API requires this; short forms (like the Windows waitlist) don't ask it, so say where it came from.
      excited_to_use_for: options?.excitedToUseFor?.trim() || `${options?.platform ?? "early"} waitlist`,
      about_yourself: options?.aboutYourself,
    }),
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { detail?: unknown } | null;
    throw new Error(errorMessage(res.status, body?.detail));
  }

  rememberVisitorEmail(email);
  return res.json() as Promise<ExclusiveAccessResult>;
}

/** The API's `detail` is a string for our own errors but a list of objects for validation errors. */
function errorMessage(status: number, detail: unknown): string {
  if (status === 429) return "Too many tries. Please wait a bit and try again.";
  if (typeof detail === "string" && detail) return detail;
  if (Array.isArray(detail) && detail.some((d) => Array.isArray(d?.loc) && d.loc.includes("email"))) {
    return "That email doesn't look right.";
  }
  return "Something went wrong. Please try again.";
}
