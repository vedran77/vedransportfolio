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
  // Add your Upwork reviews here
  // Visit https://www.upwork.com/freelancers/~01254b7b5cb0334c27 to see your reviews
  // Copy reviews from your Upwork profile and add them here
  // Example structure:
  {
    id: "1",
    clientName: "Client Name",
    clientTitle: "Their Title/Company",
    rating: 5,
    comment: "Copy the review text from Upwork here. Make sure to get permission from clients before publishing their reviews.",
    projectTitle: "Project Name",
    date: "2024-01-15", // Format: YYYY-MM-DD
    upworkUrl: "https://www.upwork.com/freelancers/~01254b7b5cb0334c27", // Link to your Upwork profile
  },
  // Add more reviews below:
  // {
  //   id: "2",
  //   clientName: "Another Client",
  //   clientTitle: "CEO, Company Name",
  //   rating: 5,
  //   comment: "Review text...",
  //   projectTitle: "Project Name",
  //   date: "2024-02-20",
  //   upworkUrl: "https://www.upwork.com/freelancers/~01254b7b5cb0334c27",
  // },
]
