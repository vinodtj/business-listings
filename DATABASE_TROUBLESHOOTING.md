# Database Connection Troubleshooting

## Common Issues and Solutions

### Error: "Can't reach database server at `db.xxx.supabase.co:5432`"

This error typically occurs when:
1. Your Supabase database is paused (free tier)
2. Using the wrong connection string format
3. Network/firewall issues

### Solution 1: Check if Database is Paused

If you're on Supabase's free tier, your database might be paused after inactivity:
1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Check if the database shows as "Paused"
4. Click "Restore" or "Resume" to wake it up

### Solution 2: Use Connection Pooling (Recommended for Next.js)

For Next.js applications, Supabase recommends using **connection pooling** instead of direct connections:

**Direct Connection (port 5432)** - ❌ Not recommended for serverless:
```
postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres
```

**Connection Pooler (port 6543)** - ✅ Recommended:
```
postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:6543/postgres?pgbouncer=true
```

**How to get the pooled connection string:**
1. Go to Supabase Dashboard → Your Project
2. Navigate to **Settings** → **Database**
3. Scroll to **Connection string**
4. Select **Connection pooling** tab
5. Choose **Transaction mode** (recommended for Prisma)
6. Copy the connection string
7. Update your `.env` file:
   ```env
   DATABASE_URL="postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:6543/postgres?pgbouncer=true"
   ```

### Solution 3: Verify Environment Variables

Make sure your `.env` file contains:
```env
DATABASE_URL="postgresql://postgres:[YOUR_PASSWORD]@db.[YOUR_PROJECT].supabase.co:6543/postgres?pgbouncer=true"
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR_PROJECT].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_anon_key"
SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"
```

### Solution 4: Test Database Connection

You can test your connection using Prisma:
```bash
npx prisma db pull
```

Or test with a simple script:
```bash
npx tsx -e "import { prisma } from './lib/prisma'; prisma.\$connect().then(() => console.log('✅ Connected')).catch(e => console.error('❌ Error:', e.message))"
```

### Solution 5: Check Supabase Project Status

1. Verify your Supabase project is active
2. Check if you've exceeded any quotas
3. Ensure your IP is not blocked (check Supabase Dashboard → Settings → Database → Connection Pooling)

## After Fixing

1. Restart your Next.js development server:
   ```bash
   npm run dev
   ```

2. The admin page should now load without errors

## Still Having Issues?

- Check Supabase status: https://status.supabase.com
- Review Supabase logs in the Dashboard
- Verify your database credentials are correct
- Make sure you're using the correct project's connection string

