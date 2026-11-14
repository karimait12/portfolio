import { useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Instagram, Send, CheckCircle, AlertCircle, Mail } from 'lucide-react';
import { supabase } from '../../lib/supabase/client';
import { profile } from '../../data/profile';

export function Contact() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [website, setWebsite] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<{ email?: string; message?: string }>({});

  const validate = () => {
    const e: { email?: string; message?: string } = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email.';
    if (message.trim().length < 10) e.message = 'Message must be at least 10 characters.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (status === 'submitting') return;
    if (!validate()) return;
    setStatus('submitting');
    try {
      const name = email.split('@')[0] || 'Visitor';

      const supabasePromise = supabase.from('messages').insert([
        { name, email, message, status: 'new' },
      ]);

      const telegramPromise = fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message, website }),
      });

      const [sbResult, tgResult] = await Promise.allSettled([supabasePromise, telegramPromise]);

      let tgOk = false;
      if (tgResult.status === 'fulfilled') {
        try {
          const data = await tgResult.value.json();
          tgOk = Boolean(data?.ok);
        } catch {
          tgOk = tgResult.value.ok;
        }
      }

      const sbOk = sbResult.status === 'fulfilled' && !sbResult.value.error;

      if (!tgOk && !sbOk) {
        throw new Error('failed');
      }

      setStatus('success');
      setEmail('');
      setMessage('');
      setWebsite('');
      setTimeout(() => setStatus('idle'), 3000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const iconMap: Record<string, any> = { github: Github, linkedin: Linkedin, instagram: Instagram, mail: Mail };

  return (
    <section id="contact" className="relative px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="font-display leading-[0.95]"
          style={{ fontSize: 'clamp(2.5rem, 8vw, 6rem)' }}
        >
          GET IN TOUCH.
        </motion.h2>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {/* left */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col justify-between gap-8"
          >
            <p className="max-w-md text-muted" style={{ fontSize: '1.05rem', lineHeight: 1.6 }}>
              Have a project in mind or just want to say hi? Send a message and I'll get back to you.
            </p>
            <div className="flex items-center gap-3">
              {profile.socials.map((s) => {
                const Icon = iconMap[s.icon] ?? Mail;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="grid h-11 w-11 place-items-center rounded-full border transition-transform hover:-translate-y-1"
                    style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
            </div>
          </motion.div>

          {/* form card */}
          <motion.form
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            onSubmit={handleSubmit}
            className="rounded-3xl border p-6 md:p-8"
            style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
            noValidate
          >
            <div className="space-y-2">
              <label className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border bg-transparent px-4 py-3 outline-none transition-colors focus:border-accent"
                style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
                placeholder="you@example.com"
                aria-invalid={!!errors.email}
              />
              {errors.email && <p className="font-mono text-[11px] text-red-400">{errors.email}</p>}
            </div>
            <div className="mt-5 space-y-2">
              <label className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                className="w-full resize-none rounded-xl border bg-transparent px-4 py-3 outline-none transition-colors focus:border-accent"
                style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
                placeholder="Tell me about your project..."
                aria-invalid={!!errors.message}
              />
              {errors.message && <p className="font-mono text-[11px] text-red-400">{errors.message}</p>}
            </div>
            <input
              type="text"
              name="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, width: 0 }}
            />
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 font-mono text-[12px] uppercase tracking-[0.18em] disabled:opacity-60"
              style={{ background: 'var(--accent)', color: 'var(--accent-contrast)' }}
            >
              {status === 'success' ? (
                <>
                  <CheckCircle size={14} /> Sent
                </>
              ) : status === 'error' ? (
                <>
                  <AlertCircle size={14} /> Try again
                </>
              ) : (
                <>
                  <Send size={14} /> {status === 'submitting' ? 'Sending...' : 'Send'}
                </>
              )}
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
