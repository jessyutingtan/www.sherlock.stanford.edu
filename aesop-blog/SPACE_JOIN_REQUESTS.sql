-- SQL for Space Join Request System
-- Run this in Supabase SQL Editor

-- 1. Create space_join_requests table
CREATE TABLE IF NOT EXISTS space_join_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  space_id UUID REFERENCES collaborative_spaces(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Prevent duplicate requests
  UNIQUE(space_id, user_id)
);

-- 2. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_space_join_requests_space_id ON space_join_requests(space_id);
CREATE INDEX IF NOT EXISTS idx_space_join_requests_user_id ON space_join_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_space_join_requests_status ON space_join_requests(status);

-- 3. Enable RLS
ALTER TABLE space_join_requests ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies for space_join_requests
-- Users can view their own requests
CREATE POLICY "Users can view their own join requests"
  ON space_join_requests FOR SELECT
  USING (auth.uid() = user_id);

-- Space creators can view requests for their spaces
CREATE POLICY "Space creators can view requests for their spaces"
  ON space_join_requests FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM collaborative_spaces
      WHERE id = space_join_requests.space_id
      AND creator_id = auth.uid()
    )
  );

-- Users can create join requests
CREATE POLICY "Users can create join requests"
  ON space_join_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id AND status = 'pending');

-- Space creators can update requests (approve/reject)
CREATE POLICY "Space creators can update join requests"
  ON space_join_requests FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM collaborative_spaces
      WHERE id = space_join_requests.space_id
      AND creator_id = auth.uid()
    )
  );

-- 5. Create notification entries for join requests
-- Add new notification type to existing notifications table if needed
-- (Assuming notifications table already has a 'space_join_request' type)

-- 6. Create function to automatically add collaborator when request is approved
CREATE OR REPLACE FUNCTION handle_approved_space_join_request()
RETURNS TRIGGER AS $$
BEGIN
  -- If request was just approved
  IF NEW.status = 'approved' AND OLD.status = 'pending' THEN
    -- Add user to space_collaborators
    INSERT INTO space_collaborators (space_id, user_id, role, joined_at)
    VALUES (NEW.space_id, NEW.user_id, 'contributor', NOW())
    ON CONFLICT (space_id, user_id) DO NOTHING;

    -- Create notification for the requester
    INSERT INTO notifications (user_id, type, actor_id, created_at, is_read)
    VALUES (NEW.user_id, 'space_invite',
            (SELECT creator_id FROM collaborative_spaces WHERE id = NEW.space_id),
            NOW(), false);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Create trigger for approved requests
DROP TRIGGER IF EXISTS on_space_join_request_approved ON space_join_requests;
CREATE TRIGGER on_space_join_request_approved
  AFTER UPDATE ON space_join_requests
  FOR EACH ROW
  EXECUTE FUNCTION handle_approved_space_join_request();

-- 8. Add comments
COMMENT ON TABLE space_join_requests IS 'Join requests for collaborative spaces';
COMMENT ON COLUMN space_join_requests.status IS 'Request status: pending, approved, or rejected';
COMMENT ON COLUMN space_join_requests.message IS 'Optional message from requester to space creator';
