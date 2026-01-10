import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabaseEnabled = !!(supabaseUrl && supabaseAnonKey);

let supabaseClient: ReturnType<typeof createClient<Database>> | null = null;

if (supabaseEnabled) {
  supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  });
}

export const supabase = supabaseClient as ReturnType<typeof createClient<Database>>;

export function getSupabaseError(): string | null {
  if (!supabaseUrl) return 'VITE_SUPABASE_URL est manquant';
  if (!supabaseAnonKey) return 'VITE_SUPABASE_ANON_KEY est manquant';
  return null;
}
