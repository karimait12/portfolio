import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, Github, Linkedin, Instagram, Mail, Facebook } from 'lucide-react';
import { profile } from '../../data/profile';

export function Footer() {
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setToast(true);
      setTimeout(() => setCopied(false), 2000);
      setTimeout(() => setToast(false), 2500);
    } catch {
      setToast(true);
      setTimeout(() => setToast(false), 2500);
    }
  };

  const iconMap: Record<string, any> = { github: Github, linkedin: Linkedin, instagram: Instagram, mail: Mail, facebook: Facebook };

  return (
    <footer className="relative px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted">OPEN TO OPPORTUNITIES</p>
        <h2 className="mt-4 font-display leading-[0.9]" style={{ fontSize: 'clamp(3rem, 10vw, 8rem)' }}>
          {profile.name}
        </h2>
        <p className="mt-4 font-mono text-[12px] uppercase tracking-[0.2em] text-muted">
          {profile.role} · {profile.location}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button
            onClick={copyEmail}
            className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em]"
            style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            {profile.email}
          </button>
          <div className="flex items-center gap-2">
            {profile.socials.map((s) => {
              const Icon = iconMap[s.icon] ?? Mail;
              return (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="grid h-10 w-10 place-items-center rounded-full border"
                  style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
                >
                  <Icon size={15} />
                </a>
              );
            })}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t pt-6 md:flex-row md:items-center" style={{ borderColor: 'var(--border)' }}>
          <p className="font-mono text-[11px] text-muted">© {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
          <p className="font-mono text-[11px] text-muted"></p>
        </div>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em]"
            style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
          >
            Email copied
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
}
