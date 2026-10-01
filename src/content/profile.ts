// Personal facts, all taken from Melek's CV (September 2026) and GitHub profile.
// Phone number, street address and date of birth are deliberately not published.

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://melek-moalla.vercel.app").replace(/\/$/, "");

export const profile = {
  name: "Melek Moalla",
  role: "AI engineering student",
  school: "ESPRIT",
  schoolFull: "ESPRIT, École Supérieure Privée d'Ingénierie et de Technologies",
  location: "Tunis, Tunisia",
  email: "moalla.melek09@gmail.com",
  github: "https://github.com/MoallaMelek",
  githubHandle: "MoallaMelek",
  /** Set this when you want LinkedIn on the site; it is hidden while null. */
  linkedin: "https://www.linkedin.com/in/melek-moalla-14a5a4357" as string | null,
  /** Path under /public to a CV without phone/address, or null to hide the link. */
  cv: "/Melek-Moalla-CV.pdf" as string | null,
  description:
    "Melek Moalla, AI engineering student at ESPRIT in Tunisia. Reinforcement learning, computer vision and agent systems, each project shipped with the measurement that tests it.",
};

export const now = [
  "Turning phone video into metric 3D reconstructions with uncertainty attached (ATLAS).",
  "Collecting real human demonstrations for GhostHands to replace its synthetic teacher.",
  "Recording live sessions for Vector so its gesture thresholds get tuned on real hands.",
];

export const timeline: { when: string; what: string; detail?: string; kind: "study" | "work" | "build" | "award" }[] = [
  { when: "2028", what: "Engineering degree, Computer Science, Artificial Intelligence track", detail: "ESPRIT · expected", kind: "study" },
  { when: "Sep 2026", what: "Reward Goblin, Dungeon With Amnesia, Vector, Telekinesis, GhostHands, Hydra", detail: "An intense month of building, all public on GitHub", kind: "build" },
  { when: "Summer 2026", what: "Software & AI Intern, MS Solutions Group", detail: "Real-time transaction monitoring with FastAPI, WebSockets and Redis; an LLM chatbot over dashboard data", kind: "work" },
  { when: "2025–2026", what: "AI specialisation year · NVIDIA certificates in Machine Learning, Deep Learning and Generative AI", detail: "Plant DNA deep-learning project selected for the Bal des Projets showcase", kind: "study" },
  { when: "2024–2025", what: "Ranked 1st in the annual class ranking", detail: "LogiXpress wins at the Bal des Projets; WaveWorx selected", kind: "award" },
  { when: "2024–2025", what: "Software Intern, Telnet", detail: "Built and deployed a Docker-based live metrics dashboard from supervisor specifications", kind: "work" },
  { when: "2023–2024", what: "Ranked 2nd in the annual class ranking", detail: "Linux game and Arduino controller selected for the Bal des Projets", kind: "award" },
  { when: "2023–2024", what: "Web Development Intern, Shamash IT", detail: "User-facing interfaces in HTML, CSS and JavaScript", kind: "work" },
  { when: "2023", what: "Baccalaureate in Mathematics", detail: "Lycée El Menzah 9", kind: "study" },
];
