"use client";

import { motion } from "framer-motion";

const contacts = [
  {
    label: "Email",
    href: "mailto:vedranv673@gmail.com",
    display: "vedranv673@gmail.com",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M22 4L12 13L2 4" />
      </svg>
    ),
  },
  {
    label: "GitHub",
    href: "https://github.com/vedran77",
    display: "vedran77",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/vedran-vucic-602b71223/",
    display: "Vedran Vucic",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    label: "Upwork",
    href: "https://www.upwork.com/freelancers/~01254b7b5cb0334c27",
    display: "Upwork Profile",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <polyline points="15 3 21 3 21 9" />
        <line x1="10" y1="14" x2="21" y2="3" />
      </svg>
    ),
  },
];

export default function TerrainContact() {
  return (
    <section className="relative" style={{ backgroundColor: "#1A1410" }}>
      {/* Wave from reviews */}
      <div className="absolute top-0 left-0 w-full" style={{ marginTop: "-1px" }}>
        <svg
          viewBox="0 0 1440 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-[50px] md:h-[80px] block"
          preserveAspectRatio="none"
        >
          <path
            d="M0 0H1440V30C1440 30 1260 80 1020 60C780 40 540 70 300 55C150 47 60 65 0 50V0Z"
            fill="#2A1F14"
          />
        </svg>
      </div>

      {/* Decorative root SVG */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-64 h-64 opacity-[0.06]">
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M100 10 C100 10 95 50 80 70 C65 90 40 95 30 110 C20 125 25 150 40 165 C55 180 85 185 100 190 C115 185 145 180 160 165 C175 150 180 125 170 110 C160 95 135 90 120 70 C105 50 100 10 100 10Z"
            stroke="#C2703E"
            strokeWidth="1"
            fill="none"
          />
          <path
            d="M100 40 C100 40 90 80 100 100 C110 120 100 160 100 190"
            stroke="#C2703E"
            strokeWidth="0.5"
          />
          <path
            d="M80 70 C80 70 60 85 50 100"
            stroke="#C2703E"
            strokeWidth="0.5"
          />
          <path
            d="M120 70 C120 70 140 85 150 100"
            stroke="#C2703E"
            strokeWidth="0.5"
          />
        </svg>
      </div>

      <div className="max-w-4xl mx-auto px-6 md:px-8 py-32 md:py-40 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2
            className="text-3xl md:text-4xl lg:text-5xl mb-6"
            style={{ fontFamily: "var(--font-display)", color: "#F5F0E8" }}
          >
            Let&apos;s create something together
          </h2>
          <p
            className="text-lg font-light mb-12 max-w-xl mx-auto"
            style={{
              fontFamily: "var(--font-body)",
              color: "rgba(245, 240, 232, 0.6)",
            }}
          >
            Got a project in mind? I&apos;d love to hear about it.
          </p>

          {/* Contact links */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            {contacts.map((contact, i) => (
              <motion.a
                key={contact.label}
                href={contact.href}
                target={contact.href.startsWith("mailto") ? undefined : "_blank"}
                rel={contact.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                className="flex items-center gap-2 transition-colors duration-300"
                style={{
                  fontFamily: "var(--font-body)",
                  color: "#F5F0E8",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#C2703E")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#F5F0E8")}
              >
                {contact.icon}
                <span className="text-sm font-medium">{contact.display}</span>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-24 text-xs"
          style={{
            fontFamily: "var(--font-body)",
            color: "rgba(245, 240, 232, 0.25)",
          }}
        >
          &copy; 2026 Vedran
        </motion.p>
      </div>
    </section>
  );
}
