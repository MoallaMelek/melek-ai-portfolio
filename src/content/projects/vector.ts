import { m, v } from "../media";
import type { Project } from "../types";

const S = "vector";

export const vector: Project = {
  slug: S,
  title: "Vector",
  oneLiner: "A webcam becomes a spatial input device: pinch, drag and throw real Windows windows with your hands.",
  question: "Can an ordinary webcam feel like a trackpad that floats in the air, without firing when you just wave?",
  year: "2026",
  status: "Working app · 146 tests · live-hand tuning still to do",
  domains: ["vision"],
  stack: ["Python", "MediaPipe", "OpenCV", "NumPy", "Qt", "Win32 API", "PyTorch"],
  repo: "https://github.com/MoallaMelek/Vector-CS",
  headline: { value: "1 in 11.5 min", label: "accidental commands under adversarial synthetic motion; zero clicks, drags or throws" },
  cover: v(S, "hud-demo", "Vector heads-up display: grab, drag, throw-to-snap and air drawing"),
  preview: v(S, "hud-demo", "Vector HUD replay"),
  hue: 200,
  limits: [
    "The demo is the real HUD painter and gesture engine driven by a synthetic hand. A live screen recording is still to be made.",
    "Thresholds have not yet been tuned with real hands in front of the camera; multi-monitor throws are tested only on synthetic layouts.",
    "The learned GRU/TCN pipeline runs end to end but has not been compared on real recordings, so the deterministic engine stays in charge.",
  ],
  sections: [
    {
      id: "what",
      title: "What it does",
      blocks: [
        {
          type: "prose",
          body: [
            "Vector watches your hands and moves real windows, not a mock-up, through the Win32 API. Point to aim, pinch to click, pinch and hold to grab, release while moving fast to throw a window to a screen edge or another monitor. Two hands resize; an open palm switches apps; three fingers draw on the screen.",
          ],
        },
        { type: "exhibit", id: "vector-gestures" },
      ],
    },
    {
      id: "hard-part",
      title: "The hard part is not firing",
      blocks: [
        {
          type: "prose",
          body: [
            "“Does the swipe fire?” is easy. “Does aimless motion not fire anything?” is where the design effort went. Every gesture is a temporal pattern over a state machine, never a single frame: a throw is an established drag, then sustained consistent velocity, then an observed release.",
            "A pure velocity detector fired 24 times in 12 simulated minutes of random motion. Requiring a pause before the flick and a crisp pose for the whole stroke brought that to 1.",
          ],
        },
        {
          type: "metrics",
          items: [
            { value: "~17 ms", label: "median hand inference, two hands" },
            { value: "0.8 ms", label: "gesture pipeline per frame (6 ms before vectorising)" },
            { value: "120 Hz", label: "actuator loop interpolating between 30 fps camera frames" },
            { value: "146", label: "tests, no webcam needed, including real Win32 window moves" },
          ],
        },
      ],
    },
    {
      id: "cv",
      title: "Computer vision decisions",
      blocks: [
        {
          type: "notes",
          items: [
            { title: "Two coordinate systems on purpose", body: "Hand shape (finger curl, pinch ratio, palm orientation) comes from MediaPipe's metric world landmarks. Position and motion come from image space, divided by a foreshortening-robust hand scale, so speeds are in hand-lengths per second and behave the same at 40 cm or 1.5 m." },
            { title: "Handedness is a vote, not a fact", body: "Per-frame labels flicker. Tracks accumulate a belief about which hand they are; two simultaneous “Right” hands are resolved by certainty, then position." },
            { title: "Click stabilisation", body: "Closing a pinch drags the fingertip toward the thumb. Vector locks the target from the cursor 100 ms before the pinch began, then anchors the pointer to palm motion." },
            { title: "A cursor that feels like a trackpad", body: "One-Euro filter, hybrid gain curve, drift correction only while moving, a 3 px rope dead zone, and a critically damped spring in the 120 Hz actuator." },
          ],
        },
        {
          type: "gallery",
          columns: 2,
          items: [
            m(S, "hud-pinch", "Pinch locks onto the window under the cursor", "Pinch locks the target."),
            m(S, "hud-throw", "Throw right snaps the window to the right half", "Throw right: snap."),
            m(S, "hud-carousel", "App carousel opened by holding an open palm still", "Hold a palm still: app carousel."),
            m(S, "hud-draw", "Air drawing with spline smoothing", "Three fingers: draw in the air."),
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
          type: "flow",
          caption: "Five threads. Only the actuator touches the OS, and it refuses commands from a previous activation generation or that are too old to reflect intent.",
          flow: {
            stages: [
              { label: "Camera thread", note: "latest frame only, never a stale queue" },
              { label: "Vision thread", lanes: ["MediaPipe HandLandmarker", "sticky hand identity", "scale-invariant features", "temporal gesture engine", "intent engine"] },
              { label: "Actuator · 120 Hz", lanes: ["generation gate", "springs + scroll inertia", "watchdog"] },
              { label: "Win32", lanes: ["SetWindowPos", "SendInput"] },
            ],
          },
        },
        {
          type: "notes",
          items: [
            { title: "Safety first", body: "Esc Esc runs in a low-level keyboard hook on its own thread and disarms the actuator immediately; it ignores synthetic keystrokes, so gestures can never trigger or suppress it. A watchdog stops motion if vision stalls for 0.4 s." },
            { title: "Windows quirks", body: "Per-monitor-v2 DPI awareness with all math in physical pixels; positioning on DWM extended frame bounds to cancel invisible borders; the empty-input technique PowerToys uses to get past foreground lock." },
            { title: "Learned models must earn their place", body: "Recorded landmark clips train a GRU and a TCN with leave-one-session-out validation. A learned model replaces a heuristic gesture only if it wins on held-out sessions." },
            { title: "Reviewed by a second agent", body: "Built with Claude Code as writer; OpenAI Codex CLI reviewed it cold and found 9 issues, 2 of them safety-relevant. All were fixed, each with a regression test that fails on the old code." },
          ],
        },
      ],
    },
  ],
};
