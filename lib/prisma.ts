import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const databaseUrl = process.env.DATABASE_URL

function getPrismaClient() {
  // Require DATABASE_URL to be set - no more mock data fallback
  if (!databaseUrl) {
    throw new Error(
      'DATABASE_URL environment variable is not set. ' +
      'Please set DATABASE_URL in your .env file to connect to Supabase. ' +
      'Get your connection string from: Supabase Dashboard → Settings → Database → Connection string'
    )
  }

  // If Prisma client already exists in global scope (hot reload), reuse it
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma
  }

  // Create new Prisma client with connection string
  const client = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })

  // In development, store in global scope to prevent multiple instances during hot reload
  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = client
  }

  return client
}

export const prisma = getPrismaClient()

