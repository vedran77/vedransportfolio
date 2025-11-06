"use client"

import { motion } from "framer-motion"

export default function Services() {
  const services = [
    {
      icon: "💻",
      title: "Web Development",
      description: "Custom web applications built with modern technologies. From simple websites to complex SaaS platforms.",
    },
    {
      icon: "📱",
      title: "Mobile Apps",
      description: "Cross-platform mobile applications using React Native and Electron for desktop.",
    },
    {
      icon: "⚡",
      title: "Performance Optimization",
      description: "Speed up your existing applications with code optimization and best practices.",
    },
    {
      icon: "🔧",
      title: "Consulting",
      description: "Technical consulting and code reviews to help your team build better products.",
    },
  ]

  return (
    <section className="py-32 px-4 sm:px-6 lg:px-8 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <div className="inline-block px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-sm font-medium mb-4">
            Services
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            What I Offer
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
            Comprehensive development services tailored to your needs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="p-8 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 group"
            >
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                {service.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

