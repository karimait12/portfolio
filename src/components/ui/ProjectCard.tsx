import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import { Project as ProjectType } from '../../lib/supabase/types';

interface ProjectCardProps {
  project: ProjectType;
  delay?: number;
}

export function ProjectCard({ project, delay = 0 }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="tech-border bg-background/50 p-6 hover:neon-glow transition-all duration-300 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-accent rounded-full neon-glow" />
          <span className="text-accent font-mono text-sm">{project.featured ? 'FEATURED' : 'PROJECT'}</span>
        </div>
        <div className="flex items-center gap-3">
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noreferrer"
              className="text-gray-500 hover:text-accent transition-colors"
            >
              <Github size={18} />
            </a>
          )}
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noreferrer"
              className="text-gray-500 hover:text-accent transition-colors"
            >
              <ExternalLink size={18} />
            </a>
          )}
        </div>
      </div>

      <h3 className="text-xl font-bold mb-2 text-accent group-hover:neon-glow-text">
        {project.title}
      </h3>

      <p className="text-gray-400 text-sm mb-4 font-mono">
        {project.description}
      </p>

      <div className="flex flex-wrap gap-2">
        {project.tags.map((tag, i) => (
          <span
            key={i}
            className="text-xs font-mono text-accent-dim border border-accent-dim px-2 py-1"
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
