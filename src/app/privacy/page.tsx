import type { Metadata } from "next";
import Link from "next/link";
import { LegalDocumentLayout } from "@/components/LegalDocumentLayout";

export const metadata: Metadata = {
  title: "Privacy Policy | Lazur",
  description: "How Lazur handles your data, voice input, and account information.",
};

const UPDATED = "June 10, 2026";

export default function PrivacyPage() {
  return (
    <LegalDocumentLayout
      label="Legal"
      title="Privacy Policy"
      updated={UPDATED}
      sections={[
        {
          title: "1. Information we collect",
          content:
            "We collect account information you provide (such as email and name), usage data needed to operate the service (including word counts and subscription status), and voice or text you submit for transcription and polishing when you use Lazur.",
        },
        {
          title: "2. How we use information",
          content:
            "We use this information to provide and improve Lazur, process subscriptions, support your account, and maintain service reliability. We do not sell your personal data.",
        },
        {
          title: "3. Voice and text processing",
          content:
            "Speech and text you dictate may be processed to deliver polished output at your cursor. Processing may involve secure third-party providers where necessary to run the service. We aim to minimize retention of raw audio beyond what is required to complete your request.",
        },
        {
          title: "4. Data security",
          content:
            "We use industry-standard safeguards to protect your data in transit and at rest. No method of transmission over the internet is completely secure; we work to reduce risk through encryption, access controls, and monitoring.",
        },
        {
          title: "5. Third-party sharing",
          content:
            "We share data with service providers only when needed to operate Lazur (for example, authentication, billing, or infrastructure). Those providers are bound by contractual obligations to protect your data.",
        },
        {
          title: "6. Your choices",
          content: (
            <>
              You may access, update, or delete account information from your dashboard where available. For privacy questions, contact us through the channels listed on our website. See also our{" "}
              <Link
                href="/terms"
                className="font-medium text-[var(--foreground)] underline decoration-[var(--foreground)]/25 underline-offset-2 transition-colors hover:decoration-[var(--foreground)]"
              >
                Terms of Service
              </Link>
              .
            </>
          ),
        },
      ]}
    />
  );
}
