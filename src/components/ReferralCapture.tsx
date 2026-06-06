"use client";

import { useEffect } from "react";
import { captureReferralFromUrl } from "@/lib/referrals";

export function ReferralCapture() {
  useEffect(() => {
    captureReferralFromUrl();
  }, []);

  return null;
}
