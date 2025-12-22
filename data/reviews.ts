export interface Review {
  id: string
  clientName: string
  clientTitle?: string
  rating: number
  comment: string
  projectTitle?: string
  date?: string
  upworkUrl?: string
}

export const reviews: Review[] = [
  {
    id: "1",
    clientName: "Client",
    clientTitle: "Project Owner",
    rating: 5,
    comment: "Literally the best developer that I ever worked with. I can't express how HARDWORKING, fast and kind he is. He is a gem in our community and I will do more projects with him for sure!",
    projectTitle: "UGC Platform - Web App",
    date: "2025-12-21",
    upworkUrl: "https://www.upwork.com/freelancers/~01254b7b5cb0334c27",
  },
  {
    id: "2",
    clientName: "Client",
    clientTitle: "Project Owner",
    rating: 5,
    comment: "Excellent work ethic and speed",
    projectTitle: "GitHub Repository Modification",
    date: "2025-11-23",
    upworkUrl: "https://www.upwork.com/freelancers/~01254b7b5cb0334c27",
  },
  {
    id: "3",
    clientName: "Client",
    clientTitle: "Project Owner",
    rating: 5,
    comment: "Great work",
    projectTitle: "Fasthost - SSL Setup on VPS",
    date: "2025-11-20",
    upworkUrl: "https://www.upwork.com/freelancers/~01254b7b5cb0334c27",
  },
  {
    id: "4",
    clientName: "Client",
    clientTitle: "Project Owner",
    rating: 5,
    comment: "Vedran did an excellent job developing and deploying the Penny Ante Poker Club Tournament Registration web app. He handled everything from admin panel setup to domain configuration, email integrations (Resend and Brevo), and real-time debugging over TeamViewer with great patience and skill. Communication was quick, clear, and proactive — Vedran consistently kept me informed of progress and explained technical details in a way that made sense. He worked efficiently, met every update request, and went above and beyond to ensure the app functioned perfectly across multiple browsers and platforms. I appreciate his professionalism, reliability, and attention to detail. I'd gladly work with Vedran again on future phases of this project. Highly recommended!",
    projectTitle: "HTML App Setup Specialist Needed",
    date: "2025-11-06",
    upworkUrl: "https://www.upwork.com/freelancers/~01254b7b5cb0334c27",
  },
  {
    id: "5",
    clientName: "Client",
    clientTitle: "Project Owner",
    rating: 5,
    comment: "Working with Vedran on the HighHand Pro app was an absolute pleasure. He exceeded my expectations at every stage, from initial concept to the final polished product. Vedran brought my ideas to life with incredible precision, creativity, and attention to detail. He communicates clearly, delivers on time, and always goes the extra mile to make sure every feature works flawlessly. His technical expertise and design sense are both top-notch. The HighHand Pro app turned out beautifully: clean, fast, and exactly how I envisioned it.",
    projectTitle: "Convert HTML Project into a Standalone Desktop App",
    date: "2025-11-04",
    upworkUrl: "https://www.upwork.com/freelancers/~01254b7b5cb0334c27",
  },
]
