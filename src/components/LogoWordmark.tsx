import Image from "next/image";
import Link from "next/link";
import navbarLogo from "../../public/lazur-transparent-logo-navbar.png";

type LogoWordmarkProps = {
  href?: string;
  className?: string;
  /** Logo height in px — default 32 (4px grid). */
  height?: number;
};

export function LogoWordmark({
  href = "/",
  className = "",
  height = 32,
}: LogoWordmarkProps) {
  const wrapperClassName = [
    "group inline-flex shrink-0 items-center leading-none",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <Image
      src={navbarLogo}
      alt="Lazur"
      height={height}
      style={{ height, width: "auto" }}
      className="object-contain transition-transform group-hover:scale-[1.02]"
      priority
    />
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
