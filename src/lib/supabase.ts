import { createClient } from "@supabase/supabase-js";
import { env } from "./env";

function initClient() {
  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return null;
  }
  try {
    return createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
      db: { schema: "paran_quote_site" },
      global: {
        fetch: (url, options = {}) => fetch(url, { ...options, cache: "no-store" }),
      },
    });
  } catch (e) {
    console.warn("[supabase] Client initialization failed:", e);
    return null;
  }
}

export const supabase = initClient();

/** 서버 전용 Supabase 클라이언트 (service_role 키, RLS 우회) — API route에서만 사용 */
function initAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  try {
    return createClient(url, key, {
      db: { schema: "paran_quote_site" },
      global: {
        fetch: (url, options = {}) => fetch(url, { ...options, cache: "no-store" }),
      },
    });
  } catch {
    return null;
  }
}

export const supabaseAdmin = initAdminClient();
