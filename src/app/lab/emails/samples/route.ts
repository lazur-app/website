import { notFound } from "next/navigation";
import {
  adminMessage,
  EMAIL_SAMPLES,
  macLink,
  notOpenedYet,
  onTheList,
  paymentFailed,
  receipt,
  senderFor,
  trialEnding,
  welcome,
  windowsWaitlist,
  type BuiltEmail,
} from "@/emails/templates";

/**
 * Every email drawn out as JSON, for the backend's test that checks its Python copy of the emails
 * (app/email_templates.py) draws exactly the same thing. Refresh the backend's fixture with:
 *   curl -s http://localhost:3000/lab/emails/samples > tests/fixtures/email_samples.json
 * Like every /lab page, this only exists under npm run dev.
 */
export function GET() {
  if (process.env.NODE_ENV === "production") notFound();
  const extra: { id: string; build: () => BuiltEmail }[] = [
    { id: "x-welcome-noname", build: () => welcome({ to: "lee@example.com" }) },
    { id: "x-welcome-escape", build: () => welcome({ to: "o@example.com", name: "  O'Brien <b>x</b> Smith", from: "aayush" }) },
    { id: "x-nudge-veer", build: () => notOpenedYet({ to: "a@example.com", name: "Ana", from: "veer" }) },
    { id: "x-trial-days", build: () => trialEnding({ to: "a@example.com", from: "veer", hoursLeft: 60 }) },
    { id: "x-trial-round", build: () => trialEnding({ to: "a@example.com", from: "aayush", hoursLeft: 36, wordsDictated: 1234567 }) },
    { id: "x-receipt-noname", build: () => receipt({ plan: "Pro", amount: "$180.00", date: "Nov 22, 2026", nextDate: "Nov 22, 2027", invoiceUrl: "https://polar.sh/x?a=1&b=2" }) },
    { id: "x-failed-noretry", build: () => paymentFailed({ plan: "Pro", amount: "$18.00" }) },
    { id: "x-windows-vaidik", build: () => windowsWaitlist({ to: "w@example.com", from: "vaidik" }) },
    { id: "x-maclink-name", build: () => macLink({ to: "m@example.com", name: "Mo", from: "aayush" }) },
    { id: "x-list-veer", build: () => onTheList({ to: "l@example.com", from: "veer" }) },
    {
      id: "x-admin-plain",
      build: () =>
        adminMessage({
          subject: "A quick note & a <question>",
          paragraphs: ["We shipped something big this week and I wanted you to hear it from us first, before anyone else.", "Line one\nline two"],
        }),
    },
  ];
  const built = [...EMAIL_SAMPLES.map((s) => ({ id: s.id, build: s.build })), ...extra].map(({ id, build }) => {
    const e = build();
    return { id, from: e.from, subject: e.subject, preheader: e.preheader, html: e.html, text: e.text };
  });
  const addresses = ["sam@example.com", "Lee@Example.com ", "a@b.co", "vaidik@lazur.app", "someone.long+tag@gmail.com", "ünï@example.com"];
  return Response.json({ emails: built, senderFor: addresses.map((a) => [a, senderFor(a)]) });
}
