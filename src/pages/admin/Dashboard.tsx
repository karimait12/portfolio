import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase/client';
import { LayoutDashboard, Code, Briefcase, Mail, LogOut, Terminal } from 'lucide-react';
import { ProjectsManager } from './ProjectsManager';
import { SkillsManager } from './SkillsManager';
import { ExperienceManager } from './ExperienceManager';
import { MessagesManager } from './MessagesManager';

type Tab = 'projects' | 'skills' | 'experience' | 'messages';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('projects');
  const navigate = useNavigate();

  useEffect(() => {
    const session = supabase.auth.getSession();
    if (!session) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'projects', label: 'Projects', icon: <Code size={18} /> },
    { id: 'skills', label: 'Skills', icon: <LayoutDashboard size={18} /> },
    { id: 'experience', label: 'Experience', icon: <Briefcase size={18} /> },
    { id: 'messages', label: 'Messages', icon: <Mail size={18} /> },
  ];

  return (
    <div className="min-h-screen grid-pattern">
      {/* Admin Navbar */}
      <nav className="glass fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-accent font-mono text-lg">
            <Terminal size={20} />
            <span>admin@portfolio</span>
          </div>
          <button
            onClick={handleLogout}
            className="tech-border px-4 py-2 text-accent hover:bg-accent/10 flex items-center gap-2"
          >
            <LogOut size={18} />
            <span className="font-mono">Logout</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-accent neon-glow-text mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-400 font-mono">Manage your portfolio content</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 border-b border-accent-dim pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 flex items-center gap-2 font-mono transition-all ${
                  activeTab === tab.id
                    ? 'text-accent border-b-2 border-accent'
                    : 'text-gray-400 hover:text-accent'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="tech-border bg-background/50 p-6">
            {activeTab === 'projects' && <ProjectsManager />}
            {activeTab === 'skills' && <SkillsManager />}
            {activeTab === 'experience' && <ExperienceManager />}
            {activeTab === 'messages' && <MessagesManager />}
          </div>
        </div>
      </main>
    </div>
  );
}
