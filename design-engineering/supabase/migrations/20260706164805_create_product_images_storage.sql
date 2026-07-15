-- Storage bucket for product images (allows uploading printer images via Supabase dashboard)
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to product images
CREATE POLICY "public_read_product_images" ON storage.objects FOR SELECT
  TO anon, authenticated USING (bucket_id = 'product-images');

-- Allow upload of product images
CREATE POLICY "anon_upload_product_images" ON storage.objects FOR INSERT
  TO anon, authenticated WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "anon_update_product_images" ON storage.objects FOR UPDATE
  TO anon, authenticated USING (bucket_id = 'product-images');

CREATE POLICY "anon_delete_product_images" ON storage.objects FOR DELETE
  TO anon, authenticated USING (bucket_id = 'product-images');
