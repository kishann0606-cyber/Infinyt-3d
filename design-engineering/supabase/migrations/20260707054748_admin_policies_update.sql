/*
# Admin Panel RLS Policy Updates

1. Updates for career_applications table
- Add UPDATE policy for admins to change application status
- Add DELETE policy for admins to remove applications
2. Updates for orders table
- Add INSERT policy for anon/authenticated users to place orders
- Add DELETE policy for admins to remove orders
3. Updates for products table
- Restrict DELETE and UPDATE to admins only (currently allows anon)
4. Updates for admin_users table
- Restrict to only actual admin users can access
*/

-- Career applications admin policies
DROP POLICY IF EXISTS "admin_career_update" ON career_applications;
CREATE POLICY "admin_career_update" ON career_applications FOR UPDATE
TO authenticated
USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()));

DROP POLICY IF EXISTS "admin_career_delete" ON career_applications;
CREATE POLICY "admin_career_delete" ON career_applications FOR DELETE
TO authenticated
USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()));

-- Orders: allow anyone to insert (place orders)
DROP POLICY IF EXISTS "orders_insert" ON orders;
CREATE POLICY "orders_insert" ON orders FOR INSERT
TO anon, authenticated WITH CHECK (true);

-- Orders: allow admins to delete
DROP POLICY IF EXISTS "admin_orders_delete" ON orders;
CREATE POLICY "admin_orders_delete" ON orders FOR DELETE
TO authenticated
USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()));

-- Products: restrict UPDATE and DELETE to admins only
DROP POLICY IF EXISTS "anon_update_products" ON products;
CREATE POLICY "admin_products_update" ON products FOR UPDATE
TO authenticated
USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()));

DROP POLICY IF EXISTS "anon_delete_products" ON products;
CREATE POLICY "admin_products_delete" ON products FOR DELETE
TO authenticated
USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()));

-- Products: keep INSERT available for admins
DROP POLICY IF EXISTS "anon_write_products" ON products;
CREATE POLICY "admin_products_insert" ON products FOR INSERT
TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()));

-- Admin users: restrict to actual admins
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