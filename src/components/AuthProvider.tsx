"use client";
import { identifyUser } from "@/lib/productAnalytics";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  clearSession,
  fetchMe,
  getCachedUser,
  hasValidSessionToken,
  type UserProfile,
} from "@/lib/auth";

type AuthContextValue = {
  user: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  refresh: (options?: { force?: boolean }) => Promise<UserProfile | null>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Start from what the server rendered, then load the cached session before first paint (no hydration mismatch).
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);

  useLayoutEffect(() => {
    if (!hasValidSessionToken()) return;
    const cached = getCachedUser();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage is only readable after hydration
    setUser(cached);
    setLoading(!cached);
  }, []);

  // Link this browser's analytics to the account (same id as the app), so web → app funnels connect.
  useEffect(() => {
    if (user?.id) identifyUser(String(user.id));
  }, [user?.id]);

  const refresh = useCallback(async (options?: { force?: boolean }) => {
    if (!hasValidSessionToken()) {
      clearSession();
      setUser(null);
      setLoading(false);
      return null;
    }

    const cached = getCachedUser();
    if (!options?.force && cached) {
      setUser(cached);
      setLoading(false);
      return cached;
    }

    if (!cached) {
      setLoading(true);
    }
    const profile = await fetchMe(options);
    setUser(profile);
    setLoading(false);
    return profile;
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      if (!hasValidSessionToken()) {
        if (!cancelled) {
          setUser(null);
          setLoading(false);
        }
        return;
      }

      const cached = getCachedUser();
      if (cached) {
        if (!cancelled) {
          setUser(cached);
          setLoading(false);
        }
        return;
      }

      const profile = await fetchMe();
      if (!cancelled) {
        setUser(profile);
        setLoading(false);
      }
    }

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: !!user,
      refresh,
    }),
    [user, loading, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
