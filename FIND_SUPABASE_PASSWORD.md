# How to Find Your Supabase Database Password

## Method 1: Check Project Settings (If You Set It)

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **Database**
4. Scroll down to **Database Settings** section
5. Look for **Database Password** - if you set a custom password, it should be shown here (masked)

## Method 2: Reset Database Password (Recommended)

If you don't remember the password, you can reset it:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **Database**
4. Scroll to **Reset Database Password** section
5. Click **Reset Database Password**
6. **Copy the new password immediately** - Supabase will show it once
7. Update your `.env.local` file with this new password

## Method 3: Use Connection Pooling Password (Easier)

For connection pooling (which you're using), you might use a different password:

1. Go to **Settings** → **Database**
2. Find **Connection string** section
3. Click on **URI** tab
4. You'll see a connection string like:
   ```
   postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```
5. The `[PASSWORD]` shown here might be different from the database password
6. Try using the password from the connection string URI directly

## Method 4: Check Your Notes/Password Manager

- Check if you saved the password when you created the project
- Check your password manager (1Password, LastPass, etc.)
- Check any documentation or notes you created

## Important Notes

⚠️ **Security Warning:**
- The database password is sensitive - never share it publicly
- Never commit passwords to git (always use `.env.local` which is in `.gitignore`)

📝 **Best Practice:**
- Reset the password if you're unsure
- Save it securely in a password manager
- Use environment variables (`.env.local`) - never hardcode passwords

## Quick Steps to Reset

If you want to reset it now:

1. **Supabase Dashboard** → Your Project
2. **Settings** → **Database**
3. **Reset Database Password** button
4. **Copy password** (shown once!)
5. Update your `.env.local`:

```bash
DATABASE_URL=postgresql://postgres.abcdefghijklmnop:[NEW_PASSWORD_HERE]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
```