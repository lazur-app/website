import Image from "next/image";
import type { SeoImage } from "@/lib/seo-pages/types";

/** Photo with keyword alt text and a visible credit (Pexels licence asks for one). */
export function ImageFigure({ image, priority = false, className = "" }: { image: SeoImage; priority?: boolean; className?: string }) {
  return (
    <figure className={`seo-figure ${className}`}>
      <div className="seo-figure__frame">
        <Image
          src={image.url}
          alt={image.alt}
          width={image.width}
          height={image.height}
          priority={priority}
          sizes="(max-width: 768px) 100vw, 720px"
          className="h-auto w-full object-cover"
        />
      </div>
      {image.caption || image.credit ? (
        <figcaption>
          {image.caption ? <span>{image.caption}</span> : null}
          {image.credit ? (
            <span className="seo-figure__credit">
              {image.caption ? " · " : ""}
              {image.credit.source === "Pexels" ? "Photo: " : ""}
              {image.credit.url ? (
                <a href={image.credit.url} rel="noopener noreferrer nofollow" target="_blank">
                  {image.credit.name}
                </a>
              ) : (
                image.credit.name
              )}
              {image.credit.source === "Pexels" ? (
                <>
                  {" on "}
                  <a href={image.credit.sourceUrl ?? "https://www.pexels.com"} rel="noopener noreferrer nofollow" target="_blank">
                    Pexels
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
