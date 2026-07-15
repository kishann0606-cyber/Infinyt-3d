-- Add site-media and cad-uploads buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('site-media', 'site-media', true, 20971520, ARRAY['image/jpeg','image/jpg','image/png','image/webp','image/gif']),
  ('cad-uploads', 'cad-uploads', false, 52428800, NULL)
ON CONFLICT (id) DO NOTHING;

-- Update product-images bucket to allow larger files and restrict types
UPDATE storage.buckets
SET file_size_limit = 10485760,
    allowed_mime_types = ARRAY['image/jpeg','image/jpg','image/png','image/webp']
WHERE id = 'product-images';

-- Add site-media policies
DROP POLICY IF EXISTS "public_read_site_media" ON storage.objects;
CREATE POLICY "public_read_site_media" ON storage.objects FOR SELECT TO public USING (bucket_id = 'site-media');

DROP POLICY IF EXISTS "admin_upload_site_media" ON storage.objects;
CREATE POLICY "admin_upload_site_media" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'site-media');

DROP POLICY IF EXISTS "admin_update_site_media" ON storage.objects;
CREATE POLICY "admin_update_site_media" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'site-media');

DROP POLICY IF EXISTS "admin_delete_site_media" ON storage.objects;
CREATE POLICY "admin_delete_site_media" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'site-media');

-- cad-uploads: anyone can upload, admins can read
DROP POLICY IF EXISTS "anon_upload_cad" ON storage.objects;
CREATE POLICY "anon_upload_cad" ON storage.objects FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'cad-uploads');

DROP POLICY IF EXISTS "auth_read_cad" ON storage.objects;
CREATE POLICY "auth_read_cad" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'cad-uploads');

-- Email settings table
CREATE TABLE IF NOT EXISTS email_settings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  recipients text[] NOT NULL DEFAULT ARRAY['info@infinyt3d.com'],
  cc text[] NOT NULL DEFAULT ARRAY[]::text[],
  bcc text[] NOT NULL DEFAULT ARRAY[]::text[],
  reply_to text DEFAULT NULL,
  sender_name text NOT NULL DEFAULT 'Infinyt3D',
  subject_prefix text NOT NULL DEFAULT '[Enquiry]',
  resend_api_key text DEFAULT NULL,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE email_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_all_email_settings" ON email_settings;
CREATE POLICY "admin_all_email_settings" ON email_settings FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));

-- Seed default email settings row (only if empty)
INSERT INTO email_settings (recipients, sender_name, subject_prefix)
SELECT ARRAY['info@infinyt3d.com'], 'Infinyt3D', '[Enquiry]'
WHERE NOT EXISTS (SELECT 1 FROM email_settings);

-- Email logs
CREATE TABLE IF NOT EXISTS email_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  enquiry_id text,
  enquiry_type text,
  recipients text[],
  status text NOT NULL DEFAULT 'pending',
  error_message text,
  resend_id text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_read_email_logs" ON email_logs;
CREATE POLICY "admin_read_email_logs" ON email_logs FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "service_insert_email_logs" ON email_logs;
CREATE POLICY "service_insert_email_logs" ON email_logs FOR INSERT TO anon, authenticated WITH CHECK (true);
