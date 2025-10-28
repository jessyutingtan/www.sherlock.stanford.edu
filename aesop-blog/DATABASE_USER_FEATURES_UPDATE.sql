-- User Profile & Content Management Features Update
-- This adds support for:
-- 1. Background images on profiles
-- 2. Share/Repost functionality for posts and thought bubbles
-- 3. Enhanced content tracking (views for thought bubbles)

-- Add background_image column to profiles
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS background_image TEXT;

-- Add views column to thought_bubbles (to track read counts like posts)
ALTER TABLE thought_bubbles
ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;

-- Create shares/reposts table for content sharing
CREATE TABLE IF NOT EXISTS shares (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  thought_bubble_id UUID REFERENCES thought_bubbles(id) ON DELETE CASCADE,
  comment TEXT, -- Optional comment when sharing
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Ensure only one type of content is shared per row
  CHECK (
    (post_id IS NOT NULL AND thought_bubble_id IS NULL) OR
    (post_id IS NULL AND thought_bubble_id IS NOT NULL)
  )
);

-- Create index for faster share queries
CREATE INDEX IF NOT EXISTS idx_shares_user_id ON shares(user_id);
CREATE INDEX IF NOT EXISTS idx_shares_post_id ON shares(post_id);
CREATE INDEX IF NOT EXISTS idx_shares_thought_bubble_id ON shares(thought_bubble_id);

-- Create unique constraint to prevent duplicate shares
CREATE UNIQUE INDEX IF NOT EXISTS unique_post_share
  ON shares(user_id, post_id)
  WHERE post_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS unique_thought_bubble_share
  ON shares(user_id, thought_bubble_id)
  WHERE thought_bubble_id IS NOT NULL;

-- Add RLS (Row Level Security) policies for shares
ALTER TABLE shares ENABLE ROW LEVEL SECURITY;

-- Allow users to read all shares
CREATE POLICY "Shares are viewable by everyone"
  ON shares FOR SELECT
  USING (true);

-- Allow users to create their own shares
CREATE POLICY "Users can create their own shares"
  ON shares FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own shares
CREATE POLICY "Users can delete their own shares"
  ON shares FOR DELETE
  USING (auth.uid() = user_id);

-- Update function to increment thought bubble views
CREATE OR REPLACE FUNCTION increment_thought_bubble_views(bubble_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE thought_bubbles
  SET views = views + 1
  WHERE id = bubble_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION increment_thought_bubble_views(UUID) TO authenticated;

COMMENT ON TABLE shares IS 'Stores user shares/reposts of posts and thought bubbles';
COMMENT ON COLUMN profiles.background_image IS 'URL to user profile background/cover image';
COMMENT ON COLUMN thought_bubbles.views IS 'Number of times this thought bubble has been viewed';
