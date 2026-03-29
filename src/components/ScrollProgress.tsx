import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Footprints } from 'lucide-react';

export const ScrollProgress = () => {
  const [progress, setProgress] = useState(0);

  const onScroll = () => {
    const winScroll = document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    setProgress((winScroll / height) * 100);
  };

  useEffect(() => {
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1.5 z-50 bg-accent-dim">
      <motion.div
        className="h-full bg-accent relative"
        style={{ width: `${progress}%` }}
        transition={{ duration: 0.1 }}
      >
        <motion.div
          className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2"
          animate={{ x: [0, 5, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Footprints size={12} className="text-accent-dim" />
        </motion.div>
      </motion.div>
    </div>
  );
};
