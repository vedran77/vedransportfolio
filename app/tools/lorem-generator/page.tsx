"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

/* ───────────────────────── seed data ───────────────────────── */

const FIRST = [
  "Liam","Emma","Noah","Olivia","James","Ava","Oliver","Sophia","Elijah","Isabella",
  "Lucas","Mia","Mason","Charlotte","Ethan","Amelia","Logan","Harper","Aiden","Evelyn",
  "Jackson","Abigail","Sebastian","Luna","Mateo","Ella","Henry","Scarlett","Owen","Grace",
  "Alexander","Chloe","Daniel","Penelope","William","Layla",
];
const LAST = [
  "Smith","Johnson","Williams","Brown","Jones","Garcia","Miller","Davis","Rodriguez",
  "Martinez","Hernandez","Lopez","Gonzalez","Wilson","Anderson","Thomas","Taylor","Moore",
  "Jackson","Martin","Lee","Perez","Thompson","White","Harris","Sanchez","Clark","Ramirez",
  "Lewis","Robinson","Walker","Young","Allen","King",
];
const DOMAINS = ["gmail.com","outlook.com","yahoo.com","protonmail.com","icloud.com",
  "fastmail.com","hey.com","tutanota.com","zoho.com","mail.com"];
const STREETS = ["Oak Ave","Maple St","Cedar Ln","Pine Rd","Elm Blvd","Birch Dr",
  "Willow Way","Aspen Ct","Spruce Cir","Walnut Pl","Cherry Ter","Hickory Path",
  "Magnolia Ln","Cypress Dr","Juniper St","Poplar Ave","Sequoia Rd","Redwood Ct"];
const CITIES = ["Portland","Austin","Denver","Seattle","Nashville","Raleigh","Boulder",
  "Asheville","Savannah","Charleston","Madison","Boise","Burlington","Duluth","Flagstaff",
  "Santa Fe","Missoula","Bend"];
const ST = ["OR","TX","CO","WA","TN","NC","CO","NC","GA","SC","WI","ID","VT","MN","AZ","NM","MT","OR"];
const LOREM = [
  "lorem","ipsum","dolor","sit","amet","consectetur","adipiscing","elit","sed","do",
  "eiusmod","tempor","incididunt","ut","labore","et","dolore","magna","aliqua","enim",
  "ad","minim","veniam","quis","nostrud","exercitation","ullamco","laboris","nisi",
  "aliquip","ex","ea","commodo","consequat","duis","aute","irure","in","reprehenderit",
  "voluptate","velit","esse","cillum","fugiat","nulla","pariatur","excepteur","sint",
  "occaecat","cupidatat","non","proident","sunt","culpa","qui","officia","deserunt",
  "mollit","anim","id","est","laborum","habitant","morbi","tristique","senectus","netus",
  "malesuada","fames","turpis","egestas","maecenas","accumsan","lacus","vel","facilisis",
  "volutpat","pellentesque","diam","venenatis","blandit","massa","erat","vitae","feugiat",
];
const PRODUCTS = ["Nebula Pro Headphones","Quantum Desk Lamp","Arctic Breeze Fan",
  "Lunar Grip Mouse","Pixel Frame Display","Zenith Standing Desk","Prism Keyboard",
  "Horizon Webcam","Flux USB Hub","Aether Charger","Nova Monitor Arm","Drift Chair"];
const TITLES = ["Getting Started with TypeScript in 2026","Why I Switched to Bun",
  "The Case for Server Components","Building a Design System from Scratch",
  "Modern CSS is Amazing, Actually","How We Cut Our Bundle Size by 70%",
  "A Practical Guide to Edge Computing","Rethinking State Management",
  "The Future of Web Auth","Performance Patterns for React Apps",
  "Why Developers Love Rust","Embracing the Monorepo"];

/* ───────────────────────── generators ───────────────────────── */

const pick = <T,>(a: T[]): T => a[Math.floor(Math.random() * a.length)];
const ri = (lo: number, hi: number) => Math.floor(Math.random() * (hi - lo + 1)) + lo;

function sentence() {
  const w: string[] = Array.from({ length: ri(8, 18) }, () => pick(LOREM));
  w[0] = w[0][0].toUpperCase() + w[0].slice(1);
  return w.join(" ") + ".";
}
function paragraph() {
  return Array.from({ length: ri(4, 8) }, sentence).join(" ");
}
function genLorem(n: number, unit: "paragraphs" | "sentences" | "words") {
  if (unit === "paragraphs") return Array.from({ length: n }, paragraph).join("\n\n");
  if (unit === "sentences") return Array.from({ length: n }, sentence).join(" ");
  const w = Array.from({ length: n }, () => pick(LOREM));
  w[0] = w[0][0].toUpperCase() + w[0].slice(1);
  return w.join(" ") + ".";
}

function fakeUser() {
  const f = pick(FIRST), l = pick(LAST), ci = ri(0, CITIES.length - 1);
  return {
    id: ri(1000, 9999), name: `${f} ${l}`,
    email: `${f.toLowerCase()}.${l.toLowerCase()}@${pick(DOMAINS)}`,
    phone: `+1 (${ri(200, 999)}) ${ri(100, 999)}-${ri(1000, 9999)}`,
    address: `${ri(100, 9999)} ${pick(STREETS)}, ${CITIES[ci]}, ${ST[ci]} ${ri(10000, 99999)}`,
  };
}
function fakeProduct() {
  return {
    id: ri(1000, 9999), name: pick(PRODUCTS),
    price: +(Math.random() * 300 + 9.99).toFixed(2),
    rating: +(Math.random() * 2 + 3).toFixed(1),
    inStock: Math.random() > 0.3,
    category: pick(["electronics", "furniture", "accessories", "peripherals"]),
  };
}
function fakePost() {
  return {
    id: ri(1000, 9999), title: pick(TITLES), author: `${pick(FIRST)} ${pick(LAST)}`,
    published: `2026-${String(ri(1, 12)).padStart(2, "0")}-${String(ri(1, 28)).padStart(2, "0")}`,
    likes: ri(10, 2500),
    tags: Array.from(new Set(Array.from({ length: ri(2, 4) }, () =>
      pick(["react","typescript","css","rust","performance","devtools","nextjs","design"])))),
  };
}
function genAPI(n: number, t: "users" | "products" | "posts") {
  const gen: Record<string, () => unknown> = { users: fakeUser, products: fakeProduct, posts: fakePost };
  return JSON.stringify({ success: true, count: n, data: Array.from({ length: n }, () => gen[t]()) }, null, 2);
}

interface UserRow { name: string; email: string; phone: string; address: string }
function genRows(n: number): UserRow[] {
  return Array.from({ length: n }, () => {
    const u = fakeUser();
    return { name: u.name, email: u.email, phone: u.phone, address: u.address };
  });
}

/* ───────────────────────── shared UI helpers ───────────────────────── */

type TabMode = "lorem" | "api" | "users";
type LoremUnit = "paragraphs" | "sentences" | "words";
type APIType = "users" | "products" | "posts";

const D = "var(--font-display)", B = "var(--font-body)";
const blue = "#6B8CAE", green = "#34D399", slate = "#64748B", text = "#F0F4F8";
const dim = (o = 0.12) => `rgba(107,140,174,${o})`;
const glow = (o = 0.15) => `rgba(52,211,153,${o})`;

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-sm transition-colors duration-200"
      style={{ fontFamily: D, color: blue }}
      onMouseEnter={e => (e.currentTarget.style.color = green)}
      onMouseLeave={e => (e.currentTarget.style.color = blue)}>
      {children}
    </Link>
  );
}
function Sep() {
  return <span className="text-xs" style={{ fontFamily: D, color: dim(0.3) }}>/</span>;
}
function GreenBtn({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button onClick={onClick}
      className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
      style={{ fontFamily: D, backgroundColor: glow(0.15), color: green, border: `1px solid ${glow(0.25)}` }}
      onMouseEnter={e => (e.currentTarget.style.backgroundColor = glow(0.25))}
      onMouseLeave={e => (e.currentTarget.style.backgroundColor = glow(0.15))}>
      {label}
    </button>
  );
}
function CopyBtn({ onClick, active }: { onClick: () => void; active: boolean }) {
  return (
    <button onClick={onClick}
      className="px-3 py-2 rounded-lg text-xs transition-colors duration-150"
      style={{ fontFamily: D, backgroundColor: dim(0.08), color: active ? green : blue, border: `1px solid ${dim()}` }}>
      {active ? "copied!" : "copy"}
    </button>
  );
}
function EmptyState() {
  return (
    <div className="rounded-lg p-12 md:p-20 flex items-center justify-center"
      style={{ backgroundColor: dim(0.02), border: `1px dashed ${dim(0.1)}` }}>
      <span className="text-2xl md:text-3xl" style={{ fontFamily: D, color: dim(0.12) }}>lorem(n)</span>
    </div>
  );
}
function PillGroup<T extends string>({ items, value, onChange }: { items: T[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="flex rounded-md overflow-hidden" style={{ border: `1px solid ${dim()}` }}>
      {items.map(v => (
        <button key={v} onClick={() => onChange(v)}
          className="px-3 py-1.5 text-xs transition-colors duration-150"
          style={{ fontFamily: D, backgroundColor: value === v ? glow(0.12) : "transparent", color: value === v ? green : blue }}>
          {v}
        </button>
      ))}
    </div>
  );
}
function CountInput({ value, onChange, max = 50, label = "count" }: { value: number; onChange: (n: number) => void; max?: number; label?: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg px-3 py-2"
      style={{ backgroundColor: dim(0.04), border: `1px solid ${dim()}` }}>
      <label className="text-xs" style={{ fontFamily: D, color: slate }}>{label}</label>
      <input type="number" min={1} max={max} value={value}
        onChange={e => onChange(Math.max(1, Math.min(max, parseInt(e.target.value) || 1)))}
        className="w-16 text-center text-sm rounded px-2 py-1 outline-none"
        style={{ fontFamily: D, backgroundColor: dim(0.08), border: `1px solid ${dim(0.15)}`, color: text }} />
    </div>
  );
}
function OutputBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg p-4 md:p-6 overflow-auto max-h-[60vh]"
      style={{ backgroundColor: dim(0.04), border: `1px solid ${dim(0.1)}` }}>
      {children}
    </div>
  );
}

/* ───────────────────────── main component ───────────────────────── */

export default function LoremGeneratorPage() {
  const [mode, setMode] = useState<TabMode>("lorem");
  const [loremUnit, setLoremUnit] = useState<LoremUnit>("paragraphs");
  const [loremCount, setLoremCount] = useState(3);
  const [loremOut, setLoremOut] = useState("");
  const [apiType, setApiType] = useState<APIType>("users");
  const [apiCount, setApiCount] = useState(3);
  const [apiOut, setApiOut] = useState("");
  const [userCount, setUserCount] = useState(5);
  const [rows, setRows] = useState<UserRow[]>([]);
  const [copied, setCopied] = useState<string | false>(false);

  const copy = useCallback(async (t: string, label = "all") => {
    await navigator.clipboard.writeText(t);
    setCopied(label);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        if (mode === "lorem") setLoremOut(genLorem(loremCount, loremUnit));
        else if (mode === "api") setApiOut(genAPI(apiCount, apiType));
        else setRows(genRows(userCount));
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [mode, loremCount, loremUnit, apiCount, apiType, userCount]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0D1117", color: text }}>
      {/* Nav */}
      <nav className="sticky top-0 z-50 backdrop-blur-md"
        style={{ backgroundColor: "rgba(13,17,23,0.85)", borderBottom: `1px solid ${dim(0.1)}` }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <NavLink href="/"><span style={{ opacity: 0.5 }}>{">"}</span> cd ~</NavLink>
            <Sep /><NavLink href="/tools">tools</NavLink><Sep />
            <span className="text-sm" style={{ fontFamily: D, color: text }}>lorem-generator</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs" style={{ fontFamily: D, color: dim(0.4) }}>
            <kbd className="px-1.5 py-0.5 rounded" style={{ backgroundColor: dim(0.1), border: `1px solid ${dim(0.15)}` }}>
              {typeof navigator !== "undefined" && /Mac/.test(navigator.userAgent || "") ? "Cmd" : "Ctrl"}
            </kbd><span>+</span>
            <kbd className="px-1.5 py-0.5 rounded" style={{ backgroundColor: dim(0.1), border: `1px solid ${dim(0.15)}` }}>Enter</kbd>
            <span className="ml-1">to generate</span>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className="mb-8">
          <span className="text-sm block mb-4" style={{ fontFamily: D, color: blue, opacity: 0.5 }}>
            {"// lorem-generator"}
          </span>
          <h1 className="text-2xl md:text-3xl lg:text-4xl tracking-tight mb-2" style={{ fontFamily: D }}>
            lorem<span style={{ color: green }}>(</span>
            <span style={{ color: slate }}>n</span>
            <span style={{ color: green }}>)</span>
          </h1>
          <p className="text-sm md:text-base font-light" style={{ fontFamily: B, color: "rgba(240,244,248,0.5)" }}>
            Lorem ipsum, fake API responses, placeholder user data. All generated locally.
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }} className="mb-6">
          <div className="inline-flex rounded-md overflow-hidden" style={{ border: `1px solid ${dim()}` }}>
            {([["lorem","Lorem Ipsum"],["api","Fake API"],["users","User Data"]] as [TabMode,string][]).map(([k,l]) => (
              <button key={k} onClick={() => setMode(k)}
                className="px-4 py-2 text-xs sm:text-sm transition-colors duration-150"
                style={{ fontFamily: D, backgroundColor: mode === k ? glow(0.12) : "transparent", color: mode === k ? green : blue }}>
                {l}
              </button>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* ───── Lorem ───── */}
          {mode === "lorem" && (
            <motion.div key="lorem" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <CountInput value={loremCount} onChange={setLoremCount} />
                <PillGroup items={["paragraphs","sentences","words"] as LoremUnit[]} value={loremUnit} onChange={setLoremUnit} />
                <GreenBtn onClick={() => setLoremOut(genLorem(loremCount, loremUnit))} label="generate()" />
                {loremOut && <CopyBtn onClick={() => copy(loremOut)} active={copied === "all"} />}
              </div>
              {loremOut ? (
                <OutputBox>
                  <pre className="whitespace-pre-wrap text-sm leading-relaxed"
                    style={{ fontFamily: B, color: "rgba(240,244,248,0.75)" }}>{loremOut}</pre>
                </OutputBox>
              ) : <EmptyState />}
            </motion.div>
          )}

          {/* ───── Fake API ───── */}
          {mode === "api" && (
            <motion.div key="api" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <PillGroup items={["/users","/products","/posts"]} value={`/${apiType}`}
                  onChange={v => setApiType(v.slice(1) as APIType)} />
                <CountInput value={apiCount} onChange={setApiCount} max={25} label="items" />
                <GreenBtn onClick={() => setApiOut(genAPI(apiCount, apiType))} label="generate()" />
                {apiOut && <CopyBtn onClick={() => copy(apiOut)} active={copied === "all"} />}
              </div>
              {apiOut ? (
                <OutputBox>
                  <pre className="text-sm leading-relaxed" style={{ fontFamily: D, color: "rgba(240,244,248,0.75)" }}>
                    {apiOut.split("\n").map((line, i) => (
                      <span key={i}>
                        {line.split(/("(?:[^"\\]|\\.)*")/).map((seg, j) => {
                          if (seg.startsWith('"') && seg.endsWith('"')) {
                            const isKey = /^\s*:/.test(line.slice(line.indexOf(seg) + seg.length));
                            return <span key={j} style={{ color: isKey ? blue : green }}>{seg}</span>;
                          }
                          return <span key={j}>{seg.split(/(true|false|null|\d+\.?\d*)/).map((p, k) =>
                            /^(true|false|null)$/.test(p) || (/^\d+\.?\d*$/.test(p) && p !== "")
                              ? <span key={k} style={{ color: "#E8B87E" }}>{p}</span>
                              : <span key={k} style={{ color: dim(0.4) }}>{p}</span>
                          )}</span>;
                        })}
                        {"\n"}
                      </span>
                    ))}
                  </pre>
                </OutputBox>
              ) : <EmptyState />}
            </motion.div>
          )}

          {/* ───── User Data ───── */}
          {mode === "users" && (
            <motion.div key="users" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <CountInput value={userCount} onChange={setUserCount} label="rows" />
                <GreenBtn onClick={() => setRows(genRows(userCount))} label="generate()" />
                {rows.length > 0 && (
                  <CopyBtn active={copied === "all"} onClick={() => {
                    const h = "Name\tEmail\tPhone\tAddress";
                    copy([h, ...rows.map(r => `${r.name}\t${r.email}\t${r.phone}\t${r.address}`)].join("\n"));
                  }} />
                )}
              </div>
              {rows.length > 0 ? (
                <div className="rounded-lg overflow-hidden overflow-x-auto" style={{ border: `1px solid ${dim(0.1)}` }}>
                  <table className="w-full border-collapse" style={{ fontFamily: D, fontSize: "13px" }}>
                    <thead>
                      <tr style={{ backgroundColor: dim(0.06), borderBottom: `1px solid ${dim(0.1)}` }}>
                        {["Name","Email","Phone","Address",""].map(h => (
                          <th key={h} className="text-left px-4 py-3 text-xs font-medium" style={{ color: slate }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((r, i) => (
                        <tr key={i} style={{
                          borderBottom: i < rows.length - 1 ? `1px solid ${dim(0.06)}` : "none",
                          backgroundColor: i % 2 ? dim(0.02) : "transparent",
                        }}>
                          <td className="px-4 py-3" style={{ color: text }}>{r.name}</td>
                          <td className="px-4 py-3" style={{ color: green }}>{r.email}</td>
                          <td className="px-4 py-3" style={{ color: "rgba(240,244,248,0.6)" }}>{r.phone}</td>
                          <td className="px-4 py-3" style={{ color: "rgba(240,244,248,0.5)" }}>{r.address}</td>
                          <td className="px-4 py-3">
                            <button onClick={() => copy(`${r.name}\t${r.email}\t${r.phone}\t${r.address}`, `r${i}`)}
                              className="text-xs transition-colors duration-150"
                              style={{ fontFamily: D, color: copied === `r${i}` ? green : dim(0.4) }}
                              onMouseEnter={e => { if (copied !== `r${i}`) e.currentTarget.style.color = blue; }}
                              onMouseLeave={e => { if (copied !== `r${i}`) e.currentTarget.style.color = dim(0.4); }}>
                              {copied === `r${i}` ? "copied!" : "copy"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : <EmptyState />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-8" style={{ borderTop: `1px solid ${dim(0.08)}` }}>
        <div className="pt-6 flex items-center justify-between">
          <p className="text-xs" style={{ fontFamily: D, color: dim(0.25) }}>
            100% free. runs locally in your browser.
          </p>
          <NavLink href="/tools">more tools</NavLink>
        </div>
      </div>
    </div>
  );
}
