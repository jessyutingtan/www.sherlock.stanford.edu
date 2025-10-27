# Supabase Setup Instructions

## Critical Setup Steps

Follow these steps in order to set up your Aesop Blog application with Supabase.

### Step 1: Run Database Schema

1. Go to your Supabase Dashboard > SQL Editor
2. Open `DATABASE_SCHEMA.sql` from this project
3. Copy and paste the entire content
4. Click **RUN** to create all tables and policies

### Step 2: Run Database Updates

1. Still in SQL Editor
2. Open `DATABASE_UPDATES.sql` from this project
3. Copy and paste the entire content
4. Click **RUN** to add notification preference columns

**This fixes the error:** `Could not find the 'notification_email' column of 'profiles' in the schema cache`

### Step 3: Create Storage Buckets

**CRITICAL** - Image uploads will NOT work without these buckets!

1. Go to Supabase Dashboard > Storage
2. Click **New bucket**
3. Create a bucket named `avatars`
   - Make it **PUBLIC**
   - Click Create
4. Click **New bucket** again
5. Create a bucket named `covers`
   - Make it **PUBLIC**
   - Click Create

### Step 4: Apply Storage Policies

1. Go back to SQL Editor
2. Scroll to the bottom of `DATABASE_UPDATES.sql`
3. Copy the storage policy SQL commands (starting from line 24)
4. Paste and **RUN** them

### Step 5: Update Environment Variables

1. In your project, edit `.env` file
2. Add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### Step 6: Build and Deploy

```bash
cd aesop-blog
npm install
npm run build
```

## Troubleshooting

### Error: "Could not find the 'notification_email' column"
- **Solution:** Run Step 2 above (DATABASE_UPDATES.sql)
- This adds the missing columns to the profiles table

### Error: "Storage bucket 'avatars' does not exist"
- **Solution:** Complete Step 3 above
- You must create both `avatars` and `covers` buckets

### Error: "new row violates row-level security policy"
- **Solution:** Make sure you ran DATABASE_SCHEMA.sql completely
- Check that the `handle_new_user()` trigger exists
- Go to Database > Triggers in Supabase to verify

### Image Uploads Not Working
- **Solution:** Complete Steps 3 AND 4
- Both buckets must be created AND policies must be applied
- Verify buckets are set to PUBLIC

## Features Requiring Setup

| Feature | Required Steps |
|---------|---------------|
| User Signup | Steps 1, 2 |
| Profile Photo Upload | Steps 1, 2, 3, 4 |
| Blog Cover Image Upload | Steps 1, 2, 3, 4 |
| Notification Preferences | Steps 1, 2 |
| All Other Features | Step 1 |

## Verification Checklist

- [ ] DATABASE_SCHEMA.sql executed successfully
- [ ] DATABASE_UPDATES.sql executed successfully
- [ ] `avatars` storage bucket created (PUBLIC)
- [ ] `covers` storage bucket created (PUBLIC)
- [ ] Storage policies applied
- [ ] .env file updated with Supabase credentials
- [ ] Application builds without errors
- [ ] User can sign up successfully
- [ ] User is redirected to onboarding (communities/topics selection)
- [ ] Image uploads work in profile edit
- [ ] Image uploads work in blog post creation

If all checkboxes are complete, your Aesop Blog is ready to use!
