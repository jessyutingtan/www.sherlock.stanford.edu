# FIX: notification_email Column Error

## What Does This Error Mean?

When you see:
```
Could not find the 'notification_email' column of 'profiles' in the schema cache
```

This means your Supabase database's `profiles` table is missing the notification preference columns that the application expects.

## How to Fix It

### Step 1: Open Supabase SQL Editor

1. Go to your Supabase Dashboard
2. Click on **SQL Editor** in the left sidebar
3. Click **New query**

### Step 2: Run This SQL Command

Copy and paste this EXACT SQL code:

```sql
-- Add notification preference columns to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS notification_web BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS notification_email BOOLEAN DEFAULT false;
```

### Step 3: Click RUN

Click the **RUN** button (or press Ctrl+Enter / Cmd+Enter)

You should see a success message: "Success. No rows returned"

### Step 4: Verify the Fix

Run this query to verify the columns were added:

```sql
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'profiles'
AND column_name IN ('notification_web', 'notification_email');
```

You should see both columns listed.

## What These Columns Do

- **notification_web**: Controls if user receives in-app notifications (default: true)
- **notification_email**: Controls if user receives email notifications (default: false)

Users can toggle these settings in their Edit Profile page.

## If You Still Get Errors

### Error: "relation 'profiles' does not exist"

This means you haven't run the main DATABASE_SCHEMA.sql file yet.

**Solution:**
1. Go to `aesop-blog/DATABASE_SCHEMA.sql` in your project
2. Copy the ENTIRE file contents
3. Paste into Supabase SQL Editor
4. Click RUN
5. Then run the ALTER TABLE command above

### Error: "column already exists"

This is actually GOOD! It means the columns are already there.

**Solution:**
- Refresh your browser
- Clear your browser cache
- The error should disappear

### Still Not Working?

Check that you're connected to the correct Supabase project:

1. Check your `.env` file
2. Verify `VITE_SUPABASE_URL` matches your project URL
3. Rebuild your app: `npm run build`

## Summary

**Quick Fix (2 minutes):**
1. Open Supabase SQL Editor
2. Run the ALTER TABLE command
3. Done!

The error will disappear and notification preferences will work correctly.
