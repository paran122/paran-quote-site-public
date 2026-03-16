import type { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://parancompany.co.kr";

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/work`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/guide`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/guide/checklist`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/guide/process`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/guide/pricing`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/guide/venue`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/guide/scale`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/company`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // 발행된 블로그 글 동적 추가
  const blogPages: MetadataRoute.Sitemap = [];
  try {
    if (supabase) {
      const { data: posts } = await supabase
        .from("blog_posts")
        .select("slug, updated_at")
        .eq("is_published", true)
        .lte("published_at", new Date().toISOString());

      if (posts) {
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

  // 포트폴리오 행사 동적 추가
  const portfolioPages: MetadataRoute.Sitemap = [];
  try {
    if (supabase) {
      const { data: portfolios } = await supabase
        .from("portfolios")
        .select("slug, updated_at")
        .eq("is_visible", true);

      if (portfolios) {
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

  return [...staticPages, ...blogPages, ...portfolioPages];
}
