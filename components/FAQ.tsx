"use client"

import { motion } from "framer-motion"
import { useState } from "react"

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: "How long does a typical project take?",
      answer: "Project timelines vary based on scope and complexity. A simple website might take 2-4 weeks, while a complex web application could take 2-6 months. I'll provide a detailed timeline during our initial consultation.",
    },
    {
      question: "What's your pricing model?",
      answer: "I offer both fixed-price and hourly rates depending on the project. Fixed-price works best for well-defined projects, while hourly rates are ideal for ongoing work or projects with evolving requirements. Let's discuss what works best for your project.",
    },
    {
      question: "Do you work with teams or only solo?",
      answer: "I work both independently and as part of teams. I'm comfortable collaborating with your existing team, integrating with your workflow, or working solo on projects from start to finish.",
    },
    {
      question: "What technologies do you specialize in?",
      answer: "I specialize in modern web technologies including React, Next.js, TypeScript, Node.js, Go, Rust, and more. I also work with mobile frameworks like React Native and Electron for desktop applications.",
    },
    {
      question: "How do you handle project communication?",
      answer: "I maintain regular communication through your preferred channels (email, Slack, Upwork, etc.). I provide weekly updates, respond promptly to questions, and ensure you're always in the loop about project progress.",
    },
    {
      question: "Do you provide ongoing support after project completion?",
      answer: "Yes! I offer maintenance packages and ongoing support options. I can help with bug fixes, feature additions, performance optimization, and keeping your application up-to-date with the latest technologies.",
    },
  ]

  return (
    <section className="py-32 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-block px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-4">
            FAQ
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Everything you need to know about working with me
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <span className="font-semibold text-slate-900 dark:text-white pr-8">
                  {faq.question}
                </span>
                <motion.svg
                  className="w-5 h-5 text-slate-500 dark:text-slate-400 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </motion.svg>
              </button>
              <motion.div
                initial={false}
                animate={{
                  height: openIndex === index ? "auto" : 0,
                  opacity: openIndex === index ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-5 text-slate-600 dark:text-slate-400 leading-relaxed">
                  {faq.answer}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

