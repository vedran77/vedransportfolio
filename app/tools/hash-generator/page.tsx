"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

/* ───────────────────────── constants ───────────────────────── */

const ALGORITHMS = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"] as const;
type Algorithm = (typeof ALGORITHMS)[number];

const EMPTY_SHA256 =
  "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

/* ───────────────────────── helpers ───────────────────────── */

async function computeHash(
  algorithm: Algorithm,
  text: string
): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const buffer = await crypto.subtle.digest(algorithm, data);
  const bytes = new Uint8Array(buffer);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function computeAllHashes(
  text: string
): Promise<Record<Algorithm, string>> {
  const results = await Promise.all(
    ALGORITHMS.map(async (alg) => {
      const hash = await computeHash(alg, text);
      return [alg, hash] as const;
    })
  );
  return Object.fromEntries(results) as Record<Algorithm, string>;
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

/* ───────────────────────── component ───────────────────────── */

export default function HashGeneratorPage() {
  /* ── hashing state ── */
  const [input, setInput] = useState("");
  const [hashes, setHashes] = useState<Record<Algorithm, string> | null>(null);
  const [uppercase, setUppercase] = useState(false);
  const [copiedAlg, setCopiedAlg] = useState<Algorithm | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  /* ── compare state ── */
  const [mode, setMode] = useState<"hash" | "compare">("hash");
  const [compareText, setCompareText] = useState("");
  const [compareHash, setCompareHash] = useState("");
  const [compareResult, setCompareResult] = useState<{
    match: boolean;
    algorithm: Algorithm | null;
  } | null>(null);

  const debouncedInput = useDebounce(input, 300);
  const debouncedCompareText = useDebounce(compareText, 300);
  const debouncedCompareHash = useDebounce(compareHash, 300);

  /* ── real-time hashing ── */
  useEffect(() => {
    if (mode !== "hash") return;
    let cancelled = false;
    computeAllHashes(debouncedInput).then((result) => {
      if (!cancelled) setHashes(result);
    });
    return () => {
      cancelled = true;
    };
  }, [debouncedInput, mode]);

  /* ── compare logic ── */
  useEffect(() => {
    if (mode !== "compare") return;
    if (!debouncedCompareText || !debouncedCompareHash.trim()) {
      setCompareResult(null);
      return;
    }

    let cancelled = false;
    const normalizedTarget = debouncedCompareHash.trim().toLowerCase();

    computeAllHashes(debouncedCompareText).then((result) => {
      if (cancelled) return;
      for (const alg of ALGORITHMS) {
        if (result[alg] === normalizedTarget) {
          setCompareResult({ match: true, algorithm: alg });
          return;
        }
      }
      setCompareResult({ match: false, algorithm: null });
    });

    return () => {
      cancelled = true;
    };
  }, [debouncedCompareText, debouncedCompareHash, mode]);

  /* ── copy handler ── */
  const handleCopy = useCallback(
    async (alg: Algorithm, value: string) => {
      const text = uppercase ? value.toUpperCase() : value;
      await navigator.clipboard.writeText(text);
      setCopiedAlg(alg);
      setTimeout(() => setCopiedAlg(null), 2000);
    },
    [uppercase]
  );

  /* ── clear ── */
  const handleClear = useCallback(() => {
    setInput("");
    setHashes(null);
    setCopiedAlg(null);
    inputRef.current?.focus();
  }, []);

  const hasInput = input.length > 0;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#0D1117", color: "#F0F4F8" }}
    >
      {/* ─── Nav ─── */}
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
              hash-generator
            </span>
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
            {"// hash-generator"}
          </span>
          <h1
            className="text-3xl md:text-4xl tracking-tight mb-3"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Hash Generator<span style={{ color: "#34D399" }}>()</span>
          </h1>
          <p
            className="text-base font-light max-w-lg"
            style={{
              fontFamily: "var(--font-body)",
              color: "rgba(240, 244, 248, 0.5)",
            }}
          >
            Generate SHA-1, SHA-256, SHA-384, and SHA-512 hashes in real time.
            Powered by Web Crypto API — nothing leaves your browser.
          </p>
        </motion.div>

        {/* Mode toggle + toolbar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.1,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="flex flex-wrap items-center gap-3 mb-6"
        >
          {/* mode buttons */}
          {(["hash", "compare"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className="px-4 py-2 rounded text-sm font-medium transition-all duration-200"
              style={{
                fontFamily: "var(--font-display)",
                backgroundColor:
                  mode === m ? "#34D399" : "rgba(107, 140, 174, 0.12)",
                color: mode === m ? "#0D1117" : "#F0F4F8",
                border:
                  mode === m
                    ? "1px solid transparent"
                    : "1px solid rgba(107, 140, 174, 0.2)",
              }}
            >
              {m === "hash" ? "hash()" : "compare()"}
            </button>
          ))}

          {/* separator */}
          <div
            className="hidden sm:block h-6 w-px mx-1"
            style={{ backgroundColor: "rgba(107, 140, 174, 0.15)" }}
          />

          {/* uppercase toggle */}
          <button
            onClick={() => setUppercase((v) => !v)}
            className="px-3 py-2 rounded text-xs transition-all duration-200"
            style={{
              fontFamily: "var(--font-display)",
              backgroundColor: uppercase
                ? "rgba(52, 211, 153, 0.15)"
                : "rgba(107, 140, 174, 0.08)",
              color: uppercase ? "#34D399" : "rgba(240, 244, 248, 0.6)",
              border: uppercase
                ? "1px solid rgba(52, 211, 153, 0.3)"
                : "1px solid rgba(107, 140, 174, 0.1)",
            }}
          >
            {uppercase ? "UPPERCASE" : "lowercase"}
          </button>

          {mode === "hash" && (
            <>
              <div
                className="hidden sm:block h-6 w-px mx-1"
                style={{ backgroundColor: "rgba(107, 140, 174, 0.15)" }}
              />
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
                  e.currentTarget.style.borderColor =
                    "rgba(248, 113, 113, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "rgba(240, 244, 248, 0.4)";
                  e.currentTarget.style.borderColor =
                    "rgba(107, 140, 174, 0.1)";
                }}
              >
                clear
              </button>
            </>
          )}
        </motion.div>

        {/* ─── Hash Mode ─── */}
        <AnimatePresence mode="wait">
          {mode === "hash" && (
            <motion.div
              key="hash-mode"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {/* Input panel */}
              <div
                className="rounded-lg overflow-hidden mb-6"
                style={{
                  backgroundColor: "rgba(107, 140, 174, 0.04)",
                  border: "1px solid rgba(107, 140, 174, 0.1)",
                }}
              >
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
                    {input.length} char{input.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="type or paste text to hash..."
                  spellCheck={false}
                  className="w-full resize-none p-4 outline-none placeholder:opacity-30"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "13px",
                    lineHeight: "1.7",
                    backgroundColor: "transparent",
                    color: "#F0F4F8",
                    minHeight: "140px",
                    caretColor: "#34D399",
                  }}
                />
              </div>

              {/* Hash results */}
              <div className="space-y-3">
                {ALGORITHMS.map((alg, i) => {
                  const hashValue = hashes?.[alg] ?? "";
                  const displayValue = uppercase
                    ? hashValue.toUpperCase()
                    : hashValue;
                  const isCopied = copiedAlg === alg;

                  return (
                    <motion.div
                      key={alg}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.4,
                        delay: 0.15 + i * 0.06,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="rounded-lg overflow-hidden"
                      style={{
                        backgroundColor: "rgba(107, 140, 174, 0.04)",
                        border: "1px solid rgba(107, 140, 174, 0.1)",
                      }}
                    >
                      <div className="flex items-center gap-4 px-4 py-3">
                        {/* Algorithm label */}
                        <span
                          className="text-xs shrink-0 w-16 text-right"
                          style={{
                            fontFamily: "var(--font-display)",
                            color: "#6B8CAE",
                          }}
                        >
                          {alg}
                        </span>

                        {/* Separator */}
                        <div
                          className="h-5 w-px shrink-0"
                          style={{
                            backgroundColor: "rgba(107, 140, 174, 0.15)",
                          }}
                        />

                        {/* Hash value */}
                        <div className="flex-1 min-w-0">
                          {hasInput && displayValue ? (
                            <span
                              className="text-xs break-all leading-relaxed"
                              style={{
                                fontFamily: "var(--font-display)",
                                color: "#34D399",
                              }}
                            >
                              {displayValue}
                            </span>
                          ) : (
                            <span
                              className="text-xs"
                              style={{
                                fontFamily: "var(--font-display)",
                                color: "rgba(107, 140, 174, 0.2)",
                              }}
                            >
                              {alg === "SHA-256"
                                ? uppercase
                                  ? EMPTY_SHA256.toUpperCase()
                                  : EMPTY_SHA256
                                : "waiting for input..."}
                            </span>
                          )}
                        </div>

                        {/* Copy button */}
                        <button
                          onClick={() => handleCopy(alg, hashValue)}
                          disabled={!hasInput || !hashValue}
                          className="shrink-0 px-2.5 py-1.5 rounded text-xs transition-all duration-200 disabled:opacity-20 disabled:cursor-not-allowed"
                          style={{
                            fontFamily: "var(--font-display)",
                            backgroundColor: isCopied
                              ? "rgba(52, 211, 153, 0.15)"
                              : "rgba(107, 140, 174, 0.08)",
                            color: isCopied
                              ? "#34D399"
                              : "rgba(240, 244, 248, 0.5)",
                            border: isCopied
                              ? "1px solid rgba(52, 211, 153, 0.3)"
                              : "1px solid rgba(107, 140, 174, 0.1)",
                          }}
                        >
                          {isCopied ? "copied!" : "copy"}
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ─── Compare Mode ─── */}
          {mode === "compare" && (
            <motion.div
              key="compare-mode"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="space-y-6"
            >
              {/* Text input */}
              <div
                className="rounded-lg overflow-hidden"
                style={{
                  backgroundColor: "rgba(107, 140, 174, 0.04)",
                  border: "1px solid rgba(107, 140, 174, 0.1)",
                }}
              >
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
                    plain text
                  </span>
                  <span
                    className="text-xs"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "rgba(107, 140, 174, 0.3)",
                    }}
                  >
                    {compareText.length} char
                    {compareText.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <textarea
                  value={compareText}
                  onChange={(e) => setCompareText(e.target.value)}
                  placeholder="enter the original text..."
                  spellCheck={false}
                  className="w-full resize-none p-4 outline-none placeholder:opacity-30"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "13px",
                    lineHeight: "1.7",
                    backgroundColor: "transparent",
                    color: "#F0F4F8",
                    minHeight: "120px",
                    caretColor: "#34D399",
                  }}
                />
              </div>

              {/* Hash input */}
              <div
                className="rounded-lg overflow-hidden"
                style={{
                  backgroundColor: "rgba(107, 140, 174, 0.04)",
                  border: "1px solid rgba(107, 140, 174, 0.1)",
                }}
              >
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
                    expected hash
                  </span>
                  <span
                    className="text-xs"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "rgba(107, 140, 174, 0.3)",
                    }}
                  >
                    hex
                  </span>
                </div>
                <textarea
                  value={compareHash}
                  onChange={(e) => setCompareHash(e.target.value)}
                  placeholder="paste the hash to verify against..."
                  spellCheck={false}
                  className="w-full resize-none p-4 outline-none placeholder:opacity-30"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "13px",
                    lineHeight: "1.7",
                    backgroundColor: "transparent",
                    color: "#F0F4F8",
                    minHeight: "80px",
                    caretColor: "#34D399",
                  }}
                />
              </div>

              {/* Result */}
              <AnimatePresence>
                {compareResult && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div
                      className="px-4 py-4 rounded-lg text-sm"
                      style={{
                        fontFamily: "var(--font-display)",
                        backgroundColor: compareResult.match
                          ? "rgba(52, 211, 153, 0.08)"
                          : "rgba(248, 113, 113, 0.08)",
                        border: compareResult.match
                          ? "1px solid rgba(52, 211, 153, 0.2)"
                          : "1px solid rgba(248, 113, 113, 0.2)",
                        color: compareResult.match ? "#34D399" : "#f87171",
                      }}
                    >
                      {compareResult.match ? (
                        <div className="flex items-center gap-3">
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                          </svg>
                          <span>
                            <span style={{ opacity: 0.6 }}>match: </span>
                            hash matches using{" "}
                            <span style={{ fontWeight: 600 }}>
                              {compareResult.algorithm}
                            </span>
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <line x1="15" y1="9" x2="9" y2="15" />
                            <line x1="9" y1="9" x2="15" y2="15" />
                          </svg>
                          <span>
                            <span style={{ opacity: 0.6 }}>no match: </span>
                            hash does not match any supported algorithm
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Empty state for compare */}
              {!compareResult &&
                (!compareText || !compareHash.trim()) && (
                  <div
                    className="flex flex-col items-center justify-center py-12 select-none"
                  >
                    <span
                      className="text-5xl font-light mb-4"
                      style={{
                        fontFamily: "var(--font-display)",
                        color: "rgba(107, 140, 174, 0.07)",
                      }}
                    >
                      {"=="}
                    </span>
                    <span
                      className="text-sm"
                      style={{
                        fontFamily: "var(--font-display)",
                        color: "rgba(107, 140, 174, 0.2)",
                      }}
                    >
                      enter text and a hash to compare
                    </span>
                  </div>
                )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ─── Footer ─── */}
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
