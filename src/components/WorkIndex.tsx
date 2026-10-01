"use client";
import Link from "next/link";
import { useState } from "react";
import { MediaFigure } from "./Media";
import { HydraDiagram } from "./exhibits/HydraDiagram";
import type { DomainId, Media, Metric } from "@/content/types";
export type IndexItem = {
  slug: string;
  title: string;
  year: string;
  deepLearning: boolean;
  domains: DomainId[];
  domainLabels: string;
  headline: Metric;
  peek?: Media;
  description: string;
  limit: string;
};
const captions: Record<string, string> = {
  "reward-goblin":
    "Recorded PPO policy · side-by-side with the intended solution",
  vector: "Real gesture engine · synthetic hand input",
  ghosthands: "Learned policy · synthetic teacher demonstrations",
  telekinesis: "Real pipeline · synthetic desk fixture",
  "memory-dungeon": "Recorded hidden state · memory-intact episode",
  "payment-observability": "Working dashboard · synthetic payment events",
  "protein-synthesis": "DNA design pipeline · simulated expression target",
};
export function WorkIndex({
  items,
  filters,
}: {
  items: IndexItem[];
  filters: { id: DomainId; label: string; count: number }[];
}) {
  const [filter, setFilter] = useState<DomainId | "deep-learning" | null>(null);
  const match = (it: IndexItem) =>
    filter === null ||
    (filter === "deep-learning"
      ? it.deepLearning
      : it.domains.includes(filter));
  const shown = items.filter(match);
  return (
    <>
      <div
        className="work-filters"
        role="group"
        aria-label="Filter projects by field"
      >
        <button
          className="chip"
          type="button"
          aria-pressed={filter === null}
          onClick={() => setFilter(null)}
        >
          All work <span className="count">{items.length}</span>
        </button>
        {filters.map((f) => (
          <button
            className="chip"
            key={f.id}
            type="button"
            aria-pressed={filter === f.id}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
            <span className="count">{f.count}</span>
          </button>
        ))}
        <button
          className="chip"
          type="button"
          aria-pressed={filter === "deep-learning"}
          onClick={() => setFilter("deep-learning")}
        >
          Deep learning <span className="count">{items.filter((it) => it.deepLearning).length}</span>
        </button>
        <a className="chip work-filter-link" href="#lab">
          Web & more ↘
        </a>
      </div>
      <p className="sr-only" role="status" aria-live="polite">
        Showing {shown.length} projects
      </p>
      <div className="project-grid">
        {shown.map((it) => (
          <article
            className={`project-showcase project-showcase--${it.slug}`}
            key={it.slug}
          >
            <div className="project-showcase__meta label">
              <span>
                {String(items.indexOf(it) + 1).padStart(2, "0")} /{" "}
                {it.domainLabels}
              </span>
              <span>{it.year}</span>
            </div>
            <div className="project-showcase__visual">
              {it.peek ? (
                <MediaFigure
                  media={it.peek}
                  caption={false}
                  contain
                  ratio="16 / 10"
                />
              ) : (
                <HydraDiagram />
              )}
            </div>
            <p className="project-showcase__caption mono">
              {captions[it.slug] ??
                "Interactive architecture · illustrative fleet, real MCP tools"}
            </p>
            <Link
              className="project-showcase__title"
              href={`/projects/${it.slug}/`}
            >
              <h3>{it.title}</h3>
              <span aria-hidden>↗</span>
            </Link>
            <p className="project-showcase__description">{it.description}</p>
            <div className="project-showcase__evidence">
              <strong>{it.headline.value}</strong>
              <span>
                {it.headline.label}
                {it.headline.note ? ` · ${it.headline.note}` : ""}
              </span>
            </div>
            <Link className="link-arrow" href={`/projects/${it.slug}/`}>
              Explore case study <span className="arr">→</span>
            </Link>
            <details className="project-limit">
              <summary>What to keep in mind</summary>
              <p>{it.limit}</p>
            </details>
          </article>
        ))}
      </div>
    </>
  );
}
