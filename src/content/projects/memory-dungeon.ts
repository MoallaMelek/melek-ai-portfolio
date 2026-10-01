import { m } from "../media";
import type { Project } from "../types";

const S = "memory-dungeon";

export const memoryDungeon: Project = {
  slug: S,
  title: "Dungeon With Amnesia",
  oneLiner: "A PPO laboratory that tests whether agents remember what they can no longer see, by deleting their memory mid-episode.",
  question: "How much does intelligence depend on remembering what is no longer visible?",
  year: "2026",
  status: "Research demo · one training seed · results reported with intervals",
  domains: ["rl"],
  stack: ["Python", "PyTorch", "Streamlit", "NumPy"],
  repo: "https://github.com/MoallaMelek/Reinforcement-Learning-Memory-Dungeon",
  headline: { value: "100 → 43", label: "escapes out of 100 when the GRU's hidden state is reset mid-episode" },
  cover: m(S, "hidden-control", "Heatmap of the GRU hidden state across 34 decisions in the intact control episode"),
  hue: 265,
  limits: [
    "The strong result concerns retaining a one-time cue in a controlled detour, not learned memory of a door's location.",
    "Quick procedural exploration runs are undertrained and weak; they do not support a generalization claim.",
    "One optimization seed. Confidence intervals cover map sampling, not training variability.",
    "Deleting the hidden state also pushes the model off its learned state distribution; it does not prove a localized symbolic memory.",
  ],
  sections: [
    {
      id: "setup",
      title: "The setup",
      blocks: [
        {
          type: "prose",
          body: [
            "At the start of every episode a dying torch reveals a seal, Raven or Moon. The inscription disappears after the first action and can never be observed again. 33 decisions later, at the exit, the agent must invoke the matching seal. The wrong one ends the episode.",
            "Three architectures train with PPO on exactly the same observations: a feed-forward policy with no memory, a policy that sees its last four observations, and a GRU that carries a recurrent state.",
          ],
        },
        {
          type: "metrics",
          items: [
            { value: "100/100", label: "GRU escapes on held-out showcase maps", note: "95% Wilson CI 96.3–100%" },
            { value: "57/100", label: "no-memory and history-4 agents: chance on a binary choice" },
            { value: "30/30", label: "counterfactual pairs where flipping only the cue flipped the GRU's final choice" },
          ],
        },
      ],
    },
    {
      id: "intervention",
      title: "Delete the memory, keep everything else",
      blocks: [
        {
          type: "prose",
          body: [
            "The intervention clones the exact environment and policy at decision 8, then resets the GRU's hidden state in one copy only. Same dungeon, same weights, same action prefix. Below are the real 64-dimensional hidden states from the verified replay (seed 200001). Scrub through the episode.",
          ],
        },
        { type: "exhibit", id: "dungeon" },
        {
          type: "table",
          caption: "Paired interventions over 100 test maps. Positive control: zero noise must preserve behaviour.",
          head: ["Intervention", "Strength", "Control", "Treatment", "Paired 95% CI of change"],
          numeric: [2, 3],
          rows: [
            ["Reset", "at 25 / 50 / 75%", "100%", "43%", "−66% to −48%"],
            ["Gaussian noise", "σ 0.0", "100%", "100%", "+0%"],
            ["Gaussian noise", "σ 0.5", "100%", "98%", "−5% to 0%"],
            ["Gaussian noise", "σ 1.0", "100%", "86%", "−21% to −8%"],
            ["Gaussian noise", "σ 2.0", "100%", "67%", "−42% to −24%"],
          ],
        },
      ],
    },
    {
      id: "results",
      title: "Measurements",
      blocks: [
        {
          type: "gallery",
          columns: 2,
          items: [
            m(S, "memory-reset", "Success rate after resetting memory at different points of the episode", "Memory deletion: success falls to chance."),
            m(S, "memory-noise", "Success rate as Gaussian noise of increasing size is injected into the hidden state", "Corruption dose-response: graded, not binary."),
          ],
        },
        { type: "media", media: m(S, "training-curves", "PPO training curves for the three architectures"), size: "wide" },
        {
          type: "table",
          caption: "Cue-to-decision distance sweep. Every delay exceeds the history-4 window, so this sweep does not locate that window's boundary.",
          head: ["Agent", "7", "11", "19", "33", "53", "63 decisions"],
          rows: [
            ["No memory", "57%", "57%", "57%", "57%", "57%", "57%"],
            ["History-4", "57%", "57%", "57%", "57%", "57%", "57%"],
            ["GRU", "100%", "100%", "100%", "100%", "100%", "100%"],
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
              { label: "Hidden dungeon state", note: "topology, keys, locks, correct seal" },
              { label: "Local observation", note: "58-dim structured encoding; also rendered as text" },
              { label: "Encoder", lanes: ["MLP: current obs", "History: last 4 obs + actions", "GRU / LSTM: recurrent state"] },
              { label: "Policy + value heads", note: "masked discrete actions" },
              { label: "Intervention", lanes: ["reset", "zero a fraction", "seeded noise", "restore"] },
            ],
          },
        },
        {
          type: "notes",
          items: [
            { title: "Recurrent PPO done carefully", body: "Each PPO epoch recomputes the whole episode from zero state under current weights. It never shuffles isolated recurrent timesteps, so backpropagation reaches the original cue. Padding is excluded from losses; time-limit truncations bootstrap the last value." },
            { title: "An explicit information boundary", body: "The encoder never sees coordinates, room IDs, the graph, visited flags, clue truth, the seed or the observer's notebook. A separate observer reconstructs a map for humans only." },
            { title: "Certified solvable", body: "Locks lie on the unique start-to-exit path with keys placed before them. A BFS over (position, inventory, opened locks) certifies every generated dungeon in tests." },
            { title: "Reproducible", body: "Seeded Python/NumPy/PyTorch, deterministic algorithms, one CPU thread, disjoint train/validation/test seed ranges, checkpoint SHA-256 hashes in the report." },
          ],
        },
      ],
    },
  ],
};
