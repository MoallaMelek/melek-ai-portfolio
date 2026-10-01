import { m } from "../media";
import type { Project } from "../types";

const S = "payment-observability";

export const paymentObservability: Project = {
  slug: S,
  title: "Payment Observability",
  oneLiner: "A real-time dashboard that replays synthetic payment events through an event bus, a risk engine and a guarded conversational analyst.",
  question: "How do you let people ask an LLM about live operational data without letting it see more than it should?",
  year: "2026",
  status: "Working full-stack demo · synthetic data only · CI on backend and frontend",
  domains: ["systems", "agents"],
  stack: ["Python", "FastAPI", "WebSockets", "Redis", "SQLite", "React", "TypeScript", "ECharts", "Ollama", "Docker"],
  repo: "https://github.com/MoallaMelek/Real-Time-Payment-Observability-Dashboard",
  headline: { value: "100% synthetic", label: "replayed through an event bus, a risk engine and a Redis cache into a live dashboard; no real records" },
  cover: m(S, "dashboard", "Live dashboard with KPI tiles, incidents by hour and anomaly trend"),
  hue: 230,
  limits: [
    "The public version runs on generated demo data. It demonstrates patterns, not production scale.",
    "The conversational analyst answers from whitelisted tools and local knowledge; it is not a general SQL interface by design.",
  ],
  sections: [
    {
      id: "flow",
      title: "Events in, insight out",
      blocks: [
        {
          type: "prose",
          body: [
            "Transactions flow through a producer, an in-memory event bus and an incremental analytics engine into a Redis KPI cache, then out over WebSockets as an initial snapshot plus live updates. The browser never reads a database. Source adapters all publish the same event contract, so nothing downstream cares where events come from.",
          ],
        },
        {
          type: "flow",
          flow: {
            stages: [
              { label: "Synthetic generator", note: "SQLite demo store" },
              { label: "Replay producer", note: "pause · resume · reset · fast-forward" },
              { label: "Event bus" },
              { label: "Analytics + risk engine", note: "refusals, timeouts, latency, anomalies" },
              { label: "KPI cache", lanes: ["Redis", "in-memory fallback"] },
              { label: "FastAPI", lanes: ["REST", "WebSocket", "guarded analyst"] },
            ],
          },
        },
        { type: "media", media: m(S, "dashboard", "Live dashboard with KPI tiles and trend charts"), size: "full" },
      ],
    },
    {
      id: "analyst",
      title: "A conversational analyst with guardrails",
      blocks: [
        {
          type: "prose",
          body: [
            "The assistant answers questions about KPIs, anomalies, architecture and replay state through whitelisted tools with bounded queries, rate limits and response sanitisation. It falls back to rules when no model is configured, can use a local Ollama model, and optionally a hosted one.",
          ],
        },
        {
          type: "gallery",
          columns: 2,
          items: [
            m(S, "analyst", "Conversational analyst panel open beside the live dashboard", "The analyst beside the live view."),
            m(S, "alerts", "Status distribution gauge, detected alerts and live event timeline", "Alerts and the live event timeline."),
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
            ["Backend", "FastAPI, Uvicorn, Pydantic, aiosqlite, async services with clear boundaries"],
            ["Realtime", "WebSocket snapshot + deltas, optional token for non-local deployments"],
            ["Cache", "Redis KPI snapshots with automatic in-memory fallback"],
            ["Frontend", "React 19, TypeScript, Vite, Tailwind, ECharts"],
            ["Tests", "Aggregation, replay state, API/WebSocket contracts, chatbot safeguards, cache behaviour, reconciliation, interpolation"],
          ],
        },
      ],
    },
  ],
};
