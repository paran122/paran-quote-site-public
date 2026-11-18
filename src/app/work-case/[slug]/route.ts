import { fetchPortfolioBySlug, fetchPortfolioMedia } from "@/lib/queries";
import { PORTFOLIOS } from "@/lib/portfolioData";
import { fillTemplate } from "@/lib/store/casePosts";
import { portfolioToPost } from "@/lib/store/oldCases";
import type { Portfolio, PortfolioMedia } from "@/types";

// 예전 사례 상세: /work/<주소이름>  (next.config 가 /work/<주소이름> 을 여기로 넘긴다. 대표 주소는 /work/<주소이름> 그대로)
// 예전 화면(옛 메뉴·장바구니 없음·'행사 대행' 문구) 대신, 새 사이트 글 틀(public/store/work/p/index.html)에
// 포트폴리오 표의 내용(개요·본문·현장 사진·영상)을 서버에서 넣어 보여 준다. 새 글(/work/p/…)과 같은 모양.
export const dynamic = "force-dynamic";

const CACHE = {
  "Cache-Control": "public, max-age=0, must-revalidate",
  "Netlify-CDN-Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
};

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  const slug = decodeURIComponent(params.slug || "");
  const origin = new URL(req.url).origin;
  const res = await fetch(new URL("/store/work/p/index.html", origin), { next: { revalidate: 300 }, signal: AbortSignal.timeout(8000) }).catch(() => null);
  if (!res?.ok) return new Response("잠시 후 다시 시도해 주세요.", { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8", "Retry-After": "30" } });
  const tpl = await res.text();

  let portfolio: Portfolio | null = null;
  let dbError = false;
  try {
    portfolio = await fetchPortfolioBySlug(slug);
  } catch {
    dbError = true;
  }
  if (!portfolio) portfolio = PORTFOLIOS.find((p) => p.slug === slug && p.isVisible) ?? null;
  if (!portfolio) {
    // 데이터 서버 오류면 잠깐 오류로(검색엔진이 없는 글로 기억하지 않게), 정말 없으면 404
    return new Response(fillTemplate(tpl, null), {
      status: dbError ? 503 : 404,
      headers: { "Content-Type": "text/html; charset=utf-8", ...(dbError ? { "Retry-After": "60", "Cache-Control": "no-store" } : CACHE) },
    });
  }
  let media: PortfolioMedia[] = [];
  try {
    media = await fetchPortfolioMedia(portfolio.id);
  } catch {
    /* 사진 없이 글만 */
  }
  return new Response(fillTemplate(tpl, portfolioToPost(portfolio, media)), { headers: { "Content-Type": "text/html; charset=utf-8", ...CACHE } });
}
