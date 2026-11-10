import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Instagram, Youtube, Music2, Newspaper, ArrowUpRight, ArrowRight } from 'lucide-react';

const TAGLINE = 'Everything I know, shared for free. When you need it applied to your own situation, we sit down together.';

type LinkItem = {
  title: string;
  subtitle: string;
  href: string;
  icon: 'instagram' | 'youtube' | 'tiktok' | 'substack' | 'karim';
};

const LINKS: LinkItem[] = [
  { title: 'Instagram', subtitle: '@karimaityahia', href: '#', icon: 'instagram' },
  { title: 'YouTube', subtitle: '@karimaityahia', href: '#', icon: 'youtube' },
  { title: 'TikTok', subtitle: '@karimaityahia', href: '#', icon: 'tiktok' },
  { title: 'karim', subtitle: 'Free tools for your investing journey', href: '/', icon: 'karim' },
];

const CTA = {
  label: 'Book a Consultation',
  subtitle: '60 minutes, one to one',
  href: '#',
};

function IconFor({ kind }: { kind: LinkItem['icon'] }) {
  if (kind === 'instagram') return <Instagram size={20} aria-hidden="true" />;
  if (kind === 'youtube') return <Youtube size={20} aria-hidden="true" />;
  if (kind === 'tiktok') return <Music2 size={20} aria-hidden="true" />;
  if (kind === 'substack') return <Newspaper size={20} aria-hidden="true" />;
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      <text x="10" y="15" textAnchor="middle" fontSize="16" fontWeight="700" fill="#16a34a" fontFamily="system-ui, sans-serif">ζ</text>
    </svg>
  );
}

export default function Links() {
  const reduce = useReducedMotion();
  const [logoExists, setLogoExists] = useState(false);

  useEffect(() => {
    // load font only for this page
    if (!document.querySelector('link[data-links-font]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap';
      link.setAttribute('data-links-font', 'true');
      document.head.appendChild(link);
    }
    // check logo
    const img = new Image();
    img.onload = () => setLogoExists(true);
    img.onerror = () => setLogoExists(false);
    img.src = '/links-logo.svg';

    // metadata
    document.title = 'karimaityahia';
    const setMeta = (name: string, content: string, attr = 'name') => {
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };
    setMeta('description', TAGLINE);
    setMeta('og:title', 'karimaityahia', 'property');
    setMeta('og:description', TAGLINE, 'property');
    setMeta('og:type', 'website', 'property');
  }, []);

  const fadeUp = reduce
    ? {}
    : { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } };

  return (
    <div
      className="min-h-screen"
      style={{ background: '#0f1114', color: '#ffffff', fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif' }}
    >
      <div className="mx-auto w-full max-w-[416px] px-4 pt-10 pb-10 text-center">
        <motion.header {...fadeUp} className="flex flex-col items-center">
          <div className="flex items-center gap-2">
            {logoExists && <img src="/links-logo.svg" alt="" width={40} height={40} />}
            <span className="text-[36px] font-bold tracking-tight text-white">karimaityahia</span>
          </div>
          <p className="mt-6 max-w-full text-[16px] leading-[1.5]" style={{ color: '#9ca3af' }}>
            {TAGLINE}
          </p>
        </motion.header>

        <motion.div
          {...(reduce ? {} : { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4, delay: 0.06, ease: [0.22, 1, 0.36, 1] } })}
          className="mt-9 flex flex-col gap-3"
        >
          {LINKS.map((link, i) => (
            <motion.a
              key={link.title}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${link.title}: ${link.subtitle}`}
              {...(reduce ? {} : { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4, delay: 0.12 + i * 0.06, ease: [0.22, 1, 0.36, 1] } })}
              className="group flex h-[74px] items-center justify-between rounded-[16px] border px-5 transition-all duration-150 hover:-translate-y-0"
              style={{ background: '#1b1e22', borderColor: '#2a2e33' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#3a3f46';
                e.currentTarget.style.background = '#20242a';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#2a2e33';
                e.currentTarget.style.background = '#1b1e22';
              }}
            >
              <div className="flex items-center gap-4">
                <span style={{ color: '#9ca3af' }}>
                  <IconFor kind={link.icon} />
                </span>
                <div className="text-left">
                  <div className="text-[16px] font-semibold text-white">{link.title}</div>
                  <div className="text-[13px]" style={{ color: '#8b9099' }}>{link.subtitle}</div>
                </div>
              </div>
              <ArrowUpRight size={16} className="transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" style={{ color: '#9ca3af' }} />
            </motion.a>
          ))}
        </motion.div>

        <motion.a
          href={CTA.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${CTA.label}: ${CTA.subtitle}`}
          {...(reduce ? {} : { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4, delay: 0.36, ease: [0.22, 1, 0.36, 1] } })}
          className="mt-6 flex h-[74px] items-center justify-between rounded-[16px] px-5 transition-all duration-150 hover:scale-[1.01]"
          style={{ background: '#fafafa' }}
        >
          <div className="text-left">
            <div className="text-[16px] font-semibold" style={{ color: '#0f1114' }}>{CTA.label}</div>
            <div className="text-[13px]" style={{ color: '#6b7280' }}>{CTA.subtitle}</div>
          </div>
          <ArrowRight size={16} className="transition-transform duration-150 group-hover:translate-x-0.5" style={{ color: '#0f1114' }} />
        </motion.a>

        <motion.footer
          {...(reduce ? {} : { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4, delay: 0.42, ease: [0.22, 1, 0.36, 1] } })}
          className="mt-12 pb-10 text-center text-[13px] font-medium"
          style={{ color: '#9ca3af' }}
        >
          © {new Date().getFullYear()} karimaityahia
        </motion.footer>
      </div>
    </div>
  );
}
