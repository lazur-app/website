import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Exclusive access — Lazur",
  description:
    "Request exclusive access to Lazur. We're building something new — leave your email and we'll reach out.",
};

export default function ExclusiveAccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
