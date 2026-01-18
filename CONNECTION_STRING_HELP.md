# Database Connection String Issue

The connection is failing with "Tenant or user not found" error. 

## Solution: Get the Correct Connection String

### Method 1: Get Connection String from Supabase Dashboard

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project (ID: `lryktoswsipkimfmctnj`)
3. Go to **Settings** → **Database**
4. Scroll to **Connection string** section
5. Select **URI** tab
6. Copy the connection string - it should look like:
   ```
   postgresql://postgres.lryktoswsipkimfmctnj:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
   ```

### Method 2: Try Direct Connection (Not Pooler)

If the pooler connection doesn't work, try the direct connection:

1. In Supabase Dashboard → Settings → Database
2. Select **Connection string** → **Direct connection** tab
3. Copy that connection string instead

### Method 3: Check Your Project Region

Make sure the region in the connection string matches your project:
- The connection string should point to the correct region
- Check if it says `us-east-1` or another region

## Current Configuration

Your `.env` currently has:
```
DATABASE_URL=postgresql://postgres.lryktoswsipkimfmctnj:PGgPZQGJo4p4PhWj@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
```

## What to Check

1. ✅ Project ID matches: `lryktoswsipkimfmctnj`
2. ✅ Password is set: `PGgPZQGJo4p4PhWj`
3. ❓ Region might be wrong: `us-east-1`
4. ❓ Connection string format might need adjustment

## Next Steps

1. Get the exact connection string from Supabase Dashboard
2. Replace the `DATABASE_URL` in `.env` with the correct one
3. Try running `npx prisma db push` again