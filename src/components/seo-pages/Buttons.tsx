import Link from "next/link";
import type { ReactNode } from "react";
import { AppleIcon } from "@/components/icons/AppleIcon";

/**
 * The homepage's buttons for the SEO pages and blog. Primary: white pill, ink outline, flat offset
 * shadow, lifts 2px on hover (like DownloadPill on /download). Secondary: solid near-black pill.
 */
export const INK_PILL =
  "inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border-[1.5px] border-[#1c1917] bg-white px-6 text-[15px] font-bold tracking-[-0.02em] text-[#1c1917] shadow-[0_2px_0_rgba(28,25,23,0.9),0_10px_24px_-8px_rgba(28,25,23,0.18)] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_0_rgba(28,25,23,0.9),0_16px_30px_-10px_rgba(28,25,23,0.24)] active:translate-y-0.5 active:shadow-[0_0_0_rgba(28,25,23,0.9)]";

export const DARK_PILL =
  "inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[#1c1917] px-6 text-[15px] font-bold tracking-[-0.02em] text-white transition-colors hover:bg-black";

/** "Download for Mac" as the primary white pill. */
export function DownloadMacPill({ href, size = "md", children }: { href: string; size?: "md" | "lg"; children?: ReactNode }) {
  const big = size === "lg" ? "!min-h-[56px] !px-8 !text-[17px]" : "";
  return (
    <Link href={href} className={`${INK_PILL} ${big}`}>
      <AppleIcon className={size === "lg" ? "h-5 w-5" : "h-4 w-4"} />
      {children ?? "Download for Mac"}
    </Link>
  );
}
