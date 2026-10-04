import { CopyButton } from "@/components/CopyButton";
import { WorkIndex } from "@/components/WorkIndex";
import { LabWork } from "@/components/LabWork";
import { domains, lab, projects } from "@/content";
import { SITE_URL, profile, timeline } from "@/content/profile";
import type { DomainId } from "@/content/types";

export default function Home() {
  const order = [
    "reward-goblin",
    "vector",
    "hydra",
    "ghosthands",
    "telekinesis",
    "memory-dungeon",
    "payment-observability",
    "protein-synthesis",
  ];
  const selected = order.map((slug) => projects.find((p) => p.slug === slug)!);
  return (
    <div className="showcase-home">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        "@id": `${SITE_URL}/#profile`,
        url: `${SITE_URL}/`,
        name: `${profile.name} — AI engineering portfolio`,
        mainEntity: { "@id": `${SITE_URL}/#person` },
        primaryImageOfPage: { "@id": `${SITE_URL}/#portrait` },
      }) }} />
      <section className="intro wrap" aria-labelledby="hero-title">
        <div className="intro__eyebrow label">
          <span>AI engineering student · ESPRIT</span>
          <span>Tunis, Tunisia / 2026</span>
        </div>
        <div className="intro__grid">
          <div className="intro__copy">
            <p className="intro__name">Melek Moalla</p>
            <h1 id="hero-title">
              I build AI.
              <br />
              Then I test
              <br />
              <span>its limits.</span>
            </h1>
            <p className="intro__description">
              Hands become interfaces. Agents learn to cheat. Models learn to
              remember. I build these systems—and measure what actually works.
            </p>
            <div className="intro__actions">
              <a className="primary-cta" href="#work">
                Explore the work <span aria-hidden>↘</span>
              </a>
              <a className="link-arrow" href={`mailto:${profile.email}`}>
                Let&apos;s talk ↗
              </a>
            </div>
            <p className="intro__availability">
              <span aria-hidden /> Open to AI / ML internships
            </p>
          </div>
          <figure className="intro__portrait">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/melek-portrait.webp"
              alt="Portrait of Melek Moalla"
              width={800}
              height={1000}
              fetchPriority="high"
            />
            <figcaption>
              <span>Melek Moalla</span>
              <span>Student. Builder. Always testing.</span>
            </figcaption>
            <span className="intro__portrait-index" aria-hidden>
              MM / 01
            </span>
          </figure>
        </div>
        <div className="intro__foot">
          <span className="label">
            Computer vision / Reinforcement learning / AI agents
          </span>
          <a className="mono" href={profile.github}>
            GitHub ↗
          </a>
          {profile.linkedin ? (
            <a className="mono" href={profile.linkedin}>
              LinkedIn ↗
            </a>
          ) : null}
          <a className="mono" href="/Melek-Moalla-CV.pdf">
            CV ↗
          </a>
        </div>
      </section>
      <section
        className="work-section wrap"
        id="work"
        aria-labelledby="work-title"
      >
        <div className="section-intro">
          <span className="label">01 / Selected work</span>
          <h2 id="work-title">
            Built to be seen.
            <br />
            <span>Backed by evidence.</span>
          </h2>
          <p>
            Start with the demo. Open a case study for the decisions,
            experiments, and limits behind it.
          </p>
        </div>
        <WorkIndex
          filters={(Object.keys(domains) as DomainId[]).map((id) => ({
            id,
            label:
              id === "rl"
                ? "Reinforcement learning"
                : id === "vision"
                  ? "Computer vision"
                  : domains[id].short,
            count: projects.filter((p) => p.domains.includes(id)).length,
          }))}
          items={selected.map((p) => ({
            slug: p.slug,
            title: p.title,
            year: p.year,
            deepLearning: p.stack.includes("PyTorch") || p.stack.includes("TensorFlow"),
            domains: p.domains,
            domainLabels: p.domains
              .map((d) =>
                d === "vision"
                  ? "Computer vision"
                  : d === "rl"
                    ? "Reinforcement learning"
                    : domains[d].label,
              )
              .join(" · "),
            headline: p.headline,
            peek: p.preview ?? p.cover,
            description: p.oneLiner,
            limit: p.limits[0],
          }))}
        />
      </section>
      <section
        className="about-section wrap"
        id="path"
        aria-labelledby="about-title"
      >
        <div className="section-intro">
          <span className="label">02 / Behind the work</span>
          <h2 id="about-title">
            Curiosity first.
            <br />
            <span>Rigor follows.</span>
          </h2>
        </div>
        <div className="about-summary">
          <div>
            <p className="lede">
              I&apos;m an AI engineering student at ESPRIT in Tunis. I like
              problems where the obvious metric lies.
            </p>
            <p>
              Agents that game rewards. Gestures that trigger by accident.
              Models that only work on the layout they trained on. Building the
              system is half the work; finding out where it fails is the other
              half.
            </p>
            <p>
              I work with coding agents as collaborators and review what they
              produce. That experience led me to build Hydra.
            </p>
            <div className="about-links">
              <a className="link-arrow" href="/Melek-Moalla-CV.pdf">
                Read my CV ↗
              </a>
              <a className="link-arrow ext" href={profile.github}>
                Explore the source
              </a>
            </div>
          </div>
          <div className="credentials">
            <div>
              <span className="label">ESPRIT / 2024–25</span>
              <strong>First in my class.</strong>
              <p>
                Annual class ranking. AI engineering degree expected in 2028.
              </p>
            </div>
            <div>
              <span className="label">Learning / NVIDIA</span>
              <strong>ML. Deep learning. Generative AI.</strong>
              <p>Certificates supporting the work you see here.</p>
            </div>
            <div>
              <span className="label">Experience / Three internships</span>
              <strong>From interfaces to AI systems.</strong>
              <p>MS Solutions Group · Telnet · Shamash IT</p>
            </div>
          </div>
        </div>
        <details className="career-details">
          <summary>
            Education & experience <span aria-hidden>+</span>
          </summary>
          <ol className="timeline" aria-label="Education and experience">
            {timeline.map((t, i) => (
              <li key={i}>
                <time>{t.when}</time>
                <i className={`k k--${t.kind}`} aria-hidden />
                <div>
                  <b>{t.what}</b>
                  {t.detail ? <span>{t.detail}</span> : null}
                </div>
              </li>
            ))}
          </ol>
        </details>
      </section>
      <section
        className="lab-section wrap"
        id="lab"
        aria-labelledby="lab-title"
      >
        <div className="section-intro">
          <span className="label">03 / The wider lab</span>
          <h2 id="lab-title">Still exploring.</h2>
          <p>Earlier work, team projects, and what I&apos;m building next.</p>
        </div>
        <LabWork items={lab} />
      </section>
      <section
        className="contact contact--showcase"
        id="contact"
        aria-labelledby="contact-h"
      >
        <div className="wrap">
          <span className="label">04 / Let&apos;s build something</span>
          <h2 className="contact__title" id="contact-h">
            Have a hard
            <br />
            <span>problem?</span>
          </h2>
          <p className="contact__invitation">
            I&apos;m looking for AI / ML internships and teams where I can
            build, test, and keep learning.
          </p>
          <div className="contact__rows">
            <div className="contact__row">
              <span className="label">Email</span>
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
              <CopyButton text={profile.email} label="Copy email" />
            </div>
            <div className="contact__row">
              <span className="label">Find me</span>
              <div className="professional-links">
                <a href={profile.github}>GitHub ↗</a>
                {profile.linkedin ? (
                  <a href={profile.linkedin}>LinkedIn ↗</a>
                ) : null}
                <a href="/Melek-Moalla-CV.pdf">CV ↗</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
