const REF_STORAGE_KEY = "lazur_ref";
const MY_REF_STORAGE_KEY = "lazur_my_referral";
const UTM_STORAGE_KEY = "lazur_utm";

export type ReferralMe = {
  referral_code: string;
  referral_link: string;
  referral_count: number;
  leaderboard_rank?: number | null;
};

export type ReferralStats = {
  total_users: number;
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

export async function claimStoredReferral(token: string): Promise<void> {
  const code = getStoredReferralCode();
  if (!code) return;

  const res = await fetch(`${apiBase()}/referrals/claim`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ referral_code: code }),
  });

  if (res.ok) {
    localStorage.removeItem(REF_STORAGE_KEY);
  }
}

export async function fetchReferralMe(token: string): Promise<ReferralMe | null> {
  const res = await fetch(`${apiBase()}/referrals/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  return res.json();
}

export async function fetchReferralStats(): Promise<ReferralStats> {
  const res = await fetch(`${apiBase()}/referrals/stats`);
  if (!res.ok) {
    return { total_users: 0 };
  }
  return res.json();
}

export async function fetchLeaderboard(): Promise<LeaderboardData> {
  const res = await fetch(`${apiBase()}/referrals/leaderboard`);
  if (!res.ok) {
    throw new Error("Could not load leaderboard.");
  }
  return res.json();
}
