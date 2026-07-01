import type { BlogBlock } from "@/lib/blog";

function renderBlock(block: BlogBlock, index: number) {
  switch (block.type) {
    case "paragraph":
      return (
        <p
          key={index}
          className="text-[15px] leading-[1.75] text-[var(--foreground-muted)] md:text-base"
        >
          {block.text}
        </p>
      );
    case "heading": {
      const Tag = block.level === 3 ? "h3" : "h2";
      const className =
        block.level === 3
          ? "font-display text-[17px] font-semibold tracking-tight text-[var(--foreground)] md:text-lg"
          : "font-display text-xl font-semibold tracking-tight text-[var(--foreground)] md:text-[1.35rem]";
      return (
        <Tag key={index} className={className}>
          {block.text}
        </Tag>
      );
    }
    case "list": {
      const ListTag = block.ordered ? "ol" : "ul";
      const listClass = block.ordered ? "list-decimal" : "list-disc";
      return (
        <ListTag
          key={index}
          className={`${listClass} space-y-2 pl-5 text-[15px] leading-[1.75] text-[var(--foreground-muted)] md:text-base`}
        >
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ListTag>
      );
    }
    case "blockquote":
      return (
        <blockquote
          key={index}
          className="border-l-2 border-[var(--brand)]/40 pl-4 text-[15px] italic leading-[1.75] text-[var(--foreground)]/85 md:text-base"
        >
          {block.text}
        </blockquote>
      );
    default:
      return null;
  }
}

type BlogRendererProps = {
  blocks: BlogBlock[];
};

export function BlogRenderer({ blocks }: BlogRendererProps) {
  return (
    <div className="space-y-5 md:space-y-6">
      {blocks.map((block, index) => renderBlock(block, index))}
    </div>
  );
}
