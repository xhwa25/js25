import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey)

// Keep the client in one module so components and stores never configure Supabase themselves.
export const supabase: SupabaseClient | null = hasSupabaseConfig
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null

export const supabaseConfigError = hasSupabaseConfig
  ? null
  : 'Supabase environment variables are not configured.'
