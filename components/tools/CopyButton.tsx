"use client";

import { useState, useCallback } from "react";

export default function CopyButton({ getValue }: { getValue: () => string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    const text = getValue();
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [getValue]);

  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 right-2 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-all duration-200 z-10"
      style={{
        fontFamily: "var(--font-display)",
        backgroundColor: copied
          ? "rgba(52, 211, 153, 0.15)"
          : "rgba(107, 140, 174, 0.12)",
        border: `1px solid ${copied ? "rgba(52, 211, 153, 0.3)" : "rgba(107, 140, 174, 0.2)"}`,
        color: copied ? "#34D399" : "rgba(240, 244, 248, 0.6)",
        backdropFilter: "blur(8px)",
      }}
    >
      {copied ? "copied!" : "copy"}
    </button>
  );
}
