"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { useState } from "react"

interface Project {
  id: string
  title: string
  description: string
  imageUrl?: string
  images?: string[]
  techStack: string[]
  githubUrl?: string
  liveUrl?: string
  featured: boolean
  order: number
}

interface ProjectCardProps {
  project: Project
  onOpenModal: (project: Project) => void
}

export default function ProjectCard({ project, onOpenModal }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const techStack = Array.isArray(project.techStack) ? project.techStack : []

  return (
    <motion.div
      onClick={() => onOpenModal(project)}
      className="group cursor-pointer bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -4 }}
    >
      {/* Image container */}
      <div className="relative h-72 bg-slate-100 dark:bg-slate-800 overflow-hidden">
        {project.imageUrl ? (
          <Image
            src={project.imageUrl}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-900">
            <div className="text-5xl opacity-50">🚀</div>
          </div>
        )}
        {project.featured && (
          <div className="absolute top-4 left-4 px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
            Featured
          </div>
        )}
        {project.images && project.images.length > 1 && (
          <div className="absolute top-4 right-4 px-3 py-1 bg-black/50 backdrop-blur-sm text-white text-xs font-medium rounded-full flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {project.images.length}
          </div>
        )}
        {/* Click indicator overlay - hidden on mobile */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors hidden sm:flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
            className="px-4 py-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg text-sm font-medium text-slate-900 dark:text-white"
          >
            Click to view gallery
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {project.title}
          </h3>
          <motion.svg
            className="w-5 h-5 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex-shrink-0 ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            initial={{ scale: 1 }}
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
          </motion.svg>
        </div>
        
        <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
          {project.description}
        </p>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-2">
          {techStack.slice(0, 5).map((tech: string, index: number) => (
            <span
              key={index}
              className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md text-xs font-medium border border-slate-200 dark:border-slate-700"
            >
              {tech}
            </span>
          ))}
          {techStack.length > 5 && (
            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md text-xs font-medium border border-slate-200 dark:border-slate-700">
              +{techStack.length - 5}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}
