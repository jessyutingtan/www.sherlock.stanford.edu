# Supabase Email Confirmation Setup Guide

This guide explains how to enable and configure email confirmation for user signups in your Aesop Blog application.

## Features Implemented

1. **Email Confirmation Required**: New users must click a confirmation link sent to their email before accessing the app
2. **Onboarding Flow**: After email confirmation, users are redirected to select their Communities and Topics (minimum 3 each)
3. **User-Friendly UI**: Clear messaging about email confirmation status

## Supabase Configuration Steps

### 1. Enable Email Confirmation

1. Go to your Supabase Dashboard: https://brfhmicaevihawrqwyhf.supabase.co
2. Navigate to **Authentication** → **Settings**
3. Under **Email Auth**, ensure the following settings:
   - ✅ **Enable email confirmations** - Toggle this ON
   - ✅ **Confirm email** - Set to "Enabled"
   - ✅ **Secure email change** - Set to "Enabled" (optional but recommended)

### 2. Configure Email Templates

1. In the same Authentication settings page, scroll to **Email Templates**
2. Select **Confirm signup** template
3. The default template should work, but you can customize it:

```html
<h2>Confirm your signup</h2>

<p>Welcome to Aesop Blog!</p>

<p>Follow this link to confirm your account:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm your email</a></p>

<p>If you didn't request this email, you can safely ignore it.</p>
```

### 3. Configure Redirect URLs

1. In Authentication Settings, find **Site URL** and **Redirect URLs**
2. Add your deployment URLs:
   - **Site URL**: `https://jessyutingtan.github.io/www.sherlock.stanford.edu/`
   - **Redirect URLs** (add both):
     - `https://jessyutingtan.github.io/www.sherlock.stanford.edu/#/onboarding`
     - `http://localhost:3000/#/onboarding` (for local development)

### 4. Email Provider Settings

Supabase provides a built-in email service for development, but for production you should:

1. Go to **Project Settings** → **Auth** → **SMTP Settings**
2. Configure your own SMTP provider (recommended for production):
   - Gmail, SendGrid, AWS SES, Mailgun, etc.
   - This ensures better deliverability and no rate limits

**For testing/development**, the built-in Supabase email service works fine.

## How It Works

### User Flow

1. **Sign Up**:
   - User enters username, full name, email, and password
   - Clicks "Create Account"
   - System creates auth user and profile in database

2. **Email Confirmation**:
   - User sees "Check Your Email" message
   - Confirmation email is sent to the registered email
   - User clicks the confirmation link in the email

3. **Onboarding**:
   - After clicking the link, user is redirected to `/onboarding`
   - User selects at least 3 Communities
   - User selects at least 3 Topics
   - Preferences are saved to user profile

4. **Access Granted**:
   - User is redirected to the feed
   - Can now fully use the application

### Technical Implementation

The code handles two scenarios:

```typescript
// If email confirmation is required:
if (signUpData.user && !signUpData.session) {
  setEmailSent(true); // Show confirmation message
}

// If instant confirmation (Supabase setting disabled):
else {
  navigate('/onboarding'); // Go straight to onboarding
}
```

## Testing

### Test Email Confirmation Flow

1. Sign up with a new email address
2. Check your email inbox (and spam folder)
3. Click the confirmation link
4. Verify you're redirected to the onboarding page
5. Complete the Communities and Topics selection
6. Verify you're redirected to the feed

### Troubleshooting

**Issue**: Not receiving confirmation emails
- Check spam/junk folder
- Verify email is correct
- Check Supabase logs: Authentication → Logs
- Ensure rate limits haven't been hit

**Issue**: Confirmation link doesn't work
- Verify redirect URLs are correctly configured
- Check that the link matches your deployment URL
- Ensure HashRouter is being used (required for GitHub Pages)

**Issue**: Already confirmed but can't sign in
- User may need to sign in again on the auth page
- Check Supabase Authentication → Users to verify email_confirmed_at is set

## Database Schema

The system uses a database trigger to automatically create user profiles:

```sql
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, email, created_at)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'full_name',
    NEW.email,
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

The Communities and Topics are stored in the `profiles` table:
- `communities` - TEXT[] array
- `topics` - TEXT[] array

## Security Notes

1. **Email Verification**: Always keep email confirmation enabled in production
2. **Rate Limiting**: Supabase automatically rate-limits signup attempts
3. **Username Uniqueness**: The code checks for duplicate usernames before signup
4. **RLS Policies**: Ensure proper Row Level Security policies are in place

## Support

If you encounter issues:
1. Check Supabase Dashboard → Authentication → Logs
2. Check browser console for errors
3. Verify all configuration settings above
4. Test with a different email provider if needed

---

**Implementation Complete** ✅
- Email confirmation flow
- Onboarding with Communities and Topics
- User-friendly messaging
- Proper error handling
