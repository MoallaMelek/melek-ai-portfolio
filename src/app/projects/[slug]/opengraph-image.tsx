import { getProject, projects } from "@/content";
import { ogCard, ogSize } from "@/lib/og";

export const alt = "Case study by Melek Moalla";
export const size = ogSize;
export const contentType = "image/png";
export const dynamic = "force-static";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProject(slug)!;
  return ogCard({ kicker: `Case study · ${p.year}`, title: p.title, value: p.headline.value, label: p.headline.label });
}
