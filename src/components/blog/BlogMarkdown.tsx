import type { ReactNode } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

function headingId(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function headingText(children: ReactNode): string {
  if (typeof children === "string" || typeof children === "number") {
    return String(children);
  }
  if (Array.isArray(children)) {
    return children.map(headingText).join("");
  }
  return "";
}

const components: Components = {
  h2: ({ children }) => {
    const text = headingText(children);
    return (
      <h2 id={headingId(text)} className="scroll-mt-28">
        {children}
      </h2>
    );
  },
  h3: ({ children }) => {
    const text = headingText(children);
    return (
      <h3 id={headingId(text)} className="scroll-mt-28">
        {children}
      </h3>
    );
  },
  a: ({ href, children }) => {
    if (!href) return <span>{children}</span>;
    if (href.startsWith("/")) {
      return <Link href={href}>{children}</Link>;
    }
    return (
      <a href={href} rel="noopener noreferrer">
        {children}
      </a>
    );
  },
  table: ({ children }) => (
    <div className="blog-table-wrap">
      <table>{children}</table>
    </div>
  ),
};

type BlogMarkdownProps = {
  source: string;
};

export function BlogMarkdown({ source }: BlogMarkdownProps) {
  return (
    <div className="blog-prose">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {source}
      </ReactMarkdown>
    </div>
  );
}
