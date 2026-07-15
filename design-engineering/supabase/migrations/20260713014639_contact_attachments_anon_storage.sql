-- Allow anon users to upload contact attachments to site-media bucket
CREATE POLICY "contact_attachments_anon_upload" ON storage.objects
  FOR INSERT TO anon
  WITH CHECK (bucket_id = 'site-media' AND name LIKE 'contact/%');
