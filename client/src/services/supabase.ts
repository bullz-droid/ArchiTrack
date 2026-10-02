import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://nnzbiipgxkgjspesxvva.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

if (!import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn(
    'VITE_SUPABASE_ANON_KEY is not set. Please add your Supabase Anon Key to .env or Vercel Environment Variables.'
  )
}

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey || 'anon-key-placeholder',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
)
