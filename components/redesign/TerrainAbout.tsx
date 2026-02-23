"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

const techStack = [
  { name: "React", color: "#64748B" },
  { name: "Next.js", color: "#34D399" },
  { name: "TypeScript", color: "#64748B" },
  { name: "Node.js", color: "#34D399" },
  { name: "Go", color: "#64748B" },
  { name: "Rust", color: "#34D399" },
  { name: "Electron", color: "#64748B" },
  { name: "CxJS", color: "#34D399" },
  { name: "Tailwind", color: "#64748B" },
  { name: "Prisma", color: "#34D399" },
];

export default function TerrainAbout() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const textY = useTransform(scrollYProgress, [0, 1], [20, -20]);

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ backgroundColor: "#0D1117" }}
    >
      {/* Separator line */}
      <div className="max-w-6xl mx-auto px-6 md:px-8">
        <div className="h-px" style={{ background: "linear-gradient(to right, transparent, #6B8CAE33, transparent)" }} />
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-8 py-24 md:py-32">
        {/* Section comment */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <span
            className="text-sm"
            style={{ fontFamily: "var(--font-display)", color: "#6B8CAE", opacity: 0.5 }}
          >
            {'// about-me'}
          </span>
        </motion.div>

        {/* Asymmetric grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 md:gap-16 items-center">
          {/* Image - shows first on mobile */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="md:col-span-2 order-first md:order-last"
            style={{ y: imageY }}
          >
            <div className="relative max-w-sm mx-auto md:max-w-none">
              {/* Code-style frame around image */}
              <div
                className="absolute -top-3 -left-3 text-xs"
                style={{ fontFamily: "var(--font-display)", color: "#64748B", opacity: 0.6 }}
              >
                {'<img>'}
              </div>
              <div
                className="rounded-lg overflow-hidden"
                style={{ border: "1px solid rgba(107, 140, 174, 0.2)" }}
              >
                <Image
                  src="/image.png"
                  alt="Vedran"
                  width={500}
                  height={600}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div
                className="absolute -bottom-3 -right-3 text-xs"
                style={{ fontFamily: "var(--font-display)", color: "#64748B", opacity: 0.6 }}
              >
                {'</img>'}
              </div>
            </div>
          </motion.div>

          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="md:col-span-3"
            style={{ y: textY }}
          >
            <h2
              className="text-3xl md:text-4xl lg:text-5xl tracking-tight mb-8"
              style={{ fontFamily: "var(--font-display)", color: "#F0F4F8" }}
            >
              Building with
              <br />
              <span style={{ color: "#34D399" }}>purpose</span>
            </h2>
            <div
              className="space-y-4 text-base md:text-lg font-light leading-relaxed"
              style={{
                fontFamily: "var(--font-body)",
                color: "rgba(240, 244, 248, 0.7)",
              }}
            >
              <p>
                I&apos;m Vedran, a full-stack developer who believes great
                software comes from understanding people first and technology
                second.
              </p>
              <p>
                With experience spanning React ecosystems, backend systems, and
                everything in between, I focus on building things that actually
                matter — tools people enjoy using, interfaces that feel natural,
                and code that stands the test of time.
              </p>
            </div>

            {/* Tech stack */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.05 } },
              }}
              className="mt-10"
            >
              <div
                className="text-xs mb-4"
                style={{ fontFamily: "var(--font-display)", color: "#6B8CAE", opacity: 0.5 }}
              >
                {'// tech.stack'}
              </div>
              <div className="flex flex-wrap gap-2">
                {techStack.map((tech) => (
                  <motion.span
                    key={tech.name}
                    variants={{
                      hidden: { opacity: 0, scale: 0.9 },
                      visible: {
                        opacity: 1,
                        scale: 1,
                        transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
                      },
                    }}
                    className="px-3 py-1 rounded text-xs font-medium tracking-wide"
                    style={{
                      fontFamily: "var(--font-display)",
                      backgroundColor: "rgba(107, 140, 174, 0.1)",
                      border: `1px solid ${tech.color}33`,
                      color: tech.color,
                    }}
                  >
                    {tech.name}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
