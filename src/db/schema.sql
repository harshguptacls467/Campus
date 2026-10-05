-- Campus Copilot Supabase Database Schema (MVP)

-- 1. Enable pgvector extension for AI document embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  branch TEXT NOT NULL,
  semester TEXT NOT NULL,
  cgpa NUMERIC(3,2) NOT NULL,
  backlogs INTEGER NOT NULL DEFAULT 0,
  graduation_year INTEGER NOT NULL
);

-- 3. documents table
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  document_type TEXT NOT NULL,
  extracted_text TEXT,
  extracted_data JSONB,
  embedding vector(768),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for semantic similarity search over document embeddings
CREATE INDEX IF NOT EXISTS documents_embedding_idx ON documents 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- 4. notices table
CREATE TABLE IF NOT EXISTS notices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  deadline TIMESTAMPTZ,
  eligibility JSONB,
  fee TEXT,
  required_documents TEXT[] DEFAULT '{}',
  priority TEXT NOT NULL DEFAULT 'medium'
);

-- 5. placements table
CREATE TABLE IF NOT EXISTS placements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  company TEXT NOT NULL,
  criteria JSONB NOT NULL,
  skills TEXT[] DEFAULT '{}',
  deadline TIMESTAMPTZ
);

-- 6. actions table
CREATE TABLE IF NOT EXISTS actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  due_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'pending',
  source_id UUID
);

-- 7. rgpv_notices table (Real-time Scraped University Notices & Circulars)
CREATE TABLE IF NOT EXISTS rgpv_notices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT,
  date TEXT,
  deadline TIMESTAMPTZ,
  eligibility TEXT,
  description TEXT,
  document_url TEXT,
  source_name TEXT NOT NULL DEFAULT 'RGPV Bhopal',
  source_url TEXT NOT NULL,
  published_at TIMESTAMPTZ,
  fetched_at TIMESTAMPTZ DEFAULT NOW(),
  content_hash TEXT UNIQUE NOT NULL,
  embedding vector(768)
);

CREATE INDEX IF NOT EXISTS rgpv_notices_hash_idx ON rgpv_notices (content_hash);
CREATE INDEX IF NOT EXISTS rgpv_notices_category_idx ON rgpv_notices (category);

-- 8. study_materials table (Study Intelligence: Syllabus, Timetable, PYQs, Notes)
CREATE TABLE IF NOT EXISTS study_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  study_type TEXT NOT NULL, -- 'syllabus', 'timetable', 'pyq', 'notes'
  subject TEXT NOT NULL,
  extracted_text TEXT,
  structured_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS study_materials_user_idx ON study_materials (user_id);
CREATE INDEX IF NOT EXISTS study_materials_type_idx ON study_materials (study_type);
CREATE INDEX IF NOT EXISTS study_materials_subject_idx ON study_materials (subject);

-- 9. pyq_questions table (Granular question-level PYQ intelligence & frequency)
CREATE TABLE IF NOT EXISTS pyq_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  material_id UUID REFERENCES study_materials(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  year TEXT,
  question_number TEXT,
  question_text TEXT NOT NULL,
  marks INTEGER,
  mapped_unit TEXT,
  mapped_topic TEXT,
  source_file TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS pyq_questions_subject_idx ON pyq_questions (subject);
CREATE INDEX IF NOT EXISTS pyq_questions_topic_idx ON pyq_questions (mapped_topic);

-- Study Plans table (Tracks generated day-wise study plans)
CREATE TABLE IF NOT EXISTS study_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  exam_date TEXT,
  days_remaining INTEGER,
  available_hours_per_day NUMERIC,
  is_80_20 BOOLEAN DEFAULT FALSE,
  plan_data JSONB NOT NULL,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS study_plans_user_idx ON study_plans (user_id);
CREATE INDEX IF NOT EXISTS study_plans_subject_idx ON study_plans (subject);

-- Initial Mock Student Seed (Isha Sharma)
INSERT INTO profiles (id, name, branch, semester, cgpa, backlogs, graduation_year)
VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'Isha Sharma',
  'CSE',
  '5th Semester',
  7.80,
  0,
  2027
) ON CONFLICT (id) DO NOTHING;
