'use client'

import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file and ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.'
  )
}

if (supabaseUrl.includes('your_supabase') || supabaseAnonKey.includes('your_anon_key')) {
  console.error(
    '⚠️ Supabase credentials are still using placeholder values. Please update your .env file with actual Supabase credentials.'
  )
}

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

