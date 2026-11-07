import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { supabase } from '../../lib/supabase/client';
import { experiences as staticExperiences, ExperienceItem } from '../../data/experience';

export function Experience() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'end 0.2'] });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const [items, setItems] = useState<ExperienceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await supabase
          .from('experience')
          .select('*')
          .order('start_date', { ascending: false });
        if (cancelled) return;
        if (error || !data || data.length === 0) {
          setItems(staticExperiences);
        } else {
          const mapped: ExperienceItem[] = data.map((d: any, i: number) => ({
            id: d.id ?? `exp-${i}`,
            company: d.company,
            companyType: d.company_type ?? 'Company',
            role: (d.role ?? '').toUpperCase(),
            start: d.start_date,
            end: d.current ? 'Present' : (d.end_date ?? ''),
            duration: d.duration ?? '',
            description: d.description,
            current: d.current,
          }));
          setItems(mapped);
        }
        setLoading(false);
      } catch {
        if (!cancelled) {
          setItems(staticExperiences);
          setLoading(false);
        }
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <section id="experience" ref={ref} className="relative overflow-hidden px-6 py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-10 select-none text-center font-display leading-none"
        style={{
          fontSize: 'clamp(4rem, 14vw, 12rem)',
          color: 'transparent',
          WebkitTextStroke: '1px var(--border)',
          opacity: 0.5,
        }}
      >
        STUDIES &amp; EXPERIENCES
      </div>

      <div className="relative mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted">02 — Experience</p>
          <h2 className="mt-2 font-display text-4xl md:text-6xl">STUDIES &amp; EXPERIENCES</h2>
        </motion.div>

        <div className="relative pl-8 md:pl-12">
          <div className="absolute left-3 top-0 h-full w-px md:left-5" style={{ background: 'var(--border)' }} />
          <motion.div
            className="absolute left-3 top-0 w-px origin-top md:left-5"
            style={{ scaleY: lineScale, height: '100%', background: 'var(--accent)' }}
          />

          <div className="space-y-8" style={{ maskImage: 'linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)' }}>
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <span className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" style={{ borderColor: 'var(--border)', borderTopColor: 'var(--accent)' }} />
              </div>
            ) : (
              items.map((e, i) => (
              <motion.article
                key={e.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="relative"
              >
                <motion.span
                  initial={{ scale: 0.6, opacity: 0.4 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="absolute -left-[26px] top-6 h-3 w-3 rounded-full md:-left-[34px]"
                  style={{
                    background: 'var(--accent)',
                    boxShadow: '0 0 12px var(--accent)',
                  }}
                />
                <div
                  className="rounded-2xl border p-5 transition-colors hover:-translate-y-1"
                  style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className="rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em]"
                      style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
                    >
                      {e.companyType}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                      {e.start} — {e.end}{e.duration ? ` · ${e.duration}` : ''}
                    </span>
                  </div>
                  <h3 className="mt-3 font-display text-2xl md:text-3xl">{e.company}</h3>
                  <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">{e.role}</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{e.description}</p>
                </div>
              </motion.article>
            )))}
          </div>
        </div>
      </div>
    </section>
  );
}
