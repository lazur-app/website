"use client";

import { useEffect } from "react";
import { captureReferralFromUrl } from "@/lib/waitlist";

export function ReferralCapture() {
  useEffect(() => {
    captureReferralFromUrl();
  }, []);

  return null;
}
