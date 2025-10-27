-- =============================================================================
-- QUICK FIX FOR IMAGE UPLOAD ISSUES
-- =============================================================================
-- Run this in Supabase SQL Editor to fix "row-level security policy" errors
-- =============================================================================

-- IMPORTANT: Before running this, make sure you have created the buckets:
-- 1. Go to Storage in Supabase Dashboard
-- 2. Create 'avatars' bucket (set as PUBLIC)
-- 3. Create 'covers' bucket (set as PUBLIC)

-- =============================================================================
-- AVATARS BUCKET POLICIES
-- =============================================================================

-- Drop existing policies if they exist (to avoid errors)
DROP POLICY IF EXISTS "Public can view avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;

-- Allow anyone to view avatars
CREATE POLICY "Public can view avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');

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

-- =============================================================================
-- COVERS BUCKET POLICIES
-- =============================================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public can view covers" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own covers" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own covers" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own covers" ON storage.objects;

-- Allow anyone to view cover images
CREATE POLICY "Public can view covers"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'covers');

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

-- =============================================================================
-- VERIFICATION - Run this to check if policies were created
-- =============================================================================

SELECT 
  policyname,
  cmd,
  CASE 
    WHEN roles::text LIKE '%authenticated%' THEN 'authenticated'
    WHEN roles::text LIKE '%public%' THEN 'public'
    ELSE roles::text
  END as roles
FROM pg_policies
WHERE schemaname = 'storage'
AND tablename = 'objects'
AND (policyname LIKE '%avatar%' OR policyname LIKE '%cover%')
ORDER BY policyname;

-- Expected result: You should see 8 policies (4 for avatars, 4 for covers)
