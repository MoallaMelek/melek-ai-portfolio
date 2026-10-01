import type { Project } from "../types";

export const hydra: Project = {
  slug: "hydra",
  title: "Hydra",
  oneLiner: "A desktop app that runs Claude Code and OpenAI Codex agents in parallel, with a manager agent that coordinates the others over MCP.",
  question: "What does it take to supervise ten coding agents at once without losing track of any of them?",
  year: "2026",
  status: "Desktop app · packaging pipeline for macOS, Windows and Linux · no public release yet · MIT",
  domains: ["agents", "systems"],
  stack: ["TypeScript", "React", "Electron", "MCP", "node-pty", "xterm.js", "Zod", "Vitest", "Firebase"],
  repo: "https://github.com/MoallaMelek/Hydra-Agent-Orchestrator",
  headline: { value: "7 MCP tools", label: "let one manager agent spawn, prompt, read and restart up to 10 concurrent agents" },
  hue: 145,
  limits: [
    "Usage and cost figures are parsed from CLI output: signals, not billing data.",
    "No public release has been cut yet, and builds are unsigned.",
  ],
  sections: [
    {
      id: "what",
      title: "One window, many agents",
      blocks: [
        {
          type: "prose",
          body: [
            "Each agent runs in its own real PTY terminal, grouped by project. A chat view focuses on one agent; a grid view tiles a whole project and can broadcast one prompt to all of them. Workspace state survives restarts, and previous Claude sessions can be imported and resumed.",
            "The interesting part is the manager: a special agent that runs its own HTTP/SSE MCP server, so another model can orchestrate the fleet through tools.",
          ],
        },
        { type: "exhibit", id: "hydra" },
      ],
    },
    {
      id: "features",
      title: "Built to be operated",
      blocks: [
        {
          type: "notes",
          items: [
            { title: "Headless runs", body: "Queue background prompts without a terminal, with structured JSONL logs per run, search, filtering and session resume." },
            { title: "Budgets", body: "Daily usage rollups per project and agent, soft token and USD budgets, and warnings at a configurable threshold." },
            { title: "Remote control", body: "Scan a QR code on the desktop; a PWA on the phone joins the session with an explicit handshake and lists agents by project." },
            { title: "Observability", body: "Rotating structured logs, renderer and main-process error capture, and an exportable diagnostics bundle." },
          ],
        },
      ],
    },
    {
      id: "system",
      title: "Under the hood",
      deep: true,
      blocks: [
        {
          type: "spec",
          items: [
            ["Shell", "Electron 33, electron-vite + Vite 5"],
            ["UI", "React 18 + TypeScript, chat and grid views"],
            ["Terminals", "node-pty + xterm.js"],
            ["Orchestration", "Model Context Protocol SDK, HTTP/SSE server inside the app"],
            ["Validation", "Zod"],
            ["Quality", "Vitest + React Testing Library; CI lint, typecheck and tests on Ubuntu and Windows"],
            ["Packaging", "electron-builder; tag-triggered CI workflow for DMG, Windows installer, AppImage + .deb, and a Homebrew tap updater"],
          ],
        },
      ],
    },
  ],
};
