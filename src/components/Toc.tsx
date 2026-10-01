"use client";

import { useEffect, useState } from "react";

/** Sticky section list for case studies; highlights the section being read. */
export function Toc({ items }: { items: { id: string; title: string; deep: boolean }[] }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -65% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);

  let n = 0;
  return (
    <nav className="toc" aria-label="On this page">
      <p className="label" style={{ margin: "0 0 10px" }}>
        On this page
      </p>
      <ol>
        {items.map((i) => (
          <li key={i.id} className={i.deep ? "deep-only" : undefined}>
            <a href={`#${i.id}`} aria-current={active === i.id ? "true" : undefined}>
              <span>{String(++n).padStart(2, "0")}</span>
              {i.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
