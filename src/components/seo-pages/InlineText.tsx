import Link from "next/link";
import { Fragment, type ReactNode } from "react";

/**
 * Renders the tiny inline markup generated copy may use: [text](/path or https://…) and **bold**.
 * Keyboard shortcuts written in text ("⌘ + T", "⇧ 1", "⌘⌥P") become keycap chips.
 * Nothing else is interpreted, so generated text can never inject HTML.
 */
const KEYS = /((?:[⌘⌥⌃⇧]\s?\+?\s?)+(?:[A-Z0-9]\b|Space|Tab|Return|Enter|Esc|Delete|[+\-=↑↓←→])?)/g;

function keycaps(text: string, keyBase: number): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  KEYS.lastIndex = 0;
  while ((m = KEYS.exec(text))) {
    if (m.index > last) out.push(<Fragment key={`${keyBase}-t${i++}`}>{text.slice(last, m.index)}</Fragment>);
    const parts = m[1].replace(/\s*\+\s*/g, " ").trim().split(/\s+|(?<=[⌘⌥⌃⇧])(?=\S)/).filter(Boolean);
    out.push(
      <span key={`${keyBase}-k${i++}`} className="seo-keys">
        {parts.map((p, j) => (
          <kbd key={j} className="seo-kbd">
            {p}
          </kbd>
        ))}
      </span>,
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(<Fragment key={`${keyBase}-t${i++}`}>{text.slice(last)}</Fragment>);
  return out;
}

export function InlineText({ text }: { text: string }) {
  const out: ReactNode[] = [];
  const re = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(...keycaps(text.slice(last, m.index), i++));
    if (m[1] && m[2]) {
      const href = m[2];
      if (href.startsWith("/")) {
        out.push(
          <Link key={`l${i++}`} href={href} className="seo-link">
            {m[1]}
          </Link>,
        );
      } else if (/^https?:\/\//.test(href)) {
        out.push(
          <a key={`l${i++}`} href={href} className="seo-link" rel="noopener noreferrer" target="_blank">
            {m[1]}
          </a>,
        );
      } else {
        out.push(<Fragment key={`l${i++}`}>{m[1]}</Fragment>);
      }
    } else if (m[3]) {
      out.push(
        <strong key={`b${i++}`} className="font-semibold text-[var(--foreground)]">
          {m[3]}
        </strong>,
      );
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(...keycaps(text.slice(last), i++));
  return <>{out}</>;
}
