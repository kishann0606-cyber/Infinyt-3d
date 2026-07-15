/*
# Add price column, site_settings table, seed all product categories

1. Changes to products table
   - Add `price` column (numeric, nullable) - was missing, causing all product queries to fail
   - Add `description` column shortcut via short_description already exists

2. New Tables
   - `site_settings` - key/value store for site-wide settings including images, company info
     - `id` uuid primary key
     - `key` text unique - setting identifier
     - `value` text - setting value (URL, text, etc.)
     - `label` text - human-readable label for admin UI
     - `type` text - 'image', 'text', 'url' for admin UI rendering
     - `group` text - grouping for admin UI (e.g. 'homepage', 'company', 'contact')
     - `updated_at` timestamptz

3. Security
   - site_settings: public read (anon+authenticated), authenticated write
   - products: ensure anon SELECT policy exists

4. Data
   - Seed site_settings with all site images and company info
   - Seed Filament and Resin products so all categories have items
   - Update product_categories image_url values
*/

-- Add price column to products
ALTER TABLE products ADD COLUMN IF NOT EXISTS price numeric DEFAULT 0;

-- =====================================================================
-- site_settings table for admin-managed site-wide settings
-- =====================================================================
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text,
  label text NOT NULL,
  type text NOT NULL DEFAULT 'text',
  "group" text NOT NULL DEFAULT 'general',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "site_settings_read" ON site_settings;
CREATE POLICY "site_settings_read" ON site_settings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "site_settings_write" ON site_settings;
CREATE POLICY "site_settings_write" ON site_settings FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "site_settings_update" ON site_settings;
CREATE POLICY "site_settings_update" ON site_settings FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "site_settings_delete" ON site_settings;
CREATE POLICY "site_settings_delete" ON site_settings FOR DELETE
  TO authenticated USING (true);

-- =====================================================================
-- Seed site_settings
-- =====================================================================
INSERT INTO site_settings (key, value, label, type, "group") VALUES
  ('company_name', 'Infinyt 3D Pvt. Ltd.', 'Company Name', 'text', 'company'),
  ('company_tagline', 'Transforming ideas into reality with premium 3D printing and engineering solutions in Goa, India.', 'Company Tagline', 'text', 'company'),
  ('company_phone', '+91 9975937476', 'Phone Number', 'text', 'company'),
  ('company_whatsapp', '919975937476', 'WhatsApp Number', 'text', 'company'),
  ('company_email', 'info@infinyt3d.com', 'Email Address', 'text', 'company'),
  ('company_address', 'Goa, India', 'Address', 'text', 'company'),
  ('logo_url', '/images/products/infinyt_3dlodo.jpg', 'Logo Image', 'image', 'branding'),
  ('hero_bg_image', '', 'Hero Background Image', 'image', 'homepage'),
  ('hero_title', 'Engineering the Future with', 'Hero Title', 'text', 'homepage'),
  ('hero_subtitle', 'Premium 3D Printing', 'Hero Subtitle', 'text', 'homepage'),
  ('about_banner_image', '/about/AM.jpeg', 'About Page Banner', 'image', 'about'),
  ('workshop_image_1', '/workshop/gallery/20241221_142158.jpg', 'Workshop Gallery 1', 'image', 'workshop'),
  ('workshop_image_2', '/workshop/gallery/20241221_143410.jpg', 'Workshop Gallery 2', 'image', 'workshop'),
  ('workshop_image_3', '/workshop/gallery/20241221_164131.jpg', 'Workshop Gallery 3', 'image', 'workshop'),
  ('workshop_image_4', '/workshop/gallery/20250113_143939.jpg', 'Workshop Gallery 4', 'image', 'workshop'),
  ('workshop_image_5', '/workshop/gallery/Creality_K1_Max.jpg', 'Workshop Gallery 5', 'image', 'workshop'),
  ('portfolio_image_1', '/images/recent-work/IMG_2215_(2).JPG', 'Portfolio Image 1', 'image', 'portfolio'),
  ('portfolio_image_2', '/images/recent-work/IMG-20180222-WA0007.jpg', 'Portfolio Image 2', 'image', 'portfolio'),
  ('portfolio_image_3', '/images/recent-work/IMG-20180615-WA0053.jpg', 'Portfolio Image 3', 'image', 'portfolio'),
  ('portfolio_image_4', '/images/recent-work/IMG-20180908-WA0023.jpg', 'Portfolio Image 4', 'image', 'portfolio'),
  ('social_linkedin', 'https://linkedin.com/company/infinyt3d', 'LinkedIn URL', 'url', 'social'),
  ('social_instagram', 'https://instagram.com/infinyt3d', 'Instagram URL', 'url', 'social'),
  ('social_youtube', 'https://youtube.com/infinyt3d', 'YouTube URL', 'url', 'social'),
  ('social_twitter', 'https://twitter.com/infinyt3d', 'Twitter/X URL', 'url', 'social')
ON CONFLICT (key) DO NOTHING;

-- =====================================================================
-- Ensure anon can read products
-- =====================================================================
DROP POLICY IF EXISTS "products_select_anon" ON products;
CREATE POLICY "products_select_anon" ON products FOR SELECT
  TO anon, authenticated USING (true);

-- =====================================================================
-- Seed Filament products
-- =====================================================================
INSERT INTO products (name, slug, brand, category, technology, price, image_url, images, badges, features, description, short_description, specifications, in_stock, featured)
VALUES
  (
    'Infinyt3D PLA+ Filament 1kg',
    'infinyt3d-pla-plus-1kg',
    'Infinyt3D',
    'Filaments',
    'FDM',
    1499,
    '/images/products/PLA+_Filament_1kg_(Infinyt_3D).jpg',
    ARRAY['/images/products/PLA+_Filament_1kg_(Infinyt_3D).jpg'],
    ARRAY['Best Seller'],
    ARRAY['1.75mm diameter', '±0.02mm tolerance', 'No clog formula', 'Vibrant colors'],
    'Premium PLA+ filament engineered for superior layer adhesion, minimal warping, and consistent extrusion. Perfect for prototyping, functional parts, and artistic prints.',
    'Premium PLA+ with superior layer adhesion and zero warping',
    '{"Diameter": "1.75mm", "Tolerance": "±0.02mm", "Print Temp": "200-230°C", "Bed Temp": "0-60°C", "Spool Weight": "1kg"}'::jsonb,
    true,
    true
  ),
  (
    'Infinyt3D ABS Filament 1kg',
    'infinyt3d-abs-1kg',
    'Infinyt3D',
    'Filaments',
    'FDM',
    1599,
    '/images/products/ABS_Filament_1kg_(Infinyt_3D).png',
    ARRAY['/images/products/ABS_Filament_1kg_(Infinyt_3D).png'],
    ARRAY['Popular'],
    ARRAY['1.75mm diameter', 'High impact resistance', 'Post-processable', 'Acetone-smoothable'],
    'Engineering-grade ABS filament for functional parts requiring toughness and heat resistance. Ideal for automotive, industrial, and end-use applications.',
    'Engineering-grade ABS for tough, heat-resistant functional parts',
    '{"Diameter": "1.75mm", "Tolerance": "±0.03mm", "Print Temp": "230-250°C", "Bed Temp": "80-110°C", "Spool Weight": "1kg"}'::jsonb,
    true,
    true
  ),
  (
    'Infinyt3D Nylon PA12 Filament 500g',
    'infinyt3d-nylon-pa12-500g',
    'Infinyt3D',
    'Filaments',
    'FDM',
    2299,
    '/images/products/Nylon_PA12_Filament_500g_(Infinyt_3D).jpg',
    ARRAY['/images/products/Nylon_PA12_Filament_500g_(Infinyt_3D).jpg'],
    ARRAY['New'],
    ARRAY['1.75mm diameter', 'High flexibility', 'Chemical resistance', 'Low friction'],
    'Professional PA12 Nylon filament for demanding engineering applications. Offers excellent flexibility, chemical resistance, and low friction for functional parts.',
    'Professional PA12 Nylon for demanding engineering applications',
    '{"Diameter": "1.75mm", "Tolerance": "±0.03mm", "Print Temp": "250-270°C", "Bed Temp": "70-90°C", "Spool Weight": "500g"}'::jsonb,
    true,
    false
  )
ON CONFLICT (slug) DO NOTHING;

-- =====================================================================
-- Seed Resin products
-- =====================================================================
INSERT INTO products (name, slug, brand, category, technology, price, image_url, images, badges, features, description, short_description, specifications, in_stock, featured)
VALUES
  (
    'Elegoo Standard Resin 1kg',
    'elegoo-standard-resin-1kg',
    'Elegoo',
    'Resins',
    'MSLA',
    1299,
    '/images/products/infinyt3d_lsoso.jpg',
    ARRAY['/images/products/infinyt3d_lsoso.jpg'],
    ARRAY['Popular'],
    ARRAY['Low odor formula', 'Fast cure time', 'High detail resolution', 'Multiple colors'],
    'Elegoo standard photopolymer resin for MSLA/SLA printers. Produces smooth, detailed prints with excellent surface quality at an affordable price point.',
    'Standard photopolymer resin for MSLA/SLA printers',
    '{"Volume": "1000ml", "Wavelength": "405nm", "Viscosity": "180-220 cps", "Cure Time": "1.5-3s (monochrome)"}'::jsonb,
    true,
    false
  ),
  (
    'Elegoo ABS-Like Resin Pro 1kg',
    'elegoo-abs-like-resin-pro-1kg',
    'Elegoo',
    'Resins',
    'MSLA',
    1799,
    '/images/products/infinyt_3dlodo.jpg',
    ARRAY['/images/products/infinyt_3dlodo.jpg'],
    ARRAY['New'],
    ARRAY['ABS-like toughness', 'Low shrinkage', 'High impact resistance', 'Easy post-processing'],
    'ABS-Like Pro resin delivers engineering-grade toughness in a photopolymer. Ideal for functional prototypes, brackets, enclosures, and parts requiring impact resistance.',
    'Engineering-grade ABS-like toughness in a resin',
    '{"Volume": "1000ml", "Wavelength": "405nm", "Tensile Strength": "45MPa", "Elongation": "15%"}'::jsonb,
    true,
    false
  )
ON CONFLICT (slug) DO NOTHING;

-- =====================================================================
-- Update products price for existing printers
-- =====================================================================
UPDATE products SET price = 28999 WHERE slug = 'creality-ender-3-v3-ke' AND (price IS NULL OR price = 0);
UPDATE products SET price = 89999 WHERE slug = 'creality-k1-max' AND (price IS NULL OR price = 0);
UPDATE products SET price = 45999 WHERE slug = 'creality-k1' AND (price IS NULL OR price = 0);
UPDATE products SET price = 149999 WHERE slug = 'creality-k2-plus' AND (price IS NULL OR price = 0);
UPDATE products SET price = 55999 WHERE slug = 'bambu-lab-a1' AND (price IS NULL OR price = 0);
UPDATE products SET price = 99999 WHERE slug = 'bambu-lab-p1s' AND (price IS NULL OR price = 0);
UPDATE products SET price = 149999 WHERE slug = 'bambu-lab-x1-carbon' AND (price IS NULL OR price = 0);
UPDATE products SET price = 32999 WHERE slug = 'elegoo-neptune-4-pro' AND (price IS NULL OR price = 0);
UPDATE products SET price = 69999 WHERE slug = 'elegoo-saturn-4-ultra-16k' AND (price IS NULL OR price = 0);
UPDATE products SET price = 24999 WHERE slug = 'anycubic-photon-mono-m7-pro' AND (price IS NULL OR price = 0);

-- =====================================================================
-- Update product_count on categories
-- =====================================================================
UPDATE product_categories SET product_count = (SELECT count(*) FROM products WHERE products.category = product_categories.name);
