"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

/* ───────────────────────── helpers ───────────────────────── */

function toBase64(text: string, urlSafe: boolean): string {
  const encoded = btoa(
    new TextEncoder()
      .encode(text)
      .reduce((acc, byte) => acc + String.fromCharCode(byte), "")
  );
  if (!urlSafe) return encoded;
  return encoded.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64(text: string, urlSafe: boolean): string {
  let input = text;
  if (urlSafe) {
    input = input.replace(/-/g, "+").replace(/_/g, "/");
    const pad = input.length % 4;
    if (pad === 2) input += "==";
    else if (pad === 3) input += "=";
  }
  const binary = atob(input);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1] || result;
      resolve(base64);
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

/* ───────────────────────── component ───────────────────────── */

export default function Base64Page() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [urlSafe, setUrlSafe] = useState(false);
  const [copied, setCopied] = useState(false);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  const clearAll = useCallback(() => {
    setInput("");
    setOutput("");
    setError(null);
    setCopied(false);
    inputRef.current?.focus();
  }, []);

  const handleEncode = useCallback(() => {
    setCopied(false);
    setError(null);
    if (!input.trim()) {
      setOutput("");
      return;
    }
    try {
      setOutput(toBase64(input, urlSafe));
    } catch {
      setError("Failed to encode input");
      setOutput("");
    }
  }, [input, urlSafe]);

  const handleDecode = useCallback(() => {
    setCopied(false);
    setError(null);
    if (!input.trim()) {
      setOutput("");
      return;
    }
    try {
      setOutput(fromBase64(input, urlSafe));
    } catch {
      setError("Invalid base64 string — check input and URL-safe toggle");
      setOutput("");
    }
  }, [input, urlSafe]);

  const handleSwap = useCallback(() => {
    setInput(output);
    setOutput("");
    setError(null);
    setCopied(false);
  }, [output]);

  const handleCopy = useCallback(async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  /* drag & drop */
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (!file) return;
      try {
        const base64 = await fileToBase64(file);
        const result = urlSafe
          ? base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
          : base64;
        setInput(`[file: ${file.name}]`);
        setOutput(result);
        setError(null);
      } catch {
        setError("Failed to read file");
      }
    },
    [urlSafe]
  );

  /* Ctrl+Enter shortcut */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        handleEncode();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleEncode]);

  const inputLen = input.length;
  const outputLen = output.length;

  /* ─── shared button style helper ─── */
  const secondaryBtn = {
    fontFamily: "var(--font-display)",
    backgroundColor: "rgba(107, 140, 174, 0.12)",
    color: "#F0F4F8",
    border: "1px solid rgba(107, 140, 174, 0.2)",
  } as const;

  const ghostBtn = {
    fontFamily: "var(--font-display)",
    backgroundColor: "rgba(107, 140, 174, 0.08)",
    color: "rgba(240, 244, 248, 0.6)",
    border: "1px solid rgba(107, 140, 174, 0.1)",
  } as const;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#0D1117", color: "#F0F4F8" }}
    >
      {/* ─── Nav bar ─── */}
      <nav
        className="sticky top-0 z-50 backdrop-blur-md"
        style={{
          backgroundColor: "rgba(13, 17, 23, 0.85)",
          borderBottom: "1px solid rgba(107, 140, 174, 0.1)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm transition-colors duration-200"
              style={{ fontFamily: "var(--font-display)", color: "#6B8CAE" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#34D399")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#6B8CAE")}
            >
              <span style={{ opacity: 0.5 }}>{">"}</span> cd ~
            </Link>
            <span
              className="text-xs"
              style={{
                fontFamily: "var(--font-display)",
                color: "rgba(107, 140, 174, 0.3)",
              }}
            >
              /
            </span>
            <Link
              href="/tools"
              className="text-sm transition-colors duration-200"
              style={{ fontFamily: "var(--font-display)", color: "#6B8CAE" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#34D399")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#6B8CAE")}
            >
              tools
            </Link>
            <span
              className="text-xs"
              style={{
                fontFamily: "var(--font-display)",
                color: "rgba(107, 140, 174, 0.3)",
              }}
            >
              /
            </span>
            <span
              className="text-sm"
              style={{ fontFamily: "var(--font-display)", color: "#F0F4F8" }}
            >
              base64
            </span>
          </div>
          <div
            className="hidden sm:flex items-center gap-2 text-xs"
            style={{
              fontFamily: "var(--font-display)",
              color: "rgba(107, 140, 174, 0.4)",
            }}
          >
            <kbd
              className="px-1.5 py-0.5 rounded"
              style={{
                backgroundColor: "rgba(107, 140, 174, 0.1)",
                border: "1px solid rgba(107, 140, 174, 0.15)",
              }}
            >
              Ctrl
            </kbd>
            <span>+</span>
            <kbd
              className="px-1.5 py-0.5 rounded"
              style={{
                backgroundColor: "rgba(107, 140, 174, 0.1)",
                border: "1px solid rgba(107, 140, 174, 0.15)",
              }}
            >
              Enter
            </kbd>
            <span className="ml-1">to encode</span>
          </div>
        </div>
      </nav>

      {/* ─── Main ─── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 md:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8"
        >
          <span
            className="text-sm block mb-4"
            style={{
              fontFamily: "var(--font-display)",
              color: "#6B8CAE",
              opacity: 0.5,
            }}
          >
            {"// base64"}
          </span>
          <h1
            className="text-3xl md:text-4xl tracking-tight mb-3"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Base64<span style={{ color: "#34D399" }}>()</span>
          </h1>
          <p
            className="text-base font-light max-w-lg"
            style={{
              fontFamily: "var(--font-body)",
              color: "rgba(240, 244, 248, 0.5)",
            }}
          >
            Encode and decode Base64 strings. Supports URL-safe mode and file
            drag-and-drop.
          </p>
        </motion.div>

        {/* Toolbar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-wrap items-center gap-3 mb-6"
        >
          {/* encode */}
          <button
            onClick={handleEncode}
            className="px-4 py-2 rounded text-sm font-medium transition-opacity duration-200 hover:opacity-85 active:opacity-70"
            style={{
              fontFamily: "var(--font-display)",
              backgroundColor: "#34D399",
              color: "#0D1117",
            }}
          >
            encode()
          </button>

          {/* decode */}
          <button
            onClick={handleDecode}
            className="px-4 py-2 rounded text-sm font-medium transition-all duration-200"
            style={secondaryBtn}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor =
                "rgba(107, 140, 174, 0.2)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor =
                "rgba(107, 140, 174, 0.12)")
            }
          >
            decode()
          </button>

          {/* swap */}
          <button
            onClick={handleSwap}
            disabled={!output}
            className="px-3 py-2 rounded text-sm font-medium transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
            style={secondaryBtn}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor =
                "rgba(107, 140, 174, 0.2)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor =
                "rgba(107, 140, 174, 0.12)")
            }
          >
            swap ↕
          </button>

          {/* separator */}
          <div
            className="hidden sm:block h-6 w-px mx-1"
            style={{ backgroundColor: "rgba(107, 140, 174, 0.15)" }}
          />

          {/* URL-safe toggle */}
          <button
            onClick={() => setUrlSafe((v) => !v)}
            className="px-3 py-1.5 rounded text-xs transition-all duration-200"
            style={{
              fontFamily: "var(--font-display)",
              backgroundColor: urlSafe
                ? "rgba(52, 211, 153, 0.15)"
                : "rgba(107, 140, 174, 0.06)",
              color: urlSafe ? "#34D399" : "rgba(240, 244, 248, 0.5)",
              border: `1px solid ${
                urlSafe
                  ? "rgba(52, 211, 153, 0.3)"
                  : "rgba(107, 140, 174, 0.1)"
              }`,
            }}
          >
            url-safe {urlSafe ? "on" : "off"}
          </button>

          {/* separator */}
          <div
            className="hidden sm:block h-6 w-px mx-1"
            style={{ backgroundColor: "rgba(107, 140, 174, 0.15)" }}
          />

          {/* copy */}
          <button
            onClick={handleCopy}
            disabled={!output}
            className="px-3 py-2 rounded text-xs transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              ...ghostBtn,
              color: copied ? "#34D399" : ghostBtn.color,
              border: copied
                ? "1px solid rgba(52, 211, 153, 0.3)"
                : ghostBtn.border,
            }}
          >
            {copied ? "copied!" : "copy"}
          </button>

          {/* clear */}
          <button
            onClick={clearAll}
            className="px-3 py-2 rounded text-xs transition-all duration-200"
            style={ghostBtn}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#f87171";
              e.currentTarget.style.borderColor = "rgba(248, 113, 113, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "rgba(240, 244, 248, 0.6)";
              e.currentTarget.style.borderColor = "rgba(107, 140, 174, 0.1)";
            }}
          >
            clear
          </button>
        </motion.div>

        {/* Error banner */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="mb-4 overflow-hidden"
            >
              <div
                className="px-4 py-3 rounded text-sm"
                style={{
                  fontFamily: "var(--font-display)",
                  backgroundColor: "rgba(248, 113, 113, 0.08)",
                  border: "1px solid rgba(248, 113, 113, 0.2)",
                  color: "#f87171",
                }}
              >
                <span style={{ opacity: 0.6 }}>error: </span>
                {error}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Editor panels */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-1 gap-4"
          ref={dropRef}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {/* Input panel */}
          <div
            className="rounded-lg overflow-hidden flex flex-col transition-all duration-200"
            style={{
              backgroundColor: "rgba(107, 140, 174, 0.04)",
              border: dragging
                ? "2px dashed #34D399"
                : "1px solid rgba(107, 140, 174, 0.1)",
            }}
          >
            <div
              className="flex items-center justify-between px-4 py-2.5"
              style={{ borderBottom: "1px solid rgba(107, 140, 174, 0.08)" }}
            >
              <span
                className="text-xs"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "rgba(107, 140, 174, 0.5)",
                }}
              >
                input
              </span>
              <span
                className="text-xs"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "rgba(107, 140, 174, 0.3)",
                }}
              >
                {inputLen.toLocaleString()} char{inputLen !== 1 ? "s" : ""}
              </span>
            </div>

            {!input && !dragging ? (
              <div
                className="flex flex-col items-center justify-center select-none"
                style={{ minHeight: "200px" }}
              >
                <span
                  className="text-5xl md:text-6xl font-light mb-4"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "rgba(107, 140, 174, 0.07)",
                  }}
                >
                  {"< />"}
                </span>
                <span
                  className="text-sm"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "rgba(107, 140, 174, 0.2)",
                  }}
                >
                  paste text or drop a file
                </span>
              </div>
            ) : dragging ? (
              <div
                className="flex flex-col items-center justify-center select-none"
                style={{ minHeight: "200px" }}
              >
                <span
                  className="text-lg mb-2"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "#34D399",
                  }}
                >
                  drop file here
                </span>
                <span
                  className="text-xs"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "rgba(52, 211, 153, 0.5)",
                  }}
                >
                  will be converted to base64
                </span>
              </div>
            ) : (
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  if (error) setError(null);
                }}
                spellCheck={false}
                className="flex-1 w-full resize-none p-4 outline-none"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "13px",
                  lineHeight: "1.7",
                  backgroundColor: "transparent",
                  color: "#F0F4F8",
                  minHeight: "200px",
                  caretColor: "#34D399",
                }}
              />
            )}
          </div>

          {/* Output panel */}
          <div
            className="rounded-lg overflow-hidden flex flex-col"
            style={{
              backgroundColor: "rgba(107, 140, 174, 0.04)",
              border: "1px solid rgba(107, 140, 174, 0.1)",
            }}
          >
            <div
              className="flex items-center justify-between px-4 py-2.5"
              style={{ borderBottom: "1px solid rgba(107, 140, 174, 0.08)" }}
            >
              <span
                className="text-xs"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "rgba(107, 140, 174, 0.5)",
                }}
              >
                output
              </span>
              <span
                className="text-xs"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "rgba(107, 140, 174, 0.3)",
                }}
              >
                {outputLen.toLocaleString()} char{outputLen !== 1 ? "s" : ""}
              </span>
            </div>

            {output ? (
              <pre
                className="flex-1 p-4 overflow-auto whitespace-pre-wrap break-all"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "13px",
                  lineHeight: "1.7",
                  minHeight: "200px",
                  margin: 0,
                  color: "#34D399",
                }}
              >
                {output}
              </pre>
            ) : (
              <div
                className="flex-1 flex flex-col items-center justify-center select-none"
                style={{ minHeight: "200px" }}
              >
                <span
                  className="text-5xl md:text-6xl font-light mb-4"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "rgba(107, 140, 174, 0.07)",
                  }}
                >
                  {"< />"}
                </span>
                <span
                  className="text-sm"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "rgba(107, 140, 174, 0.2)",
                  }}
                >
                  result will appear here
                </span>
              </div>
            )}
          </div>
        </motion.div>
      </main>

      {/* ─── Footer ─── */}
      <footer
        className="mt-auto"
        style={{ borderTop: "1px solid rgba(107, 140, 174, 0.08)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <span
            className="text-xs"
            style={{
              fontFamily: "var(--font-display)",
              color: "rgba(107, 140, 174, 0.3)",
            }}
          >
            100% free. runs locally in your browser.
          </span>
          <Link
            href="/tools"
            className="text-xs transition-colors duration-200"
            style={{
              fontFamily: "var(--font-display)",
              color: "rgba(107, 140, 174, 0.4)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#34D399")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "rgba(107, 140, 174, 0.4)")
            }
          >
            more tools →
          </Link>
        </div>
      </footer>
    </div>
  );
}
