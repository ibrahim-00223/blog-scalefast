"use client";

import { useEffect, useState } from "react";

type Heading = { id: string; text: string; level: number };

export function TableOfContents({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState<string | null>(headings[0]?.id ?? null);

  useEffect(() => {
    const elements = headings.map((heading) => document.getElementById(heading.id)).filter((element): element is HTMLElement => Boolean(element));
    if (!elements.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible?.target.id) setActiveId(visible.target.id);
      },
      { rootMargin: "-25% 0px -55% 0px", threshold: 0.1 }
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [headings]);

  if (!headings.length) return null;

  return (
    <aside className="sf-card sticky top-24 p-5">
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-sf-gray-400">Table of contents</p>
      <ul className="space-y-3">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a href={`#${heading.id}`} className={`block text-sm leading-6 ${activeId === heading.id ? "font-semibold text-sf-blue" : "text-sf-gray-600 hover:text-sf-navy"} ${heading.level === 3 ? "pl-4" : ""}`}>
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}

