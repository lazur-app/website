"use client";

import { useRef, useState } from "react";
import { useGuideStep } from "@/lib/guide";
import Link from "next/link";
import { Plus } from "lucide-react";
import { HOMEPAGE_FAQ } from "@/lib/seo/faq";
import { useTrackInView } from "@/hooks/useTrackInView";
import { track } from "@/lib/productAnalytics";

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(null);
  const guideStep = useGuideStep("faq");
  const ref = useRef<HTMLElement>(null);
  useTrackInView(ref, "section_viewed", { section: "faq" });

  return (
    <section ref={ref} id="faq" data-guide-section="faq" className="landing-container scroll-mt-24 py-20 md:py-32">
      <div className="mx-auto max-w-3xl">
        {/* The page's section heading: lowercase display sans with one serif word. */}
        <h2 className="text-center font-display text-[clamp(2.3rem,4.6vw,4rem)] font-medium lowercase leading-[1] tracking-[-0.04em] text-[var(--foreground)]">
          questions, <span className="font-[family-name:var(--font-garamond)] text-[1.12em] font-normal italic tracking-[-0.02em]">answered</span>.
        </h2>
        <p className="mt-5 text-center text-[17px] lowercase text-[var(--foreground-muted)]">the things people ask us before they download.</p>

        <div className="mt-12 flex flex-col gap-3 md:mt-16">
          {HOMEPAGE_FAQ.map((item, i) => {
            // The page guide opens "Is it always listening…" when it points at it.
            const isOpen = open === i || (open === null && guideStep === 1 && i === 4);
            const panelId = `faq-panel-${i}`;
            const buttonId = `faq-button-${i}`;

            return (
              <div key={item.question} className={`frame-apple relative transition-colors ${isOpen ? "!bg-white" : ""}`}>
                <h3>
                  <button
                    id={buttonId}
                    data-guide={`faq-${i}`}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => {
                      track(isOpen ? "faq_closed" : "faq_opened", { question: item.question, index: i, location: "homepage" });
                      setOpen(isOpen ? null : i);
                    }}
                    className="flex min-h-[64px] w-full items-center justify-between gap-4 px-6 py-4 text-left"
                  >
                    <span className="font-display text-[17px] font-medium tracking-[-0.02em] text-[var(--foreground)] md:text-[18px]">
                      {item.question}
                    </span>
                    <span
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-full transition-[transform,background-color] duration-200 ${
                        isOpen ? "rotate-45 bg-[#0c0b0a] text-white" : "bg-[#f3f1ec] text-[var(--foreground)]"
                      }`}
                      aria-hidden
                    >
                      <Plus className="h-4 w-4" strokeWidth={2.2} />
                    </span>
                  </button>
                </h3>
                {isOpen ? (
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    className="px-6 pb-6 pr-14"
                  >
                    <p className="text-[16px] leading-relaxed text-[var(--foreground-muted)]">
                      {item.answer}
                      {item.link ? (
                        <>
                          {" "}
                          <Link
                            href={item.link.href}
                            onClick={() =>
                              track("cta_clicked", { location: "faq", label: item.link!.label, destination: item.link!.href, question: item.question })
                            }
                            className="font-medium text-[var(--foreground)] underline decoration-[var(--foreground)]/20 underline-offset-2 transition-colors hover:decoration-[var(--foreground)]"
                          >
                            {item.link.label}
                          </Link>
                        </>
                      ) : null}
                    </p>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
