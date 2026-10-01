import { m, v } from "../media";
import type { Project } from "../types";

const S = "ghosthands";

export const ghosthands: Project = {
  slug: S,
  title: "GhostHands",
  oneLiner: "Demonstrate a pick-and-place with your hand, change the scene, and test what a learned policy actually generalises.",
  question: "Does imitation transfer a goal-conditioned skill to layouts it has never seen?",
  year: "2026",
  status: "Working MVP · simulator only · human data not yet collected",
  domains: ["rl", "vision"],
  stack: ["Python", "PyTorch", "MediaPipe", "JavaScript", "FastAPI"],
  repo: "https://github.com/MoallaMelek/GhostHands",
  headline: { value: "46% → 97%", label: "held-out success of the same MLP when raw poses become relative geometry", note: "100 paired layouts" },
  cover: v(S, "demo", "Synthetic teacher demonstration on the left, learned relative policy executing on a new layout on the right"),
  preview: v(S, "demo", "GhostHands demonstration and learned transfer"),
  hue: 160,
  limits: [
    "The included checkpoints use synthetic teacher demonstrations, not human webcam data. Human recording is implemented but unvalidated with a participant.",
    "A kinematic simulator with exactly known object state: no contact forces, friction, inverse kinematics or perception noise.",
    "A single training seed; the recurrent policy is also larger, so its gains do not isolate temporal context from capacity.",
  ],
  sections: [
    {
      id: "idea",
      title: "The idea",
      blocks: [
        {
          type: "prose",
          body: [
            "Control a virtual gripper with your hand through the webcam: palm position moves it, pushing toward the camera lowers it, turning your hand like a dial rotates it, a pinch closes it. Record complete pick, rotate and place episodes, train a PyTorch policy, then run it in a different layout. During execution you can move the target or the object to test recovery.",
            "The robot side has no scripted fallback. Every action comes from the learned checkpoint and the current scene.",
          ],
        },
        { type: "media", media: m(S, "interface", "GhostHands interface with live teleoperation on the left and learned execution on the right"), size: "wide" },
      ],
    },
    {
      id: "results",
      title: "One attractive rollout is not the evaluation",
      blocks: [
        {
          type: "table",
          caption: "Task success over 100 layout seeds per suite; the same layouts are used for every policy. CPU run, seed 42, 60 epochs, 240 synthetic training episodes. 1,600 rollouts in total.",
          head: ["Policy", "Held-out", "Wider range", "Moved target", "Moved object"],
          numeric: [1, 2, 3, 4],
          rows: [
            ["Exact replay", "0%", "0%", "0%", "0%"],
            ["Absolute BC (MLP)", "46%", "36%", "45%", "17%"],
            ["Relative BC (MLP)", "97%", "93%", "98%", "68%"],
            ["Recurrent BC (GRU)", "100%", "98%", "99%", "97%"],
          ],
        },
        { type: "media", media: m(S, "results", "Bar chart of success with Wilson intervals across four evaluation suites"), size: "wide" },
        {
          type: "prose",
          body: [
            "The interesting jump is representation, not depth: the same MLP goes from 46% to 97% when its inputs become relative geometry instead of raw poses. Mean placement error on held-out layouts drops from 34.7 cm (replay) to 2.1 cm (relative) and 1.2 cm (recurrent), with failed trials included.",
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
          flow: {
            stages: [
              { label: "Teleoperation", lanes: ["webcam: 21 landmarks + One Euro filters", "pointer fallback"] },
              { label: "Deterministic tabletop", note: "xyz, yaw, binary closure, gravity, attachment constraint" },
              { label: "Episode JSON + provenance", note: "train / validation split by episode" },
              { label: "Behaviour cloning", lanes: ["MLP 14→128→128→5", "GRU(96) over 8 frames"] },
              { label: "Paired evaluation", lanes: ["held-out", "wider range", "target shift", "object shift"] },
            ],
          },
        },
        {
          type: "spec",
          items: [
            ["Observation", "14 scalars: relative xy (translation-invariant), heights, yaw as relative sin/cos, grip, contact"],
            ["Action", "5 scalars: motion via tanh + MSE, closure via logit + BCE"],
            ["Training", "AdamW, gradient clipping, deterministic PyTorch, checkpoint chosen on validation loss only"],
            ["Success", "Released open, position error < 5.5 cm, yaw error < 0.25 rad, held for 6 steps"],
            ["Splits", "Train seeds 0–239, validation 10000–10039, each test suite its own seed range"],
          ],
        },
      ],
    },
  ],
};
