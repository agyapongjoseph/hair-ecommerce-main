// backend/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

// Use backend environment variables (set in Render dashboard)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Fail fast if missing
if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
