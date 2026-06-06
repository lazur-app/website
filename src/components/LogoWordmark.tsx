import Link from "next/link";

type LogoWordmarkProps = {
  href?: string;
  className?: string;
  /** Text size (icon scales to ~1.35× this em height). */
  textClassName?: string;
};

export function LogoWordmark({
  href = "/",
  className = "",
  textClassName = "text-xl",
}: LogoWordmarkProps) {
  const wrapperClassName = [
    "group inline-flex items-center gap-[0.32em] leading-none",
    textClassName,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      <span
        className="flex h-[1em] w-[1.05em] shrink-0 items-center justify-center"
        aria-hidden
      >
        <img
          src="/logo.png"
          alt=""
          className="block max-h-full max-w-full object-contain transition-transform group-hover:scale-[1.03]"
        />
      </span>
      <span className="font-sans text-[1em] font-extrabold lowercase tracking-tight text-[var(--foreground)]">
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
