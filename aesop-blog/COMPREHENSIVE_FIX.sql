-- Comprehensive Database Fixes
-- Run this SQL in Supabase SQL Editor

-- 1. CREATE PROFILE TRIGGER FOR NEW USERS
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, email, created_at, communities, topics)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substring(NEW.id::text, 1, 8)),
    NEW.raw_user_meta_data->>'full_name',
    NEW.email,
    NOW(),
    '{}',
    '{}'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- 2. ADD RLS POLICY FOR NOTIFICATION INSERTS
-- Allow users to create notifications for other users
CREATE POLICY IF NOT EXISTS "Users can create notifications for others"
  ON notifications
  FOR INSERT
  WITH CHECK (true);

-- 3. EMAIL NOTIFICATION PREFERENCES
-- Add column for email notification preferences if it doesn't exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email_notifications BOOLEAN DEFAULT true;

-- 4. ENSURE VIEWS COLUMN EXISTS AND IS UPDATABLE  
-- The views column should already exist, but ensure RLS allows updates
CREATE POLICY IF NOT EXISTS "Anyone can update post views"
  ON posts
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

COMMENT ON POLICY "Anyone can update post views" ON posts IS 'Allows view count updates from anyone';

-- 5. VERIFY ALL TABLES HAVE PROPER INDEXES
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_actor_id ON notifications(actor_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_likes_post_id ON likes(post_id);
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON likes(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);

-- Display summary
SELECT 'Database fixes applied successfully!' AS status;
