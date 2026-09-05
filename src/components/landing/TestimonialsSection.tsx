"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { User } from "lucide-react";
import { HeroDownloadCta } from "@/components/HeroDownloadCta";

type Testimonial = {
  quote: string;
  highlight?: string;
  name: string;
  role: string;
  company?: { label: string; href: string };
  image?: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "i was skeptical at first because i tried other dictation apps. but genuinely, lazur feels different.. it's less about transcription and more about capturing intent. it genuinely saves me time.",
    highlight: "capturing intent",
    name: "Veer Adyani",
    role: "Founder",
    company: { label: "Preffer", href: "https://preffer.me" },
    image: "/veer-img.jpeg",
  },
  {
    quote:
      "using lazur for 3 months now. it's one of those tools that quietly becomes part of your daily workflow. not just dictation.. intent mode is such an underrated feature.",
    highlight: "not just dictation",
    name: "Akshat Thakur",
    role: "Founder",
    company: { label: "SafeExam", href: "https://safexam.in" },
    image: "/akshat-img.jpeg",
  },
  {
    quote:
      "didn't think i'd ever use voice for work. i'm always bouncing between slack threads and figma comments. a few days with lazur and yeah.. it's just faster than typing. i barely even edit what it pastes.",
    highlight: "faster than typing",
    name: "Sloane Park",
    role: "Product Designer",
    image: "/sloane-img.jpeg",
  },
  {
    quote:
      "I use Lazur every day for 95% of what I do. I can’t see myself going back to typing.",
    highlight: "going back to typing",
    name: "Kai",
    role: "Engineer",
  },
];

function TestimonialAvatar({
  testimonial,
  size = 40,
}: {
  testimonial: Testimonial;
  size?: number;
}) {
  return (
    <div
      className="relative shrink-0 overflow-hidden rounded-full border border-[var(--border)] bg-[var(--background-deep)]"
      style={{ width: size, height: size }}
    >
      {testimonial.image ? (
        <Image
          src={testimonial.image}
          alt={testimonial.name}
          fill
          className="object-cover"
          sizes={`${size}px`}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <User className="h-4 w-4 text-[var(--foreground-faint)]" strokeWidth={1.5} />
        </div>
      )}
    </div>
  );
}

function QuoteText({
  quote,
  highlight,
}: {
  quote: string;
  highlight?: string;
}) {
  if (!highlight || !quote.includes(highlight)) {
    return <>{quote}</>;
  }

  const [before, after] = quote.split(highlight);
  return (
    <>
      {before}
      <mark className="rounded-[4px] bg-[rgba(250,204,21,0.45)] px-0.5 text-inherit">
        {highlight}
      </mark>
      {after}
    </>
  );
}

function Person({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="flex items-center gap-3">
      <TestimonialAvatar testimonial={testimonial} />
      <div className="min-w-0">
        <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--foreground)]">
          {testimonial.name}
        </p>
        <p className="text-[12px] text-[var(--foreground-faint)]">
          {testimonial.role}
          {testimonial.company ? (
            <>
              {" "}
              of{" "}
              <Link
                href={testimonial.company.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[var(--foreground-muted)] underline-offset-2 hover:text-[var(--foreground)] hover:underline"
              >
                {testimonial.company.label}
              </Link>
            </>
          ) : null}
        </p>
      </div>
    </div>
  );
}

export function TestimonialsSection() {
  const featured = TESTIMONIALS[0];
  const rest = TESTIMONIALS.slice(1);

  return (
    <section
      id="love"
      className="relative scroll-mt-24 pt-[140px] pb-24 md:pt-[160px] md:pb-28"
    >
      <div className="landing-container">
        <div className="mb-10 text-center md:mb-16">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--brand-ink)]">
            · Early users ·
          </p>
          <h2 className="mt-3 font-display text-[1.85rem] font-semibold tracking-tight text-[var(--foreground)] md:text-[3rem]">
            Nobody goes <em className="italic font-medium">back</em> to typing
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3 md:gap-5">
          <motion.blockquote
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="flex flex-col rounded-[1.25rem] bg-[#f6e9a8] px-5 py-6 md:col-span-2 md:rounded-[1.5rem] md:px-8 md:py-8"
          >
            <p className="flex-1 font-display text-[1.2rem] leading-snug tracking-tight text-[var(--foreground)] md:text-[1.45rem]">
              &ldquo;
              <QuoteText quote={featured.quote} highlight={featured.highlight} />
              &rdquo;
            </p>
            <footer className="mt-8">
              <Person testimonial={featured} />
            </footer>
          </motion.blockquote>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.06, duration: 0.45 }}
            className="flex flex-col justify-between rounded-[1.25rem] bg-[var(--foreground)] px-5 py-6 text-[var(--background)] md:rounded-[1.5rem] md:px-7 md:py-7"
          >
            <div>
              <span
                className="mb-5 inline-block h-2.5 w-8 rounded-full bg-[rgba(250,204,21,0.9)]"
                aria-hidden
              />
              <p className="font-display text-[1.35rem] font-semibold tracking-tight md:text-[1.5rem]">
                Lazur gets it done.
              </p>
            </div>
            <Link
              href="/download"
              className="mt-8 text-[13px] font-semibold uppercase tracking-[0.08em] text-[rgba(250,204,21,0.95)] transition-opacity hover:opacity-80"
            >
              Try it free →
            </Link>
          </motion.div>

          {rest.map((t, i) => (
            <motion.blockquote
              key={t.name}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 + i * 0.06, duration: 0.45 }}
              className="flex flex-col rounded-[1.25rem] bg-white px-5 py-6 shadow-[0_12px_40px_rgba(28,25,23,0.06)] md:rounded-[1.5rem] md:px-6 md:py-8"
            >
              <p className="flex-1 text-[15px] leading-relaxed text-[var(--foreground)]">
                &ldquo;
                <QuoteText quote={t.quote} highlight={t.highlight} />
                &rdquo;
              </p>
              <footer className="mt-6">
                <Person testimonial={t} />
              </footer>
            </motion.blockquote>
          ))}
        </div>

        <div className="mt-10 flex justify-center md:mt-14">
          <HeroDownloadCta variant="minimal" className="w-full max-w-sm sm:w-auto" />
        </div>
      </div>
    </section>
  );
}
