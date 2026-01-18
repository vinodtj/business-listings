# 🚨 Vercel Environment Variables Setup (URGENT)

Your Vercel deployment is missing environment variables. Follow these steps to fix the "Supabase is not configured" error.

## ⚡ Quick Fix (2 Minutes)

### Step 1: Go to Vercel Dashboard

1. Go to: https://vercel.com/dashboard
2. Click on your project: **business-listing** (or whatever you named it)
3. Click **Settings** (top menu)
4. Click **Environment Variables** (left sidebar)

### Step 2: Add Required Variables

Click **"Add New"** for each variable below:

#### Variable 1: NEXT_PUBLIC_SUPABASE_URL
- **Key**: `NEXT_PUBLIC_SUPABASE_URL`
- **Value**: `https://lryktoswsipkimfmctnj.supabase.co`
- **Environments**: ✅ Production, ✅ Preview, ✅ Development

#### Variable 2: NEXT_PUBLIC_SUPABASE_ANON_KEY
- **Key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value**: `sb_publishable_mXmHBElkPOcLGx4ya0cscA_yrKq1j4o`
- **Environments**: ✅ Production, ✅ Preview, ✅ Development

#### Variable 3: DATABASE_URL
- **Key**: `DATABASE_URL`
- **Value**: `postgresql://postgres.lryktoswsipkimfmctnj:PGgPZQGJo4p4PhWj@db.lryktoswsipkimfmctnj.supabase.co:5432/postgres`
- **Environments**: ✅ Production, ✅ Preview, ✅ Development

#### Variable 4: SUPABASE_SERVICE_ROLE_KEY (Optional but Recommended)
- **Key**: `SUPABASE_SERVICE_ROLE_KEY`
- **Value**: Get from Supabase Dashboard → Settings → API → service_role secret
- **Environments**: ✅ Production, ✅ Preview, ✅ Development

### Step 3: Redeploy

After adding all variables:

1. Go to **Deployments** tab
2. Click **"..."** (three dots) on the latest deployment
3. Click **"Redeploy"**
4. Or push a new commit to trigger auto-deployment

### Step 4: Verify

After redeployment:
1. Visit your site: `https://business-listing-an9x6byif-vinodtjs-projects.vercel.app`
2. Go to `/auth/signup`
3. The error should be gone! 🎉

---

## 📸 Visual Guide

```
Vercel Dashboard
  └── Your Project
      └── Settings
          └── Environment Variables
              └── Add New
                  ├── Key: NEXT_PUBLIC_SUPABASE_URL
                  ├── Value: https://lryktoswsipkimfmctnj.supabase.co
                  └── Environments: [✓ Production] [✓ Preview] [✓ Development]
```

---

## ⚠️ Important Notes

1. **No Quotes**: Don't wrap values in quotes (`"` or `'`)
2. **All Environments**: Make sure to check ✅ for Production, Preview, AND Development
3. **Redeploy Required**: After adding variables, you MUST redeploy for them to take effect
4. **Case Sensitive**: Variable names are case-sensitive (use exactly as shown)

---

## 🔍 How to Verify Variables Are Set

After redeploying, check the deployment logs:

1. Go to **Deployments** tab
2. Click on the deployment
3. Check build logs - should NOT see "Supabase not configured" warnings

---

## 🆘 Still Having Issues?

If the error persists after adding variables and redeploying:

1. **Double-check spelling** of variable names
2. **Verify values** match your `.env` file exactly
3. **Check all environments** are selected (Production, Preview, Development)
4. **Wait 1-2 minutes** after redeploy - sometimes takes time to propagate

---

**Need Help?** Share a screenshot of your Environment Variables page in Vercel dashboard.
