// Post-export fixes for static hosting (GitHub Pages or any plain file server).
//  1. OG images are exported as extensionless files; hosts would serve them as octet-stream,
//     which social crawlers reject. Rename to .png and rewrite every reference.
//  2. Next 16 prefetches segment payloads by a flattened name (__next.a.$d$slug.__PAGE__.txt)
//     while the exporter writes them nested (__next.a/$d$slug/__PAGE__.txt). Add flat copies.
//  3. .nojekyll so GitHub Pages serves the _next/ directory.
import { readdirSync, statSync, renameSync, readFileSync, writeFileSync, copyFileSync, existsSync } from "node:fs";
import { join, relative, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "out");
if (!existsSync(OUT)) throw new Error("run next build first");

const walk = (dir) =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

let files = walk(OUT);

// 1. OG images
let renamed = 0;
for (const f of files) {
  if (f.endsWith(`${"opengraph-image"}`) && !f.endsWith(".png")) {
    renameSync(f, `${f}.png`);
    renamed++;
  }
}
files = walk(OUT);
let rewritten = 0;
for (const f of files.filter((x) => x.endsWith(".html") || x.endsWith(".txt"))) {
  const s = readFileSync(f, "utf8");
  const t = s.replace(/\/opengraph-image\?[0-9a-z]+/g, "/opengraph-image.png");
  if (t !== s) {
    writeFileSync(f, t);
    rewritten++;
  }
}

// 2. Flattened RSC segment payloads
let flattened = 0;
for (const f of files) {
  const rel = relative(OUT, f).split(/[\\/]/);
  const i = rel.findIndex((seg) => seg.startsWith("__next.") && !seg.endsWith(".txt"));
  if (i === -1 || !f.endsWith(".txt")) continue;
  const flat = join(OUT, ...rel.slice(0, i), rel.slice(i).join("."));
  if (!existsSync(flat)) {
    copyFileSync(f, flat);
    flattened++;
  }
}

// 3. GitHub Pages
writeFileSync(join(OUT, ".nojekyll"), "");

console.log(`postbuild: ${renamed} OG images renamed, ${rewritten} files rewritten, ${flattened} segment payloads flattened`);
