import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Terminal, Code, Activity, Github, Linkedin, Mail, ChevronDown, ExternalLink } from 'lucide-react';
import { supabase } from './lib/supabase/client';
import { ProjectCard } from './components/ui/ProjectCard';
import { SkillCard } from './components/ui/SkillCard';
import { ExperienceTimeline } from './components/ui/ExperienceTimeline';
import { ContactForm } from './components/ui/ContactForm';
import { AdminDashboard } from './pages/admin/Dashboard';
import { AdminLogin } from './pages/admin/Login';
import { Project as ProjectType, Skill as SkillType, Experience as ExperienceType } from './lib/supabase/types';

function Portfolio() {
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [skills, setSkills] = useState<SkillType[]>([]);
  const [experiences, setExperiences] = useState<ExperienceType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [projectsRes, skillsRes, expRes] = await Promise.all([
        supabase.from('projects').select('*').eq('featured', true).order('created_at', { ascending: false }),
        supabase.from('skills').select('*').order('order'),
        supabase.from('experience').select('*').order('start_date', { ascending: false }),
      ]);

      if (projectsRes.data) setProjects(projectsRes.data);
      if (skillsRes.data) setSkills(skillsRes.data);
      if (expRes.data) setExperiences(expRes.data);
      setLoading(false);
    };

    fetchData();
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="grid-pattern min-h-screen">
      {/* Navbar */}
      <nav className="glass fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-accent font-mono text-lg"
          >
            <Terminal size={20} />
            <span></span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-6"
          >
            <a href="#skills" className="text-gray-400 hover:text-accent transition-colors font-mono text-sm">Skills</a>
            <a href="#projects" className="text-gray-400 hover:text-accent transition-colors font-mono text-sm">Projects</a>
            <a href="#experience" className="text-gray-400 hover:text-accent transition-colors font-mono text-sm">Experience</a>
            <a href="#contact" className="text-gray-400 hover:text-accent transition-colors font-mono text-sm">Contact</a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-accent transition-colors">
              <Github size={18} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-accent transition-colors">
              <Linkedin size={18} />
            </a>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 tech-border px-4 py-2 mb-8">
            <Activity size={16} className="text-accent" />
            <span className="font-mono text-sm text-accent">System Online</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 neon-glow-text">
            <span className="text-accent">{'>'}</span> Software{' '}
            <span className="text-accent text-center">Engineer</span>
          </h1>

          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-8 font-mono">
            I am Karim Ait Yahia, a 17 y/o from Morocco, a web developer with expertise in multiple programming languages, including HTML, CSS, JavaScript, React, Tailwind and more
          </p>

          <div className="flex items-center gap-4 justify-center">
            <a
              href="#projects"
              className="tech-border px-6 py-3 text-accent hover:bg-accent/10 transition-all flex items-center gap-2"
            >
              <Code size={18} />
              <span className="font-mono">View Projects</span>
            </a>
            <a
              href="#contact"
              className="tech-border px-6 py-3 text-accent hover:bg-accent/10 transition-all flex items-center gap-2"
            >
              <Mail size={18} />
              <span className="font-mono">Contact</span>
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute bottom-10"
        >
          <ChevronDown size={32} className="text-accent-dim animate-bounce" />
        </motion.div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">
              <span className="text-accent">./</span>Technical Proficiency
            </h2>
            <p className="text-gray-400 font-mono">Skill metrics from the codebase</p>
          </motion.div>

          {!loading && skills.length > 0 ? (
            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {skills.map((skill, index) => (
                <SkillCard key={skill.id} skill={skill} delay={index * 0.05} />
              ))}
            </motion.div>
          ) : (
            <div className="tech-border bg-background/50 p-8 text-center">
              <p className="text-gray-400 font-mono">
                {loading ? 'Loading skills...' : 'No skills configured. Add via admin panel.'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">
              <span className="text-accent">./</span>Projects
            </h2>
            <p className="text-gray-400 font-mono">Featured work from the repository</p>
          </motion.div>

          {!loading && projects.length > 0 ? (
            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {projects.map((project, index) => (
                <ProjectCard key={project.id} project={project} delay={index * 0.1} />
              ))}
            </motion.div>
          ) : (
            <div className="tech-border bg-background/50 p-8 text-center">
              <p className="text-gray-400 font-mono">
                {loading ? 'Loading projects...' : 'No projects configured. Add via admin panel.'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">
              <span className="text-accent">./</span>Experience
            </h2>
            <p className="text-gray-400 font-mono">Professional timeline</p>
          </motion.div>

          {!loading && experiences.length > 0 ? (
            <ExperienceTimeline experiences={experiences} />
          ) : (
            <div className="tech-border bg-background/50 p-8 text-center">
              <p className="text-gray-400 font-mono">
                {loading ? 'Loading experience...' : 'No experience configured. Add via admin panel.'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">
              <span className="text-accent">./</span>Contact
            </h2>
            <p className="text-gray-400 font-mono">Initialize communication protocol</p>
          </motion.div>

          <ContactForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-accent-dim">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <p className="text-gray-500 font-mono text-sm">
            <span className="text-accent">©</span> 2026 Karim Ait Yahia.
          </p>
          <div className="flex items-center gap-2 text-gray-500 font-mono text-sm">
            <span className="w-2 h-2 bg-accent rounded-full animate-blink" />
            <span>All systems operational</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data?.session;
      const role = session?.user?.app_metadata?.role;

      if (session && role === 'admin') {
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
      }
      setLoading(false);
    };

    checkSession();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Checking access...</div>;
  }

  if (!authenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
