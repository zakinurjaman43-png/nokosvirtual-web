import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Route handlers surface configuration errors through their normal error path.
// A harmless local value lets Next compile in CI where production secrets are
// intentionally absent; it cannot authenticate against a real project.
const missingConfiguration = !supabaseUrl || !supabaseServiceRoleKey;

export const supabaseAdmin = createClient(
  supabaseUrl || "http://127.0.0.1:54321",
  supabaseServiceRoleKey || "missing-supabase-service-role-key",
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export function assertSupabaseAdminConfigured() {
  if (missingConfiguration) {
    throw new Error("Konfigurasi Supabase server belum lengkap.");
  }
}
