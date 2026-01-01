# Business Listing Platform

A full-stack business listing platform built with Next.js, Supabase, Prisma, Tailwind CSS, and Shadcn UI.

## Features

- **Public Discovery**: Browse and search businesses
- **Business Owner Dashboard**: Manage business profile, products, and offers
- **Super Admin Panel**: Approve businesses, manage users, and roles
- **Role-Based Access Control**: Secure routes with middleware
- **Image Storage**: Supabase Storage for all media

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL via Supabase
- **ORM**: Prisma
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Styling**: Tailwind CSS + Shadcn UI

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (Supabase or local)
- Supabase account

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   
   Fill in your Supabase credentials:
   - `DATABASE_URL`: Your Supabase PostgreSQL connection string
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key

4. Set up the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

## Database Schema

The Prisma schema includes:
- **User**: Authentication and role management
- **Business**: Business listings with status workflow
- **Product**: Products associated with businesses
- **Offer**: Daily offers and promotions

## Project Structure

```
├── app/
│   ├── admin/          # Super Admin routes
│   ├── dashboard/      # Business Owner routes
│   ├── listings/       # Public business listings
│   ├── business/       # Individual business pages
│   └── layout.tsx      # Root layout
├── components/
│   └── ui/             # Shadcn UI components
├── lib/
│   ├── auth.ts        # Authentication helpers
│   ├── prisma.ts      # Prisma client
│   └── supabase.ts    # Supabase clients
├── middleware.ts      # Route protection
└── prisma/
    └── schema.prisma  # Database schema
```

## Role-Based Access

- **SUPER_ADMIN**: Full access to admin panel
- **BUSINESS_OWNER**: Access to business dashboard
- **USER**: Public access only

## Next Steps

1. Set up Supabase Storage buckets for images
2. Implement authentication pages (sign in/sign up)
3. Build out the public discovery pages
4. Complete the business owner dashboard
5. Add image upload functionality

