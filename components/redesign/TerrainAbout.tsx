"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const techStack = [
  { name: "React", color: "#5C6B4F" },
  { name: "Next.js", color: "#2A1F14" },
  { name: "TypeScript", color: "#C2703E" },
  { name: "Node.js", color: "#5C6B4F" },
  { name: "Go", color: "#2A1F14" },
  { name: "Rust", color: "#C2703E" },
  { name: "Electron", color: "#5C6B4F" },
  { name: "CxJS", color: "#2A1F14" },
  { name: "Tailwind", color: "#C2703E" },
  { name: "Prisma", color: "#5C6B4F" },
];

const rotations = [-2, 1.5, -1, 2, -1.5, 1, -2.5, 1.5, -1, 2.5];

export default function TerrainAbout() {
  return (
    <section
      className="relative"
      style={{
        background: "linear-gradient(180deg, #E8DCC8 0%, #D4B896 100%)",
      }}
    >
      {/* Wave divider from hero */}
      <div className="absolute top-0 left-0 w-full" style={{ marginTop: "-1px" }}>
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto block"
          preserveAspectRatio="none"
        >
          <path
            d="M0 0H1440V60C1440 60 1320 120 1080 100C840 80 720 30 480 60C240 90 120 110 0 80V0Z"
            fill="#F5F0E8"
          />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-8 py-24 md:py-32 pt-32 md:pt-40">
        {/* Asymmetric grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 md:gap-16 items-center">
          {/* Image - shows first on mobile */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="md:col-span-2 order-first md:order-last"
          >
            <div className="relative max-w-sm mx-auto md:max-w-none">
              <Image
                src="/image.png"
                alt="Vedran"
                width={500}
                height={600}
                className="w-full h-auto object-cover"
                style={{
                  clipPath:
                    "polygon(30% 0%, 100% 0%, 100% 70%, 85% 100%, 0% 100%, 0% 20%)",
                  filter: "drop-shadow(0 20px 40px rgba(42, 31, 20, 0.2))",
                }}
              />
            </div>
          </motion.div>

          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="md:col-span-3"
          >
            <p
              className="text-sm uppercase tracking-[0.2em] mb-4 font-semibold"
              style={{ fontFamily: "var(--font-body)", color: "#C2703E" }}
            >
              About
            </p>
            <h2
              className="text-4xl md:text-5xl mb-8"
              style={{ fontFamily: "var(--font-display)", color: "#2A1F14" }}
            >
              Building with purpose
            </h2>
            <div
              className="space-y-4 text-lg font-light leading-relaxed"
              style={{
                fontFamily: "var(--font-body)",
                color: "rgba(42, 31, 20, 0.8)",
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

            {/* Tech pebbles */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.06 } },
              }}
              className="flex flex-wrap gap-3 mt-10"
            >
              {techStack.map((tech, i) => (
                <motion.span
                  key={tech.name}
                  variants={{
                    hidden: { opacity: 0, scale: 0.8, y: 10 },
                    visible: {
                      opacity: 1,
                      scale: 1,
                      y: 0,
                      transition: {
                        duration: 0.4,
                        ease: [0.22, 1, 0.36, 1],
                      },
                    },
                  }}
                  className="px-4 py-1.5 rounded-full text-sm font-medium"
                  style={{
                    fontFamily: "var(--font-body)",
                    backgroundColor: tech.color,
                    color: "#F5F0E8",
                    transform: `rotate(${rotations[i]}deg)`,
                  }}
                >
                  {tech.name}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
