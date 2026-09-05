import Link from "next/link";
import type { Grave } from "@/lib/cemetery";
import { formatRetiredOn, formatWords } from "@/lib/cemetery";

type GraveStoneProps = {
  grave: Grave;
  featured?: boolean;
  href?: string;
};

function stoneKind(slug: string) {
  let hash = 0;
  for (let i = 0; i < slug.length; i += 1) {
    hash = (hash * 33) ^ slug.charCodeAt(i);
  }
  return (Math.abs(hash) % 3) as 0 | 1 | 2;
}

export function GraveStone({ grave, featured = false, href }: GraveStoneProps) {
  const inner = (
    <article
      className={`monument monument--${stoneKind(grave.slug)} ${featured ? "monument--lead" : ""}`}
    >
      <div className="monument__tablet">
        <div className="monument__face">
          <h3 className="monument__name">{grave.display_name}</h3>
          <p className="monument__date">{formatRetiredOn(grave.retired_on)}</p>
          <span className="monument__rule" aria-hidden />
          <p className="monument__words">{formatWords(grave.words)}</p>
          {grave.epitaph ? <p className="monument__epitaph">{grave.epitaph}</p> : null}
        </div>
      </div>
      <div className="monument__plinth" aria-hidden>
        <span className="monument__plinth-cap" />
        <span className="monument__plinth-base" />
      </div>
    </article>
  );

  if (!href) return inner;

  return (
    <Link
      href={href}
      className="monument-link group block outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)] focus-visible:ring-offset-4"
    >
      {inner}
    </Link>
  );
}
