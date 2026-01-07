# Complete Netlify Deployment Guide - BULLETPROOF VERSION

This guide provides **multiple strategies** to ensure your deployment succeeds.

## 🎯 Strategy 1: Standard Deployment (Recommended)

### Step 1: Verify Local Build Works

**CRITICAL**: If it doesn't work locally, it won't work on Netlify!

```bash
# Clean everything
rm -rf node_modules .next package-lock.json

# Fresh install
npm install

# Generate Prisma
npx prisma generate

# Build
npm run build
```

**If this fails locally, fix the errors first!**

### Step 2: Set Environment Variables in Netlify

Go to: **Netlify Dashboard → Site Settings → Build & deploy → Environment**

Add these **EXACTLY** as shown (no quotes, no spaces):

```
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:6543/postgres?pgbouncer=true&connection_limit=1
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR_ANON_KEY]
SUPABASE_SERVICE_ROLE_KEY=[YOUR_SERVICE_ROLE_KEY]
```

**Important Notes:**
- Use **port 6543** (connection pooling) NOT 5432
- Add `?pgbouncer=true&connection_limit=1` at the end
- NO quotes around values
- NO spaces before/after the `=`

### Step 3: Configure Build Settings

In Netlify Dashboard → Site Settings → Build & deploy:

- **Build command**: `npm ci && npx prisma generate && npm run build`
- **Publish directory**: `.next`
- **Node version**: `18.17.0` (or leave blank to use .nvmrc)

### Step 4: Deploy

1. Push to your main branch
2. Netlify will auto-deploy
3. Watch the build logs

---

## 🎯 Strategy 2: Using Build Script

If Strategy 1 fails, use the build script:

### Update netlify.toml:

```toml
[build]
  command = "chmod +x netlify-build.sh && ./netlify-build.sh"
  publish = ".next"
```

Make sure `netlify-build.sh` is executable:
```bash
chmod +x netlify-build.sh
git add netlify-build.sh
git commit -m "Add Netlify build script"
git push
```

---

## 🎯 Strategy 3: Minimal Configuration

If both strategies fail, try the absolute minimal config:

### netlify.toml (minimal):

```toml
[build]
  command = "npm install && npx prisma generate && npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18.17.0"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

---

## 🎯 Strategy 4: Manual Build Command in Dashboard

Sometimes the netlify.toml doesn't work. Try setting it manually:

1. Go to **Netlify Dashboard → Site Settings → Build & deploy**
2. **Clear** the build command field
3. Set it to: `npm ci && npx prisma generate && npm run build`
4. Set publish directory to: `.next`
5. Save and redeploy

---

## 🔍 Debugging Failed Builds

### Step 1: Get the ACTUAL Error

The "build.command failed" message is useless. You need the real error:

1. Go to your deployment page
2. Click **"Deploy log"** (not the summary)
3. Scroll **UP** from "build.command failed"
4. Look for **red text** or **error messages**
5. Copy the **exact error message**

### Step 2: Common Errors and Fixes

#### Error: "Cannot find module '@prisma/client'"

**Fix:**
```toml
# In netlify.toml, ensure:
[build]
  command = "npm ci && npx prisma generate && npm run build"
```

#### Error: "DATABASE_URL is not set"

**Fix:**
1. Check environment variables are set in Netlify
2. Verify no quotes around values
3. Check for typos in variable names

#### Error: "Type error" or TypeScript errors

**Fix:**
1. Run `npm run build` locally
2. Fix all TypeScript errors
3. Commit and push

#### Error: "Module not found"

**Fix:**
1. Check `package.json` has all dependencies
2. Run `npm install` locally to verify
3. Check for case-sensitive file paths

#### Error: "Prisma Client has not been generated"

**Fix:**
```toml
# In netlify.toml:
[build]
  command = "npm ci && npx prisma generate && npm run build"
```

#### Error: Build timeout

**Fix:**
1. Upgrade Netlify plan (if on free tier)
2. Optimize build (remove unused dependencies)
3. Check for infinite loops in code

---

## ✅ Pre-Deployment Checklist

Before deploying, verify:

- [ ] **Local build works**: `npm run build` succeeds
- [ ] **No TypeScript errors**: `npm run lint` passes
- [ ] **Environment variables set** in Netlify dashboard
- [ ] **DATABASE_URL uses port 6543** (connection pooling)
- [ ] **Prisma binary targets** include `rhel-openssl-1.0.x`
- [ ] **No secrets in code**: Checked with `grep -r "password\|secret\|key" --exclude-dir=node_modules`
- [ ] **.gitignore** includes `.env*` files
- [ ] **netlify.toml** exists and is correct
- [ ] **package.json** has correct build script
- [ ] **All dependencies** are in package.json

---

## 🚨 Emergency Fixes

### If build keeps failing:

1. **Clear Netlify cache:**
   - Go to Site Settings → Build & deploy
   - Click "Clear cache and deploy site"

2. **Use npm instead of npm ci:**
   ```toml
   [build]
     command = "npm install && npx prisma generate && npm run build"
   ```

3. **Skip Prisma in postinstall:**
   ```json
   // In package.json, change:
   "postinstall": "echo 'Skipping prisma generate in postinstall'"
   ```

4. **Disable Next.js plugin temporarily:**
   ```toml
   # Comment out the plugin:
   # [[plugins]]
   #   package = "@netlify/plugin-nextjs"
   ```

5. **Use explicit Node version:**
   ```toml
   [build.environment]
     NODE_VERSION = "18.17.0"
   ```

---

## 📊 Build Log Analysis

When viewing build logs, look for:

1. **Installation phase**: Check if `npm install` succeeds
2. **Prisma generation**: Look for "Generated Prisma Client"
3. **TypeScript compilation**: Check for type errors
4. **Next.js build**: Look for "Creating an optimized production build"
5. **Error messages**: Red text indicates the actual problem

---

## 🔧 Advanced: Custom Build Script

If standard approaches fail, create a custom build script:

### Create `scripts/netlify-build.js`:

```javascript
const { execSync } = require('child_process');

try {
  console.log('Installing dependencies...');
  execSync('npm ci --legacy-peer-deps', { stdio: 'inherit' });
  
  console.log('Generating Prisma Client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  console.log('Building Next.js...');
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('✅ Build successful!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
```

Then in `netlify.toml`:
```toml
[build]
  command = "node scripts/netlify-build.js"
```

---

## 📞 Getting Help

If nothing works:

1. **Copy the FULL build log** (not just the summary)
2. **Share the exact error message** (red text)
3. **Verify environment variables** are set correctly
4. **Test locally** with the same Node version
5. **Check Netlify status**: https://www.netlifystatus.com/

---

## 🎉 Success Indicators

Your build is successful when you see:

- ✅ "Build script returned exit code 0"
- ✅ "Deploy log" shows "Site is live"
- ✅ Your site URL works
- ✅ No errors in function logs

---

## 📝 Final Configuration Files

### netlify.toml (Final Version):
```toml
[build]
  command = "npm ci && npx prisma generate && npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18.17.0"
  NPM_FLAGS = "--legacy-peer-deps"
  PRISMA_SKIP_POSTINSTALL_GENERATE = "true"

[functions]
  external_node_modules = ["@prisma/client", "@prisma/engines"]
  node_bundler = "esbuild"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### package.json scripts:
```json
{
  "scripts": {
    "build": "next build",
    "postinstall": "prisma generate || echo 'Prisma generate skipped'"
  }
}
```

---

**Remember**: If it builds locally, it WILL build on Netlify. The issue is usually:
1. Missing environment variables
2. Wrong Node version
3. Prisma not generating
4. TypeScript errors

Fix these, and you're golden! 🚀

