import type { Block, Flow, Metric } from "@/content/types";
import { DungeonMemory } from "./exhibits/DungeonMemory";
import { GoblinReplay } from "./exhibits/GoblinReplay";
import { HydraDiagram } from "./exhibits/HydraDiagram";
import { TelekinesisSteps } from "./exhibits/TelekinesisSteps";
import { VectorGestures } from "./exhibits/VectorGestures";
import { MediaFigure } from "./Media";

export function Metrics({ items }: { items: Metric[] }) {
  return (
    <div className="metrics">
      {items.map((x) => (
        <div className="metric" key={x.label}>
          <b>{x.value}</b>
          <span>{x.label}</span>
          {x.note ? <small>{x.note}</small> : null}
        </div>
      ))}
    </div>
  );
}

export function FlowDiagram({ flow, caption }: { flow: Flow; caption?: string }) {
  return (
    <div>
      <ol className="flow" aria-label="Pipeline, in order">
        {flow.stages.map((s, i) => (
          <li className="flow__stage" key={s.label} style={{ "--i": i } as React.CSSProperties}>
            <div className="flow__label">{s.label}</div>
            {s.lanes ? (
              <ul className="flow__lanes">
                {s.lanes.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            ) : null}
            {s.note ? <p className="flow__note">{s.note}</p> : null}
          </li>
        ))}
      </ol>
      {caption ? <p className="flow-cap">{caption}</p> : null}
    </div>
  );
}

export function Spec({ items }: { items: [string, string][] }) {
  return (
    <dl className="spec">
      {items.map(([k, v]) => (
        <div key={k}>
          <dt>{k}</dt>
          <dd>{v}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Percent cells get a thin bar so the eye can compare without reading every number. */
function Cell({ value, numeric }: { value: string; numeric: boolean }) {
  const pct = numeric ? /^(\d+(?:\.\d+)?)%$/.exec(value.trim()) : null;
  if (!numeric) return <td>{value}</td>;
  return (
    <td className="n bar-cell">
      {value}
      {pct ? <i style={{ "--w": `${Math.min(100, Number(pct[1]))}%` } as React.CSSProperties} aria-hidden /> : null}
    </td>
  );
}

export function DataTable({ head, rows, caption, numeric = [] }: { head: string[]; rows: string[][]; caption?: string; numeric?: number[] }) {
  return (
    <div className="table-wrap">
      <table>
        {caption ? <caption>{caption}</caption> : null}
        <thead>
          <tr>
            {head.map((h) => (
              <th key={h} scope="col">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={ri}>
              <th scope="row">{r[0]}</th>
              {r.slice(1).map((c, ci) => (
                <Cell key={ci} value={c} numeric={numeric.includes(ci + 1)} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Exhibit({ id }: { id: Extract<Block, { type: "exhibit" }>["id"] }) {
  switch (id) {
    case "goblin":
      return <GoblinReplay />;
    case "dungeon":
      return <DungeonMemory />;
    case "hydra":
      return <HydraDiagram />;
    case "telekinesis":
      return <TelekinesisSteps />;
    case "vector-gestures":
      return <VectorGestures />;
  }
}

export function RenderBlock({ block }: { block: Block }) {
  switch (block.type) {
    case "prose":
      return (
        <div className="prose">
          {block.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      );
    case "media":
      return <MediaFigure media={block.media} className={`media--${block.size ?? "wide"}`} contain={block.media.kind === "image"} />;
    case "gallery":
      return (
        <div className={`gallery gallery--${block.columns ?? 2}`}>
          {block.items.map((m) => (
            <MediaFigure key={m.src} media={m} ratio={m.kind === "image" ? "16 / 10" : undefined} contain={m.kind === "image"} />
          ))}
        </div>
      );
    case "metrics":
      return <Metrics items={block.items} />;
    case "table":
      return <DataTable {...block} />;
    case "flow":
      return <FlowDiagram flow={block.flow} caption={block.caption} />;
    case "spec":
      return <Spec items={block.items} />;
    case "notes":
      return (
        <div className="notes">
          {block.items.map((n) => (
            <div className="note" key={n.title}>
              <h3>{n.title}</h3>
              <p>{n.body}</p>
            </div>
          ))}
        </div>
      );
    case "quote":
      return (
        <blockquote className="pull">
          <p>{block.text}</p>
        </blockquote>
      );
    case "exhibit":
      return <Exhibit id={block.id} />;
  }
}
