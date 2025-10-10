import dotenv from "dotenv";
dotenv.config({ path: "./.env" }); // add this

import { createClient } from "@supabase/supabase-js";

// Use backend environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Fail fast if missing
if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
