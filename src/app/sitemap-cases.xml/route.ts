import { fetchCasePosts, postImages, postUrl } from "@/lib/store/casePosts";

// 진행 사례 이미지 사이트맵: 글마다 사진 주소를 알려 이미지 검색에 나오게 한다(robots.txt 에 등록).
// 사진 설명(alt)은 글 페이지 HTML 에 있고, 여기에는 주소만(구글 이미지 사이트맵 규격).
export const dynamic = "force-dynamic";

const x = (v: string) => v.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[c] as string);

export async function GET() {
  const list = (await fetchCasePosts(undefined, 600)) || [];
  // 목록에는 본문이 없으므로 글마다 한 번 더 읽음(1분~10분 캐시)
  const posts = (await Promise.all(list.map((p) => fetchCasePosts(p.slug, 600)))).map((r) => r?.[0]).filter(Boolean);
  const body = posts
    .map((p) => {
      const imgs = postImages(p!).slice(0, 1000);
      const lastmod = p!.updated || p!.published;
      return `<url><loc>${x(postUrl(p!.slug))}</loc>${lastmod ? `<lastmod>${x(new Date(lastmod).toISOString())}</lastmod>` : ""}${imgs
        .map((im) => `<image:image><image:loc>${x(im.url)}</image:loc></image:image>`)
        .join("")}</url>`;
    })
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${body}
</urlset>`;
  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=0, s-maxage=600, stale-while-revalidate=3600" },
  });
}
