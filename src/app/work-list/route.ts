import { fetchCasePosts, fillWorkList } from "@/lib/store/casePosts";
import { fetchPortfolios, fetchAllPortfolioMedia } from "@/lib/queries";
import { fillOldCases } from "@/lib/store/oldCases";

// /work (진행 사례 목록) — next.config 가 /work 를 여기로 넘긴다(대표 주소는 /work 그대로, 틀의 canonical).
// 서비스 사이트 목록 틀(public/store/work/index.html)에 게시된 글 카드를 서버에서 넣어, 검색·AI 수집기가
// 목록에서 각 글로 가는 링크를 읽게 한다. 글을 못 읽으면 틀 그대로(예전 사례 목록) 보낸다.
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const origin = new URL(req.url).origin;
  const res = await fetch(new URL("/store/work/index.html", origin), { next: { revalidate: 300 }, signal: AbortSignal.timeout(8000) }).catch(() => null);
  if (!res?.ok) return Response.redirect(new URL("/store/work/index.html", origin), 307);
  const tpl = await res.text();
  const posts = (await fetchCasePosts()) || [];
  let html = fillWorkList(tpl, posts);
  // 예전 사례 목록은 작은 사진·유형이 있는 카드로(표를 못 읽으면 글자 링크 그대로)
  try {
    const [portfolios, media] = await Promise.all([fetchPortfolios(), fetchAllPortfolioMedia()]);
    html = fillOldCases(html, portfolios, media);
  } catch {
    /* 글자 링크 그대로 */
  }
  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
      "Netlify-CDN-Cache-Control": "public, s-maxage=60, stale-while-revalidate=600",
    },
  });
}
