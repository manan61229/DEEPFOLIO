
export interface TimelineEvent {
  date: string;
  title: string;
  type: 'Work' | 'Project' | 'Learning' | 'Achievement' | 'Community' | 'Other';
  bullets: string[];
  tags: string[];
  confidence: 'high' | 'medium' | 'low';
  inference_explanation?: string;
}

export interface GenerationOutput {
  timeline: TimelineEvent[];
  needs_user_verification?: { item: string; reason: string }[];
}

// Simple Portfolio Types
export interface WorkExperience {
    title: string;
    company: string;
    date: string;
    bullets: string[];
}
export interface Project {
    title: string;
    date: string;
    description: string;
    tech_stack: string[];
}

export interface Skill {
    category: string;
    list: string[];
}

export interface SimplePortfolioData {
    name: string;
    title: string;
    summary: string;
    experience: WorkExperience[];
    projects: Project[];
    skills: Skill[];
}

// Auth types
export interface User {
  email: string;
  password?: string; // Only used during storage, not in context state
  isGuest?: boolean;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => Promise<User>;
  signup: (email: string, pass: string) => Promise<User>;
  logout: () => void;
  loginAsGuest: () => Promise<User>;
}