// Radio BH Podcast Knowledge Base
// Comprehensive information about shows, episodes, and topics since 1997

export interface PodcastShow {
  id: string;
  name: string;
  description: string;
  category: string;
  hosts: string[];
  startYear: number;
  active: boolean;
  schedule?: string;
}

export interface PodcastEpisode {
  id: string;
  showId: string;
  title: string;
  description: string;
  airDate: string;
  topics: string[];
  guests?: string[];
  duration?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
}

// Radio BH Categories
export const categories: Category[] = [
  {
    id: "tech",
    name: "Technology & Innovation",
    description: "Programming, software development, web technologies, AI, machine learning, and tech trends"
  },
  {
    id: "culture",
    name: "Culture & Society",
    description: "Arts, music, literature, social issues, and cultural movements"
  },
  {
    id: "business",
    name: "Business & Entrepreneurship",
    description: "Startups, business strategies, entrepreneurship, and market trends"
  },
  {
    id: "education",
    name: "Education & Learning",
    description: "Teaching methodologies, online learning, educational technology, and skill development"
  },
  {
    id: "health",
    name: "Health & Wellness",
    description: "Physical health, mental wellness, fitness, nutrition, and lifestyle"
  }
];

// Radio BH Shows
export const shows: PodcastShow[] = [
  {
    id: "code-masters",
    name: "Code Masters",
    description: "Deep dive into software development, programming languages, and best practices with industry experts",
    category: "tech",
    hosts: ["Alex Rodriguez", "Sarah Chen"],
    startYear: 1997,
    active: true,
    schedule: "Weekly on Wednesdays"
  },
  {
    id: "tech-talk",
    name: "Tech Talk Radio",
    description: "Latest technology trends, gadgets, and innovations discussed by passionate tech enthusiasts",
    category: "tech",
    hosts: ["Michael Torres"],
    startYear: 1998,
    active: true,
    schedule: "Bi-weekly on Fridays"
  },
  {
    id: "startup-stories",
    name: "Startup Stories",
    description: "Entrepreneurs share their journey, challenges, and success stories in building companies",
    category: "business",
    hosts: ["Jennifer Park", "David Kim"],
    startYear: 2005,
    active: true,
    schedule: "Weekly on Mondays"
  },
  {
    id: "dev-life",
    name: "Developer Life",
    description: "Real talk about life as a software developer, work-life balance, career growth, and industry insights",
    category: "tech",
    hosts: ["Carlos Martinez", "Emma Johnson"],
    startYear: 2010,
    active: true,
    schedule: "Weekly on Thursdays"
  },
  {
    id: "web-wizards",
    name: "Web Wizards",
    description: "Frontend, backend, and full-stack web development techniques and frameworks",
    category: "tech",
    hosts: ["Lisa Anderson"],
    startYear: 2012,
    active: true,
    schedule: "Weekly on Tuesdays"
  },
  {
    id: "ai-frontiers",
    name: "AI Frontiers",
    description: "Exploring artificial intelligence, machine learning, and the future of intelligent systems",
    category: "tech",
    hosts: ["Dr. Robert Chang", "Nina Patel"],
    startYear: 2016,
    active: true,
    schedule: "Bi-weekly on Wednesdays"
  },
  {
    id: "culture-bytes",
    name: "Culture Bytes",
    description: "Intersection of technology and culture, digital art, and modern society",
    category: "culture",
    hosts: ["Maria Santos", "James Wilson"],
    startYear: 2008,
    active: true,
    schedule: "Monthly"
  },
  {
    id: "learn-hub",
    name: "Learn Hub",
    description: "Educational technology, online learning platforms, and effective teaching strategies",
    category: "education",
    hosts: ["Dr. Amanda Lee"],
    startYear: 2015,
    active: true,
    schedule: "Weekly on Fridays"
  }
];

// Sample Episodes (representing the extensive archive)
export const episodes: PodcastEpisode[] = [
  {
    id: "ep-001",
    showId: "code-masters",
    title: "Introduction to Object-Oriented Programming",
    description: "A comprehensive introduction to OOP principles and their application in modern software development",
    airDate: "1997-03-15",
    topics: ["OOP", "Programming Paradigms", "Software Design"],
    duration: "45 mins"
  },
  {
    id: "ep-150",
    showId: "code-masters",
    title: "Laravel Framework Deep Dive",
    description: "Exploring Laravel's elegant syntax, MVC architecture, and powerful features for PHP development",
    airDate: "2015-06-20",
    topics: ["Laravel", "PHP", "Web Development", "MVC"],
    guests: ["Taylor Otwell"],
    duration: "60 mins"
  },
  {
    id: "ep-300",
    showId: "code-masters",
    title: "TypeScript: The Future of JavaScript",
    description: "Understanding TypeScript's type system and how it improves JavaScript development",
    airDate: "2020-09-10",
    topics: ["TypeScript", "JavaScript", "Type Safety"],
    duration: "55 mins"
  },
  {
    id: "ep-425",
    showId: "code-masters",
    title: "React 18: Concurrent Features and Suspense",
    description: "Exploring React 18's new concurrent rendering features and how they improve user experience",
    airDate: "2023-04-15",
    topics: ["React", "Frontend Development", "Performance"],
    duration: "50 mins"
  },
  {
    id: "ep-456",
    showId: "code-masters",
    title: "Node.js Performance Optimization",
    description: "Best practices for optimizing Node.js applications for scale and performance",
    airDate: "2024-08-22",
    topics: ["Node.js", "Performance", "Backend Development"],
    duration: "58 mins"
  },
  {
    id: "ep-100",
    showId: "web-wizards",
    title: "Modern CSS: Grid and Flexbox Mastery",
    description: "Mastering CSS Grid and Flexbox for responsive web layouts",
    airDate: "2018-05-12",
    topics: ["CSS", "Web Design", "Responsive Design"],
    duration: "42 mins"
  },
  {
    id: "ep-200",
    showId: "ai-frontiers",
    title: "Large Language Models: ChatGPT and Beyond",
    description: "Understanding how large language models work and their impact on AI applications",
    airDate: "2023-02-18",
    topics: ["AI", "LLM", "ChatGPT", "Machine Learning"],
    guests: ["Dr. Emily Watson"],
    duration: "70 mins"
  },
  {
    id: "ep-075",
    showId: "startup-stories",
    title: "From Zero to Series A: A SaaS Journey",
    description: "Founder shares the complete journey of building and scaling a successful SaaS startup",
    airDate: "2022-11-05",
    topics: ["SaaS", "Startups", "Fundraising", "Business Strategy"],
    guests: ["Mike Johnson"],
    duration: "65 mins"
  },
  {
    id: "ep-180",
    showId: "dev-life",
    title: "Remote Work: Tips for Distributed Teams",
    description: "Best practices for working effectively in remote and distributed development teams",
    airDate: "2021-03-20",
    topics: ["Remote Work", "Team Collaboration", "Work-Life Balance"],
    duration: "48 mins"
  },
  {
    id: "ep-025",
    showId: "learn-hub",
    title: "Coding Bootcamps vs Traditional Education",
    description: "Comparing different paths to becoming a software developer",
    airDate: "2019-07-14",
    topics: ["Education", "Career Development", "Coding Bootcamps"],
    duration: "52 mins"
  }
];

// Historic topics covered since 1997
export const historicTopics = [
  // Programming Languages
  "Java", "C++", "Python", "JavaScript", "PHP", "Ruby", "C#", "Go", "Rust", "TypeScript", "Kotlin", "Swift",
  
  // Frameworks & Libraries
  "Laravel", "React", "Vue.js", "Angular", "Django", "Flask", "Express.js", "Spring Boot", "ASP.NET", "Ruby on Rails",
  
  // Web Technologies
  "HTML5", "CSS3", "Sass", "Webpack", "Babel", "REST API", "GraphQL", "WebSockets", "PWA", "Service Workers",
  
  // Databases
  "MySQL", "PostgreSQL", "MongoDB", "Redis", "Elasticsearch", "Oracle", "SQL Server",
  
  // DevOps & Tools
  "Docker", "Kubernetes", "Jenkins", "Git", "CI/CD", "AWS", "Azure", "GCP", "Terraform", "Ansible",
  
  // AI & Machine Learning
  "Machine Learning", "Deep Learning", "Neural Networks", "TensorFlow", "PyTorch", "NLP", "Computer Vision", "LLMs",
  
  // Software Practices
  "Agile", "Scrum", "Test-Driven Development", "Clean Code", "Design Patterns", "Microservices", "Domain-Driven Design",
  
  // Business & Startup
  "Lean Startup", "Product Management", "Growth Hacking", "Fundraising", "Business Models", "SaaS",
  
  // Culture & Society
  "Open Source", "Tech Ethics", "Privacy", "Security", "Digital Transformation", "Remote Work", "Diversity in Tech"
];

// Helper functions for querying the knowledge base
export function getShowById(id: string): PodcastShow | undefined {
  return shows.find(show => show.id === id);
}

export function getShowsByCategory(categoryId: string): PodcastShow[] {
  return shows.filter(show => show.category === categoryId);
}

export function getEpisodeById(id: string): PodcastEpisode | undefined {
  return episodes.find(episode => episode.id === id);
}

export function getEpisodesByShow(showId: string): PodcastEpisode[] {
  return episodes.filter(episode => episode.showId === showId);
}

export function searchEpisodesByTopic(topic: string): PodcastEpisode[] {
  const searchTerm = topic.toLowerCase();
  return episodes.filter(episode => 
    episode.topics.some(t => t.toLowerCase().includes(searchTerm)) ||
    episode.title.toLowerCase().includes(searchTerm) ||
    episode.description.toLowerCase().includes(searchTerm)
  );
}

export function searchEpisodesByKeyword(keyword: string): PodcastEpisode[] {
  const searchTerm = keyword.toLowerCase();
  return episodes.filter(episode => 
    episode.title.toLowerCase().includes(searchTerm) ||
    episode.description.toLowerCase().includes(searchTerm) ||
    episode.topics.some(t => t.toLowerCase().includes(searchTerm))
  );
}

export function getActiveShows(): PodcastShow[] {
  return shows.filter(show => show.active);
}

export function getCategoryById(id: string): Category | undefined {
  return categories.find(cat => cat.id === id);
}
