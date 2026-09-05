import Link from "next/link";
import type { ReactNode } from "react";
import type { BlogBlock } from "@/lib/blog/types";

function linkedText(text: string): ReactNode {
  const nodes: ReactNode[] = [];
  const pattern = /\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    const label = match[1];
    const href = match[2];
    nodes.push(
      href.startsWith("/") ? (
        <Link key={`${href}-${match.index}`} href={href}>
          {label}
        </Link>
      ) : (
        <a key={`${href}-${match.index}`} href={href} rel="noopener noreferrer">
          {label}
        </a>
      ),
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes.length === 1 ? nodes[0] : nodes;
}

function renderBlock(block: BlogBlock, index: number) {
  switch (block.type) {
    case "paragraph":
      return <p key={index}>{linkedText(block.text)}</p>;
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
