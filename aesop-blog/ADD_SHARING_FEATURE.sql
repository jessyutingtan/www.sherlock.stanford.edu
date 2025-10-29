-- Add Enhanced Sharing Feature
-- Run this SQL in Supabase SQL Editor

-- 1. Ensure shares table exists with proper structure
CREATE TABLE IF NOT EXISTS shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  thought_bubble_id UUID REFERENCES thought_bubbles(id) ON DELETE CASCADE,
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT shares_content_check CHECK (
    (post_id IS NOT NULL AND thought_bubble_id IS NULL) OR
    (post_id IS NULL AND thought_bubble_id IS NOT NULL)
  )
);

-- 2. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_shares_user_id ON shares(user_id);
CREATE INDEX IF NOT EXISTS idx_shares_post_id ON shares(post_id);
CREATE INDEX IF NOT EXISTS idx_shares_thought_bubble_id ON shares(thought_bubble_id);
CREATE INDEX IF NOT EXISTS idx_shares_created_at ON shares(created_at DESC);

-- 3. Enable RLS
ALTER TABLE shares ENABLE ROW LEVEL SECURITY;

-- 4. Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view all shares" ON shares;
DROP POLICY IF EXISTS "Users can create their own shares" ON shares;
DROP POLICY IF EXISTS "Users can delete their own shares" ON shares;
DROP POLICY IF EXISTS "Users can update their own shares" ON shares;

-- 5. Create RLS policies
CREATE POLICY "Users can view all shares"
  ON shares
  FOR SELECT
  USING (true);

CREATE POLICY "Users can create their own shares"
  ON shares
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own shares"
  ON shares
  FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own shares"
  ON shares
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 6. Create function to get share count for a post
CREATE OR REPLACE FUNCTION get_post_share_count(p_post_id UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (SELECT COUNT(*)::INTEGER FROM shares WHERE post_id = p_post_id);
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- 7. Create function to get share count for a thought bubble
CREATE OR REPLACE FUNCTION get_bubble_share_count(p_bubble_id UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (SELECT COUNT(*)::INTEGER FROM shares WHERE thought_bubble_id = p_bubble_id);
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- 8. Create function to check if user has shared a post
CREATE OR REPLACE FUNCTION has_user_shared_post(p_user_id UUID, p_post_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS(
    SELECT 1 FROM shares
    WHERE user_id = p_user_id AND post_id = p_post_id
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- 9. Create function to check if user has shared a thought bubble
CREATE OR REPLACE FUNCTION has_user_shared_bubble(p_user_id UUID, p_bubble_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS(
    SELECT 1 FROM shares
    WHERE user_id = p_user_id AND thought_bubble_id = p_bubble_id
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Display summary
SELECT 'Sharing feature migration applied successfully!' AS status;
