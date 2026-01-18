# Supabase Backend Setup Guide

This guide will help you set up Supabase backend functionality for business listings.

## Required Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Supabase Project URL
# Get from: Supabase Dashboard → Settings → API → Project URL
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co

# Supabase Anon/Public Key
# Get from: Supabase Dashboard → Settings → API → Project API keys → anon public
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Supabase Service Role Key (for admin/server-side operations)
# Get from: Supabase Dashboard → Settings → API → Project API keys → service_role secret
# ⚠️ KEEP THIS SECRET - Never commit this to git
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Database Connection String
# Get from: Supabase Dashboard → Settings → Database → Connection string → URI
# IMPORTANT: Replace 'your_password' with your actual database password
DATABASE_URL=postgresql://postgres.abcdefghijklmnop:your_password@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1

# Optional: Storage Bucket Name (default: business-images)
NEXT_PUBLIC_STORAGE_BUCKET=business-images
```

## Step-by-Step Setup

### 1. Get Supabase Credentials

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project (or create a new one)
3. Navigate to **Settings** → **API**
4. Copy the following:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role secret** key → `SUPABASE_SERVICE_ROLE_KEY`

### 2. Get Database Connection String

1. In Supabase Dashboard, go to **Settings** → **Database**
2. Scroll to **Connection string** section
3. Select **URI** tab
4. Copy the connection string (it will look like the one above)
5. **IMPORTANT**: Replace `your_password` with your actual database password

### 3. Create `.env.local` File

1. Copy the template above
2. Replace all placeholder values with your actual Supabase credentials
3. Save as `.env.local` in the project root

### 4. Run Database Migrations

After setting up `.env.local`, run Prisma migrations to create the database schema:

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database (creates tables)
npx prisma db push

# Optional: Seed database with initial categories
npx prisma db seed
```

### 5. Set Up Supabase Storage (for image uploads)

1. In Supabase Dashboard, go to **Storage**
2. Create a new bucket named `business-images`
3. Make it **public** (or configure RLS policies)
4. Set up CORS if needed

## Testing the Setup

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Check the console - you should see a message indicating database connection
3. Try registering a business at `/register-business`
4. Check your Supabase database - you should see data in the tables

## Troubleshooting

### Database Connection Issues

- Verify your `DATABASE_URL` is correct
- Make sure you replaced `your_password` with the actual password
- Check if your IP is allowed in Supabase (if using connection pooling)

### Prisma Client Not Generated

```bash
npx prisma generate
```

### Migration Issues

```bash
# Reset database (⚠️ WARNING: This deletes all data)
npx prisma migrate reset

# Or just push schema without resetting
npx prisma db push
```

## What's Enabled Now

With Supabase backend configured:

✅ **Real database storage** - All businesses, categories, users stored in PostgreSQL
✅ **Authentication** - User signup/login via Supabase Auth
✅ **Image uploads** - Business logos and media via Supabase Storage
✅ **Admin features** - Approve/reject businesses
✅ **Real-time data** - All data fetched from database, not mock data

## Fallback to Mock Data

If `DATABASE_URL` is not set, the app automatically falls back to mock data for preview mode.