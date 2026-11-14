import { useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  Github,
  Globe,
  Instagram,
  Linkedin,
  Mail,
  Moon,
  Facebook,
  Music2,
  Sun,
  Twitter,
  Youtube,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { profile, type Social } from '../data/profile';

const TAGLINE = profile.bio;

type LinkItem = {
  title: string;
  subtitle: string;
  href: string;
  icon: LucideIcon;
};

const iconBySocial: Record<string, LucideIcon> = {
  github: Github,
  linkedin: Linkedin,
  instagram: Instagram,
  twitter: Twitter,
  x: Twitter,
  mail: Mail,
  facebook: Facebook,
  youtube: Youtube,
  tiktok: Music2,
  website: Globe,
};

const subtitleFor = (social: Social) => {
  if (social.icon === 'mail') return social.href.replace(/^mailto:/, '');
  if (social.icon === 'linkedin') return profile.role;
  if (social.icon === 'website') return social.href.replace(/^https?:\/\//, '').replace(/\/+$/, '');
  const clean = social.href.split(/[?#]/)[0].replace(/\/+$/, '');
  const slug = clean.split('/').pop() ?? social.href;
  return slug.startsWith('@') ? slug : `@${slug}`;
};

const hasEmailSocial = profile.socials.some((social) => social.icon === 'mail');

const LINKS: LinkItem[] = [
  ...profile.socials.map((social) => ({
    title: social.label,
    subtitle: subtitleFor(social),
    href: social.href,
    icon: iconBySocial[social.icon] ?? Globe,
  })),
  ...(!hasEmailSocial && profile.email
    ? [
        {
          title: 'Email',
          subtitle: profile.email,
          href: `mailto:${profile.email}`,
          icon: Mail,
        },
      ]
    : []),
];

const CTA = { label: 'Get in touch', subtitle: profile.email, href: `mailto:${profile.email}` };

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function Links() {
  const reduce = useReducedMotion();
  const { theme, toggle } = useTheme();

  useEffect(() => {
    const origin = window.location.origin;
    const previousTitle = document.title;
    const metaSnapshots: Array<{ el: HTMLMetaElement; content: string | null; existed: boolean }> = [];

    const setMeta = (attr: 'name' | 'property', key: string, content: string) => {
      let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
      const existed = Boolean(el);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      metaSnapshots.push({ el, content: el.getAttribute('content'), existed });
      el.setAttribute('content', content);
    };

    const canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const canonicalExisted = Boolean(canonical);
    const previousCanonical = canonical?.getAttribute('href') ?? null;
    let canonicalEl = canonical;
    if (!canonicalEl) {
      canonicalEl = document.createElement('link');
      canonicalEl.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.setAttribute('href', `${origin}/links`);

    document.title = profile.name;
    setMeta('name', 'description', TAGLINE);
    setMeta('property', 'og:title', profile.name);
    setMeta('property', 'og:description', TAGLINE);
    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:url', `${origin}/links`);
    setMeta('property', 'og:site_name', profile.name);
    setMeta('name', 'twitter:title', profile.name);
    setMeta('name', 'twitter:description', TAGLINE);

    return () => {
      document.title = previousTitle;
      for (const snapshot of metaSnapshots) {
        if (snapshot.existed && snapshot.content !== null) {
          snapshot.el.setAttribute('content', snapshot.content);
        } else if (snapshot.existed) {
          snapshot.el.removeAttribute('content');
        } else {
          snapshot.el.remove();
        }
      }
      if (canonicalEl) {
        if (canonicalExisted && previousCanonical !== null) {
          canonicalEl.setAttribute('href', previousCanonical);
        } else if (!canonicalExisted) {
          canonicalEl.remove();
        }
      }
    };
  }, []);

  const fadeUp = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: EASE },
      };

  const cardMotion = (index: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay: 0.1 + index * 0.06, ease: EASE },
        };

  const ctaDelay = 0.1 + LINKS.length * 0.06;
  const footerDelay = ctaDelay + 0.06;

  return (
    <div className="min-h-screen font-sans text-text">
      <button
        type="button"
        onClick={toggle}
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
        className="fixed right-4 top-4 z-20 grid h-8 w-8 place-items-center rounded-full border border-border text-text transition-colors hover:bg-surface-2 focus-visible:rounded-full"
      >
        {theme === 'dark' ? <Sun size={14} aria-hidden="true" /> : <Moon size={14} aria-hidden="true" />}
      </button>

      <main className="mx-auto w-full max-w-[416px] px-4 pt-10 text-center">
        <motion.header {...fadeUp} className="flex flex-col items-center">
          <h1 className="font-display text-[clamp(20px,6.5vw,32px)] leading-tight tracking-tight text-text text-balance">
            {profile.name}
          </h1>
          <p className="mt-6 text-base leading-normal text-muted">{TAGLINE}</p>
        </motion.header>

        <div className="mt-9 flex flex-col gap-3">
          {LINKS.map((link, index) => {
            const Icon = link.icon;
            return (
              <motion.a
                key={link.title}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${link.title}: ${link.subtitle}`}
                {...cardMotion(index)}
                className="group flex h-[74px] items-center justify-between rounded-2xl border border-border bg-surface px-5 text-left transition-colors duration-150 hover:border-accent/30 hover:bg-surface-2 focus-visible:rounded-2xl"
              >
                <span className="flex min-w-0 items-center gap-4">
                  <Icon size={20} aria-hidden="true" className="shrink-0 text-muted" />
                  <span className="min-w-0">
                    <span className="block truncate text-base font-semibold text-text">{link.title}</span>
                    <span className="block truncate text-[13px] text-muted">{link.subtitle}</span>
                  </span>
                </span>
                <ArrowUpRight
                  size={16}
                  aria-hidden="true"
                  className="ml-3 shrink-0 text-muted transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </motion.a>
            );
          })}
        </div>

        <motion.a
          href={CTA.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${CTA.label}: ${CTA.subtitle}`}
          {...(reduce
            ? {}
            : {
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.6, delay: ctaDelay, ease: EASE },
              })}
          className="group mt-6 flex h-[74px] items-center justify-between rounded-2xl bg-accent px-5 text-left transition-transform duration-150 hover:scale-[1.01] focus-visible:rounded-2xl"
        >
          <span className="min-w-0">
            <span className="block text-base font-semibold text-accent-contrast">{CTA.label}</span>
            <span className="block text-[13px] text-accent-contrast/60">{CTA.subtitle}</span>
          </span>
          <ArrowRight
            size={16}
            aria-hidden="true"
            className="ml-3 shrink-0 text-accent-contrast transition-transform duration-150 group-hover:translate-x-0.5"
          />
        </motion.a>

        <motion.footer
          {...(reduce
            ? {}
            : {
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.6, delay: footerDelay, ease: EASE },
              })}
          className="mt-12 pb-10 text-center text-[13px] font-medium text-muted"
        >
          © {new Date().getFullYear()} {profile.name}
        </motion.footer>
      </main>
    </div>
  );
}
