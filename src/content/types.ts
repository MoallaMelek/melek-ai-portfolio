// Content model. Projects are data; components never hardcode project facts.
// To add a project: create src/content/projects/<slug>.ts, export a Project, register it in index.ts,
// and drop its media into public/projects/<slug>/ (run `npm run media:dims` afterwards).

export type DomainId = "rl" | "vision" | "agents" | "ml" | "systems";

export interface Media {
  kind: "image" | "video";
  src: string;
  /** Poster frame for video; required so nothing renders empty before playback. */
  poster?: string;
  alt: string;
  caption?: string;
  /** Intrinsic size, filled from media-dims.json by the m()/v() helpers. */
  width: number;
  height: number;
}

export interface Metric {
  value: string;
  label: string;
  note?: string;
}

export interface Flow {
  /** Ordered stages. A stage may hold parallel lanes. */
  stages: { label: string; lanes?: string[]; note?: string }[];
}

export type Block =
  | { type: "prose"; body: string[] }
  | { type: "media"; media: Media; size?: "inset" | "wide" | "full" }
  | { type: "gallery"; items: Media[]; columns?: 2 | 3 }
  | { type: "metrics"; items: Metric[] }
  | { type: "table"; caption?: string; head: string[]; rows: string[][]; numeric?: number[] }
  | { type: "flow"; caption?: string; flow: Flow }
  | { type: "spec"; items: [string, string][] }
  | { type: "notes"; items: { title: string; body: string }[] }
  | { type: "quote"; text: string; cite?: string }
  | { type: "exhibit"; id: "goblin" | "dungeon" | "hydra" | "telekinesis" | "vector-gestures" };

export interface Section {
  id: string;
  title: string;
  blocks: Block[];
  /** Only shown in "Under the hood" mode. */
  deep?: boolean;
}

export interface Project {
  slug: string;
  title: string;
  /** Short sentence used as subtitle and meta description. */
  oneLiner: string;
  /** The question or problem, phrased the way the project frames it. */
  question: string;
  year: string;
  status: string;
  domains: DomainId[];
  stack: string[];
  repo: string;
  /** The single measured number that introduces the project in the index. */
  headline: Metric;
  /** Omit when no honest visual exists; the site then draws a typographic plate. */
  cover?: Media;
  /** Don't repeat the cover at the top of the case study (e.g. when an exhibit shows the same thing). */
  hideCover?: boolean;
  /** Optional looping clip for hover previews. */
  preview?: Media;
  /** Plain-language limits copied from the project's own documentation. */
  limits: string[];
  sections: Section[];
  /** Accent hue for the case-study page, as an oklch hue angle. */
  hue: number;
}

export interface LabItem {
  title: string;
  year: string;
  note: string;
  tags: string[];
  stack: string[];
  repo?: string;
  image?: Media;
  status: string;
}
