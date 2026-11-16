import { BASE } from "@/lib/store/llmsBase";
import { fetchCasePosts, postMarkdown } from "@/lib/store/casePosts";

// /llms-full.txt — /llms.txt 안내 + 게시된 진행 사례 글 전문(마크다운). AI 도구가 한 번에 읽어 가는 용도
export const dynamic = "force-dynamic";

export async function GET() {
  const list = (await fetchCasePosts(undefined, 600)) || [];
  const posts = (await Promise.all(list.map((p) => fetchCasePosts(p.slug, 600)))).map((r) => r?.[0]).filter(Boolean);
  const body = posts.length ? "\n\n# 진행 사례\n\n" + posts.map((p) => postMarkdown(p!).replace(/^# /, "## ").replace(/^## /gm, (m, i) => (i === 0 ? m : "### "))).join("\n---\n\n") : "";
  return new Response(BASE + body + "\n", {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=0, s-maxage=600, stale-while-revalidate=3600" },
  });
}
