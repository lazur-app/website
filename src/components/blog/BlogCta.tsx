import Link from "next/link";
import { GlowCta } from "@/components/GlowCta";
import { AppleIcon } from "@/components/icons/AppleIcon";

export function BlogCta() {
  return (
    <div className="rounded-[1.5rem] bg-[var(--foreground)] px-6 py-8 text-center md:px-10 md:py-10">
      <p className="font-display text-[1.35rem] font-semibold tracking-tight text-white md:text-[1.6rem]">
        Join the Lazur waitlist
      </p>
      <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-white/70 md:text-[16px]">
        Speak naturally. Get finished writing in any app, not just a transcript.
      </p>
      <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <GlowCta href="/exclusive-access" variant="light">
          Join Waitlist
        </GlowCta>
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
