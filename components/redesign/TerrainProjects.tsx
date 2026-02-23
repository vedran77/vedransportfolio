"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { projects } from "@/data/projects";

const layerColors = [
  {
    bg: "#C8A882",
    text: "#2A1F14",
    textMuted: "rgba(42, 31, 20, 0.7)",
    number: "rgba(42, 31, 20, 0.08)",
    badge: { bg: "#5C6B4F", text: "#F5F0E8" },
    badgeAlt: { bg: "#C2703E", text: "#F5F0E8" },
    wave: "#D4B896",
  },
  {
    bg: "#5C6B4F",
    text: "#F5F0E8",
    textMuted: "rgba(245, 240, 232, 0.75)",
    number: "rgba(245, 240, 232, 0.06)",
    badge: { bg: "#E8DCC8", text: "#2A1F14" },
    badgeAlt: { bg: "#C2703E", text: "#F5F0E8" },
    wave: "#C8A882",
  },
  {
    bg: "#2A1F14",
    text: "#F5F0E8",
    textMuted: "rgba(245, 240, 232, 0.7)",
    number: "rgba(245, 240, 232, 0.05)",
    badge: { bg: "#5C6B4F", text: "#F5F0E8" },
    badgeAlt: { bg: "#C2703E", text: "#F5F0E8" },
    wave: "#5C6B4F",
  },
];

const wavePaths = [
  "M0 0H1440V40C1440 40 1200 100 960 80C720 60 480 110 240 90C120 80 0 70 0 70V0Z",
  "M0 0H1440V50C1440 50 1300 90 1080 70C860 50 600 100 360 85C180 73 60 95 0 80V0Z",
  "M0 0H1440V35C1440 35 1260 95 1020 75C780 55 540 105 300 80C150 68 60 90 0 65V0Z",
];

const sortedProjects = [...projects]
  .filter((p) => p.featured)
  .sort((a, b) => a.order - b.order)
  .slice(0, 3);

export default function TerrainProjects() {
  return (
    <section>
      {/* Section intro */}
      <div
        className="py-16 md:py-24 text-center"
        style={{ backgroundColor: "#D4B896" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <p
            className="text-sm uppercase tracking-[0.2em] mb-4 font-semibold"
            style={{ fontFamily: "var(--font-body)", color: "#C2703E" }}
          >
            Work
          </p>
          <h2
            className="text-4xl md:text-5xl"
            style={{ fontFamily: "var(--font-display)", color: "#2A1F14" }}
          >
            Layers of craft
          </h2>
        </motion.div>
      </div>

      {/* Project layers */}
      {sortedProjects.map((project, index) => {
        const colors = layerColors[index];
        const isImageLeft = index % 2 === 0;

        return (
          <div key={project.id} className="relative" style={{ backgroundColor: colors.bg }}>
            {/* Wave divider */}
            <div className="absolute top-0 left-0 w-full" style={{ marginTop: "-1px" }}>
              <svg
                viewBox="0 0 1440 120"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-[60px] md:h-[100px] block"
                preserveAspectRatio="none"
              >
                <path d={wavePaths[index]} fill={colors.wave} />
              </svg>
            </div>

            <div className="max-w-6xl mx-auto px-6 md:px-8 py-24 md:py-32 pt-28 md:pt-36">
              <div
                className={`grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center ${
                  !isImageLeft ? "md:[direction:rtl]" : ""
                }`}
              >
                {/* Project image */}
                <motion.div
                  initial={{ opacity: 0, x: isImageLeft ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="md:[direction:ltr]"
                >
                  <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                    <Image
                      src={project.imageUrl || project.images?.[0] || ""}
                      alt={project.title}
                      width={800}
                      height={500}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </motion.div>

                {/* Project info */}
                <motion.div
                  initial={{ opacity: 0, x: isImageLeft ? 40 : -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{
                    duration: 0.7,
                    delay: 0.15,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="relative md:[direction:ltr]"
                >
                  {/* Large project number */}
                  <span
                    className="absolute -top-8 -left-2 text-8xl md:text-9xl font-bold select-none pointer-events-none"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: colors.number,
                    }}
                  >
                    0{index + 1}
                  </span>

                  <div className="relative">
                    <h3
                      className="text-3xl md:text-4xl mb-4"
                      style={{
                        fontFamily: "var(--font-display)",
                        color: colors.text,
                      }}
                    >
                      {project.title}
                    </h3>
                    <p
                      className="text-lg font-light leading-relaxed mb-6 line-clamp-3"
                      style={{
                        fontFamily: "var(--font-body)",
                        color: colors.textMuted,
                      }}
                    >
                      {project.description}
                    </p>

                    {/* Tech badges */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.techStack.map((tech, i) => {
                        const badge = i % 2 === 0 ? colors.badge : colors.badgeAlt;
                        return (
                          <span
                            key={tech}
                            className="px-3 py-1 rounded-full text-xs font-medium"
                            style={{
                              fontFamily: "var(--font-body)",
                              backgroundColor: badge.bg,
                              color: badge.text,
                            }}
                          >
                            {tech}
                          </span>
                        );
                      })}
                    </div>

                    {/* Links */}
                    <div className="flex gap-6">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm font-medium underline underline-offset-4 decoration-1 hover:opacity-70 transition-opacity"
                          style={{
                            fontFamily: "var(--font-body)",
                            color: colors.text,
                          }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                          </svg>
                          Source Code
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm font-medium underline underline-offset-4 decoration-1 hover:opacity-70 transition-opacity"
                          style={{
                            fontFamily: "var(--font-body)",
                            color: colors.text,
                          }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="10" y1="14" x2="21" y2="3" />
                          </svg>
                          Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
