import { supabase } from "@/lib/supabase";

interface PortfolioRow {
  id: string;
  title: string;
  event_type: string;
  description: string | null;
  venue: string;
  year: number;
  slug: string | null;
  created_at: string | null;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://paran-quote.netlify.app";

  let portfolioItems = "";

  try {
    if (!supabase) throw new Error("No client");
    const { data } = await supabase
      .from("portfolios")
      .select("id, title, event_type, description, venue, year, slug, created_at")
      .eq("is_visible", true)
      .order("sort_order")
      .limit(20);

    if (data) {
      portfolioItems = (data as PortfolioRow[])
        .map((p) => {
          const link = `${siteUrl}/work`;
          const desc = p.description || `${p.venue}에서 진행된 ${p.event_type}`;
          const pubDate = p.created_at
            ? new Date(p.created_at).toUTCString()
            : new Date(`${p.year}-01-01`).toUTCString();

          return `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${escapeXml(link)}</link>
      <description>${escapeXml(desc)}</description>
      <pubDate>${pubDate}</pubDate>
      <guid>${escapeXml(`${siteUrl}/work#${p.slug || p.id}`)}</guid>
    </item>`;
        })
        .join("\n");
    }
  } catch {
    // Supabase 실패 시 포트폴리오 항목 없이 기본 피드만 반환
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>파란컴퍼니 - 행사 전문 에이전시</title>
    <link>${siteUrl}</link>
    <description>공공기관·기업 행사 전문 에이전시. 세미나·컨퍼런스·포럼·축제 기획부터 디자인·운영까지.</description>
    <language>ko</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <item>
      <title>파란컴퍼니 - 행사 기획·디자인·운영 전문</title>
      <link>${siteUrl}</link>
      <description>250+ 프로젝트 수행 실적, 합리적인 견적으로 성공적인 행사를 만듭니다.</description>
      <pubDate>${new Date().toUTCString()}</pubDate>
      <guid>${siteUrl}</guid>
    </item>
<item>
      <title>파란컴퍼니 포트폴리오</title>
      <link>${siteUrl}/work</link>
      <description>파란컴퍼니가 수행한 행사 포트폴리오를 확인하세요.</description>
      <pubDate>${new Date().toUTCString()}</pubDate>
      <guid>${siteUrl}/work</guid>
    </item>
${portfolioItems}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
