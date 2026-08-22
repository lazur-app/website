"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { HOMEPAGE_FAQ } from "@/lib/seo/faq";

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="landing-container scroll-mt-24 py-16 md:py-24">
      <div className="grid gap-10 border-t border-[var(--border)] pt-12 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:gap-16 md:pt-16">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--foreground-faint)]">
            FAQ
          </p>
          <h2 className="mt-3 font-display text-[1.75rem] font-semibold tracking-tight text-[var(--foreground)] md:text-[2.5rem]">
            Straight answers.
          </h2>
        </div>

        <div className="border-t border-[var(--border)]">
          {HOMEPAGE_FAQ.map((item, i) => {
            const isOpen = open === i;
            const panelId = `faq-panel-${i}`;
            const buttonId = `faq-button-${i}`;

            return (
              <div key={item.question} className="border-b border-[var(--border)]">
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex min-h-[56px] w-full items-center justify-between gap-4 py-4 text-left"
                  >
                    <span className="font-display text-[16px] font-semibold tracking-tight text-[var(--foreground)] md:text-[17px]">
                      {item.question}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-[var(--foreground-faint)] transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      strokeWidth={2}
                      aria-hidden
                    />
                  </button>
                </h3>
                {isOpen ? (
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    className="pb-5 pr-8"
                  >
                    <p className="text-[15px] leading-relaxed text-[var(--foreground-muted)]">
                      {item.answer}
                      {item.link ? (
                        <>
                          {" "}
                          <Link
                            href={item.link.href}
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
