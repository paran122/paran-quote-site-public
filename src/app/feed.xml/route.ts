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

interface BlogRow {
  title: string;
  slug: string;
  excerpt: string | null;
  published_at: string | null;
  created_at: string;
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
    process.env.NEXT_PUBLIC_SITE_URL || "https://parancompany.co.kr";

  let portfolioItems = "";
  let blogItems = "";

  try {
    if (!supabase) throw new Error("No client");

    const [portfolioRes, blogRes] = await Promise.all([
      supabase
        .from("portfolios")
        .select("id, title, event_type, description, venue, year, slug, created_at")
        .eq("is_visible", true)
        .order("sort_order")
        .limit(20),
      supabase
        .from("blog_posts")
        .select("title, slug, excerpt, published_at, created_at")
        .eq("is_published", true)
        .order("published_at", { ascending: false })
        .limit(20),
    ]);

    if (portfolioRes.data) {
      portfolioItems = (portfolioRes.data as PortfolioRow[])
        .map((p) => {
          const link = `${siteUrl}/work/${p.slug || p.id}`;
          const desc = p.description || `${p.venue}에서 진행된 ${p.event_type}`;
          const pubDate = p.created_at
            ? new Date(p.created_at).toUTCString()
            : new Date(`${p.year}-01-01`).toUTCString();

          return `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${escapeXml(link)}</link>
      <description>${escapeXml(desc)}</description>
      <pubDate>${pubDate}</pubDate>
      <guid>${escapeXml(`${siteUrl}/work/${p.slug || p.id}`)}</guid>
    </item>`;
        })
        .join("\n");
    }

    if (blogRes.data) {
      blogItems = (blogRes.data as BlogRow[])
        .map((b) => {
          const link = `${siteUrl}/blog/${b.slug}`;
          const desc = b.excerpt || b.title;
          const pubDate = new Date(b.published_at || b.created_at).toUTCString();

          return `    <item>
      <title>${escapeXml(b.title)}</title>
      <link>${escapeXml(link)}</link>
      <description>${escapeXml(desc)}</description>
      <pubDate>${pubDate}</pubDate>
      <guid>${escapeXml(link)}</guid>
    </item>`;
        })
        .join("\n");
    }
  } catch {
    // Supabase 실패 시 기본 피드만 반환
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
${blogItems}
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
