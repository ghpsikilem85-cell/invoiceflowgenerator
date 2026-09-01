import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL } from "@/lib/supabase/config";

const SECRET_KEY = process.env.SUPABASE_SECRET_KEY ?? "";

export const isAdminConfigured = Boolean(SUPABASE_URL && SECRET_KEY);

/**
 * A server-only client that bypasses row level security. It exists for one
 * caller: the Stripe webhook, which arrives with no user session but must
 * write a subscription row on that user's behalf.
 *
 * Never import this from a client component, and never expose the key — it
 * has full read/write access to every row in the database.
 */
export function createAdminClient() {
  if (!isAdminConfigured) return null;
  return createClient(SUPABASE_URL, SECRET_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
