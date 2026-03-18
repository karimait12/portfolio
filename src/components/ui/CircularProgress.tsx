import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface CircularProgressProps {
  percentage: number;
  label: string;
  color?: string;
  size?: number;
  strokeWidth?: number;
}

export function CircularProgress({
  percentage,
  label,
  color = '#22c55e',
  size = 120,
  strokeWidth = 10,
}: CircularProgressProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div ref={ref} className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background circle */}
        <svg width={size} height={size} className="rotate-[-90deg]">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(34, 197, 94, 0.1)"
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: isInView ? offset : circumference }}
            transition={{ duration: 1.5, ease: 'easeOut', delay: 0.2 }}
            className="neon-glow"
          />
        </svg>
        {/* Percentage text in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: isInView ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-xl font-bold text-accent font-mono"
          >
            {percentage}%
          </motion.span>
        </div>
      </div>
      <span className="text-sm text-gray-400 font-mono">{label}</span>
    </div>
  );
}
