// Helper script to fetch GitHub repositories
// Run this in browser console on https://github.com/vedran77?tab=repositories
// Copy the output and paste into data/projects.ts

const repos = Array.from(document.querySelectorAll('[itemprop="name codeRepository"]'))
  .map((repo, index) => {
    const name = repo.textContent.trim()
    const url = repo.closest('a')?.href || ''
    const description = repo.closest('div')?.querySelector('[itemprop="description"]')?.textContent?.trim() || ''
    
    return {
      id: `repo-${index + 1}`,
      title: name,
      description: description || `A ${name} project showcasing modern web development practices.`,
      imageUrl: undefined,
      techStack: ["React", "TypeScript"], // Update manually based on repo
      githubUrl: url,
      liveUrl: undefined, // Add if deployed
      featured: index < 3, // First 3 are featured
      order: index,
    }
  })

console.log(JSON.stringify(repos, null, 2))

