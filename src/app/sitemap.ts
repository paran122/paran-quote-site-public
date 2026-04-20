import type { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://parancompany.co.kr";

  // 동적 콘텐츠의 최근 업데이트 날짜를 먼저 조회
  let latestBlogDate: Date | null = null;
  let latestPortfolioDate: Date | null = null;

  const blogPages: MetadataRoute.Sitemap = [];
  const portfolioPages: MetadataRoute.Sitemap = [];

  try {
    if (supabase) {
      const { data: posts } = await supabase
        .from("blog_posts")
        .select("slug, updated_at")
        .eq("is_published", true)
        .lte("published_at", new Date().toISOString())
        .order("updated_at", { ascending: false });

      if (posts?.length) {
        latestBlogDate = new Date(posts[0].updated_at);
        for (const post of posts) {
          blogPages.push({
            url: `${siteUrl}/blog/${post.slug}`,
            lastModified: new Date(post.updated_at),
            changeFrequency: "monthly",
            priority: 0.5,
          });
        }
      }
    }
  } catch {
    // Supabase 연결 실패 시 정적 페이지만 반환
  }

  try {
    if (supabase) {
      const { data: portfolios } = await supabase
        .from("portfolios")
        .select("slug, updated_at")
        .eq("is_visible", true)
        .order("updated_at", { ascending: false });

      if (portfolios?.length) {
        latestPortfolioDate = new Date(portfolios[0].updated_at);
        for (const portfolio of portfolios) {
          portfolioPages.push({
            url: `${siteUrl}/work/${portfolio.slug}`,
            lastModified: new Date(portfolio.updated_at),
            changeFrequency: "monthly",
            priority: 0.7,
          });
        }
      }
    }
  } catch {
    // Supabase 연결 실패 시 무시
  }

  // 홈페이지: 가장 최근 콘텐츠 업데이트 기준
  const latestContent = [latestBlogDate, latestPortfolioDate]
    .filter((d): d is Date => d !== null)
    .sort((a, b) => b.getTime() - a.getTime());
  const homepageDate = latestContent[0] ?? new Date("2026-03-30");

  // 정적 페이지: 마지막 코드 수정 기준 고정 날짜
  const GUIDE_UPDATED = new Date("2026-03-30"); // 가격 v1.2 반영
  const SERVICES_UPDATED = new Date("2026-03-30");
  const COMPANY_UPDATED = new Date("2026-03-19");
  const POLICY_UPDATED = new Date("2026-03-10");

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: homepageDate,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/work`,
      lastModified: latestPortfolioDate ?? homepageDate,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: latestBlogDate ?? homepageDate,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/faq`,
      lastModified: GUIDE_UPDATED,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/guide`,
      lastModified: GUIDE_UPDATED,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/guide/checklist`,
      lastModified: GUIDE_UPDATED,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/guide/process`,
      lastModified: GUIDE_UPDATED,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/guide/pricing`,
      lastModified: GUIDE_UPDATED,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/guide/venue`,
      lastModified: GUIDE_UPDATED,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/guide/scale`,
      lastModified: GUIDE_UPDATED,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/services`,
      lastModified: SERVICES_UPDATED,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/services/government`,
      lastModified: SERVICES_UPDATED,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/services/corporate`,
      lastModified: SERVICES_UPDATED,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/services/conference`,
      lastModified: SERVICES_UPDATED,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/services/seminar`,
      lastModified: SERVICES_UPDATED,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/services/design`,
      lastModified: SERVICES_UPDATED,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/company`,
      lastModified: COMPANY_UPDATED,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/authors/kim-mikyung`,
      lastModified: latestBlogDate ?? homepageDate,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: POLICY_UPDATED,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/terms`,
      lastModified: POLICY_UPDATED,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  return [...staticPages, ...blogPages, ...portfolioPages];
}
