import { notFound } from "next/navigation";
import {
  adminMessage,
  EMAIL_SAMPLES,
  macLink,
  notOpenedYet,
  onTheList,
  paymentFailed,
  receipt,
  trialEnding,
  welcome,
  windowsWaitlist,
  type BuiltEmail,
} from "@/emails/templates";

/**
 * Every email drawn out as JSON, for the backend's test that checks its Python copy of the emails
 * (app/email_templates.py) draws exactly the same thing. Refresh the backend's fixture with:
 *   curl -s http://localhost:3000/lab/emails/samples > tests/fixtures/email_samples.json
 * Like every /lab page, this only exists under npm run dev. Every sample names its sender, because
 * a real automatic note picks one of the team at random.
 */
export function GET() {
  if (process.env.NODE_ENV === "production") notFound();
  const extra: { id: string; build: () => BuiltEmail }[] = [
    { id: "x-welcome-noname", build: () => welcome({ to: "lee@example.com", from: "veer" }) },
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
          from: "aayush",
          subject: "A quick note & a <question>",
          paragraphs: ["We shipped something big this week and I wanted you to hear it from us first, before anyone else.", "Line one\nline two"],
        }),
    },
    { id: "x-admin-lazur", build: () => adminMessage({ subject: "From the team", paragraphs: ["Hi there,", "A note from whoever runs the admin."] }) },
  ];
  const built = [...EMAIL_SAMPLES.map((s) => ({ id: s.id, build: s.build })), ...extra].map(({ id, build }) => {
    const e = build();
    return { id, from: e.from, subject: e.subject, preheader: e.preheader, html: e.html, text: e.text };
  });
  return Response.json({ emails: built });
}
