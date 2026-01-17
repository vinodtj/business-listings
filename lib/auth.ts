import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { prisma } from './prisma'
import { UserRole } from '@prisma/client'

export async function getServerSession() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseAnonKey) {
    // Return null if Supabase is not configured (e.g., during build)
    return null
  }
  
  const cookieStore = cookies()
  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set(name, value)
          } catch {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set(name, '', { ...options, maxAge: 0 })
          } catch {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  return session
}

export async function getCurrentUser() {
  // Return null if DATABASE_URL is not set (e.g., during build)
  if (!process.env.DATABASE_URL) {
    return null
  }

  const session = await getServerSession()
  if (!session?.user?.email) return null

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })
    return user
  } catch (error) {
    // If Prisma is not initialized (e.g., during build), return null
    if (error instanceof Error && error.message.includes('DATABASE_URL')) {
      return null
    }
    throw error
  }
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Unauthorized')
  }
  return user
}

export async function requireRole(role: UserRole) {
  const user = await requireAuth()
  if (user.role !== role) {
    throw new Error('Forbidden')
  }
  return user
}

export async function requireSuperAdmin() {
  return requireRole(UserRole.SUPER_ADMIN)
}

export async function requireBusinessOwner() {
  return requireRole(UserRole.BUSINESS_OWNER)
}

// Helper to check if user is business owner (doesn't throw)
export async function isBusinessOwner() {
  try {
    const user = await getCurrentUser()
    return user?.role === UserRole.BUSINESS_OWNER || user?.role === UserRole.SUPER_ADMIN
  } catch {
    return false
  }
}

