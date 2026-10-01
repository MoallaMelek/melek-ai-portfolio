import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };

const font = (pkg: string, file: string) => readFile(join(process.cwd(), "node_modules", "@fontsource", pkg, "files", file));

/** Shared social card: paper, ink, one signal colour — the same system as the site. */
export async function ogCard({
  kicker,
  title,
  value,
  label,
}: {
  kicker: string;
  title: string;
  value: string;
  label: string;
}) {
  const [narrow, sans, mono] = await Promise.all([
    font("archivo-narrow", "archivo-narrow-latin-700-normal.woff"),
    font("archivo", "archivo-latin-500-normal.woff"),
    font("jetbrains-mono", "jetbrains-mono-latin-500-normal.woff"),
  ]);
  const size = title.length > 18 ? 118 : title.length > 12 ? 150 : 176;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#eeece6",
          color: "#111110",
          padding: "48px 64px 52px",
          fontFamily: "Archivo",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: "JetBrains Mono",
            fontSize: 22,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: "#47443e",
            borderBottom: "2px solid #111110",
            paddingBottom: 16,
          }}
        >
          <span>{kicker}</span>
          <span>Melek Moalla</span>
        </div>
        <div
          style={{
            display: "flex",
            flex: 1,
            alignItems: "center",
            fontFamily: "Archivo Narrow",
            fontSize: size,
            lineHeight: 0.9,
            letterSpacing: -4,
            textTransform: "uppercase",
          }}
        >
          {title}
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 32, borderTop: "6px solid #e2401b", paddingTop: 20 }}>
          <span style={{ fontFamily: "JetBrains Mono", fontSize: 64, color: "#b02e0c", letterSpacing: -3, whiteSpace: "nowrap" }}>
            {value}
          </span>
          <span style={{ fontSize: 28, lineHeight: 1.25, color: "#47443e", maxWidth: 620, paddingBottom: 6 }}>{label}</span>
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Archivo Narrow", data: narrow, weight: 700, style: "normal" },
        { name: "Archivo", data: sans, weight: 500, style: "normal" },
        { name: "JetBrains Mono", data: mono, weight: 500, style: "normal" },
      ],
    },
  );
}
