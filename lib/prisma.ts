import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const databaseUrl = process.env.DATABASE_URL

// Only create Prisma client if DATABASE_URL is available
// This prevents build-time errors when DATABASE_URL is not set
function getPrismaClient(): PrismaClient {
  if (!databaseUrl) {
    // Return a proxy that throws a helpful error when accessed
    return new Proxy({} as PrismaClient, {
      get() {
        throw new Error(
          'Prisma Client is not initialized. DATABASE_URL environment variable is not set. ' +
          'Please set DATABASE_URL in your environment variables.'
        )
      },
    }) as PrismaClient
  }

  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma
  }

  const client = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = client
  }

  return client
}

export const prisma = getPrismaClient()

// Note: We don't call $connect() here because:
// 1. Prisma connects lazily when first query is made
// 2. Calling $connect() in module scope can cause Edge Runtime errors
// 3. Connection will be established automatically on first use

