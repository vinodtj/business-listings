# Super Admin Setup Guide

This guide explains how to create a SUPER_ADMIN user to access the admin panel.

## Method 1: Using the Script (Recommended)

1. **First, sign up as a regular user:**
   - Go to http://localhost:3000/auth/signup
   - Create an account with your email and password
   - Remember the email you used

2. **Run the make-admin script:**
   ```bash
   npm run make-admin your-email@example.com
   ```
   
   Or using npx directly:
   ```bash
   npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/make-admin.ts your-email@example.com
   ```

3. **Sign in:**
   - Go to http://localhost:3000/auth/signin
   - Use the email and password you created
   - You'll now have access to `/admin`

## Method 2: Using Prisma Studio (Visual)

1. **Start Prisma Studio:**
   ```bash
   npm run db:studio
   ```

2. **Open your browser** to http://localhost:5555

3. **Navigate to the User model**

4. **Find your user** by email

5. **Click on the user** to edit

6. **Change the `role` field** from `USER` to `SUPER_ADMIN`

7. **Click "Save 1 change"**

8. **Sign in** at http://localhost:3000/auth/signin

## Method 3: Direct Database Query

If you have direct database access, you can run:

```sql
UPDATE users 
SET role = 'SUPER_ADMIN' 
WHERE email = 'your-email@example.com';
```

## Accessing the Admin Panel

Once you're a SUPER_ADMIN:

- **Admin Dashboard:** http://localhost:3000/admin
- **Business Management:** http://localhost:3000/admin/businesses
- **Role Management:** http://localhost:3000/admin/roles

## Notes

- Only SUPER_ADMIN users can access `/admin` routes
- BUSINESS_OWNER users can access `/dashboard` routes
- Regular USER role can only access public pages and register businesses

