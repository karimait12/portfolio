import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase/client';
import { Terminal, Lock, AlertCircle } from 'lucide-react';

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const session = supabase.auth.getSession();
    if (session) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      navigate('/admin');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid-pattern flex items-center justify-center px-4">
      <div className="tech-border bg-background/80 p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-accent mb-4">
            <Terminal size={32} />
            <Lock size={24} />
          </div>
          <h1 className="text-2xl font-bold text-accent neon-glow-text">Admin Access</h1>
          <p className="text-gray-400 font-mono text-sm mt-2">
            Restricted area - Authentication required
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="bg-red-900/20 border border-red-500/50 p-3 flex items-center gap-2">
              <AlertCircle size={16} className="text-red-500" />
              <span className="text-red-400 text-sm font-mono">{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-mono text-accent">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-background/80 border border-accent-dim text-gray-300 px-4 py-3 font-mono focus:outline-none focus:border-accent focus:neon-glow transition-all"
              placeholder="admin@example.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-mono text-accent">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-background/80 border border-accent-dim text-gray-300 px-4 py-3 font-mono focus:outline-none focus:border-accent focus:neon-glow transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full tech-border py-4 text-accent hover:bg-accent/10 transition-all font-mono disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
