import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

if (process.env.NODE_ENV === 'development' && !isSupabaseConfigured) {
  console.warn(
    '⚠️ Supabase environment variables are missing. Storefront will fall back to mock data.'
  );
}

// Public client — only instantiate if configured to prevent "supabaseUrl is required" crash
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false, // stateless e-commerce client
      },
    })
  : null as any;

// Admin client — ONLY usable on the server (API routes, Webhooks, Server Actions)
export const supabaseAdmin =
  typeof window === 'undefined' && supabaseUrl && supabaseServiceRoleKey
    ? createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
          persistSession: false,
        },
      })
    : null;
