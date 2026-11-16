import Image from "next/image";
import { TrackedLink } from "@/components/analytics/TrackedLink";

type LogoWordmarkProps = {
  href?: string;
  className?: string;
  /** Logo height in px, maps to type size on 4px grid. */
  height?: number;
  /** Analytics placement for the logo click. */
  location?: string;
};

export function LogoWordmark({
  href = "/",
  className = "",
  height = 32,
  location = "logo",
}: LogoWordmarkProps) {
  const fontSize = Math.round(height * 0.58);
  const iconSize = Math.round(height * 0.7);

  const wrapperClassName = [
    "group inline-flex shrink-0 items-center gap-1.5 leading-none",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      <Image
        src="/logo.png"
        alt=""
        width={iconSize}
        height={iconSize}
        className="shrink-0 object-contain"
        aria-hidden
      />
      <span
        className="font-sans font-bold tracking-[-0.045em] text-[var(--foreground)] transition-opacity group-hover:opacity-75"
        style={{ fontSize }}
      >
        lazur
      </span>
    </>
  );

  if (href) {
    return (
      <TrackedLink
        href={href}
        className={wrapperClassName}
        event="nav_link_clicked"
        eventProps={{ location, label: "Logo", destination: href }}
      >
        {content}
      </TrackedLink>
    );
  }

  return <div className={wrapperClassName}>{content}</div>;
}
