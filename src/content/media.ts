import dims from "./media-dims.json";
import type { Media } from "./types";

const table = dims as unknown as Record<string, [number, number]>;

function size(path: string): [number, number] {
  const d = table[path];
  if (!d) throw new Error(`No dimensions recorded for ${path}. Run npm run media:dims.`);
  return d;
}

/** Image from public/projects/<slug>/<name>.webp */
export function m(slug: string, name: string, alt: string, caption?: string): Media {
  const src = `/projects/${slug}/${name}.webp`;
  const [width, height] = size(src);
  return { kind: "image", src, alt, caption, width, height };
}

/** Video from public/projects/<slug>/<name>.mp4 with its <name>-poster.webp */
export function v(slug: string, name: string, alt: string, caption?: string): Media {
  const poster = `/projects/${slug}/${name}-poster.webp`;
  const [width, height] = size(poster);
  return { kind: "video", src: `/projects/${slug}/${name}.mp4`, poster, alt, caption, width, height };
}
