-- =====================================================================
-- 1. DROP UNUSED TABLES (not referenced by any TS code)
-- =====================================================================
DROP TABLE IF EXISTS steam_lab_request CASCADE;
DROP TABLE IF EXISTS dne_form CASCADE;
DROP TABLE IF EXISTS dne_files CASCADE;
DROP TABLE IF EXISTS dne_projects CASCADE;
DROP TABLE IF EXISTS dne_quotations CASCADE;
DROP TABLE IF EXISTS dne_team CASCADE;
DROP TABLE IF EXISTS dne_services_catalogue CASCADE;
DROP TABLE IF EXISTS contact_requests CASCADE;

-- =====================================================================
-- 2. ADD MISSING COLUMNS TO products
-- =====================================================================
ALTER TABLE products ADD COLUMN IF NOT EXISTS product_type TEXT DEFAULT 'printer';
ALTER TABLE products ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE products ADD COLUMN IF NOT EXISTS meta_title TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS meta_description TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS faqs JSONB DEFAULT '[]';

-- =====================================================================
-- 3. ADD MISSING COLUMNS TO product_categories
-- =====================================================================
ALTER TABLE product_categories ADD COLUMN IF NOT EXISTS icon TEXT;
ALTER TABLE product_categories ADD COLUMN IF NOT EXISTS product_count INTEGER DEFAULT 0;

-- =====================================================================
-- 4. ADD MISSING COLUMNS TO contact_messages
-- =====================================================================
ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS company TEXT;
ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS service TEXT;

-- =====================================================================
-- 5. ADD MISSING COLUMNS TO email_settings (for Resend + edge function)
-- =====================================================================
ALTER TABLE email_settings ADD COLUMN IF NOT EXISTS recipients TEXT[] DEFAULT ARRAY['info@infinyt3d.com'];
ALTER TABLE email_settings ADD COLUMN IF NOT EXISTS sender_name TEXT DEFAULT 'Infinyt3D';
ALTER TABLE email_settings ADD COLUMN IF NOT EXISTS subject_prefix TEXT DEFAULT '[Enquiry]';
ALTER TABLE email_settings ADD COLUMN IF NOT EXISTS resend_api_key TEXT;
ALTER TABLE email_settings ADD COLUMN IF NOT EXISTS cc TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE email_settings ADD COLUMN IF NOT EXISTS bcc TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE email_settings ADD COLUMN IF NOT EXISTS reply_to TEXT;

-- =====================================================================
-- 6. ADD RLS POLICIES
-- =====================================================================
-- product_categories: public read
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'product_categories' AND policyname = 'pc_read') THEN
    ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "pc_read" ON product_categories FOR SELECT
      TO anon, authenticated USING (true);
  END IF;
END $$;

-- contact_messages: anon insert, authenticated select/update/delete
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'contact_messages' AND policyname = 'cm_insert') THEN
    ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "cm_insert" ON contact_messages FOR INSERT
      TO anon, authenticated WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'contact_messages' AND policyname = 'cm_select') THEN
    CREATE POLICY "cm_select" ON contact_messages FOR SELECT
      TO authenticated USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'contact_messages' AND policyname = 'cm_update') THEN
    CREATE POLICY "cm_update" ON contact_messages FOR UPDATE
      TO authenticated USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'contact_messages' AND policyname = 'cm_delete') THEN
    CREATE POLICY "cm_delete" ON contact_messages FOR DELETE
      TO authenticated USING (true);
  END IF;
END $$;

-- prototype_requests: anon insert, authenticated select/update/delete
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'prototype_requests' AND policyname = 'pr_insert') THEN
    ALTER TABLE prototype_requests ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "pr_insert" ON prototype_requests FOR INSERT
      TO anon, authenticated WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'prototype_requests' AND policyname = 'pr_select') THEN
    CREATE POLICY "pr_select" ON prototype_requests FOR SELECT
      TO authenticated USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'prototype_requests' AND policyname = 'pr_update') THEN
    CREATE POLICY "pr_update" ON prototype_requests FOR UPDATE
      TO authenticated USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'prototype_requests' AND policyname = 'pr_delete') THEN
    CREATE POLICY "pr_delete" ON prototype_requests FOR DELETE
      TO authenticated USING (true);
  END IF;
END $$;

-- email_settings: authenticated only
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'email_settings' AND policyname = 'es_all') THEN
    ALTER TABLE email_settings ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "es_all" ON email_settings FOR ALL
      TO authenticated USING (true) WITH CHECK (true);
  END IF;
END $$;

-- email_logs: authenticated select, anon insert (for edge function)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'email_logs' AND policyname = 'el_select') THEN
    ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "el_select" ON email_logs FOR SELECT
      TO authenticated USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'email_logs' AND policyname = 'el_insert') THEN
    CREATE POLICY "el_insert" ON email_logs FOR INSERT
      TO anon, authenticated WITH CHECK (true);
  END IF;
END $$;

-- =====================================================================
-- 7. UPDATE PRODUCT CATEGORIES WITH ICONS AND DESCRIPTIONS
-- =====================================================================
UPDATE product_categories SET 
  description = 'Professional FDM, SLA, and CoreXY 3D printers for prototyping and production',
  icon = 'box',
  product_count = (SELECT count(*) FROM products WHERE category = '3D Printers')
WHERE name = '3D Printers';

UPDATE product_categories SET 
  description = 'Professional 3D scanning solutions for reverse engineering and inspection',
  icon = 'scan',
  product_count = 0
WHERE name = '3D Scanners';

UPDATE product_categories SET 
  description = 'High-precision laser engraving and cutting machines',
  icon = 'zap',
  product_count = 0
WHERE name = 'Laser Engravers';

UPDATE product_categories SET 
  description = 'Engineering-grade filaments: PLA, PETG, ABS, TPU, Nylon, Carbon Fiber',
  icon = 'layers',
  product_count = 0
WHERE name = 'Filaments';

UPDATE product_categories SET 
  description = 'High-performance photopolymer resins for SLA printing',
  icon = 'droplet',
  product_count = 0
WHERE name = 'Resins';

UPDATE product_categories SET 
  description = 'Essential accessories and upgrades for your 3D printing workflow',
  icon = 'settings',
  product_count = 0
WHERE name = 'Accessories';

UPDATE product_categories SET 
  description = 'Genuine spare parts and replacement components',
  icon = 'wrench',
  product_count = 0
WHERE name = 'Spare Parts';

-- =====================================================================
-- 8. UPDATE PRODUCTS WITH MISSING DATA
-- =====================================================================
UPDATE products SET 
  build_volume = '220 x 220 x 250mm',
  layer_resolution = '0.1 - 0.35mm',
  short_description = 'High-speed FDM printer with Klipper firmware',
  description = 'High-speed FDM printer with Klipper firmware for professional quality at blazing speeds. Features input shaping for vibration compensation.',
  features = ARRAY['High Speed Printing', 'Klipper Firmware', 'Input Shaper', 'WiFi Control'],
  badges = ARRAY['New'],
  specifications = '{"Print Speed": "Up to 500mm/s", "Nozzle Diameter": "0.4mm", "Bed Type": "PEI Spring Steel", "Connectivity": "WiFi, USB, SD Card"}'::jsonb
WHERE slug = 'creality-ender-3-v3-ke';

UPDATE products SET 
  build_volume = '300 x 300 x 300mm',
  layer_resolution = '0.1 - 0.35mm',
  short_description = 'Flagship CoreXY with AI LiDAR and enclosed chamber',
  description = 'Creality flagship CoreXY printer with AI-assisted printing and enclosed build chamber for consistent results with engineering materials.',
  features = ARRAY['AI LiDAR', 'Enclosed Chamber', 'CoreXY Motion', 'Klipper OS'],
  badges = ARRAY['Flagship'],
  specifications = '{"Print Speed": "Up to 600mm/s", "Acceleration": "20000mm/s²", "Nozzle Diameter": "0.4mm", "Connectivity": "WiFi, Ethernet, USB"}'::jsonb
WHERE slug = 'creality-k1-max';

UPDATE products SET 
  short_description = 'High-speed CoreXY 3D printer',
  features = ARRAY['CoreXY Motion', 'Enclosed Chamber', 'High Speed', 'Klipper Firmware'],
  badges = ARRAY['Best Seller'],
  specifications = '{"Print Speed": "Up to 600mm/s", "Build Volume": "220 x 220 x 250mm", "Nozzle Diameter": "0.4mm", "Connectivity": "WiFi, USB, SD Card"}'::jsonb
WHERE slug = 'creality-k1';

UPDATE products SET 
  short_description = 'Professional large-format CoreXY printer',
  features = ARRAY['Large Format', 'Multi-color Capability', 'Advanced Automation', 'Industrial Grade'],
  badges = ARRAY['Flagship'],
  specifications = '{"Print Speed": "Up to 600mm/s", "Build Volume": "350 x 350 x 350mm", "Nozzle Diameter": "0.4mm", "Connectivity": "WiFi, Ethernet, USB"}'::jsonb
WHERE slug = 'creality-k2-plus';

UPDATE products SET 
  short_description = 'User-friendly high-speed desktop printer',
  features = ARRAY['Automatic Calibration', 'Quiet Operation', 'Excellent Print Quality', 'Easy to Use'],
  badges = ARRAY['Popular'],
  specifications = '{"Print Speed": "Up to 500mm/s", "Build Volume": "256 x 256 x 256mm", "Nozzle Diameter": "0.4mm", "Connectivity": "WiFi, LAN, USB"}'::jsonb
WHERE slug = 'bambu-lab-a1';

UPDATE products SET 
  build_volume = '256 x 256 x 256mm',
  layer_resolution = '0.08 - 0.28mm',
  short_description = 'Professional enclosed CoreXY with AMS',
  description = 'Professional enclosed CoreXY with AMS for production-quality multi-color prints. Supports engineering materials like ABS, ASA, and PA.',
  features = ARRAY['Enclosed Build Chamber', 'AMS Multi-color', 'CoreXY Motion', 'Aux Fan'],
  badges = ARRAY['Best Seller'],
  specifications = '{"Print Speed": "Up to 500mm/s", "AMS": "4 Color Printing", "Enclosed": "Yes", "Connectivity": "WiFi, LAN, USB"}'::jsonb
WHERE slug = 'bambu-lab-p1s';

UPDATE products SET 
  build_volume = '256 x 256 x 256mm',
  layer_resolution = '0.08 - 0.28mm',
  short_description = 'Flagship carbon fiber CoreXY with AI monitoring',
  description = 'The Bambu Lab X1 Carbon is a flagship professional 3D printer with carbon fiber construction, AI-assisted printing, and micro-LiDAR for first-layer inspection.',
  features = ARRAY['Carbon Fiber Construction', 'AI Micro-LiDAR', 'AMS Multi-color', 'Enclosed Chamber'],
  badges = ARRAY['Flagship'],
  specifications = '{"Print Speed": "Up to 500mm/s", "AMS": "4 Color Printing", "Enclosed": "Yes", "Connectivity": "WiFi, LAN, USB"}'::jsonb
WHERE slug = 'bambu-lab-x1-carbon';

UPDATE products SET 
  build_volume = '220 x 220 x 280mm',
  layer_resolution = '0.1 - 0.4mm',
  short_description = 'Value high-speed FDM with direct drive',
  description = 'Excellent value high-speed FDM printer with direct drive extruder and Klipper-like features at an accessible price point.',
  features = ARRAY['High Speed', 'Direct Drive', 'Auto Leveling', 'Silent Drivers'],
  badges = ARRAY['Value Pick'],
  specifications = '{"Print Speed": "Up to 500mm/s", "Nozzle Diameter": "0.4mm", "Bed Type": "PEI Magnetic", "Motherboard": "32-bit"}'::jsonb
WHERE slug = 'elegoo-neptune-4-pro';

UPDATE products SET 
  build_volume = '195 x 122 x 210mm',
  layer_resolution = '0.02 - 0.2mm',
  short_description = 'High-value 16K MSLA with tilt release',
  description = 'High value 16K resin printer with tilt release for easier part removal. Built-in heater ensures consistent resin temperature.',
  features = ARRAY['16K Monochrome', 'Tilt Release', 'Built-in Heater', 'Air Purifier'],
  badges = ARRAY['Value Pick'],
  specifications = '{"Resolution": "16K Mono", "Build Plate": "Laser Carved", "Light Source": "405nm UV LED", "Touchscreen": "4 inch IPS"}'::jsonb
WHERE slug = 'elegoo-saturn-4-ultra-16k';

UPDATE products SET 
  build_volume = '143.4 x 90 x 165mm',
  layer_resolution = '0.01 - 0.15mm',
  short_description = 'Compact high-resolution resin printer',
  description = 'Compact high-resolution MSLA resin printer for detailed miniatures, jewelry, and dental models.',
  features = ARRAY['High Resolution', 'Fast Printing', 'Monochrome LCD', 'Easy Leveling'],
  badges = ARRAY['New'],
  specifications = '{"Resolution": "High Res Mono", "Light Source": "UV LED", "XY Resolution": "25µm", "Z Resolution": "10µm"}'::jsonb
WHERE slug = 'anycubic-photon-mono-m7-pro';

-- =====================================================================
-- 9. SET PRODUCT IMAGES FROM LOCAL FILES
-- =====================================================================
UPDATE products SET image_url = '/images/products/Creality_Ender_3_V3_SE.jpg' WHERE slug = 'creality-ender-3-v3-ke';
UPDATE products SET image_url = '/images/products/Anycubic_Kobra_3_Max.jpg' WHERE slug = 'creality-k1-max';
UPDATE products SET image_url = '/images/products/20260203_152621.jpg' WHERE slug = 'creality-k1';
UPDATE products SET image_url = '/images/products/20260116_161520.jpg' WHERE slug = 'creality-k2-plus';
UPDATE products SET image_url = '/images/products/20250319_121025.jpg' WHERE slug = 'bambu-lab-a1';
UPDATE products SET image_url = '/images/products/IMG_2215.JPG' WHERE slug = 'bambu-lab-p1s';
UPDATE products SET image_url = '/images/products/IMG-20170407-WA0013.jpg' WHERE slug = 'bambu-lab-x1-carbon';
UPDATE products SET image_url = '/images/products/infinyt_3dlodo.jpg' WHERE slug = 'elegoo-neptune-4-pro';
UPDATE products SET image_url = '/images/products/infinyt3d_lsoso.jpg' WHERE slug = 'elegoo-saturn-4-ultra-16k';
UPDATE products SET image_url = '/images/products/ABS_Filament_1kg_(Infinyt_3D).png' WHERE slug = 'anycubic-photon-mono-m7-pro';

-- =====================================================================
-- 10. SEED EMAIL SETTINGS
-- =====================================================================
INSERT INTO email_settings (recipients, sender_name, subject_prefix, is_active)
SELECT ARRAY['info@infinyt3d.com'], 'Infinyt3D', '[Enquiry]', true
WHERE NOT EXISTS (SELECT 1 FROM email_settings);

-- Update existing row if no recipients set
UPDATE email_settings SET 
  recipients = ARRAY['info@infinyt3d.com'],
  sender_name = 'Infinyt3D',
  subject_prefix = '[Enquiry]'
WHERE recipients IS NULL OR array_length(recipients, 1) IS NULL;
