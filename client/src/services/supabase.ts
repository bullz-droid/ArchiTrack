import { createClient } from '@supabase/supabase-js'

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.nnzbiipgxkgjspesxvva_SUPABASE_URL ||
  'https://nnzbiipgxkgjspesxvva.supabase.co'

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.nnzbiipgxkgjspesxvva_SUPABASE_ANON_KEY ||
  import.meta.env.NEXT_PUBLIC_nnzbiipg_a_SUPABASE_ANON_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  ''

if (!supabaseAnonKey) {
  console.warn(
    'Supabase Anon Key is not found in environment variables. Please check Vercel settings.'
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
