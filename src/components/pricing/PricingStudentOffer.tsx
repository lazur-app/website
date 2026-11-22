import { TrackedAnchor } from "@/components/analytics/TrackedLink";

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
      className={`w-full rounded-[28px] border-[1.5px] border-[#1c1917] bg-white px-6 py-8 text-[var(--foreground)] shadow-[0_2px_0_rgba(28,25,23,0.9),0_10px_24px_-8px_rgba(28,25,23,0.18)] md:px-8 ${className}`.trim()}
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-lg">
          <span className="inline-flex rounded-full bg-[#5b4bd6] px-3 py-1 text-[12px] font-bold text-white">
            Student offer
          </span>
          <p className="mt-4 text-[17px] font-medium leading-relaxed text-[var(--foreground)]">
            If you&apos;re a student, write me. I&apos;ll personally reach out
            and get you set up.
          </p>
        </div>
        <TrackedAnchor
          href={STUDENT_MAIL}
          event="student_offer_clicked"
          eventProps={{ location: "pricing_page", channel: "email", label: "Email for the student offer" }}
          className="inline-flex min-h-[52px] shrink-0 items-center justify-center rounded-full bg-[#1c1917] px-6 text-[15px] font-bold text-white transition-colors hover:bg-black"
        >
          Email for the student offer
        </TrackedAnchor>
      </div>
    </section>
  );
}
