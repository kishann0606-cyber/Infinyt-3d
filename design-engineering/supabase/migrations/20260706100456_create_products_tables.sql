/*
# Create Products and Categories Tables for Infinyt 3D

1. New Tables
- `categories` - Product categories (FDM Printers, SLA Printers, etc.)
  - id, name, slug, description, icon, image, product_count
- `products` - All products from various brands
  - id, name, slug, brand, category_id (FK), technology, build_volume, layer_resolution
  - price (in INR), image, images (array), badges (array)
  - specifications (JSONB), features (array), description, short_description
  - downloads (JSONB), warranty, related_products (array), faqs (JSONB)
  - in_stock (boolean), featured (boolean), created_at

2. Security
- Enable RLS on all tables.
- Allow anon + authenticated full read access (public catalog).
- Allowanon + authenticated insert/update/delete for admin operations.

3. Notes
- Prices in Indian Rupees (INR)
- Products include Creality, Bambu Lab, Elegoo, Phrozen, Flashforge, Anycubic brands
*/

-- Categories Table
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

-- Products Table
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
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Categories Policies (Public Read)
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

-- Products Policies (Public Read)
DROP POLICY IF EXISTS "anon_read_products" ON products;
CREATE POLICY "anon_read_products" ON products FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_write_products" ON products;
CREATE POLICY "anon_write_products" ON products FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_products" ON products;
CREATE POLICY "anon_update_products" ON products FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_products" ON products;
CREATE POLICY "anon_delete_products" ON products FOR DELETE
  TO anon, authenticated USING (true);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
