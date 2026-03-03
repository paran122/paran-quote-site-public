import { createClient } from "@supabase/supabase-js";
import { env } from "./env";

function initClient() {
  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return null;
  }
  try {
    return createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
      db: { schema: "quote_site" },
    });
  } catch (e) {
    console.warn("[supabase] Client initialization failed:", e);
    return null;
  }
}

export const supabase = initClient();
