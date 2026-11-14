import { NextResponse } from "next/server";

// 홈페이지 사례(2026-11-14). 인트라넷 총괄관리자 화면에서 게시한 것을 서비스 사이트(public/store)의
// site-cases_1.0.js 가 읽는다.
//   ?kind=cases          서비스별 사례(사진 위주)  → public.site_public_service_cases()
//   ?kind=posts          진행 사례 글 목록(본문 뺌) → public.site_public_posts()
//   ?kind=post&slug=...  진행 사례 글 하나         → public.site_public_posts(p_slug)
// 두 함수는 게시된 것의 공개 필드만 돌려준다(anon 실행 허용, 표는 RLS로 총괄관리자만). 그래서 공개 키로 부른다.
// 저장하면 1분 안에 홈페이지에 나오도록 1분 캐시.

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export async function GET(req: Request) {
  const params = new URL(req.url).searchParams;
  const kind = params.get("kind");
  const slug = params.get("slug") ?? "";
  if (kind !== "cases" && kind !== "posts" && kind !== "post") {
    return NextResponse.json({ error: "알 수 없는 요청입니다." }, { status: 400 });
  }
  if (kind === "post" && (!SLUG.test(slug) || slug.length > 80)) {
    return NextResponse.json({ error: "주소를 확인해 주세요." }, { status: 404 });
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return NextResponse.json({ error: "사례 정보를 준비 중입니다." }, { status: 503 });
  }
  const fn = kind === "cases" ? "site_public_service_cases" : "site_public_posts";
  try {
    const res = await fetch(`${url}/rest/v1/rpc/${fn}`, {
      method: "POST",
      headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify(kind === "cases" ? {} : { p_slug: kind === "post" ? slug : null }),
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`rpc ${res.status}`);
    const items = await res.json();
    return NextResponse.json(
      { items: Array.isArray(items) ? items : [] },
      { headers: { "Cache-Control": "public, max-age=60, s-maxage=60, stale-while-revalidate=300" } }
    );
  } catch (err) {
    console.error("[store/cases]", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "잠시 후 다시 시도해 주세요." }, { status: 502 });
  }
}
