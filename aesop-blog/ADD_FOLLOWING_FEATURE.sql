-- Add Following Feature with Last Checked Tracking
-- Run this SQL in Supabase SQL Editor

-- 1. Add last_checked_at column to follows table
ALTER TABLE follows ADD COLUMN IF NOT EXISTS last_checked_at TIMESTAMPTZ DEFAULT NOW();

-- 2. Update existing rows to have current timestamp
UPDATE follows SET last_checked_at = NOW() WHERE last_checked_at IS NULL;

-- 3. Create index for performance
CREATE INDEX IF NOT EXISTS idx_follows_follower_id ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following_id ON follows(following_id);

-- 4. Create function to update last_checked_at
CREATE OR REPLACE FUNCTION update_follow_last_checked(p_follower_id UUID, p_following_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE follows
  SET last_checked_at = NOW()
  WHERE follower_id = p_follower_id AND following_id = p_following_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Create function to check if followed user has new content
CREATE OR REPLACE FUNCTION has_new_content(p_follower_id UUID, p_following_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_last_checked TIMESTAMPTZ;
  v_has_new BOOLEAN;
BEGIN
  -- Get last checked timestamp
  SELECT last_checked_at INTO v_last_checked
  FROM follows
  WHERE follower_id = p_follower_id AND following_id = p_following_id;

  -- Check if there are any posts or thought bubbles since last check
  SELECT EXISTS (
    SELECT 1 FROM posts
    WHERE author_id = p_following_id
    AND is_published = true
    AND (published_at > v_last_checked OR created_at > v_last_checked)

    UNION ALL

    SELECT 1 FROM thought_bubbles
    WHERE author_id = p_following_id
    AND created_at > v_last_checked
  ) INTO v_has_new;

  RETURN COALESCE(v_has_new, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Ensure RLS policies allow reading follows
CREATE POLICY IF NOT EXISTS "Users can view their own follows"
  ON follows
  FOR SELECT
  USING (follower_id = auth.uid() OR following_id = auth.uid());

CREATE POLICY IF NOT EXISTS "Users can update their own follows"
  ON follows
  FOR UPDATE
  USING (follower_id = auth.uid());

-- Display summary
SELECT 'Following feature migration applied successfully!' AS status;
