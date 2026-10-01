"use client";

import { useState } from "react";

/** Technologies grouped by how they are used. Selecting one lists the work that actually uses it. */
export function Toolbox({ groups, usage }: { groups: { label: string; tools: string[] }[]; usage: Record<string, string[]> }) {
  const [tool, setTool] = useState("PyTorch");
  const used = usage[tool] ?? [];
  return (
    <div className="tools">
      <div className="tools__groups">
        {groups.map((g) => (
          <div className="tools__group" key={g.label}>
            <p className="label" style={{ margin: 0 }}>
              {g.label}
            </p>
            <div className="tools__chips" role="group" aria-label={g.label}>
              {g.tools
                .filter((t) => usage[t])
                .map((t) => (
                  <button key={t} type="button" className="tool" aria-pressed={t === tool} onClick={() => setTool(t)}>
                    {t}
                    <sup>{usage[t].length}</sup>
                  </button>
                ))}
            </div>
          </div>
        ))}
      </div>
      <div className="tools__used" aria-live="polite">
        <p className="label" style={{ margin: 0 }}>
          Used in {used.length} {used.length === 1 ? "project" : "projects"}
        </p>
        <h3>{tool}</h3>
        <ul>
          {used.map((u) => (
            <li key={u}>{u}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
