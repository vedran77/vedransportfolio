"use client";

import { motion } from "framer-motion";
import { reviews } from "@/data/reviews";

const selectedReviews = [reviews[0], reviews[3], reviews[4]];
const cardRotations = [-1, 0.5, -0.5];

function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#C2703E">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

export default function TerrainReviews() {
  return (
    <section style={{ backgroundColor: "#2A1F14" }} className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p
            className="text-sm uppercase tracking-[0.2em] mb-4 font-semibold"
            style={{ fontFamily: "var(--font-body)", color: "#C2703E" }}
          >
            Testimonials
          </p>
          <h2
            className="text-4xl md:text-5xl"
            style={{ fontFamily: "var(--font-display)", color: "#F5F0E8" }}
          >
            What others say
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {selectedReviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.5,
                delay: index * 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="rounded-xl p-6 md:p-8"
              style={{
                backgroundColor: "rgba(245, 240, 232, 0.05)",
                border: "1px solid rgba(245, 240, 232, 0.1)",
                transform: `rotate(${cardRotations[index]}deg)`,
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
                className="text-base font-light italic leading-relaxed mb-6"
                style={{
                  fontFamily: "var(--font-body)",
                  color: "rgba(245, 240, 232, 0.85)",
                }}
              >
                &ldquo;{review.comment.length > 200
                  ? review.comment.slice(0, 200) + "..."
                  : review.comment}&rdquo;
              </p>

              {/* Project & date */}
              <div>
                {review.projectTitle && (
                  <p
                    className="text-sm font-medium mb-1"
                    style={{ fontFamily: "var(--font-body)", color: "#C2703E" }}
                  >
                    {review.projectTitle}
                  </p>
                )}
                {review.date && (
                  <p
                    className="text-xs"
                    style={{
                      fontFamily: "var(--font-body)",
                      color: "rgba(245, 240, 232, 0.4)",
                    }}
                  >
                    {new Date(review.date).toLocaleDateString("en-US", {
                      month: "long",
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
