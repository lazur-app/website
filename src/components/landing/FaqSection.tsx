"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { AppleIcon } from "@/components/icons/AppleIcon";

const FAQ = [
  {
    q: "Does it work in every app?",
    a: "Yes — lazur is system-wide. It pastes at your cursor in Slack, email, IDEs, browsers, and docs. One hotkey: ⌃ Space.",
  },
  {
    q: "Is my voice sent to the cloud?",
    a: "Speech-to-text runs locally on your Mac (Whisper). Cloud AI is used only for Smart Rewrite polish when you enable it.",
  },
  {
    q: "What permissions do I need?",
    a: "Microphone and Accessibility. We guide you through both on first launch.",
  },
  {
    q: "Is there a free tier?",
    a: "Yes — start free with 5,000 words per month.",
    link: { href: "/pricing", label: "View pricing" },
  },
  {
    q: "Windows?",
    a: "Coming soon. macOS is available now.",
  },
] as const;

export function FaqSection() {
  return (
    <section id="faq" className="px-6 py-16 md:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-4 lg:sticky lg:top-28 lg:self-start"
          >
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--foreground-faint)]">
              FAQ
            </p>
            <h2 className="mt-2 font-display text-[1.75rem] font-semibold tracking-tight text-[var(--foreground)] md:text-[2.25rem]">
              Straight answers.
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-[var(--foreground-muted)]">
              Privacy, permissions, pricing — the stuff you&apos;d ask before
              installing anything on your Mac.
            </p>
            <Link
              href="/download"
              className="btn-dark mt-8 inline-flex items-center gap-2 px-6 text-[14px]"
            >
              <AppleIcon />
              Download for Mac
            </Link>
          </motion.div>

          <div className="lg:col-span-8">
            <dl className="divide-y divide-[var(--border)]">
              {FAQ.map((item, i) => (
                <motion.div
                  key={item.q}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-20px" }}
                  transition={{ duration: 0.35, delay: i * 0.04 }}
                  className="py-6 first:pt-0 last:pb-0"
                >
                  <dt className="font-display text-[17px] font-semibold tracking-tight text-[var(--foreground)] md:text-[18px]">
                    {item.q}
                  </dt>
                  <dd className="mt-2 max-w-xl text-[14px] leading-relaxed text-[var(--foreground-muted)]">
                    {item.a}
                    {"link" in item && item.link ? (
                      <>
                        {" "}
                        <Link
                          href={item.link.href}
                          className="font-medium text-[var(--brand-ink)] underline decoration-[var(--brand)]/30 underline-offset-2 transition-colors hover:text-[var(--brand)]"
                        >
                          {item.link.label}
                        </Link>
                        .
                      </>
                    ) : null}
                  </dd>
                </motion.div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
