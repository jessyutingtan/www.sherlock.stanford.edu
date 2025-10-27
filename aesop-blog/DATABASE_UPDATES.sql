-- Database Updates for Aesop Blog
-- Run these SQL commands in your Supabase SQL Editor

-- Add notification preference columns to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS notification_web BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS notification_email BOOLEAN DEFAULT false;

-- ============================================
-- STORAGE BUCKETS SETUP (CRITICAL!)
-- ============================================
-- You MUST create storage buckets in Supabase Dashboard for image uploads to work!
--
-- Steps:
-- 1. Go to Supabase Dashboard > Storage
-- 2. Click "New bucket"
-- 3. Create bucket named "avatars" and make it PUBLIC
-- 4. Create bucket named "covers" and make it PUBLIC
-- 5. Then run the storage policies below

-- Storage policies (run AFTER creating the buckets above)
-- For 'avatars' bucket:

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

-- For 'covers' bucket:

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
