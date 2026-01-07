# Netlify Build Troubleshooting

If your Netlify build is failing with "Command failed with exit code 1", follow these steps:

## 1. Check Environment Variables

Ensure these are set in Netlify Dashboard → Site settings → Build & deploy → Environment:

```
DATABASE_URL=postgresql://[connection-string]?pgbouncer=true&connection_limit=1
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**Important**: 
- Use the **connection pooling** URL (port 6543) for DATABASE_URL
- Add `?pgbouncer=true&connection_limit=1` to the end

## 2. View Full Build Logs

The error summary doesn't show the actual error. To see it:

1. Go to your Netlify deployment page
2. Click "Deploy log"
3. Scroll up from the "build.command failed" message
4. Look for red error messages or stack traces
5. Common errors to look for:
   - `Module not found`
   - `Type error`
   - `Cannot find module '@prisma/client'`
   - `Environment variable not found`

## 3. Common Issues and Solutions

### Issue: Prisma Client Not Generated
**Error**: `Cannot find module '@prisma/client'`

**Solution**: Already fixed in the build command. If still occurring, check that:
- `prisma` is in `devDependencies` ✓
- Build command includes `npx prisma generate` ✓

### Issue: TypeScript Errors
**Error**: Type errors during build

**Solution**: Run locally to identify:
```bash
npm run build
```
Fix any TypeScript errors before deploying.

### Issue: Missing Environment Variables
**Error**: `DATABASE_URL is not set`

**Solution**: 
1. Verify all environment variables are set in Netlify
2. Check for typos in variable names
3. Ensure there are no quotes around values in Netlify UI

### Issue: Database Connection Timeout
**Error**: Connection timeout or `ETIMEDOUT`

**Solution**:
1. Use connection pooling URL (port 6543)
2. Add `?pgbouncer=true&connection_limit=1`
3. Check Supabase database is active

### Issue: Memory Issues
**Error**: `JavaScript heap out of memory`

**Solution**: Not typically an issue for this app, but if it occurs:
1. Upgrade Netlify plan for more build resources
2. Optimize build process

## 4. Build Command Explanation

Current build command in `netlify.toml`:
```toml
[build]
  command = "npx prisma generate && npm run build"
```

This:
1. Generates Prisma Client with correct binary targets
2. Runs Next.js build

The `postinstall` script in `package.json` also runs `prisma generate` during npm install.

## 5. Test Locally with Production Build

To simulate Netlify build locally:

```bash
# Clear everything
rm -rf node_modules .next
rm -f package-lock.json

# Fresh install
npm install

# Generate Prisma
npx prisma generate

# Build
npm run build
```

If this succeeds locally but fails on Netlify, the issue is environment-specific.

## 6. Enable Netlify Debug Logs

To get more detailed logs:

1. Go to Netlify Dashboard
2. Site settings → Build & deploy → Environment
3. Add: `DEBUG` with value `*`
4. Redeploy

This will show more detailed output in build logs.

## 7. Check Netlify Plugin Version

Ensure you're using the latest version:

```toml
[[plugins]]
  package = "@netlify/plugin-nextjs"
```

The plugin is automatically updated by Netlify.

## 8. Contact Support

If the issue persists:

1. Copy the full build log (not just the summary)
2. Share the specific error message (red text before "build.command failed")
3. Verify all environment variables are set
4. Check that the database is accessible from Netlify's servers

## 9. Alternative: Manual Build Command

If automatic detection fails, try a more explicit build:

```toml
[build]
  command = "npm ci && npx prisma generate && npm run build"
  publish = ".next"
```

This ensures a clean install before building.

## 10. Verify Prisma Binary Targets

Check `prisma/schema.prisma`:

```prisma
generator client {
  provider      = "prisma-client-js"
  binaryTargets = ["native", "rhel-openssl-1.0.x"]
}
```

The `rhel-openssl-1.0.x` target is required for Netlify.

---

## Quick Checklist

Before deploying, verify:

- [ ] All environment variables set in Netlify
- [ ] DATABASE_URL uses connection pooling (port 6543)
- [ ] Prisma schema has correct binaryTargets
- [ ] Build works locally with `npm run build`
- [ ] No TypeScript errors
- [ ] All dependencies in package.json
- [ ] .gitignore doesn't exclude necessary files

If all checks pass and build still fails, share the full error message from the build logs.

