import type { Metadata } from "next";
import { SentenceSplits } from "@/components/landing/SentenceSplits";

/** Temporary preview page for the flowing "just say it" homepage band. Not linked from anywhere. */
export const metadata: Metadata = {
  title: "Lab: sentence splits",
  robots: { index: false, follow: false },
};

export default function SentenceSplitsLabPage() {
  return (
    <main>
      <div className="grid h-[40vh] place-items-center text-[13px] text-[var(--foreground-faint)]">scroll down</div>
      <SentenceSplits />
      <div className="h-screen" />
    </main>
  );
}
