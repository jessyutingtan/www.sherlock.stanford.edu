-- Additional schema updates for new features

-- Add notification preferences to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS notification_web BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS notification_email BOOLEAN DEFAULT false;

-- Create storage bucket for user uploads (run this in Supabase Dashboard -> Storage)
-- Storage buckets need to be created via Supabase Dashboard or API
-- Bucket name: 'avatars' - for profile photos
-- Bucket name: 'covers' - for post cover images

-- Storage policies for avatars bucket
-- These should be run after creating the 'avatars' bucket in Supabase Dashboard

-- Allow authenticated users to upload their own avatar
-- CREATE POLICY "Users can upload own avatar" ON storage.objects
--   FOR INSERT TO authenticated
--   WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow public access to view avatars
-- CREATE POLICY "Avatars are publicly accessible" ON storage.objects
--   FOR SELECT TO public
--   USING (bucket_id = 'avatars');

-- Allow users to update their own avatar
-- CREATE POLICY "Users can update own avatar" ON storage.objects
--   FOR UPDATE TO authenticated
--   USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to delete their own avatar
-- CREATE POLICY "Users can delete own avatar" ON storage.objects
--   FOR DELETE TO authenticated
--   USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for covers bucket
-- CREATE POLICY "Users can upload post covers" ON storage.objects
--   FOR INSERT TO authenticated
--   WITH CHECK (bucket_id = 'covers');

-- CREATE POLICY "Covers are publicly accessible" ON storage.objects
--   FOR SELECT TO public
--   USING (bucket_id = 'covers');

-- CREATE POLICY "Users can update own covers" ON storage.objects
--   FOR UPDATE TO authenticated
--   USING (bucket_id = 'covers');

-- CREATE POLICY "Users can delete own covers" ON storage.objects
--   FOR DELETE TO authenticated
--   USING (bucket_id = 'covers');
