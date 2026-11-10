import type { SeoImage } from "@/lib/seo-pages/types";
import { ContentImage } from "./ContentImage";

/** Photo with keyword alt text. No caption or credit under it: credits are one line at the page end (PhotoCredits). */
export function ImageFigure({ image, priority = false, className = "" }: { image: SeoImage; priority?: boolean; className?: string }) {
  return (
    <figure className={`seo-figure ${className}`}>
      <div className="seo-figure__frame">
        <ContentImage src={image.url} alt={image.alt} width={image.width} height={image.height} priority={priority} className="h-auto w-full object-cover" />
      </div>
    </figure>
  );
}
