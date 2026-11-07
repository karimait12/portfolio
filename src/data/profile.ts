export type Social = {
  label: string;
  href: string;
  icon: 'github' | 'linkedin' | 'instagram' | 'twitter' | 'mail';
};

export const profile = {
  name: 'ALEX RIVERA',
  monoLabel: 'ALEX RIVERA • SOFTWARE DEVELOPER',
  headline: 'BUILDING DIGITAL PRODUCTS WITH CLARITY AND CRAFT.',
  headlineLines: ['BUILDING', 'DIGITAL', 'PRODUCTS.'],
  bio: 'I design and build fast, accessible web experiences. Placeholder bio — replace with your own story, focus areas, and the kind of work you want to be hired for.',
  email: 'hello@example.com',
  location: 'Somewhere, Earth',
  role: 'Software Developer',
  available: true,
  cvUrl: '/cv.pdf',
  photo: '/me.jpg',
  socials: [
    { label: 'GitHub', href: 'https://github.com/', icon: 'github' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/', icon: 'linkedin' },
    { label: 'Instagram', href: 'https://www.instagram.com/', icon: 'instagram' },
  ] as Social[],
};

export const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
];
