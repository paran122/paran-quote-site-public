import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/lib/supabase";
import { isQuoteAdminRequest, preflight, withCors } from "@/lib/intranet-auth";

/**
 * 이 견적에 붙은 첨부 파일을 여는 주소(1시간 유효)를 돌려준다.
 * 저장소는 비공개라 DB에는 파일 경로만 있다. 임의 경로가 아니라 그 견적의 첨부만 서명한다.
 */
export function OPTIONS(request: NextRequest) {
  return preflight(request);
}

const VALID_SECONDS = 60 * 60;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const json = (body: unknown, status = 200) =>
    withCors(request, NextResponse.json(body, { status }));

  if (!(await isQuoteAdminRequest(request))) {
    return json({ error: "인증이 필요합니다" }, 401);
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseAdmin || !url || !serviceKey) {
    return json({ error: "DB 미설정" }, 500);
  }
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) {
    return json({ error: "잘못된 요청입니다" }, 400);
  }

  const { data: found, error } = await supabaseAdmin
    .from("quotes")
    .select("attachments")
    .eq("id", id)
    .limit(1);
  if (error) {
    return json({ error: error.message }, 500);
  }
  if (!found || found.length === 0) {
    return json({ error: "견적을 찾을 수 없습니다" }, 404);
  }
  const raw = (found[0] as { attachments?: unknown }).attachments;
  const files = (Array.isArray(raw) ? raw : []).filter(
    (a): a is { name?: string; url: string; size?: number; type?: string } =>
      !!a && typeof a === "object" && typeof (a as { url?: unknown }).url === "string"
  );
  if (files.length === 0) {
    return json({ attachments: [], expires_in: VALID_SECONDS });
  }

  // 이미 주소로 저장된 예전 값은 그대로 돌려주고, 경로만 서명한다
  const paths = files.map((f) => f.url).filter((p) => !/^https?:\/\//i.test(p));
  const signed: Record<string, string> = {};
  if (paths.length > 0) {
    const storage = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data, error: signError } = await storage.storage
      .from("contact-attachments")
      .createSignedUrls(paths, VALID_SECONDS);
    if (signError) {
      console.error("[admin/quotes/attachments] signed URL error:", signError);
      return json({ error: "첨부 주소를 만들지 못했습니다." }, 500);
    }
    for (const item of data || []) {
      if (item.signedUrl && item.path) signed[item.path] = item.signedUrl;
    }
  }

  return json({
    attachments: files.map((f) => ({
      name: f.name ?? "",
      size: f.size ?? null,
      type: f.type ?? "",
      path: f.url,
      // 저장소에서 지워졌으면 null
      open_url: /^https?:\/\//i.test(f.url) ? f.url : signed[f.url] ?? null,
    })),
    expires_in: VALID_SECONDS,
  });
}
