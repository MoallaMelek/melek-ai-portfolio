import { ghosthands } from "./projects/ghosthands";
import { hydra } from "./projects/hydra";
import { memoryDungeon } from "./projects/memory-dungeon";
import { paymentObservability } from "./projects/payment-observability";
import { proteinSynthesis } from "./projects/protein-synthesis";
import { rewardGoblin } from "./projects/reward-goblin";
import { telekinesis } from "./projects/telekinesis";
import { vector } from "./projects/vector";
import type { DomainId, LabItem, Project } from "./types";

export const projects: Project[] = [
  rewardGoblin,
  memoryDungeon,
  vector,
  ghosthands,
  telekinesis,
  hydra,
  proteinSynthesis,
  paymentObservability,
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export const domains: Record<DomainId, { label: string; short: string; blurb: string }> = {
  rl: {
    label: "Learning from reward",
    short: "RL",
    blurb: "Reinforcement and imitation learning, and the uncomfortable gap between what an agent is paid for and what you wanted.",
  },
  vision: {
    label: "Seeing hands",
    short: "Vision",
    blurb: "Real-time computer vision where the human hand is the interface: gestures, segmentation, teleoperation.",
  },
  agents: {
    label: "Agents",
    short: "Agents",
    blurb: "Coordinating LLM agents, and giving them tools that are useful without being dangerous.",
  },
  ml: {
    label: "Applied ML",
    short: "ML",
    blurb: "Tabular and scientific ML with grouped evaluation, baselines and explanations.",
  },
  systems: {
    label: "Systems",
    short: "Systems",
    blurb: "The event buses, caches, threads and desktop shells that make models usable.",
  },
};

export const lab: LabItem[] = [
  {
    title: "ATLAS",
    year: "2026",
    status: "In progress · not yet public",
    note: "Phone video in, metric 3D digital twin out. Today it recovers camera poses with COLMAP, estimates metric scale without a depth sensor (a learned geometry prior plus a bootstrap confidence interval) and fuses a TSDF mesh, on CPU, measured against ground truth. Splats, rooms and floor plans are still planned.",
    tags: ["3D vision", "research spike"],
    stack: ["Python", "COLMAP", "Open3D", "OpenCV"],
  },
  {
    title: "Plant DNA & crop intelligence platform",
    year: "2025–2026",
    status: "Multi-module integration project",
    note: "A Flutter field app and a React research dashboard behind one FastAPI gateway serving a wheat-disease CNN, a pest image classifier, an insect-sound classifier and a FAISS-backed retrieval workflow for DNA search.",
    tags: ["deep learning", "full stack"],
    stack: ["TensorFlow", "PyTorch", "FastAPI", "Flutter", "React", "FAISS", "LangChain"],
    repo: "https://github.com/MoallaMelek/Deep-Learning-Plant-DNA-Optimization",
  },
  {
    title: "LogiXpress",
    year: "2024–2025",
    status: "University project · Bal des Projets winner",
    note: "A PHP/MySQL MVC delivery platform with route views, packaging orders and claims, plus experimental Python sidecars for delivery forecasting and biometric login.",
    tags: ["web", "award"],
    stack: ["PHP", "MySQL", "Python", "scikit-learn", "Leaflet", "Firebase"],
    repo: "https://github.com/MoallaMelek/LogiXpress-WebSite",
  },
  {
    title: "Festy Event",
    year: "2025",
    status: "Team project",
    note: "Event booking for Tunisia in Django: QR-code tickets, a Leaflet map of venues by governorate, availability calendars, PDF invoices with VAT and admin analytics.",
    tags: ["web"],
    stack: ["Django", "Python", "Leaflet", "Chart.js", "SQLite"],
    repo: "https://github.com/MoallaMelek/Festy-Event",
  },
  {
    title: "WaveWorx",
    year: "2024–2025",
    status: "University project · Bal des Projets selection",
    note: "A C++/Qt operations desktop app on Oracle: inventory and business records with search, stock alerts, charts and PDF reports.",
    tags: ["desktop"],
    stack: ["C++", "Qt", "Oracle"],
  },
  {
    title: "Linux game + Arduino controller",
    year: "2023–2024",
    status: "University project · Bal des Projets selection",
    note: "A game written for Linux, played with a gamepad I built on an Arduino board.",
    tags: ["systems", "hardware"],
    stack: ["C", "Arduino"],
  },
];

/** Which bench each technology belongs on. Anything unlisted falls under "Systems". */
export const toolGroups: { label: string; tools: string[] }[] = [
  { label: "Learning", tools: ["PyTorch", "Stable-Baselines3", "Gymnasium", "scikit-learn", "XGBoost", "LightGBM", "SHAP", "TensorFlow", "NumPy", "pandas"] },
  { label: "Perception & simulation", tools: ["MediaPipe", "OpenCV", "EdgeSAM", "ONNX Runtime", "Pymunk", "COLMAP", "Open3D"] },
  { label: "Agents & retrieval", tools: ["MCP", "Ollama", "FAISS", "LangChain"] },
  { label: "Backends & runtime", tools: ["Python", "FastAPI", "WebSockets", "Redis", "SQLite", "Docker", "Django", "Electron", "node-pty", "Win32 API", "Firebase", "PHP", "MySQL", "C++", "Qt", "Oracle"] },
  { label: "Interfaces", tools: ["TypeScript", "React", "JavaScript", "Streamlit", "Plotly", "ECharts", "xterm.js", "Flutter", "Leaflet", "Chart.js", "py3Dmol"] },
];

/** Technology -> titles of the work that uses it. */
export function toolIndex() {
  const map = new Map<string, string[]>();
  const add = (tool: string, title: string) => map.set(tool, [...(map.get(tool) ?? []), title]);
  for (const p of projects) p.stack.forEach((t) => add(t, p.title));
  for (const l of lab) l.stack.forEach((t) => add(t, l.title));
  return map;
}
