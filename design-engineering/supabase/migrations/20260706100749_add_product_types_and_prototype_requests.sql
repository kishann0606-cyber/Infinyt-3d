/*
# Add Product Type and Reserved Products Table

1. New Column
- Add `product_type` to products table (printer, scanner, filament, resin, accessory, prototype, custom)

2. New Table: `prototype_requests`
- For customer custom product/prototype requests
- Fields: id, name, email, phone, description, files, status, created_at

3. Notes
- Products can now be categorized by type
- Prototype requests allow customers to request custom products
*/

-- Add product_type column
ALTER TABLE products ADD COLUMN IF NOT EXISTS product_type TEXT DEFAULT 'printer';
ALTER TABLE products ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE products ADD COLUMN IF NOT EXISTS meta_title TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS meta_description TEXT;

-- Update existing products with product_type
UPDATE products SET product_type = 'printer' WHERE product_type IS NULL;

-- Create prototype_requests table
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

-- Enable RLS on prototype_requests
ALTER TABLE prototype_requests ENABLE ROW LEVEL SECURITY;

-- Prototype requests policies (public insert, anon read for own)
DROP POLICY IF EXISTS "anon_insert_prototype_requests" ON prototype_requests;
CREATE POLICY "anon_insert_prototype_requests" ON prototype_requests FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_read_prototype_requests" ON prototype_requests;
CREATE POLICY "anon_read_prototype_requests" ON prototype_requests FOR SELECT
  TO anon, authenticated USING (true);

-- Create contact_messages table
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

-- Enable RLS
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_contact_messages" ON contact_messages;
CREATE POLICY "anon_insert_contact_messages" ON contact_messages FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_read_contact_messages" ON contact_messages;
CREATE POLICY "anon_read_contact_messages" ON contact_messages FOR SELECT
  TO anon, authenticated USING (true);

-- Create newsletter_subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  active BOOLEAN DEFAULT true
);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_newsletter" ON newsletter_subscribers;
CREATE POLICY "anon_insert_newsletter" ON newsletter_subscribers FOR INSERT
  TO anon, authenticated WITH CHECK (true);
