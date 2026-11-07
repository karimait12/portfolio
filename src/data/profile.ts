export type Social = {
  label: string;
  href: string;
  icon: 'github' | 'linkedin' | 'instagram' | 'twitter' | 'mail';
};

export const profile = {
  name: 'ABDELKARIM AITYAHIA',
  monoLabel: 'ABDELKARIM AITYAHIA • SOFTWARE DEVELOPER',
  headline: 'BUILDING DIGITAL PRODUCTS WITH CLARITY AND CRAFT.',
  headlineLines: ['BUILDING', 'DIGITAL', 'PRODUCTS.'],
  bio: '',
  email: 'karimaityahiaa@gmail.com',
  location: 'Somewhere, Earth',
  role: 'Software Developer',
  available: true,
  cvUrl: '/cv.pdf',
  photo: '/me.png',
  socials: [
    { label: 'GitHub', href: 'https://github.com/karimait16', icon: 'github' },
    { label: 'LinkedIn', href: 'https://ma.linkedin.com/in/abdelkarim-ait-yahia-ba2ab33a7', icon: 'linkedin' },
    { label: 'Instagram', href: 'https://www.instagram.com/aityahiae', icon: 'instagram' },
  ] as Social[],
};

export const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
];
