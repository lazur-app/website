"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  detectPerformanceTier,
  type PerformanceTier,
} from "@/lib/performanceTier";

type PerformanceTierContextValue = {
  tier: PerformanceTier;
  isReduced: boolean;
};

const PerformanceTierContext = createContext<PerformanceTierContextValue>({
  tier: "full",
  isReduced: false,
});

export function PerformanceTierProvider({ children }: { children: ReactNode }) {
  const [tier, setTier] = useState<PerformanceTier>("full");

  useEffect(() => {
    const next = detectPerformanceTier();
    setTier(next);
    document.documentElement.dataset.perfTier = next;

    return () => {
      delete document.documentElement.dataset.perfTier;
    };
  }, []);

  const value = useMemo(
    () => ({ tier, isReduced: tier === "reduced" }),
    [tier],
  );

  return (
    <PerformanceTierContext.Provider value={value}>
      {children}
    </PerformanceTierContext.Provider>
  );
}

export function usePerformanceTier(): PerformanceTierContextValue {
  return useContext(PerformanceTierContext);
}
