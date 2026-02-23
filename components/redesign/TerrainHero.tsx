"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const name = "Vedran";
const roles = ["full-stack developer", "problem solver", "code craftsman"];

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

      {/* Decorative code lines - top left */}
      <motion.div
        className="absolute top-8 left-8 md:top-12 md:left-12 text-xs md:text-sm select-none"
        style={{ fontFamily: "var(--font-display)", color: "#6B8CAE", opacity: 0.3, y: decorY }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 2.0, duration: 1 }}
        >
          <div>// portfolio.tsx</div>
          <div>// last updated: 2026</div>
        </motion.div>
      </motion.div>

      {/* Decorative line number gutter - right side */}
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 right-8 md:right-12 hidden md:flex flex-col gap-1 select-none"
        style={{ fontFamily: "var(--font-display)", color: "#6B8CAE", opacity: 0.15, y: decorY }}
      >
        {Array.from({ length: 20 }, (_, i) => (
          <div key={i} className="text-xs text-right" style={{ width: "2ch" }}>
            {i + 1}
          </div>
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
