"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import ProjectCard from "@/components/ProjectCard"
import ProjectModal from "@/components/ProjectModal"
import Hero from "@/components/Hero"
import About from "@/components/About"
import Reviews from "@/components/Reviews"
import Services from "@/components/Services"
import Process from "@/components/Process"
import FAQ from "@/components/FAQ"
import CTASection from "@/components/CTASection"
import Contact from "@/components/Contact"
import { projects, Project } from "@/data/projects"

export default function Home() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOpenModal = (project: Project) => {
    setSelectedProject(project)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedProject(null), 300) // Wait for animation to complete
  }
  // Sort projects: featured first, then by order
  const sortedProjects = [...projects].sort((a, b) => {
    if (a.featured && !b.featured) return -1
    if (!a.featured && b.featured) return 1
    if (a.order !== b.order) return a.order - b.order
    return 0
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <section id="hero">
        <Hero />
      </section>
      
      <section id="about">
        <About />
      </section>
      
      <section id="reviews">
        <Reviews />
      </section>
      
      <section id="services">
        <Services />
      </section>
      
      <section id="process">
        <Process />
      </section>
      
      <section id="projects" className="py-32 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="mb-16"
            >
              <div className="inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium mb-4">
                Work
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                Selected Projects
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
                A collection of projects I've worked on, showcasing my skills and experience.
              </p>
            </motion.div>

        {sortedProjects.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {sortedProjects.map((project, index) => (
              <motion.div
                key={project.id}
                variants={{
                  hidden: { opacity: 0, y: 50, scale: 0.9 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: {
                      duration: 0.5,
                      ease: [0.22, 1, 0.36, 1],
                    },
                  },
                }}
              >
                <ProjectCard project={project} onOpenModal={handleOpenModal} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-lg text-slate-600 dark:text-slate-400">
              No projects yet. Add your projects in data/projects.ts
            </p>
          </motion.div>
        )}
          </div>
        </section>
        
        <section id="faq">
          <FAQ />
        </section>
        
        <section id="cta">
          <CTASection />
        </section>
        
        <section id="contact">
          <Contact />
        </section>

        {/* Project Modal */}
        <ProjectModal
          project={selectedProject}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </div>
  )
}
