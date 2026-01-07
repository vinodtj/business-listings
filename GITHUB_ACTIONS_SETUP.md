# GitHub Actions Setup for Netlify Deployment

This guide explains how to set up GitHub Actions to automatically build and deploy to Netlify.

## 📋 Prerequisites

1. GitHub repository connected to your project
2. Netlify account and site
3. Netlify authentication token
4. Netlify Site ID

## 🔑 Step 1: Get Netlify Credentials

### Get Netlify Auth Token:

1. Go to https://app.netlify.com/user/applications
2. Click **"New access token"**
3. Give it a name (e.g., "GitHub Actions")
4. Click **"Generate token"**
5. **Copy the token immediately** (you won't see it again!)

### Get Netlify Site ID:

1. Go to your Netlify site dashboard
2. Go to **Site settings** → **General**
3. Scroll to **Site details**
4. Copy the **Site ID** (looks like: `abc123-def456-ghi789`)

## 🔐 Step 2: Add Secrets to GitHub

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"**
4. Add these two secrets:

### Secret 1: NETLIFY_AUTH_TOKEN
- **Name**: `NETLIFY_AUTH_TOKEN`
- **Value**: Paste your Netlify auth token from Step 1

### Secret 2: NETLIFY_SITE_ID
- **Name**: `NETLIFY_SITE_ID`
- **Value**: Paste your Netlify Site ID from Step 1

## ✅ Step 3: Verify Workflow Files

The following workflow files are already created:

1. **`.github/workflows/netlify-deploy.yml`** - Builds and deploys to Netlify
2. **`.github/workflows/build-check.yml`** - Verifies builds on PRs

## 🚀 How It Works

### Automatic Deployment:
- **On push to `main`**: Builds and deploys to Netlify production
- **On pull requests**: Only runs build verification (doesn't deploy)

### Workflow Steps:
1. ✅ Checks out code
2. ✅ Sets up Node.js 22
3. ✅ Installs dependencies
4. ✅ Generates Prisma Client
5. ✅ Builds Next.js application
6. ✅ Deploys to Netlify (only on main branch)

## 📊 Monitoring Deployments

### View Workflow Runs:
1. Go to your GitHub repository
2. Click **Actions** tab
3. See all workflow runs and their status

### View Logs:
1. Click on a workflow run
2. Click on a job (e.g., "Build Check")
3. Expand steps to see detailed logs

## 🔧 Troubleshooting

### Issue: "NETLIFY_AUTH_TOKEN not found"
**Fix**: Make sure you added the secret in GitHub Settings → Secrets → Actions

### Issue: "NETLIFY_SITE_ID not found"
**Fix**: Make sure you added the Site ID secret

### Issue: Build fails in GitHub Actions
**Fix**: 
1. Check the workflow logs
2. Compare with local build
3. Ensure all dependencies are in `package.json`

### Issue: Deployment fails
**Fix**:
1. Verify Netlify auth token is valid
2. Check Site ID is correct
3. Ensure environment variables are set in Netlify Dashboard

## 🎯 Benefits of GitHub Actions

1. **Pre-deployment checks**: Catches errors before deploying
2. **Build verification**: Ensures code builds successfully
3. **Automated deployment**: No manual steps needed
4. **Deployment history**: Track all deployments in GitHub
5. **PR checks**: Verify builds before merging

## 📝 Manual Deployment (Alternative)

If you prefer to deploy manually from GitHub Actions:

1. Go to **Actions** tab
2. Select **"Build and Deploy to Netlify"** workflow
3. Click **"Run workflow"**
4. Select branch and click **"Run workflow"**

## 🔄 Workflow Triggers

The workflows run automatically on:
- ✅ Push to `main` branch → Build + Deploy
- ✅ Pull requests → Build verification only
- ✅ Manual trigger → Can be run from Actions tab

## 🛡️ Security Notes

- ✅ Secrets are encrypted and never exposed in logs
- ✅ Only deploy on `main` branch pushes
- ✅ Build verification runs on all PRs
- ✅ No secrets in workflow files

---

## Quick Setup Checklist

- [ ] Get Netlify Auth Token
- [ ] Get Netlify Site ID
- [ ] Add `NETLIFY_AUTH_TOKEN` to GitHub Secrets
- [ ] Add `NETLIFY_SITE_ID` to GitHub Secrets
- [ ] Push code to trigger workflow
- [ ] Verify deployment in Netlify Dashboard

Once secrets are added, the workflow will automatically deploy on every push to `main`! 🚀

