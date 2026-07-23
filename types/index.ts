// types/index.ts
export interface SocialLinks {
  github?: string;
  linkedin?: string;
  email?: string;
}

export interface Hero {
  id?: string;
  fullName: string;
  professionalTitle: string;
  tagline: string;
  profileImage: string;
  resumeLink: string;
  githubLink?: string;
  linkedinLink?: string;
  email?: string;
  socialLinks?: SocialLinks;
}

export interface ContactInfo {
  email?: string;
  location?: string;
  phone?: string;
  githubUrl?: string;
  linkedinUrl?: string;
}

export interface About {
  id?: string;
  summary: string;
  careerGoals: string;
  bio: string;
}

export interface Skill {
  id?: string;
  name: string;
  category: 'Frontend' | 'Backend' | 'Machine Learning' | 'Tools';
  proficiency: number;
  icon?: string;
  description?: string;
}

export interface Project {
  id?: string;
  title: string;
  description: string;
  technologies: string[];
  image: string;
  githubLink: string;
  liveLink: string;
  featured: boolean;
  category: string;
}

export interface Experience {
  id?: string;
  role: string;
  company: string;
  duration: string;
  description: string;
  responsibilities: string[];
  location?: string;
  type?: string;
  technologies?: string[];
}

export interface Education {
  id?: string;
  institution: string;
  degree: string;
  year: string;
  description: string;
  location?: string;
}

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  message: string;
  createdAt?: Date;
}
