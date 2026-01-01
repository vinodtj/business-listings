# Supabase Storage Setup Guide

To enable image uploads for businesses and products, you need to set up a Supabase Storage bucket.

## Steps to Set Up Storage

1. **Go to your Supabase Dashboard**
   - Navigate to https://supabase.com/dashboard
   - Select your project

2. **Create a Storage Bucket**
   - Go to **Storage** in the left sidebar
   - Click **New bucket**
   - Name: `business-images`
   - Make it **Public** (so images can be accessed via URL)
   - Click **Create bucket**

3. **Set Up Storage Policies (RLS)**
   - Click on the `business-images` bucket
   - Go to **Policies** tab
   - Click **New Policy**
   
   **For Uploads (INSERT):**
   - Policy name: `Allow authenticated users to upload`
   - Allowed operation: `INSERT`
   - Policy definition:
     ```sql
     (bucket_id = 'business-images'::text) AND (auth.role() = 'authenticated'::text)
     ```
   
   **For Reading (SELECT):**
   - Policy name: `Allow public read access`
   - Allowed operation: `SELECT`
   - Policy definition:
     ```sql
     bucket_id = 'business-images'::text
     ```

4. **Verify Setup**
   - Try uploading an image from `/dashboard/images`
   - The image should upload successfully

## File Structure

Images are stored in the following structure:
- `businesses/{businessId}/{filename}` - Business gallery images
- `products/{filename}` - Product images

## Troubleshooting

If uploads fail:
1. Check that the bucket is public
2. Verify RLS policies are set correctly
3. Check browser console for errors
4. Verify `SUPABASE_SERVICE_ROLE_KEY` is set in `.env`

