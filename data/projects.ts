export interface Project {
  id: string
  title: string
  description: string
  imageUrl?: string
  images?: string[] // Multiple images for gallery
  techStack: string[]
  githubUrl?: string
  liveUrl?: string
  featured: boolean
  order: number
}

export const projects: Project[] = [
  {
    id: "nexus",
    title: "Nexus",
    description: "A modern social network platform built with cutting-edge technologies. Features real-time messaging, user profiles, content sharing, and seamless user experience. Designed to connect people and foster meaningful interactions.",
    imageUrl: "/nexus/1.png",
    images: ["/nexus/1.png", "/nexus/2.png", "/nexus/3.png", "/nexus/4.png", "/nexus/5.png", "/nexus/6.png"],
    techStack: ["React", "Next.js", "TypeScript", "Node.js", "Tailwind CSS"],
    githubUrl: "https://github.com/vedran77/nexus",
    liveUrl: undefined,
    featured: true,
    order: 0,
  },
  {
    id: "midnight-studio",
    title: "Midnight Studio",
    description: "A creative digital studio platform showcasing innovative design and development work. Features stunning visuals, smooth animations, and a modern user interface. Built to showcase creative projects and digital artistry.",
    imageUrl: "/midnight-studio/1.png",
    images: ["/midnight-studio/1.png", "/midnight-studio/2.png", "/midnight-studio/3.png", "/midnight-studio/4.png"],
    techStack: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
    githubUrl: "https://github.com/vedran77/midnight-studio",
    liveUrl: undefined,
    featured: true,
    order: 1,
  },
  {
    id: "budgetly",
    title: "Budgetly",
    description: "A comprehensive personal finance management application that helps users track expenses, manage budgets, and achieve financial goals. Features multi-currency support, intuitive transaction tracking, and beautiful minimalist design for seamless financial planning.",
    imageUrl: "/budgetly/1.png",
    images: ["/budgetly/1.png", "/budgetly/2.png", "/budgetly/3.png", "/budgetly/4.png"],
    techStack: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Node.js"],
    githubUrl: "https://github.com/vedran77/budgetly",
    liveUrl: undefined,
    featured: true,
    order: 2,
  },
  // Add more projects below:
  // {
  //   id: "2",
  //   title: "Another Project",
  //   description: "Description...",
  //   imageUrl: "/images/project2.jpg",
  //   techStack: ["Go", "Rust", "PostgreSQL"],
  //   githubUrl: "https://github.com/vedran77/another-repo",
  //   liveUrl: "https://project-demo.com",
  //   featured: false,
  //   order: 1,
  // },
]
