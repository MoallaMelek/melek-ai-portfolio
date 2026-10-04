import type { MetadataRoute } from "next";
import { projects } from "@/content";
import { SITE_URL } from "@/content/profile";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date("2026-10-04");
  return [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "monthly", priority: 1,
      images: [`${SITE_URL}/melek-portrait.webp`] },
    ...projects.map((p) => ({
      url: `${SITE_URL}/projects/${p.slug}/`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
