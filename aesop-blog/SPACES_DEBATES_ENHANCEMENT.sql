-- SQL Migration for Spaces and Debates Enhancements
-- Run this in your Supabase SQL Editor

-- 1. Add new columns to collaborative_spaces table
ALTER TABLE collaborative_spaces
ADD COLUMN IF NOT EXISTS communities TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS topics TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS keywords TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'concluded'));

-- 2. Add new columns to debates table
ALTER TABLE debates
ADD COLUMN IF NOT EXISTS communities TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS topics TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS keywords TEXT[] DEFAULT '{}';

-- 3. Create indexes for better search performance
CREATE INDEX IF NOT EXISTS idx_spaces_communities ON collaborative_spaces USING GIN (communities);
CREATE INDEX IF NOT EXISTS idx_spaces_topics ON collaborative_spaces USING GIN (topics);
CREATE INDEX IF NOT EXISTS idx_spaces_keywords ON collaborative_spaces USING GIN (keywords);
CREATE INDEX IF NOT EXISTS idx_spaces_status ON collaborative_spaces(status);

CREATE INDEX IF NOT EXISTS idx_debates_communities ON debates USING GIN (communities);
CREATE INDEX IF NOT EXISTS idx_debates_topics ON debates USING GIN (topics);
CREATE INDEX IF NOT EXISTS idx_debates_keywords ON debates USING GIN (keywords);

-- 4. Add comments for documentation
COMMENT ON COLUMN collaborative_spaces.communities IS 'Array of community types this space belongs to';
COMMENT ON COLUMN collaborative_spaces.topics IS 'Array of topic types this space covers';
COMMENT ON COLUMN collaborative_spaces.keywords IS 'Array of searchable keywords for this space';
COMMENT ON COLUMN collaborative_spaces.status IS 'Status of space: active or concluded';

COMMENT ON COLUMN debates.communities IS 'Array of community types this debate belongs to';
COMMENT ON COLUMN debates.topics IS 'Array of topic types this debate covers';
COMMENT ON COLUMN debates.keywords IS 'Array of searchable keywords for this debate';
