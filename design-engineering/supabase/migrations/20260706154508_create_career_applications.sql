-- Career applications table
CREATE TABLE IF NOT EXISTS career_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  position TEXT,
  message TEXT,
  cv_url TEXT,
  cv_filename TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE career_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_insert_career_applications" ON career_applications FOR INSERT
  TO anon, authenticated WITH CHECK (true);

CREATE POLICY "anon_read_career_applications" ON career_applications FOR SELECT
  TO anon, authenticated USING (true);

-- Create storage bucket for CVs (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('career-cvs', 'career-cvs', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for CV uploads
CREATE POLICY "anon_upload_cvs" ON storage.objects FOR INSERT
  TO anon, authenticated WITH CHECK (bucket_id = 'career-cvs');

CREATE POLICY "anon_read_cvs" ON storage.objects FOR SELECT
  TO anon, authenticated USING (bucket_id = 'career-cvs');
