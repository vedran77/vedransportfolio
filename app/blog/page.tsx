"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"

// Blog posts data
const posts = [
  {
    slug: "digitalocean-review-2026",
    title: "DigitalOcean Review 2026",
    subtitle: "Is It Still Worth It?",
    description: "Complete breakdown of DigitalOcean's pricing, performance, and features. Plus $200 free credit.",
    date: "Feb 23, 2026",
    category: "Hosting",
    readTime: "5 min read",
    featured: true,
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    slug: "hostinger-vps-review",
    title: "Hostinger VPS Review",
    subtitle: "Budget King?",
    description: "Can Hostinger's cheap VPS compete with the big players? I tested it for 30 days.",
    date: "Feb 23, 2026",
    category: "Hosting",
    readTime: "6 min read",
    featured: false,
    gradient: "from-purple-500 to-pink-500",
  },
  {
    slug: "best-cheap-hosting-developers",
    title: "Best Cheap Hosting",
    subtitle: "For Developers in 2026",
    description: "Comparing DigitalOcean, Hostinger, Vercel, and Railway. Which gives the best value?",
    date: "Feb 23, 2026",
    category: "Guides",
    readTime: "8 min read",
    featured: false,
    gradient: "from-orange-500 to-red-500",
  },
]

export default function BlogPage() {
  const featuredPost = posts.find(p => p.featured)
  const otherPosts = posts.filter(p => !p.featured)

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-black dark:via-slate-950 dark:to-blue-950/20" />
        
        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 dark:bg-blue-400/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 dark:bg-purple-400/5 rounded-full blur-3xl" />

        <div className="relative max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-8"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Portfolio
            </Link>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-block px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium mb-6"
            >
              Developer Resources
            </motion.div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white mb-6">
              The{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                Blog
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Honest reviews, tutorials, and guides for developers. 
              No fluff, just practical insights that help you build better.
            </p>
          </motion.div>

          {/* Featured Post */}
          {featuredPost && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <Link href={`/blog/${featuredPost.slug}`} className="group block">
                <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-1">
                  <div className={`absolute inset-0 bg-gradient-to-br ${featuredPost.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-500`} />
                  
                  <div className="relative rounded-2xl bg-white dark:bg-slate-900 p-8 md:p-12">
                    <div className="flex flex-col md:flex-row md:items-center gap-8">
                      {/* Content */}
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider">
                            Featured
                          </span>
                          <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium">
                            {featuredPost.category}
                          </span>
                        </div>
                        
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {featuredPost.title}
                          <span className="block text-2xl md:text-3xl text-slate-600 dark:text-slate-400 font-normal mt-1">
                            {featuredPost.subtitle}
                          </span>
                        </h2>
                        
                        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                          {featuredPost.description}
                        </p>
                        
                        <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-500">
                          <span>{featuredPost.date}</span>
                          <span>·</span>
                          <span>{featuredPost.readTime}</span>
                        </div>
                        
                        <div className="pt-4">
                          <span className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium group-hover:gap-4 transition-all">
                            Read Article
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                          </span>
                        </div>
                      </div>
                      
                      {/* Visual */}
                      <div className="hidden md:block w-64 h-64 relative">
                        <div className={`absolute inset-0 bg-gradient-to-br ${featuredPost.gradient} rounded-2xl opacity-20`} />
                        <div className="absolute inset-4 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center">
                          <span className="text-6xl">🚀</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      {/* Other Posts */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-2xl font-bold text-slate-900 dark:text-white mb-12"
          >
            More Articles
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {otherPosts.map((post, index) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Link href={`/blog/${post.slug}`} className="group block h-full">
                  <div className="relative h-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5">
                    {/* Gradient accent */}
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${post.gradient} rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity`} />
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <span className="px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium">
                          {post.category}
                        </span>
                        <span className="text-slate-400 dark:text-slate-500 text-sm">
                          {post.readTime}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {post.title}
                        <span className="block text-base text-slate-500 dark:text-slate-400 font-normal">
                          {post.subtitle}
                        </span>
                      </h3>
                      
                      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                        {post.description}
                      </p>
                      
                      <div className="pt-2 flex items-center justify-between">
                        <span className="text-sm text-slate-500 dark:text-slate-500">
                          {post.date}
                        </span>
                        <span className="text-blue-600 dark:text-blue-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                          Read →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-black">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
              Stay Updated
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Get notified when I publish new articles about dev tools, hosting, and building better software.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link
                href="/#contact"
                className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-black rounded-lg font-medium hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
              >
                Get in Touch
              </Link>
              <Link
                href="https://github.com/vedran77"
                target="_blank"
                className="px-8 py-4 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
              >
                Follow on GitHub
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
