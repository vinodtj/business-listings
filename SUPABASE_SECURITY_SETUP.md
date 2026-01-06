# Supabase Security Setup Guide

This guide explains how to enable security features in Supabase, including leaked password protection.

## Enabling Leaked Password Protection (HaveIBeenPwned)

### Step 1: Access Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Settings** (or **Auth** → **Policies** → **Settings**)

### Step 2: Enable Password Protection
1. Scroll down to the **Password Protection** section
2. Find the **"Leaked Password Protection"** option
3. Toggle it **ON**
4. This will enable checking passwords against the HaveIBeenPwned (HIBP) database

### Step 3: Configure Password Requirements (Optional but Recommended)
While you're in the Auth settings, also configure:
- **Minimum password length**: Set to at least 8 characters (recommended: 12)
- **Password complexity**: Enable requirements for:
  - Uppercase letters
  - Lowercase letters
  - Numbers
  - Special characters

### Step 4: Save Changes
Click **Save** to apply the settings

## What This Does

When enabled, Supabase will:
- Check every new password during signup against the HaveIBeenPwned database
- Check passwords when users change their password
- Reject passwords that appear in known data breaches
- Return a clear error message that the application can display to users

## Error Handling in Application

The application has been updated to handle these errors gracefully:
- **Signup page**: Shows user-friendly error messages when passwords are rejected
- **Password reset page**: Displays clear feedback when password changes are rejected
- **Error messages**: Automatically detect and format HIBP-related errors

## Testing

After enabling, test the feature:
1. Try signing up with a known compromised password (e.g., "password123")
2. You should see an error message indicating the password has been compromised
3. Try with a strong, unique password - it should work

## Additional Security Recommendations

### 1. Enable Email Verification
- Go to **Authentication** → **Settings** → **Email Auth**
- Enable **"Confirm email"** to require email verification before account activation

### 2. Enable Rate Limiting
- Go to **Authentication** → **Settings**
- Configure rate limits for:
  - Sign up attempts
  - Sign in attempts
  - Password reset requests

### 3. Enable MFA (Multi-Factor Authentication)
- Go to **Authentication** → **Settings** → **MFA**
- Enable MFA for additional security (optional but recommended for admin accounts)

### 4. Configure Session Management
- Set appropriate session timeout values
- Configure refresh token rotation
- Enable secure cookie settings

### 5. Review Row Level Security (RLS) Policies
- Ensure all database tables have proper RLS policies
- Review policies in **Authentication** → **Policies**

## Monitoring

After enabling security features:
1. Monitor the **Authentication** → **Logs** section for:
   - Failed login attempts
   - Password rejection events
   - Suspicious activity patterns

2. Set up alerts for:
   - Multiple failed login attempts
   - Unusual authentication patterns
   - Account takeover attempts

## Support

If you encounter issues:
1. Check Supabase status: https://status.supabase.com
2. Review Supabase documentation: https://supabase.com/docs/guides/auth
3. Check application logs for specific error messages

## Notes

- Leaked password protection uses the HaveIBeenPwned API
- The check is performed server-side by Supabase
- No passwords are sent to third-party services (only hashed prefixes)
- The feature is free and included with Supabase Auth

