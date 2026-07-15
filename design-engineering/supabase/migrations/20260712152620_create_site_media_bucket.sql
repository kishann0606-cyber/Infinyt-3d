-- Create site-media storage bucket for site images uploaded via admin panel
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'site-media',
  'site-media',
  true,
  10485760,
  ARRAY['image/jpeg','image/jpg','image/png','image/webp','image/gif','image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Allow authenticated users to upload
DROP POLICY IF EXISTS "site_media_upload" ON storage.objects;
CREATE POLICY "site_media_upload" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'site-media');

-- Allow authenticated users to update/delete
DROP POLICY IF EXISTS "site_media_update" ON storage.objects;
CREATE POLICY "site_media_update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'site-media');

DROP POLICY IF EXISTS "site_media_delete" ON storage.objects;
CREATE POLICY "site_media_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'site-media');

-- Public read
DROP POLICY IF EXISTS "site_media_read" ON storage.objects;
CREATE POLICY "site_media_read" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'site-media');
