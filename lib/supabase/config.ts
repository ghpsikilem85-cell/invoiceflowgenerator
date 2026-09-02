export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/**
 * The generator works with no backend at all. Accounts, saved invoices and the
 * dashboard only light up once these are set, so every call site checks this
 * first instead of throwing at import time.
 */
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

/**
 * Google sign-in needs an OAuth client configured in Google Cloud and enabled
 * in Supabase. Until both are done the provider returns
 * "Unsupported provider: provider is not enabled", so the button stays hidden
 * rather than sending visitors to a raw JSON error page.
 */
export const isGoogleAuthEnabled = process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === "true";
