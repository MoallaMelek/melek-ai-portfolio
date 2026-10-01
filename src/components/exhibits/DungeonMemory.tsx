"use client";

import { useEffect, useRef, useState } from "react";

// From Reinforcement-Learning-Memory-Dungeon/results/ablation/showcase_episode.json (verified replay).
type Step = { step: number; action: string; reward: number; hidden: number[]; p: number };
type Data = {
  seed: number;
  resetAfter: number;
  cue: string;
  firstObservation: string;
  control: { success: boolean; timeline: Step[] };
  treatment: { success: boolean; timeline: Step[] };
};

function color(v: number) {
  // Diverging map for tanh activations in [-1, 1]: blue (−) · near-black (0) · amber (+)
  const a = Math.max(-1, Math.min(1, v));
  if (a >= 0) return `rgb(${Math.round(24 + 231 * a)},${Math.round(26 + 150 * a)},${Math.round(29 + 30 * a)})`;
  const b = -a;
  return `rgb(${Math.round(24 + 70 * b)},${Math.round(26 + 110 * b)},${Math.round(29 + 226 * b)})`;
}

function paint(canvas: HTMLCanvasElement, steps: Step[], t: number, resetAt: number | null) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.fillStyle = "#0b0c0d";
  ctx.fillRect(0, 0, w, h);
  const n = steps.length;
  const dims = steps[0].hidden.length;
  const cw = w / n;
  const rh = h / dims;
  for (let s = 0; s < Math.min(t, n); s++) {
    const hs = steps[s].hidden;
    for (let d = 0; d < dims; d++) {
      ctx.fillStyle = color(hs[d]);
      ctx.fillRect(s * cw, d * rh, Math.ceil(cw), Math.ceil(rh));
    }
  }
  if (resetAt !== null) {
    const x = resetAt * cw;
    ctx.strokeStyle = "#ff7a57";
    ctx.setLineDash([3, 3]);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
    ctx.setLineDash([]);
  }
  if (t < n) {
    ctx.fillStyle = "rgba(233,231,225,0.85)";
    ctx.fillRect(Math.min(t, n) * cw, 0, 1.5, h);
  }
}

export function DungeonMemory() {
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState(false);
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);
  const a = useRef<HTMLCanvasElement>(null);
  const b = useRef<HTMLCanvasElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    fetch("/data/dungeon.json")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d: Data) => {
        setData(d);
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        setT(reduced ? d.control.timeline.length : 0);
      })
      .catch(() => setError(true));
  }, []);

  const n = data?.control.timeline.length ?? 0;

  // Start playing the first time the exhibit scrolls into view.
  useEffect(() => {
    if (!data || !root.current) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !started.current && !reduced) {
          started.current = true;
          setT(0);
          setPlaying(true);
        }
        if (!e.isIntersecting) setPlaying(false);
      },
      { threshold: 0.35 },
    );
    io.observe(root.current);
    return () => io.disconnect();
  }, [data]);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setT((x) => {
        if (x >= n) {
          setPlaying(false);
          return x;
        }
        return x + 1;
      });
    }, 260);
    return () => window.clearInterval(id);
  }, [playing, n]);

  useEffect(() => {
    if (!data) return;
    const draw = () => {
      if (a.current) paint(a.current, data.control.timeline, t, null);
      if (b.current) paint(b.current, data.treatment.timeline, t, data.resetAfter);
    };
    draw();
    const ro = new ResizeObserver(draw);
    if (root.current) ro.observe(root.current);
    return () => ro.disconnect();
  }, [data, t]);

  if (error) {
    return <div className="media__fail" style={{ position: "relative", minHeight: 200 }}>The replay data could not be loaded.</div>;
  }

  const at = (side: "control" | "treatment") => data?.[side].timeline[Math.max(0, Math.min(t, n) - 1)];
  const done = t >= n;
  const obs = data?.firstObservation ?? "";
  const cueLine = obs.split("\n").find((l) => l.includes(data?.cue ?? "MOON")) ?? "";

  return (
    <div className="exhibit plate" ref={root}>
      <div className="exhibit__bar">
        <span className="label">
          Verified replay · seed {data?.seed ?? "…"} · memory reset after decision {data?.resetAfter ?? "…"}
        </span>
        <span className="label">64 hidden units × {n || "…"} decisions</span>
      </div>
      <div className="dungeon__grid">
        <div className="dungeon__side">
          <div className="goblin__who">
            <b style={{ color: "#8aa5ff" }}>Control · memory intact</b>
          </div>
          <canvas ref={a} role="img" aria-label="Heatmap of the GRU hidden state over the control episode" />
          <div className="dungeon__choice">
            <span>
              action <b>{at("control")?.action ?? "—"}</b>
            </span>
            {done ? <span className={data?.control.success ? "ok" : "bad"}>{data?.control.success ? "Escaped" : "Failed"}</span> : null}
          </div>
        </div>
        <div className="dungeon__side">
          <div className="goblin__who">
            <b style={{ color: "#ff7a57" }}>Treatment · hidden state reset</b>
          </div>
          <canvas ref={b} role="img" aria-label="Heatmap of the GRU hidden state with a reset after decision 8" />
          <div className="dungeon__choice">
            <span>
              action <b>{at("treatment")?.action ?? "—"}</b>
            </span>
            {done ? <span className={data?.treatment.success ? "ok" : "bad"}>{data?.treatment.success ? "Escaped" : "Wrong seal"}</span> : null}
          </div>
        </div>
      </div>
      <div className="dungeon__obs">
        <pre aria-label="First observation shown to the agent">
          {obs.split("\n").map((line, k) =>
            line === cueLine ? (
              <span key={k} className="cue">
                {line + "\n"}
              </span>
            ) : (
              line + "\n"
            ),
          )}
        </pre>
        <div style={{ display: "grid", gap: 10, alignContent: "start" }}>
          <p className="goblin__reward" style={{ margin: 0 }}>
            <span>Decision 0 is the only time the seal is visible. </span>
            The two agents act identically until the final choice, 33 decisions later. Only the one that kept its memory invokes{" "}
            {data?.cue ?? "MOON"}.
          </p>
          <div className="scrub">
            <button
              type="button"
              className="tbtn"
              onClick={() => {
                if (done) setT(0);
                setPlaying((p) => !p);
              }}
            >
              {playing ? "Pause" : done ? "Replay" : "Play"}
            </button>
            <label className="sr-only" htmlFor="dungeon-scrub">
              Decision
            </label>
            <input
              id="dungeon-scrub"
              type="range"
              min={0}
              max={n || 1}
              value={Math.min(t, n)}
              onChange={(e) => {
                setPlaying(false);
                setT(Number(e.target.value));
              }}
            />
            <span className="mono">
              {String(Math.min(t, n)).padStart(2, "0")}/{n}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
