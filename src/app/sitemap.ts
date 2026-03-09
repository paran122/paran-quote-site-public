import type { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://paran-quote.netlify.app";

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
      url: `${siteUrl}/build`,
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

  return [...staticPages, ...blogPages];
}
