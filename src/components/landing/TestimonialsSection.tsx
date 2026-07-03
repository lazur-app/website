"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { User } from "lucide-react";
import { HeroDownloadCta } from "@/components/HeroDownloadCta";
import { TRIAL_NOTE } from "@/lib/pricingPlans";

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company?: { label: string; href: string };
  image?: string;
  placeholder?: boolean;
};

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "I was skeptical at first because I tried other dictation apps. But genuinely, Lazur feels different — it's less about transcription and more about capturing intent. It genuinely saves me time.",
    name: "Veer Adyani",
    role: "Founder",
    company: { label: "Preffer", href: "https://preffer.me" },
    image: "/veer-img.jpeg",
  },
  {
    quote:
      "Using Lazur for 3 months now. It's one of those tools that quietly becomes part of your daily workflow — not just dictation, but Command Mode is such an underrated feature!",
    name: "Akshat Thakur",
    role: "Founder",
    company: { label: "SafeExam", href: "https://safexam.in" },
    image: "/akshat-img.jpeg",
  },
  {
    quote: "",
    name: "More coming soon",
    role: "Early Lazur users",
    placeholder: true,
  },
];

function TestimonialAvatar({ testimonial }: { testimonial: Testimonial }) {
  if (testimonial.placeholder) {
    return (
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-dashed border-[var(--border-strong)] bg-[var(--background-deep)]"
        aria-hidden
      >
        <User className="h-5 w-5 text-[var(--foreground-faint)]" strokeWidth={1.5} />
      </div>
    );
  }

  return (
    <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-[var(--border)] bg-[var(--background-deep)]">
      {testimonial.image ? (
        <Image
          src={testimonial.image}
          alt={testimonial.name}
          fill
          className="object-cover"
          sizes="44px"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <User className="h-5 w-5 text-[var(--foreground-faint)]" strokeWidth={1.5} />
        </div>
      )}
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <section className="relative -mt-[100px] px-6 pt-[140px] pb-14 md:pt-[160px] md:pb-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 text-center md:mb-10">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--foreground-faint)]">
            Early users
          </p>
          <h2 className="mt-2 font-display text-[1.75rem] font-semibold tracking-tight text-[var(--foreground)] md:text-[2.25rem]">
            Loved by people who type all day
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3 md:gap-5">
          {TESTIMONIALS.map((t, i) => (
            <motion.blockquote
              key={t.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.45 }}
              className={`flex h-full flex-col rounded-2xl border px-5 py-6 md:px-6 md:py-7 ${
                t.placeholder
                  ? "border-dashed border-[var(--border-strong)] bg-[var(--background-deep)]/40"
                  : "border-[var(--border)] bg-white/80"
              }`}
            >
              {t.placeholder ? (
                <div className="flex flex-1 flex-col items-center justify-center py-6 text-center">
                  <p className="text-[14px] font-medium text-[var(--foreground-muted)]">
                    More stories on the way
                  </p>
                  <p className="mt-2 max-w-[14rem] text-[13px] leading-relaxed text-[var(--foreground-faint)]">
                    We&apos;re collecting feedback from our early-access cohort.
                  </p>
                </div>
              ) : (
                <p className="flex-1 text-[14px] leading-relaxed text-[var(--foreground)]">
                  &ldquo;{t.quote}&rdquo;
                </p>
              )}

              <footer className="mt-5 flex items-center gap-3 border-t border-[var(--border)] pt-4">
                <TestimonialAvatar testimonial={t} />
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold text-[var(--foreground)]">
                    {t.name}
                  </p>
                  <p className="text-[12px] text-[var(--foreground-faint)]">
                    {t.role}
                    {t.company ? (
                      <>
                        {" "}
                        of{" "}
                        <Link
                          href={t.company.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-[var(--foreground-muted)] underline-offset-2 hover:text-[var(--foreground)] hover:underline"
                        >
                          {t.company.label}
                        </Link>
                      </>
                    ) : null}
                  </p>
                </div>
              </footer>
            </motion.blockquote>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center gap-3 md:mt-12">
          <HeroDownloadCta variant="minimal" />
          <p className="text-[13px] text-[var(--foreground-faint)]">
            {TRIAL_NOTE}
          </p>
        </div>
      </div>
    </section>
  );
}
