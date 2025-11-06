# Portfolio Website - Setup Guide

## ✅ Already Configured

- ✅ GitHub: https://github.com/vedran77 (linked in Hero, Contact, and social links)
- ✅ Upwork: https://www.upwork.com/freelancers/~01254b7b5cb0334c27 (linked in Contact, CTA, and Reviews)

## 📝 Adding Your Projects

Edit `data/projects.ts` and add your projects from GitHub:

### Quick Method:
1. Visit https://github.com/vedran77?tab=repositories
2. Open browser console (F12)
3. Copy and paste the code from `scripts/fetch-github-repos.js`
4. Copy the output and update `data/projects.ts`

### Manual Method:
```typescript
{
  id: "unique-id",
  title: "Project Name",
  description: "What the project does, key features, and problems it solves. Be specific and highlight results if possible.",
  imageUrl: "/images/project.jpg", // Optional: add screenshots to /public/images/
  techStack: ["React", "Next.js", "TypeScript", "Node.js"], // List all technologies used
  githubUrl: "https://github.com/vedran77/repo-name",
  liveUrl: "https://your-project.com", // Optional: if deployed
  featured: true, // true for your best projects
  order: 0, // Lower numbers appear first (0, 1, 2, ...)
}
```

**Tips:**
- Add screenshots to `/public/images/` folder
- Write compelling descriptions that highlight value
- Mark your best projects as `featured: true`
- Include live URLs if projects are deployed

## ⭐ Adding Upwork Reviews

Edit `data/reviews.ts` and add reviews from your Upwork profile:

1. Visit https://www.upwork.com/freelancers/~01254b7b5cb0334c27
2. Go to your Reviews/Feedback section
3. Copy reviews and add them to `data/reviews.ts`:

```typescript
{
  id: "unique-id",
  clientName: "Client Name", // Use first name or company name
  clientTitle: "Their Title/Company", // e.g., "CEO, Tech Startup"
  rating: 5, // 1-5 stars
  comment: "Copy the review text from Upwork. Make it compelling and professional.",
  projectTitle: "Project Name", // Optional: what project was this for?
  date: "2024-01-15", // Format: YYYY-MM-DD
  upworkUrl: "https://www.upwork.com/freelancers/~01254b7b5cb0334c27", // Your Upwork profile
}
```

**Important:** 
- Get permission from clients before publishing reviews
- Use professional language
- Include project context when possible

## 🔗 Update Contact Information

Edit `components/Contact.tsx`:
- Update email address: `href="mailto:your.email@example.com"`
- Update LinkedIn/Twitter if you have them

## 📸 Adding Project Images

1. Add screenshots to `/public/images/` folder
2. Reference them in projects: `imageUrl: "/images/project-name.jpg"`

## 🚀 Next Steps

1. ✅ Add your projects to `data/projects.ts`
2. ✅ Add your Upwork reviews to `data/reviews.ts`
3. ✅ Update email address in `components/Contact.tsx`
4. ✅ Add project screenshots
5. ✅ Update stats in Hero section if needed
6. ✅ Customize Services section with your actual offerings

## 💡 Pro Tips

- **Quality over quantity**: Show your best 6-10 projects
- **Tell a story**: Each project should have a clear problem/solution narrative
- **Use real metrics**: "Increased conversion by 40%" is better than "Improved performance"
- **Keep reviews fresh**: Update reviews regularly with new client feedback
- **Add case studies**: For featured projects, consider adding detailed case studies


