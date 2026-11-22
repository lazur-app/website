import Link from "next/link";
import { DownloadMacPill } from "@/components/seo-pages/Buttons";

export function BlogCta() {
  return (
    <div className="rounded-[28px] bg-[#1c1917] px-4 py-12 text-center sm:px-8 md:py-16">
      <p className="text-[1.75rem] font-bold leading-[1.1] tracking-[-0.04em] text-white md:text-[2.25rem]">
        Try Lazur free on macOS
      </p>
      <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-white/70 md:text-[16px]">
        Speak naturally. Get finished writing in any app, not just a transcript.
      </p>
      <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <DownloadMacPill href="/download" />
        <Link
          href="/pricing"
          className="text-[14px] font-bold text-white underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-white"
        >
          View pricing →
        </Link>
      </div>
    </div>
  );
}
