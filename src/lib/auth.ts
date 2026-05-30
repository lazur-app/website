const ACCESS_TOKEN_KEY = "lazur_access_token";
const REFRESH_TOKEN_KEY = "lazur_refresh_token";

export type UserProfile = {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  plan: string;
  word_quota_limit: number;
  word_quota_used: number;
  onboarding_completed: boolean;
};

function apiBase() {
  return process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:8000";
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
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
}

export function clearTokens() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function startOAuth(provider: "google" | "github", source: "web" | "desktop") {
  const backendUrl = apiBase();
  window.location.href = `${backendUrl}/auth/login/${provider}?source=${source}`;
}

export async function fetchMe(): Promise<UserProfile | null> {
  const token = getAccessToken();
  if (!token) return null;

  const res = await fetch(`${apiBase()}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    if (res.status === 401) clearTokens();
    return null;
  }

  return res.json();
}

export function logout() {
  clearTokens();
  window.location.href = "/";
}
