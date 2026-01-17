# 🚀 Vercel Deployment Guide

Complete guide to deploy your Business Listing Platform to Vercel.

## Why Vercel?

✅ **Native Next.js Support** - Made by the creators of Next.js  
✅ **Zero Configuration** - Auto-detects Next.js projects  
✅ **Automatic Optimizations** - Built-in performance optimizations  
✅ **Preview Deployments** - Automatic preview URLs for PRs  
✅ **Better DX** - Seamless Git integration  

---

## 📋 Prerequisites

1. ✅ Vercel account ([sign up here](https://vercel.com/signup))
2. ✅ GitHub/GitLab/Bitbucket repository connected
3. ✅ Supabase project configured
4. ✅ Environment variables ready

---

## 🎯 Quick Start (5 Minutes)

### Step 1: Connect Repository to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **"Import Project"**
3. Select your GitHub repository
4. Vercel will auto-detect Next.js

### Step 2: Configure Project Settings

**Build Settings** (usually auto-detected):
- **Framework Preset**: Next.js (auto-detected)
- **Root Directory**: `./` (default)
- **Build Command**: `prisma generate && next build`
- **Output Directory**: `.next` (auto-detected)
- **Install Command**: `npm install`

### Step 3: Add Environment Variables

Go to **Project Settings** → **Environment Variables** and add:

#### Required Variables:

```
DATABASE_URL=postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR_PROJECT_REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Optional Variables:

```
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

**Important:**
- ✅ No quotes around values
- ✅ Add to **Production**, **Preview**, and **Development** environments
- ✅ Use **Connection Pooling** URL (port 6543) for `DATABASE_URL`

### Step 4: Deploy!

Click **"Deploy"** - Vercel will:
1. Install dependencies
2. Generate Prisma Client
3. Build Next.js app
4. Deploy to production

🎉 **Done!** Your site will be live at `https://your-project.vercel.app`

---

## 🔍 Detailed Setup Instructions

### 1. Environment Variables Setup

#### Where to Find Values:

| Variable | Location |
|----------|----------|
| `DATABASE_URL` | Supabase → Settings → Database → Connection Pooling → Transaction mode |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API → anon public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API → service_role key |

#### How to Add in Vercel:

1. Go to your project in Vercel Dashboard
2. Click **Settings** → **Environment Variables**
3. Click **"Add New"**
4. Enter **Key** and **Value**
5. Select environments: ✅ Production, ✅ Preview, ✅ Development
6. Click **"Save"**

#### DATABASE_URL Format:

```
postgresql://postgres.[PROJECT_REF]:[YOUR_PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
```

**Example:**
```
postgresql://postgres.abcdefghijklmnop:your_password@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
```

---

### 2. Build Configuration

Vercel automatically detects Next.js, but you can customize in `vercel.json`:

```json
{
  "buildCommand": "prisma generate && next build",
  "installCommand": "npm install"
}
```

**Or in Vercel Dashboard:**
- **Settings** → **General** → **Build & Development Settings**
- **Build Command**: `prisma generate && next build`
- **Output Directory**: `.next` (auto-detected)

---

### 3. Prisma Setup

Vercel needs to generate Prisma Client during build. Two options:

#### Option A: Build Command (Recommended)
```
prisma generate && next build
```

#### Option B: Postinstall Script
In `package.json`:
```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

**Recommendation:** Use Option A (build command) for better error visibility.

---

## 🔄 Automatic Deployments

### Production Deployments
- **Trigger**: Push to `main` branch
- **URL**: `https://your-project.vercel.app`

### Preview Deployments
- **Trigger**: Push to any branch or open PR
- **URL**: `https://your-project-git-branch.vercel.app`
- **Benefits**: Test changes before merging

---

## ⚙️ Advanced Configuration

### Custom Domain

1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Update DNS records as instructed
4. SSL certificate auto-generated

### Environment-Specific Variables

In **Environment Variables** settings, you can:
- Set different values for **Production**, **Preview**, and **Development**
- Use different `DATABASE_URL` for staging

### Node.js Version

Vercel uses Node.js 18.x by default. To change:
- Add `.nvmrc` file (already present)
- Or set in `package.json` engines field

---

## 🐛 Troubleshooting

### Build Fails: "Prisma Client not generated"

**Solution:** Ensure build command includes `prisma generate`:
```bash
prisma generate && next build
```

### Build Fails: "DATABASE_URL not found"

**Solution:** 
1. Check environment variables are added
2. Ensure they're enabled for **Production** environment
3. Redeploy after adding variables

### Build Fails: "Module not found"

**Solution:**
1. Run `npm install` locally
2. Check `package.json` has all dependencies
3. Ensure `node_modules` is in `.gitignore`

### Slow Builds

**Solution:**
- Enable Vercel's build cache
- Use `npm ci` instead of `npm install` in build command

### Database Connection Issues

**Solution:**
- Use **Connection Pooling** URL (port 6543)
- Add `?pgbouncer=true&connection_limit=1` to `DATABASE_URL`
- Check Supabase project is not paused

---

## 📊 Monitoring & Logs

### View Build Logs

1. Go to **Deployments** tab
2. Click on a deployment
3. View build logs in real-time

### View Runtime Logs

1. Go to **Deployments** tab
2. Click on a deployment
3. Click **"Functions"** tab
4. View serverless function logs

### Performance Monitoring

Vercel Analytics (optional):
1. **Settings** → **Analytics**
2. Enable **Web Analytics**
3. View performance metrics

---

## ✅ Post-Deployment Checklist

After successful deployment:

- [ ] Homepage loads correctly
- [ ] API routes work (`/api/businesses`, etc.)
- [ ] Database connections successful
- [ ] Authentication works (signup/login)
- [ ] File uploads work (Supabase Storage)
- [ ] Environment variables loaded correctly
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active

---

## 🆚 Vercel vs Netlify

| Feature | Vercel | Netlify |
|---------|--------|---------|
| Next.js Support | ✅ Native (made by Vercel) | ✅ Plugin required |
| Zero Config | ✅ Yes | ⚠️ Requires config |
| Preview Deploys | ✅ Automatic | ✅ Automatic |
| Build Speed | ⚡ Fast | 🐢 Slower |
| Prisma Support | ✅ Excellent | ⚠️ Needs setup |
| Free Tier | ✅ Generous | ✅ Generous |

**Recommendation:** Use **Vercel** for Next.js projects - it's optimized for it!

---

## 🔗 Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Prisma on Vercel](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
- [Environment Variables Guide](https://vercel.com/docs/concepts/projects/environment-variables)

---

## 💡 Pro Tips

1. **Use Preview Deployments** - Test before merging to main
2. **Enable Analytics** - Monitor performance
3. **Set up Custom Domain** - Professional URL
4. **Use Vercel CLI** - Deploy from terminal: `vercel`
5. **Enable Git Comments** - Automatic PR comments with preview URLs

---

## 🚀 Quick Deploy Commands

### Deploy from CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Update Environment Variables via CLI

```bash
vercel env add DATABASE_URL production
```

---

**Need Help?** Check [Vercel Support](https://vercel.com/support) or your deployment logs!
