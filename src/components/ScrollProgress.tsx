import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp, Rocket } from 'lucide-react';

export const ScrollProgress = () => {
  const [progress, setProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const onScroll = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const nextProgress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

    setProgress(nextProgress);
    setShowBackToTop(scrollTop > window.innerHeight);
  };

  useEffect(() => {
    onScroll();
    window.addEventListener('scroll', onScroll);
    window.addEventListener('resize', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-1.5 z-[70] bg-accent/20 backdrop-blur-sm pointer-events-none">
        <motion.div
          className="h-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 relative shadow-[0_0_14px_rgba(16,185,129,0.85)]"
          style={{ width: `${progress}%` }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
        >
          <motion.div
            className="absolute -top-2.5 -right-3 w-6 h-6 rounded-full border border-accent/70 bg-background/90 shadow-[0_0_16px_rgba(16,185,129,0.55)] flex items-center justify-center"
            animate={{ y: [0, -2, 0], rotate: [0, 12, -12, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Rocket size={12} className="text-emerald-300" />
          </motion.div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            type="button"
            onClick={scrollToTop}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed bottom-6 right-6 z-[70] rounded-full border border-accent/60 bg-background/85 px-4 py-2.5 text-xs font-mono text-accent shadow-[0_0_22px_rgba(16,185,129,0.28)] backdrop-blur-md flex items-center gap-2 hover:-translate-y-1 hover:bg-background transition-all"
            aria-label="Back to Top"
          >
            <ArrowUp size={14} />
            <span>Back to Top</span>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};
