export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category: string;
  technology: string;
  buildVolume: string;
  layerResolution: string;
  price: number;
  image: string;
  images: string[];
  badges: string[];
  specifications: Record<string, string>;
  features: string[];
  description: string;
  shortDescription: string;
  downloads: { name: string; url: string }[];
  warranty: string;
  relatedProducts: string[];
  faqs: { question: string; answer: string }[];
  inStock: boolean;
  featured: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  image: string;
  productCount: number;
}

export interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  icon: string;
  image: string;
  features: string[];
  process: { step: number; title: string; description: string }[];
  pricing: { tier: string; description: string; price: string }[];
  deliverables: string[];
  turnaround: string;
}

export interface Material {
  id: string;
  name: string;
  slug: string;
  type: 'filament' | 'resin';
  description: string;
  properties: {
    strength: number;
    flexibility: number;
    durability: number;
    difficulty: number;
  };
  printSettings: {
    nozzleTemp: string;
    bedTemp: string;
    printSpeed: string;
    cooling: string;
  };
  applications: string[];
  advantages: string[];
  image: string;
  color: string;
}

export interface Industry {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  image: string;
  applications: string[];
  stats: { label: string; value: string }[];
}

export interface PortfolioProject {
  id: string;
  title: string;
  slug: string;
  client: string;
  industry: string;
  service: string;
  description: string;
  challenge: string;
  solution: string;
  results: string[];
  images: string[];
  duration: string;
  testimonial?: { quote: string; author: string; position: string };
  featured: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: { name: string; avatar: string; role: string };
  category: string;
  tags: string[];
  image: string;
  publishedAt: string;
  readingTime: number;
  featured: boolean;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  position: string;
  company: string;
  avatar: string;
  rating: number;
}

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  bio: string;
  image: string;
  social: { linkedin?: string; twitter?: string };
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface ContactInfo {
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  email: string;
  hours: { day: string; hours: string }[];
  social: { platform: string; url: string }[];
}
