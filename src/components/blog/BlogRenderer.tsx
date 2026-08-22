import type { BlogBlock } from "@/lib/blog/types";

function renderBlock(block: BlogBlock, index: number) {
  switch (block.type) {
    case "paragraph":
      return <p key={index}>{block.text}</p>;
    case "heading": {
      const Tag = block.level === 3 ? "h3" : "h2";
      return (
        <Tag key={index} id={headingId(block.text)} className="scroll-mt-28">
          {block.text}
        </Tag>
      );
    }
    case "list": {
      const ListTag = block.ordered ? "ol" : "ul";
      return (
        <ListTag key={index}>
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ListTag>
      );
    }
    case "blockquote":
      return <blockquote key={index}>{block.text}</blockquote>;
    default:
      return null;
  }
}

function headingId(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

type BlogRendererProps = {
  blocks: BlogBlock[];
};

export function BlogRenderer({ blocks }: BlogRendererProps) {
  return (
    <div className="blog-prose">
      {blocks.map((block, index) => renderBlock(block, index))}
    </div>
  );
}
