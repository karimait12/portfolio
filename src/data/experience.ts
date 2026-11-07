export type ExperienceItem = {
  id: string;
  company: string;
  companyType: string;
  role: string;
  start: string;
  end: string;
  duration: string;
  description: string;
  current?: boolean;
};

export const experiences: ExperienceItem[] = [
  {
    id: 'exp-1',
    company: 'Acme Corp',
    companyType: 'Product',
    role: 'SENIOR FRONTEND ENGINEER',
    start: 'Jan 2024',
    end: 'Present',
    duration: '1 yr 4 mos',
    description: 'Led the frontend platform, shipping a design system and improving Core Web Vitals across the main product.',
    current: true,
  },
  {
    id: 'exp-2',
    company: 'Studio North',
    companyType: 'Agency',
    role: 'FRONTEND DEVELOPER',
    start: 'Jun 2022',
    end: 'Dec 2023',
    duration: '1 yr 7 mos',
    description: 'Built marketing sites and web apps for clients, focusing on motion, performance, and accessibility.',
  },
  {
    id: 'exp-3',
    company: 'Freelance',
    companyType: 'Independent',
    role: 'WEB DEVELOPER',
    start: 'Jan 2021',
    end: 'May 2022',
    duration: '1 yr 5 mos',
    description: 'Delivered small business websites and landing pages with a focus on conversion and SEO.',
  },
];
