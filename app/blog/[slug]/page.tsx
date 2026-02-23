"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { useParams } from "next/navigation"

// Affiliate links
const affiliateLinks = {
  digitalocean: "https://m.do.co/c/2ea01b3d389f",
  hostinger: "https://hostinger.com?REFERRALCODE=ZSFVEDRANHIE",
}

// Blog post content
const postsContent: Record<string, {
  title: string
  date: string
  category: string
  readTime: string
  content: React.ReactNode
}> = {
  "digitalocean-review-2026": {
    title: "DigitalOcean Review 2026: Is It Still Worth It?",
    date: "2026-02-23",
    category: "Hosting",
    readTime: "5 min",
    content: (
      <>
        <p className="lead">
          <strong>TL;DR:</strong> Yes, DigitalOcean remains one of the best choices for developers who want powerful cloud infrastructure without AWS complexity.
        </p>

        <a 
          href={affiliateLinks.digitalocean}
          className="cta-button"
          target="_blank"
          rel="noopener noreferrer"
        >
          🚀 Get $200 Free DigitalOcean Credit
        </a>

        <h2>What is DigitalOcean?</h2>
        <p>
          DigitalOcean is a cloud infrastructure provider designed specifically for developers. Unlike AWS or GCP with their overwhelming dashboards, DO keeps things simple and developer-friendly.
        </p>

        <h2>Pricing Breakdown (2026)</h2>
        <table>
          <thead>
            <tr>
              <th>Droplet Type</th>
              <th>RAM</th>
              <th>CPU</th>
              <th>Storage</th>
              <th>Price/mo</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Basic</td><td>1GB</td><td>1 vCPU</td><td>25GB SSD</td><td>$6</td></tr>
            <tr><td>Basic</td><td>2GB</td><td>1 vCPU</td><td>50GB SSD</td><td>$12</td></tr>
            <tr><td>Basic</td><td>4GB</td><td>2 vCPU</td><td>80GB SSD</td><td>$24</td></tr>
            <tr><td>Premium</td><td>8GB</td><td>4 vCPU</td><td>160GB NVMe</td><td>$48</td></tr>
          </tbody>
        </table>

        <h2>Pros ✅</h2>
        <ul>
          <li><strong>Simple UI</strong> - Deploy a server in 55 seconds</li>
          <li><strong>Transparent pricing</strong> - No surprise bills</li>
          <li><strong>Great documentation</strong> - Best in the industry</li>
          <li><strong>Managed databases</strong> - PostgreSQL, MySQL, Redis</li>
          <li><strong>App Platform</strong> - PaaS for easy deployments</li>
        </ul>

        <h2>Cons ❌</h2>
        <ul>
          <li><strong>No free tier</strong> - Unlike AWS/GCP (but $200 credit helps!)</li>
          <li><strong>Fewer regions</strong> - Can't compete with AWS global reach</li>
          <li><strong>Limited enterprise features</strong></li>
        </ul>

        <h2>My Verdict: 9/10</h2>
        <p>
          After using DigitalOcean for 5+ years, it's still my go-to for hosting. The simplicity, pricing, and developer experience are unmatched.
        </p>

        <a 
          href={affiliateLinks.digitalocean}
          className="cta-button"
          target="_blank"
          rel="noopener noreferrer"
        >
          🚀 Get $200 Free Credit (60 days)
        </a>

        <p className="disclaimer">
          <em>This link gives you $200 credit. Full disclosure: I earn a commission if you become a paying customer, at no extra cost to you.</em>
        </p>
      </>
    ),
  },
  "hostinger-vps-review": {
    title: "Hostinger VPS Review 2026: Budget Hosting King?",
    date: "2026-02-23",
    category: "Hosting",
    readTime: "6 min",
    content: (
      <>
        <p className="lead">
          <strong>TL;DR:</strong> Hostinger offers incredibly cheap VPS hosting that actually performs well. Great for beginners and budget-conscious developers.
        </p>

        <a 
          href={affiliateLinks.hostinger}
          className="cta-button"
          target="_blank"
          rel="noopener noreferrer"
        >
          🔥 Get Hostinger VPS (Up to 75% Off)
        </a>

        <h2>Hostinger VPS Pricing (2026)</h2>
        <p>This is where Hostinger shines - their prices are hard to beat:</p>
        
        <table>
          <thead>
            <tr>
              <th>Plan</th>
              <th>RAM</th>
              <th>CPU</th>
              <th>Storage</th>
              <th>Price/mo</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>KVM 1</td><td>4GB</td><td>1 vCPU</td><td>50GB NVMe</td><td>$5.99</td></tr>
            <tr><td>KVM 2</td><td>8GB</td><td>2 vCPU</td><td>100GB NVMe</td><td>$7.99</td></tr>
            <tr><td>KVM 4</td><td>16GB</td><td>4 vCPU</td><td>200GB NVMe</td><td>$10.99</td></tr>
          </tbody>
        </table>

        <p>Compare that to DigitalOcean's $48/mo for 8GB - Hostinger gives you 16GB for $10.99!</p>

        <h2>Pros ✅</h2>
        <ul>
          <li><strong>Unbeatable prices</strong> - 2-4x cheaper than competitors</li>
          <li><strong>NVMe storage</strong> - Fast SSDs on all plans</li>
          <li><strong>AI assistant</strong> - Helps with server setup</li>
          <li><strong>Free weekly backups</strong></li>
          <li><strong>30-day money back</strong></li>
        </ul>

        <h2>Cons ❌</h2>
        <ul>
          <li><strong>Limited locations</strong> - Only 8 data centers</li>
          <li><strong>No hourly billing</strong></li>
          <li><strong>No managed databases</strong> - DIY only</li>
        </ul>

        <h2>Verdict: 8/10</h2>
        <p>
          Hostinger VPS delivers incredible value. If you're cost-conscious and don't need enterprise features, it's a no-brainer.
        </p>

        <a 
          href={affiliateLinks.hostinger}
          className="cta-button"
          target="_blank"
          rel="noopener noreferrer"
        >
          🔥 Try Hostinger VPS (75% Off)
        </a>

        <p className="disclaimer">
          <em>Affiliate link - I earn a small commission at no extra cost to you.</em>
        </p>
      </>
    ),
  },
  "best-cheap-hosting-developers": {
    title: "Best Cheap Hosting for Developers in 2026",
    date: "2026-02-23",
    category: "Guides",
    readTime: "8 min",
    content: (
      <>
        <p className="lead">
          Looking for affordable hosting that doesn't suck? I've tested all the major platforms so you don't have to.
        </p>

        <h2>Quick Comparison</h2>
        <table>
          <thead>
            <tr>
              <th>Provider</th>
              <th>Starting Price</th>
              <th>Best For</th>
              <th>Free Tier</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Vercel</td><td>Free</td><td>Frontend/Next.js</td><td>✅ Generous</td></tr>
            <tr><td>Railway</td><td>$5/mo</td><td>Full-stack apps</td><td>✅ $5 credit</td></tr>
            <tr><td>Hostinger</td><td>$5.99/mo</td><td>Budget VPS</td><td>❌</td></tr>
            <tr><td>DigitalOcean</td><td>$6/mo</td><td>Serious projects</td><td>❌ ($200 credit)</td></tr>
          </tbody>
        </table>

        <h2>🥈 Hostinger VPS - Best Budget VPS</h2>
        <p><strong>Price:</strong> From $5.99/mo</p>
        <a 
          href={affiliateLinks.hostinger}
          className="cta-button"
          target="_blank"
          rel="noopener noreferrer"
        >
          Get Hostinger (75% Off)
        </a>
        <p>Hostinger gives you a full Linux VPS with root access at prices that seem too good to be true. But it works.</p>

        <h2>🥉 DigitalOcean - Best Overall Value</h2>
        <p><strong>Price:</strong> From $6/mo (+ $200 free credit)</p>
        <a 
          href={affiliateLinks.digitalocean}
          className="cta-button"
          target="_blank"
          rel="noopener noreferrer"
        >
          Get $200 Free Credit
        </a>
        <p>DigitalOcean hits the sweet spot between simplicity and power.</p>

        <h2>My Recommendations</h2>
        <table>
          <thead>
            <tr>
              <th>Your Situation</th>
              <th>My Pick</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Just learning</td><td>Vercel (free)</td></tr>
            <tr><td>Need cheap VPS</td><td>Hostinger</td></tr>
            <tr><td>Building a startup</td><td>DigitalOcean</td></tr>
            <tr><td>Quick prototype</td><td>Railway</td></tr>
          </tbody>
        </table>

        <p className="disclaimer">
          <em>Some links are affiliate links. I only recommend services I personally use and trust.</em>
        </p>
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
      <div className="min-h-screen bg-white dark:bg-black py-32 px-4 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">404</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8">Post not found</p>
          <Link href="/blog" className="text-blue-600 hover:underline">← Back to Blog</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black py-32 px-4 sm:px-6 lg:px-8">
      <motion.article
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl mx-auto"
      >
        <Link 
          href="/blog" 
          className="text-blue-600 dark:text-blue-400 hover:underline mb-8 inline-block"
        >
          ← Back to Blog
        </Link>

        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium">
              {post.category}
            </span>
            <span className="text-slate-400 dark:text-slate-500 text-sm">
              {post.date}
            </span>
            <span className="text-slate-400 dark:text-slate-500 text-sm">
              · {post.readTime}
            </span>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white">
            {post.title}
          </h1>
        </header>

        <div className="prose prose-slate dark:prose-invert prose-lg max-w-none">
          <style jsx global>{`
            .prose .lead {
              font-size: 1.25rem;
              color: #475569;
              margin-bottom: 2rem;
            }
            .dark .prose .lead {
              color: #94a3b8;
            }
            .prose .cta-button {
              display: inline-block;
              background: #2563eb;
              color: white !important;
              padding: 0.75rem 1.5rem;
              border-radius: 0.5rem;
              text-decoration: none !important;
              font-weight: 600;
              margin: 1.5rem 0;
              transition: background 0.2s;
            }
            .prose .cta-button:hover {
              background: #1d4ed8;
            }
            .prose table {
              width: 100%;
              margin: 1.5rem 0;
              border-collapse: collapse;
            }
            .prose th, .prose td {
              padding: 0.75rem;
              border: 1px solid #e2e8f0;
              text-align: left;
            }
            .dark .prose th, .dark .prose td {
              border-color: #334155;
            }
            .prose th {
              background: #f8fafc;
              font-weight: 600;
            }
            .dark .prose th {
              background: #1e293b;
            }
            .prose .disclaimer {
              font-size: 0.875rem;
              color: #64748b;
              margin-top: 2rem;
              padding-top: 1rem;
              border-top: 1px solid #e2e8f0;
            }
            .dark .prose .disclaimer {
              color: #94a3b8;
              border-color: #334155;
            }
          `}</style>
          {post.content}
        </div>
      </motion.article>
    </div>
  )
}
