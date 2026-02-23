"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { projects } from "@/data/projects";

const sortedProjects = [...projects]
  .filter((p) => p.featured)
  .sort((a, b) => a.order - b.order)
  .slice(0, 3);

function ParallaxImage({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [25, -25]);

  return (
    <motion.div
      ref={ref}
      style={{ y }}
      className="relative overflow-hidden rounded-lg group"
    >
      <div style={{ border: "1px solid rgba(107, 140, 174, 0.15)" }} className="overflow-hidden rounded-lg">
        <Image
          src={src}
          alt={alt}
          width={800}
          height={500}
          className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: "linear-gradient(to top, rgba(13, 17, 23, 0.6), transparent)" }}
        />
      </div>
    </motion.div>
  );
}

export default function TerrainProjects() {
  return (
    <section id="projects" style={{ backgroundColor: "#0D1117" }}>
      {/* Separator */}
      <div className="max-w-6xl mx-auto px-6 md:px-8">
        <div className="h-px" style={{ background: "linear-gradient(to right, transparent, #6B8CAE33, transparent)" }} />
      </div>

      {/* Section header */}
      <div className="max-w-6xl mx-auto px-6 md:px-8 pt-24 md:pt-32 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span
            className="text-sm block mb-6"
            style={{ fontFamily: "var(--font-display)", color: "#6B8CAE", opacity: 0.5 }}
          >
            {'// selected-work'}
          </span>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl tracking-tight"
            style={{ fontFamily: "var(--font-display)", color: "#F0F4F8" }}
          >
            Projects<span style={{ color: "#34D399" }}>()</span>
          </h2>
        </motion.div>
      </div>

      {/* Project list */}
      <div className="max-w-6xl mx-auto px-6 md:px-8 pb-24 md:pb-32 space-y-20 md:space-y-28">
        {sortedProjects.map((project, index) => {
          const isImageLeft = index % 2 === 0;

          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Project index line */}
              <div
                className="flex items-center gap-4 mb-8"
                style={{ fontFamily: "var(--font-display)" }}
              >
                <span className="text-xs" style={{ color: "#6B8CAE", opacity: 0.4 }}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="flex-1 h-px" style={{ backgroundColor: "rgba(107, 140, 174, 0.15)" }} />
              </div>

              <div
                className={`grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center ${
                  !isImageLeft ? "md:[direction:rtl]" : ""
                }`}
              >
                {/* Project image */}
                <div className="md:[direction:ltr]">
                  <ParallaxImage
                    src={project.imageUrl || project.images?.[0] || ""}
                    alt={project.title}
                  />
                </div>

                {/* Project info */}
                <div className="relative md:[direction:ltr]">
                  <h3
                    className="text-2xl md:text-3xl tracking-tight mb-3"
                    style={{ fontFamily: "var(--font-display)", color: "#F0F4F8" }}
                  >
                    {project.title}
                  </h3>
                  <p
                    className="text-base font-light leading-relaxed mb-6 line-clamp-3"
                    style={{
                      fontFamily: "var(--font-body)",
                      color: "rgba(240, 244, 248, 0.6)",
                    }}
                  >
                    {project.description}
                  </p>

                  {/* Tech stack inline */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.techStack.map((tech, i) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 rounded text-xs tracking-wide"
                        style={{
                          fontFamily: "var(--font-display)",
                          backgroundColor: "rgba(107, 140, 174, 0.08)",
                          border: `1px solid ${i % 2 === 0 ? "#64748B" : "#34D399"}22`,
                          color: i % 2 === 0 ? "#64748B" : "#34D399",
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="flex gap-6" style={{ fontFamily: "var(--font-display)" }}>
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm transition-colors duration-200"
                        style={{ color: "#6B8CAE" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#34D399")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "#6B8CAE")}
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        source
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm transition-colors duration-200"
                        style={{ color: "#6B8CAE" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#34D399")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "#6B8CAE")}
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                        live
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
