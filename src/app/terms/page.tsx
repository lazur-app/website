import type { Metadata } from "next";
import Link from "next/link";
import { LegalDocumentLayout } from "@/components/LegalDocumentLayout";

export const metadata: Metadata = {
  title: "Terms of Service | Lazur",
  description: "Terms of Service for Lazur voice-to-text on macOS.",
};

const UPDATED = "June 10, 2026";

export default function TermsPage() {
  return (
    <LegalDocumentLayout
      label="Legal"
      title="Terms of Service"
      updated={UPDATED}
      sections={[
        {
          title: "1. Acceptance of terms",
          content:
            "By downloading, accessing, or using Lazur, you agree to these Terms of Service. If you do not agree, do not use the service.",
        },
        {
          title: "2. Use of the service",
          content:
            "You may use Lazur only for lawful purposes and in compliance with these Terms. You are responsible for activity under your account and for keeping your credentials secure.",
        },
        {
          title: "3. Privacy and data",
          content: (
            <>
              Your use of Lazur is also governed by our{" "}
              <Link
                href="/privacy"
                className="font-medium text-[var(--foreground)] underline decoration-[var(--foreground)]/25 underline-offset-2 transition-colors hover:decoration-[var(--foreground)]"
              >
                Privacy Policy
              </Link>
              . By using the service, you consent to the data practices described there.
            </>
          ),
        },
        {
          title: "4. Subscriptions and billing",
          content:
            "Paid plans renew according to the billing terms shown at checkout. You may cancel through your account or billing settings. Fees are non-refundable except where required by law.",
        },
        {
          title: "5. Modifications",
          content:
            "We may update these Terms from time to time. Continued use of Lazur after changes take effect constitutes acceptance of the revised Terms.",
        },
      ]}
    />
  );
}
