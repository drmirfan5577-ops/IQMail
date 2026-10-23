import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// Missing deployment configuration must not prevent public pages from rendering.
function createConfiguredClient() {
  if (!supabaseUrl || !supabaseAnonKey) return null;
  try {
    const url = new URL(supabaseUrl);
    if (!['http:', 'https:'].includes(url.protocol)) return null;
    return createClient(supabaseUrl, supabaseAnonKey);
  } catch {
    return null;
  }
}

export const supabase = createConfiguredClient();
