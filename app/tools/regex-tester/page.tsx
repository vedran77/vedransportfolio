"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import CopyButton from "@/components/tools/CopyButton";

/* ───────────────────────── types ───────────────────────── */

interface MatchResult {
  fullMatch: string;
  index: number;
  groups: { name: string | number; value: string }[];
}

interface HighlightSegment {
  text: string;
  matchIndex: number | null; // null = no match
  groupIndex: number | null; // null = full match only
}

/* ───────────────────────── constants ───────────────────────── */

const GROUP_COLORS = [
  "#34D399", // green (full match)
  "#60A5FA", // blue
  "#F472B6", // pink
  "#FBBF24", // amber
  "#A78BFA", // violet
  "#FB923C", // orange
  "#2DD4BF", // teal
  "#E879F9", // fuchsia
];

const COMMON_PATTERNS: { label: string; pattern: string; flags: string }[] = [
  { label: "Email", pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}", flags: "g" },
  { label: "URL", pattern: "https?://[\\w\\-._~:/?#\\[\\]@!$&'()*+,;=%]+", flags: "g" },
  { label: "Phone (US)", pattern: "\\+?1?[\\s.-]?\\(?\\d{3}\\)?[\\s.-]?\\d{3}[\\s.-]?\\d{4}", flags: "g" },
  { label: "IPv4", pattern: "\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b", flags: "g" },
  { label: "Date (YYYY-MM-DD)", pattern: "\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])", flags: "g" },
  { label: "Hex Color", pattern: "#(?:[0-9a-fA-F]{3}){1,2}\\b", flags: "g" },
  { label: "HTML Tag", pattern: "<([a-zA-Z][a-zA-Z0-9]*)\\b[^>]*>(.*?)</\\1>", flags: "gs" },
  { label: "Digits Only", pattern: "\\d+", flags: "g" },
  { label: "Words", pattern: "\\b[a-zA-Z]+\\b", flags: "g" },
  { label: "Whitespace", pattern: "\\s+", flags: "g" },
];

const ALL_FLAGS = [
  { char: "g", label: "global" },
  { char: "i", label: "case-insensitive" },
  { char: "m", label: "multiline" },
  { char: "s", label: "dotAll" },
  { char: "u", label: "unicode" },
] as const;

/* ───────────────────────── helpers ───────────────────────── */

function buildRegex(
  pattern: string,
  flags: string
): { regex: RegExp | null; error: string | null } {
  if (!pattern) return { regex: null, error: null };
  try {
    const regex = new RegExp(pattern, flags);
    return { regex, error: null };
  } catch (e: unknown) {
    return {
      regex: null,
      error: e instanceof Error ? e.message : "Invalid regex",
    };
  }
}

function getMatches(regex: RegExp, testString: string): MatchResult[] {
  const results: MatchResult[] = [];
  const isGlobal = regex.global;
  regex.lastIndex = 0;

  let match: RegExpExecArray | null;
  const seen = new Set<number>();
  const limit = 1000;

  while ((match = regex.exec(testString)) !== null) {
    // Prevent infinite loops on zero-length matches
    if (match[0].length === 0) {
      if (seen.has(match.index)) break;
      seen.add(match.index);
      regex.lastIndex = match.index + 1;
    }

    const groups: { name: string | number; value: string }[] = [];

    // Numbered groups
    for (let i = 1; i < match.length; i++) {
      if (match[i] !== undefined) {
        groups.push({ name: i, value: match[i] });
      }
    }

    // Named groups
    if (match.groups) {
      for (const [name, value] of Object.entries(match.groups)) {
        if (value !== undefined) {
          groups.push({ name, value });
        }
      }
    }

    results.push({
      fullMatch: match[0],
      index: match.index,
      groups,
    });

    if (!isGlobal) break;
    if (results.length >= limit) break;
  }

  return results;
}

function buildHighlightSegments(
  testString: string,
  matches: MatchResult[]
): HighlightSegment[] {
  if (matches.length === 0) {
    return [{ text: testString, matchIndex: null, groupIndex: null }];
  }

  const segments: HighlightSegment[] = [];
  let lastEnd = 0;

  for (let mi = 0; mi < matches.length; mi++) {
    const m = matches[mi];
    const start = m.index;
    const end = start + m.fullMatch.length;

    // Text before this match
    if (start > lastEnd) {
      segments.push({
        text: testString.slice(lastEnd, start),
        matchIndex: null,
        groupIndex: null,
      });
    }

    // The match itself
    if (m.fullMatch.length > 0) {
      segments.push({
        text: m.fullMatch,
        matchIndex: mi,
        groupIndex: null,
      });
    }

    lastEnd = Math.max(lastEnd, end);
  }

  // Remaining text after last match
  if (lastEnd < testString.length) {
    segments.push({
      text: testString.slice(lastEnd),
      matchIndex: null,
      groupIndex: null,
    });
  }

  return segments;
}

/* ───────────────────────── component ───────────────────────── */

export default function RegexTesterPage() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [testString, setTestString] = useState("");
  const [copied, setCopied] = useState(false);
  const [showPatterns, setShowPatterns] = useState(false);

  const toggleFlag = useCallback(
    (flag: string) => {
      setFlags((prev) =>
        prev.includes(flag) ? prev.replace(flag, "") : prev + flag
      );
    },
    []
  );

  const { regex, error } = useMemo(
    () => buildRegex(pattern, flags),
    [pattern, flags]
  );

  const matches = useMemo(() => {
    if (!regex || !testString) return [];
    return getMatches(regex, testString);
  }, [regex, testString]);

  const highlightSegments = useMemo(
    () => buildHighlightSegments(testString, matches),
    [testString, matches]
  );

  const handleCopyRegex = useCallback(async () => {
    const text = `/${pattern}/${flags}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [pattern, flags]);

  const handleInsertPattern = useCallback(
    (p: { pattern: string; flags: string }) => {
      setPattern(p.pattern);
      setFlags(p.flags);
      setShowPatterns(false);
    },
    []
  );

  const hasContent = pattern.length > 0 || testString.length > 0;

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
              regex-tester
            </span>
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
            {"// regex-tester"}
          </span>
          <h1
            className="text-3xl sm:text-4xl font-light mb-3"
            style={{ fontFamily: "var(--font-body)", color: "#F0F4F8" }}
          >
            Regex Tester
          </h1>
          <p
            className="text-base"
            style={{
              fontFamily: "var(--font-body)",
              color: "#64748B",
            }}
          >
            Build, test, and debug regular expressions in real time.
          </p>
        </motion.div>

        {/* Regex Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.1,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mb-6"
        >
          <div className="flex flex-col gap-3">
            {/* Pattern input row */}
            <div className="flex items-center gap-3 flex-wrap">
              <div
                className="flex-1 min-w-0 flex items-center rounded-lg px-4 py-3"
                style={{
                  backgroundColor: "rgba(107, 140, 174, 0.06)",
                  border: error
                    ? "1px solid rgba(248, 113, 113, 0.5)"
                    : "1px solid rgba(107, 140, 174, 0.12)",
                }}
              >
                <span
                  className="text-lg select-none shrink-0 mr-1"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "#34D399",
                    opacity: 0.6,
                  }}
                >
                  /
                </span>
                <input
                  type="text"
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value)}
                  placeholder="enter regex pattern..."
                  spellCheck={false}
                  className="flex-1 min-w-0 bg-transparent outline-none text-sm placeholder:opacity-30"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "#F0F4F8",
                  }}
                />
                <span
                  className="text-lg select-none shrink-0 mx-1"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "#34D399",
                    opacity: 0.6,
                  }}
                >
                  /
                </span>
                <span
                  className="text-sm select-none shrink-0"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "#6B8CAE",
                    minWidth: "1.5rem",
                  }}
                >
                  {flags}
                </span>
              </div>

              {/* Copy button */}
              <button
                onClick={handleCopyRegex}
                disabled={!pattern}
                className="px-3 py-2.5 rounded-lg text-sm transition-colors duration-200 shrink-0"
                style={{
                  fontFamily: "var(--font-display)",
                  backgroundColor: "rgba(107, 140, 174, 0.08)",
                  border: "1px solid rgba(107, 140, 174, 0.12)",
                  color: copied ? "#34D399" : "#6B8CAE",
                  opacity: pattern ? 1 : 0.4,
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
                {copied ? "copied!" : "copy"}
              </button>

              {/* Quick patterns button */}
              <div className="relative">
                <button
                  onClick={() => setShowPatterns(!showPatterns)}
                  className="px-3 py-2.5 rounded-lg text-sm transition-colors duration-200 shrink-0"
                  style={{
                    fontFamily: "var(--font-display)",
                    backgroundColor: showPatterns
                      ? "rgba(52, 211, 153, 0.12)"
                      : "rgba(107, 140, 174, 0.08)",
                    border: "1px solid rgba(107, 140, 174, 0.12)",
                    color: showPatterns ? "#34D399" : "#6B8CAE",
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
                  patterns
                </button>

                <AnimatePresence>
                  {showPatterns && (
                    <motion.div
                      initial={{ opacity: 0, y: -4, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -4, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 z-40 rounded-lg py-2 w-64"
                      style={{
                        backgroundColor: "#161B22",
                        border: "1px solid rgba(107, 140, 174, 0.15)",
                        boxShadow:
                          "0 8px 32px rgba(0, 0, 0, 0.4)",
                      }}
                    >
                      <div
                        className="px-3 pb-2 mb-1 text-xs"
                        style={{
                          fontFamily: "var(--font-display)",
                          color: "rgba(107, 140, 174, 0.4)",
                          borderBottom:
                            "1px solid rgba(107, 140, 174, 0.08)",
                        }}
                      >
                        common patterns
                      </div>
                      {COMMON_PATTERNS.map((p) => (
                        <button
                          key={p.label}
                          onClick={() => handleInsertPattern(p)}
                          className="w-full text-left px-3 py-1.5 text-sm transition-colors duration-100"
                          style={{
                            fontFamily: "var(--font-display)",
                            color: "#F0F4F8",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor =
                              "rgba(52, 211, 153, 0.08)")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor =
                              "transparent")
                          }
                        >
                          <span style={{ color: "#34D399", opacity: 0.7 }}>
                            {p.label}
                          </span>
                          <span
                            className="block text-xs mt-0.5 truncate"
                            style={{
                              color: "rgba(107, 140, 174, 0.5)",
                            }}
                          >
                            /{p.pattern}/{p.flags}
                          </span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Flag toggles */}
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="text-xs mr-1"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "rgba(107, 140, 174, 0.4)",
                }}
              >
                flags:
              </span>
              {ALL_FLAGS.map((f) => {
                const active = flags.includes(f.char);
                return (
                  <button
                    key={f.char}
                    onClick={() => toggleFlag(f.char)}
                    className="px-2 py-1 rounded text-xs transition-colors duration-150"
                    style={{
                      fontFamily: "var(--font-display)",
                      backgroundColor: active
                        ? "rgba(52, 211, 153, 0.15)"
                        : "rgba(107, 140, 174, 0.06)",
                      border: active
                        ? "1px solid rgba(52, 211, 153, 0.3)"
                        : "1px solid rgba(107, 140, 174, 0.1)",
                      color: active ? "#34D399" : "#64748B",
                    }}
                    title={f.label}
                  >
                    {f.char}
                  </button>
                );
              })}
            </div>

            {/* Error display */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-lg px-4 py-3"
                  style={{
                    backgroundColor: "rgba(248, 113, 113, 0.08)",
                    border: "1px solid rgba(248, 113, 113, 0.2)",
                  }}
                >
                  <span
                    className="text-xs"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "#f87171",
                    }}
                  >
                    <span style={{ opacity: 0.5 }}>error: </span>
                    {error}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Test String */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.2,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mb-6"
        >
          <label
            className="text-xs block mb-2"
            style={{
              fontFamily: "var(--font-display)",
              color: "rgba(107, 140, 174, 0.5)",
            }}
          >
            test string
          </label>
          <div className="relative group">
            <CopyButton getValue={() => testString} />
            <textarea
              value={testString}
              onChange={(e) => setTestString(e.target.value)}
              placeholder="paste your test string here..."
              spellCheck={false}
              rows={8}
              className="w-full rounded-lg px-4 py-3 bg-transparent outline-none text-sm resize-y placeholder:opacity-30"
              style={{
                fontFamily: "var(--font-display)",
                color: "transparent",
                caretColor: "#F0F4F8",
                backgroundColor: "rgba(107, 140, 174, 0.06)",
                border: "1px solid rgba(107, 140, 174, 0.12)",
                lineHeight: "1.7",
              }}
            />
            {/* Highlight overlay */}
            <div
              className="absolute inset-0 pointer-events-none rounded-lg px-4 py-3 overflow-auto whitespace-pre-wrap break-words text-sm"
              style={{
                fontFamily: "var(--font-display)",
                lineHeight: "1.7",
                color: "#F0F4F8",
              }}
            >
              {testString &&
                highlightSegments.map((seg, i) => {
                  if (seg.matchIndex === null) {
                    return <span key={i}>{seg.text}</span>;
                  }
                  return (
                    <span
                      key={i}
                      style={{
                        backgroundColor: "rgba(52, 211, 153, 0.2)",
                        borderRadius: "2px",
                        borderBottom: "2px solid rgba(52, 211, 153, 0.5)",
                      }}
                    >
                      {seg.text}
                    </span>
                  );
                })}
            </div>
          </div>
        </motion.div>

        {/* Match Results */}
        <AnimatePresence mode="wait">
          {matches.length > 0 && (
            <motion.div
              key="results"
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
                  <span style={{ color: "#34D399" }}>
                    {matches.length} match{matches.length !== 1 ? "es" : ""}
                  </span>
                  {matches.some((m) => m.groups.length > 0) && (
                    <span style={{ color: "rgba(107, 140, 174, 0.5)" }}>
                      with capture groups
                    </span>
                  )}
                </div>
              </div>

              {/* Match list */}
              <div
                className="rounded-lg overflow-hidden"
                style={{
                  border: "1px solid rgba(107, 140, 174, 0.1)",
                  backgroundColor: "rgba(13, 17, 23, 0.5)",
                }}
              >
                <div
                  className="overflow-x-auto"
                  style={{ maxHeight: "400px", overflowY: "auto" }}
                >
                  <table
                    className="w-full border-collapse"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "13px",
                    }}
                  >
                    <thead>
                      <tr
                        style={{
                          borderBottom:
                            "1px solid rgba(107, 140, 174, 0.08)",
                        }}
                      >
                        <th
                          className="px-4 py-2.5 text-left text-xs font-normal"
                          style={{ color: "rgba(107, 140, 174, 0.4)" }}
                        >
                          #
                        </th>
                        <th
                          className="px-4 py-2.5 text-left text-xs font-normal"
                          style={{ color: "rgba(107, 140, 174, 0.4)" }}
                        >
                          match
                        </th>
                        <th
                          className="px-4 py-2.5 text-left text-xs font-normal"
                          style={{ color: "rgba(107, 140, 174, 0.4)" }}
                        >
                          index
                        </th>
                        <th
                          className="px-4 py-2.5 text-left text-xs font-normal"
                          style={{ color: "rgba(107, 140, 174, 0.4)" }}
                        >
                          groups
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {matches.map((m, mi) => (
                        <tr
                          key={mi}
                          style={{
                            borderBottom:
                              "1px solid rgba(107, 140, 174, 0.05)",
                          }}
                        >
                          <td
                            className="px-4 py-2 align-top"
                            style={{
                              color: "rgba(107, 140, 174, 0.3)",
                              width: "3rem",
                            }}
                          >
                            {mi + 1}
                          </td>
                          <td className="px-4 py-2 align-top">
                            <span
                              className="px-1.5 py-0.5 rounded"
                              style={{
                                backgroundColor: "rgba(52, 211, 153, 0.15)",
                                color: "#34D399",
                              }}
                            >
                              {m.fullMatch || (
                                <span style={{ opacity: 0.4 }}>
                                  (empty)
                                </span>
                              )}
                            </span>
                          </td>
                          <td
                            className="px-4 py-2 align-top"
                            style={{ color: "#64748B" }}
                          >
                            {m.index}
                          </td>
                          <td className="px-4 py-2 align-top">
                            {m.groups.length === 0 ? (
                              <span
                                style={{
                                  color: "rgba(107, 140, 174, 0.2)",
                                }}
                              >
                                --
                              </span>
                            ) : (
                              <div className="flex flex-wrap gap-1.5">
                                {m.groups.map((g, gi) => {
                                  const colorIdx =
                                    (typeof g.name === "number"
                                      ? g.name
                                      : gi + 1) % GROUP_COLORS.length;
                                  const color = GROUP_COLORS[colorIdx];
                                  return (
                                    <span
                                      key={gi}
                                      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs"
                                      style={{
                                        backgroundColor: `${color}15`,
                                        border: `1px solid ${color}30`,
                                      }}
                                    >
                                      <span
                                        style={{
                                          color: `${color}99`,
                                          fontSize: "10px",
                                        }}
                                      >
                                        {typeof g.name === "number"
                                          ? `$${g.name}`
                                          : g.name}
                                      </span>
                                      <span style={{ color }}>
                                        {g.value}
                                      </span>
                                    </span>
                                  );
                                })}
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* No matches state (when pattern exists but no matches) */}
          {regex && testString && matches.length === 0 && (
            <motion.div
              key="no-matches"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-center py-12"
            >
              <p
                className="text-sm"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "rgba(107, 140, 174, 0.3)",
                }}
              >
                no matches found
              </p>
            </motion.div>
          )}

          {/* Empty state */}
          {!hasContent && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-center py-20"
            >
              <div
                className="text-6xl sm:text-7xl mb-6"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "rgba(107, 140, 174, 0.08)",
                }}
              >
                /.*$/
              </div>
              <p
                className="text-sm"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "rgba(107, 140, 174, 0.25)",
                }}
              >
                enter a pattern and test string
              </p>
            </motion.div>
          )}
        </AnimatePresence>
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
