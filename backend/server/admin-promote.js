// server/admin-promote.js (example)
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export async function promoteToAdmin(userId) {
  return supabase.from("admins").upsert({ user_id: userId });
}
