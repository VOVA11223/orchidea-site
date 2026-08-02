import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Public client: anon key, read-only via RLS policies. Safe to use for GETs.
export const supabasePublic = createClient(supabaseUrl, anonKey);

// Admin client: service_role key, bypasses RLS. Server-only — never import
// this from a "use client" component or expose it to the browser.
export function supabaseAdmin() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY не задан на сервере (.env.local)");
  }
  return createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });
}
