import { CircularProgress } from './CircularProgress';
import { motion } from 'framer-motion';
import { Skill as SkillType } from '../../lib/supabase/types';

interface SkillCardProps {
  skill: SkillType;
  delay?: number;
}

export function SkillCard({ skill, delay = 0 }: SkillCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="tech-border bg-slate-50 dark:bg-gray-900/50 border border-slate-200 dark:border-emerald-500/20 p-6 hover:neon-glow transition-all duration-300"
    >
      <div className="flex flex-col items-center">
        <CircularProgress
          percentage={skill.proficiency}
          label={skill.name}
          size={140}
          strokeWidth={12}
        />
        <p className="text-xs text-accent-dim font-mono mt-2 uppercase tracking-wider">
          {skill.category}
        </p>
      </div>
    </motion.div>
  );
}
