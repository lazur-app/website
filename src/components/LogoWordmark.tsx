import Link from "next/link";

type LogoWordmarkProps = {
  href?: string;
  className?: string;
  iconSize?: string;
  textClassName?: string;
};

export function LogoWordmark({
  href = "/",
  className = "",
  iconSize = "h-8 w-8",
  textClassName = "text-xl font-bold",
}: LogoWordmarkProps) {
  const content = (
    <>
      <img
        src="/logo.png"
        alt=""
        aria-hidden
        className={`shrink-0 object-contain transition-transform group-hover:scale-[1.03] ${iconSize}`}
      />
      <span
        className={`font-sans lowercase leading-none tracking-tight text-[var(--foreground)] ${textClassName}`}
      >
        lazur
      </span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={`group flex items-center gap-2 ${className}`}>
        {content}
      </Link>
    );
  }

  return <div className={`flex items-center gap-2 ${className}`}>{content}</div>;
}
