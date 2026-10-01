import Link from "next/link";
import { domains } from "@/content";
import type { Project } from "@/content/types";
import { RenderBlock } from "./Blocks";

/** A project as it appears on the home page: question, one-liner, a custom visual (children),
 *  the first known limit, and — in "Under the hood" mode — its engineering spec. */
export function Feature({ project: p, n, children }: { project: Project; n: number; children: React.ReactNode }) {
  const deep = p.sections.find((s) => s.deep);
  const deepBlocks = deep?.blocks.filter((b) => b.type === "spec" || b.type === "flow") ?? [];
  return (
    <article className="feature" id={p.slug} aria-labelledby={`${p.slug}-title`}>
      <div className="feature__head">
        <div>
          <div className="feature__kicker">
            <span className="label">{String(n).padStart(2, "0")}</span>
            <span className="label">{p.domains.map((d) => domains[d].short).join(" · ")}</span>
            <span className="label">{p.year}</span>
          </div>
          <h3 className="feature__title" id={`${p.slug}-title`}>
            {p.title}
          </h3>
        </div>
        <div>
          <p className="feature__q">{p.question}</p>
          <p className="feature__one">{p.oneLiner}</p>
          <Link className="link-arrow" href={`/projects/${p.slug}`}>
            Case study <span className="arr">→</span>
          </Link>
        </div>
      </div>
      <div data-reveal>{children}</div>
      <div className="feature__foot">
        <p className="limit">
          <b>Known limit</b>
          {p.limits[0]}
        </p>
        <a className="link-arrow ext" href={p.repo}>
          Source
        </a>
      </div>
      {deepBlocks.length ? (
        <div className="deep-only deep-panel">
          <div className="deep-panel__label">
            <span className="label">Under the hood · {p.title}</span>
            <span className="label">{p.status}</span>
          </div>
          <div style={{ display: "grid", gap: 24 }}>
            {deepBlocks.map((b, i) => (
              <RenderBlock key={i} block={b} />
            ))}
          </div>
        </div>
      ) : null}
    </article>
  );
}

export function Chapter({
  id,
  n,
  title,
  blurb,
  children,
}: {
  id: string;
  n: string;
  title: string;
  blurb: string;
  children: React.ReactNode;
}) {
  return (
    <section className="chapter" id={id} aria-labelledby={`${id}-h`}>
      <div className="wrap">
        <div className="chapter__head">
          <span className="label">§ {n}</span>
          <h2 className="chapter__title" id={`${id}-h`}>
            {title}
          </h2>
          <p className="chapter__blurb">{blurb}</p>
        </div>
        {children}
      </div>
    </section>
  );
}
