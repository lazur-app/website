import type { ReactNode } from "react";
import { ContentImage } from "@/components/seo-pages/ContentImage";
import { InlineText } from "@/components/seo-pages/InlineText";
import type { ContentImage as Img, ContentSection } from "@/lib/free-tools/content";

/**
 * The written part of a tool page, under the tool. Bodies use a tiny format: paragraphs split by a
 * blank line, "- " bullets, "1. " steps, and InlineText's **bold** and [links](url). Nothing else is
 * interpreted, so written content can never inject HTML.
 */
function Body({ text }: { text: string }) {
  const blocks = text.trim().split(/\n\s*\n/);
  return (
    <>
      {blocks.map((block, i) => {
        const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
        if (lines.every((l) => /^[-•]\s+/.test(l)))
          return (
            <ul key={i} className="mt-3 list-disc space-y-1.5 pl-5">
              {lines.map((l, j) => (
                <li key={j}>
                  <InlineText text={l.replace(/^[-•]\s+/, "")} />
                </li>
              ))}
            </ul>
          );
        if (lines.every((l) => /^\d+[.)]\s+/.test(l)))
          return (
            <ol key={i} className="mt-3 list-decimal space-y-1.5 pl-5">
              {lines.map((l, j) => (
                <li key={j}>
                  <InlineText text={l.replace(/^\d+[.)]\s+/, "")} />
                </li>
              ))}
            </ol>
          );
        return (
          <p key={i} className="mt-3">
            <InlineText text={lines.join(" ")} />
          </p>
        );
      })}
    </>
  );
}

export function ToolArticle({ sections, image, children }: { sections: ContentSection[]; image?: Img; children?: ReactNode }) {
  if (sections.length === 0) return null;
  return (
    // Spacing sits on a wrapper: .seo-col resets its own margins.
    <div className="pt-16 md:pt-24">
    <article className="seo-col text-[17px] leading-[1.75] text-[#3d3834]">
      {sections.map((s, i) => (
        <section key={s.heading} className={i === 0 ? "" : "mt-10"}>
          <h2 className="seo-h2">{s.heading}</h2>
          <Body text={s.body} />
          {i === 0 && image ? (
            <figure className="mt-8">
              <ContentImage src={image.src} alt={image.alt} width={image.width} height={image.height} className="w-full rounded-[20px] border-[1.5px] border-[#1c1917] object-cover" />
              <figcaption className="mt-2 text-[13px] text-[var(--foreground-faint)]">
                Photo by{" "}
                <a href={image.creditUrl} target="_blank" rel="noopener nofollow" className="underline underline-offset-2">
                  {image.credit}
                </a>{" "}
                on Pexels
              </figcaption>
            </figure>
          ) : null}
        </section>
      ))}
      {children}
    </article>
    </div>
  );
}
