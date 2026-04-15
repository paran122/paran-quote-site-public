import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

/** anon 키 클라이언트 → SECURITY DEFINER 함수로 DB 삭제 (RLS 우회) */
function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Missing Supabase env vars");
  return createClient(url, key, { db: { schema: "paran_quote_site" } });
}

/** 서버 전용 Supabase 클라이언트 (service_role 키) */
function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Missing Supabase admin env vars");
  return createClient(url, key);
}

/** Storage 파일 삭제 (Supabase SDK) */
async function deleteStorageFiles(paths: string[]) {
  if (paths.length === 0) return [];
  const errors: string[] = [];
  const admin = getAdminClient();
  // 50개씩 배치
  for (let i = 0; i < paths.length; i += 50) {
    const batch = paths.slice(i, i + 50);
    const { error } = await admin.storage.from("qs-portfolio").remove(batch);
    if (error) {
      errors.push(`Storage batch ${i}: ${error.message}`);
    }
  }
  return errors;
}

export async function POST(req: NextRequest) {
  try {
    const { ids, storagePaths } = (await req.json()) as {
      ids: string[];
      storagePaths: string[];
    };

    if (!ids || ids.length === 0) {
      return NextResponse.json({ error: "No IDs provided" }, { status: 400 });
    }

    const supabase = getClient();

    // 1. DB 삭제 (SECURITY DEFINER 함수)
    const { data, error } = await supabase.rpc("admin_delete_media", {
      media_ids: ids,
    });

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    // 2. Storage 파일 삭제 (Storage API)
    const storageErrors = await deleteStorageFiles(storagePaths);

    return NextResponse.json({
      success: true,
      deleted: data?.deleted_db ?? ids.length,
      storageErrors: storageErrors.length > 0 ? storageErrors : undefined,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
