import Image from "next/image";
import Link from "next/link";

type LogoWordmarkProps = {
  href?: string;
  className?: string;
  /** Logo height in px — maps to type size on 4px grid. */
  height?: number;
};

export function LogoWordmark({
  href = "/",
  className = "",
  height = 32,
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
      <Link href={href} className={wrapperClassName}>
        {content}
      </Link>
    );
  }

  return <div className={wrapperClassName}>{content}</div>;
}
