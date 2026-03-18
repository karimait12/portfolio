export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  github_url?: string;
  live_url?: string;
  image_url?: string;
  featured: boolean;
  created_at: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  icon?: string;
  order: number;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  description: string;
  start_date: string;
  end_date?: string;
  current: boolean;
  logo_url?: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  status: string;
  created_at: string;
}
