import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL is not set in environment variables')
}

// For Supabase, use connection pooling (port 6543) instead of direct connection (port 5432)
// If your DATABASE_URL uses port 5432, update it to use port 6543 for better connection handling
const databaseUrl = process.env.DATABASE_URL

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Note: We don't call $connect() here because:
// 1. Prisma connects lazily when first query is made
// 2. Calling $connect() in module scope can cause Edge Runtime errors
// 3. Connection will be established automatically on first use

