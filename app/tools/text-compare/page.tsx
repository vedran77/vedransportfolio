"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import CopyButton from "@/components/tools/CopyButton";

/* ───────────────────────── diff algorithm ───────────────────────── */

interface DiffLine {
  type: "equal" | "added" | "removed";
  value: string;
  lineLeft?: number;
  lineRight?: number;
  charDiffs?: CharDiff[];
}

interface CharDiff {
  type: "equal" | "added" | "removed";
  value: string;
}

function lcsLines(a: string[], b: string[]): string[][] {
  const m = a.length,
    n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    Array(n + 1).fill(0)
  );
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1] + 1
          : Math.max(dp[i - 1][j], dp[i][j - 1]);

  const result: string[][] = [];
  let i = m,
    j = n;
  while (i > 0 && j > 0) {
    if (a[i - 1] === b[j - 1]) {
      result.unshift(["equal", a[i - 1], String(i), String(j)]);
      i--;
      j--;
    } else if (dp[i - 1][j] >= dp[i][j - 1]) {
      result.unshift(["removed", a[i - 1], String(i), ""]);
      i--;
    } else {
      result.unshift(["added", b[j - 1], "", String(j)]);
      j--;
    }
  }
  while (i > 0) {
    result.unshift(["removed", a[i - 1], String(i), ""]);
    i--;
  }
  while (j > 0) {
    result.unshift(["added", b[j - 1], "", String(j)]);
    j--;
  }
  return result;
}

function charLevelDiff(a: string, b: string): CharDiff[] {
  const m = a.length,
    n = b.length;
  if (m === 0) return b ? [{ type: "added", value: b }] : [];
  if (n === 0) return a ? [{ type: "removed", value: a }] : [];

  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    Array(n + 1).fill(0)
  );
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1] + 1
          : Math.max(dp[i - 1][j], dp[i][j - 1]);

  const result: CharDiff[] = [];
  let i = m,
    j = n;
  while (i > 0 && j > 0) {
    if (a[i - 1] === b[j - 1]) {
      result.unshift({ type: "equal", value: a[i - 1] });
      i--;
      j--;
    } else if (dp[i - 1][j] >= dp[i][j - 1]) {
      result.unshift({ type: "removed", value: a[i - 1] });
      i--;
    } else {
      result.unshift({ type: "added", value: b[j - 1] });
      j--;
    }
  }
  while (i > 0) {
    result.unshift({ type: "removed", value: a[i - 1] });
    i--;
  }
  while (j > 0) {
    result.unshift({ type: "added", value: b[j - 1] });
    j--;
  }

  // merge consecutive same-type chars
  const merged: CharDiff[] = [];
  for (const c of result) {
    if (merged.length && merged[merged.length - 1].type === c.type) {
      merged[merged.length - 1].value += c.value;
    } else {
      merged.push({ ...c });
    }
  }
  return merged;
}

function computeDiff(textA: string, textB: string): DiffLine[] {
  const linesA = textA.split("\n");
  const linesB = textB.split("\n");
  const raw = lcsLines(linesA, linesB);

  const diff: DiffLine[] = raw.map(([type, value, left, right]) => ({
    type: type as DiffLine["type"],
    value,
    lineLeft: left ? parseInt(left) : undefined,
    lineRight: right ? parseInt(right) : undefined,
  }));

  // enrich removed/added pairs with char-level diffs
  for (let i = 0; i < diff.length - 1; i++) {
    if (diff[i].type === "removed" && diff[i + 1].type === "added") {
      const cd = charLevelDiff(diff[i].value, diff[i + 1].value);
      diff[i].charDiffs = cd.filter((c) => c.type !== "added");
      diff[i + 1].charDiffs = cd.filter((c) => c.type !== "removed");
    }
  }

  return diff;
}

/* ───────────────────────── stats ───────────────────────── */

function diffStats(diff: DiffLine[]) {
  let added = 0,
    removed = 0,
    unchanged = 0;
  for (const d of diff) {
    if (d.type === "added") added++;
    else if (d.type === "removed") removed++;
    else unchanged++;
  }
  return { added, removed, unchanged, total: added + removed + unchanged };
}

/* ───────────────────────── component ───────────────────────── */

type ViewMode = "split" | "unified" | "inline";

export default function TextComparePage() {
  const [textA, setTextA] = useState("");
  const [textB, setTextB] = useState("");
  const [diff, setDiff] = useState<DiffLine[] | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("unified");
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);
  const [ignoreCase, setIgnoreCase] = useState(false);
  const [copied, setCopied] = useState(false);
  const diffRef = useRef<HTMLDivElement>(null);

  const handleCompare = useCallback(() => {
    let a = textA;
    let b = textB;
    if (ignoreWhitespace) {
      a = a.replace(/[ \t]+/g, " ").replace(/ \n/g, "\n");
      b = b.replace(/[ \t]+/g, " ").replace(/ \n/g, "\n");
    }
    if (ignoreCase) {
      a = a.toLowerCase();
      b = b.toLowerCase();
    }
    setDiff(computeDiff(a, b));
  }, [textA, textB, ignoreWhitespace, ignoreCase]);

  const handleSwap = () => {
    setTextA(textB);
    setTextB(textA);
    setDiff(null);
  };

  const handleClear = () => {
    setTextA("");
    setTextB("");
    setDiff(null);
  };

  const handleCopyDiff = async () => {
    if (!diff) return;
    const text = diff
      .map((d) => {
        const prefix =
          d.type === "added" ? "+ " : d.type === "removed" ? "- " : "  ";
        return prefix + d.value;
      })
      .join("\n");
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        handleCompare();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleCompare]);

  const stats = diff ? diffStats(diff) : null;
  const hasChanges = stats
    ? stats.added > 0 || stats.removed > 0
    : false;

  return (
    <div
      className="min-h-screen"
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
              text-compare
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
              {typeof navigator !== "undefined" &&
              /Mac/.test(navigator.userAgent || "")
                ? "Cmd"
                : "Ctrl"}
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
            <span className="ml-1">to compare</span>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
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
            {"// text-compare"}
          </span>
          <h1
            className="text-2xl md:text-3xl lg:text-4xl tracking-tight mb-2"
            style={{ fontFamily: "var(--font-display)" }}
          >
            diff<span style={{ color: "#34D399" }}>(</span>a
            <span style={{ color: "#64748B" }}>,</span> b
            <span style={{ color: "#34D399" }}>)</span>
          </h1>
          <p
            className="text-sm md:text-base font-light"
            style={{
              fontFamily: "var(--font-body)",
              color: "rgba(240, 244, 248, 0.5)",
            }}
          >
            Paste two texts. See every difference. No sign-ups, no limits, no
            BS.
          </p>
        </motion.div>

        {/* Input area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.1,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
        >
          {/* Left editor */}
          <div className="relative group">
            <CopyButton getValue={() => textA} />
            <div
              className="absolute top-3 left-4 text-xs select-none pointer-events-none"
              style={{
                fontFamily: "var(--font-display)",
                color: "rgba(107, 140, 174, 0.35)",
              }}
            >
              original
            </div>
            <textarea
              value={textA}
              onChange={(e) => {
                setTextA(e.target.value);
                setDiff(null);
              }}
              placeholder="Paste original text here..."
              spellCheck={false}
              className="w-full h-64 md:h-80 resize-y rounded-lg px-4 pt-10 pb-4 text-sm leading-relaxed outline-none transition-all duration-200 placeholder:opacity-30"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "13px",
                backgroundColor: "rgba(107, 140, 174, 0.04)",
                border: "1px solid rgba(107, 140, 174, 0.12)",
                color: "#F0F4F8",
              }}
              onFocus={(e) =>
                (e.currentTarget.style.borderColor =
                  "rgba(52, 211, 153, 0.3)")
              }
              onBlur={(e) =>
                (e.currentTarget.style.borderColor =
                  "rgba(107, 140, 174, 0.12)")
              }
            />
            <div
              className="absolute bottom-3 right-4 text-xs"
              style={{
                fontFamily: "var(--font-display)",
                color: "rgba(107, 140, 174, 0.25)",
              }}
            >
              {textA.split("\n").length} lines
            </div>
          </div>

          {/* Right editor */}
          <div className="relative group">
            <CopyButton getValue={() => textB} />
            <div
              className="absolute top-3 left-4 text-xs select-none pointer-events-none"
              style={{
                fontFamily: "var(--font-display)",
                color: "rgba(107, 140, 174, 0.35)",
              }}
            >
              modified
            </div>
            <textarea
              value={textB}
              onChange={(e) => {
                setTextB(e.target.value);
                setDiff(null);
              }}
              placeholder="Paste modified text here..."
              spellCheck={false}
              className="w-full h-64 md:h-80 resize-y rounded-lg px-4 pt-10 pb-4 text-sm leading-relaxed outline-none transition-all duration-200 placeholder:opacity-30"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "13px",
                backgroundColor: "rgba(107, 140, 174, 0.04)",
                border: "1px solid rgba(107, 140, 174, 0.12)",
                color: "#F0F4F8",
              }}
              onFocus={(e) =>
                (e.currentTarget.style.borderColor =
                  "rgba(52, 211, 153, 0.3)")
              }
              onBlur={(e) =>
                (e.currentTarget.style.borderColor =
                  "rgba(107, 140, 174, 0.12)")
              }
            />
            <div
              className="absolute bottom-3 right-4 text-xs"
              style={{
                fontFamily: "var(--font-display)",
                color: "rgba(107, 140, 174, 0.25)",
              }}
            >
              {textB.split("\n").length} lines
            </div>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: 0.2,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="flex flex-wrap items-center gap-3 mb-8"
        >
          {/* Compare button */}
          <button
            onClick={handleCompare}
            disabled={!textA && !textB}
            className="px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              fontFamily: "var(--font-display)",
              backgroundColor: "#34D399",
              color: "#0D1117",
            }}
            onMouseEnter={(e) => {
              if (!e.currentTarget.disabled)
                e.currentTarget.style.backgroundColor = "#4ade80";
            }}
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#34D399")
            }
          >
            compare()
          </button>

          {/* Swap */}
          <button
            onClick={handleSwap}
            className="px-3 py-2.5 rounded-lg text-sm transition-colors duration-200"
            style={{
              fontFamily: "var(--font-display)",
              backgroundColor: "rgba(107, 140, 174, 0.08)",
              border: "1px solid rgba(107, 140, 174, 0.12)",
              color: "#6B8CAE",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderColor =
                "rgba(107, 140, 174, 0.3)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.borderColor =
                "rgba(107, 140, 174, 0.12)")
            }
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </button>

          {/* Clear */}
          <button
            onClick={handleClear}
            className="px-3 py-2.5 rounded-lg text-sm transition-colors duration-200"
            style={{
              fontFamily: "var(--font-display)",
              backgroundColor: "rgba(107, 140, 174, 0.08)",
              border: "1px solid rgba(107, 140, 174, 0.12)",
              color: "#6B8CAE",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderColor =
                "rgba(107, 140, 174, 0.3)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.borderColor =
                "rgba(107, 140, 174, 0.12)")
            }
          >
            clear
          </button>

          <div
            className="h-5 w-px mx-1 hidden sm:block"
            style={{ backgroundColor: "rgba(107, 140, 174, 0.12)" }}
          />

          {/* Options */}
          <label
            className="flex items-center gap-2 text-xs cursor-pointer select-none"
            style={{
              fontFamily: "var(--font-display)",
              color: "#6B8CAE",
            }}
          >
            <input
              type="checkbox"
              checked={ignoreWhitespace}
              onChange={(e) => {
                setIgnoreWhitespace(e.target.checked);
                setDiff(null);
              }}
              className="sr-only peer"
            />
            <div
              className="w-3.5 h-3.5 rounded-sm border flex items-center justify-center transition-colors peer-checked:border-emerald-400 peer-checked:bg-emerald-400/20"
              style={{
                borderColor: ignoreWhitespace
                  ? "#34D399"
                  : "rgba(107, 140, 174, 0.3)",
              }}
            >
              {ignoreWhitespace && (
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#34D399"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
            ignore whitespace
          </label>

          <label
            className="flex items-center gap-2 text-xs cursor-pointer select-none"
            style={{
              fontFamily: "var(--font-display)",
              color: "#6B8CAE",
            }}
          >
            <input
              type="checkbox"
              checked={ignoreCase}
              onChange={(e) => {
                setIgnoreCase(e.target.checked);
                setDiff(null);
              }}
              className="sr-only peer"
            />
            <div
              className="w-3.5 h-3.5 rounded-sm border flex items-center justify-center transition-colors peer-checked:border-emerald-400 peer-checked:bg-emerald-400/20"
              style={{
                borderColor: ignoreCase
                  ? "#34D399"
                  : "rgba(107, 140, 174, 0.3)",
              }}
            >
              {ignoreCase && (
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#34D399"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
            ignore case
          </label>
        </motion.div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {diff && (
            <motion.div
              key="diff-output"
              ref={diffRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Stats bar */}
              <div
                className="flex flex-wrap items-center justify-between gap-4 mb-4 px-4 py-3 rounded-lg"
                style={{
                  backgroundColor: "rgba(107, 140, 174, 0.04)",
                  border: "1px solid rgba(107, 140, 174, 0.1)",
                }}
              >
                <div
                  className="flex items-center gap-4 text-xs"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {!hasChanges ? (
                    <span style={{ color: "#34D399" }}>
                      Texts are identical
                    </span>
                  ) : (
                    <>
                      <span style={{ color: "#34D399" }}>
                        +{stats!.added} added
                      </span>
                      <span style={{ color: "#f87171" }}>
                        -{stats!.removed} removed
                      </span>
                      <span style={{ color: "rgba(107, 140, 174, 0.5)" }}>
                        {stats!.unchanged} unchanged
                      </span>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {/* View mode switcher */}
                  <div
                    className="flex rounded-md overflow-hidden"
                    style={{
                      border: "1px solid rgba(107, 140, 174, 0.12)",
                    }}
                  >
                    {(["unified", "split", "inline"] as ViewMode[]).map(
                      (mode) => (
                        <button
                          key={mode}
                          onClick={() => setViewMode(mode)}
                          className="px-3 py-1.5 text-xs transition-colors duration-150"
                          style={{
                            fontFamily: "var(--font-display)",
                            backgroundColor:
                              viewMode === mode
                                ? "rgba(52, 211, 153, 0.12)"
                                : "transparent",
                            color:
                              viewMode === mode ? "#34D399" : "#6B8CAE",
                          }}
                        >
                          {mode}
                        </button>
                      )
                    )}
                  </div>

                  {/* Line numbers toggle */}
                  <button
                    onClick={() => setShowLineNumbers(!showLineNumbers)}
                    className="px-2 py-1.5 rounded text-xs transition-colors duration-150"
                    style={{
                      fontFamily: "var(--font-display)",
                      backgroundColor: showLineNumbers
                        ? "rgba(52, 211, 153, 0.12)"
                        : "rgba(107, 140, 174, 0.08)",
                      color: showLineNumbers ? "#34D399" : "#6B8CAE",
                      border: "1px solid rgba(107, 140, 174, 0.12)",
                    }}
                  >
                    #
                  </button>

                  {/* Copy */}
                  <button
                    onClick={handleCopyDiff}
                    className="px-2 py-1.5 rounded text-xs transition-colors duration-150"
                    style={{
                      fontFamily: "var(--font-display)",
                      backgroundColor: "rgba(107, 140, 174, 0.08)",
                      color: copied ? "#34D399" : "#6B8CAE",
                      border: "1px solid rgba(107, 140, 174, 0.12)",
                    }}
                  >
                    {copied ? "copied!" : "copy"}
                  </button>
                </div>
              </div>

              {/* Diff output */}
              <div
                className="rounded-lg overflow-hidden"
                style={{
                  border: "1px solid rgba(107, 140, 174, 0.1)",
                }}
              >
                {viewMode === "split" ? (
                  <SplitView
                    diff={diff}
                    showLineNumbers={showLineNumbers}
                  />
                ) : viewMode === "inline" ? (
                  <InlineView
                    diff={diff}
                    showLineNumbers={showLineNumbers}
                  />
                ) : (
                  <UnifiedView
                    diff={diff}
                    showLineNumbers={showLineNumbers}
                  />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state */}
        {!diff && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-center py-20"
          >
            <div
              className="text-6xl mb-6"
              style={{
                fontFamily: "var(--font-display)",
                color: "rgba(107, 140, 174, 0.08)",
              }}
            >
              {"{ }"}
            </div>
            <p
              className="text-sm"
              style={{
                fontFamily: "var(--font-display)",
                color: "rgba(107, 140, 174, 0.25)",
              }}
            >
              paste your texts and hit compare
            </p>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 pb-8"
        style={{
          borderTop: "1px solid rgba(107, 140, 174, 0.08)",
        }}
      >
        <div className="pt-6 flex items-center justify-between">
          <p
            className="text-xs"
            style={{
              fontFamily: "var(--font-display)",
              color: "rgba(107, 140, 174, 0.25)",
            }}
          >
            100% free. runs locally in your browser.
          </p>
          <Link
            href="/tools"
            className="text-xs transition-colors duration-200"
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
            more tools
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── View Components ───────────────────────── */

function renderCharDiffs(charDiffs: CharDiff[], lineType: "added" | "removed") {
  return charDiffs.map((cd, i) => {
    if (cd.type === "equal") {
      return (
        <span
          key={i}
          style={{
            backgroundColor: "rgba(52, 211, 153, 0.15)",
            color: "#34D399",
            borderRadius: "2px",
          }}
        >
          {cd.value}
        </span>
      );
    }
    return (
      <span
        key={i}
        style={{
          backgroundColor:
            lineType === "added"
              ? "rgba(52, 211, 153, 0.35)"
              : "rgba(248, 113, 113, 0.35)",
          color: lineType === "added" ? "#86efac" : "#fca5a5",
          borderRadius: "2px",
          textDecoration: lineType === "removed" ? "line-through" : "none",
          textDecorationColor: "rgba(248, 113, 113, 0.5)",
        }}
      >
        {cd.value}
      </span>
    );
  });
}

function UnifiedView({
  diff,
  showLineNumbers,
}: {
  diff: DiffLine[];
  showLineNumbers: boolean;
}) {
  return (
    <div
      className="overflow-x-auto"
      style={{ backgroundColor: "rgba(13, 17, 23, 0.5)" }}
    >
      <table className="w-full border-collapse" style={{ fontFamily: "var(--font-display)", fontSize: "13px" }}>
        <tbody>
          {diff.map((line, i) => {
            const bgColor =
              line.type === "added"
                ? "rgba(52, 211, 153, 0.06)"
                : line.type === "removed"
                ? "rgba(248, 113, 113, 0.06)"
                : "transparent";
            const borderColor =
              line.type === "added"
                ? "rgba(52, 211, 153, 0.2)"
                : line.type === "removed"
                ? "rgba(248, 113, 113, 0.2)"
                : "transparent";
            const prefixColor =
              line.type === "added"
                ? "#34D399"
                : line.type === "removed"
                ? "#f87171"
                : "rgba(107, 140, 174, 0.2)";
            const prefix =
              line.type === "added"
                ? "+"
                : line.type === "removed"
                ? "-"
                : " ";

            return (
              <tr
                key={i}
                style={{
                  backgroundColor: bgColor,
                  borderLeft: `2px solid ${borderColor}`,
                }}
              >
                {showLineNumbers && (
                  <>
                    <td
                      className="px-3 py-0.5 text-right select-none whitespace-nowrap"
                      style={{
                        color: "rgba(107, 140, 174, 0.2)",
                        minWidth: "3rem",
                        fontSize: "12px",
                      }}
                    >
                      {line.lineLeft ?? ""}
                    </td>
                    <td
                      className="px-3 py-0.5 text-right select-none whitespace-nowrap"
                      style={{
                        color: "rgba(107, 140, 174, 0.2)",
                        minWidth: "3rem",
                        fontSize: "12px",
                        borderRight:
                          "1px solid rgba(107, 140, 174, 0.06)",
                      }}
                    >
                      {line.lineRight ?? ""}
                    </td>
                  </>
                )}
                <td
                  className="px-2 py-0.5 select-none"
                  style={{ color: prefixColor, width: "1.5rem" }}
                >
                  {prefix}
                </td>
                <td className="pr-4 py-0.5 whitespace-pre-wrap break-all">
                  <span
                    style={{
                      color:
                        line.type === "equal"
                          ? "rgba(240, 244, 248, 0.6)"
                          : "#F0F4F8",
                    }}
                  >
                    {line.charDiffs
                      ? renderCharDiffs(
                          line.charDiffs,
                          line.type as "added" | "removed"
                        )
                      : line.value}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function SplitView({
  diff,
  showLineNumbers,
}: {
  diff: DiffLine[];
  showLineNumbers: boolean;
}) {
  // Build left/right columns
  const left: (DiffLine | null)[] = [];
  const right: (DiffLine | null)[] = [];

  for (const line of diff) {
    if (line.type === "equal") {
      left.push(line);
      right.push(line);
    } else if (line.type === "removed") {
      left.push(line);
      right.push(null);
    } else {
      left.push(null);
      right.push(line);
    }
  }

  return (
    <div
      className="grid grid-cols-2 overflow-x-auto"
      style={{
        backgroundColor: "rgba(13, 17, 23, 0.5)",
        fontFamily: "var(--font-display)",
        fontSize: "13px",
      }}
    >
      {/* Left panel */}
      <div style={{ borderRight: "1px solid rgba(107, 140, 174, 0.08)" }}>
        <div
          className="px-3 py-2 text-xs select-none"
          style={{
            color: "rgba(107, 140, 174, 0.3)",
            borderBottom: "1px solid rgba(107, 140, 174, 0.06)",
          }}
        >
          original
        </div>
        {left.map((line, i) => {
          if (!line)
            return (
              <div
                key={i}
                className="px-4 py-0.5 min-h-[1.625rem]"
                style={{
                  backgroundColor: "rgba(107, 140, 174, 0.02)",
                }}
              />
            );
          const isRemoved = line.type === "removed";
          return (
            <div
              key={i}
              className="flex min-h-[1.625rem]"
              style={{
                backgroundColor: isRemoved
                  ? "rgba(248, 113, 113, 0.06)"
                  : "transparent",
                borderLeft: isRemoved
                  ? "2px solid rgba(248, 113, 113, 0.2)"
                  : "2px solid transparent",
              }}
            >
              {showLineNumbers && (
                <span
                  className="px-3 py-0.5 text-right select-none shrink-0"
                  style={{
                    color: "rgba(107, 140, 174, 0.2)",
                    minWidth: "3rem",
                    fontSize: "12px",
                  }}
                >
                  {line.lineLeft ?? ""}
                </span>
              )}
              <span
                className="px-3 py-0.5 whitespace-pre-wrap break-all"
                style={{
                  color: isRemoved
                    ? "#F0F4F8"
                    : "rgba(240, 244, 248, 0.6)",
                }}
              >
                {line.charDiffs && isRemoved
                  ? renderCharDiffs(line.charDiffs, "removed")
                  : line.value}
              </span>
            </div>
          );
        })}
      </div>

      {/* Right panel */}
      <div>
        <div
          className="px-3 py-2 text-xs select-none"
          style={{
            color: "rgba(107, 140, 174, 0.3)",
            borderBottom: "1px solid rgba(107, 140, 174, 0.06)",
          }}
        >
          modified
        </div>
        {right.map((line, i) => {
          if (!line)
            return (
              <div
                key={i}
                className="px-4 py-0.5 min-h-[1.625rem]"
                style={{
                  backgroundColor: "rgba(107, 140, 174, 0.02)",
                }}
              />
            );
          const isAdded = line.type === "added";
          return (
            <div
              key={i}
              className="flex min-h-[1.625rem]"
              style={{
                backgroundColor: isAdded
                  ? "rgba(52, 211, 153, 0.06)"
                  : "transparent",
                borderLeft: isAdded
                  ? "2px solid rgba(52, 211, 153, 0.2)"
                  : "2px solid transparent",
              }}
            >
              {showLineNumbers && (
                <span
                  className="px-3 py-0.5 text-right select-none shrink-0"
                  style={{
                    color: "rgba(107, 140, 174, 0.2)",
                    minWidth: "3rem",
                    fontSize: "12px",
                  }}
                >
                  {line.lineRight ?? ""}
                </span>
              )}
              <span
                className="px-3 py-0.5 whitespace-pre-wrap break-all"
                style={{
                  color: isAdded
                    ? "#F0F4F8"
                    : "rgba(240, 244, 248, 0.6)",
                }}
              >
                {line.charDiffs && isAdded
                  ? renderCharDiffs(line.charDiffs, "added")
                  : line.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function InlineView({
  diff,
  showLineNumbers,
}: {
  diff: DiffLine[];
  showLineNumbers: boolean;
}) {
  return (
    <div
      className="overflow-x-auto px-4 py-3"
      style={{
        backgroundColor: "rgba(13, 17, 23, 0.5)",
        fontFamily: "var(--font-display)",
        fontSize: "13px",
      }}
    >
      {diff.map((line, i) => {
        if (line.type === "equal") {
          return (
            <div key={i} className="py-0.5 flex">
              {showLineNumbers && (
                <span
                  className="mr-4 select-none shrink-0 text-right"
                  style={{
                    color: "rgba(107, 140, 174, 0.2)",
                    minWidth: "2rem",
                    fontSize: "12px",
                  }}
                >
                  {line.lineLeft}
                </span>
              )}
              <span
                className="whitespace-pre-wrap break-all"
                style={{ color: "rgba(240, 244, 248, 0.5)" }}
              >
                {line.value}
              </span>
            </div>
          );
        }

        if (line.type === "removed") {
          return (
            <div
              key={i}
              className="py-0.5 flex rounded-sm"
              style={{ backgroundColor: "rgba(248, 113, 113, 0.08)" }}
            >
              {showLineNumbers && (
                <span
                  className="mr-4 select-none shrink-0 text-right"
                  style={{
                    color: "rgba(248, 113, 113, 0.3)",
                    minWidth: "2rem",
                    fontSize: "12px",
                  }}
                >
                  {line.lineLeft}
                </span>
              )}
              <span className="whitespace-pre-wrap break-all">
                <span style={{ color: "#f87171", marginRight: "0.5rem" }}>
                  -
                </span>
                <span
                  style={{
                    color: "#F0F4F8",
                    textDecoration: "line-through",
                    textDecorationColor: "rgba(248, 113, 113, 0.4)",
                  }}
                >
                  {line.charDiffs
                    ? renderCharDiffs(line.charDiffs, "removed")
                    : line.value}
                </span>
              </span>
            </div>
          );
        }

        return (
          <div
            key={i}
            className="py-0.5 flex rounded-sm"
            style={{ backgroundColor: "rgba(52, 211, 153, 0.08)" }}
          >
            {showLineNumbers && (
              <span
                className="mr-4 select-none shrink-0 text-right"
                style={{
                  color: "rgba(52, 211, 153, 0.3)",
                  minWidth: "2rem",
                  fontSize: "12px",
                }}
              >
                {line.lineRight}
              </span>
            )}
            <span className="whitespace-pre-wrap break-all">
              <span style={{ color: "#34D399", marginRight: "0.5rem" }}>
                +
              </span>
              <span style={{ color: "#F0F4F8" }}>
                {line.charDiffs
                  ? renderCharDiffs(line.charDiffs, "added")
                  : line.value}
              </span>
            </span>
          </div>
        );
      })}
    </div>
  );
}
