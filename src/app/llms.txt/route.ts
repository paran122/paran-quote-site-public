import { fetchCasePosts, postDescription, postUrl } from "@/lib/store/casePosts";
import { BASE } from "@/lib/store/llmsBase";

// /llms.txt — AI 검색·답변 엔진용 사이트 안내(llmstxt.org). 아래 고정 안내 + 인트라넷에서 게시한 진행 사례 글 목록.
// 2026-11-17 다시 씀. 주된 서비스는 행사 디자인. 안내 문구는 src/lib/store/llmsBase.ts. 글 링크는 AI 도구용 마크다운 원문(.md)
export const dynamic = "force-dynamic";



export async function GET() {
  const posts = (await fetchCasePosts(undefined, 600)) || [];
  const cases = posts.length
    ? "\n\n## 진행 사례\n\n" + posts.map((p) => `- [${p.title}](${postUrl(p.slug)}.md): ${postDescription(p)}`).join("\n")
    : "";
  return new Response(BASE + cases + "\n", {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=0, s-maxage=600, stale-while-revalidate=3600" },
  });
}
