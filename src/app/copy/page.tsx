import type { Metadata } from "next";
import { CopyCode } from "./CopyCode";

export const metadata: Metadata = {
  title: "Copy your code",
  robots: { index: false, follow: false },
};

/** Opened by the "Copy code" button in a sign-up or sign-in email. */
export default function CopyPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[var(--background)] px-5 text-center">
      <p className="mb-6 font-sans text-[28px] font-extrabold tracking-[-0.05em] text-[var(--foreground)]">lazur</p>
      <CopyCode />
    </main>
  );
}
