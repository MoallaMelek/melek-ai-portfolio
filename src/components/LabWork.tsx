"use client";
import { useState } from "react";
import type { LabItem } from "@/content/types";
export function LabWork({ items }: { items: LabItem[] }) {
  const [field, setField] = useState("all");
  const shown = items.filter((i) => field === "all" || i.tags.includes(field));
  return (
    <>
      <div
        className="work-filters"
        role="group"
        aria-label="Filter lab projects"
      >
        {[
          ["all", "All"],
          ["deep learning", "Deep learning"],
          ["web", "Web"],
          ["desktop", "Desktop"],
          ["3D vision", "3D vision"],
          ["hardware", "Hardware"],
        ].map(([value, label]) => (
          <button
            type="button"
            className="chip"
            key={value}
            aria-pressed={field === value}
            onClick={() => setField(value)}
          >
            {label}
          </button>
        ))}
      </div>
      <p className="sr-only" role="status" aria-live="polite">
        Showing {shown.length} lab projects
      </p>
      <div className="lab-list">
        {shown.map((item) => (
          <article key={item.title}>
            <div>
              <span className="label">
                {item.year} / {item.status}
              </span>
              <h3>{item.title}</h3>
            </div>
            <div>
              <p>{item.note}</p>
              <details>
                <summary>Tools used</summary>
                <p className="mono">{item.stack.join(" · ")}</p>
              </details>
            </div>
            {item.repo ? (
              <a href={item.repo} className="link-arrow ext">
                Source
              </a>
            ) : (
              <span className="label">
                {item.title === "ATLAS" ? "In progress" : "University project"}
              </span>
            )}
          </article>
        ))}
      </div>
    </>
  );
}
