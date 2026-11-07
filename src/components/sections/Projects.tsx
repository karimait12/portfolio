import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, Github } from 'lucide-react';
import { supabase } from '../../lib/supabase/client';
import { projects as staticProjects, ProjectItem } from '../../data/projects';

function ProjectCard({ project, index, total, progress }: { project: ProjectItem; index: number; total: number; progress: ReturnType<typeof useScroll>['scrollYProgress'] }) {
  const isLast = index === total - 1;
  const start = index / total;
  const input = isLast ? [0, 1] : [start, 1];
  const outputScale = isLast ? [1, 1] : [1, 0.94];
  const outputOpacity = isLast ? [1, 1] : [1, 0.6];
  const scale = useTransform(progress, input, outputScale);
  const opacity = useTransform(progress, input, outputOpacity);

  return (
    <motion.article
      style={{
        scale,
        opacity,
        top: 96 + index * 16,
        zIndex: index + 1,
        transformOrigin: 'top center',
      }}
      className="sticky mb-6 min-h-[70vh] overflow-hidden rounded-3xl border"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className="relative grid gap-0 md:grid-cols-2"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
      >
        <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${project.tint}`} />
        <div className="relative aspect-[4/3] overflow-hidden md:aspect-auto">
          <div
            className={`absolute inset-0 bg-gradient-to-br ${project.tint}`}
            style={{ background: 'var(--surface-2)' }}
          />
          <motion.img
            src={project.image}
            alt={project.title}
            className="absolute inset-0 h-full w-full object-cover"
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
        <div className="flex flex-col justify-between gap-6 p-6 md:p-8">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted">{project.index}</p>
            <h3 className="mt-3 font-display text-3xl md:text-4xl">{project.title}</h3>
            <p className="mt-4 text-sm leading-relaxed text-muted">{project.description}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {project.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em]"
                  style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em]"
              style={{ background: 'var(--accent)', color: 'var(--accent-contrast)' }}
            >
              See live <ArrowUpRight size={13} />
            </a>
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub repository"
              className="grid h-10 w-10 place-items-center rounded-full border"
              style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
            >
              <Github size={15} />
            </a>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export function Projects() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const [items, setItems] = useState<ProjectItem[]>(staticProjects);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
        if (cancelled || error || !data || data.length === 0) return;
        const mapped: ProjectItem[] = data.map((d: any, i: number) => ({
          id: d.id ?? `proj-${i}`,
          index: `${String(i + 1).padStart(2, '0')} / ${String(data.length).padStart(2, '0')}`,
          title: (d.title ?? '').toUpperCase(),
          description: d.description ?? '',
          tags: d.tags ?? [],
          liveUrl: d.live_url ?? '#',
          repoUrl: d.github_url ?? '#',
          image: d.image_url ?? `/projects/${i + 1}.jpg`,
          tint: ['from-white/10 to-white/0', 'from-white/8 to-white/0', 'from-white/6 to-white/0', 'from-white/5 to-white/0'][i % 4],
        }));
        setItems(mapped);
      } catch {
        /* keep static fallback */
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <section id="projects" ref={ref} className="relative px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted">03 — Projects</p>
          <h2 className="mt-2 font-display text-4xl md:text-6xl">SELECTED WORK</h2>
        </motion.div>

        <div className="relative">
          {items.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} total={items.length} progress={scrollYProgress} />
          ))}
        </div>
      </div>
    </section>
  );
}
