"use client";

import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

/* ───────────────────────── Color Math ───────────────────────── */

interface RGBA { r: number; g: number; b: number; a: number }
interface HSLA { h: number; s: number; l: number; a: number }

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, Math.round(l * 100)];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h = ((h % 360) + 360) % 360;
  s = clamp(s, 0, 100) / 100;
  l = clamp(l, 0, 100) / 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) { r = c; g = x; }
  else if (h < 120) { r = x; g = c; }
  else if (h < 180) { g = c; b = x; }
  else if (h < 240) { g = x; b = c; }
  else if (h < 300) { r = x; b = c; }
  else { r = c; b = x; }
  return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
}

const hex2 = (n: number) => clamp(Math.round(n), 0, 255).toString(16).padStart(2, "0");
const toHex = (c: RGBA) => `#${hex2(c.r)}${hex2(c.g)}${hex2(c.b)}`;
const toHexA = (c: RGBA) => `#${hex2(c.r)}${hex2(c.g)}${hex2(c.b)}${hex2(Math.round(c.a * 255))}`;
const toHsla = (c: RGBA): HSLA => { const [h, s, l] = rgbToHsl(c.r, c.g, c.b); return { h, s, l, a: c.a }; };

/* ───────────────────────── Parsing ───────────────────────── */

function parseColor(input: string): RGBA | null {
  const s = input.trim().toLowerCase();

  // HEX
  const hm = s.match(/^#?([0-9a-f]{3,8})$/);
  if (hm) {
    const h = hm[1];
    if (h.length === 3) return { r: parseInt(h[0]+h[0],16), g: parseInt(h[1]+h[1],16), b: parseInt(h[2]+h[2],16), a: 1 };
    if (h.length === 4) return { r: parseInt(h[0]+h[0],16), g: parseInt(h[1]+h[1],16), b: parseInt(h[2]+h[2],16), a: parseInt(h[3]+h[3],16)/255 };
    if (h.length === 6) return { r: parseInt(h.slice(0,2),16), g: parseInt(h.slice(2,4),16), b: parseInt(h.slice(4,6),16), a: 1 };
    if (h.length === 8) return { r: parseInt(h.slice(0,2),16), g: parseInt(h.slice(2,4),16), b: parseInt(h.slice(4,6),16), a: parseInt(h.slice(6,8),16)/255 };
  }

  // rgb(r,g,b) / rgba(r,g,b,a)
  const rm = s.match(/^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*([\d.]+))?\s*\)$/);
  if (rm) return { r: clamp(+rm[1],0,255), g: clamp(+rm[2],0,255), b: clamp(+rm[3],0,255), a: rm[4] !== undefined ? clamp(+rm[4],0,1) : 1 };

  // hsl(h,s%,l%) / hsla(h,s%,l%,a)
  const hm2 = s.match(/^hsla?\(\s*(\d{1,3})\s*,\s*(\d{1,3})%?\s*,\s*(\d{1,3})%?\s*(?:,\s*([\d.]+))?\s*\)$/);
  if (hm2) {
    const [r, g, b] = hslToRgb(+hm2[1], +hm2[2], +hm2[3]);
    return { r, g, b, a: hm2[4] !== undefined ? clamp(+hm2[4],0,1) : 1 };
  }

  return null;
}

/* ───────────────────────── Contrast / WCAG ───────────────────────── */

function relativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => { const s = c / 255; return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4); });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function contrastRatio(c1: RGBA, c2: RGBA): number {
  const l1 = relativeLuminance(c1.r, c1.g, c1.b);
  const l2 = relativeLuminance(c2.r, c2.g, c2.b);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

/* ───────────────────────── Palette ───────────────────────── */

function rotateHue(c: RGBA, deg: number): RGBA {
  const [h, s, l] = rgbToHsl(c.r, c.g, c.b);
  const [r, g, b] = hslToRgb((h + deg + 360) % 360, s, l);
  return { r, g, b, a: c.a };
}

const palettes = (c: RGBA) => ({
  complementary: [rotateHue(c, 180)],
  analogous: [rotateHue(c, -30), rotateHue(c, 30)],
  triadic: [rotateHue(c, 120), rotateHue(c, 240)],
});

/* ───────────────────────── Random ───────────────────────── */

const randomColor = (): RGBA => ({
  r: Math.floor(Math.random() * 256),
  g: Math.floor(Math.random() * 256),
  b: Math.floor(Math.random() * 256),
  a: 1,
});

/* ───────────────────────── Copy Button ───────────────────────── */

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); };
  return (
    <button
      onClick={copy}
      className="px-2 py-1 rounded text-xs transition-all duration-200 shrink-0"
      style={{
        fontFamily: "var(--font-display)",
        backgroundColor: copied ? "rgba(52, 211, 153, 0.15)" : "rgba(107, 140, 174, 0.08)",
        color: copied ? "#34D399" : "#6B8CAE",
        border: `1px solid ${copied ? "rgba(52, 211, 153, 0.3)" : "rgba(107, 140, 174, 0.12)"}`,
      }}
    >
      {copied ? "copied!" : "copy"}
    </button>
  );
}

/* ───────────────────────── Output Card ───────────────────────── */

function OutputCard({ label, value, delay }: { label: string; value: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-lg p-4 flex flex-col gap-2"
      style={{ backgroundColor: "rgba(107, 140, 174, 0.04)", border: "1px solid rgba(107, 140, 174, 0.1)" }}
    >
      <span className="text-xs uppercase tracking-wider" style={{ fontFamily: "var(--font-display)", color: "#6B8CAE", opacity: 0.6 }}>
        {label}
      </span>
      <div className="flex items-center justify-between gap-3">
        <code className="text-sm break-all" style={{ fontFamily: "var(--font-display)", color: "#F0F4F8" }}>
          {value}
        </code>
        <CopyButton text={value} />
      </div>
    </motion.div>
  );
}

/* ───────────────────────── Palette Row ───────────────────────── */

function PaletteRow({ label, base, colors, onSelect }: { label: string; base: RGBA; colors: RGBA[]; onSelect: (c: RGBA) => void }) {
  return (
    <div
      className="rounded-lg p-4 flex flex-col gap-3"
      style={{ backgroundColor: "rgba(107, 140, 174, 0.04)", border: "1px solid rgba(107, 140, 174, 0.1)" }}
    >
      <span className="text-xs" style={{ fontFamily: "var(--font-display)", color: "#6B8CAE", opacity: 0.6 }}>
        {label}
      </span>
      <div className="flex gap-2 items-center">
        <div
          className="w-10 h-10 rounded-lg shrink-0 ring-1 ring-white/10"
          style={{ backgroundColor: toHex(base), opacity: 0.5 }}
          title={`base: ${toHex(base)}`}
        />
        <div className="w-px h-6 shrink-0" style={{ backgroundColor: "rgba(107, 140, 174, 0.15)" }} />
        {colors.map((c, i) => {
          const h = toHex(c);
          return (
            <button
              key={i}
              onClick={() => onSelect(c)}
              className="group relative w-10 h-10 rounded-lg cursor-pointer transition-transform duration-150 hover:scale-110 shrink-0"
              style={{ backgroundColor: h, border: "1px solid rgba(107, 140, 174, 0.2)" }}
              title={h}
            >
              <span
                className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none"
                style={{ fontFamily: "var(--font-display)", color: "#6B8CAE" }}
              >
                {h}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ───────────────────────── Contrast Badge ───────────────────────── */

function Badge({ pass, level }: { pass: boolean; level: string }) {
  return (
    <span
      className="px-2 py-0.5 rounded text-xs"
      style={{
        fontFamily: "var(--font-display)",
        backgroundColor: pass ? "rgba(52, 211, 153, 0.15)" : "rgba(248, 113, 113, 0.15)",
        color: pass ? "#34D399" : "#f87171",
        border: `1px solid ${pass ? "rgba(52, 211, 153, 0.3)" : "rgba(248, 113, 113, 0.3)"}`,
      }}
    >
      {level} {pass ? "pass" : "fail"}
    </span>
  );
}

/* ───────────────────────── Main Component ───────────────────────── */

const DEFAULT_COLOR = "#34D399";
const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

export default function ColorConverterPage() {
  const [input, setInput] = useState(DEFAULT_COLOR);
  const [color, setColor] = useState<RGBA>(() => parseColor(DEFAULT_COLOR)!);
  const [pickerValue, setPickerValue] = useState(DEFAULT_COLOR);

  const updateColor = useCallback((val: string) => {
    const parsed = parseColor(val);
    if (parsed) { setColor(parsed); setPickerValue(toHex(parsed)); }
  }, []);

  const handleInput = (val: string) => { setInput(val); updateColor(val); };
  const handlePicker = (val: string) => { setPickerValue(val); setInput(val); updateColor(val); };
  const handleRandom = () => { const hex = toHex(randomColor()); setInput(hex); updateColor(hex); };
  const loadColor = (c: RGBA) => { const hex = toHex(c); setInput(hex); updateColor(hex); };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); handleRandom(); } };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Derived values
  const hex = toHex(color);
  const rgbStr = `rgb(${color.r}, ${color.g}, ${color.b})`;
  const rgbaStr = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
  const hsla = toHsla(color);
  const hslStr = `hsl(${hsla.h}, ${hsla.s}%, ${hsla.l}%)`;
  const hslaStr = `hsla(${hsla.h}, ${hsla.s}%, ${hsla.l}%, ${hsla.a})`;

  const white: RGBA = { r: 255, g: 255, b: 255, a: 1 };
  const black: RGBA = { r: 0, g: 0, b: 0, a: 1 };
  const whiteContrast = contrastRatio(color, white);
  const blackContrast = contrastRatio(color, black);

  const pal = palettes(color);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0D1117", color: "#F0F4F8" }}>
      {/* ── Nav ── */}
      <nav
        className="sticky top-0 z-50 backdrop-blur-md"
        style={{ backgroundColor: "rgba(13, 17, 23, 0.85)", borderBottom: "1px solid rgba(107, 140, 174, 0.1)" }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center">
          <Link
            href="/"
            className="text-sm transition-colors duration-200"
            style={{ fontFamily: "var(--font-display)", color: "#6B8CAE" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#34D399")}
            onMouseLeave={e => (e.currentTarget.style.color = "#6B8CAE")}
          >
            <span style={{ opacity: 0.5 }}>{">"}</span> cd ~
          </Link>
          <span className="text-xs mx-3" style={{ fontFamily: "var(--font-display)", color: "rgba(107, 140, 174, 0.3)" }}>/</span>
          <Link
            href="/tools"
            className="text-sm transition-colors duration-200"
            style={{ fontFamily: "var(--font-display)", color: "#6B8CAE" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#34D399")}
            onMouseLeave={e => (e.currentTarget.style.color = "#6B8CAE")}
          >
            tools
          </Link>
          <span className="text-xs mx-3" style={{ fontFamily: "var(--font-display)", color: "rgba(107, 140, 174, 0.3)" }}>/</span>
          <span className="text-sm" style={{ fontFamily: "var(--font-display)", color: "#F0F4F8" }}>
            color-converter
          </span>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        {/* ── Header ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }} className="mb-10">
          <span className="text-sm block mb-4" style={{ fontFamily: "var(--font-display)", color: "#6B8CAE", opacity: 0.5 }}>
            {"// color-converter"}
          </span>
          <h1 className="text-2xl md:text-3xl lg:text-4xl tracking-tight mb-2" style={{ fontFamily: "var(--font-display)" }}>
            color<span style={{ color: "#34D399" }}>(</span>any<span style={{ color: "#34D399" }}>)</span>
          </h1>
          <p className="text-sm md:text-base font-light" style={{ fontFamily: "var(--font-body)", color: "rgba(240, 244, 248, 0.5)" }}>
            Paste any color format. Get every conversion instantly. No sign-ups, no limits.
          </p>
        </motion.div>

        {/* ── Color Preview Swatch ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05, ease }} className="mb-6">
          <motion.div
            className="w-full h-32 md:h-40 rounded-xl relative overflow-hidden"
            style={{ backgroundColor: rgbaStr, border: "1px solid rgba(107, 140, 174, 0.15)" }}
            animate={{ backgroundColor: rgbaStr }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute bottom-3 right-4">
              <span
                className="px-2 py-1 rounded text-xs backdrop-blur-sm"
                style={{ fontFamily: "var(--font-display)", backgroundColor: "rgba(0,0,0,0.4)", color: "#fff" }}
              >
                {hex}
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* ── Input Row ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1, ease }} className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <input
              type="text"
              value={input}
              onChange={e => handleInput(e.target.value)}
              placeholder="#34D399, rgb(52,211,153), hsl(162,95%,52%)..."
              spellCheck={false}
              className="w-full h-12 rounded-lg px-4 text-sm outline-none transition-all duration-200 placeholder:opacity-30"
              style={{ fontFamily: "var(--font-display)", fontSize: "14px", backgroundColor: "rgba(107, 140, 174, 0.04)", border: "1px solid rgba(107, 140, 174, 0.12)", color: "#F0F4F8" }}
              onFocus={e => (e.currentTarget.style.borderColor = "rgba(52, 211, 153, 0.3)")}
              onBlur={e => (e.currentTarget.style.borderColor = "rgba(107, 140, 174, 0.12)")}
            />
            {!parseColor(input) && input !== "" && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs" style={{ fontFamily: "var(--font-display)", color: "#f87171" }}>
                invalid
              </span>
            )}
          </div>

          {/* Native color picker */}
          <div className="relative h-12 w-12 rounded-lg overflow-hidden shrink-0 cursor-pointer" style={{ border: "1px solid rgba(107, 140, 174, 0.12)" }}>
            <input type="color" value={pickerValue} onChange={e => handlePicker(e.target.value)} className="absolute inset-0 w-full h-full cursor-pointer opacity-0" />
            <div className="w-full h-full" style={{ backgroundColor: pickerValue }} />
          </div>

          {/* Random button */}
          <button
            onClick={handleRandom}
            className="h-12 px-4 rounded-lg text-sm transition-all duration-200 shrink-0"
            style={{ fontFamily: "var(--font-display)", backgroundColor: "rgba(107, 140, 174, 0.08)", border: "1px solid rgba(107, 140, 174, 0.12)", color: "#6B8CAE" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(52, 211, 153, 0.3)"; e.currentTarget.style.color = "#34D399"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(107, 140, 174, 0.12)"; e.currentTarget.style.color = "#6B8CAE"; }}
          >
            random()
          </button>
        </motion.div>

        {/* ── Conversion Outputs ── */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.15 }} className="mb-10">
          <span className="text-xs block mb-4 uppercase tracking-wider" style={{ fontFamily: "var(--font-display)", color: "#6B8CAE", opacity: 0.4 }}>
            conversions
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <OutputCard label="HEX" value={hex} delay={0.18} />
            <OutputCard label="RGB" value={rgbStr} delay={0.21} />
            <OutputCard label="HSL" value={hslStr} delay={0.24} />
            <OutputCard label="RGBA" value={rgbaStr} delay={0.27} />
            <OutputCard label="HSLA" value={hslaStr} delay={0.30} />
          </div>
        </motion.div>

        {/* ── Contrast Checker ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25, ease }} className="mb-10">
          <span className="text-xs block mb-4 uppercase tracking-wider" style={{ fontFamily: "var(--font-display)", color: "#6B8CAE", opacity: 0.4 }}>
            contrast checker (WCAG)
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* White on color */}
            <div className="rounded-lg p-5 flex flex-col gap-3" style={{ backgroundColor: "rgba(107, 140, 174, 0.04)", border: "1px solid rgba(107, 140, 174, 0.1)" }}>
              <div className="rounded-lg p-4 text-center" style={{ backgroundColor: rgbStr }}>
                <span className="text-lg font-medium" style={{ fontFamily: "var(--font-display)", color: "#FFFFFF" }}>
                  White Text
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ fontFamily: "var(--font-display)", color: "#F0F4F8" }}>
                  {whiteContrast.toFixed(2)}:1
                </span>
                <div className="flex gap-2">
                  <Badge pass={whiteContrast >= 4.5} level="AA" />
                  <Badge pass={whiteContrast >= 7} level="AAA" />
                </div>
              </div>
            </div>

            {/* Black on color */}
            <div className="rounded-lg p-5 flex flex-col gap-3" style={{ backgroundColor: "rgba(107, 140, 174, 0.04)", border: "1px solid rgba(107, 140, 174, 0.1)" }}>
              <div className="rounded-lg p-4 text-center" style={{ backgroundColor: rgbStr }}>
                <span className="text-lg font-medium" style={{ fontFamily: "var(--font-display)", color: "#000000" }}>
                  Black Text
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ fontFamily: "var(--font-display)", color: "#F0F4F8" }}>
                  {blackContrast.toFixed(2)}:1
                </span>
                <div className="flex gap-2">
                  <Badge pass={blackContrast >= 4.5} level="AA" />
                  <Badge pass={blackContrast >= 7} level="AAA" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Palette Generator ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3, ease }} className="mb-10">
          <span className="text-xs block mb-4 uppercase tracking-wider" style={{ fontFamily: "var(--font-display)", color: "#6B8CAE", opacity: 0.4 }}>
            palette generator
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <PaletteRow label="complementary" base={color} colors={pal.complementary} onSelect={loadColor} />
            <PaletteRow label="analogous" base={color} colors={pal.analogous} onSelect={loadColor} />
            <PaletteRow label="triadic" base={color} colors={pal.triadic} onSelect={loadColor} />
          </div>
        </motion.div>
      </div>

      {/* ── Footer ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-8" style={{ borderTop: "1px solid rgba(107, 140, 174, 0.08)" }}>
        <div className="pt-6 flex items-center justify-between">
          <p className="text-xs" style={{ fontFamily: "var(--font-display)", color: "rgba(107, 140, 174, 0.25)" }}>
            100% free. runs locally in your browser.
          </p>
          <Link
            href="/tools"
            className="text-xs transition-colors duration-200"
            style={{ fontFamily: "var(--font-display)", color: "#6B8CAE" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#34D399")}
            onMouseLeave={e => (e.currentTarget.style.color = "#6B8CAE")}
          >
            more tools
          </Link>
        </div>
      </div>
    </div>
  );
}
