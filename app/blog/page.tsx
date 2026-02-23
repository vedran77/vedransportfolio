"use client"

import { motion } from "framer-motion"
import Link from "next/link"

// Blog posts data - later we can move this to MDX/CMS
const posts = [
  {
    slug: "digitalocean-review-2026",
    title: "DigitalOcean Review 2026: Is It Still Worth It?",
    description: "Complete breakdown of DigitalOcean's pricing, performance, and features. Plus $200 free credit.",
    date: "2026-02-23",
    category: "Hosting",
    readTime: "5 min",
  },
  {
    slug: "hostinger-vps-review",
    title: "Hostinger VPS Review: Budget King?",
    description: "Can Hostinger's cheap VPS compete with the big players? I tested it for 30 days.",
    date: "2026-02-23",
    category: "Hosting",
    readTime: "6 min",
  },
  {
    slug: "best-cheap-hosting-developers",
    title: "Best Cheap Hosting for Developers in 2026",
    description: "Comparing DigitalOcean, Hostinger, Vercel, and Railway. Which gives the best value?",
    date: "2026-02-23",
    category: "Guides",
    readTime: "8 min",
  },
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <Link 
            href="/" 
            className="text-blue-600 dark:text-blue-400 hover:underline mb-8 inline-block"
          >
            ← Back to Portfolio
          </Link>
          
          <div className="inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium mb-4 ml-4">
            Blog
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Developer Resources
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
            Honest reviews, tutorials, and guides for developers. No fluff, just practical insights.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="space-y-8"
        >
          {posts.map((post, index) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
              className="group"
            >
              <Link href={`/blog/${post.slug}`}>
                <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium">
                      {post.category}
                    </span>
                    <span className="text-slate-400 dark:text-slate-500 text-sm">
                      {post.date}
                    </span>
                    <span className="text-slate-400 dark:text-slate-500 text-sm">
                      · {post.readTime}
                    </span>
                  </div>
                  
                  <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {post.title}
                  </h2>
                  
                  <p className="text-slate-600 dark:text-slate-400">
                    {post.description}
                  </p>
                </div>
              </Link>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
