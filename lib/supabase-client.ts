'use client'

import { createBrowserClient } from '@supabase/ssr'

// Get environment variables - these are embedded at build time in Next.js
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Check if Supabase is properly configured
// Must check for actual values, not just truthy (empty strings would be falsy)
const isConfigured = supabaseUrl && 
                     supabaseAnonKey && 
                     supabaseUrl.trim() !== '' && 
                     supabaseAnonKey.trim() !== '' &&
                     !supabaseUrl.includes('your') &&
                     !supabaseAnonKey.includes('your')

// Create a mock client if env vars are not available (for preview mode)
const createMockClient = () => {
  if (typeof window !== 'undefined') {
    console.warn('⚠️ Supabase not configured - using mock client.')
    console.warn('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl || 'NOT SET')
    console.warn('   NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'SET (length: ' + supabaseAnonKey.length + ')' : 'NOT SET')
    console.warn('   💡 TIP: Restart the dev server (npm run dev) after updating .env file')
  }
  return {
    auth: {
      signInWithPassword: async () => ({ 
        data: null, 
        error: { 
          message: 'Supabase is not configured. Please check your environment variables. Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env file and restart the dev server.' 
        } 
      }),
      signUp: async () => ({ 
        data: null, 
        error: { 
          message: 'Supabase is not configured. Please check your environment variables. Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env file and restart the dev server.' 
        } 
      }),
      signOut: async () => ({ error: null }),
      resetPasswordForEmail: async () => ({ error: null }),
      updateUser: async () => ({ 
        data: null, 
        error: { 
          message: 'Supabase is not configured. Please check your environment variables. Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env file and restart the dev server.' 
        } 
      }),
      getSession: async () => ({ data: { session: null } }),
    },
  } as any
}

// Only create real client if env vars are available, otherwise use mock
export const supabase = isConfigured
  ? createBrowserClient(supabaseUrl, supabaseAnonKey)
  : createMockClient()

// Export helper to check if Supabase is configured
export const isSupabaseConfigured = () => isConfigured