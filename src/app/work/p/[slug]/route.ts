import { fetchCasePosts, fillTemplate, postMarkdown, postUrl, SLUG } from "@/lib/store/casePosts";

// 진행 사례 글 하나: /work/p/<주소이름>   (AI 도구용 마크다운 원문: /work/p/<주소이름>.md)
// 서비스 사이트 글 틀(public/store/work/p/index.html)에 제목·설명·구조화 데이터와 본문을 서버에서 넣어 돌려준다.
// 검색엔진·AI 수집기(스크립트를 안 돌리는 것 포함)가 본문과 사진 alt 를 그대로 읽는다. 견적 구성 칸만 화면 스크립트가 채운다.
// 인트라넷에서 고치면 1~2분 안에 반영(공개 함수 1분 캐시 + CDN 1분).

export const dynamic = "force-dynamic";

const CACHE = {
  "Cache-Control": "public, max-age=0, must-revalidate",
  "Netlify-CDN-Cache-Control": "public, s-maxage=60, stale-while-revalidate=600",
};

async function template(origin: string) {
  const res = await fetch(new URL("/store/work/p/index.html", origin), { next: { revalidate: 300 }, signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`template ${res.status}`);
  return res.text();
}

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  const raw = decodeURIComponent(params.slug || "").toLowerCase();
  const isMd = raw.endsWith(".md");
  const slug = isMd ? raw.slice(0, -3) : raw;
  const ok = SLUG.test(slug) && slug.length <= 80;

  if (isMd) {
    const list = ok ? await fetchCasePosts(slug) : [];
    if (list === null) return new Response("잠시 후 다시 시도해 주세요.\n", { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8", "Retry-After": "60" } });
    const post = list[0];
    if (!post) return new Response("사례를 찾을 수 없습니다.\n", { status: 404, headers: { "Content-Type": "text/plain; charset=utf-8" } });
    // 같은 글의 HTML 이 대표 주소. 마크다운은 검색 결과에 따로 나오지 않게
    return new Response(postMarkdown(post), {
      headers: { "Content-Type": "text/markdown; charset=utf-8", Link: `<${postUrl(slug)}>; rel="canonical"`, "X-Robots-Tag": "noindex", ...CACHE },
    });
  }

  const origin = new URL(req.url).origin;
  let tpl: string;
  try {
    tpl = await template(origin);
  } catch (err) {
    console.error("[work/p]", err instanceof Error ? err.message : err);
    return new Response("잠시 후 다시 시도해 주세요.", { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8", "Retry-After": "30" } });
  }
  const list = ok ? await fetchCasePosts(slug) : [];
  if (list === null) {
    // 데이터 서버 오류: 틀 그대로(화면 스크립트가 다시 읽어 그림). 검색엔진에는 잠깐 오류로 알림
    return new Response(tpl, { status: 503, headers: { "Content-Type": "text/html; charset=utf-8", "Retry-After": "60", "Cache-Control": "no-store" } });
  }
  const post = list[0] ?? null;
  return new Response(fillTemplate(tpl, post), { status: post ? 200 : 404, headers: { "Content-Type": "text/html; charset=utf-8", ...CACHE } });
}
