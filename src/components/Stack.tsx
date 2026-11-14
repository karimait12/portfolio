import { motion } from 'framer-motion';
import { stack } from '../data/stack';

const REPEAT = 4;
const groupItems = Array.from({ length: REPEAT }, () => stack).flat();

export function Stack() {
  return (
    <section id="stack" className="px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="text-center"
      >
        <h2 className="font-display text-4xl md:text-6xl" style={{ color: 'var(--accent)' }}>
          THE STACK
        </h2>
        <p className="mx-auto mt-4 max-w-[560px] text-muted" style={{ lineHeight: 1.6 }}>
          The tools I reach for.
        </p>
      </motion.div>

      <div
        className="stack-fade mt-12 overflow-hidden"
        style={{
          maskImage: 'linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)',
        }}
      >
        <div className="stack-track flex w-max items-center">
          <div className="stack-group flex shrink-0 items-center gap-12 pr-12">
            {groupItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={`a-${item.name}-${i}`}
                  className="group flex flex-col items-center gap-3 transition-transform duration-200 hover:-translate-y-1"
                >
                  <Icon aria-hidden="true" focusable="false" className="h-11 w-11 text-muted transition-colors duration-200 group-hover:text-text md:h-14 md:w-14" />
                  <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted transition-colors duration-200 group-hover:text-text md:text-[12px]">
                    {item.name}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="stack-group flex shrink-0 items-center gap-12 pr-12" aria-hidden="true">
            {groupItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={`b-${item.name}-${i}`}
                  className="group flex flex-col items-center gap-3 transition-transform duration-200 hover:-translate-y-1"
                >
                  <Icon aria-hidden="true" focusable="false" className="h-11 w-11 text-muted transition-colors duration-200 group-hover:text-text md:h-14 md:w-14" />
                  <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted transition-colors duration-200 group-hover:text-text md:text-[12px]">
                    {item.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
