import type { Metadata } from "next";
import {
  fetchPublishedBlogPosts,
  fetchFeaturedBlogPosts,
  fetchBlogCategories,
  fetchPublishedBlogPostCount,
} from "@/lib/queries";
import BlogListClient from "./BlogListClient";

const SITE_URL = "https://parancompany.co.kr";
const BLOG_DESCRIPTION =
  "파란컴퍼니의 행사 기획 노하우, 운영 팁, 업계 트렌드를 공유하는 블로그입니다.";

export const metadata: Metadata = {
  title: "블로그 · 행사 기획 노하우",
  description: BLOG_DESCRIPTION,
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
  openGraph: {
    title: "블로그 · 행사 기획 노하우 | 파란컴퍼니",
    description: BLOG_DESCRIPTION,
    type: "website",
    url: `${SITE_URL}/blog`,
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: "파란컴퍼니 블로그" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "블로그 · 행사 기획 노하우 | 파란컴퍼니",
    description: BLOG_DESCRIPTION,
    images: [`${SITE_URL}/og-image.png`],
  },
};

export default async function BlogPage() {
  let posts: Awaited<ReturnType<typeof fetchPublishedBlogPosts>> = [];
  let featuredPosts: Awaited<ReturnType<typeof fetchFeaturedBlogPosts>> = [];
  let categories: string[] = [];
  let totalCount = 0;

  try {
    [posts, featuredPosts, categories, totalCount] = await Promise.all([
      fetchPublishedBlogPosts(),
      fetchFeaturedBlogPosts(),
      fetchBlogCategories(),
      fetchPublishedBlogPostCount(),
    ]);
  } catch {
    posts = [];
    featuredPosts = [];
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "블로그 · 행사 기획 노하우",
    description: BLOG_DESCRIPTION,
    url: `${SITE_URL}/blog`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: posts.length,
      itemListElement: posts.slice(0, 10).map((post, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        item: {
          "@type": "BlogPosting",
          headline: post.title,
          description: post.excerpt || "",
          url: `${SITE_URL}/blog/${post.slug}`,
          ...(post.thumbnailUrl ? { image: post.thumbnailUrl } : {}),
          ...(post.publishedAt ? { datePublished: post.publishedAt } : {}),
          author: {
            "@type": "Organization",
            name: "파란컴퍼니",
          },
        },
      })),
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "홈", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "블로그", item: `${SITE_URL}/blog` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <BlogListClient
        posts={posts}
        featuredPosts={featuredPosts}
        categories={categories}
        totalCount={totalCount}
      />
    </>
  );
}
