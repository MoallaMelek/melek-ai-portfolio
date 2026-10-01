"use client";

import { useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";

type Depth = "overview" | "deep";

/** Global switch between the visual overview and the engineering detail ("Under the hood").
 *  All content is server-rendered; this only flips a data attribute that CSS reads. */
export function DepthToggle() {
  const depth = useSyncExternalStore(
    subscribe,
    readDepth,
    () => "overview" as Depth,
  );
  const pathname = usePathname();
  if (!pathname.startsWith("/projects/")) return null;

  return (
    <div className="depth" role="group" aria-label="Level of detail">
      <button
        type="button"
        aria-pressed={depth === "overview"}
        onClick={() => setDepthGlobal("overview")}
      >
        <span className="long">Overview</span>
        <span className="short">View</span>
      </button>
      <button
        type="button"
        aria-pressed={depth === "deep"}
        onClick={() => setDepthGlobal("deep")}
      >
        <span className="long">Under the hood</span>
        <span className="short">Deep</span>
      </button>
    </div>
  );
}

function subscribe(cb: () => void) {
  window.addEventListener("depthchange", cb);
  return () => window.removeEventListener("depthchange", cb);
}

function readDepth(): Depth {
  return document.documentElement.dataset.depth === "deep"
    ? "deep"
    : "overview";
}

export function setDepthGlobal(d: Depth) {
  if (d === "deep") document.documentElement.dataset.depth = "deep";
  else delete document.documentElement.dataset.depth;
  try {
    localStorage.setItem("depth", d);
  } catch {}
  window.dispatchEvent(new CustomEvent("depthchange", { detail: d }));
}

/** Inline button used inside content ("show the engineering detail"). */
export function DepthLink({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="button"
      className="chip"
      onClick={() => setDepthGlobal("deep")}
    >
      {children}
    </button>
  );
}
