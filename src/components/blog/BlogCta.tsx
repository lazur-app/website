import Link from "next/link";
import { AppleIcon } from "@/components/icons/AppleIcon";
import { SoftCard } from "@/components/SoftCard";

export function BlogCta() {
  return (
    <SoftCard hover={false} className="mt-10 p-6 text-center md:p-8">
      <p className="font-display text-lg font-semibold tracking-tight text-[var(--foreground)] md:text-xl">
        Try Lazur free on macOS
      </p>
      <p className="mx-auto mt-2 max-w-md text-[14px] leading-relaxed text-[var(--foreground-muted)]">
        Speak naturally. Get finished writing in any app — not just a transcript.
      </p>
      <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link href="/download" className="btn-dark inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[14px]">
          <AppleIcon className="h-4 w-4" />
          Download for Mac
        </Link>
        <Link
          href="/pricing"
          className="text-[13px] font-medium text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground)]"
        >
          View pricing →
        </Link>
      </div>
    </SoftCard>
  );
}
