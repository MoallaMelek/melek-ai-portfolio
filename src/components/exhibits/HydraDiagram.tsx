"use client";

import { useState } from "react";

// The seven MCP tools Hydra's manager agent exposes (from the project README).
const TOOLS = [
  { id: "hydra_list_agents", desc: "List all agents with status, model and project.", edges: [0, 1, 2, 3, 4], dir: "up" },
  { id: "hydra_create_agent", desc: "Spawn a new agent in any project directory.", edges: [5], dir: "down", spawn: true },
  { id: "hydra_send_prompt", desc: "Send a message to one specific agent.", edges: [1], dir: "down" },
  { id: "hydra_get_output", desc: "Read recent terminal output from an agent.", edges: [3], dir: "up" },
  { id: "hydra_broadcast", desc: "Send the same prompt to every agent in one project.", edges: [0, 1, 2], dir: "down" },
  { id: "hydra_kill_agent", desc: "Gracefully stop an agent.", edges: [4], dir: "down", kill: true },
  { id: "hydra_restart_agent", desc: "Restart an agent while preserving its session.", edges: [2], dir: "down", pulse: true },
] as const;

const AGENTS = [
  { cli: "claude", project: "api" },
  { cli: "claude", project: "api" },
  { cli: "codex", project: "api" },
  { cli: "claude", project: "web" },
  { cli: "codex", project: "web" },
  { cli: "new", project: "…" },
];

const W = 1000;
const AY = 300;
const AW = 140;
const AX = (i: number) => 40 + i * ((W - 80 - AW) / 5);

export function HydraDiagram() {
  const [tool, setTool] = useState<(typeof TOOLS)[number]>(TOOLS[4]);
  const active = new Set<number>(tool.edges);
  const spawn = "spawn" in tool && tool.spawn;
  const kill = "kill" in tool && tool.kill;
  const pulse = "pulse" in tool && tool.pulse;

  return (
    <div className="exhibit plate hydra">
      <div className="exhibit__bar">
        <span className="label">Hydra · manager agent orchestrating a fleet over MCP</span>
        <span className="label">illustrative fleet · real tool names</span>
      </div>
      <svg viewBox={`0 0 ${W} 400`} role="img" aria-labelledby="hydra-title hydra-desc">
        <title id="hydra-title">Hydra orchestration diagram</title>
        <desc id="hydra-desc">
          A human uses the Hydra desktop app. A manager agent runs an MCP server inside it and calls tools that act on
          up to ten agent terminals. Selected tool: {tool.id}. {tool.desc}
        </desc>
        <defs>
          <style>{`
            .hy-box{fill:#15171a;stroke:rgba(233,231,225,.25)}
            .hy-t{fill:#e9e7e1;font:600 15px var(--font-sans),sans-serif}
            .hy-s{fill:#a3a19b;font:12px var(--font-mono),monospace}
            .hy-e{stroke:rgba(233,231,225,.16);stroke-width:1.5;fill:none}
            .hy-e.on{stroke:#3ecf7f;stroke-width:2;stroke-dasharray:6 6;animation:hy-flow .9s linear infinite}
            .hy-e.on.up{animation-direction:reverse}
            @keyframes hy-flow{to{stroke-dashoffset:-24}}
            .hy-agent.dim{opacity:.28}
            .hy-agent.pulse rect{stroke:#3ecf7f;animation:hy-p 1.2s ease-in-out infinite}
            @keyframes hy-p{50%{stroke-opacity:.2}}
            @media (prefers-reduced-motion: reduce){.hy-e.on,.hy-agent.pulse rect{animation:none}}
          `}</style>
        </defs>

        {/* human + app */}
        <g>
          <rect className="hy-box" x={40} y={30} width={200} height={64} />
          <text className="hy-t" x={56} y={58}>You</text>
          <text className="hy-s" x={56} y={80}>chat view · grid view</text>
          <path className="hy-e" d="M240 62 H 380" />
        </g>
        <g>
          <rect className="hy-box" x={380} y={20} width={260} height={92} style={{ stroke: "#3ecf7f" }} />
          <text className="hy-t" x={398} y={50}>Manager agent</text>
          <text className="hy-s" x={398} y={72}>MCP server · HTTP/SSE</text>
          <text className="hy-s" x={398} y={92} style={{ fill: "#3ecf7f" }}>{tool.id}()</text>
        </g>
        <g>
          <rect className="hy-box" x={760} y={30} width={200} height={64} />
          <text className="hy-t" x={776} y={58}>Headless runs</text>
          <text className="hy-s" x={776} y={80}>JSONL logs · resume</text>
          <path className="hy-e" d="M640 62 H 760" />
        </g>

        {AGENTS.map((a, i) => {
          const x = AX(i);
          const isNew = a.cli === "new";
          const show = !isNew || spawn;
          const on = active.has(i);
          return (
            <g key={i} style={{ opacity: show ? 1 : 0.18, transition: "opacity .4s" }}>
              <path
                className={`hy-e${on ? " on" : ""}${tool.dir === "up" ? " up" : ""}`}
                d={`M510 112 C 510 200, ${x + AW / 2} 210, ${x + AW / 2} ${AY}`}
              />
              <g className={`hy-agent${kill && on ? " dim" : ""}${pulse && on ? " pulse" : ""}`}>
                <rect
                  className="hy-box"
                  x={x}
                  y={AY}
                  width={AW}
                  height={72}
                  style={isNew ? { strokeDasharray: "4 4" } : undefined}
                />
                <text className="hy-t" x={x + 14} y={AY + 28}>
                  {isNew ? "new agent" : a.cli}
                </text>
                <text className="hy-s" x={x + 14} y={AY + 50}>
                  {isNew ? "spawned on demand" : `pty · project ${a.project}`}
                </text>
              </g>
            </g>
          );
        })}
        <text className="hy-s" x={40} y={396}>
          project api
        </text>
        <text className="hy-s" x={AX(3)} y={396}>
          project web
        </text>
      </svg>
      <div className="hydra__tools exhibit__tabs" role="group" aria-label="MCP tools">
        {TOOLS.map((x) => (
          <button key={x.id} type="button" aria-pressed={x.id === tool.id} onClick={() => setTool(x)}>
            {x.id.replace("hydra_", "")}
          </button>
        ))}
      </div>
      <p className="hydra__desc" aria-live="polite">
        <code>{tool.id}</code> — {tool.desc}
      </p>
    </div>
  );
}
