import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';
import { Experience as ExperienceType } from '../../lib/supabase/types';

interface ExperienceTimelineProps {
  experiences: ExperienceType[];
}

export function ExperienceTimeline({ experiences }: ExperienceTimelineProps) {
  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-4 top-0 bottom-0 w-px bg-accent-dim" />

      <div className="space-y-8">
        {experiences.map((exp, index) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative pl-12"
          >
            {/* Timeline dot */}
            <div className="absolute left-2 top-1 w-4 h-4 bg-slate-50 dark:bg-gray-900/50 border-2 border-accent rounded-full neon-glow flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-accent rounded-full" />
            </div>

            <div className="tech-border bg-slate-50 dark:bg-gray-900/50 border border-slate-200 dark:border-emerald-500/20 p-6 hover:neon-glow transition-all duration-300">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <Briefcase size={20} className="text-accent" />
                  <h3 className="text-lg font-bold text-accent">{exp.role}</h3>
                </div>
                <span className="text-xs font-mono text-gray-600 dark:text-gray-600 dark:text-gray-400">
                  {exp.start_date} - {exp.current ? 'Present' : exp.end_date}
                </span>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 font-mono mb-2">{exp.company}</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-mono">{exp.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
