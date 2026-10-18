"use client";

import { useState } from "react";
import { copyText } from "@/lib/copy";

export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  const [failed, setFailed] = useState(false);
  const copy = async () => {
    const copied = await copyText(text);
    setDone(copied);
    setFailed(!copied);
    window.setTimeout(() => setDone(false), 1800);
  };
  return (
    <button type="button" className="copy" onClick={copy} data-done={done}>
      <span aria-live="polite">{done ? "Copied" : failed ? "Copy failed — try again" : label}</span>
    </button>
  );
}
