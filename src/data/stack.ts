// src/data/stack.ts
import type { IconType } from 'react-icons';
import {
  SiHtml5,
  SiCss,
  SiJavascript,
  SiTypescript,
  SiReact,
  SiTailwindcss,
  SiVite,
  SiFramer,
  SiSupabase,
  SiNodedotjs,
  SiGit,
  SiGithub,
  SiVercel,
} from 'react-icons/si';

export interface StackItem {
  name: string;
  icon: IconType;
}

export const stack: StackItem[] = [
  { name: 'HTML', icon: SiHtml5 },
  { name: 'CSS', icon: SiCss },
  { name: 'JavaScript', icon: SiJavascript },
  { name: 'TypeScript', icon: SiTypescript },
  { name: 'React', icon: SiReact },
  { name: 'Tailwind CSS', icon: SiTailwindcss },
  { name: 'Vite', icon: SiVite },
  { name: 'Motion', icon: SiFramer },
  { name: 'Supabase', icon: SiSupabase },
  { name: 'Node.js', icon: SiNodedotjs },
  { name: 'Git', icon: SiGit },
  { name: 'GitHub', icon: SiGithub },
  { name: 'Vercel', icon: SiVercel },
];