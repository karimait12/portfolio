export const GITHUB_URL = 'https://github.com/karimait12';
export const LINKEDIN_URL = 'https://ma.linkedin.com/in/abdelkarim-ait-yahia-ba2ab33a7';
export const INSTAGRAM_URL = 'https://www.instagram.com/aityahiae';
export const CONTACT_EMAIL = 'karimaityahia98@gmail.com';
export const EMAIL_URL = `mailto:${CONTACT_EMAIL}`;

export type SocialLink = {
  label: string;
  href: string;
  icon: 'github' | 'linkedin' | 'instagram' | 'mail';
};

export const socialLinks: SocialLink[] = [
  { label: 'GitHub', href: GITHUB_URL, icon: 'github' },
  { label: 'LinkedIn', href: LINKEDIN_URL, icon: 'linkedin' },
  { label: 'Instagram', href: INSTAGRAM_URL, icon: 'instagram' },
  { label: 'Email', href: EMAIL_URL, icon: 'mail' },
];
