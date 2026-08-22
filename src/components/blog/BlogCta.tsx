import Link from "next/link";
import { AppleIcon } from "@/components/icons/AppleIcon";

export function BlogCta() {
  return (
    <div className="rounded-[1.5rem] bg-[var(--foreground)] px-6 py-8 text-center md:px-10 md:py-10">
      <p className="font-display text-[1.35rem] font-semibold tracking-tight text-white md:text-[1.6rem]">
        Try Lazur free on macOS
      </p>
      <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-white/70 md:text-[16px]">
        Speak naturally. Get finished writing in any app, not just a transcript.
      </p>
      <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link
          href="/download"
          className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-white px-5 text-[14px] font-semibold text-[var(--foreground)] transition-transform hover:scale-[1.02]"
        >
          <AppleIcon className="h-4 w-4" />
          Download for Mac
        </Link>
        <Link
          href="/pricing"
          className="text-[14px] font-medium text-white/70 transition-colors hover:text-white"
        >
          View pricing →
        </Link>
      </div>
    </div>
  );
}
