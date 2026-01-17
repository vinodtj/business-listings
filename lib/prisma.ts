// Using mock data instead of Prisma for preview mode
import { mockPrisma } from './mock-data'

// Export mock Prisma client that mimics Prisma API
export const prisma = mockPrisma as any

// Note: This is using mock data - no database connection required

