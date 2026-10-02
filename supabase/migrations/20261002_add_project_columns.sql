-- Migration: Add missing columns to projects and files tables
-- Run this in your Supabase Dashboard → SQL Editor

-- 1. Add extra columns to projects table
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS category        TEXT,
  ADD COLUMN IF NOT EXISTS location        TEXT,
  ADD COLUMN IF NOT EXISTS year            INTEGER,
  ADD COLUMN IF NOT EXISTS budget          TEXT,
  ADD COLUMN IF NOT EXISTS area            TEXT,
  ADD COLUMN IF NOT EXISTS tags            TEXT[]   DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS images          TEXT[]   DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS challenges      TEXT,
  ADD COLUMN IF NOT EXISTS collaboration   TEXT;

-- 2. Add file_size column to files table
ALTER TABLE public.files
  ADD COLUMN IF NOT EXISTS file_size BIGINT DEFAULT 0;

-- 3. Ensure RLS is on and permissive policies exist for projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'projects' AND policyname = 'Users can manage their own projects'
  ) THEN
    CREATE POLICY "Users can manage their own projects"
      ON public.projects
      FOR ALL
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- 4. Ensure RLS is on and permissive policies exist for files
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'files' AND policyname = 'Users can manage their own files'
  ) THEN
    CREATE POLICY "Users can manage their own files"
      ON public.files
      FOR ALL
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;
