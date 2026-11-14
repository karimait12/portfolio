import { socialLinks, CONTACT_EMAIL } from './links';

export type Social = {
  label: string;
  href: string;
  icon: 'github' | 'linkedin' | 'instagram' | 'twitter' | 'mail' | 'facebook';
};

export const profile = {
  name: 'ABDELKARIM AITYAHIA',
  monoLabel: 'ABDELKARIM AITYAHIA • SOFTWARE DEVELOPER',
  headline: 'BUILDING DIGITAL PRODUCTS WITH CLARITY AND CRAFT.',
  headlineLines: ['BUILDING', 'DIGITAL', 'PRODUCTS.'],
  bio: "I'm Abdelkarim Ait Yahia, a software developer from Morocco who builds fast, accessible web and mobile products. I care about clean interfaces, solid performance, and shipping things that work.",
  email: CONTACT_EMAIL,
  location: 'Somewhere, Earth',
  role: 'Software Developer',
  available: true,
  photo: '/me.png',
  socials: socialLinks as Social[],
};

export const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
];
