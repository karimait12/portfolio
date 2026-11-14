import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDown, Download } from 'lucide-react';
import { profile } from '../../data/profile';

const ringText = 'OPEN TO OPPORTUNITIES • ';

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section id="home" className="relative min-h-screen overflow-hidden px-6 pt-28 pb-16">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        {/* photo + ring */}
        <div className="relative mx-auto aspect-square w-[min(78vw,360px)]">
          <motion.div
            className="absolute inset-0"
            animate={reduce ? {} : { rotate: 360 }}
            transition={reduce ? {} : { duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            <svg viewBox="0 0 360 360" className="h-full w-full">
              <defs>
                <path id="ring" d="M 180,180 m -150,0 a 150,150 0 1,1 300,0 a 150,150 0 1,1 -300,0" />
              </defs>
              <text className="fill-muted" style={{ fontSize: 13, letterSpacing: '0.35em', fontFamily: 'JetBrains Mono, monospace' }}>
                <textPath href="#ring">{ringText.repeat(3)}</textPath>
              </text>
            </svg>
          </motion.div>
          <div
            className="absolute inset-[14%] overflow-hidden rounded-full border"
            style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
          >
            <img
              src={profile.photo}
              alt="Abdelkarim Ait Yahia (abdelkarimaityahia)"
              width={360}
              height={360}
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
              }}
            />
            <div className="absolute inset-0 grid place-items-center font-display text-6xl text-muted/40">
              
            </div>
          </div>
        </div>

        {/* text */}
        <div className="text-center lg:text-left">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted"
          >
            {profile.monoLabel}
          </motion.p>

          <h1 className="mt-4 font-display leading-[0.95] tracking-tight" style={{ fontSize: 'clamp(3rem, 8vw, 7rem)' }}>
            <span className="sr-only">Abdelkarim Ait Yahia</span>
            {profile.headlineLines.map((line, i) => (
              <span key={i} className="block overflow-hidden">
                <motion.span
                  className="block"
                  initial={{ y: '110%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: 0.9, delay: 0.15 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-xl text-muted lg:mx-0 mx-auto"
            style={{ fontSize: '1.05rem', lineHeight: 1.6 }}
          >
            {profile.bio}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start"
          >
            <a
              href="#projects"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-mono text-[12px] uppercase tracking-[0.18em] transition-all duration-200 hover:-translate-y-[1px]"
              style={{ background: 'var(--accent)', color: 'var(--accent-contrast)' }}
            >
              See my work <ArrowDown size={14} />
            </a>
            <a
              href={profile.cvUrl}
              className="inline-flex items-center gap-2 rounded-full border px-6 py-3 font-mono text-[12px] uppercase tracking-[0.18em] transition-all duration-200 hover:-translate-y-[1px]"
              style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
            >
              <Download size={14} /> Download CV
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
