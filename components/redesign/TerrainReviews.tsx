"use client";

import { motion } from "framer-motion";
import { reviews } from "@/data/reviews";

const selectedReviews = [reviews[0], reviews[3], reviews[4]];

function StarIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="#34D399">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

export default function TerrainReviews() {
  return (
    <section style={{ backgroundColor: "#0D1117" }}>
      {/* Separator */}
      <div className="max-w-6xl mx-auto px-6 md:px-8">
        <div className="h-px" style={{ background: "linear-gradient(to right, transparent, #6B8CAE33, transparent)" }} />
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-8 py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span
            className="text-sm block mb-6"
            style={{ fontFamily: "var(--font-display)", color: "#6B8CAE", opacity: 0.5 }}
          >
            {'// client-reviews'}
          </span>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl tracking-tight"
            style={{ fontFamily: "var(--font-display)", color: "#F0F4F8" }}
          >
            feedback<span style={{ color: "#64748B" }}>.map()</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {selectedReviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.5,
                delay: index * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="rounded-lg p-6"
              style={{
                backgroundColor: "rgba(107, 140, 174, 0.06)",
                border: "1px solid rgba(107, 140, 174, 0.12)",
              }}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <StarIcon key={i} />
                ))}
              </div>

              {/* Quote */}
              <p
                className="text-sm font-light leading-relaxed mb-6"
                style={{
                  fontFamily: "var(--font-body)",
                  color: "rgba(240, 244, 248, 0.7)",
                }}
              >
                &ldquo;{review.comment.length > 200
                  ? review.comment.slice(0, 200) + "..."
                  : review.comment}&rdquo;
              </p>

              {/* Project & date */}
              <div
                className="pt-4"
                style={{ borderTop: "1px solid rgba(107, 140, 174, 0.1)" }}
              >
                {review.projectTitle && (
                  <p
                    className="text-xs font-medium mb-1"
                    style={{ fontFamily: "var(--font-display)", color: "#34D399" }}
                  >
                    {review.projectTitle}
                  </p>
                )}
                {review.date && (
                  <p
                    className="text-xs"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "rgba(107, 140, 174, 0.5)",
                    }}
                  >
                    {new Date(review.date).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
