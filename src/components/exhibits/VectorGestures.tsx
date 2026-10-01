"use client";

import { useState } from "react";

// Gesture rules and accident guards from the Vector-CS README; images are the real HUD painter.
const GESTURES = [
  { name: "Point", does: "Cursor", img: "hud-hover", rule: "Index extended, others curled. EMA smoothing, hysteresis and a time confirmation before the pose counts." },
  { name: "Pinch", does: "Click / lock", img: "hud-pinch", rule: "Thumb–index distance ÷ palm length < 0.28, release > 0.42. Click only on an observed release within 0.28 s; target taken 100 ms before pinch onset." },
  { name: "Pinch + move", does: "Drag window", img: "hud-drag", rule: "Pinch held 0.3 s or palm moves > 0.05 hand-lengths. The window lock persists even when the cursor leaves it." },
  { name: "Fast release", does: "Throw / snap", img: "hud-throw", rule: "Release while moving > 2.4 hand-lengths/s, sustained and direction-consistent. “Down” needs 30% more speed." },
  { name: "Palm, hold", does: "App carousel", img: "hud-carousel", rule: "One open palm still for 0.9 s, then 0.45 hand-lengths per app. Two palms mean sleep instead." },
  { name: "Three fingers", does: "Draw", img: "hud-draw", rule: "Held still for 0.7 s; fires once per entry. Strokes are spline-smoothed and cached." },
];

export function VectorGestures() {
  const [i, setI] = useState(1);
  return (
    <div className="screen">
      <div className="gest">
        <div>
          <p className="label" style={{ marginBottom: 10 }}>
            Gesture · what Windows does
          </p>
          <ul className="gest__list">
            {GESTURES.map((g, k) => (
              <li key={g.name}>
                <button
                  type="button"
                  aria-pressed={k === i}
                  onClick={() => setI(k)}
                  onMouseEnter={() => setI(k)}
                  onFocus={() => setI(k)}
                >
                  <b>{g.name}</b>
                  <span>{g.does}</span>
                </button>
              </li>
            ))}
          </ul>
          <p className="gest__guard" aria-live="polite">
            {GESTURES[i].rule}
          </p>
        </div>
        <div className="gest__view">
          {GESTURES.map((g, k) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={g.img}
              src={`/projects/vector/${g.img}.webp`}
              alt={`Vector HUD: ${g.name} → ${g.does}`}
              width={1600}
              height={900}
              loading="lazy"
              decoding="async"
              className={k === i ? "is-on" : ""}
              aria-hidden={k !== i}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
