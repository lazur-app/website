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
    "group inline-flex items-end gap-[0.35em]",
    textClassName,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      <img
        src="/logo.png"
        alt=""
        aria-hidden
        className="h-[1.35em] w-auto shrink-0 object-contain transition-transform group-hover:scale-[1.03]"
      />
      <span className="font-sans text-[1em] font-extrabold lowercase leading-none tracking-tight text-[var(--foreground)]">
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
