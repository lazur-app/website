"use client";

import { useEffect, useState } from "react";

type Item = { id: string; text: string };

/**
 * "On this page" list for the side rail. Reads the h2[id] headings that the server already rendered
 * inside the article, so it never drifts from the content, and highlights the one being read.
 */
export function TocRail() {
  const [items, setItems] = useState<Item[]>([]);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const root = document.querySelector(".seo-article__main");
    if (!root) return;
    const heads = Array.from(root.querySelectorAll<HTMLHeadingElement>("h2[id]")).filter((h) => h.id !== "sources");
    const raf = requestAnimationFrame(() =>
      setItems(heads.map((h) => ({ id: h.id, text: h.textContent?.trim() ?? "" })).filter((i) => i.text)),
    );
    if (heads.length === 0) return () => cancelAnimationFrame(raf);
    const obs = new IntersectionObserver(
      (entries) => {
        const seen = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (seen[0]) setActive(seen[0].target.id);
      },
      { rootMargin: "-110px 0px -60% 0px" },
    );
    heads.forEach((h) => obs.observe(h));
    return () => {
      cancelAnimationFrame(raf);
      obs.disconnect();
    };
  }, []);

  if (items.length < 2) return null;
  return (
    <nav aria-label="On this page" className="seo-railcard seo-toc">
      <p className="seo-railcard__label">On this page</p>
      <ol>
        {items.map((i) => (
          <li key={i.id}>
            <a href={`#${i.id}`} className={active === i.id ? "is-active" : undefined}>
              {i.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
