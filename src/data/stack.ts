import {
  SiNextdotjs,
  SiReact,
  SiTailwindcss,
  SiThreedotjs,
  SiGreensock,
  SiFramer,
  SiSupabase,
  SiNodedotjs,
} from 'react-icons/si';
import { ComponentType } from 'react';

export type StackItem = {
  name: string;
  icon: ComponentType<{ size?: number; className?: string }>;
};

export const stack: StackItem[] = [
  { name: 'Next.js', icon: SiNextdotjs },
  { name: 'React Native', icon: SiReact },
  { name: 'Tailwind CSS', icon: SiTailwindcss },
  { name: 'Three.js', icon: SiThreedotjs },
  { name: 'GSAP', icon: SiGreensock },
  { name: 'Motion', icon: SiFramer },
  { name: 'Supabase', icon: SiSupabase },
  { name: 'Node.js', icon: SiNodedotjs },
];
