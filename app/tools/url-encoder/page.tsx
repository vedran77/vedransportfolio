"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import CopyButton from "@/components/tools/CopyButton";

/* ───────────────────────── types ───────────────────────── */

type EncodeMode = "component" | "uri";

interface QueryParam {
  id: string;
  key: string;
  value: string;
}

interface ParsedURL {
  protocol: string;
  hostname: string;
  port: string;
  pathname: string;
  hash: string;
  params: QueryParam[];
}

/* ───────────────────────── helpers ───────────────────────── */

let paramIdCounter = 0;
function nextParamId(): string {
  return `p-${++paramIdCounter}`;
}

function tryParseURL(raw: string): ParsedURL | null {
  try {
    const url = new URL(raw);
    const params: QueryParam[] = [];
    url.searchParams.forEach((value, key) => {
      params.push({ id: nextParamId(), key, value });
    });
    return {
      protocol: url.protocol.replace(/:$/, ""),
      hostname: url.hostname,
      port: url.port,
      pathname: url.pathname,
      hash: url.hash.replace(/^#/, ""),
      params,
    };
  } catch {
    return null;
  }
}

function rebuildURL(parsed: ParsedURL): string {
  const port = parsed.port ? `:${parsed.port}` : "";
  const search = parsed.params
    .filter((p) => p.key.trim())
    .map(
      (p) =>
        `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`
    )
    .join("&");
  const qs = search ? `?${search}` : "";
  const hash = parsed.hash ? `#${parsed.hash}` : "";
  return `${parsed.protocol}://${parsed.hostname}${port}${parsed.pathname}${qs}${hash}`;
}

/* ───────────────────────── shared styles ───────────────────────── */

const panelBg = "rgba(107, 140, 174, 0.04)";
const panelBorder = "1px solid rgba(107, 140, 174, 0.1)";
const headerBorder = "1px solid rgba(107, 140, 174, 0.08)";
const labelStyle = {
  fontFamily: "var(--font-display)",
  color: "rgba(107, 140, 174, 0.5)",
  fontSize: "12px" as const,
};
const inputFieldStyle = {
  fontFamily: "var(--font-display)",
  fontSize: "13px" as const,
  lineHeight: "1.7" as const,
  backgroundColor: "rgba(107, 140, 174, 0.06)",
  color: "#F0F4F8",
  border: "1px solid rgba(107, 140, 174, 0.12)",
  caretColor: "#34D399",
};

/* ───────────────────────── component ───────────────────────── */

export default function URLEncoderPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<EncodeMode>("component");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  /* URL parser state */
  const [urlInput, setUrlInput] = useState("");
  const [parsed, setParsed] = useState<ParsedURL | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [rebuiltCopied, setRebuiltCopied] = useState(false);

  /* ── encode/decode ── */

  const handleEncode = useCallback(() => {
    setCopied(false);
    setError(null);
    if (!input.trim()) {
      setOutput("");
      return;
    }
    try {
      const result =
        mode === "component"
          ? encodeURIComponent(input)
          : encodeURI(input);
      setOutput(result);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Encoding failed");
      setOutput("");
    }
  }, [input, mode]);

  const handleDecode = useCallback(() => {
    setCopied(false);
    setError(null);
    if (!input.trim()) {
      setOutput("");
      return;
    }
    try {
      const result =
        mode === "component"
          ? decodeURIComponent(input)
          : decodeURI(input);
      setOutput(result);
    } catch (e: unknown) {
      setError(
        e instanceof Error ? e.message : "Malformed encoded sequence"
      );
      setOutput("");
    }
  }, [input, mode]);

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

  const handleClear = useCallback(() => {
    setInput("");
    setOutput("");
    setError(null);
    setCopied(false);
    inputRef.current?.focus();
  }, []);

  /* ── URL parser ── */

  const handleParseURL = useCallback(() => {
    setParseError(null);
    if (!urlInput.trim()) {
      setParsed(null);
      return;
    }
    const result = tryParseURL(urlInput.trim());
    if (result) {
      setParsed(result);
    } else {
      setParseError("Invalid URL. Make sure it includes a protocol (e.g. https://).");
      setParsed(null);
    }
  }, [urlInput]);

  const updateParam = useCallback(
    (id: string, field: "key" | "value", val: string) => {
      setParsed((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          params: prev.params.map((p) =>
            p.id === id ? { ...p, [field]: val } : p
          ),
        };
      });
    },
    []
  );

  const deleteParam = useCallback((id: string) => {
    setParsed((prev) => {
      if (!prev) return prev;
      return { ...prev, params: prev.params.filter((p) => p.id !== id) };
    });
  }, []);

  const addParam = useCallback(() => {
    setParsed((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        params: [...prev.params, { id: nextParamId(), key: "", value: "" }],
      };
    });
  }, []);

  const updateParsedField = useCallback(
    (field: keyof Omit<ParsedURL, "params">, val: string) => {
      setParsed((prev) => {
        if (!prev) return prev;
        return { ...prev, [field]: val };
      });
    },
    []
  );

  const handleRebuild = useCallback(() => {
    if (!parsed) return;
    const rebuilt = rebuildURL(parsed);
    setUrlInput(rebuilt);
  }, [parsed]);

  const handleCopyRebuilt = useCallback(async () => {
    if (!parsed) return;
    const rebuilt = rebuildURL(parsed);
    await navigator.clipboard.writeText(rebuilt);
    setRebuiltCopied(true);
    setTimeout(() => setRebuiltCopied(false), 2000);
  }, [parsed]);

  /* ── keyboard shortcut ── */
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

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#0D1117", color: "#F0F4F8" }}
    >
      {/* ── Nav ── */}
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
            <span className="text-xs" style={{ fontFamily: "var(--font-display)", color: "rgba(107, 140, 174, 0.3)" }}>/</span>
            <Link
              href="/tools"
              className="text-sm transition-colors duration-200"
              style={{ fontFamily: "var(--font-display)", color: "#6B8CAE" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#34D399")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#6B8CAE")}
            >
              tools
            </Link>
            <span className="text-xs" style={{ fontFamily: "var(--font-display)", color: "rgba(107, 140, 174, 0.3)" }}>/</span>
            <span className="text-sm" style={{ fontFamily: "var(--font-display)", color: "#F0F4F8" }}>
              url-encoder
            </span>
          </div>
          <div
            className="hidden sm:flex items-center gap-2 text-xs"
            style={{ fontFamily: "var(--font-display)", color: "rgba(107, 140, 174, 0.4)" }}
          >
            <kbd className="px-1.5 py-0.5 rounded" style={{ backgroundColor: "rgba(107, 140, 174, 0.1)", border: "1px solid rgba(107, 140, 174, 0.15)" }}>Ctrl</kbd>
            <span>+</span>
            <kbd className="px-1.5 py-0.5 rounded" style={{ backgroundColor: "rgba(107, 140, 174, 0.1)", border: "1px solid rgba(107, 140, 174, 0.15)" }}>Enter</kbd>
            <span className="ml-1">to encode</span>
          </div>
        </div>
      </nav>

      {/* ── Main ── */}
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
            style={{ fontFamily: "var(--font-display)", color: "#6B8CAE", opacity: 0.5 }}
          >
            {"// url-encoder"}
          </span>
          <h1 className="text-3xl md:text-4xl tracking-tight mb-3" style={{ fontFamily: "var(--font-display)" }}>
            URL Encoder<span style={{ color: "#34D399" }}>()</span>
          </h1>
          <p
            className="text-base font-light max-w-lg"
            style={{ fontFamily: "var(--font-body)", color: "rgba(240, 244, 248, 0.5)" }}
          >
            Encode, decode, and parse URLs. Inspect query parameters and rebuild
            URLs from parts.
          </p>
        </motion.div>

        {/* ── Mode toggle ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6"
        >
          <div className="flex flex-wrap items-start gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ fontFamily: "var(--font-display)", color: "rgba(107, 140, 174, 0.5)" }}>
                mode:
              </span>
              {(["component", "uri"] as EncodeMode[]).map((opt) => (
                <button
                  key={opt}
                  onClick={() => setMode(opt)}
                  className="px-2.5 py-1 rounded text-xs transition-all duration-200"
                  style={{
                    fontFamily: "var(--font-display)",
                    backgroundColor: mode === opt ? "rgba(52, 211, 153, 0.15)" : "rgba(107, 140, 174, 0.06)",
                    color: mode === opt ? "#34D399" : "rgba(240, 244, 248, 0.5)",
                    border: `1px solid ${mode === opt ? "rgba(52, 211, 153, 0.3)" : "rgba(107, 140, 174, 0.1)"}`,
                  }}
                >
                  {opt === "component" ? "encodeURIComponent" : "encodeURI"}
                </button>
              ))}
            </div>
            <p
              className="text-xs max-w-md"
              style={{ fontFamily: "var(--font-body)", color: "rgba(107, 140, 174, 0.4)", lineHeight: 1.6 }}
            >
              {mode === "component"
                ? "Encodes all special characters including : / ? # & =. Best for encoding individual query parameter values."
                : "Preserves URL structure characters (: / ? # & =). Best for encoding a full URL while keeping it navigable."}
            </p>
          </div>
        </motion.div>

        {/* ── Toolbar ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-wrap items-center gap-3 mb-6"
        >
          <button
            onClick={handleEncode}
            className="px-4 py-2 rounded text-sm font-medium transition-opacity duration-200 hover:opacity-85 active:opacity-70"
            style={{ fontFamily: "var(--font-display)", backgroundColor: "#34D399", color: "#0D1117" }}
          >
            encode()
          </button>
          <button
            onClick={handleDecode}
            className="px-4 py-2 rounded text-sm font-medium transition-all duration-200"
            style={{
              fontFamily: "var(--font-display)",
              backgroundColor: "rgba(107, 140, 174, 0.12)",
              color: "#F0F4F8",
              border: "1px solid rgba(107, 140, 174, 0.2)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(107, 140, 174, 0.2)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(107, 140, 174, 0.12)")}
          >
            decode()
          </button>

          <div className="hidden sm:block h-6 w-px mx-1" style={{ backgroundColor: "rgba(107, 140, 174, 0.15)" }} />

          <button
            onClick={handleSwap}
            disabled={!output}
            className="px-3 py-2 rounded text-xs transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              fontFamily: "var(--font-display)",
              backgroundColor: "rgba(107, 140, 174, 0.08)",
              color: "rgba(240, 244, 248, 0.6)",
              border: "1px solid rgba(107, 140, 174, 0.1)",
            }}
          >
            swap
          </button>
          <button
            onClick={handleCopy}
            disabled={!output}
            className="px-3 py-2 rounded text-xs transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              fontFamily: "var(--font-display)",
              backgroundColor: "rgba(107, 140, 174, 0.08)",
              color: copied ? "#34D399" : "rgba(240, 244, 248, 0.6)",
              border: `1px solid ${copied ? "rgba(52, 211, 153, 0.3)" : "rgba(107, 140, 174, 0.1)"}`,
            }}
          >
            {copied ? "copied!" : "copy"}
          </button>
          <button
            onClick={handleClear}
            className="px-3 py-2 rounded text-xs transition-all duration-200"
            style={{
              fontFamily: "var(--font-display)",
              backgroundColor: "rgba(107, 140, 174, 0.08)",
              color: "rgba(240, 244, 248, 0.4)",
              border: "1px solid rgba(107, 140, 174, 0.1)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#f87171"; e.currentTarget.style.borderColor = "rgba(248, 113, 113, 0.3)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(240, 244, 248, 0.4)"; e.currentTarget.style.borderColor = "rgba(107, 140, 174, 0.1)"; }}
          >
            clear
          </button>
        </motion.div>

        {/* ── Error banner ── */}
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

        {/* ── Encoder panels ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-12"
        >
          {/* Input */}
          <div className="relative group rounded-lg overflow-hidden flex flex-col" style={{ backgroundColor: panelBg, border: panelBorder }}>
            <CopyButton getValue={() => input} />
            <div className="flex items-center justify-between px-4 py-2.5" style={{ borderBottom: headerBorder }}>
              <span style={labelStyle}>input</span>
              <span style={{ ...labelStyle, color: "rgba(107, 140, 174, 0.3)" }}>
                {input ? `${input.length} char${input.length !== 1 ? "s" : ""}` : "0 chars"}
              </span>
            </div>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => { setInput(e.target.value); if (error) setError(null); }}
              placeholder="paste text or a URL"
              spellCheck={false}
              className="flex-1 w-full resize-none p-4 outline-none placeholder:opacity-30"
              style={{ ...inputFieldStyle, backgroundColor: "transparent", minHeight: "260px", border: "none" }}
            />
          </div>

          {/* Output */}
          <div className="relative group rounded-lg overflow-hidden flex flex-col" style={{ backgroundColor: panelBg, border: panelBorder }}>
            <CopyButton getValue={() => output} />
            <div className="flex items-center justify-between px-4 py-2.5" style={{ borderBottom: headerBorder }}>
              <span style={labelStyle}>output</span>
              <span style={{ ...labelStyle, color: "rgba(107, 140, 174, 0.3)" }}>
                {output ? `${output.length} char${output.length !== 1 ? "s" : ""}` : "0 chars"}
              </span>
            </div>
            <div className="flex-1 p-4 overflow-auto" style={{ minHeight: "260px" }}>
              {output ? (
                <pre
                  className="whitespace-pre-wrap break-all"
                  style={{ fontFamily: "var(--font-display)", fontSize: "13px", lineHeight: "1.7", margin: 0, color: "#34D399" }}
                >
                  {output}
                </pre>
              ) : (
                <div className="h-full flex flex-col items-center justify-center select-none" style={{ minHeight: "220px" }}>
                  <span
                    className="text-5xl md:text-6xl font-light mb-6"
                    style={{ fontFamily: "var(--font-display)", color: "rgba(107, 140, 174, 0.07)" }}
                  >
                    %7B %7D
                  </span>
                  <span
                    className="text-sm"
                    style={{ fontFamily: "var(--font-display)", color: "rgba(107, 140, 174, 0.2)" }}
                  >
                    paste text or a URL
                  </span>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* ── URL Parser section ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mb-6">
            <h2 className="text-xl tracking-tight mb-2" style={{ fontFamily: "var(--font-display)" }}>
              URL Parser<span style={{ color: "#34D399" }}>()</span>
            </h2>
            <p className="text-sm font-light" style={{ fontFamily: "var(--font-body)", color: "rgba(240, 244, 248, 0.4)" }}>
              Paste a full URL to break it into its components. Edit parts and rebuild.
            </p>
          </div>

          {/* URL input row */}
          <div className="flex gap-3 mb-4">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => { setUrlInput(e.target.value); if (parseError) setParseError(null); }}
              onKeyDown={(e) => { if (e.key === "Enter") handleParseURL(); }}
              placeholder="https://example.com/path?key=value&foo=bar#section"
              spellCheck={false}
              className="flex-1 px-4 py-2.5 rounded text-sm outline-none placeholder:opacity-25"
              style={inputFieldStyle}
            />
            <button
              onClick={handleParseURL}
              className="px-4 py-2.5 rounded text-sm font-medium transition-opacity duration-200 hover:opacity-85 active:opacity-70 shrink-0"
              style={{ fontFamily: "var(--font-display)", backgroundColor: "#34D399", color: "#0D1117" }}
            >
              parse()
            </button>
          </div>

          {/* Parse error */}
          <AnimatePresence>
            {parseError && (
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
                  {parseError}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Parsed result */}
          <AnimatePresence>
            {parsed && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="rounded-lg overflow-hidden"
                style={{ backgroundColor: panelBg, border: panelBorder }}
              >
                {/* URL parts grid */}
                <div className="px-4 py-3" style={{ borderBottom: headerBorder }}>
                  <span style={labelStyle}>components</span>
                </div>
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {([
                    { label: "protocol", field: "protocol" as const },
                    { label: "hostname", field: "hostname" as const },
                    { label: "port", field: "port" as const },
                    { label: "pathname", field: "pathname" as const },
                    { label: "hash", field: "hash" as const },
                  ]).map(({ label, field }) => (
                    <div key={field}>
                      <label
                        className="block mb-1 text-xs"
                        style={{ fontFamily: "var(--font-display)", color: "#6B8CAE" }}
                      >
                        {label}
                      </label>
                      <input
                        type="text"
                        value={parsed[field]}
                        onChange={(e) => updateParsedField(field, e.target.value)}
                        spellCheck={false}
                        className="w-full px-3 py-2 rounded text-sm outline-none"
                        style={inputFieldStyle}
                      />
                    </div>
                  ))}
                </div>

                {/* Query params */}
                <div className="px-4 py-3" style={{ borderTop: headerBorder, borderBottom: headerBorder }}>
                  <div className="flex items-center justify-between">
                    <span style={labelStyle}>
                      query params ({parsed.params.length})
                    </span>
                    <button
                      onClick={addParam}
                      className="text-xs px-2.5 py-1 rounded transition-all duration-200"
                      style={{
                        fontFamily: "var(--font-display)",
                        backgroundColor: "rgba(52, 211, 153, 0.1)",
                        color: "#34D399",
                        border: "1px solid rgba(52, 211, 153, 0.2)",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(52, 211, 153, 0.2)")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(52, 211, 153, 0.1)")}
                    >
                      + add param
                    </button>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  {parsed.params.length === 0 && (
                    <p className="text-xs py-2" style={{ fontFamily: "var(--font-display)", color: "rgba(107, 140, 174, 0.3)" }}>
                      no query parameters
                    </p>
                  )}
                  {parsed.params.map((param) => (
                    <div key={param.id} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={param.key}
                        onChange={(e) => updateParam(param.id, "key", e.target.value)}
                        placeholder="key"
                        spellCheck={false}
                        className="flex-1 px-3 py-2 rounded text-sm outline-none placeholder:opacity-25"
                        style={inputFieldStyle}
                      />
                      <span className="text-xs" style={{ color: "#64748B" }}>=</span>
                      <input
                        type="text"
                        value={param.value}
                        onChange={(e) => updateParam(param.id, "value", e.target.value)}
                        placeholder="value"
                        spellCheck={false}
                        className="flex-1 px-3 py-2 rounded text-sm outline-none placeholder:opacity-25"
                        style={inputFieldStyle}
                      />
                      <button
                        onClick={() => deleteParam(param.id)}
                        className="px-2.5 py-2 rounded text-xs transition-all duration-200 shrink-0"
                        style={{
                          fontFamily: "var(--font-display)",
                          backgroundColor: "rgba(107, 140, 174, 0.06)",
                          color: "rgba(240, 244, 248, 0.3)",
                          border: "1px solid rgba(107, 140, 174, 0.1)",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = "#f87171"; e.currentTarget.style.borderColor = "rgba(248, 113, 113, 0.3)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(240, 244, 248, 0.3)"; e.currentTarget.style.borderColor = "rgba(107, 140, 174, 0.1)"; }}
                      >
                        del
                      </button>
                    </div>
                  ))}
                </div>

                {/* Rebuild row */}
                <div
                  className="px-4 py-3 flex flex-wrap items-center gap-3"
                  style={{ borderTop: headerBorder }}
                >
                  <button
                    onClick={handleRebuild}
                    className="px-4 py-2 rounded text-sm font-medium transition-opacity duration-200 hover:opacity-85 active:opacity-70"
                    style={{ fontFamily: "var(--font-display)", backgroundColor: "#34D399", color: "#0D1117" }}
                  >
                    rebuild()
                  </button>
                  <button
                    onClick={handleCopyRebuilt}
                    className="px-3 py-2 rounded text-xs transition-all duration-200"
                    style={{
                      fontFamily: "var(--font-display)",
                      backgroundColor: "rgba(107, 140, 174, 0.08)",
                      color: rebuiltCopied ? "#34D399" : "rgba(240, 244, 248, 0.6)",
                      border: `1px solid ${rebuiltCopied ? "rgba(52, 211, 153, 0.3)" : "rgba(107, 140, 174, 0.1)"}`,
                    }}
                  >
                    {rebuiltCopied ? "copied!" : "copy rebuilt"}
                  </button>
                  <span
                    className="text-xs truncate max-w-md"
                    style={{ fontFamily: "var(--font-display)", color: "rgba(107, 140, 174, 0.4)" }}
                  >
                    {rebuildURL(parsed)}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>

      {/* ── Footer ── */}
      <footer className="mt-auto" style={{ borderTop: "1px solid rgba(107, 140, 174, 0.08)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <span className="text-xs" style={{ fontFamily: "var(--font-display)", color: "rgba(107, 140, 174, 0.3)" }}>
            100% free. runs locally in your browser.
          </span>
          <Link
            href="/tools"
            className="text-xs transition-colors duration-200"
            style={{ fontFamily: "var(--font-display)", color: "rgba(107, 140, 174, 0.4)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#34D399")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(107, 140, 174, 0.4)")}
          >
            more tools →
          </Link>
        </div>
      </footer>
    </div>
  );
}
