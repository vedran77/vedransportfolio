"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const tools = [
  {
    slug: "text-compare",
    name: "Text Compare",
    tagline: "diff(a, b)",
    description: "Side-by-side diff with character-level highlighting.",
    accent: "#34D399",
  },
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    tagline: "JSON.parse()",
    description: "Format, minify, and validate JSON with syntax highlighting.",
    accent: "#fbbf24",
  },
  {
    slug: "base64",
    name: "Base64",
    tagline: "btoa() / atob()",
    description: "Encode and decode Base64 with file support.",
    accent: "#a78bfa",
  },
  {
    slug: "regex-tester",
    name: "Regex Tester",
    tagline: "/pattern/gi",
    description: "Real-time pattern matching with capture groups.",
    accent: "#f97316",
  },
  {
    slug: "color-converter",
    name: "Color Converter",
    tagline: "hex ↔ rgb ↔ hsl",
    description: "Convert colors with contrast checker and palettes.",
    accent: "#ec4899",
  },
  {
    slug: "lorem-generator",
    name: "Lorem Generator",
    tagline: "lorem(n)",
    description: "Lorem ipsum, fake API data, and placeholder users.",
    accent: "#6B8CAE",
  },
  {
    slug: "url-encoder",
    name: "URL Encoder",
    tagline: "encodeURI()",
    description: "Encode, decode, and parse URLs with param editor.",
    accent: "#22d3ee",
  },
  {
    slug: "hash-generator",
    name: "Hash Generator",
    tagline: "sha256()",
    description: "SHA-1, SHA-256, SHA-512 hashing with comparison.",
    accent: "#64748B",
  },
  {
    slug: "timestamp-converter",
    name: "Timestamp Converter",
    tagline: "Date.now()",
    description: "Unix timestamps, live clock, and date math.",
    accent: "#34D399",
  },
];

export default function TerrainTools() {
  return (
    <section id="tools" style={{ backgroundColor: "#0D1117" }}>
      {/* Separator */}
      <div className="max-w-6xl mx-auto px-6 md:px-8">
        <div
          className="h-px"
          style={{
            background:
              "linear-gradient(to right, transparent, #6B8CAE33, transparent)",
          }}
        />
      </div>

      {/* Section header */}
      <div className="max-w-6xl mx-auto px-6 md:px-8 pt-24 md:pt-32 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span
            className="text-sm block mb-6"
            style={{
              fontFamily: "var(--font-display)",
              color: "#6B8CAE",
              opacity: 0.5,
            }}
          >
            {"// useful-tools"}
          </span>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl tracking-tight mb-3"
            style={{ fontFamily: "var(--font-display)", color: "#F0F4F8" }}
          >
            Tools<span style={{ color: "#34D399" }}>()</span>
          </h2>
          <p
            className="text-base md:text-lg font-light max-w-md"
            style={{
              fontFamily: "var(--font-body)",
              color: "rgba(240, 244, 248, 0.5)",
            }}
          >
            Free utilities I built because every other option wanted my credit
            card.
          </p>
        </motion.div>
      </div>

      {/* Tool cards */}
      <div className="max-w-6xl mx-auto px-6 md:px-8 pb-24 md:pb-32">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool, i) => (
            <motion.div
              key={tool.slug}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.5,
                delay: 0.1 + i * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Link href={`/tools/${tool.slug}`}>
                <div
                  className="group relative rounded-lg p-6 transition-all duration-300 cursor-pointer"
                  style={{
                    backgroundColor: "rgba(107, 140, 174, 0.04)",
                    border: "1px solid rgba(107, 140, 174, 0.1)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = `${tool.accent}33`;
                    e.currentTarget.style.backgroundColor =
                      "rgba(107, 140, 174, 0.07)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor =
                      "rgba(107, 140, 174, 0.1)";
                    e.currentTarget.style.backgroundColor =
                      "rgba(107, 140, 174, 0.04)";
                  }}
                >
                  {/* Terminal-style header */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex gap-1.5">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: "rgba(248, 113, 113, 0.6)" }}
                      />
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: "rgba(251, 191, 36, 0.6)" }}
                      />
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: "rgba(52, 211, 153, 0.6)" }}
                      />
                    </div>
                    <span
                      className="text-xs ml-2"
                      style={{
                        fontFamily: "var(--font-display)",
                        color: "rgba(107, 140, 174, 0.3)",
                      }}
                    >
                      {tool.tagline}
                    </span>
                  </div>

                  <h3
                    className="text-lg mb-2 tracking-tight"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "#F0F4F8",
                    }}
                  >
                    {tool.name}
                  </h3>
                  <p
                    className="text-sm font-light leading-relaxed mb-5"
                    style={{
                      fontFamily: "var(--font-body)",
                      color: "rgba(240, 244, 248, 0.45)",
                    }}
                  >
                    {tool.description}
                  </p>

                  <div
                    className="text-xs flex items-center gap-1.5 transition-colors duration-200"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "#6B8CAE",
                    }}
                  >
                    <span style={{ opacity: 0.5 }}>{">"}</span>
                    open tool
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

        {/* View all link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-8 text-center"
        >
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 text-sm transition-colors duration-200"
            style={{
              fontFamily: "var(--font-display)",
              color: "#6B8CAE",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#34D399")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#6B8CAE")}
          >
            view all tools
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
