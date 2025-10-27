-- =============================================================================
-- AESOP BLOG - Complete Database Setup SQL
-- =============================================================================
-- This file contains all SQL commands needed to set up the database
-- Run these commands in Supabase SQL Editor: https://supabase.com/dashboard
-- =============================================================================

-- -----------------------------------------------------------------------------
-- STEP 1: Add notification preference columns to profiles table
-- -----------------------------------------------------------------------------
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS notification_web BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS notification_email BOOLEAN DEFAULT false;

-- Verify columns were added
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'profiles'
AND column_name IN ('notification_web', 'notification_email');

-- =============================================================================
-- STEP 2: CREATE STORAGE BUCKETS (CRITICAL!)
-- =============================================================================
-- You MUST create storage buckets in Supabase Dashboard FIRST!
-- These buckets are needed for profile pictures and blog cover images.
--
-- IMPORTANT: Do this in the Supabase Dashboard, NOT via SQL:
-- 1. Go to: https://supabase.com/dashboard/project/YOUR_PROJECT/storage/buckets
-- 2. Click "New bucket" or "Create a new bucket"
-- 3. Create bucket:
--    - Name: avatars
--    - Public bucket: YES (check the box)
--    - Click "Create bucket"
-- 4. Create bucket:
--    - Name: covers
--    - Public bucket: YES (check the box)
--    - Click "Create bucket"
--
-- After creating both buckets, run the SQL policies below (STEP 3)

-- =============================================================================
-- STEP 3: STORAGE POLICIES
-- =============================================================================
-- Run these AFTER creating the buckets in the dashboard (Step 2)
-- These policies control who can upload/view/delete images

-- -----------------------------------------------------------------------------
-- AVATARS BUCKET POLICIES
-- -----------------------------------------------------------------------------

-- Allow authenticated users to upload their own avatars
CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to update their own avatars
CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to delete their own avatars
CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow public read access
CREATE POLICY "Public can view avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');

-- -----------------------------------------------------------------------------
-- COVERS BUCKET POLICIES
-- -----------------------------------------------------------------------------

-- Allow authenticated users to upload their own covers
CREATE POLICY "Users can upload their own covers"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'covers' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to update their own covers
CREATE POLICY "Users can update their own covers"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'covers' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to delete their own covers
CREATE POLICY "Users can delete their own covers"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'covers' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow public read access
CREATE POLICY "Public can view covers"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'covers');


-- =============================================================================
-- STEP 4: VERIFICATION
-- =============================================================================
-- Run these queries to verify everything is set up correctly

-- Check notification columns
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'profiles'
AND column_name IN ('notification_web', 'notification_email');

-- Check storage buckets exist
SELECT id, name, public, created_at
FROM storage.buckets
WHERE name IN ('avatars', 'covers');

-- Expected result: 2 rows showing 'avatars' and 'covers' buckets with public=true

-- Check storage policies
SELECT policyname, cmd, roles
FROM pg_policies
WHERE schemaname = 'storage'
AND tablename = 'objects'
ORDER BY policyname;

-- Expected result: 8 policies (4 for avatars, 4 for covers)


-- =============================================================================
-- TROUBLESHOOTING
-- =============================================================================

-- ERROR: "new row violates row-level security policy"
-- SOLUTION: Make sure you created the buckets and ran all policies above

-- ERROR: "duplicate key value violates unique constraint"
-- SOLUTION: Policy already exists. Either skip it or drop first:
-- DROP POLICY "policy_name_here" ON storage.objects;

-- ERROR: "relation storage.objects does not exist"
-- SOLUTION: You're not using Supabase or storage is not enabled

-- ERROR: Bucket not found
-- SOLUTION: Create the buckets via Dashboard first (see STEP 2)

-- To view all existing policies:
SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';

-- To delete all storage policies and start fresh:
-- DO $$
-- DECLARE
--     pol record;
-- BEGIN
--     FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage'
--     LOOP
--         EXECUTE 'DROP POLICY IF EXISTS "' || pol.policyname || '" ON storage.objects';
--     END LOOP;
-- END $$;

-- To delete buckets (WARNING: This deletes all files!):
-- DELETE FROM storage.buckets WHERE name IN ('avatars', 'covers');
