"use client";

import { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

const PADDING = 40; // px from top and bottom

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const springProgress = useSpring(0, { stiffness: 100, damping: 30 });

  useEffect(() => {
    document.documentElement.classList.add("hide-scrollbar");
    document.body.classList.add("hide-scrollbar");
    return () => {
      document.documentElement.classList.remove("hide-scrollbar");
      document.body.classList.remove("hide-scrollbar");
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? scrollTop / docHeight : 0;
      setProgress(scrollPercent);
      springProgress.set(scrollPercent);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [springProgress]);

  // Dot position: lerp between PADDING and (viewportHeight - PADDING)
  const dotTop = `calc(${PADDING}px + ${progress} * (100vh - ${PADDING * 2}px))`;
  const labelTop = `calc(${PADDING}px + ${Math.min(progress, 0.95)} * (100vh - ${PADDING * 2}px) + 14px)`;

  return (
    <>
      {/* Fixed progress track — padded top and bottom */}
      <div
        className="fixed right-8 md:right-12 w-px z-50 pointer-events-none"
        style={{
          top: `${PADDING}px`,
          bottom: `${PADDING}px`,
          backgroundColor: "rgba(107, 140, 174, 0.08)",
        }}
      >
        {/* Active progress fill */}
        <motion.div
          className="w-full origin-top"
          style={{
            scaleY: springProgress,
            background: "linear-gradient(to bottom, #34D399, #6B8CAE)",
            height: "100%",
          }}
        />
      </div>

      {/* Progress dot */}
      <div
        className="fixed right-[29px] md:right-[45px] w-[7px] h-[7px] rounded-full z-50 pointer-events-none"
        style={{
          top: dotTop,
          backgroundColor: "#34D399",
          boxShadow: "0 0 8px rgba(52, 211, 153, 0.5)",
        }}
      />

      {/* Scroll percentage label */}
      <motion.div
        className="fixed right-4 md:right-6 z-50 pointer-events-none"
        style={{
          top: labelTop,
          fontFamily: "var(--font-display)",
          fontSize: "10px",
          color: "rgba(107, 140, 174, 0.4)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: progress > 0.01 ? 1 : 0 }}
      >
        {Math.round(progress * 100)}%
      </motion.div>
    </>
  );
}
