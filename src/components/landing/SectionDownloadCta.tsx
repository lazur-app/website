import { HeroDownloadCta } from "@/components/HeroDownloadCta";

type SectionDownloadCtaProps = {
  note?: string;
  className?: string;
};

/** Inline download CTA — lives at the bottom of a landing section, not between sections. */
export function SectionDownloadCta({ note, className = "" }: SectionDownloadCtaProps) {
  return (
    <div
      className={`mt-10 flex flex-col items-center gap-3 md:mt-12 ${className}`}
    >
      <HeroDownloadCta />
      {note ? (
        <p className="max-w-md text-center text-[13px] leading-relaxed text-[var(--foreground-faint)]">
          {note}
        </p>
      ) : null}
    </div>
  );
}
