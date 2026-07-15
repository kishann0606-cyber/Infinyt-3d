-- Seed categories
INSERT INTO categories (id, name, slug, description, icon, image, product_count) VALUES
  ('11111111-0000-0000-0000-000000000001', 'FDM Printers', 'fdm-printers', 'Professional Fused Deposition Modeling 3D printers for prototyping and production', 'box', 'https://images.pexels.com/photos/8566526/pexels-photo-8566526.jpeg?auto=compress&cs=tinysrgb&w=800', 8),
  ('11111111-0000-0000-0000-000000000002', 'SLA Printers', 'sla-printers', 'High-precision Stereolithography printers for detailed models and jewelry', 'droplet', 'https://images.pexels.com/photos/8438980/pexels-photo-8438980.jpeg?auto=compress&cs=tinysrgb&w=800', 3),
  ('11111111-0000-0000-0000-000000000003', 'Filaments', 'filaments', 'Engineering-grade filaments for professional applications', 'layers', 'https://images.pexels.com/photos/8566528/pexels-photo-8566528.jpeg?auto=compress&cs=tinysrgb&w=800', 6),
  ('11111111-0000-0000-0000-000000000004', 'Resins', 'resins', 'High-performance photopolymer resins for SLA printing', 'flask-conical', 'https://images.pexels.com/photos/8566482/pexels-photo-8566482.jpeg?auto=compress&cs=tinysrgb&w=800', 2),
  ('11111111-0000-0000-0000-000000000005', 'Scanners', 'scanners', 'Professional 3D scanning solutions for reverse engineering and inspection', 'scan', 'https://images.pexels.com/photos/8566472/pexels-photo-8566472.jpeg?auto=compress&cs=tinysrgb&w=800', 2),
  ('11111111-0000-0000-0000-000000000006', 'Accessories', 'accessories', 'Essential accessories and upgrades for your 3D printing workflow', 'settings', 'https://images.pexels.com/photos/8566532/pexels-photo-8566532.jpeg?auto=compress&cs=tinysrgb&w=800', 0)
ON CONFLICT (slug) DO NOTHING;

-- Seed FDM Printer products
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

-- Seed SLA Printer products
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

-- Seed Filament products
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
