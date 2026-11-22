import { HandUnderline } from "@/components/buddy/HandLoop";

const RED = "#e11d48";

/**
 * A page title with one short phrase underlined by hand in red, like the homepage and /download.
 * When `accent` is missing or not in the title, the title renders plain.
 */
export function AccentTitle({ title, accent }: { title: string; accent?: string }) {
  const at = accent ? title.indexOf(accent) : -1;
  if (!accent || at < 0) return <>{title}</>;
  return (
    <>
      {title.slice(0, at)}
      <span className="relative inline-block whitespace-nowrap">
        {accent}
        <HandUnderline show color={RED} delay={0.4} duration={0.9} offset={2} />
      </span>
      {title.slice(at + accent.length)}
    </>
  );
}
