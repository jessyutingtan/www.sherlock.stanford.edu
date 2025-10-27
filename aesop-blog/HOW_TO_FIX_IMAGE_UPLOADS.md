# 🔧 HOW TO FIX IMAGE UPLOAD ERRORS

## ❌ The Error You're Seeing:
```
new row violates row-level security policy
```

## ✅ The Fix (3 Easy Steps):

### Step 1: Create Storage Buckets in Supabase

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Click **"Storage"** in the left sidebar
4. Click **"New bucket"** or **"Create a new bucket"**
5. Create first bucket:
   - Name: `avatars`
   - Public bucket: **YES** (check this box!)
   - Click "Create bucket"
6. Create second bucket:
   - Name: `covers`
   - Public bucket: **YES** (check this box!)
   - Click "Create bucket"

### Step 2: Open the SQL File

**IMPORTANT:** You need to copy the CONTENTS of the file, NOT the filename!

1. Open this file in your code editor: `aesop-blog/QUICK_FIX_STORAGE.sql`
2. Press `Ctrl+A` (Windows/Linux) or `Cmd+A` (Mac) to select ALL the text
3. Press `Ctrl+C` (Windows/Linux) or `Cmd+C` (Mac) to copy

The file starts with:
```sql
-- =============================================================================
-- QUICK FIX FOR IMAGE UPLOAD ISSUES
-- =============================================================================
```

And ends with:
```sql
-- Expected result: You should see 8 policies (4 for avatars, 4 for covers)
```

### Step 3: Run the SQL in Supabase

1. In Supabase Dashboard, click **"SQL Editor"** in the left sidebar
2. Click **"New query"**
3. Paste the SQL you copied (Ctrl+V or Cmd+V)
4. Click **"Run"** button (or press Ctrl+Enter)

You should see a table showing 8 policies created:
- Public can view avatars
- Public can view covers
- Users can upload their own avatar
- Users can upload their own covers
- Users can update their own avatar
- Users can update their own covers
- Users can delete their own avatar
- Users can delete their own covers

### Step 4: Test Image Upload

Now try uploading:
- ✅ Profile photo (Edit Profile page)
- ✅ Blog cover image (Write page)
- ✅ Blog content images (Write page, click image icon)

## 🆘 Still Not Working?

If images still fail to upload:

1. **Check buckets exist:**
   - Go to Storage in Supabase
   - You should see `avatars` and `covers` buckets
   - Both should be marked as PUBLIC

2. **Check policies are created:**
   - Go to SQL Editor
   - Run this query:
   ```sql
   SELECT policyname FROM pg_policies 
   WHERE tablename = 'objects' AND schemaname = 'storage';
   ```
   - You should see 8 policies listed

3. **Clear browser cache:**
   - Press Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
   - Or clear cache in browser settings

4. **Log out and log back in:**
   - Sometimes the auth token needs to refresh

## 📝 Common Mistakes:

❌ **DON'T** copy the filename `aesop-blog/QUICK_FIX_STORAGE.sql`  
✅ **DO** open the file and copy the SQL code inside

❌ **DON'T** forget to check "Public bucket" when creating buckets  
✅ **DO** make both buckets PUBLIC

❌ **DON'T** skip creating the buckets before running SQL  
✅ **DO** create buckets FIRST, then run SQL

---

If you're still stuck, check the browser console (F12) for error messages and share them!
