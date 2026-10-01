"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Episode files are produced by scripts/prepare_data.py from Reward-Goblin/recordings (real PPO runs).
type Side = {
  agent: [number, number][];
  box: [number, number][];
  cum: number[];
  inside: number[];
  overlap: number[];
  trueSuccess: boolean;
  return: number;
  length: number;
  termination: string;
};
type Episode = {
  id: string;
  name: string;
  version: string;
  reward: string;
  runId: string;
  seed: number;
  layoutSeed: number;
  layout: {
    name: string;
    width: number;
    height: number;
    walls: number[][];
    obstacles: number[][];
    hazards: number[][];
    goal: number[];
  };
  exploits: { label: string; step: number; evidence: string }[];
  policy: Side;
  reference: Side;
};

const TABS = [
  { id: "edge", label: "Edge" },
  { id: "speed", label: "Speed" },
  { id: "wall", label: "Wall" },
  { id: "lava", label: "Lava" },
  { id: "distance", label: "Distance" },
  { id: "fixed", label: "Fixed (v2)" },
];

const HZ = 15; // the environment's control rate: replay runs in real time at 1×
const AGENT_R = 0.3;
const BOX_HALF = 0.4;
const C = {
  floor: "#15171a",
  grid: "rgba(233,231,225,0.05)",
  border: "rgba(233,231,225,0.22)",
  goal: "#3ecf7f",
  wall: "#d8d5cd",
  lava: "#ff5a33",
  box: "#e9c46a",
  intend: "#7d9bff",
  policy: "#ff7a57",
  trail: "rgba(233,231,225,0.22)",
};

const cache = new Map<string, Promise<Episode>>();
function load(id: string) {
  if (!cache.has(id)) {
    cache.set(
      id,
      fetch(`/data/goblins/${id}.json`).then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      }),
    );
  }
  return cache.get(id)!;
}

function draw(
  canvas: HTMLCanvasElement,
  ep: Episode,
  side: Side,
  t: number,
  color: string,
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const cw = canvas.clientWidth;
  const ch = canvas.clientHeight;
  if (
    canvas.width !== Math.round(cw * dpr) ||
    canvas.height !== Math.round(ch * dpr)
  ) {
    canvas.width = Math.round(cw * dpr);
    canvas.height = Math.round(ch * dpr);
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, cw, ch);

  const L = ep.layout;
  const s = Math.min(cw / L.width, ch / L.height);
  const ox = (cw - s * L.width) / 2;
  const oy = (ch - s * L.height) / 2;
  const X = (x: number) => ox + x * s;
  const Y = (y: number) => oy + (L.height - y) * s; // world is y-up
  const rect = (r: number[]) =>
    [X(r[0]), Y(r[3]), (r[2] - r[0]) * s, (r[3] - r[1]) * s] as const;

  ctx.fillStyle = C.floor;
  ctx.fillRect(X(0), Y(L.height), L.width * s, L.height * s);
  ctx.strokeStyle = C.grid;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = 1; x < L.width; x++) {
    ctx.moveTo(X(x), Y(0));
    ctx.lineTo(X(x), Y(L.height));
  }
  for (let y = 1; y < L.height; y++) {
    ctx.moveTo(X(0), Y(y));
    ctx.lineTo(X(L.width), Y(y));
  }
  ctx.stroke();

  for (const h of L.hazards) {
    const [x, y, w, hh] = rect(h);
    ctx.fillStyle = "rgba(255,90,51,0.22)";
    ctx.fillRect(x, y, w, hh);
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, w, hh);
    ctx.clip();
    ctx.strokeStyle = "rgba(255,90,51,0.55)";
    ctx.beginPath();
    for (let k = -hh; k < w + hh; k += 7) {
      ctx.moveTo(x + k, y);
      ctx.lineTo(x + k + hh, y + hh);
    }
    ctx.stroke();
    ctx.restore();
  }

  // Clamp to recorded coordinates: the two episodes can have different lengths.
  const frame = Number.isFinite(t) ? Math.floor(t) : 0;
  const i = Math.max(0, Math.min(frame, side.box.length - 1, side.agent.length - 1));
  if (!side.box[i] || !side.agent[i]) return;
  const g = rect(L.goal);
  const inside = side.inside[i] === 1;
  ctx.fillStyle = inside ? "rgba(62,207,127,0.28)" : "rgba(62,207,127,0.1)";
  ctx.fillRect(...g);
  ctx.strokeStyle = C.goal;
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 3]);
  ctx.strokeRect(...g);
  ctx.setLineDash([]);
  ctx.fillStyle = C.goal;
  ctx.font = `600 ${Math.max(9, s * 0.26)}px ui-monospace, monospace`;
  ctx.fillText("EXIT", g[0] + 4, g[1] + Math.max(11, s * 0.32));

  ctx.fillStyle = C.wall;
  for (const w of [...L.walls, ...L.obstacles]) ctx.fillRect(...rect(w));
  ctx.strokeStyle = C.border;
  ctx.lineWidth = 1;
  ctx.strokeRect(
    X(0) + 0.5,
    Y(L.height) + 0.5,
    L.width * s - 1,
    L.height * s - 1,
  );

  // trails: where the box and the actor have been
  const trail = (pts: [number, number][], col: string, width: number) => {
    if (i < 1) return;
    ctx.strokeStyle = col;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(X(pts[0][0]), Y(pts[0][1]));
    for (let k = 1; k <= i; k++) ctx.lineTo(X(pts[k][0]), Y(pts[k][1]));
    ctx.stroke();
  };
  trail(side.agent, color + "55", 1);
  trail(side.box, C.trail, 1.5);

  const [bx, by] = side.box[i];
  ctx.fillStyle = C.box;
  ctx.fillRect(
    X(bx - BOX_HALF),
    Y(by + BOX_HALF),
    2 * BOX_HALF * s,
    2 * BOX_HALF * s,
  );
  ctx.strokeStyle = "rgba(0,0,0,0.35)";
  ctx.strokeRect(
    X(bx - BOX_HALF) + 3,
    Y(by + BOX_HALF) + 3,
    2 * BOX_HALF * s - 6,
    2 * BOX_HALF * s - 6,
  );

  const [ax, ay] = side.agent[i];
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(X(ax), Y(ay), AGENT_R * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = C.floor;
  ctx.beginPath();
  ctx.arc(
    X(ax) - AGENT_R * s * 0.32,
    Y(ay) - AGENT_R * s * 0.15,
    AGENT_R * s * 0.16,
    0,
    Math.PI * 2,
  );
  ctx.arc(
    X(ax) + AGENT_R * s * 0.32,
    Y(ay) - AGENT_R * s * 0.15,
    AGENT_R * s * 0.16,
    0,
    Math.PI * 2,
  );
  ctx.fill();
}

export function GoblinReplay({
  initial = "edge",
  compact = false,
}: {
  initial?: string;
  compact?: boolean;
}) {
  const [id, setId] = useState(initial);
  const [ep, setEp] = useState<Episode | null>(null);
  const [error, setError] = useState(false);
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(compact ? 2 : 1);
  const leftRef = useRef<HTMLCanvasElement>(null);
  const rightRef = useRef<HTMLCanvasElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const visible = useRef(false);
  const tRef = useRef(0);
  const userPaused = useRef(false);

  const total = ep ? Math.max(ep.policy.length, ep.reference.length) : 0;

  useEffect(() => {
    let alive = true;
    let settled = false;
    const accept = (e: Episode) => {
      if (!alive) return;
      if (settled) return;
      settled = true;
      window.clearTimeout(retry);
      setError(false);
      setEp(e);
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const start = reduced ? Math.max(e.policy.length, e.reference.length) : 0;
      tRef.current = start;
      setT(start);
      setPlaying(!reduced && !userPaused.current);
    };
    const fail = () => {
      if (alive && !settled) {
        cache.delete(id);
        setError(true);
      }
    };
    // If the first request stalls (e.g. the page was opened in a background tab), retry once.
    const retry = window.setTimeout(() => {
      if (!alive) return;
      cache.delete(id);
      load(id).then(accept).catch(fail);
    }, 4000);
    load(id).then(accept).catch(fail);
    return () => {
      alive = false;
      window.clearTimeout(retry);
    };
  }, [id]);

  // Prefetch the other episodes once the first one is in, so switching tabs is instant.
  useEffect(() => {
    if (!ep) return;
    const idle =
      window.requestIdleCallback ??
      ((cb: () => void) => window.setTimeout(cb, 600));
    idle(() => TABS.forEach((x) => load(x.id).catch(() => {})));
  }, [ep]);

  const paint = useCallback(() => {
    if (!ep) return;
    const f = Math.floor(tRef.current);
    if (leftRef.current) draw(leftRef.current, ep, ep.reference, f, C.intend);
    if (rightRef.current) draw(rightRef.current, ep, ep.policy, f, C.policy);
  }, [ep]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      ([e]) => (visible.current = e.isIntersecting),
      { threshold: 0.1 },
    );
    io.observe(root);
    const ro = new ResizeObserver(() => paint());
    ro.observe(root);
    return () => {
      io.disconnect();
      ro.disconnect();
    };
  }, [paint]);

  useEffect(() => {
    paint();
  }, [paint, t]);

  useEffect(() => {
    if (!playing || !ep) return;
    let raf = 0;
    let last = performance.now();
    let hold = 0;
    const loop = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      if (visible.current) {
        if (tRef.current >= total) {
          hold += dt;
          if (hold > 2.4) {
            hold = 0;
            tRef.current = 0;
          }
        } else {
          tRef.current = Math.min(total, tRef.current + dt * HZ * speed);
        }
        const f = Math.floor(tRef.current);
        setT((prev) => (prev === f ? prev : f));
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [playing, ep, total, speed]);

  const scrub = (v: number) => {
    userPaused.current = true;
    setPlaying(false);
    tRef.current = v;
    setT(v);
  };

  const togglePlay = () => {
    if (!playing && tRef.current >= total) tRef.current = 0;
    userPaused.current = playing;
    setPlaying(!playing);
  };

  const cum = (side: Side) => {
    const x = side.cum[Math.min(t, side.cum.length - 1)] ?? 0;
    return Math.abs(x) < 0.05 ? 0 : x;
  };
  const verdict = (side: Side) =>
    t >= side.length
      ? side.trueSuccess
        ? "Task done"
        : "Task failed"
      : "running";
  const flagged = ep?.exploits.filter((x) => x.step <= t) ?? [];

  return (
    <div className="exhibit plate goblin" ref={rootRef}>
      <div className="exhibit__bar">
        <div
          className="exhibit__tabs"
          role="group"
          aria-label="Choose an experiment"
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              aria-pressed={tab.id === id}
              onClick={() => {
                setError(false);
                setId(tab.id);
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <span className="label">
          {ep ? `${ep.runId} · layout ${ep.layoutSeed}` : "loading replay…"}
        </span>
      </div>

      {error ? (
        <div
          className="media__fail"
          style={{ position: "relative", minHeight: 240 }}
        >
          The replay data could not be loaded. The same episodes are in the
          repository as GIFs.
        </div>
      ) : (
        <>
          <div className="goblin__arenas">
            <div className="goblin__side goblin__side--intend">
              <div className="goblin__who">
                <b>What you intended</b>
                <span className="label">scripted A*</span>
              </div>
              <canvas
                ref={leftRef}
                role="img"
                aria-label="Scripted reference controller pushing the box into the exit"
              />
              {ep ? (
                <div className="goblin__score">
                  <div>
                    reward <strong>{cum(ep.reference).toFixed(1)}</strong>
                  </div>
                  <div
                    className={`goblin__verdict ${t >= ep.reference.length ? (ep.reference.trueSuccess ? "ok" : "bad") : ""}`}
                  >
                    {verdict(ep.reference)}
                  </div>
                </div>
              ) : null}
            </div>
            <div className="goblin__side goblin__side--policy">
              <div className="goblin__who">
                <b>What you rewarded</b>
                <span className="label">PPO policy</span>
              </div>
              <canvas
                ref={rightRef}
                role="img"
                aria-label="Trained PPO policy replay on the identical start state"
              />
              {ep ? (
                <div className="goblin__score">
                  <div>
                    reward <strong>{cum(ep.policy).toFixed(1)}</strong>
                  </div>
                  <div
                    className={`goblin__verdict ${t >= ep.policy.length ? (ep.policy.trueSuccess ? "ok" : "bad") : ""}`}
                  >
                    {verdict(ep.policy)}
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <div className="goblin__foot">
            {ep ? (
              <p className="goblin__reward">
                <span>
                  {ep.name} · {ep.version}. Reward:{" "}
                </span>
                {ep.reward}
              </p>
            ) : null}
            <p className="goblin__alert" aria-live="polite">
              {flagged.length
                ? `⚠ ${flagged[0].label} — ${flagged[0].evidence}`
                : ep && ep.exploits.length === 0
                  ? "No exploit detected. The reward and the task finally agree."
                  : " "}
            </p>
            <div className="scrub">
              <button
                type="button"
                className="tbtn"
                onClick={togglePlay}
                aria-label={playing ? "Pause replay" : "Play replay"}
              >
                {playing ? "Pause" : "Play"}
              </button>
              <button
                type="button"
                className="tbtn"
                onClick={() => setSpeed((x) => (x === 1 ? 2 : x === 2 ? 4 : 1))}
                aria-label={`Playback speed ${speed} times`}
              >
                {speed}×
              </button>
              <label className="sr-only" htmlFor={`scrub-${id}`}>
                Replay step
              </label>
              <input
                id={`scrub-${id}`}
                type="range"
                min={0}
                max={total || 1}
                value={t}
                onChange={(e) => scrub(Number(e.target.value))}
              />
              <span className="mono">
                {String(t).padStart(3, "0")}/{total}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
