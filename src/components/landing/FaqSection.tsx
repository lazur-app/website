"use client";

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
    a: "Yes — start free with 5,000 words per month. Upgrade anytime on the pricing page.",
  },
  {
    q: "Windows?",
    a: "Coming soon. macOS is available now.",
  },
] as const;

export function FaqSection() {
  return (
    <section id="faq" className="px-6 py-16 md:py-20">
      <div className="mx-auto max-w-xl">
        <h2 className="text-center font-display text-[1.75rem] font-semibold tracking-tight text-[var(--foreground)] md:text-2xl">
          FAQ
        </h2>
        <div className="mt-8 divide-y divide-[var(--border)]">
          {FAQ.map((item) => (
            <details key={item.q} className="group py-4">
              <summary className="cursor-pointer list-none text-[15px] font-semibold text-[var(--foreground)] [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between gap-4">
                  {item.q}
                  <span className="text-[var(--foreground-faint)] transition-transform group-open:rotate-45">
                    +
                  </span>
                </span>
              </summary>
              <p className="mt-3 text-[14px] leading-relaxed text-[var(--foreground-muted)]">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
