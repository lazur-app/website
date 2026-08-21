"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { HOMEPAGE_FAQ } from "@/lib/seo/faq";

export function FaqSection() {
  return (
    <section id="faq" className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center md:mb-16"
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--foreground-faint)]">
            · FAQ ·
          </p>
          <h2 className="mt-3 font-display text-[1.75rem] font-semibold tracking-tight text-[var(--foreground)] md:text-[2.75rem]">
            Straight answers.
          </h2>
        </motion.div>

        <dl className="divide-y divide-[var(--border)]">
          {HOMEPAGE_FAQ.map((item, i) => (
            <motion.div
              key={item.question}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.35, delay: i * 0.03 }}
              className="py-7 first:pt-0 last:pb-0"
            >
              <dt className="font-display text-[17px] font-semibold tracking-tight text-[var(--foreground)] md:text-[19px]">
                {item.question}
              </dt>
              <dd className="mt-2.5 text-[15px] leading-relaxed text-[var(--foreground-muted)]">
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
                    .
                  </>
                ) : null}
              </dd>
            </motion.div>
          ))}
        </dl>
      </div>
    </section>
  );
}
