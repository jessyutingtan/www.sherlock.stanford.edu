-- SQL to Reset User Onboarding (FOR TESTING ONLY)
-- Run this in Supabase SQL Editor to clear communities and topics for a specific user
-- This will force them to go through onboarding again

-- OPTION 1: Reset onboarding for a specific user by email
UPDATE profiles
SET communities = '{}', topics = '{}'
WHERE email = 'your.email@example.com';

-- OPTION 2: Reset onboarding for a specific user by username
UPDATE profiles
SET communities = '{}', topics = '{}'
WHERE username = 'your_username';

-- OPTION 3: Reset onboarding for ALL users (CAREFUL!)
-- Uncomment the line below ONLY if you want to reset everyone
-- UPDATE profiles SET communities = '{}', topics = '{}';

-- Verify the reset
SELECT id, username, email, communities, topics
FROM profiles
WHERE email = 'your.email@example.com';
