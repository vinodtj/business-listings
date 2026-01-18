import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const databaseUrl = process.env.DATABASE_URL

// Check if we're in build phase (Next.js static analysis)
const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build' || 
                     (typeof process !== 'undefined' && process.env.NODE_ENV === 'production' && !process.env.VERCEL_ENV && !databaseUrl)

let prismaClientInstance: PrismaClient | null = null

function getPrismaClient(): PrismaClient {
  // During build phase without DATABASE_URL, return a no-op client to allow static analysis
  // The real error will occur at runtime when the API route is actually called
  if (isBuildPhase && !databaseUrl) {
    // Return a proxy that throws helpful errors when methods are called
    return new Proxy({} as PrismaClient, {
      get(_target, prop: string | symbol) {
        if (typeof prop === 'string' && prop in PrismaClient.prototype) {
          return () => {
            throw new Error(
              `DATABASE_URL environment variable is not set. ` +
              `This is required for Prisma operations. ` +
              `Please set DATABASE_URL in your Vercel project settings → Environment Variables. ` +
              `Get your connection string from: Supabase Dashboard → Settings → Database → Connection string`
            )
          }
        }
        return undefined
      },
    }) as PrismaClient
  }

  // Require DATABASE_URL to be set at runtime
  if (!databaseUrl) {
    throw new Error(
      'DATABASE_URL environment variable is not set. ' +
      'Please set DATABASE_URL in your .env file (local) or Vercel environment variables (deployment). ' +
      'Get your connection string from: Supabase Dashboard → Settings → Database → Connection string'
    )
  }

  // If Prisma client already exists in global scope (hot reload), reuse it
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma
  }

  // If client already initialized, return it
  if (prismaClientInstance) {
    return prismaClientInstance
  }

  // Create new Prisma client with connection string
  const client = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })

  // In development, store in global scope to prevent multiple instances during hot reload
  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = client
  }

  prismaClientInstance = client
  return client
}

export const prisma = getPrismaClient()

