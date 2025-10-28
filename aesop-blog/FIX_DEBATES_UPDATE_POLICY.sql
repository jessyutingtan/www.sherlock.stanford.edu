-- SQL Migration to Fix Debate Update Policy
-- Run this in your Supabase SQL Editor
--
-- ISSUE: Debates cannot be updated (concluded/deleted) because there's no UPDATE policy
-- SOLUTION: Add RLS policy allowing debate creators to update their own debates

-- Add UPDATE policy for debates table
CREATE POLICY "Debate creators can update their debates"
  ON debates
  FOR UPDATE
  USING (auth.uid() = creator_id)
  WITH CHECK (auth.uid() = creator_id);

-- Add DELETE policy for debates table
CREATE POLICY "Debate creators can delete their debates"
  ON debates
  FOR DELETE
  USING (auth.uid() = creator_id);

-- Verify policies are created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'debates';
