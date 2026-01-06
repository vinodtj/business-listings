# Netlify Deployment Guide

This guide explains how to deploy the Business Listing Platform to Netlify.

## Prerequisites

Before deploying, ensure you have:

1. A Netlify account
2. A Supabase project with:
   - PostgreSQL database
   - Storage bucket named `business-images`
   - Auth configured
3. Your GitHub repository connected to Netlify

## Environment Variables

Set these environment variables in Netlify (Site settings → Build & deploy → Environment):

### Required Variables:
```
DATABASE_URL=postgresql://[USER]:[PASSWORD]@[HOST]:[PORT]/[DATABASE]?pgbouncer=true&connection_limit=1
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Important Notes:
- Use the **connection pooling** URL (port 6543) for `DATABASE_URL`
- Add `?pgbouncer=true&connection_limit=1` to the DATABASE_URL for better performance
- Never commit these values to git

## Build Configuration

The repository is already configured with:

### Files:
- **netlify.toml**: Netlify build configuration
- **.nvmrc**: Node.js version specification
- **.npmrc**: npm configuration
- **next.config.js**: Next.js optimizations

### Build Settings:
- **Build command**: `npm run build`
- **Publish directory**: `.next`
- **Node version**: 18.17.0

## Deployment Steps

### Option 1: Automatic Deployment (Recommended)

1. Connect your GitHub repository to Netlify
2. Configure environment variables in Netlify dashboard
3. Netlify will automatically deploy on every push to main branch

### Option 2: Manual Deployment

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod
```

## Post-Deployment

After successful deployment:

1. **Initialize the database**:
   - Run migrations if needed
   - Seed initial data

2. **Create a super admin user**:
   - Sign up through the application
   - Use the `make-admin` script locally to upgrade a user to SUPER_ADMIN

3. **Configure Supabase Storage**:
   - Ensure the `business-images` bucket exists
   - Set appropriate RLS policies (see STORAGE_SETUP.md)

## Troubleshooting

### Build Fails with "DATABASE_URL not set"
- Ensure DATABASE_URL is set in Netlify environment variables
- Check that the database URL uses connection pooling (port 6543)

### Build Fails with Prisma errors
- Prisma Client should be generated during `postinstall`
- Check that `prisma` is in devDependencies

### Runtime errors with Supabase
- Verify all Supabase environment variables are set
- Check that your Supabase project is active

### API routes returning 500 errors
- Check Netlify function logs
- Ensure DATABASE_URL uses connection pooling
- Verify Prisma Client is generated

## Performance Optimization

The deployment is optimized with:
- Standalone output mode
- Package imports optimization
- Function bundling with esbuild
- Security headers

## Monitoring

Monitor your deployment:
- **Netlify Dashboard**: Build logs and function logs
- **Supabase Dashboard**: Database performance and logs
- **Error Tracking**: Set up error monitoring (e.g., Sentry)

## Scaling

For production at scale:
- Use Supabase connection pooling (already configured)
- Consider upgrading Netlify plan for more concurrent functions
- Monitor database connections and optimize queries
- Use CDN for static assets

## Support

If issues persist:
1. Check Netlify build logs for specific errors
2. Review Supabase logs for database issues
3. Ensure all environment variables are correctly set
4. Verify your database is accessible from Netlify's servers

