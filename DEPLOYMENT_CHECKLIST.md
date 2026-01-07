# 🚀 Netlify Deployment Checklist

Use this checklist **BEFORE** every deployment to ensure success.

## ✅ Pre-Deployment (Do This First!)

### 1. Local Build Test
```bash
# Clean build
rm -rf node_modules .next package-lock.json
npm install
npx prisma generate
npm run build
```
- [ ] Build completes without errors
- [ ] No TypeScript errors
- [ ] No missing dependencies

### 2. Code Quality
- [ ] No hardcoded passwords or secrets
- [ ] All environment variables use `process.env`
- [ ] `.env` files are in `.gitignore`
- [ ] No console.logs with sensitive data

### 3. Configuration Files
- [ ] `netlify.toml` exists and is correct
- [ ] `package.json` has correct build script
- [ ] `prisma/schema.prisma` has binary targets
- [ ] `.nvmrc` specifies Node version

### 4. Environment Variables (Netlify Dashboard)
Go to: **Site Settings → Build & deploy → Environment**

- [ ] `DATABASE_URL` is set (port 6543, with pgbouncer)
- [ ] `NEXT_PUBLIC_SUPABASE_URL` is set
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is set
- [ ] All values have NO quotes
- [ ] All values have NO spaces

### 5. Build Settings (Netlify Dashboard)
- [ ] Build command: `npm ci && npx prisma generate && npm run build`
- [ ] Publish directory: `.next`
- [ ] Node version: `18.17.0` (or blank to use .nvmrc)

### 6. Git Status
- [ ] All changes committed
- [ ] No uncommitted files
- [ ] Ready to push to main branch

---

## 🎯 Deployment Steps

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Ready for Netlify deployment"
git push origin main
```

### Step 2: Monitor Netlify
1. Go to Netlify Dashboard
2. Watch the deployment
3. Check build logs in real-time

### Step 3: Verify Success
- [ ] Build completes (green checkmark)
- [ ] Site is live
- [ ] No errors in function logs
- [ ] Homepage loads
- [ ] API routes work

---

## 🚨 If Build Fails

### Step 1: Get the Real Error
1. Click "Deploy log" (not summary)
2. Scroll UP from "build.command failed"
3. Find the RED error message
4. Copy the exact error

### Step 2: Check Common Issues

#### Issue: Prisma Client Not Found
**Error**: `Cannot find module '@prisma/client'`

**Fix**:
```toml
# In netlify.toml:
[build]
  command = "npm ci && npx prisma generate && npm run build"
```

#### Issue: DATABASE_URL Not Set
**Error**: `DATABASE_URL is not set`

**Fix**:
1. Go to Netlify Dashboard → Environment
2. Add `DATABASE_URL` with correct value
3. Redeploy

#### Issue: TypeScript Errors
**Error**: Type errors

**Fix**:
1. Run `npm run build` locally
2. Fix all TypeScript errors
3. Commit and push

#### Issue: Module Not Found
**Error**: `Cannot find module 'xyz'`

**Fix**:
1. Check `package.json` has the dependency
2. Run `npm install` locally
3. Commit `package-lock.json`

---

## 📋 Quick Reference

### Build Command (Recommended)
```bash
npm ci && npx prisma generate && npm run build
```

### Environment Variables Format
```
DATABASE_URL=postgresql://user:pass@host:6543/db?pgbouncer=true&connection_limit=1
NEXT_PUBLIC_SUPABASE_URL=https://project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

### Prisma Binary Targets
```prisma
generator client {
  provider      = "prisma-client-js"
  binaryTargets = ["native", "rhel-openssl-1.0.x"]
}
```

---

## 🎉 Success Criteria

Your deployment is successful when:
- ✅ Build completes with exit code 0
- ✅ Site URL is accessible
- ✅ No errors in browser console
- ✅ API routes respond correctly
- ✅ Database connections work

---

**Remember**: If it builds locally, it WILL build on Netlify. The issue is usually configuration, not code!

