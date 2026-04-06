"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

/* ───────────────────────── syntax highlighting ───────────────────────── */

type TokenType = "key" | "string" | "number" | "boolean" | "null" | "bracket" | "punctuation";

interface Token {
  type: TokenType;
  value: string;
}

function tokenizeJSON(json: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < json.length) {
    const ch = json[i];

    // whitespace - emit as-is inside a "punctuation" token
    if (ch === " " || ch === "\n" || ch === "\r" || ch === "\t") {
      let ws = "";
      while (i < json.length && (json[i] === " " || json[i] === "\n" || json[i] === "\r" || json[i] === "\t")) {
        ws += json[i];
        i++;
      }
      tokens.push({ type: "punctuation", value: ws });
      continue;
    }

    // brackets & braces
    if (ch === "{" || ch === "}" || ch === "[" || ch === "]") {
      tokens.push({ type: "bracket", value: ch });
      i++;
      continue;
    }

    // colon, comma
    if (ch === ":" || ch === ",") {
      tokens.push({ type: "punctuation", value: ch });
      i++;
      continue;
    }

    // strings
    if (ch === '"') {
      let str = '"';
      i++;
      while (i < json.length) {
        if (json[i] === "\\") {
          str += json[i] + (json[i + 1] || "");
          i += 2;
          continue;
        }
        if (json[i] === '"') {
          str += '"';
          i++;
          break;
        }
        str += json[i];
        i++;
      }

      // determine if this string is a key: look ahead for ':'
      let j = i;
      while (j < json.length && (json[j] === " " || json[j] === "\t" || json[j] === "\n" || json[j] === "\r")) {
        j++;
      }
      if (j < json.length && json[j] === ":") {
        tokens.push({ type: "key", value: str });
      } else {
        tokens.push({ type: "string", value: str });
      }
      continue;
    }

    // numbers
    if (ch === "-" || (ch >= "0" && ch <= "9")) {
      let num = "";
      while (i < json.length && /[\d.eE+\-]/.test(json[i])) {
        num += json[i];
        i++;
      }
      tokens.push({ type: "number", value: num });
      continue;
    }

    // true
    if (json.slice(i, i + 4) === "true") {
      tokens.push({ type: "boolean", value: "true" });
      i += 4;
      continue;
    }

    // false
    if (json.slice(i, i + 5) === "false") {
      tokens.push({ type: "boolean", value: "false" });
      i += 5;
      continue;
    }

    // null
    if (json.slice(i, i + 4) === "null") {
      tokens.push({ type: "null", value: "null" });
      i += 4;
      continue;
    }

    // fallback
    tokens.push({ type: "punctuation", value: ch });
    i++;
  }

  return tokens;
}

const TOKEN_COLORS: Record<TokenType, string> = {
  key: "#6B8CAE",
  string: "#34D399",
  number: "#fbbf24",
  boolean: "#a78bfa",
  null: "#a78bfa",
  bracket: "#64748B",
  punctuation: "#64748B",
};

function renderHighlightedJSON(json: string): React.ReactNode[] {
  const tokens = tokenizeJSON(json);
  return tokens.map((tok, i) => (
    <span key={i} style={{ color: TOKEN_COLORS[tok.type] }}>
      {tok.value}
    </span>
  ));
}

/* ───────────────────────── helpers ───────────────────────── */

function countLines(text: string): number {
  if (!text) return 0;
  return text.split("\n").length;
}

type IndentType = "2" | "4" | "tab";

function getIndent(type: IndentType): string | number {
  if (type === "tab") return "\t";
  return parseInt(type);
}

/* ───────────────────────── component ───────────────────────── */

export default function JSONFormatterPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [indent, setIndent] = useState<IndentType>("2");
  const [copied, setCopied] = useState(false);
  const [validated, setValidated] = useState<boolean | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const clearState = useCallback(() => {
    setOutput("");
    setError(null);
    setValidated(null);
  }, []);

  const handleFormat = useCallback(() => {
    setValidated(null);
    setCopied(false);
    if (!input.trim()) {
      clearState();
      return;
    }
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, getIndent(indent));
      setOutput(formatted);
      setError(null);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Invalid JSON";
      setError(msg);
      setOutput("");
    }
  }, [input, indent, clearState]);

  const handleMinify = useCallback(() => {
    setValidated(null);
    setCopied(false);
    if (!input.trim()) {
      clearState();
      return;
    }
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setError(null);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Invalid JSON";
      setError(msg);
      setOutput("");
    }
  }, [input, clearState]);

  const handleValidate = useCallback(() => {
    setCopied(false);
    if (!input.trim()) {
      clearState();
      return;
    }
    try {
      JSON.parse(input);
      setError(null);
      setValidated(true);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Invalid JSON";
      setError(msg);
      setValidated(false);
      setOutput("");
    }
  }, [input, clearState]);

  const handleCopy = useCallback(async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  const handleClear = useCallback(() => {
    setInput("");
    clearState();
    setCopied(false);
    inputRef.current?.focus();
  }, [clearState]);

  // Cmd/Ctrl + Enter shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        handleFormat();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleFormat]);

  const inputLineCount = countLines(input);
  const outputLineCount = countLines(output);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#0D1117", color: "#F0F4F8" }}
    >
      {/* Nav bar */}
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
              style={{
                fontFamily: "var(--font-display)",
                color: "#6B8CAE",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "#34D399")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "#6B8CAE")
              }
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
              style={{
                fontFamily: "var(--font-display)",
                color: "#6B8CAE",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "#34D399")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "#6B8CAE")
              }
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
              style={{
                fontFamily: "var(--font-display)",
                color: "#F0F4F8",
              }}
            >
              json-formatter
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
            <span className="ml-1">to format</span>
          </div>
        </div>
      </nav>

      {/* Main content */}
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
            {"// json-formatter"}
          </span>
          <h1
            className="text-3xl md:text-4xl tracking-tight mb-3"
            style={{ fontFamily: "var(--font-display)" }}
          >
            JSON Formatter<span style={{ color: "#34D399" }}>()</span>
          </h1>
          <p
            className="text-base font-light max-w-lg"
            style={{
              fontFamily: "var(--font-body)",
              color: "rgba(240, 244, 248, 0.5)",
            }}
          >
            Format, minify, and validate JSON. Syntax highlighted output with
            zero server calls.
          </p>
        </motion.div>

        {/* Toolbar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-wrap items-center gap-3 mb-6"
        >
          {/* format button */}
          <button
            onClick={handleFormat}
            className="px-4 py-2 rounded text-sm font-medium transition-opacity duration-200 hover:opacity-85 active:opacity-70"
            style={{
              fontFamily: "var(--font-display)",
              backgroundColor: "#34D399",
              color: "#0D1117",
            }}
          >
            format()
          </button>

          {/* minify button */}
          <button
            onClick={handleMinify}
            className="px-4 py-2 rounded text-sm font-medium transition-all duration-200"
            style={{
              fontFamily: "var(--font-display)",
              backgroundColor: "rgba(107, 140, 174, 0.12)",
              color: "#F0F4F8",
              border: "1px solid rgba(107, 140, 174, 0.2)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(107, 140, 174, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(107, 140, 174, 0.12)";
            }}
          >
            minify()
          </button>

          {/* validate button */}
          <button
            onClick={handleValidate}
            className="px-4 py-2 rounded text-sm font-medium transition-all duration-200"
            style={{
              fontFamily: "var(--font-display)",
              backgroundColor: "rgba(107, 140, 174, 0.12)",
              color: "#F0F4F8",
              border: "1px solid rgba(107, 140, 174, 0.2)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(107, 140, 174, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(107, 140, 174, 0.12)";
            }}
          >
            validate()
          </button>

          {/* separator */}
          <div
            className="hidden sm:block h-6 w-px mx-1"
            style={{ backgroundColor: "rgba(107, 140, 174, 0.15)" }}
          />

          {/* indent selector */}
          <div className="flex items-center gap-2">
            <span
              className="text-xs"
              style={{
                fontFamily: "var(--font-display)",
                color: "rgba(107, 140, 174, 0.5)",
              }}
            >
              indent:
            </span>
            {(["2", "4", "tab"] as IndentType[]).map((opt) => (
              <button
                key={opt}
                onClick={() => setIndent(opt)}
                className="px-2.5 py-1 rounded text-xs transition-all duration-200"
                style={{
                  fontFamily: "var(--font-display)",
                  backgroundColor:
                    indent === opt
                      ? "rgba(52, 211, 153, 0.15)"
                      : "rgba(107, 140, 174, 0.06)",
                  color: indent === opt ? "#34D399" : "rgba(240, 244, 248, 0.5)",
                  border: `1px solid ${
                    indent === opt
                      ? "rgba(52, 211, 153, 0.3)"
                      : "rgba(107, 140, 174, 0.1)"
                  }`,
                }}
              >
                {opt === "tab" ? "tab" : `${opt}sp`}
              </button>
            ))}
          </div>

          {/* separator */}
          <div
            className="hidden sm:block h-6 w-px mx-1"
            style={{ backgroundColor: "rgba(107, 140, 174, 0.15)" }}
          />

          {/* copy button */}
          <button
            onClick={handleCopy}
            disabled={!output}
            className="px-3 py-2 rounded text-xs transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              fontFamily: "var(--font-display)",
              backgroundColor: "rgba(107, 140, 174, 0.08)",
              color: copied ? "#34D399" : "rgba(240, 244, 248, 0.6)",
              border: `1px solid ${
                copied ? "rgba(52, 211, 153, 0.3)" : "rgba(107, 140, 174, 0.1)"
              }`,
            }}
          >
            {copied ? "copied!" : "copy"}
          </button>

          {/* clear button */}
          <button
            onClick={handleClear}
            className="px-3 py-2 rounded text-xs transition-all duration-200"
            style={{
              fontFamily: "var(--font-display)",
              backgroundColor: "rgba(107, 140, 174, 0.08)",
              color: "rgba(240, 244, 248, 0.4)",
              border: "1px solid rgba(107, 140, 174, 0.1)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#f87171";
              e.currentTarget.style.borderColor = "rgba(248, 113, 113, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "rgba(240, 244, 248, 0.4)";
              e.currentTarget.style.borderColor = "rgba(107, 140, 174, 0.1)";
            }}
          >
            clear
          </button>
        </motion.div>

        {/* Error / success banner */}
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
          {validated === true && !error && (
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
                  backgroundColor: "rgba(52, 211, 153, 0.08)",
                  border: "1px solid rgba(52, 211, 153, 0.2)",
                  color: "#34D399",
                }}
              >
                <span style={{ opacity: 0.6 }}>result: </span>
                valid JSON
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Editor panels */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-4"
        >
          {/* Input panel */}
          <div
            className="rounded-lg overflow-hidden flex flex-col"
            style={{
              backgroundColor: "rgba(107, 140, 174, 0.04)",
              border: "1px solid rgba(107, 140, 174, 0.1)",
            }}
          >
            {/* input header */}
            <div
              className="flex items-center justify-between px-4 py-2.5"
              style={{
                borderBottom: "1px solid rgba(107, 140, 174, 0.08)",
              }}
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
                {input ? `${inputLineCount} line${inputLineCount !== 1 ? "s" : ""}` : "0 lines"}
              </span>
            </div>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                if (error) setError(null);
                if (validated !== null) setValidated(null);
              }}
              placeholder='paste your JSON here...'
              spellCheck={false}
              className="flex-1 w-full resize-none p-4 outline-none placeholder:opacity-30"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "13px",
                lineHeight: "1.7",
                backgroundColor: "transparent",
                color: "#F0F4F8",
                minHeight: "400px",
                caretColor: "#34D399",
              }}
            />
          </div>

          {/* Output panel */}
          <div
            className="rounded-lg overflow-hidden flex flex-col"
            style={{
              backgroundColor: "rgba(107, 140, 174, 0.04)",
              border: "1px solid rgba(107, 140, 174, 0.1)",
            }}
          >
            {/* output header */}
            <div
              className="flex items-center justify-between px-4 py-2.5"
              style={{
                borderBottom: "1px solid rgba(107, 140, 174, 0.08)",
              }}
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
                {output ? `${outputLineCount} line${outputLineCount !== 1 ? "s" : ""}` : "0 lines"}
              </span>
            </div>

            {/* output content */}
            <div
              className="flex-1 p-4 overflow-auto"
              style={{ minHeight: "400px" }}
            >
              {output ? (
                <pre
                  className="whitespace-pre-wrap break-words"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "13px",
                    lineHeight: "1.7",
                    margin: 0,
                  }}
                >
                  {renderHighlightedJSON(output)}
                </pre>
              ) : (
                <div
                  className="h-full flex flex-col items-center justify-center select-none"
                  style={{ minHeight: "360px" }}
                >
                  <span
                    className="text-6xl md:text-7xl font-light mb-6"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "rgba(107, 140, 174, 0.07)",
                    }}
                  >
                    {"{ }"}
                  </span>
                  <span
                    className="text-sm"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "rgba(107, 140, 174, 0.2)",
                    }}
                  >
                    paste your JSON and hit format
                  </span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer
        className="mt-auto"
        style={{
          borderTop: "1px solid rgba(107, 140, 174, 0.08)",
        }}
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
