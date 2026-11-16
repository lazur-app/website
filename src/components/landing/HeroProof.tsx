"use client";

import { TESTIMONIALS, TestimonialAvatar } from "@/components/landing/TestimonialsSection";
import { track } from "@/lib/productAnalytics";

const FACES = TESTIMONIALS.filter((t) => t.image).slice(0, 3);
/** Verbatim from Akshat's testimonial below on the page. */
const QUOTE = { text: "it feels like having a smart teammate in every app.", name: "Akshat Thakur", role: "Founder, SafeExam" };

/** Proof by the hero button: early users' faces and one real line from the testimonials section. */
export function HeroProof({ className = "" }: { className?: string }) {
  return (
    <a
      href="#love"
      onClick={() => track("cta_clicked", { location: "hero_proof", label: "Early user quote", destination: "#love" })}
      className={`group inline-flex max-w-[22rem] items-center gap-3 text-left sm:max-w-none ${className}`.trim()}
    >
      <span className="flex shrink-0 -space-x-2" aria-hidden>
        {FACES.map((t) => (
          <span key={t.name} className="rounded-full ring-2 ring-[var(--background)]">
            <TestimonialAvatar testimonial={t} size={30} />
          </span>
        ))}
      </span>
      <span className="text-[13px] leading-snug text-[var(--foreground-muted)]">
        <span className="text-[var(--foreground)]">&ldquo;{QUOTE.text}&rdquo;</span>{" "}
        <span className="whitespace-nowrap text-[var(--foreground-faint)] group-hover:underline group-hover:underline-offset-2">
          {QUOTE.name}, {QUOTE.role}
        </span>
      </span>
    </a>
  );
}
