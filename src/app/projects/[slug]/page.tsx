import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RenderBlock } from "@/components/Blocks";
import { DepthLink } from "@/components/DepthToggle";
import { MediaFigure } from "@/components/Media";
import { Toc } from "@/components/Toc";
import { domains, getProject, projects } from "@/content";
import { SITE_URL } from "@/content/profile";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  const title = `${p.title}: ${p.headline.value}`;
  return {
    title: p.title,
    description: p.oneLiner,
    alternates: { canonical: `/projects/${p.slug}/` },
    openGraph: { type: "article", title, description: p.oneLiner, url: `/projects/${p.slug}/` },
    twitter: { card: "summary_large_image", title, description: p.oneLiner },
  };
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();

  const idx = projects.findIndex((x) => x.slug === p.slug);
  const next = projects[(idx + 1) % projects.length];
  const overview = p.sections.filter((s) => !s.deep);
  const deep = p.sections.filter((s) => s.deep);
  const toc = [
    ...p.sections.map((s) => ({ id: s.id, title: s.title, deep: !!s.deep })),
    { id: "limits", title: "Limits", deep: false },
  ];

  const ld = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: p.title,
    description: p.oneLiner,
    codeRepository: p.repo,
    programmingLanguage: p.stack.filter((s) => ["Python", "TypeScript", "JavaScript", "C++", "PHP"].includes(s)),
    author: { "@id": `${SITE_URL}/#person` },
    url: `${SITE_URL}/projects/${p.slug}/`,
  };

  let n = 0;
  return (
    <article className="case" style={{ "--hue": p.hue } as React.CSSProperties}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <header className="case__head">
        <div className="wrap">
          <nav className="case__crumbs label" aria-label="Breadcrumb">
            <Link href="/#work">← All work</Link>
            <span>
              Case study {String(idx + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
            </span>
            <span>{p.domains.map((d) => domains[d].label).join(" · ")}</span>
          </nav>
          <h1 className="case__title">{p.title}</h1>
          <div className="case__intro">
            <div>
              <p className="case__q">{p.question}</p>
              <p className="muted" style={{ maxWidth: "58ch" }}>
                {p.oneLiner}
              </p>
              <div className="case__headline">
                <b>{p.headline.value}</b>
                <span>
                  {p.headline.label}
                  {p.headline.note ? ` (${p.headline.note})` : ""}
                </span>
              </div>
            </div>
            <dl className="case__meta">
              <div>
                <dt>Year</dt>
                <dd>{p.year}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>{p.status}</dd>
              </div>
              <div>
                <dt>Stack</dt>
                <dd>{p.stack.join(", ")}</dd>
              </div>
              <div>
                <dt>Source</dt>
                <dd>
                  <a className="ext" href={p.repo}>
                    {p.repo.replace("https://github.com/", "")}
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </header>

      {p.cover && p.cover.kind === "video" && !p.hideCover ? (
        <div className="wrap case__cover">
          <MediaFigure media={p.cover} priority caption={false} />
        </div>
      ) : null}

      <div className="wrap">
        <div className="case__body">
          <Toc items={toc} />
          <div>
            {overview.map((s) => (
              <section className="csec" id={s.id} key={s.id} aria-labelledby={`${s.id}-h`}>
                <div className="csec__head">
                  <span className="label">{String(++n).padStart(2, "0")}</span>
                  <h2 id={`${s.id}-h`}>{s.title}</h2>
                </div>
                <div className="csec__blocks">
                  {s.blocks.map((b, i) => (
                    <RenderBlock key={i} block={b} />
                  ))}
                </div>
              </section>
            ))}

            {deep.length ? (
              <div className="csec overview-only">
                <div className="deep-hint">
                  <p>
                    {deep.length === 1 ? "One more section" : `${deep.length} more sections`} for engineers: architecture,
                    hyper-parameters and design decisions.
                  </p>
                  <DepthLink>Show under the hood</DepthLink>
                </div>
              </div>
            ) : null}

            {deep.map((s) => (
              <section className="csec csec--deep deep-only" id={s.id} key={s.id} aria-labelledby={`${s.id}-h`}>
                <div className="csec__head">
                  <span className="label">{String(++n).padStart(2, "0")}</span>
                  <h2 id={`${s.id}-h`}>{s.title}</h2>
                  <span className="deep-badge">Under the hood</span>
                </div>
                <div className="csec__blocks">
                  {s.blocks.map((b, i) => (
                    <RenderBlock key={i} block={b} />
                  ))}
                </div>
              </section>
            ))}

            <section className="csec" id="limits" aria-labelledby="limits-h">
              <div className="csec__head">
                <span className="label">{String(++n).padStart(2, "0")}</span>
                <h2 id="limits-h">What it doesn&apos;t do (yet)</h2>
              </div>
              <div className="limits">
                <ol>
                  {p.limits.map((l) => (
                    <li key={l}>{l}</li>
                  ))}
                </ol>
              </div>
              <p style={{ marginTop: 24 }}>
                <a className="link-arrow ext" href={p.repo}>
                  Read the code and the full results on GitHub
                </a>
              </p>
            </section>

            <nav className="next" aria-label="Next case study">
              <Link href={`/projects/${next.slug}`}>
                <span className="label">Next case study</span>
                <b>{next.title}</b>
                <span className="muted">{next.oneLiner}</span>
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </article>
  );
}
