"use client";

import { motion } from "framer-motion";

const contacts = [
  {
    label: "email",
    href: "mailto:vedranv673@gmail.com",
    display: "vedranv673@gmail.com",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M22 4L12 13L2 4" />
      </svg>
    ),
  },
  {
    label: "github",
    href: "https://github.com/vedran77",
    display: "vedran77",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
    ),
  },
  {
    label: "linkedin",
    href: "https://www.linkedin.com/in/vedran-vucic-602b71223/",
    display: "vedran-vucic",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    label: "upwork",
    href: "https://www.upwork.com/freelancers/~01254b7b5cb0334c27",
    display: "freelancer",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <polyline points="15 3 21 3 21 9" />
        <line x1="10" y1="14" x2="21" y2="3" />
      </svg>
    ),
  },
];

export default function TerrainContact() {
  return (
    <section style={{ backgroundColor: "#0D1117" }}>
      {/* Separator */}
      <div className="max-w-6xl mx-auto px-6 md:px-8">
        <div className="h-px" style={{ background: "linear-gradient(to right, transparent, #6B8CAE33, transparent)" }} />
      </div>

      <div className="max-w-4xl mx-auto px-6 md:px-8 py-32 md:py-40 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <span
            className="text-sm block mb-6"
            style={{ fontFamily: "var(--font-display)", color: "#6B8CAE", opacity: 0.5 }}
          >
            {'// get-in-touch'}
          </span>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl tracking-tight mb-4"
            style={{ fontFamily: "var(--font-display)", color: "#F0F4F8" }}
          >
            Let&apos;s <span style={{ color: "#64748B" }}>build</span> something
          </h2>
          <p
            className="text-base md:text-lg font-light mb-16 max-w-md mx-auto"
            style={{
              fontFamily: "var(--font-body)",
              color: "rgba(240, 244, 248, 0.5)",
            }}
          >
            Got a project in mind? I&apos;d love to hear about it.
          </p>

          {/* Contact links as a code-style list */}
          <div className="inline-flex flex-col items-start gap-3 text-left">
            {contacts.map((contact, i) => (
              <motion.a
                key={contact.label}
                href={contact.href}
                target={contact.href.startsWith("mailto") ? undefined : "_blank"}
                rel={contact.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}
                className="flex items-center gap-3 group transition-colors duration-200"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "#6B8CAE",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#34D399")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#6B8CAE")}
              >
                <span className="text-xs" style={{ color: "#64748B", opacity: 0.5 }}>
                  {'>'}
                </span>
                {contact.icon}
                <span className="text-sm">{contact.display}</span>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-24 pt-8"
          style={{ borderTop: "1px solid rgba(107, 140, 174, 0.1)" }}
        >
          <p
            className="text-xs"
            style={{
              fontFamily: "var(--font-display)",
              color: "rgba(107, 140, 174, 0.3)",
            }}
          >
            &copy; 2026 vedran
          </p>
        </motion.div>
      </div>
    </section>
  );
}
