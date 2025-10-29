-- Add Comment Functionality to Thought Bubbles
-- Run this SQL in Supabase SQL Editor

-- 1. Add thought_bubble_id column to comments table
ALTER TABLE comments
ADD COLUMN IF NOT EXISTS thought_bubble_id UUID REFERENCES thought_bubbles(id) ON DELETE CASCADE;

-- 2. Update the constraint to allow either post_id OR thought_bubble_id (but not both)
ALTER TABLE comments
DROP CONSTRAINT IF EXISTS comments_content_check;

ALTER TABLE comments
ADD CONSTRAINT comments_content_check CHECK (
  (post_id IS NOT NULL AND thought_bubble_id IS NULL) OR
  (post_id IS NULL AND thought_bubble_id IS NOT NULL)
);

-- 3. Create index for performance
CREATE INDEX IF NOT EXISTS idx_comments_thought_bubble_id ON comments(thought_bubble_id);

-- 4. Create function to get comment count for a thought bubble
CREATE OR REPLACE FUNCTION get_bubble_comment_count(p_bubble_id UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (SELECT COUNT(*)::INTEGER FROM comments WHERE thought_bubble_id = p_bubble_id);
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Display summary
SELECT 'Thought bubble comments migration applied successfully!' AS status;
