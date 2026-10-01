// Media pipeline: copies reviewed assets from Melek's public repos into public/projects/<slug>/,
// converting GIFs to H.264 MP4 (+ WebP poster) and images to width-capped WebP.
//
//   node scripts/build-media.mjs <dir-containing-cloned-repos> [<telekinesis-sheet.jpg>]
//
// Every source path below was inspected by hand before inclusion (see MEDIA.md for provenance).
// LogiXpress/Festy screenshots were reviewed and deliberately not shipped (watermarks, coordinates, SMS photos).
import { execFileSync } from "node:child_process";
import { mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import ffmpeg from "ffmpeg-static";

const SRC = process.argv[2];
const TK_SHEET = process.argv[3];
if (!SRC) throw new Error("usage: build-media.mjs <repos-dir> [telekinesis-sheet.jpg]");
const OUT = process.env.MEDIA_OUT ?? join(dirname(fileURLToPath(import.meta.url)), "..", "public", "projects");

const jobs = {
  "reward-goblin": {
    repo: "Reward-Goblin",
    video: {
      "docs/demo_edge.gif": "edge",
      "docs/demo_speed.gif": "speed",
      "docs/demo_wall.gif": "wall",
      "docs/demo_lava.gif": "lava",
      "docs/demo_distance.gif": "distance",
      "docs/demo_touch.gif": "touch",
      "docs/demo_fixed.gif": "fixed",
    },
    image: {
      "docs/results.png": "results",
      "docs/edge_training.png": "edge-training",
      "docs/wall_training.png": "wall-training",
    },
  },
  vector: {
    repo: "Vector-CS",
    video: { "docs/images/hud-demo.gif": "hud-demo" },
    image: {
      "docs/images/hud-hover.png": "hud-hover",
      "docs/images/hud-pinch.png": "hud-pinch",
      "docs/images/hud-drag.png": "hud-drag",
      "docs/images/hud-throw.png": "hud-throw",
      "docs/images/hud-draw.png": "hud-draw",
      "docs/images/hud-carousel.png": "hud-carousel",
    },
  },
  ghosthands: {
    repo: "GhostHands",
    video: { "assets/demo.gif": "demo" },
    image: { "assets/interface.jpg": "interface", "assets/results.png": "results" },
  },
  "memory-dungeon": {
    repo: "Reinforcement-Learning-Memory-Dungeon",
    image: {
      "docs/dashboard.png": "dashboard",
      "docs/intervention.png": "intervention",
      "results/ablation/memory_reset.png": "memory-reset",
      "results/ablation/memory_noise.png": "memory-noise",
      "results/showcase/training_curves.png": "training-curves",
      "results/showcase/success_by_architecture.png": "success-by-architecture",
      "results/ablation/hidden_control.png": "hidden-control",
      "results/ablation/hidden_treatment.png": "hidden-treatment",
    },
  },
  "protein-synthesis": {
    repo: "AI-Driven-Therapeutic-Protein-Plant-Synthesis",
    image: {
      "assets/architecture/system-architecture.png": "architecture",
      "assets/screenshots/01-pipeline-execution.jpg": "pipeline-execution",
      "assets/screenshots/02-cai-vs-proxy-target-scatter.jpg": "cai-scatter",
      "assets/screenshots/05-dna-protein-visual-flow.jpg": "dna-flow",
      "assets/screenshots/07-baseline-vs-model-comparison.jpg": "baseline-vs-model",
      "assets/screenshots/08-shap-local-explanation.jpg": "shap",
      "assets/screenshots/09-prediction-quality-and-residuals.jpg": "residuals",
      "assets/screenshots/10-production-ranking-dashboard.jpg": "ranking",
    },
  },
  "payment-observability": {
    repo: "Real-Time-Payment-Observability-Dashboard",
    image: {
      "assets/screenshots/dashboard-overview.png": "dashboard",
      "assets/screenshots/conversational-analyst.png": "analyst",
      "assets/screenshots/analytics-and-alerts.png": "alerts",
    },
  },
};

const MAX_W = 1800;

async function toWebp(src, dst, width = MAX_W) {
  const meta = await sharp(src, { animated: false }).metadata();
  await sharp(src, { animated: false })
    .resize({ width: Math.min(width, meta.width ?? width), withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(dst);
}

function toMp4(src, dst) {
  // yuv420p + even dimensions keep Safari happy; faststart lets playback begin before download ends.
  execFileSync(ffmpeg, [
    "-y", "-loglevel", "error", "-i", src,
    "-movflags", "+faststart", "-pix_fmt", "yuv420p",
    "-vf", "scale='min(1600,iw)':-2:flags=lanczos,fps=30",
    "-c:v", "libx264", "-crf", "24", "-preset", "slow", "-an", dst,
  ]);
}

for (const [slug, job] of Object.entries(jobs)) {
  const dir = join(OUT, slug);
  mkdirSync(dir, { recursive: true });
  for (const [rel, name] of Object.entries(job.video ?? {})) {
    const src = join(SRC, job.repo, rel);
    toMp4(src, join(dir, `${name}.mp4`));
    await toWebp(src, join(dir, `${name}-poster.webp`), 1600);
    console.log("video", slug, name);
  }
  for (const [rel, name] of Object.entries(job.image ?? {})) {
    await toWebp(join(SRC, job.repo, rel), join(dir, `${name}.webp`));
    console.log("image", slug, name);
  }
}

// Telekinesis: real EdgeSAM + app logic on the repo's synthetic desk fixture (tools/fixture_demo.py).
// The contact sheet is 4×2 panels of 640×480; slice it into individual frames.
if (TK_SHEET && existsSync(TK_SHEET)) {
  const dir = join(OUT, "telekinesis");
  mkdirSync(dir, { recursive: true });
  const { width, height } = await sharp(TK_SHEET).metadata();
  const pw = Math.floor(width / 4), ph = Math.floor(height / 2);
  for (let i = 0; i < 8; i++) {
    await sharp(TK_SHEET)
      .extract({ left: (i % 4) * pw, top: Math.floor(i / 4) * ph, width: pw, height: ph - 22 })
      .webp({ quality: 84 })
      .toFile(join(dir, `step-${i + 1}.webp`));
  }
  console.log("telekinesis frames");
}
