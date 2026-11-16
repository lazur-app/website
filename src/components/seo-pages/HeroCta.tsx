"use client";

import { SendMacLink } from "@/components/download/SendMacLink";
import { GlowCta } from "@/components/GlowCta";
import { AppleIcon } from "@/components/icons/AppleIcon";
import { useIsMacVisitor } from "@/hooks/useIsMacVisitor";
import { CTA_REDUCERS } from "./ctaCopy";

/**
 * First-screen CTA row under the hero intro. Mac visitors (and the server render) get the download
 * button; phone, Windows and Linux visitors get "Email me the Mac link" instead, since they can't
 * install a Mac app where they are. Clicks are classified as `content_cta_clicked` / `hero` by
 * ContentClickTracker via the `.seo-herocta` class.
 */
export function HeroCta({ label, suffix, href }: { label: string; suffix?: string; href: string }) {
  const isMac = useIsMacVisitor();
  return (
    <div className="seo-herocta mt-6" data-cta-location="hero">
      {isMac === false ? (
        <>
          <p className="mb-2.5 text-[14px] font-medium text-[var(--foreground)]">Lazur is a Mac app. Send yourself the download link.</p>
          <SendMacLink location="seo_hero" variant="inline" />
        </>
      ) : (
        <GlowCta href={href} wrapClassName="final-cta-btn-wrap--subtle">
          <AppleIcon className="h-4 w-4" />
          <span>
            {label}
            {suffix ? <span className="hidden sm:inline"> — {suffix}</span> : null}
          </span>
        </GlowCta>
      )}
      <p className="mt-2.5 text-[13px] text-[var(--foreground-muted)]">{CTA_REDUCERS}</p>
    </div>
  );
}
