import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// These placeholders are only used while building without deployment secrets.
// They never grant access to a Supabase project; configure the variables before
// serving the application.
export const supabase = createBrowserClient(
  supabaseUrl || "http://127.0.0.1:54321",
  supabaseKey || "missing-supabase-publishable-key"
);
