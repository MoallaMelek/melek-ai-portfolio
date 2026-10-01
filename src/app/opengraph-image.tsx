import { ogCard, ogSize } from "@/lib/og";

export const alt = "Melek Moalla — AI engineering, measured";
export const size = ogSize;
export const contentType = "image/png";
export const dynamic = "force-static";

export default function Image() {
  return ogCard({
    kicker: "AI engineering · ESPRIT · Tunis",
    title: "Melek Moalla",
    value: "53.5 vs 3.9",
    label: "A real PPO agent's reward for gaming its objective, vs the correct solution. Every project, measured.",
  });
}
