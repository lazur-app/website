"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchMe, getAccessToken, type UserProfile } from "@/lib/auth";

export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!getAccessToken()) {
      setUser(null);
      setLoading(false);
      return null;
    }

    setLoading(true);
    const profile = await fetchMe();
    setUser(profile);
    setLoading(false);
    return profile;
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    user,
    loading,
    isAuthenticated: !!user,
    refresh,
  };
}
