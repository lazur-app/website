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
  options?: { platform?: string; source?: string }
): Promise<ExclusiveAccessResult> {
  const res = await fetch(`${apiBase()}/exclusive-access`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      platform: options?.platform,
      source: options?.source,
    }),
  });

  if (!res.ok) {
    const detail =
      (await res.json().catch(() => null)) as { detail?: string } | null;
    throw new Error(detail?.detail || "Something went wrong. Please try again.");
  }

  return res.json() as Promise<ExclusiveAccessResult>;
}
