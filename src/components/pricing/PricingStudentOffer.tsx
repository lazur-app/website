const STUDENT_BODY = [
  "hi [your name]",
  "",
  "[a line about you, what you're studying, why you want Lazur]",
  "",
  "my student details:",
  "school / uni:",
  "student email:",
].join("\n");

const STUDENT_MAIL = `mailto:hello@lazur.app?subject=${encodeURIComponent(
  "Lazur student offer",
)}&body=${encodeURIComponent(STUDENT_BODY)}`;

export function PricingStudentOffer({ className = "" }: { className?: string }) {
  return (
    <section
      className={`w-full rounded-2xl bg-[#1c1917] px-6 py-8 text-[#faf8f5] md:px-8 md:py-9 ${className}`.trim()}
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-lg">
          <p className="font-mono text-[12px] text-white/45">
            {"< student offer >"}
          </p>
          <p className="mt-3 text-[15px] leading-relaxed text-white/80">
            If you&apos;re a student, write me. I&apos;ll personally reach out
            and get you set up.
          </p>
        </div>
        <a
          href={STUDENT_MAIL}
          className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-white px-6 text-[14px] font-semibold text-[var(--foreground)] transition-opacity hover:opacity-90"
        >
          Reach out
        </a>
      </div>
    </section>
  );
}
