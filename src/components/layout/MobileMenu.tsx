import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { navLinks } from '../../data/profile';

export function MobileMenu({ active }: { active: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="sm:hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle menu"
        className="grid h-8 w-8 place-items-center rounded-full border"
        style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
      >
        {open ? <X size={14} /> : <Menu size={14} />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute left-0 right-0 top-full mt-2 rounded-2xl border p-3 backdrop-blur-xl"
            style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
          >
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block rounded-xl px-3 py-2 font-mono text-[11px] uppercase tracking-[0.18em]"
                style={{ color: active === l.href ? 'var(--accent)' : 'var(--muted)' }}
              >
                {l.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
