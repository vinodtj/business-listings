import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { prisma } from './lib/prisma'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const pathname = request.nextUrl.pathname

  // Public routes - no authentication required
  const publicRoutes = ['/', '/listings', '/business', '/categories', '/auth', '/register-business']
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))

  // Admin routes - require SUPER_ADMIN role
  const isAdminRoute = pathname.startsWith('/admin')

  // Dashboard routes - require BUSINESS_OWNER role
  const isDashboardRoute = pathname.startsWith('/dashboard')

  // If accessing protected routes without session, redirect to home
  if ((isAdminRoute || isDashboardRoute) && !session) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/'
    return NextResponse.redirect(redirectUrl)
  }

  // Check role-based access
  if (session?.user?.email) {
    try {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
      })

      if (user) {
        // Admin routes - only SUPER_ADMIN can access
        if (isAdminRoute && user.role !== 'SUPER_ADMIN') {
          const redirectUrl = request.nextUrl.clone()
          redirectUrl.pathname = '/'
          return NextResponse.redirect(redirectUrl)
        }

        // Dashboard routes - only BUSINESS_OWNER can access
        if (isDashboardRoute && user.role !== 'BUSINESS_OWNER') {
          const redirectUrl = request.nextUrl.clone()
          redirectUrl.pathname = '/'
          return NextResponse.redirect(redirectUrl)
        }
      }
    } catch (error) {
      console.error('Middleware error:', error)
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

