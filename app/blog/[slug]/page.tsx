"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { useParams } from "next/navigation"

// Affiliate links config
const affiliateLinks = {
  digitalocean: "https://m.do.co/c/2ea01b3d389f",
  hostinger: "https://hostinger.com?REFERRALCODE=ZSFVEDRANHIE",
}

// CTA Button Component
function CTAButton({ href, children, variant = "primary" }: { href: string; children: React.ReactNode; variant?: "primary" | "secondary" }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold transition-all duration-200 text-sm sm:text-base ${
        variant === "primary"
          ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
          : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700"
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
    </motion.a>
  )
}

// Prose wrapper for article content
function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="prose prose-lg prose-slate dark:prose-invert max-w-none
      prose-headings:font-bold prose-headings:text-slate-900 dark:prose-headings:text-white
      prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6
      prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
      prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-p:leading-relaxed
      prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
      prose-strong:text-slate-900 dark:prose-strong:text-white
      prose-ul:my-6 prose-li:text-slate-600 dark:prose-li:text-slate-300
    ">
      {children}
    </div>
  )
}

// Custom Table component with better styling
function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-8 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
      <table className="w-full text-sm">
        {children}
      </table>
    </div>
  )
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="bg-slate-100 dark:bg-slate-800 px-4 py-3 text-left font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700">
      {children}
    </th>
  )
}

function Td({ children, highlight }: { children: React.ReactNode; highlight?: boolean }) {
  return (
    <td className={`px-4 py-3 border-b border-slate-100 dark:border-slate-800 ${highlight ? 'font-semibold text-green-600 dark:text-green-400' : 'text-slate-600 dark:text-slate-300'}`}>
      {children}
    </td>
  )
}

// Blog post content
const postsContent: Record<string, {
  title: string
  subtitle: string
  date: string
  category: string
  readTime: string
  gradient: string
  content: React.ReactNode
}> = {
  "digitalocean-review-2026": {
    title: "DigitalOcean Review 2026",
    subtitle: "Is It Still Worth It?",
    date: "Feb 23, 2026",
    category: "Hosting",
    readTime: "5 min read",
    gradient: "from-blue-500 to-cyan-500",
    content: (
      <>
        <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
          <strong>TL;DR:</strong> Yes, DigitalOcean remains one of the best choices for developers who want powerful cloud infrastructure without AWS complexity.
        </p>

        <div className="not-prose my-8">
          <CTAButton href={affiliateLinks.digitalocean}>
            🚀 Get $200 Free DigitalOcean Credit
          </CTAButton>
        </div>

        <h2>What is DigitalOcean?</h2>
        <p>
          DigitalOcean is a cloud infrastructure provider designed specifically for developers. Unlike AWS or GCP with their overwhelming dashboards, DO keeps things simple and developer-friendly.
        </p>

        <h2>Pricing Breakdown (2026)</h2>
        <div className="not-prose my-8 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800">
                <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-white">Droplet Type</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-white">RAM</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-white">CPU</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-white">Storage</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-white">Price/mo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50"><td className="px-4 py-3 text-slate-600 dark:text-slate-300">Basic</td><td className="px-4 py-3 text-slate-600 dark:text-slate-300">1GB</td><td className="px-4 py-3 text-slate-600 dark:text-slate-300">1 vCPU</td><td className="px-4 py-3 text-slate-600 dark:text-slate-300">25GB SSD</td><td className="px-4 py-3 font-semibold text-green-600 dark:text-green-400">$6</td></tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50"><td className="px-4 py-3 text-slate-600 dark:text-slate-300">Basic</td><td className="px-4 py-3 text-slate-600 dark:text-slate-300">2GB</td><td className="px-4 py-3 text-slate-600 dark:text-slate-300">1 vCPU</td><td className="px-4 py-3 text-slate-600 dark:text-slate-300">50GB SSD</td><td className="px-4 py-3 font-semibold text-green-600 dark:text-green-400">$12</td></tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50"><td className="px-4 py-3 text-slate-600 dark:text-slate-300">Basic</td><td className="px-4 py-3 text-slate-600 dark:text-slate-300">4GB</td><td className="px-4 py-3 text-slate-600 dark:text-slate-300">2 vCPU</td><td className="px-4 py-3 text-slate-600 dark:text-slate-300">80GB SSD</td><td className="px-4 py-3 font-semibold text-green-600 dark:text-green-400">$24</td></tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50"><td className="px-4 py-3 text-slate-600 dark:text-slate-300">Premium</td><td className="px-4 py-3 text-slate-600 dark:text-slate-300">8GB</td><td className="px-4 py-3 text-slate-600 dark:text-slate-300">4 vCPU</td><td className="px-4 py-3 text-slate-600 dark:text-slate-300">160GB NVMe</td><td className="px-4 py-3 font-semibold text-green-600 dark:text-green-400">$48</td></tr>
            </tbody>
          </table>
        </div>

        <h2>Pros ✅</h2>
        <ul>
          <li><strong>Simple UI</strong> — Deploy a server in 55 seconds</li>
          <li><strong>Transparent pricing</strong> — No surprise bills</li>
          <li><strong>Great documentation</strong> — Best in the industry</li>
          <li><strong>Managed databases</strong> — PostgreSQL, MySQL, Redis</li>
          <li><strong>App Platform</strong> — PaaS for easy deployments</li>
        </ul>

        <h2>Cons ❌</h2>
        <ul>
          <li><strong>No free tier</strong> — Unlike AWS/GCP (but $200 credit helps!)</li>
          <li><strong>Fewer regions</strong> — Can't compete with AWS global reach</li>
          <li><strong>Limited enterprise features</strong></li>
        </ul>

        <h2>Who Should Use DigitalOcean?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 not-prose my-6 sm:my-8">
          <div className="p-4 sm:p-6 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
            <h3 className="font-bold text-green-800 dark:text-green-300 mb-2 sm:mb-3 text-sm sm:text-base">✅ Perfect for:</h3>
            <ul className="space-y-1.5 sm:space-y-2 text-green-700 dark:text-green-400 text-xs sm:text-sm">
              <li>• Indie developers and startups</li>
              <li>• Side projects and MVPs</li>
              <li>• Developers tired of AWS complexity</li>
              <li>• Teams wanting predictable billing</li>
            </ul>
          </div>
          <div className="p-4 sm:p-6 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <h3 className="font-bold text-red-800 dark:text-red-300 mb-2 sm:mb-3 text-sm sm:text-base">❌ Not ideal for:</h3>
            <ul className="space-y-1.5 sm:space-y-2 text-red-700 dark:text-red-400 text-xs sm:text-sm">
              <li>• Enterprise with compliance requirements</li>
              <li>• Need for 20+ global regions</li>
              <li>• Heavy machine learning workloads</li>
            </ul>
          </div>
        </div>

        <h2>My Verdict: 9/10</h2>
        <p>
          After using DigitalOcean for 5+ years, it's still my go-to for hosting. The simplicity, pricing, and developer experience are unmatched.
        </p>

        <div className="not-prose my-8 sm:my-10 p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800">
          <h3 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg mb-2 sm:mb-3">Ready to try it?</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm sm:text-base">Get $200 in free credit to test everything — valid for 60 days.</p>
          <CTAButton href={affiliateLinks.digitalocean}>
            🚀 Claim Your $200 Credit
          </CTAButton>
          <p className="text-xs text-slate-500 dark:text-slate-500 mt-3 sm:mt-4">
            * Affiliate link — I earn a commission if you become a paying customer, at no extra cost to you.
          </p>
        </div>
      </>
    ),
  },
  "hostinger-vps-review": {
    title: "Hostinger VPS Review",
    subtitle: "Budget Hosting King?",
    date: "Feb 23, 2026",
    category: "Hosting",
    readTime: "6 min read",
    gradient: "from-purple-500 to-pink-500",
    content: (
      <>
        <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
          <strong>TL;DR:</strong> Hostinger offers incredibly cheap VPS hosting that actually performs well. Great for beginners and budget-conscious developers.
        </p>

        <div className="not-prose my-8">
          <CTAButton href={affiliateLinks.hostinger}>
            🔥 Get Hostinger VPS (Up to 75% Off)
          </CTAButton>
        </div>

        <h2>Hostinger VPS Pricing (2026)</h2>
        <p>This is where Hostinger shines — their prices are hard to beat:</p>
        
        <div className="not-prose my-8 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800">
                <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-white">Plan</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-white">RAM</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-white">CPU</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-white">Storage</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-white">Price/mo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50"><td className="px-4 py-3 text-slate-600 dark:text-slate-300">KVM 1</td><td className="px-4 py-3 text-slate-600 dark:text-slate-300">4GB</td><td className="px-4 py-3 text-slate-600 dark:text-slate-300">1 vCPU</td><td className="px-4 py-3 text-slate-600 dark:text-slate-300">50GB NVMe</td><td className="px-4 py-3 font-semibold text-green-600 dark:text-green-400">$5.99</td></tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50"><td className="px-4 py-3 text-slate-600 dark:text-slate-300">KVM 2</td><td className="px-4 py-3 text-slate-600 dark:text-slate-300">8GB</td><td className="px-4 py-3 text-slate-600 dark:text-slate-300">2 vCPU</td><td className="px-4 py-3 text-slate-600 dark:text-slate-300">100GB NVMe</td><td className="px-4 py-3 font-semibold text-green-600 dark:text-green-400">$7.99</td></tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50"><td className="px-4 py-3 text-slate-600 dark:text-slate-300">KVM 4</td><td className="px-4 py-3 text-slate-600 dark:text-slate-300">16GB</td><td className="px-4 py-3 text-slate-600 dark:text-slate-300">4 vCPU</td><td className="px-4 py-3 text-slate-600 dark:text-slate-300">200GB NVMe</td><td className="px-4 py-3 font-semibold text-green-600 dark:text-green-400">$10.99</td></tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50"><td className="px-4 py-3 text-slate-600 dark:text-slate-300">KVM 8</td><td className="px-4 py-3 text-slate-600 dark:text-slate-300">32GB</td><td className="px-4 py-3 text-slate-600 dark:text-slate-300">8 vCPU</td><td className="px-4 py-3 text-slate-600 dark:text-slate-300">400GB NVMe</td><td className="px-4 py-3 font-semibold text-green-600 dark:text-green-400">$17.99</td></tr>
            </tbody>
          </table>
        </div>

        <p className="text-lg">
          Compare that to DigitalOcean's $48/mo for 8GB — <strong>Hostinger gives you 16GB for $10.99!</strong>
        </p>

        <h2>Pros ✅</h2>
        <ul>
          <li><strong>Unbeatable prices</strong> — 2-4x cheaper than competitors</li>
          <li><strong>NVMe storage</strong> — Fast SSDs on all plans</li>
          <li><strong>AI assistant</strong> — Helps with server setup</li>
          <li><strong>Free weekly backups</strong></li>
          <li><strong>30-day money back</strong></li>
        </ul>

        <h2>Cons ❌</h2>
        <ul>
          <li><strong>Limited locations</strong> — Only 8 data centers</li>
          <li><strong>No hourly billing</strong> — Monthly minimum</li>
          <li><strong>No managed databases</strong> — DIY only</li>
        </ul>

        <h2>Verdict: 8/10</h2>
        <p>
          Hostinger VPS delivers incredible value. If you're cost-conscious and don't need enterprise features, it's a no-brainer.
        </p>

        <div className="not-prose my-8 sm:my-10 p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800">
          <h3 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg mb-2 sm:mb-3">Ready to save big?</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm sm:text-base">Get up to 75% off Hostinger VPS hosting.</p>
          <CTAButton href={affiliateLinks.hostinger}>
            🔥 Get Hostinger VPS Deal
          </CTAButton>
          <p className="text-xs text-slate-500 dark:text-slate-500 mt-3 sm:mt-4">
            * Affiliate link — I earn a small commission at no extra cost to you.
          </p>
        </div>
      </>
    ),
  },
  "best-cheap-hosting-developers": {
    title: "Best Cheap Hosting",
    subtitle: "For Developers in 2026",
    date: "Feb 23, 2026",
    category: "Guides",
    readTime: "8 min read",
    gradient: "from-orange-500 to-red-500",
    content: (
      <>
        <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
          Looking for affordable hosting that doesn't suck? I've tested all the major platforms so you don't have to.
        </p>

        <h2>Quick Comparison</h2>
        <div className="not-prose my-8 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800">
                <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-white">Provider</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-white">Starting Price</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-white">Best For</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-white">Free Tier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50"><td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">Vercel</td><td className="px-4 py-3 text-slate-600 dark:text-slate-300">Free</td><td className="px-4 py-3 text-slate-600 dark:text-slate-300">Frontend/Next.js</td><td className="px-4 py-3 text-green-600 dark:text-green-400">✅ Generous</td></tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50"><td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">Railway</td><td className="px-4 py-3 text-slate-600 dark:text-slate-300">$5/mo</td><td className="px-4 py-3 text-slate-600 dark:text-slate-300">Full-stack apps</td><td className="px-4 py-3 text-green-600 dark:text-green-400">✅ $5 credit</td></tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50"><td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">Hostinger</td><td className="px-4 py-3 text-slate-600 dark:text-slate-300">$5.99/mo</td><td className="px-4 py-3 text-slate-600 dark:text-slate-300">Budget VPS</td><td className="px-4 py-3 text-slate-400">❌</td></tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50"><td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">DigitalOcean</td><td className="px-4 py-3 text-slate-600 dark:text-slate-300">$6/mo</td><td className="px-4 py-3 text-slate-600 dark:text-slate-300">Serious projects</td><td className="px-4 py-3 text-blue-600 dark:text-blue-400">$200 credit</td></tr>
            </tbody>
          </table>
        </div>

        <h2>🥈 Hostinger VPS — Best Budget VPS</h2>
        <p><strong>Price:</strong> From $5.99/mo</p>
        <div className="not-prose my-6">
          <CTAButton href={affiliateLinks.hostinger} variant="secondary">
            Get Hostinger (75% Off)
          </CTAButton>
        </div>
        <p>Hostinger gives you a full Linux VPS with root access at prices that seem too good to be true. But it works.</p>

        <h2>🥉 DigitalOcean — Best Overall Value</h2>
        <p><strong>Price:</strong> From $6/mo (+ $200 free credit)</p>
        <div className="not-prose my-6">
          <CTAButton href={affiliateLinks.digitalocean}>
            Get $200 Free Credit
          </CTAButton>
        </div>
        <p>DigitalOcean hits the sweet spot between simplicity and power.</p>

        <h2>My Recommendations</h2>
        <div className="not-prose my-8 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800">
                <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-white">Your Situation</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-white">My Pick</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50"><td className="px-4 py-3 text-slate-600 dark:text-slate-300">Just learning</td><td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">Vercel (free)</td></tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50"><td className="px-4 py-3 text-slate-600 dark:text-slate-300">Need cheap VPS</td><td className="px-4 py-3 font-semibold text-purple-600 dark:text-purple-400">Hostinger</td></tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50"><td className="px-4 py-3 text-slate-600 dark:text-slate-300">Building a startup</td><td className="px-4 py-3 font-semibold text-blue-600 dark:text-blue-400">DigitalOcean</td></tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50"><td className="px-4 py-3 text-slate-600 dark:text-slate-300">Quick prototype</td><td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">Railway</td></tr>
            </tbody>
          </table>
        </div>

        <div className="not-prose my-10 p-6 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            * Some links are affiliate links. I only recommend services I personally use and trust.
          </p>
        </div>
      </>
    ),
  },
}

export default function BlogPost() {
  const params = useParams()
  const slug = params.slug as string
  const post = postsContent[slug]

  if (!post) {
    return (
      <div className="min-h-screen bg-white dark:bg-black pt-32 px-4 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-slate-900 dark:text-white mb-4">404</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8">Post not found</p>
          <Link href="/blog" className="text-blue-600 hover:underline">← Back to Blog</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Hero */}
      <section className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${post.gradient} opacity-5`} />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative max-w-3xl mx-auto"
        >
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-8"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Blog
          </Link>

          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider">
              {post.category}
            </span>
            <span className="text-slate-400 dark:text-slate-500 text-sm">
              {post.date}
            </span>
            <span className="text-slate-400 dark:text-slate-500 text-sm">
              · {post.readTime}
            </span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-4">
            {post.title}
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl text-slate-500 dark:text-slate-400">
            {post.subtitle}
          </p>
        </motion.div>
      </section>

      {/* Content */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <motion.article
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <Prose>
            {post.content}
          </Prose>
        </motion.article>
      </section>

      {/* Related Posts CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Enjoyed this article?
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            Check out more developer resources and hosting guides.
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-black rounded-lg font-medium hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
          >
            Browse All Articles
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  )
}
