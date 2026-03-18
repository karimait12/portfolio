import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase/client';

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      const { error } = await supabase.from('messages').insert([
        {
          name: formData.name,
          email: formData.email,
          message: formData.message,
          status: 'new',
        },
      ]);

      if (error) throw error;

      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 3000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onSubmit={handleSubmit}
      className="tech-border bg-slate-50 dark:bg-gray-900/50 border border-slate-200 dark:border-emerald-500/20 p-8 space-y-6"
    >
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-mono text-accent">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="w-full bg-background/80 border border-accent-dim text-gray-300 px-4 py-3 font-mono focus:outline-none focus:border-accent focus:neon-glow transition-all"
            placeholder="John Doe"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-mono text-accent">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            className="w-full bg-background/80 border border-accent-dim text-gray-300 px-4 py-3 font-mono focus:outline-none focus:border-accent focus:neon-glow transition-all"
            placeholder="john@example.com"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-mono text-accent">Message</label>
        <textarea
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          required
          rows={5}
          className="w-full bg-background/80 border border-accent-dim text-gray-300 px-4 py-3 font-mono focus:outline-none focus:border-accent focus:neon-glow transition-all resize-none"
          placeholder="Your message..."
        />
      </div>

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full tech-border py-4 text-accent hover:bg-accent/10 transition-all flex items-center justify-center gap-2 font-mono disabled:opacity-50"
      >
        {status === 'success' ? (
          <>
            <CheckCircle size={18} />
            <span>Message Sent</span>
          </>
        ) : status === 'error' ? (
          <>
            <AlertCircle size={18} />
            <span>Try Again</span>
          </>
        ) : (
          <>
            <Send size={18} />
            <span>{status === 'submitting' ? 'Sending...' : 'Send Message'}</span>
          </>
        )}
      </button>
    </motion.form>
  );
}
