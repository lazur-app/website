import type { Metadata } from "next";
import type { ReactNode } from "react";
import { TrackedAnchor, TrackedLink } from "@/components/analytics/TrackedLink";
import { LegalDocumentLayout } from "@/components/LegalDocumentLayout";

export const metadata: Metadata = {
  title: "Support | Lazur",
  description:
    "Get help with Lazur for Mac and the Lazur Chrome extension: setup, permissions, billing, and how to reach us.",
};

const UPDATED = "October 26, 2026";
const CONTACT = "hello@lazur.app";

const linkClass =
  "font-medium text-[var(--foreground)] underline decoration-[var(--foreground)]/25 underline-offset-4";

function List({ items }: { items: ReactNode[] }) {
  return (
    <ul className="mt-3 list-disc space-y-2 pl-6 marker:text-[var(--foreground)]">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

export default function SupportPage() {
  return (
    <LegalDocumentLayout
      label="Help"
      title="Support"
      updated={UPDATED}
      intro={
        <>
          Stuck, found a bug, or have a question about your plan? Email{" "}
          <TrackedAnchor
            href={`mailto:${CONTACT}`}
            event="support_contact_clicked"
            eventProps={{ channel: "email", location: "support_page" }}
            className={linkClass}
          >
            {CONTACT}
          </TrackedAnchor>{" "}
          and a real person will reply, usually within a day. You can also send
          feedback from the Lazur app on your Mac.
        </>
      }
      sections={[
        {
          title: "Getting started on your Mac",
          content: (
            <List
              items={[
                <>
                  Download Lazur from the{" "}
                  <TrackedLink
                    href="/download"
                    eventProps={{ location: "support_page", label: "download page", destination: "/download" }}
                    className={linkClass}
                  >
                    download page
                  </TrackedLink>
                  , open it and sign in with Google from the notch.
                </>,
                "Lazur asks for Microphone, Accessibility and Screen Recording. If a step doesn't work, check those in System Settings → Privacy & Security, then quit and reopen Lazur.",
                "Hold fn to dictate anywhere. Hold your command shortcut to ask about your screen. Settings → General → Restart onboarding walks you through it again.",
              ]}
            />
          ),
        },
        {
          title: "The Chrome extension",
          content: (
            <List
              items={[
                "The extension lets Lazur's background jobs work in Chrome, in their own \"Lazur\" tab group, so you can watch every step.",
                "It only talks to the Lazur app on your own Mac (127.0.0.1). If the toolbar icon says Lazur isn't open, open the Mac app and Chrome reconnects on its own.",
                "It never reads your passwords. When a site needs you to sign in or confirm something, Lazur asks you to step in.",
                <>
                  What the extension can access is described in our{" "}
                  <TrackedLink
                    href="/privacy#extension"
                    event="nav_link_clicked"
                    eventProps={{ location: "support_page", label: "Privacy Policy", destination: "/privacy#extension" }}
                    className={linkClass}
                  >
                    Privacy Policy
                  </TrackedLink>
                  .
                </>,
              ]}
            />
          ),
        },
        {
          title: "Plans and billing",
          content: (
            <List
              items={[
                "Your 3-day Pro trial starts the first time you use the Mac app.",
                <>
                  Plans and prices are on the{" "}
                  <TrackedLink
                    href="/pricing"
                    eventProps={{ location: "support_page", label: "pricing page", destination: "/pricing" }}
                    className={linkClass}
                  >
                    pricing page
                  </TrackedLink>
                  . You can manage or cancel your subscription from your account
                  dashboard.
                </>,
                `Billing question or refund request? Email ${CONTACT} from the address you signed up with.`,
              ]}
            />
          ),
        },
        {
          title: "Reporting a bug",
          content: (
            <p>
              Tell us what you did, what you expected and what happened, plus
              your macOS version and Lazur version (shown in Lazur&apos;s Settings). Please
              don&apos;t send passwords or other sensitive information.
            </p>
          ),
        },
      ]}
    />
  );
}
