"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const name = "Vedran";
const roles = ["full-stack developer", "problem solver", "code craftsman"];

// Floating code snippets with position, content, and opacity based on distance from center
const codeSnippets = [
  {
    // Top-left corner — far from center = higher opacity
    position: "top-[12%] left-[5%]",
    opacity: 0.22,
    delay: 2.0,
    speed: 60,
    lines: [
      { text: "const dev = {", color: "#6B8CAE", kw: "const" },
      { text: '  name: "Vedran",', color: "#6B8CAE", str: '"Vedran"' },
      { text: '  focus: "web",', color: "#6B8CAE", str: '"web"' },
      { text: "  coffee: true,", color: "#6B8CAE", kw2: "true" },
      { text: "};", color: "#6B8CAE" },
    ],
  },
  {
    // Bottom-left — far from center
    position: "bottom-[14%] left-[4%]",
    opacity: 0.2,
    delay: 3.0,
    speed: 55,
    lines: [
      { text: "async function build() {", color: "#6B8CAE", kw: "async function" },
      { text: "  await compile();", color: "#6B8CAE", kw: "await" },
      { text: "  await test();", color: "#6B8CAE", kw: "await" },
      { text: '  return "shipped";', color: "#6B8CAE", kw: "return", str: '"shipped"' },
      { text: "}", color: "#6B8CAE" },
    ],
  },
  {
    // Right side, upper — medium distance
    position: "top-[20%] right-[4%]",
    opacity: 0.15,
    delay: 2.5,
    speed: 70,
    lines: [
      { text: "// stack.config", color: "#6B8CAE" },
      { text: "export default {", color: "#6B8CAE", kw: "export default" },
      { text: '  framework: "next",', color: "#6B8CAE", str: '"next"' },
      { text: '  lang: "typescript",', color: "#6B8CAE", str: '"typescript"' },
      { text: "  strict: true,", color: "#6B8CAE", kw2: "true" },
      { text: "};", color: "#6B8CAE" },
    ],
  },
  {
    // Bottom-right — medium-far
    position: "bottom-[18%] right-[3%]",
    opacity: 0.18,
    delay: 3.5,
    speed: 65,
    lines: [
      { text: "interface Project {", color: "#6B8CAE", kw: "interface" },
      { text: "  title: string;", color: "#6B8CAE", kw2: "string" },
      { text: "  stack: string[];", color: "#6B8CAE", kw2: "string" },
      { text: "  live: boolean;", color: "#6B8CAE", kw2: "boolean" },
      { text: "}", color: "#6B8CAE" },
    ],
  },
  {
    // Left, mid — closer to center = lower opacity
    position: "top-[45%] left-[3%]",
    opacity: 0.1,
    delay: 4.0,
    speed: 75,
    lines: [
      { text: "const skills = [", color: "#6B8CAE", kw: "const" },
      { text: '  "react",', color: "#6B8CAE", str: '"react"' },
      { text: '  "node",', color: "#6B8CAE", str: '"node"' },
      { text: '  "go",', color: "#6B8CAE", str: '"go"' },
      { text: "];", color: "#6B8CAE" },
    ],
  },
  {
    // Right, mid — closer to center = lower opacity
    position: "top-[55%] right-[5%]",
    opacity: 0.08,
    delay: 4.5,
    speed: 70,
    lines: [
      { text: "// deploy.sh", color: "#6B8CAE" },
      { text: "git push origin main", color: "#6B8CAE" },
      { text: "vercel --prod", color: "#6B8CAE" },
    ],
  },
];

// Typewriter component for each floating snippet
function FloatingCode({
  lines,
  opacity,
  delay,
  speed,
  position,
}: {
  lines: { text: string; color: string; kw?: string; kw2?: string; str?: string }[];
  opacity: number;
  delay: number;
  speed: number;
  position: string;
}) {
  const [visibleChars, setVisibleChars] = useState(0);
  const totalChars = lines.reduce((sum, l) => sum + l.text.length, 0);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const startDelay = setTimeout(() => {
      const type = () => {
        setVisibleChars((prev) => {
          if (prev >= totalChars) return prev;
          timeout = setTimeout(type, speed + Math.random() * 40);
          return prev + 1;
        });
      };
      type();
    }, delay * 1000);

    return () => {
      clearTimeout(startDelay);
      clearTimeout(timeout);
    };
  }, [delay, speed, totalChars]);

  let charCount = 0;

  return (
    <div
      className={`absolute ${position} hidden md:block select-none pointer-events-none`}
      style={{
        fontFamily: "var(--font-display)",
        fontSize: "11px",
        lineHeight: "1.7",
        opacity,
      }}
    >
      {lines.map((line, i) => {
        const lineStart = charCount;
        charCount += line.text.length;
        const visibleLen = Math.max(0, Math.min(line.text.length, visibleChars - lineStart));
        const visibleText = line.text.slice(0, visibleLen);

        if (visibleLen === 0) return <div key={i} className="h-[1.1em]" />;

        // Syntax highlight the visible portion
        let highlighted: React.ReactNode = visibleText;

        if (line.kw || line.kw2 || line.str) {
          const parts: React.ReactNode[] = [];
          let remaining = visibleText;
          let key = 0;

          // Highlight keywords
          if (line.kw && remaining.includes(line.kw.slice(0, Math.min(line.kw.length, remaining.length)))) {
            const kwVisible = line.kw.slice(0, Math.min(line.kw.length, remaining.indexOf(line.kw) + line.kw.length));
            if (remaining.startsWith(kwVisible.split("").slice(0, remaining.length)[0] || "")) {
              // Simple approach: just colorize known patterns
            }
          }

          // Simpler approach: split by known strings
          const rawText = visibleText;
          let cursor = 0;

          const kwPatterns = [line.kw, line.kw2, line.str].filter(Boolean) as string[];

          // Build segments
          const segments: { text: string; isKw: boolean; isStr: boolean }[] = [];
          let temp = rawText;

          for (const pattern of kwPatterns) {
            const idx = temp.indexOf(pattern);
            if (idx >= 0) {
              if (idx > 0) segments.push({ text: temp.slice(0, idx), isKw: false, isStr: false });
              const isStr = pattern.startsWith('"');
              segments.push({ text: pattern, isKw: !isStr, isStr });
              temp = temp.slice(idx + pattern.length);
            }
          }
          if (temp) segments.push({ text: temp, isKw: false, isStr: false });

          if (segments.length > 0) {
            highlighted = segments.map((seg, si) => (
              <span
                key={si}
                style={{
                  color: seg.isKw ? "#34D399" : seg.isStr ? "#34D399" : line.color,
                }}
              >
                {seg.text}
              </span>
            ));
          }
        }

        return (
          <div key={i} style={{ color: line.color }}>
            {highlighted}
            {visibleLen < line.text.length && visibleLen > 0 && (
              <span
                className="inline-block w-[1px] h-[1em] align-middle ml-px"
                style={{ backgroundColor: "#34D399", opacity: 0.6 }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function TerrainHero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentRole = roles[roleIndex];
    let timeout: NodeJS.Timeout;

    if (!isDeleting && displayed.length < currentRole.length) {
      timeout = setTimeout(() => {
        setDisplayed(currentRole.slice(0, displayed.length + 1));
      }, 80);
    } else if (!isDeleting && displayed.length === currentRole.length) {
      timeout = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && displayed.length > 0) {
      timeout = setTimeout(() => {
        setDisplayed(currentRole.slice(0, displayed.length - 1));
      }, 40);
    } else if (isDeleting && displayed.length === 0) {
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }

    return () => clearTimeout(timeout);
  }, [displayed, isDeleting, roleIndex]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const spacing = 30;
    const dotRadius = 1;
    const maxInfluence = 120;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const handleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    resize();
    window.addEventListener("resize", resize);
    canvas.addEventListener("mousemove", handleMouse);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    const draw = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cols = Math.ceil(canvas.width / spacing);
      const rows = Math.ceil(canvas.height / spacing);
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * spacing + spacing / 2;
          const y = row * spacing + spacing / 2;

          const dx = mx - x;
          const dy = my - y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Base pulse
          const phase = (row * 7 + col * 13) % 100;
          const pulse = 0.08 + Math.sin(time * 0.001 + phase) * 0.04;

          // Mouse influence
          const influence = Math.max(0, 1 - dist / maxInfluence);
          const alpha = pulse + influence * 0.35;
          const radius = dotRadius + influence * 1.5;

          if (influence > 0.01) {
            ctx.fillStyle = `rgba(52, 211, 153, ${alpha})`;
          } else {
            ctx.fillStyle = `rgba(107, 140, 174, ${alpha})`;
          }

          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationId = requestAnimationFrame(draw);
    };

    animationId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouse);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const decorY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const canvasOpacity = useTransform(scrollYProgress, [0, 0.8], [0.8, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: "#0D1117" }}
    >
      {/* Animated dot grid canvas */}
      <motion.div className="absolute inset-0" style={{ opacity: canvasOpacity }}>
        <canvas
          ref={canvasRef}
          className="w-full h-full"
        />
      </motion.div>

      {/* Status badge - top right */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2.2, duration: 0.6 }}
        className="absolute top-8 right-16 md:top-12 md:right-24 flex items-center gap-2 z-10"
        style={{ fontFamily: "var(--font-display)" }}
      >
        <span
          className="relative flex h-2.5 w-2.5"
        >
          <span
            className="absolute inline-flex h-full w-full rounded-full opacity-75"
            style={{ backgroundColor: "#34D399", animation: "ping 2s cubic-bezier(0, 0, 0.2, 1) infinite" }}
          />
          <span
            className="relative inline-flex rounded-full h-2.5 w-2.5"
            style={{ backgroundColor: "#34D399" }}
          />
        </span>
        <span className="text-xs" style={{ color: "#6B8CAE" }}>
          Available for work
        </span>
      </motion.div>

      {/* Floating code snippets — typewriter animated, opacity fades toward center */}
      <motion.div className="absolute inset-0" style={{ y: decorY }}>
        {codeSnippets.map((snippet, i) => (
          <FloatingCode
            key={i}
            lines={snippet.lines}
            opacity={snippet.opacity}
            delay={snippet.delay}
            speed={snippet.speed}
            position={snippet.position}
          />
        ))}
      </motion.div>

      {/* Main content */}
      <motion.div className="relative z-10 text-center px-6" style={{ y: contentY }}>
        {/* Opening tag */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-sm md:text-base mb-6"
          style={{ fontFamily: "var(--font-display)", color: "#64748B" }}
        >
          &lt;hello&gt;
        </motion.div>

        {/* Animated name */}
        <h1
          className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tighter mb-4"
          style={{ fontFamily: "var(--font-display)", color: "#F0F4F8" }}
        >
          {name.split("").map((letter, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.3 + i * 0.07,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="inline-block"
            >
              {letter}
            </motion.span>
          ))}
        </h1>

        {/* Typing role */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.5 }}
          className="text-lg sm:text-xl md:text-2xl mb-8"
          style={{ fontFamily: "var(--font-display)", color: "#6B8CAE" }}
        >
          <span style={{ color: "#34D399" }}>const</span>{" "}
          <span style={{ color: "#F0F4F8" }}>role</span>{" "}
          <span style={{ color: "#34D399" }}>=</span>{" "}
          <span style={{ color: "#34D399" }}>&quot;{displayed}</span>
          <span
            className="inline-block w-[2px] h-[1.1em] align-middle ml-px"
            style={{
              backgroundColor: "#34D399",
              animation: "cursor-blink 1s step-end infinite",
            }}
          />
          <span style={{ color: "#34D399" }}>&quot;</span>
          <span style={{ color: "#F0F4F8" }}>;</span>
        </motion.div>

        {/* Closing tag */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.3 }}
          className="text-sm md:text-base"
          style={{ fontFamily: "var(--font-display)", color: "#64748B" }}
        >
          &lt;/hello&gt;
        </motion.div>

        {/* CTA terminal commands */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 mt-10"
          style={{ fontFamily: "var(--font-display)" }}
        >
          <a
            href="#projects"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="group flex items-center gap-2 px-4 py-2 rounded text-sm transition-all duration-200"
            style={{
              border: "1px solid rgba(52, 211, 153, 0.3)",
              color: "#34D399",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(52, 211, 153, 0.1)";
              e.currentTarget.style.borderColor = "rgba(52, 211, 153, 0.6)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.borderColor = "rgba(52, 211, 153, 0.3)";
            }}
          >
            <span style={{ color: "#64748B" }}>&gt;</span> view-work
          </a>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="group flex items-center gap-2 px-4 py-2 rounded text-sm transition-all duration-200"
            style={{
              border: "1px solid rgba(107, 140, 174, 0.2)",
              color: "#6B8CAE",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(107, 140, 174, 0.08)";
              e.currentTarget.style.borderColor = "rgba(107, 140, 174, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.borderColor = "rgba(107, 140, 174, 0.2)";
            }}
          >
            <span style={{ color: "#64748B" }}>&gt;</span> contact
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.0, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span
          className="text-xs"
          style={{ fontFamily: "var(--font-display)", color: "#6B8CAE", opacity: 0.5 }}
        >
          scroll
        </span>
        <div
          className="w-px h-8"
          style={{
            background: "linear-gradient(to bottom, #6B8CAE, transparent)",
            animation: "scroll-fade 2s ease-in-out infinite",
          }}
        />
      </motion.div>

      {/* CSS animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
        @keyframes cursor-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes scroll-fade {
          0%, 100% { opacity: 0.3; transform: scaleY(1); }
          50% { opacity: 0.7; transform: scaleY(1.3); }
        }
      ` }} />
    </section>
  );
}
