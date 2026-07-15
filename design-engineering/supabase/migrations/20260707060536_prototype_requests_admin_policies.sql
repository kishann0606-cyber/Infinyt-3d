/*
# Prototype Requests Admin Policies

1. Security
- Enable RLS on prototype_requests (already enabled)
- Allow anon/authenticated users to INSERT (submit requests)
- Allow admins to SELECT, UPDATE, DELETE prototype requests
*/

-- Allow anyone to submit a prototype request
DROP POLICY IF EXISTS "anon_insert_prototype_requests" ON prototype_requests;
CREATE POLICY "anon_insert_prototype_requests" ON prototype_requests FOR INSERT
TO anon, authenticated WITH CHECK (true);

-- Allow admins to read all prototype requests
DROP POLICY IF EXISTS "admin_select_prototype_requests" ON prototype_requests;
CREATE POLICY "admin_select_prototype_requests" ON prototype_requests FOR SELECT
TO authenticated
USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()));

-- Allow admins to update (change status, add notes/price)
DROP POLICY IF EXISTS "admin_update_prototype_requests" ON prototype_requests;
CREATE POLICY "admin_update_prototype_requests" ON prototype_requests FOR UPDATE
TO authenticated
USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()));

-- Allow admins to delete
DROP POLICY IF EXISTS "admin_delete_prototype_requests" ON prototype_requests;
CREATE POLICY "admin_delete_prototype_requests" ON prototype_requests FOR DELETE
TO authenticated
USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()));
