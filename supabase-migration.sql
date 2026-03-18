-- Supabase Migration: Skills & Projects Tables
-- Run this in your Supabase SQL Editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROJECTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  github_url TEXT,
  live_url TEXT,
  image_url TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- SKILLS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  proficiency INTEGER NOT NULL CHECK (proficiency >= 0 AND proficiency <= 100),
  icon TEXT,
  order_index INTEGER DEFAULT 0
);

-- ============================================
-- EXPERIENCE TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS experience (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  description TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT,
  current BOOLEAN DEFAULT false,
  logo_url TEXT
);

-- ============================================
-- MESSAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Public read access for portfolio data
CREATE POLICY "Public read projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Public read skills" ON skills FOR SELECT USING (true);
CREATE POLICY "Public read experience" ON experience FOR SELECT USING (true);

-- Authenticated users can modify content
CREATE POLICY "Auth insert projects" ON projects FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth update projects" ON projects FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth delete projects" ON projects FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Auth insert skills" ON skills FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth update skills" ON skills FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth delete skills" ON skills FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Auth insert experience" ON experience FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth update experience" ON experience FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth delete experience" ON experience FOR DELETE USING (auth.role() = 'authenticated');

-- Messages: public can submit, auth can read/manage
CREATE POLICY "Public insert messages" ON messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth read messages" ON messages FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Auth update messages" ON messages FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth delete messages" ON messages FOR DELETE USING (auth.role() = 'authenticated');

-- ============================================
-- SAMPLE DATA (Optional - uncomment to seed)
-- ============================================

/*
INSERT INTO skills (name, category, proficiency, order_index) VALUES
  ('TypeScript', 'Language', 90, 1),
  ('React', 'Framework', 85, 2),
  ('Node.js', 'Runtime', 80, 3),
  ('Rust', 'Language', 60, 4),
  ('Python', 'Language', 75, 5),
  ('PostgreSQL', 'Database', 70, 6),
  ('AWS', 'Cloud', 65, 7),
  ('Kubernetes', 'DevOps', 55, 8);

INSERT INTO projects (title, description, tags, featured) VALUES
  ('Autonomous Agent Framework', 'A scalable multi-agent system for complex task orchestration with real-time coordination.', ARRAY['TypeScript', 'Node.js', 'Redis', 'WebSocket'], true),
  ('Neural Code Assistant', 'ML-powered code completion engine with context-aware suggestions.', ARRAY['Python', 'PyTorch', 'Transformers', 'FastAPI'], true),
  ('Distributed Task Queue', 'High-throughput job processing system with fault tolerance and auto-scaling.', ARRAY['Go', 'Kubernetes', 'gRPC', 'Prometheus'], true);

INSERT INTO experience (company, role, description, start_date, current) VALUES
  ('Tech Corp', 'Senior Engineer', 'Building distributed systems and leading infrastructure initiatives.', '2023-01', true),
  ('StartupXYZ', 'Full-Stack Developer', 'Developed scalable microservices architecture.', '2021-01', '2022-12');
*/
