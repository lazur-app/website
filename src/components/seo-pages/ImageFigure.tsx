import { ContentImage } from "./ContentImage";
import type { SeoImage } from "@/lib/seo-pages/types";

/** Photo with keyword alt text and a visible credit: "Image by <user> from Pixabay". */
export function ImageFigure({ image, priority = false, className = "" }: { image: SeoImage; priority?: boolean; className?: string }) {
  return (
    <figure className={`seo-figure ${className}`}>
      <div className="seo-figure__frame">
        <ContentImage src={image.url} alt={image.alt} width={image.width} height={image.height} priority={priority} className="h-auto w-full object-cover" />
      </div>
      {image.caption || image.credit ? (
        <figcaption>
          {image.caption ? <span>{image.caption}</span> : null}
          {image.credit ? (
            <span className="seo-figure__credit">
              {image.caption ? " · " : ""}
              {image.credit.source === "Pixabay" ? "Image by " : ""}
              {image.credit.url ? (
                <a href={image.credit.url} rel="noopener noreferrer nofollow" target="_blank">
                  {image.credit.name}
                </a>
              ) : (
                image.credit.name
              )}
              {image.credit.source === "Pixabay" ? (
                <>
                  {" from "}
                  <a href={image.credit.sourceUrl ?? "https://pixabay.com"} rel="noopener noreferrer nofollow" target="_blank">
                    Pixabay
                  </a>
                </>
              ) : null}
            </span>
          ) : null}
        </figcaption>
      ) : null}
    </figure>
  );
}
