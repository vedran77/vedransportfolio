"use client";

import { motion } from "framer-motion";

const name = "Vedran";

export default function TerrainHero() {
  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: "#F5F0E8" }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes blob-morph-1 {
          0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          25% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
          50% { border-radius: 50% 60% 30% 60% / 30% 60% 70% 40%; }
          75% { border-radius: 60% 40% 60% 30% / 70% 30% 50% 60%; }
        }
        @keyframes blob-morph-2 {
          0%, 100% { border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; }
          25% { border-radius: 70% 30% 50% 50% / 30% 40% 70% 60%; }
          50% { border-radius: 30% 60% 40% 70% / 60% 70% 30% 40%; }
          75% { border-radius: 50% 40% 60% 50% / 50% 30% 60% 70%; }
        }
        @keyframes seed-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(8px); }
        }
      ` }} />

      {/* Organic blob 1 - top right */}
      <div
        className="absolute -top-20 -right-20 w-[500px] h-[500px] md:w-[700px] md:h-[700px]"
        style={{
          backgroundColor: "#E8DCC8",
          opacity: 0.5,
          animation: "blob-morph-1 20s ease-in-out infinite",
        }}
      />

      {/* Organic blob 2 - bottom left */}
      <div
        className="absolute -bottom-32 -left-32 w-[400px] h-[400px] md:w-[550px] md:h-[550px]"
        style={{
          backgroundColor: "#C2703E",
          opacity: 0.12,
          animation: "blob-morph-2 25s ease-in-out infinite",
        }}
      />

      {/* Main content */}
      <div className="relative z-10 text-center px-4">
        {/* Animated name */}
        <h1
          className="text-7xl sm:text-8xl md:text-9xl tracking-tight mb-6"
          style={{
            fontFamily: "var(--font-display)",
            color: "#2A1F14",
          }}
        >
          {name.split("").map((letter, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.3 + i * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="inline-block"
            >
              {letter}
            </motion.span>
          ))}
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0, ease: "easeOut" }}
          className="text-lg sm:text-xl md:text-2xl font-light max-w-lg mx-auto"
          style={{
            fontFamily: "var(--font-body)",
            color: "#5C6B4F",
          }}
        >
          I craft digital experiences with intention and care
        </motion.p>
      </div>

      {/* Scroll indicator - organic seed/teardrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <svg
          width="20"
          height="32"
          viewBox="0 0 20 32"
          fill="none"
          style={{ animation: "seed-bounce 2s ease-in-out infinite" }}
        >
          <path
            d="M10 0C10 0 0 16 0 22C0 27.5228 4.47715 32 10 32C15.5228 32 20 27.5228 20 22C20 16 10 0 10 0Z"
            fill="#C2703E"
            fillOpacity="0.6"
          />
        </svg>
      </motion.div>
    </section>
  );
}
