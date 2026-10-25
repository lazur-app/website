"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { AuthProvider } from "@/components/AuthProvider";
import { startProductAnalytics, trackPageview } from "@/lib/productAnalytics";

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  useEffect(() => {
    startProductAnalytics();
  }, []);
  useEffect(() => {
    if (pathname) trackPageview(pathname);
  }, [pathname]);
  return <AuthProvider>{children}</AuthProvider>;
}
