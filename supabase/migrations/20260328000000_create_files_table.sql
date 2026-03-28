-- Create files table
CREATE TABLE files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE files ENABLE ROW LEVEL SECURITY;

-- Files policies
CREATE POLICY "Users can view their own files" ON files
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own files" ON files
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own files" ON files
  FOR DELETE USING (auth.uid() = user_id);

-- Storage bucket setup (if not exists via dashboard)
-- Note: Supabase storage buckets and policies are often managed via SQL in the 'storage' schema
-- but for simplicity here we assume the bucket 'project-files' exists.
-- We add policies for the bucket.

INSERT INTO storage.buckets (id, name, public) 
VALUES ('project-files', 'project-files', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for project-files bucket
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'project-files');
CREATE POLICY "Authenticated users can upload files" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'project-files' AND auth.role() = 'authenticated');
CREATE POLICY "Users can delete their own files" ON storage.objects FOR DELETE USING (bucket_id = 'project-files' AND auth.uid() = owner);
