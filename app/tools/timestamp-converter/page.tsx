"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

/* ───────────────────────── Helpers ───────────────────────── */

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function pad(n: number, d = 2): string {
  return String(n).padStart(d, "0");
}

function toISO(d: Date): string {
  return d.toISOString();
}

function toUTC(d: Date): string {
  return d.toUTCString();
}

function toLocal(d: Date): string {
  return d.toLocaleString();
}

function relativeTime(ts: number): string {
  const now = Date.now();
  const diff = now - ts;
  const abs = Math.abs(diff);
  const future = diff < 0;
  const suffix = future ? "from now" : "ago";

  if (abs < 1000) return "just now";
  if (abs < 60_000) {
    const s = Math.floor(abs / 1000);
    return `${s} second${s !== 1 ? "s" : ""} ${suffix}`;
  }
  if (abs < 3_600_000) {
    const m = Math.floor(abs / 60_000);
    return `${m} minute${m !== 1 ? "s" : ""} ${suffix}`;
  }
  if (abs < 86_400_000) {
    const h = Math.floor(abs / 3_600_000);
    return `${h} hour${h !== 1 ? "s" : ""} ${suffix}`;
  }
  if (abs < 2_592_000_000) {
    const d = Math.floor(abs / 86_400_000);
    return `${d} day${d !== 1 ? "s" : ""} ${suffix}`;
  }
  if (abs < 31_536_000_000) {
    const mo = Math.floor(abs / 2_592_000_000);
    return `${mo} month${mo !== 1 ? "s" : ""} ${suffix}`;
  }
  const y = Math.floor(abs / 31_536_000_000);
  return `${y} year${y !== 1 ? "s" : ""} ${suffix}`;
}

function formatDiff(ms: number): string {
  const abs = Math.abs(ms);
  const days = Math.floor(abs / 86_400_000);
  const hours = Math.floor((abs % 86_400_000) / 3_600_000);
  const mins = Math.floor((abs % 3_600_000) / 60_000);
  const secs = Math.floor((abs % 60_000) / 1000);
  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (mins > 0) parts.push(`${mins}m`);
  parts.push(`${secs}s`);
  return parts.join(" ");
}

function dateToInputs(d: Date): { date: string; time: string } {
  const y = d.getFullYear();
  const mo = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const h = pad(d.getHours());
  const mi = pad(d.getMinutes());
  const s = pad(d.getSeconds());
  return { date: `${y}-${mo}-${day}`, time: `${h}:${mi}:${s}` };
}

/* ───────────────────────── Copy Button ───────────────────────── */

function CopyBtn({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(() => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [value]);

  return (
    <button
      onClick={copy}
      className="shrink-0 h-7 px-2 rounded text-[11px] transition-all duration-200 cursor-pointer"
      style={{
        fontFamily: "var(--font-display)",
        backgroundColor: copied ? "rgba(52, 211, 153, 0.15)" : "rgba(107, 140, 174, 0.08)",
        color: copied ? "#34D399" : "#64748B",
        border: `1px solid ${copied ? "rgba(52, 211, 153, 0.3)" : "rgba(107, 140, 174, 0.12)"}`,
      }}
    >
      {copied ? "copied" : "copy"}
    </button>
  );
}

/* ───────────────────────── Value Row ───────────────────────── */

function ValueRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <span
        className="text-xs shrink-0"
        style={{ fontFamily: "var(--font-display)", color: "#64748B" }}
      >
        {label}
      </span>
      <div className="flex items-center gap-2 min-w-0">
        <span
          className="text-sm truncate"
          style={{ fontFamily: "var(--font-display)", color: "#F0F4F8" }}
          title={value}
        >
          {value}
        </span>
        <CopyBtn value={value} />
      </div>
    </div>
  );
}

/* ───────────────────────── Section Card ───────────────────────── */

function Section({
  title,
  delay = 0,
  children,
}: {
  title: string;
  delay?: number;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-xl p-5 md:p-6 mb-6"
      style={{
        backgroundColor: "rgba(107, 140, 174, 0.04)",
        border: "1px solid rgba(107, 140, 174, 0.1)",
      }}
    >
      <h2
        className="text-sm mb-4"
        style={{ fontFamily: "var(--font-display)", color: "#6B8CAE" }}
      >
        {title}
      </h2>
      {children}
    </motion.div>
  );
}

/* ───────────────────────── Input Field ───────────────────────── */

function Field({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      spellCheck={false}
      className="w-full h-11 rounded-lg px-4 text-sm outline-none transition-all duration-200 placeholder:opacity-30"
      style={{
        fontFamily: "var(--font-display)",
        fontSize: "13px",
        backgroundColor: "rgba(107, 140, 174, 0.04)",
        border: "1px solid rgba(107, 140, 174, 0.12)",
        color: "#F0F4F8",
      }}
      onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(52, 211, 153, 0.3)")}
      onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(107, 140, 174, 0.12)")}
    />
  );
}

/* ───────────────────────── Small Button ───────────────────────── */

function SmallBtn({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="h-11 px-5 rounded-lg text-xs transition-all duration-200 cursor-pointer"
      style={{
        fontFamily: "var(--font-display)",
        backgroundColor: "rgba(52, 211, 153, 0.1)",
        color: "#34D399",
        border: "1px solid rgba(52, 211, 153, 0.2)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "rgba(52, 211, 153, 0.2)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "rgba(52, 211, 153, 0.1)";
      }}
    >
      {label}
    </button>
  );
}

/* ───────────────────────── Page Component ───────────────────────── */

export default function TimestampConverterPage() {
  /* ── Live Clock ── */
  const [now, setNow] = useState<Date>(new Date());
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setNow(new Date());
      setPulse(true);
      setTimeout(() => setPulse(false), 300);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  /* ── Unix → Human ── */
  const [unixInput, setUnixInput] = useState("");
  const unixParsed = (() => {
    const raw = unixInput.trim();
    if (!raw || isNaN(Number(raw))) return null;
    const num = Number(raw);
    const ms = raw.length > 12 ? num : num * 1000;
    const d = new Date(ms);
    if (isNaN(d.getTime())) return null;
    return { date: d, ms, sec: Math.floor(ms / 1000) };
  })();

  /* ── Human → Unix ── */
  const [humanDate, setHumanDate] = useState("");
  const [humanTime, setHumanTime] = useState("");
  const humanParsed = (() => {
    if (!humanDate) return null;
    const str = humanTime ? `${humanDate}T${humanTime}` : `${humanDate}T00:00:00`;
    const d = new Date(str);
    if (isNaN(d.getTime())) return null;
    return d;
  })();

  /* ── Date Math ── */
  const [mathDate1, setMathDate1] = useState("");
  const [mathTime1, setMathTime1] = useState("");
  const [mathDate2, setMathDate2] = useState("");
  const [mathTime2, setMathTime2] = useState("");
  const mathDiff = (() => {
    if (!mathDate1 || !mathDate2) return null;
    const s1 = mathTime1 ? `${mathDate1}T${mathTime1}` : `${mathDate1}T00:00:00`;
    const s2 = mathTime2 ? `${mathDate2}T${mathTime2}` : `${mathDate2}T00:00:00`;
    const d1 = new Date(s1);
    const d2 = new Date(s2);
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return null;
    const diffMs = d2.getTime() - d1.getTime();
    return { diffMs, d1, d2 };
  })();

  /* ── Fill Now helpers ── */
  const fillUnixNow = useCallback(() => {
    setUnixInput(String(Math.floor(Date.now() / 1000)));
  }, []);

  const fillHumanNow = useCallback(() => {
    const n = new Date();
    const { date, time } = dateToInputs(n);
    setHumanDate(date);
    setHumanTime(time);
  }, []);

  const fillMathNow1 = useCallback(() => {
    const n = new Date();
    const { date, time } = dateToInputs(n);
    setMathDate1(date);
    setMathTime1(time);
  }, []);

  const fillMathNow2 = useCallback(() => {
    const n = new Date();
    const { date, time } = dateToInputs(n);
    setMathDate2(date);
    setMathTime2(time);
  }, []);

  /* ── Render ── */
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0D1117", color: "#F0F4F8" }}>
      {/* Nav bar */}
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
            style={{ fontFamily: "var(--font-display)", color: "#6B8CAE" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#34D399")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#6B8CAE")}
          >
            <span style={{ opacity: 0.5 }}>{">"}</span> cd ~
          </Link>
          <span
            className="text-xs mx-3"
            style={{ fontFamily: "var(--font-display)", color: "rgba(107, 140, 174, 0.3)" }}
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
            className="text-xs mx-3"
            style={{ fontFamily: "var(--font-display)", color: "rgba(107, 140, 174, 0.3)" }}
          >
            /
          </span>
          <span
            className="text-sm"
            style={{ fontFamily: "var(--font-display)", color: "#F0F4F8" }}
          >
            timestamp-converter
          </span>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10"
        >
          <span
            className="text-sm block mb-4"
            style={{ fontFamily: "var(--font-display)", color: "#6B8CAE", opacity: 0.5 }}
          >
            {"// timestamp-converter"}
          </span>
          <h1
            className="text-2xl md:text-3xl lg:text-4xl tracking-tight mb-2"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Date<span style={{ color: "#34D399" }}>.</span>now
            <span style={{ color: "#34D399" }}>()</span>
          </h1>
          <p
            className="text-sm md:text-base font-light"
            style={{ fontFamily: "var(--font-body)", color: "rgba(240, 244, 248, 0.5)" }}
          >
            Convert between unix timestamps and human-readable dates. Runs locally
            in your browser.
          </p>
        </motion.div>

        {/* ────────── Live Clock ────────── */}
        <Section title="// live clock" delay={0.05}>
          <motion.div
            animate={{ opacity: pulse ? 0.7 : 1 }}
            transition={{ duration: 0.15 }}
          >
            <div className="space-y-0 divide-y divide-[rgba(107,140,174,0.08)]">
              <ValueRow label="Unix (s)" value={String(Math.floor(now.getTime() / 1000))} />
              <ValueRow label="Unix (ms)" value={String(now.getTime())} />
              <ValueRow label="ISO 8601" value={toISO(now)} />
              <ValueRow label="UTC" value={toUTC(now)} />
              <ValueRow label="Local" value={toLocal(now)} />
            </div>
          </motion.div>
        </Section>

        {/* ────────── Unix → Human ────────── */}
        <Section title="// unix → human" delay={0.1}>
          <div className="flex gap-3 mb-4">
            <div className="flex-1">
              <Field
                value={unixInput}
                onChange={setUnixInput}
                placeholder="1700000000 or 1700000000000"
              />
            </div>
            <SmallBtn label="Now" onClick={fillUnixNow} />
          </div>

          {unixParsed ? (
            <div className="space-y-0 divide-y divide-[rgba(107,140,174,0.08)]">
              <ValueRow label="Detected" value={unixInput.trim().length > 12 ? "milliseconds" : "seconds"} />
              <ValueRow label="Local" value={toLocal(unixParsed.date)} />
              <ValueRow label="UTC" value={toUTC(unixParsed.date)} />
              <ValueRow label="ISO 8601" value={toISO(unixParsed.date)} />
              <ValueRow label="Relative" value={relativeTime(unixParsed.ms)} />
              <ValueRow label="Day" value={DAYS[unixParsed.date.getDay()]} />
              <ValueRow label="Unix (s)" value={String(unixParsed.sec)} />
              <ValueRow label="Unix (ms)" value={String(unixParsed.ms)} />
            </div>
          ) : (
            <p
              className="text-xs py-2"
              style={{ fontFamily: "var(--font-display)", color: "rgba(100, 116, 139, 0.5)" }}
            >
              {unixInput.trim()
                ? "Invalid timestamp. Enter a numeric unix timestamp."
                : "Enter a unix timestamp to convert."}
            </p>
          )}
        </Section>

        {/* ────────── Human → Unix ────────── */}
        <Section title="// human → unix" delay={0.15}>
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="flex-1">
              <Field type="date" value={humanDate} onChange={setHumanDate} placeholder="YYYY-MM-DD" />
            </div>
            <div className="flex-1">
              <Field type="time" value={humanTime} onChange={setHumanTime} placeholder="HH:MM:SS" />
            </div>
            <SmallBtn label="Now" onClick={fillHumanNow} />
          </div>

          {humanParsed ? (
            <div className="space-y-0 divide-y divide-[rgba(107,140,174,0.08)]">
              <ValueRow label="Unix (s)" value={String(Math.floor(humanParsed.getTime() / 1000))} />
              <ValueRow label="Unix (ms)" value={String(humanParsed.getTime())} />
              <ValueRow label="ISO 8601" value={toISO(humanParsed)} />
              <ValueRow label="UTC" value={toUTC(humanParsed)} />
              <ValueRow label="Local" value={toLocal(humanParsed)} />
              <ValueRow label="Day" value={DAYS[humanParsed.getDay()]} />
              <ValueRow label="Relative" value={relativeTime(humanParsed.getTime())} />
            </div>
          ) : (
            <p
              className="text-xs py-2"
              style={{ fontFamily: "var(--font-display)", color: "rgba(100, 116, 139, 0.5)" }}
            >
              Pick a date to see its unix timestamp.
            </p>
          )}
        </Section>

        {/* ────────── Date Math ────────── */}
        <Section title="// time between" delay={0.2}>
          <div className="space-y-3 mb-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <span
                className="text-xs shrink-0 self-center"
                style={{ fontFamily: "var(--font-display)", color: "#64748B", width: 40 }}
              >
                from
              </span>
              <div className="flex-1">
                <Field type="date" value={mathDate1} onChange={setMathDate1} />
              </div>
              <div className="flex-1">
                <Field type="time" value={mathTime1} onChange={setMathTime1} />
              </div>
              <SmallBtn label="Now" onClick={fillMathNow1} />
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <span
                className="text-xs shrink-0 self-center"
                style={{ fontFamily: "var(--font-display)", color: "#64748B", width: 40 }}
              >
                to
              </span>
              <div className="flex-1">
                <Field type="date" value={mathDate2} onChange={setMathDate2} />
              </div>
              <div className="flex-1">
                <Field type="time" value={mathTime2} onChange={setMathTime2} />
              </div>
              <SmallBtn label="Now" onClick={fillMathNow2} />
            </div>
          </div>

          {mathDiff ? (
            <div className="space-y-0 divide-y divide-[rgba(107,140,174,0.08)]">
              <ValueRow label="Difference" value={formatDiff(mathDiff.diffMs)} />
              <ValueRow
                label="Total days"
                value={String(Math.abs(Math.round((mathDiff.diffMs / 86_400_000) * 100) / 100))}
              />
              <ValueRow
                label="Total hours"
                value={String(Math.abs(Math.round((mathDiff.diffMs / 3_600_000) * 100) / 100))}
              />
              <ValueRow
                label="Total minutes"
                value={String(Math.abs(Math.round((mathDiff.diffMs / 60_000) * 100) / 100))}
              />
              <ValueRow
                label="Total seconds"
                value={String(Math.abs(Math.round(mathDiff.diffMs / 1000)))}
              />
              <ValueRow
                label="Total ms"
                value={String(Math.abs(mathDiff.diffMs))}
              />
              <ValueRow
                label="Direction"
                value={mathDiff.diffMs >= 0 ? "forward (A → B)" : "backward (B → A)"}
              />
            </div>
          ) : (
            <p
              className="text-xs py-2"
              style={{ fontFamily: "var(--font-display)", color: "rgba(100, 116, 139, 0.5)" }}
            >
              Pick two dates to calculate the difference.
            </p>
          )}
        </Section>
      </div>

      {/* Footer */}
      <div
        className="max-w-5xl mx-auto px-4 sm:px-6 pb-8"
        style={{ borderTop: "1px solid rgba(107, 140, 174, 0.08)" }}
      >
        <div className="pt-6 flex items-center justify-between">
          <p
            className="text-xs"
            style={{ fontFamily: "var(--font-display)", color: "rgba(107, 140, 174, 0.25)" }}
          >
            100% free. runs locally in your browser.
          </p>
          <Link
            href="/tools"
            className="text-xs transition-colors duration-200"
            style={{ fontFamily: "var(--font-display)", color: "#6B8CAE" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#34D399")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#6B8CAE")}
          >
            more tools
          </Link>
        </div>
      </div>
    </div>
  );
}
