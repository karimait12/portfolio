import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { navLinks } from '../../data/profile';
import { useTheme } from '../../context/ThemeContext';
import { MobileMenu } from './MobileMenu';

export function Navbar() {
  const { theme, toggle } = useTheme();
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState('#home');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      if (y > 120 && y > lastY) setHidden(true);
      else setHidden(false);
      lastY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const sections = navLinks.map((l) => document.querySelector(l.href));
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const id = '#' + (e.target as HTMLElement).id;
            setActive(id);
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );
    sections.forEach((s) => s && obs.observe(s));
    return () => obs.disconnect();
  }, []);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: hidden ? -120 : 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[min(92vw,720px)]"
    >
      <nav
        className="flex items-center justify-between gap-2 rounded-full border px-3 py-2 backdrop-blur-xl"
        style={{
          background: 'color-mix(in srgb, var(--surface) 70%, transparent)',
          borderColor: 'var(--border)',
        }}
      >
        <a href="#home" className="flex items-center gap-2 pl-2" aria-label="Home">
          <span
            className="grid h-8 w-8 place-items-center rounded-full font-display text-sm"
            style={{ background: 'var(--accent)', color: 'var(--accent-contrast)' }}
          >
            AR
          </span>
        </a>
        <ul className="hidden sm:flex items-center gap-1">
          {navLinks.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="relative rounded-full px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors"
                style={{ color: active === l.href ? 'var(--accent)' : 'var(--muted)' }}
              >
                {active === l.href && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full"
                    style={{ background: 'var(--surface-2)' }}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{l.label}</span>
              </a>
            </li>
          ))}
        </ul>
        <MobileMenu active={active} />
        <button
          onClick={toggle}
          aria-label="Toggle theme"
          className="grid h-8 w-8 place-items-center rounded-full border transition-colors"
          style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
        >
          {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
        </button>
      </nav>
      {scrolled && null}
    </motion.header>
  );
}
