"use client";

import { useEffect, useState } from "react";
import type { PricingRegion } from "@/lib/pricingPlans";

type PricingRegionResponse = {
  country: string;
  region: PricingRegion;
};

export function usePricingRegion() {
  const [region, setRegion] = useState<PricingRegion>("international");
  const [country, setCountry] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/pricing-region")
      .then((res) => res.json() as Promise<PricingRegionResponse>)
      .then((data) => {
        if (cancelled) return;
        setRegion(data.region === "india" ? "india" : "international");
        setCountry(data.country);
      })
      .catch(() => {
        if (!cancelled) setRegion("international");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { region, country, loading };
}
