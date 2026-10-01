"use client";

import { useEffect, useRef, useState } from "react";

// Frames from Telekinesis-CV/tools/fixture_demo.py: real EdgeSAM + app logic, synthetic desk and hand.
const STEPS = [
  "Raw scene. Nothing selected.",
  "Touch the mug: EdgeSAM proposes its outline.",
  "Pinch and drag: the mug lifts, its spot is reconstructed.",
  "Release: it floats; the mask is refined from a hand-free view.",
  "Second hand pinches: spread to scale, turn to rotate.",
  "Fist: hide the object, the background stays.",
  "Show again, then duplicate (experimental).",
  "Open palm: reset to where it started.",
];

export function TelekinesisSteps() {
  const [i, setI] = useState(0);
  const [auto, setAuto] = useState(true);
  const root = useRef<HTMLDivElement>(null);
  const visible = useRef(false);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => (visible.current = e.isIntersecting), { threshold: 0.3 });
    if (root.current) io.observe(root.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!auto || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      if (visible.current) setI((x) => (x + 1) % STEPS.length);
    }, 2200);
    return () => window.clearInterval(id);
  }, [auto]);

  return (
    <div className="tk" ref={root}>
      <div className="tk__stage">
        {STEPS.map((s, k) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={k}
            src={`/projects/telekinesis/step-${k + 1}.webp`}
            alt={`Step ${k + 1}: ${s}`}
            width={640}
            height={458}
            loading="lazy"
            decoding="async"
            className={k === i ? "is-on" : ""}
            aria-hidden={k !== i}
          />
        ))}
      </div>
      <div>
        <ol className="tk__steps">
          {STEPS.map((s, k) => (
            <li key={k}>
              <button
                type="button"
                aria-current={k === i ? "step" : undefined}
                onClick={() => {
                  setAuto(false);
                  setI(k);
                }}
              >
                <span>{String(k + 1).padStart(2, "0")}</span>
                {s}
              </button>
            </li>
          ))}
        </ol>
        <p className="mono muted" style={{ marginTop: 12 }}>
          Real pipeline output on the repo&apos;s synthetic desk fixture. No webcam footage.
        </p>
      </div>
    </div>
  );
}
