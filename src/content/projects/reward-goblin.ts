import { m, v } from "../media";
import type { Project } from "../types";

const S = "reward-goblin";

export const rewardGoblin: Project = {
  slug: S,
  title: "Reward Goblin",
  oneLiner: "A physics playground where real PPO agents optimise the reward you wrote instead of the task you meant.",
  question: "If an agent only ever sees a number, what does it learn when the number is slightly wrong?",
  year: "2026",
  status: "Working research demo · 7 experiments · 48 trained runs",
  domains: ["rl"],
  stack: ["Python", "PyTorch", "Stable-Baselines3", "Gymnasium", "Pymunk", "FastAPI", "JavaScript"],
  repo: "https://github.com/MoallaMelek/Reward-Goblin",
  headline: { value: "53.5 vs 3.9", label: "reward earned by the cheating policy vs the correct solution", note: "Edge Goblin v1, seed 1" },
  cover: v(S, "edge", "Split screen: scripted reference parks the box inside the exit; the PPO policy parks it on the edge and farms contact reward"),
  hideCover: true,
  preview: v(S, "edge", "Edge Goblin replay"),
  hue: 38,
  limits: [
    "Exploit detectors are hand-tuned heuristics: diagnostics, not proofs. Expect false negatives on rewards they were not tuned for.",
    "Policies that learn the task on their training map succeed on only 28% of unseen procedural layouts.",
    "The scripted A* reference is not perfect either: 37–40 of 40 per layout type in a spot check. Its failures are reported.",
  ],
  sections: [
    {
      id: "problem",
      title: "The problem",
      blocks: [
        {
          type: "prose",
          body: [
            "A reinforcement-learning agent never sees your intention, only a scalar reward. If the reward can be maximised without doing the task, a competent optimiser will find that way. The literature calls it specification gaming. Most people only ever read about it.",
            "Reward Goblin makes it measurable. You describe “push the box into the exit” as a reward function, a real PPO policy trains on it, and the interface replays what it learned next to a scripted solution on the identical start state, with the reward each one earned.",
          ],
        },
        { type: "quote", text: "The agent does not do what you intended. It does what you rewarded." },
      ],
    },
    {
      id: "exhibit",
      title: "Watch it happen",
      blocks: [
        {
          type: "prose",
          body: [
            "The replays below are drawn live from the recorded episode files committed to the repository: positions, rewards and detector events, frame by frame. No GIF, no scripting. Left is the hand-written reference controller; right is the trained policy.",
          ],
        },
        { type: "exhibit", id: "goblin" },
      ],
    },
    {
      id: "goblins",
      title: "Seven goblins, seven loopholes",
      blocks: [
        {
          type: "table",
          caption: "Each row is a real PPO run (3 seeds × 800k steps), evaluated deterministically on held-out start states. Nothing below was scripted.",
          head: ["Goblin", "The reward (v1)", "What PPO actually learned"],
          rows: [
            ["Edge", "+0.2 every step the box touches the exit; episode ends once fully inside", "Pushes the box until it overlaps the exit, then stops. Fully inside would end the income."],
            ["Touch", "+5 each time the box starts touching the exit", "One seed of three learned to push the box in and out repeatedly (95% of its episodes)."],
            ["Distance", "+1 per metre closer; retreating is free", "Jiggles the box: one replay was paid for 7.1 m of progress while the box ended 2.4 m closer."],
            ["Speed", "Reward for moving toward the exit quickly", "Ignores the box and runs laps through the exit."],
            ["Survival", "+0.1 per step alive, +5 for completion", "Parks the box next to the exit and waits out the clock."],
            ["Lava", "−0.05 per step; lava −1 and ends the episode", "Walks straight into the lava: −1 is cheaper than 300 steps of time penalty."],
            ["Wall", "+0.1 per step while the box is within 2.5 m (straight line)", "Pins the box against the outside of the exit room's wall."],
          ],
        },
        {
          type: "gallery",
          columns: 2,
          items: [
            v(S, "wall", "Wall Goblin pins the box to the outside of the room", "Wall Goblin: “near” was measured through the wall."),
            v(S, "speed", "Speed Goblin runs laps through the exit ignoring the box", "Speed Goblin: laps pay, boxes don't."),
            v(S, "lava", "Lava Goblin walks into lava", "Lava Goblin: the fastest way to stop the time penalty."),
            v(S, "fixed", "Edge Goblin v2 completes the task", "Edge Goblin v2: reward the outcome and it does the task."),
          ],
        },
      ],
    },
    {
      id: "evaluation",
      title: "Measuring the real task separately",
      blocks: [
        {
          type: "prose",
          body: [
            "The human objective lives in its own module, true_objective.py, and no training reward ever reads it. When an episode ends, for whatever reason, the goblin is frozen and physics keeps running for 30 more frames; the box must stay fully inside the exit the whole time. That separates “resting in the exit” from “sliding through it when the clock ran out”.",
            "Every reward version trains on 3 seeds and is evaluated on 20 held-out start states and 20 procedurally generated layouts the policy never saw. One clean replay proves nothing.",
          ],
        },
        {
          type: "metrics",
          items: [
            { value: "0–5%", label: "true success of every misspecified v1 reward" },
            { value: "80%", label: "true success after rewarding the outcome (v2), 0% exploits" },
            { value: "28%", label: "the same v2 policies on unseen layouts" },
            { value: "~300k", label: "steps for the edge exploit to saturate; the honest reward is still improving at 800k" },
          ],
        },
        { type: "media", media: m(S, "results", "Bar chart of true task success versus exploit rate for every reward version"), size: "wide" },
        { type: "media", media: m(S, "edge-training", "Training curves: exploit frequency saturates early for v1 while v2 true success keeps rising"), size: "wide" },
      ],
    },
    {
      id: "findings",
      title: "What the data says",
      blocks: [
        {
          type: "notes",
          items: [
            { title: "The optimiser isn't failing; the objective is.", body: "In all 7 experiments the cheating policy's mean return beats the scripted solution under the same reward: 20.1 vs 4.1 (Edge), 43.5 vs 16.3 (Speed), 24.9 vs 15.8 (Wall)." },
            { title: "A fix on the training map is not a fix.", body: "Policies that reach 80% on their training map succeed on 28% of unseen layouts, while the scripted reference solves all of them." },
            { title: "Seeds matter.", body: "Touch v1's farming loop was found by 1 seed of 3. Wall v3 solved 95% of episodes for seed 3 and 0% for seeds 1–2. A single run would have told either story." },
            { title: "Removing an exploit is not teaching the task.", body: "Dropping the proximity bonus removed wall-pinning but left 0% success, because straight-line shaping still points into the wall." },
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
          caption: "Everything the UI shows is read from files that training writes: run metadata, per-rollout metrics, evaluations and episode recordings.",
          flow: {
            stages: [
              { label: "Reward editor", lanes: ["JSON components", "static linter"], note: "No code path executes user input" },
              { label: "FastAPI", lanes: ["REST API", "job manager · process pool"] },
              { label: "Training", lanes: ["SB3 PPO / A2C", "metrics callback"] },
              { label: "Environment", lanes: ["Gymnasium env", "Pymunk physics", "reward components"] },
              { label: "Analysis", lanes: ["true objective", "exploit detectors", "A* reference"] },
              { label: "Replay UI", lanes: ["split-screen canvas", "timeline + markers"] },
            ],
          },
        },
        {
          type: "spec",
          items: [
            ["Environment", "Gymnasium API, passes SB3 check_env"],
            ["Physics", "Pymunk; velocity-servoed goblin, box with floor friction, rotation locked"],
            ["Control", "15 Hz, 4 physics substeps per action, 300-step episodes"],
            ["Actions", "Discrete(5): no-op, left, right, up, down"],
            ["Observations", "37 floats: positions, velocities, relative vectors, contact flags, time remaining, 8 wall rays, 8 lava rays"],
            ["Algorithm", "PPO, MLP 64×64, 8 envs, n_steps 512, batch 256, 10 epochs, γ 0.99, λ 0.95, entropy 0.01, clip 0.2"],
            ["Budget", "800k steps × 3 seeds per reward version; 48 runs ≈ 2.5 h on 10 CPU cores"],
            ["Tests", "55: env checker, rewards, detectors, API, replays"],
          ],
        },
        {
          type: "prose",
          body: [
            "Before any training, a static reward linter warns which loopholes a reward is likely to open, for example that touching lava may be cheaper than surviving a full episode under the step penalty. Each run stores algorithm, hyper-parameters, seed, environment version, reward fingerprint, library versions and git commit, and same seeds reproduce bit-identical results.",
          ],
        },
      ],
    },
  ],
};
