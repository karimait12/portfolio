export type ProjectItem = {
  id: string;
  index: string;
  title: string;
  description: string;
  tags: string[];
  liveUrl: string;
  repoUrl: string;
  image: string;
  tint: string;
};

export const projects: ProjectItem[] = [
  {
    id: 'proj-1',
    index: '01 / 04',
    title: 'PROJECT ONE',
    description: 'A short two-to-three line description of the project, the problem it solves, and the outcome. Replace with real copy.',
    tags: ['React', 'TypeScript', 'Tailwind'],
    liveUrl: 'https://example.com',
    repoUrl: 'https://github.com/',
    image: '/projects/1.jpg',
    tint: 'from-white/10 to-white/0',
  },
  {
    id: 'proj-2',
    index: '02 / 04',
    title: 'PROJECT TWO',
    description: 'Another project description placeholder. Mention the stack, the challenge, and what shipped.',
    tags: ['Next.js', 'Framer Motion', 'Supabase'],
    liveUrl: 'https://example.com',
    repoUrl: 'https://github.com/',
    image: '/projects/2.jpg',
    tint: 'from-white/8 to-white/0',
  },
  {
    id: 'proj-3',
    index: '03 / 04',
    title: 'PROJECT THREE',
    description: 'Third project placeholder copy. Keep it concise and outcome-focused.',
    tags: ['Node', 'Postgres', 'Docker'],
    liveUrl: 'https://example.com',
    repoUrl: 'https://github.com/',
    image: '/projects/3.jpg',
    tint: 'from-white/6 to-white/0',
  },
  {
    id: 'proj-4',
    index: '04 / 04',
    title: 'PROJECT FOUR',
    description: 'Final project placeholder. Replace image, links, and tags with real data.',
    tags: ['Vite', 'React', 'Lenis'],
    liveUrl: 'https://example.com',
    repoUrl: 'https://github.com/',
    image: '/projects/4.jpg',
    tint: 'from-white/5 to-white/0',
  },
];
