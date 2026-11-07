-- Supabase Analytics Schema
-- Run this SQL in your Supabase SQL Editor

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS visitor_sessions (
  id UUID PRIMARY KEY,
  visitor_id TEXT NOT NULL,
  country TEXT,
  city TEXT,
  device TEXT,
  browser TEXT,
  referrer TEXT,
  landing_path TEXT,
  pages_viewed INT DEFAULT 1,
  duration_seconds INT DEFAULT 0,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_visitor_sessions_started_at ON visitor_sessions (started_at);

ALTER TABLE visitor_sessions ENABLE ROW LEVEL SECURITY;

-- No anon access. Inserts/updates happen via the server function (service role).
-- Admins (authenticated) can read.
CREATE POLICY "Auth read visitor_sessions" ON visitor_sessions
  FOR SELECT USING (auth.role() = 'authenticated');
