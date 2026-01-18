import { PrismaClient } from '@prisma/client'
import { mockPrisma } from './mock-data'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const databaseUrl = process.env.DATABASE_URL

function getPrismaClient() {
  // If DATABASE_URL is not set, use mock data (for preview mode)
  if (!databaseUrl) {
    console.warn('⚠️ DATABASE_URL not set - using mock data. Set DATABASE_URL to connect to Supabase.')
    return mockPrisma as any
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

