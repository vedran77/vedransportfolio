"use client"

import { motion } from "framer-motion"

export default function Process() {
  const steps = [
    {
      number: "01",
      title: "Discovery",
      description: "We discuss your project goals, requirements, and vision to ensure we're aligned from the start.",
    },
    {
      number: "02",
      title: "Planning",
      description: "I create a detailed project plan with timelines, milestones, and deliverables for your review.",
    },
    {
      number: "03",
      title: "Development",
      description: "I build your solution using best practices, keeping you updated with regular progress reports.",
    },
    {
      number: "04",
      title: "Launch & Support",
      description: "After launch, I provide support and maintenance to ensure everything runs smoothly.",
    },
  ]

  return (
    <section className="py-32 px-4 sm:px-6 lg:px-8 bg-white dark:bg-black">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <div className="inline-block px-3 py-1 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 text-sm font-medium mb-4">
            Process
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            How I Work
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
            A structured approach to delivering exceptional results
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-slate-200 dark:bg-slate-800 -z-10" />
              )}
              
              <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 h-full">
                <div className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-4 opacity-20">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

