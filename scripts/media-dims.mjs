// Writes src/content/media-dims.json: intrinsic sizes of every image in public/projects,
// so the site can reserve exact aspect ratios and never shift layout while media loads.
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "public", "projects");
const dims = {};
for (const slug of readdirSync(dir)) {
  for (const f of readdirSync(join(dir, slug))) {
    if (!f.endsWith(".webp")) continue;
    const { width, height } = await sharp(readFileSync(join(dir, slug, f))).metadata();
    dims[`/projects/${slug}/${f}`] = [width, height];
  }
}
writeFileSync(join(root, "src", "content", "media-dims.json"), JSON.stringify(dims, null, 1));
console.log(Object.keys(dims).length, "images");
