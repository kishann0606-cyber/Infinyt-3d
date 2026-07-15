-- =====================================================================
-- Infinyt 3D — Full Database Setup
-- Run this in your Supabase Dashboard → SQL Editor → New query
-- =====================================================================

-- =========================
-- 1. CATEGORIES TABLE
-- =========================
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  image TEXT,
  product_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================
-- 2. PRODUCTS TABLE
-- =========================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  brand TEXT NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  technology TEXT,
  build_volume TEXT,
  layer_resolution TEXT,
  price INTEGER NOT NULL,
  image TEXT,
  images TEXT[] DEFAULT '{}',
  badges TEXT[] DEFAULT '{}',
  specifications JSONB DEFAULT '{}',
  features TEXT[] DEFAULT '{}',
  description TEXT,
  short_description TEXT,
  downloads JSONB DEFAULT '[]',
  warranty TEXT,
  related_products UUID[] DEFAULT '{}',
  faqs JSONB DEFAULT '[]',
  in_stock BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  product_type TEXT DEFAULT 'printer',
  tags TEXT[] DEFAULT '{}',
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================
-- 3. ADMIN_USERS TABLE
-- =========================
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================
-- 4. ORDERS TABLE
-- =========================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  product_name TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  total_amount INTEGER NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'pending',
  payment_status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================
-- 5. PROTOTYPE_REQUESTS TABLE
-- =========================
CREATE TABLE IF NOT EXISTS prototype_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  description TEXT NOT NULL,
  specifications JSONB DEFAULT '{}',
  status TEXT DEFAULT 'pending',
  priority TEXT DEFAULT 'normal',
  estimated_price INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================
-- 6. CONTACT_MESSAGES TABLE
-- =========================
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  service TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================
-- 7. NEWSLETTER_SUBSCRIBERS TABLE
-- =========================
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  active BOOLEAN DEFAULT true
);

-- =========================
-- 8. CAREER_APPLICATIONS TABLE
-- =========================
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

-- =========================
-- 9. EMAIL_SETTINGS TABLE
-- =========================
CREATE TABLE IF NOT EXISTS email_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recipients text[] NOT NULL DEFAULT ARRAY['info@infinyt3d.com'],
  cc text[] NOT NULL DEFAULT ARRAY[]::text[],
  bcc text[] NOT NULL DEFAULT ARRAY[]::text[],
  reply_to text DEFAULT NULL,
  sender_name text NOT NULL DEFAULT 'Infinyt3D',
  subject_prefix text NOT NULL DEFAULT '[Enquiry]',
  resend_api_key text DEFAULT NULL,
  updated_at timestamptz DEFAULT now()
);

-- =========================
-- 10. EMAIL_LOGS TABLE
-- =========================
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

-- =========================
-- ENABLE RLS ON ALL TABLES
-- =========================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE prototype_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- =========================
-- CATEGORIES POLICIES
-- =========================
DROP POLICY IF EXISTS "anon_read_categories" ON categories;
CREATE POLICY "anon_read_categories" ON categories FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_write_categories" ON categories;
CREATE POLICY "anon_write_categories" ON categories FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_categories" ON categories;
CREATE POLICY "anon_update_categories" ON categories FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_categories" ON categories;
CREATE POLICY "anon_delete_categories" ON categories FOR DELETE
  TO anon, authenticated USING (true);

-- =========================
-- PRODUCTS POLICIES
-- =========================
DROP POLICY IF EXISTS "anon_read_products" ON products;
CREATE POLICY "anon_read_products" ON products FOR SELECT
  TO anon, authenticated USING (true);

-- Products INSERT — admin only
DROP POLICY IF EXISTS "anon_write_products" ON products;
CREATE POLICY "admin_products_insert" ON products FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()));

-- Products UPDATE — admin only
DROP POLICY IF EXISTS "anon_update_products" ON products;
CREATE POLICY "admin_products_update" ON products FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()));

-- Products DELETE — admin only
DROP POLICY IF EXISTS "anon_delete_products" ON products;
CREATE POLICY "admin_products_delete" ON products FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()));

-- =========================
-- ADMIN_USERS POLICIES
-- =========================
DROP POLICY IF EXISTS "admin_users_select" ON admin_users;
CREATE POLICY "admin_users_select" ON admin_users FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM admin_users au WHERE au.user_id = auth.uid()));

DROP POLICY IF EXISTS "admin_users_update" ON admin_users;
CREATE POLICY "admin_users_update" ON admin_users FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM admin_users au WHERE au.user_id = auth.uid()))
  WITH CHECK (user_id = auth.uid() OR EXISTS (SELECT 1 FROM admin_users au WHERE au.user_id = auth.uid()));

DROP POLICY IF EXISTS "admin_users_insert" ON admin_users;
CREATE POLICY "admin_users_insert" ON admin_users FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users au WHERE au.user_id = auth.uid()));

-- =========================
-- ORDERS POLICIES
-- =========================
DROP POLICY IF EXISTS "orders_insert" ON orders;
CREATE POLICY "orders_insert" ON orders FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_orders_delete" ON orders;
CREATE POLICY "admin_orders_delete" ON orders FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()));

-- =========================
-- PROTOTYPE_REQUESTS POLICIES
-- =========================
DROP POLICY IF EXISTS "anon_insert_prototype_requests" ON prototype_requests;
CREATE POLICY "anon_insert_prototype_requests" ON prototype_requests FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_select_prototype_requests" ON prototype_requests;
CREATE POLICY "admin_select_prototype_requests" ON prototype_requests FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()));

DROP POLICY IF EXISTS "admin_update_prototype_requests" ON prototype_requests;
CREATE POLICY "admin_update_prototype_requests" ON prototype_requests FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()));

DROP POLICY IF EXISTS "admin_delete_prototype_requests" ON prototype_requests;
CREATE POLICY "admin_delete_prototype_requests" ON prototype_requests FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()));

-- =========================
-- CONTACT_MESSAGES POLICIES
-- =========================
DROP POLICY IF EXISTS "anon_insert_contact_messages" ON contact_messages;
CREATE POLICY "anon_insert_contact_messages" ON contact_messages FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_read_contact_messages" ON contact_messages;
CREATE POLICY "anon_read_contact_messages" ON contact_messages FOR SELECT
  TO anon, authenticated USING (true);

-- =========================
-- NEWSLETTER_SUBSCRIBERS POLICIES
-- =========================
DROP POLICY IF EXISTS "anon_insert_newsletter" ON newsletter_subscribers;
CREATE POLICY "anon_insert_newsletter" ON newsletter_subscribers FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- =========================
-- CAREER_APPLICATIONS POLICIES
-- =========================
DROP POLICY IF EXISTS "anon_insert_career_applications" ON career_applications;
CREATE POLICY "anon_insert_career_applications" ON career_applications FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_read_career_applications" ON career_applications;
CREATE POLICY "anon_read_career_applications" ON career_applications FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_career_update" ON career_applications;
CREATE POLICY "admin_career_update" ON career_applications FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()));

DROP POLICY IF EXISTS "admin_career_delete" ON career_applications;
CREATE POLICY "admin_career_delete" ON career_applications FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()));

-- =========================
-- EMAIL_SETTINGS POLICIES
-- =========================
DROP POLICY IF EXISTS "admin_all_email_settings" ON email_settings;
CREATE POLICY "admin_all_email_settings" ON email_settings FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));

-- =========================
-- EMAIL_LOGS POLICIES
-- =========================
DROP POLICY IF EXISTS "admin_read_email_logs" ON email_logs;
CREATE POLICY "admin_read_email_logs" ON email_logs FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "service_insert_email_logs" ON email_logs;
CREATE POLICY "service_insert_email_logs" ON email_logs FOR INSERT TO anon, authenticated WITH CHECK (true);

-- =========================
-- INDEXES
-- =========================
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- =========================
-- STORAGE BUCKETS
-- =========================
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('career-cvs', 'career-cvs', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('site-media', 'site-media', true, 20971520, ARRAY['image/jpeg','image/jpg','image/png','image/webp','image/gif']),
  ('cad-uploads', 'cad-uploads', false, 52428800, NULL)
ON CONFLICT (id) DO NOTHING;

UPDATE storage.buckets
SET file_size_limit = 10485760,
    allowed_mime_types = ARRAY['image/jpeg','image/jpg','image/png','image/webp']
WHERE id = 'product-images';

-- =========================
-- STORAGE POLICIES
-- =========================
-- Product images
DROP POLICY IF EXISTS "public_read_product_images" ON storage.objects;
CREATE POLICY "public_read_product_images" ON storage.objects FOR SELECT
  TO anon, authenticated USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "anon_upload_product_images" ON storage.objects;
CREATE POLICY "anon_upload_product_images" ON storage.objects FOR INSERT
  TO anon, authenticated WITH CHECK (bucket_id = 'product-images');

DROP POLICY IF EXISTS "anon_update_product_images" ON storage.objects;
CREATE POLICY "anon_update_product_images" ON storage.objects FOR UPDATE
  TO anon, authenticated USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "anon_delete_product_images" ON storage.objects;
CREATE POLICY "anon_delete_product_images" ON storage.objects FOR DELETE
  TO anon, authenticated USING (bucket_id = 'product-images');

-- Career CVs
DROP POLICY IF EXISTS "anon_upload_cvs" ON storage.objects;
CREATE POLICY "anon_upload_cvs" ON storage.objects FOR INSERT
  TO anon, authenticated WITH CHECK (bucket_id = 'career-cvs');

DROP POLICY IF EXISTS "anon_read_cvs" ON storage.objects;
CREATE POLICY "anon_read_cvs" ON storage.objects FOR SELECT
  TO anon, authenticated USING (bucket_id = 'career-cvs');

-- Site media
DROP POLICY IF EXISTS "public_read_site_media" ON storage.objects;
CREATE POLICY "public_read_site_media" ON storage.objects FOR SELECT TO public USING (bucket_id = 'site-media');

DROP POLICY IF EXISTS "admin_upload_site_media" ON storage.objects;
CREATE POLICY "admin_upload_site_media" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'site-media');

DROP POLICY IF EXISTS "admin_update_site_media" ON storage.objects;
CREATE POLICY "admin_update_site_media" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'site-media');

DROP POLICY IF EXISTS "admin_delete_site_media" ON storage.objects;
CREATE POLICY "admin_delete_site_media" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'site-media');

-- CAD uploads
DROP POLICY IF EXISTS "anon_upload_cad" ON storage.objects;
CREATE POLICY "anon_upload_cad" ON storage.objects FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'cad-uploads');

DROP POLICY IF EXISTS "auth_read_cad" ON storage.objects;
CREATE POLICY "auth_read_cad" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'cad-uploads');

-- =========================
-- SEED: EMAIL SETTINGS
-- =========================
INSERT INTO email_settings (recipients, sender_name, subject_prefix)
SELECT ARRAY['info@infinyt3d.com'], 'Infinyt3D', '[Enquiry]'
WHERE NOT EXISTS (SELECT 1 FROM email_settings);

-- =========================
-- SEED: CATEGORIES
-- =========================
INSERT INTO categories (id, name, slug, description, icon, image, product_count) VALUES
  ('11111111-0000-0000-0000-000000000001', 'FDM Printers', 'fdm-printers', 'Professional Fused Deposition Modeling 3D printers for prototyping and production', 'box', 'https://images.pexels.com/photos/8566526/pexels-photo-8566526.jpeg?auto=compress&cs=tinysrgb&w=800', 8),
  ('11111111-0000-0000-0000-000000000002', 'SLA Printers', 'sla-printers', 'High-precision Stereolithography printers for detailed models and jewelry', 'droplet', 'https://images.pexels.com/photos/8438980/pexels-photo-8438980.jpeg?auto=compress&cs=tinysrgb&w=800', 3),
  ('11111111-0000-0000-0000-000000000003', 'Filaments', 'filaments', 'Engineering-grade filaments for professional applications', 'layers', 'https://images.pexels.com/photos/8566528/pexels-photo-8566528.jpeg?auto=compress&cs=tinysrgb&w=800', 6),
  ('11111111-0000-0000-0000-000000000004', 'Resins', 'resins', 'High-performance photopolymer resins for SLA printing', 'flask-conical', 'https://images.pexels.com/photos/8566482/pexels-photo-8566482.jpeg?auto=compress&cs=tinysrgb&w=800', 2),
  ('11111111-0000-0000-0000-000000000005', 'Scanners', 'scanners', 'Professional 3D scanning solutions for reverse engineering and inspection', 'scan', 'https://images.pexels.com/photos/8566472/pexels-photo-8566472.jpeg?auto=compress&cs=tinysrgb&w=800', 2),
  ('11111111-0000-0000-0000-000000000006', 'Accessories', 'accessories', 'Essential accessories and upgrades for your 3D printing workflow', 'settings', 'https://images.pexels.com/photos/8566532/pexels-photo-8566532.jpeg?auto=compress&cs=tinysrgb&w=800', 0)
ON CONFLICT (slug) DO NOTHING;

-- =========================
-- SEED: FDM PRINTERS
-- =========================
INSERT INTO products (name, slug, brand, category_id, technology, build_volume, layer_resolution, price, image, images, badges, specifications, features, description, short_description, warranty, in_stock, featured, product_type) VALUES
(
  'Creality Ender 3 V3 SE', 'creality-ender-3-v3-se', 'Creality',
  '11111111-0000-0000-0000-000000000001', 'FDM', '220 x 220 x 250mm', '0.1 - 0.4mm', 15999,
  'https://images.pexels.com/photos/8566526/pexels-photo-8566526.jpeg?auto=compress&cs=tinysrgb&w=800',
  ARRAY['https://images.pexels.com/photos/8566526/pexels-photo-8566526.jpeg?auto=compress&cs=tinysrgb&w=800'],
  ARRAY['Best Seller'],
  '{"Print Speed": "Up to 180mm/s", "Nozzle Diameter": "0.4mm", "Bed Type": "Carborundum Glass", "Filament Diameter": "1.75mm"}',
  ARRAY['CR-Touch Auto Leveling', 'Sprite Extruder', 'Silent Motherboard', 'Resume Print'],
  'The Ender 3 V3 SE features the new Sprite direct drive extruder for reliable printing with all filament types. Perfect entry-level printer for beginners and hobbyists.',
  'Entry-level FDM printer with advanced features', '1 Year', true, true, 'printer'
),
(
  'Creality Ender 3 V3 KE', 'creality-ender-3-v3-ke', 'Creality',
  '11111111-0000-0000-0000-000000000001', 'FDM', '220 x 220 x 250mm', '0.1 - 0.35mm', 21999,
  'https://images.pexels.com/photos/8566526/pexels-photo-8566526.jpeg?auto=compress&cs=tinysrgb&w=800',
  ARRAY['https://images.pexels.com/photos/8566526/pexels-photo-8566526.jpeg?auto=compress&cs=tinysrgb&w=800'],
  ARRAY['New'],
  '{"Print Speed": "Up to 500mm/s", "Nozzle Diameter": "0.4mm", "Bed Type": "PEI Spring Steel", "Connectivity": "WiFi, USB, SD Card"}',
  ARRAY['High Speed Printing', 'Klipper Firmware', 'Input Shaper', 'WiFi Control'],
  'High-speed FDM printer with Klipper firmware for professional quality at blazing speeds. Features input shaping for vibration compensation.',
  'High-speed FDM printer with Klipper firmware', '1 Year', true, true, 'printer'
),
(
  'Creality K1 Max', 'creality-k1-max', 'Creality',
  '11111111-0000-0000-0000-000000000001', 'CoreXY FDM', '300 x 300 x 300mm', '0.1 - 0.35mm', 54999,
  'https://images.pexels.com/photos/8566530/pexels-photo-8566530.jpeg?auto=compress&cs=tinysrgb&w=800',
  ARRAY['https://images.pexels.com/photos/8566530/pexels-photo-8566530.jpeg?auto=compress&cs=tinysrgb&w=800'],
  ARRAY['Flagship'],
  '{"Print Speed": "Up to 600mm/s", "Acceleration": "20000mm/s²", "Nozzle Diameter": "0.4mm", "Connectivity": "WiFi, Ethernet, USB"}',
  ARRAY['AI LiDAR', 'Enclosed Chamber', 'CoreXY Motion', 'Klipper OS'],
  'Creality flagship CoreXY printer with AI-assisted printing and enclosed build chamber for consistent results with engineering materials.',
  'Flagship CoreXY with AI LiDAR and enclosed chamber', '1 Year', true, true, 'printer'
),
(
  'Bambu Lab A1 Mini Combo', 'bambu-lab-a1-mini-combo', 'Bambu Lab',
  '11111111-0000-0000-0000-000000000001', 'FDM', '180 x 180 x 180mm', '0.08 - 0.28mm', 39999,
  'https://images.pexels.com/photos/8566526/pexels-photo-8566526.jpeg?auto=compress&cs=tinysrgb&w=800',
  ARRAY['https://images.pexels.com/photos/8566526/pexels-photo-8566526.jpeg?auto=compress&cs=tinysrgb&w=800'],
  ARRAY['Popular'],
  '{"Print Speed": "Up to 500mm/s", "AMS Lite": "4 Color Printing", "Bed Type": "PEI Spring Steel", "Connectivity": "WiFi, LAN"}',
  ARRAY['AMS Lite Multi-color', 'Auto Calibration', 'Full Auto Leveling', 'Bambu Studio'],
  'Compact powerhouse with AMS Lite for multi-color printing out of the box. Perfect for home users who want professional results.',
  'Compact multi-color printer with AMS Lite', '1 Year', true, true, 'printer'
),
(
  'Bambu Lab P1S Combo', 'bambu-lab-p1s-combo', 'Bambu Lab',
  '11111111-0000-0000-0000-000000000001', 'CoreXY FDM', '256 x 256 x 256mm', '0.08 - 0.28mm', 69999,
  'https://images.pexels.com/photos/8566534/pexels-photo-8566534.jpeg?auto=compress&cs=tinysrgb&w=800',
  ARRAY['https://images.pexels.com/photos/8566534/pexels-photo-8566534.jpeg?auto=compress&cs=tinysrgb&w=800'],
  ARRAY['Best Seller'],
  '{"Print Speed": "Up to 500mm/s", "AMS": "4 Color Printing", "Enclosed": "Yes", "Connectivity": "WiFi, LAN, USB"}',
  ARRAY['Enclosed Build Chamber', 'AMS Multi-color', 'CoreXY Motion', 'Aux Fan'],
  'Professional enclosed CoreXY with AMS for production-quality multi-color prints. Supports engineering materials like ABS, ASA, and PA.',
  'Professional enclosed CoreXY with AMS', '1 Year', true, true, 'printer'
),
(
  'Bambu Lab H2D Pro Combo', 'bambu-lab-h2d-pro-combo', 'Bambu Lab',
  '11111111-0000-0000-0000-000000000001', 'CoreXY FDM', '350 x 350 x 350mm', '0.08 - 0.28mm', 129999,
  'https://images.pexels.com/photos/8566530/pexels-photo-8566530.jpeg?auto=compress&cs=tinysrgb&w=800',
  ARRAY['https://images.pexels.com/photos/8566530/pexels-photo-8566530.jpeg?auto=compress&cs=tinysrgb&w=800'],
  ARRAY['New', 'Flagship'],
  '{"Print Speed": "Up to 500mm/s", "Build Volume": "Large Format", "Enclosed": "Yes - Heated", "Connectivity": "WiFi, LAN, USB"}',
  ARRAY['Large Format', 'Heated Chamber', 'AMS Multi-color', 'Industrial Grade'],
  'Large format professional printer with heated chamber for engineering materials. Designed for production workflows and industrial applications.',
  'Large format industrial-grade FDM printer', '1 Year', true, true, 'printer'
),
(
  'ELEGOO Neptune 4 Pro', 'elegoo-neptune-4-pro', 'Elegoo',
  '11111111-0000-0000-0000-000000000001', 'FDM', '220 x 220 x 280mm', '0.1 - 0.4mm', 17999,
  'https://images.pexels.com/photos/8566526/pexels-photo-8566526.jpeg?auto=compress&cs=tinysrgb&w=800',
  ARRAY['https://images.pexels.com/photos/8566526/pexels-photo-8566526.jpeg?auto=compress&cs=tinysrgb&w=800'],
  ARRAY['Value Pick'],
  '{"Print Speed": "Up to 500mm/s", "Nozzle Diameter": "0.4mm", "Bed Type": "PEI Magnetic", "Motherboard": "32-bit"}',
  ARRAY['High Speed', 'Direct Drive', 'Auto Leveling', 'Silent Drivers'],
  'Excellent value high-speed FDM printer with direct drive extruder and Klipper-like features at an accessible price point.',
  'Value high-speed FDM with direct drive', '1 Year', true, true, 'printer'
),
(
  'Anycubic Kobra 3 Max', 'anycubic-kobra-3-max', 'Anycubic',
  '11111111-0000-0000-0000-000000000001', 'FDM', '450 x 450 x 450mm', '0.1 - 0.4mm', 44999,
  'https://images.pexels.com/photos/8566526/pexels-photo-8566526.jpeg?auto=compress&cs=tinysrgb&w=800',
  ARRAY['https://images.pexels.com/photos/8566526/pexels-photo-8566526.jpeg?auto=compress&cs=tinysrgb&w=800'],
  ARRAY['Large Format'],
  '{"Build Volume": "Large Format", "Bed Type": "Carborundum Glass", "Leveling": "Anycubic LeviQ", "Connectivity": "WiFi, USB, SD"}',
  ARRAY['Large Build Volume', 'Auto Leveling', 'TFT Touchscreen', 'Resume Print'],
  'Large format FDM printer for bigger projects and production runs. Ideal for architectural models, large prototypes, and batch manufacturing.',
  'Large format FDM printer', '1 Year', true, false, 'printer'
)
ON CONFLICT (slug) DO NOTHING;

-- =========================
-- SEED: SLA PRINTERS
-- =========================
INSERT INTO products (name, slug, brand, category_id, technology, build_volume, layer_resolution, price, image, images, badges, specifications, features, description, short_description, warranty, in_stock, featured, product_type) VALUES
(
  'Phrozen Sonic Mini 8K', 'phrozen-sonic-mini-8k', 'Phrozen',
  '11111111-0000-0000-0000-000000000002', 'MSLA', '165 x 72 x 180mm', '0.01 - 0.2mm', 35999,
  'https://images.pexels.com/photos/8438980/pexels-photo-8438980.jpeg?auto=compress&cs=tinysrgb&w=800',
  ARRAY['https://images.pexels.com/photos/8438980/pexels-photo-8438980.jpeg?auto=compress&cs=tinysrgb&w=800'],
  ARRAY['8K Resolution'],
  '{"Resolution": "7680 x 4320 (8K)", "Light Source": "UV LED", "XY Resolution": "22µm", "Z Resolution": "10µm"}',
  ARRAY['Ultra High Resolution', 'Fast Printing', 'Monochrome LCD', 'Easy Leveling'],
  'Ultra-high resolution 8K MSLA printer for detailed miniatures and jewelry. 22µm XY resolution captures the finest details.',
  '8K resolution MSLA for ultra-detailed prints', '1 Year', true, true, 'printer'
),
(
  'Elegoo Saturn 4', 'elegoo-saturn-4', 'Elegoo',
  '11111111-0000-0000-0000-000000000002', 'MSLA', '195 x 122 x 210mm', '0.02 - 0.2mm', 28999,
  'https://images.pexels.com/photos/8438980/pexels-photo-8438980.jpeg?auto=compress&cs=tinysrgb&w=800',
  ARRAY['https://images.pexels.com/photos/8438980/pexels-photo-8438980.jpeg?auto=compress&cs=tinysrgb&w=800'],
  ARRAY['Value Pick'],
  '{"Resolution": "8K Mono", "Build Plate": "Laser Carved", "Light Source": "405nm UV LED", "Touchscreen": "4 inch IPS"}',
  ARRAY['8K Monochrome', 'Tilt Release', 'Built-in Heater', 'Air Purifier'],
  'High value 8K resin printer with tilt release for easier part removal. Built-in heater ensures consistent resin temperature.',
  'High-value 8K MSLA with tilt release', '1 Year', true, true, 'printer'
),
(
  'Elegoo Mars 5 Ultra', 'elegoo-mars-5-ultra', 'Elegoo',
  '11111111-0000-0000-0000-000000000002', 'MSLA', '143.4 x 90 x 165mm', '0.01 - 0.15mm', 18999,
  'https://images.pexels.com/photos/8438980/pexels-photo-8438980.jpeg?auto=compress&cs=tinysrgb&w=800',
  ARRAY['https://images.pexels.com/photos/8438980/pexels-photo-8438980.jpeg?auto=compress&cs=tinysrgb&w=800'],
  ARRAY['New', 'Best Seller'],
  '{"Resolution": "12K Mono", "XY Resolution": "18.85µm", "Light Source": "COB+Fresnel Lens", "Touchscreen": "4 inch"}',
  ARRAY['12K Monochrome', 'Tilt Release', 'Fast Printing Speed', 'Compact Design'],
  'Compact 12K resolution resin printer with exceptional detail and fast printing speeds. Perfect for dental models, miniatures, and jewelry.',
  'Compact 12K resin printer for ultimate detail', '1 Year', true, true, 'printer'
)
ON CONFLICT (slug) DO NOTHING;

-- =========================
-- SEED: FILAMENTS
-- =========================
INSERT INTO products (name, slug, brand, category_id, technology, build_volume, layer_resolution, price, image, images, badges, specifications, features, description, short_description, warranty, in_stock, featured, product_type) VALUES
(
  'PLA+ Filament 1kg', 'pla-plus-filament-1kg', 'Infinyt 3D',
  '11111111-0000-0000-0000-000000000003', 'FDM', NULL, NULL, 1299,
  'https://images.pexels.com/photos/8566528/pexels-photo-8566528.jpeg?auto=compress&cs=tinysrgb&w=800',
  ARRAY['https://images.pexels.com/photos/8566528/pexels-photo-8566528.jpeg?auto=compress&cs=tinysrgb&w=800'],
  ARRAY['Best Seller'],
  '{"Weight": "1 kg", "Diameter": "1.75mm", "Tolerance": "±0.02mm", "Nozzle Temp": "190-220°C", "Bed Temp": "50-60°C"}',
  ARRAY['Low Warping', 'Biodegradable', 'Wide Color Selection', 'Easy to Print', 'Consistent Diameter'],
  'Premium PLA+ filament for everyday 3D printing. Improved formula over standard PLA with better layer adhesion and impact resistance. Available in 20+ colors.',
  'Premium PLA+ for everyday printing, 20+ colors', '6 Months', true, true, 'filament'
),
(
  'PETG Filament 1kg', 'petg-filament-1kg', 'Infinyt 3D',
  '11111111-0000-0000-0000-000000000003', 'FDM', NULL, NULL, 1699,
  'https://images.pexels.com/photos/8566532/pexels-photo-8566532.jpeg?auto=compress&cs=tinysrgb&w=800',
  ARRAY['https://images.pexels.com/photos/8566532/pexels-photo-8566532.jpeg?auto=compress&cs=tinysrgb&w=800'],
  ARRAY['Popular'],
  '{"Weight": "1 kg", "Diameter": "1.75mm", "Tolerance": "±0.02mm", "Nozzle Temp": "230-250°C", "Bed Temp": "70-80°C"}',
  ARRAY['Chemical Resistant', 'Water Resistant', 'Food Safe Options', 'Strong Layer Adhesion', 'Low Odor'],
  'Food-safe PETG filament perfect for functional parts, containers, and mechanical components. Excellent chemical resistance and water resistance.',
  'Chemical-resistant PETG for functional parts', '6 Months', true, true, 'filament'
),
(
  'ABS Filament 1kg', 'abs-filament-1kg', 'Infinyt 3D',
  '11111111-0000-0000-0000-000000000003', 'FDM', NULL, NULL, 1499,
  'https://images.pexels.com/photos/8566534/pexels-photo-8566534.jpeg?auto=compress&cs=tinysrgb&w=800',
  ARRAY['https://images.pexels.com/photos/8566534/pexels-photo-8566534.jpeg?auto=compress&cs=tinysrgb&w=800'],
  ARRAY['Classic'],
  '{"Weight": "1 kg", "Diameter": "1.75mm", "Tolerance": "±0.02mm", "Nozzle Temp": "220-250°C", "Bed Temp": "100-110°C"}',
  ARRAY['Heat Resistant', 'Impact Resistant', 'Acetone Smoothable', 'Automotive Grade', 'Post-Processable'],
  'Engineering-grade ABS filament for heat-resistant functional parts. Can be smoothed with acetone for a professional finish. Ideal for automotive and industrial applications.',
  'Heat-resistant ABS for engineering applications', '6 Months', true, false, 'filament'
),
(
  'TPU Flexible Filament 1kg', 'tpu-flexible-filament-1kg', 'Infinyt 3D',
  '11111111-0000-0000-0000-000000000003', 'FDM', NULL, NULL, 2299,
  'https://images.pexels.com/photos/8566530/pexels-photo-8566530.jpeg?auto=compress&cs=tinysrgb&w=800',
  ARRAY['https://images.pexels.com/photos/8566530/pexels-photo-8566530.jpeg?auto=compress&cs=tinysrgb&w=800'],
  ARRAY['Flexible'],
  '{"Weight": "1 kg", "Diameter": "1.75mm", "Shore Hardness": "95A", "Nozzle Temp": "220-240°C", "Bed Temp": "50-60°C"}',
  ARRAY['Highly Flexible', 'Abrasion Resistant', 'Oil Resistant', 'Good Grip', 'Rubber-like Feel'],
  'Premium 95A Shore hardness TPU for elastic and flexible prints. Ideal for phone cases, gaskets, wearables, and any part requiring rubber-like properties.',
  'Flexible rubber-like TPU for elastic parts', '6 Months', true, true, 'filament'
),
(
  'Nylon PA12 Filament 500g', 'nylon-pa12-filament-500g', 'Infinyt 3D',
  '11111111-0000-0000-0000-000000000003', 'FDM', NULL, NULL, 2999,
  'https://images.pexels.com/photos/8566532/pexels-photo-8566532.jpeg?auto=compress&cs=tinysrgb&w=800',
  ARRAY['https://images.pexels.com/photos/8566532/pexels-photo-8566532.jpeg?auto=compress&cs=tinysrgb&w=800'],
  ARRAY['Engineering Grade'],
  '{"Weight": "500 g", "Diameter": "1.75mm", "Tolerance": "±0.03mm", "Nozzle Temp": "240-260°C", "Bed Temp": "80-100°C"}',
  ARRAY['High Strength', 'Excellent Wear Resistance', 'Low Friction', 'Impact Resistant', 'Self-lubricating'],
  'Engineering-grade PA12 Nylon for high-performance mechanical parts. Self-lubricating properties make it ideal for gears, bearings, and sliding components.',
  'Engineering-grade Nylon for mechanical parts', '6 Months', true, false, 'filament'
),
(
  'Carbon Fiber PLA 500g', 'carbon-fiber-pla-500g', 'Infinyt 3D',
  '11111111-0000-0000-0000-000000000003', 'FDM', NULL, NULL, 3499,
  'https://images.pexels.com/photos/8566528/pexels-photo-8566528.jpeg?auto=compress&cs=tinysrgb&w=800',
  ARRAY['https://images.pexels.com/photos/8566528/pexels-photo-8566528.jpeg?auto=compress&cs=tinysrgb&w=800'],
  ARRAY['Premium'],
  '{"Weight": "500 g", "Diameter": "1.75mm", "Fiber Content": "15% Carbon Fiber", "Nozzle Temp": "200-220°C", "Nozzle": "Hardened Steel Required"}',
  ARRAY['High Stiffness', 'Premium Matte Finish', 'Dimensionally Stable', 'Lightweight', 'Professional Appearance'],
  'Carbon fiber reinforced PLA for lightweight, stiff, and dimensionally stable parts. The premium matte finish gives prints a professional look. Requires hardened steel nozzle.',
  'Carbon fiber reinforced for premium lightweight parts', '6 Months', true, true, 'filament'
)
ON CONFLICT (slug) DO NOTHING;

-- Done!
