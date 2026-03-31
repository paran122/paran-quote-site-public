import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin-auth";

export async function POST(request: Request) {
  try {
    const authed = await isAuthenticated();
    if (!authed) {
      return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
    }

    const { paths } = (await request.json()) as { paths: string[] };
    if (!paths || !Array.isArray(paths) || paths.length === 0) {
      return NextResponse.json(
        { error: "paths 배열이 필요합니다." },
        { status: 400 }
      );
    }

    // service role로 signed URL 발급 (1시간 유효)
    const { createClient } = await import("@supabase/supabase-js");
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !serviceKey) {
      return NextResponse.json(
        { error: "Storage not configured" },
        { status: 500 }
      );
    }

    const db = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data, error } = await db.storage
      .from("contact-attachments")
      .createSignedUrls(paths, 60 * 60); // 1시간 유효

    if (error) {
      console.error("[admin/attachments] signed URL error:", error);
      return NextResponse.json(
        { error: "URL 발급에 실패했습니다." },
        { status: 500 }
      );
    }

    const urlMap: Record<string, string> = {};
    for (const item of data || []) {
      if (item.signedUrl && item.path) {
        urlMap[item.path] = item.signedUrl;
      }
    }

    return NextResponse.json({ urls: urlMap });
  } catch (err) {
    console.error("[admin/attachments] Unexpected error:", err);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
