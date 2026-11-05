import Link from "next/link";
import { Fragment, type ReactNode } from "react";

/**
 * Renders the tiny inline markup generated copy may use: [text](/path or https://…) and **bold**.
 * Nothing else is interpreted, so generated text can never inject HTML.
 */
export function InlineText({ text }: { text: string }) {
  const out: ReactNode[] = [];
  const re = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(<Fragment key={i++}>{text.slice(last, m.index)}</Fragment>);
    if (m[1] && m[2]) {
      const href = m[2];
      if (href.startsWith("/")) {
        out.push(
          <Link key={i++} href={href} className="seo-link">
            {m[1]}
          </Link>,
        );
      } else if (/^https?:\/\//.test(href)) {
        out.push(
          <a key={i++} href={href} className="seo-link" rel="noopener noreferrer" target="_blank">
            {m[1]}
          </a>,
        );
      } else {
        out.push(<Fragment key={i++}>{m[1]}</Fragment>);
      }
    } else if (m[3]) {
      out.push(
        <strong key={i++} className="font-semibold text-[var(--foreground)]">
          {m[3]}
        </strong>,
      );
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(<Fragment key={i++}>{text.slice(last)}</Fragment>);
  return <>{out}</>;
}
