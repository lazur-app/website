"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
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
  const [user, setUser] = useState<UserProfile | null>(() => getCachedUser());
  const [loading, setLoading] = useState(
    () => hasValidSessionToken() && !getCachedUser(),
  );

  const refresh = useCallback(async (options?: { force?: boolean }) => {
    if (!hasValidSessionToken()) {
      clearSession();
      setUser(null);
      setLoading(false);
      return null;
    }

    if (!options?.force) {
      const cached = getCachedUser();
      if (cached) {
        setUser(cached);
        setLoading(false);
        return cached;
      }
    }

    setLoading(true);
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
