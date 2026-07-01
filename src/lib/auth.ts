const ACCESS_TOKEN_KEY = "lazur_access_token";
const REFRESH_TOKEN_KEY = "lazur_refresh_token";
const USER_CACHE_KEY = "lazur_user_cache";

/** How long navbar auth can reuse cached profile without revalidating. */
const SESSION_CACHE_TTL_MS = 30 * 60 * 1000;

export type UserProfile = {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  plan: string;
  plan_slug?: string;
  word_quota_limit: number;
  word_quota_used: number;
  command_quota_limit?: number;
  command_quota_used?: number;
  command_mode_enabled?: boolean;
  requires_subscription?: boolean;
  onboarding_completed: boolean;
  trial_status?: string;
  trial_started_at?: string | null;
  trial_ends_at?: string | null;
  current_period_end?: string | null;
  billing_source?: "polar" | "admin_comp" | "trial" | null;
  cancel_at_period_end?: boolean;
  referral_code?: string | null;
  referral_link?: string | null;
};

type CachedSession = {
  profile: UserProfile;
  cachedAt: number;
  tokenFingerprint: string;
};

type JwtPayload = {
  sub?: string;
  email?: string;
  exp?: number;
};

let inflightMeRequest: Promise<UserProfile | null> | null = null;

function apiBase() {
  return process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:8000";
}

function tokenFingerprint(token: string): string {
  return token.slice(-24);
}

function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(normalized)) as JwtPayload;
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string, skewMs = 30_000): boolean {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return true;
  return Date.now() >= payload.exp * 1000 - skewMs;
}

function readCachedSession(): CachedSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CachedSession;
  } catch {
    return null;
  }
}

function writeCachedSession(profile: UserProfile, token: string) {
  if (typeof window === "undefined") return;
  const entry: CachedSession = {
    profile,
    cachedAt: Date.now(),
    tokenFingerprint: tokenFingerprint(token),
  };
  localStorage.setItem(USER_CACHE_KEY, JSON.stringify(entry));
}

export function clearUserCache() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(USER_CACHE_KEY);
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function storeTokens(accessToken: string, refreshToken?: string | null) {
  if (typeof window === "undefined") return;
  const previous = getAccessToken();
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
  if (previous !== accessToken) {
    clearUserCache();
  }
}

export function clearTokens() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  clearUserCache();
}

export function clearSession() {
  clearTokens();
}

export function startOAuth(
  provider: "google" | "github",
  source: "web" | "desktop",
  returnTo?: string,
) {
  const params = new URLSearchParams({ source });
  if (returnTo) {
    params.set("return_to", returnTo);
  }
  window.location.href = `${apiBase()}/auth/login/${provider}?${params.toString()}`;
}

/** Instant session read for navbar — no network. */
export function getCachedUser(): UserProfile | null {
  const token = getAccessToken();
  if (!token || isTokenExpired(token)) return null;

  const cached = readCachedSession();
  if (!cached) return null;
  if (cached.tokenFingerprint !== tokenFingerprint(token)) return null;
  if (Date.now() - cached.cachedAt > SESSION_CACHE_TTL_MS) return null;

  return cached.profile;
}

export function hasValidSessionToken(): boolean {
  const token = getAccessToken();
  return !!token && !isTokenExpired(token);
}

export async function fetchMe(options?: { force?: boolean }): Promise<UserProfile | null> {
  const token = getAccessToken();
  if (!token) return null;

  if (isTokenExpired(token)) {
    clearSession();
    return null;
  }

  if (!options?.force) {
    const cached = getCachedUser();
    if (cached) return cached;
  }

  if (inflightMeRequest && !options?.force) {
    return inflightMeRequest;
  }

  const request = (async () => {
    const res = await fetch(`${apiBase()}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      if (res.status === 401) clearSession();
      return null;
    }

    const profile = (await res.json()) as UserProfile;
    writeCachedSession(profile, token);

    const { claimStoredReferral, storeMyReferralCode } = await import("./referrals");
    await claimStoredReferral(token).catch(() => {});
    if (profile.referral_code) {
      storeMyReferralCode(profile.referral_code);
    }

    return profile;
  })();

  inflightMeRequest = request;
  try {
    return await request;
  } finally {
    inflightMeRequest = null;
  }
}

export function logout() {
  clearSession();
  window.location.href = "/";
}

export function primeUserCache(profile: UserProfile) {
  const token = getAccessToken();
  if (token) writeCachedSession(profile, token);
}
