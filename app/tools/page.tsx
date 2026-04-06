"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const tools = [
  {
    slug: "text-compare",
    name: "Text Compare",
    description: "Side-by-side diff with character-level highlighting.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v18" /><path d="M3 7h4l2 2-2 2H3" /><path d="M21 7h-4l-2 2 2 2h4" />
      </svg>
    ),
    accent: "#34D399",
  },
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    description: "Format, minify, and validate JSON with syntax highlighting.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 7c0-1.1.9-2 2-2h1c1.1 0 2 .9 2 2v3c0 1.1-.9 2-2 2" /><path d="M4 17c0 1.1.9 2 2 2h1c1.1 0 2-.9 2-2v-3c0-1.1-.9-2-2-2" />
        <path d="M20 7c0-1.1-.9-2-2-2h-1c-1.1 0-2 .9-2 2v3c0 1.1.9 2 2 2" /><path d="M20 17c0 1.1-.9 2-2 2h-1c-1.1 0-2-.9-2-2v-3c0-1.1.9-2 2-2" />
      </svg>
    ),
    accent: "#fbbf24",
  },
  {
    slug: "base64",
    name: "Base64",
    description: "Encode and decode Base64 with file support and URL-safe mode.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 3l5 5-5 5" /><path d="M8 21l-5-5 5-5" /><path d="M14 3l-4 18" />
      </svg>
    ),
    accent: "#a78bfa",
  },
  {
    slug: "regex-tester",
    name: "Regex Tester",
    description: "Real-time pattern matching with capture groups and presets.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" /><path d="M12 2v4" /><path d="M12 18v4" /><path d="M4.93 4.93l2.83 2.83" /><path d="M16.24 16.24l2.83 2.83" /><path d="M2 12h4" /><path d="M18 12h4" />
      </svg>
    ),
    accent: "#f97316",
  },
  {
    slug: "color-converter",
    name: "Color Converter",
    description: "HEX, RGB, HSL converter with contrast checker and palettes.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M12 2a10 10 0 0 1 0 20" fill="currentColor" opacity="0.3" />
      </svg>
    ),
    accent: "#ec4899",
  },
  {
    slug: "lorem-generator",
    name: "Lorem Generator",
    description: "Lorem ipsum, fake API responses, and placeholder user data.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 7h16" /><path d="M4 12h12" /><path d="M4 17h8" />
      </svg>
    ),
    accent: "#6B8CAE",
  },
  {
    slug: "url-encoder",
    name: "URL Encoder",
    description: "Encode, decode, and parse URLs with query parameter editor.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    ),
    accent: "#22d3ee",
  },
  {
    slug: "hash-generator",
    name: "Hash Generator",
    description: "SHA-1, SHA-256, SHA-512 hashing with comparison mode.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 9h16" /><path d="M4 15h16" /><path d="M10 3v18" /><path d="M14 3v18" />
      </svg>
    ),
    accent: "#64748B",
  },
  {
    slug: "timestamp-converter",
    name: "Timestamp Converter",
    description: "Unix timestamp converter with live clock and date math.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
      </svg>
    ),
    accent: "#34D399",
  },
];

export default function ToolsPage() {
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#0D1117", color: "#F0F4F8" }}
    >
      {/* Nav */}
      <nav
        className="sticky top-0 z-50 backdrop-blur-md"
        style={{
          backgroundColor: "rgba(13, 17, 23, 0.85)",
          borderBottom: "1px solid rgba(107, 140, 174, 0.1)",
        }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center">
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
            className="text-xs mx-3"
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
            tools
          </span>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16"
        >
          <span
            className="text-sm block mb-4"
            style={{
              fontFamily: "var(--font-display)",
              color: "#6B8CAE",
              opacity: 0.5,
            }}
          >
            {"// useful-tools"}
          </span>
          <h1
            className="text-3xl md:text-4xl lg:text-5xl tracking-tight mb-3"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Tools<span style={{ color: "#34D399" }}>()</span>
          </h1>
          <p
            className="text-base md:text-lg font-light max-w-lg"
            style={{
              fontFamily: "var(--font-body)",
              color: "rgba(240, 244, 248, 0.5)",
            }}
          >
            Free developer utilities. No accounts, no paywalls, no tracking.
            Just tools that work.
          </p>
        </motion.div>

        {/* Tool grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool, i) => (
            <motion.div
              key={tool.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.15 + i * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Link href={`/tools/${tool.slug}`}>
                <div
                  className="group relative rounded-lg p-6 transition-all duration-300 cursor-pointer h-full"
                  style={{
                    backgroundColor: "rgba(107, 140, 174, 0.04)",
                    border: "1px solid rgba(107, 140, 174, 0.1)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = `${tool.accent}33`;
                    e.currentTarget.style.backgroundColor =
                      "rgba(107, 140, 174, 0.06)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor =
                      "rgba(107, 140, 174, 0.1)";
                    e.currentTarget.style.backgroundColor =
                      "rgba(107, 140, 174, 0.04)";
                  }}
                >
                  <div
                    className="mb-4 transition-colors duration-300"
                    style={{ color: "#6B8CAE" }}
                  >
                    {tool.icon}
                  </div>
                  <h3
                    className="text-base mb-2 tracking-tight"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "#F0F4F8",
                    }}
                  >
                    {tool.name}
                  </h3>
                  <p
                    className="text-sm font-light leading-relaxed"
                    style={{
                      fontFamily: "var(--font-body)",
                      color: "rgba(240, 244, 248, 0.45)",
                    }}
                  >
                    {tool.description}
                  </p>
                  <div
                    className="mt-4 text-xs flex items-center gap-1.5 transition-colors duration-200"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "#6B8CAE",
                    }}
                  >
                    open
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="transition-transform duration-200 group-hover:translate-x-1"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}

        </div>
      </div>
    </div>
  );
}
