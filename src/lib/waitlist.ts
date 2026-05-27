const REF_STORAGE_KEY = "lazur_ref";
const MY_REF_STORAGE_KEY = "lazur_my_referral";
const UTM_STORAGE_KEY = "lazur_utm";

export type WaitlistJoinPayload = {
  email: string;
  platform: string;
  timezone: string;
  locale: string;
  referred_by_code?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
};

export type WaitlistJoinResult = {
  email: string;
  referral_code: string;
  referral_link: string;
  referral_count: number;
  waitlist_position: number;
  total_count: number;
  already_joined: boolean;
};

export type WaitlistStats = {
  total_count: number;
};

export type LeaderboardEntry = {
  rank: number;
  referral_code: string;
  display_name: string;
  referral_count: number;
};

export type LeaderboardData = {
  total_signups: number;
  total_referrals: number;
  active_referrers: number;
  entries: LeaderboardEntry[];
};

export function storeMyReferralCode(code: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(MY_REF_STORAGE_KEY, code);
}

export function getMyReferralCode(): string | undefined {
  if (typeof window === "undefined") return undefined;
  return localStorage.getItem(MY_REF_STORAGE_KEY) || undefined;
}

function apiBase() {
  return process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:8000";
}

export function detectPlatform(): string {
  if (typeof navigator === "undefined") return "web";
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/.test(ua)) return "ios";
  if (/Android/.test(ua)) return "android";
  if (/Mac OS X|Macintosh/.test(ua)) return "macos";
  if (/Windows/.test(ua)) return "windows";
  if (/Linux/.test(ua)) return "linux";
  return "web";
}

export function captureReferralFromUrl() {
  if (typeof window === "undefined") return;

  const params = new URLSearchParams(window.location.search);
  const ref = params.get("ref")?.trim();
  if (ref) {
    localStorage.setItem(REF_STORAGE_KEY, ref);
  }

  const utm = {
    utm_source: params.get("utm_source") || undefined,
    utm_medium: params.get("utm_medium") || undefined,
    utm_campaign: params.get("utm_campaign") || undefined,
  };

  if (utm.utm_source || utm.utm_medium || utm.utm_campaign) {
    localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utm));
  }
}

export function getStoredReferralCode(): string | undefined {
  if (typeof window === "undefined") return undefined;
  return localStorage.getItem(REF_STORAGE_KEY) || undefined;
}

function getStoredUtm(): Pick<
  WaitlistJoinPayload,
  "utm_source" | "utm_medium" | "utm_campaign"
> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(UTM_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function buildWaitlistPayload(email: string): WaitlistJoinPayload {
  return {
    email: email.trim().toLowerCase(),
    platform: detectPlatform(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    locale: navigator.language,
    referred_by_code: getStoredReferralCode(),
    ...getStoredUtm(),
  };
}

export async function joinWaitlist(email: string): Promise<WaitlistJoinResult> {
  const res = await fetch(`${apiBase()}/waitlist/join`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(buildWaitlistPayload(email)),
  });

  if (!res.ok) {
    const detail = await res.json().catch(() => ({}));
    throw new Error(detail.detail || "Could not join the waitlist. Try again.");
  }

  return res.json();
}

export async function fetchWaitlistStats(): Promise<WaitlistStats> {
  const res = await fetch(`${apiBase()}/waitlist/stats`);
  if (!res.ok) {
    return { total_count: 0 };
  }
  return res.json();
}

export async function fetchLeaderboard(): Promise<LeaderboardData> {
  const res = await fetch(`${apiBase()}/waitlist/leaderboard`);
  if (!res.ok) {
    throw new Error("Could not load leaderboard.");
  }
  return res.json();
}
