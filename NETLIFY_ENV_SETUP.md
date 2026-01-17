# ⚠️ CRITICAL: Missing Environment Variables in Netlify

## Problem

Your Netlify build is failing because **required environment variables are missing**.

From your build log, I can see only these environment variables are set:
- ✅ `SUPABASE_SERVICE_ROLE_KEY`
- ✅ `NODE_VERSION`

**MISSING:**
- ❌ `DATABASE_URL` - **REQUIRED** for Prisma
- ❌ `NEXT_PUBLIC_SUPABASE_URL` - **REQUIRED** for Supabase client
- ❌ `NEXT_PUBLIC_SUPABASE_ANON_KEY` - **REQUIRED** for Supabase client

## 🚨 Quick Fix: Add Missing Environment Variables

### Step 1: Go to Netlify Dashboard

1. Go to https://app.netlify.com
2. Select your site
3. Go to **Site settings** → **Build & deploy** → **Environment**
4. Click **"Edit variables"** or **"Add a variable"**

### Step 2: Add These Environment Variables

Add these **4 required** environment variables:

#### 1. DATABASE_URL
```
Key: DATABASE_URL
Value: postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
```
**Important**: 
- Use **port 6543** (connection pooling)
- Add `?pgbouncer=true&connection_limit=1` at the end
- Get this from Supabase Dashboard → Project Settings → Database → Connection Pooling

#### 2. NEXT_PUBLIC_SUPABASE_URL
```
Key: NEXT_PUBLIC_SUPABASE_URL
Value: https://[YOUR_PROJECT_REF].supabase.co
```
Get this from Supabase Dashboard → Project Settings → API → Project URL

#### 3. NEXT_PUBLIC_SUPABASE_ANON_KEY
```
Key: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
Get this from Supabase Dashboard → Project Settings → API → anon public key

#### 4. SUPABASE_SERVICE_ROLE_KEY (Already set - verify it's correct)
```
Key: SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
Get this from Supabase Dashboard → Project Settings → API → service_role key

## ✅ Complete List of Required Variables

Add these **4 variables** in Netlify:

| Variable Name | Where to Get It |
|--------------|----------------|
| `DATABASE_URL` | Supabase → Database → Connection Pooling (port 6543) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → API → anon public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → API → service_role key |

## 📋 Step-by-Step Instructions

### In Netlify Dashboard:

1. **Navigate to Environment Variables:**
   - Go to your site
   - **Site settings** (gear icon)
   - **Build & deploy** (left sidebar)
   - **Environment** (under "Build settings")
   - Click **"Edit variables"**

2. **Add Each Variable:**
   - Click **"Add a variable"**
   - Enter the **Key** (exact name as shown above)
   - Enter the **Value** (paste from Supabase)
   - Click **"Save"**
   - Repeat for all 4 variables

3. **Verify:**
   - You should see all 4 variables listed
   - No quotes around values
   - No spaces before/after `=`

4. **Redeploy:**
   - Go to **Deploys** tab
   - Click **"Trigger deploy"** → **"Clear cache and deploy site"**
   - Watch the build logs

## 🔍 How to Get Values from Supabase

### DATABASE_URL:
1. Supabase Dashboard → Your Project
2. **Project Settings** (gear icon) → **Database**
3. Scroll to **Connection Pooling**
4. Select **Transaction mode**
5. Copy the connection string
6. Ensure it uses **port 6543** (not 5432)
7. Add `?pgbouncer=true&connection_limit=1` at the end

### NEXT_PUBLIC_SUPABASE_URL:
1. Supabase Dashboard → Your Project
2. **Project Settings** → **API**
3. Under **Project URL**, copy the URL
4. Format: `https://xxxxx.supabase.co`

### NEXT_PUBLIC_SUPABASE_ANON_KEY:
1. Supabase Dashboard → Your Project
2. **Project Settings** → **API**
3. Under **Project API keys**
4. Find **anon public** key
5. Click to copy (starts with `eyJhbGc...`)

### SUPABASE_SERVICE_ROLE_KEY:
1. Supabase Dashboard → Your Project
2. **Project Settings** → **API**
3. Under **Project API keys**
4. Find **service_role** key
5. Click to copy (starts with `eyJhbGc...`)
6. ⚠️ **Keep this secret!** Never expose in client-side code.

## ⚠️ Important Notes

1. **No Quotes**: Don't add quotes around values in Netlify
2. **No Spaces**: No spaces before/after the `=` sign
3. **Exact Names**: Use the exact variable names (case-sensitive)
4. **Port 6543**: Use connection pooling port (6543), not direct (5432)
5. **Connection String**: Must include `?pgbouncer=true&connection_limit=1`

## 🎯 After Adding Variables

1. **Clear Cache**: Trigger a new deploy with "Clear cache and deploy site"
2. **Watch Logs**: Check build logs to verify all variables are loaded
3. **Verify Build**: Build should now succeed

## 📊 Verify Variables Are Set

After adding, you should see in the build log:
```
Environment variables:
  - DATABASE_URL
  - NEXT_PUBLIC_SUPABASE_URL
  - NEXT_PUBLIC_SUPABASE_ANON_KEY
  - SUPABASE_SERVICE_ROLE_KEY
  - NODE_VERSION
```

If any are missing, the build will fail!

## 🚀 Next Steps

1. Add all 4 missing environment variables
2. Trigger a new deployment
3. Watch the build logs
4. Build should succeed! ✅

---

**This is the #1 reason Netlify builds fail - missing environment variables!**
