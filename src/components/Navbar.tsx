"use client";

import Link from "next/link";
import Image from "next/image";
import { UserMenu } from "./UserMenu";
import { useAuth } from "@/components/AuthProvider";
import { AppleIcon } from "@/components/icons/AppleIcon";
import { track } from "@/lib/productAnalytics";

/**
 * A frosted bar across the top of the page: the logo on the left and the Mac download
 * button on the right, nothing else to click. Signed-in visitors also get their account menu.
 * Pricing, changelog and the rest are linked from the footer.
 */
export function Navbar() {
  const { user, loading, isAuthenticated } = useAuth();
  const downloadLabel = "Meet my companion";

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 md:pt-4">
      <div className="pointer-events-auto mx-auto w-full max-w-6xl rounded-[10px] border border-black/[0.07] bg-white/75 backdrop-blur-xl backdrop-saturate-150">
        <div className="flex h-16 items-center justify-between gap-6 pl-5 pr-2.5 md:h-[76px] md:pl-7 md:pr-3">
          <Link
            href="/"
            className="flex items-center gap-2"
            aria-label="Lazur home"
            onClick={() => track("nav_link_clicked", { location: "navbar", label: "Logo", destination: "/" })}
          >
            <Image src="/logo.png" alt="" width={28} height={28} />
            <span className="text-[22px] font-bold tracking-[-0.03em] text-[var(--foreground)] md:text-[24px]">lazur</span>
          </Link>

          <div className="flex items-center gap-2">
            {!loading && isAuthenticated && user ? <UserMenu user={user} /> : null}
            <Link
              href="/download"
              onClick={() => track("cta_clicked", { location: "navbar", label: downloadLabel, destination: "/download" })}
              aria-label={downloadLabel}
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-[6px] border-[1.5px] border-[#2a1c6b] bg-[#e7dfff] px-4 py-2.5 text-[15px] font-semibold text-[#1c1917] transition-colors hover:bg-[#dccfff] md:px-5 md:py-3 md:text-[16px]"
            >
              <AppleIcon className="-mt-0.5 h-3.5 w-3.5" />
              Meet my companion
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
