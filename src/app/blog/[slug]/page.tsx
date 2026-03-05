import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import {
  fetchPublishedBlogPostBySlug,
  fetchPublishedBlogPosts,
} from "@/lib/queries";
import BlogContent from "@/components/blog/BlogContent";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await fetchPublishedBlogPostBySlug(decodeURIComponent(params.slug));
  if (!post) return {};

  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt || "",
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt || "",
      type: "article",
      publishedTime: post.publishedAt || post.createdAt,
      images: [{ url: post.ogImageUrl || post.thumbnailUrl || "/og-image.png" }],
    },
  };
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function estimateReadTime(content: string): number {
  const text = content.replace(/<[^>]*>/g, "");
  return Math.max(1, Math.round(text.length / 500));
}

export default async function BlogDetailPage({ params }: Props) {
  const post = await fetchPublishedBlogPostBySlug(decodeURIComponent(params.slug));
  if (!post) notFound();

  // Get related posts (same category, excluding current)
  let relatedPosts: Awaited<ReturnType<typeof fetchPublishedBlogPosts>> = [];
  try {
    const allPosts = await fetchPublishedBlogPosts(post.category || undefined, 4);
    relatedPosts = allPosts.filter((p) => p.id !== post.id).slice(0, 3);
  } catch {
    // ignore
  }

  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-[1200px] px-6">
        <nav className="flex items-center gap-1 py-6 text-sm text-slate-400">
          <Link href="/blog" className="transition-colors hover:text-primary">
            블로그
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          {post.category && <span>{post.category}</span>}
        </nav>
      </div>

      {/* Header */}
      <div className="mx-auto max-w-[800px] px-6 pb-8 text-center">
        {post.category && (
          <p className="mb-4 text-sm font-semibold text-primary">
            {post.category}
          </p>
        )}
        <h1 className="mb-4 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl">
          {post.title}
        </h1>
        <div className="flex items-center justify-center gap-4 text-sm text-slate-400">
          <span>{formatDate(post.publishedAt || post.createdAt)}</span>
          <span className="h-1 w-1 rounded-full bg-slate-300" />
          <span>{estimateReadTime(post.content)}분 읽기</span>
        </div>
      </div>

      {/* Hero Image + Prose Content (라이트박스 통합) */}
      <div className="px-6 pb-12">
        <BlogContent
          html={post.content}
          thumbnailUrl={post.thumbnailUrl}
          title={post.title}
        />
      </div>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="mx-auto flex max-w-[720px] flex-wrap gap-2 border-t border-slate-200 px-6 py-8">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="cursor-default rounded-full bg-primary-50 px-4 py-1.5 text-sm font-medium text-primary-600 transition-colors hover:bg-primary-100"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="mx-auto max-w-[1200px] border-t border-slate-100 px-6 pb-20 pt-12">
          <h3 className="mb-6 text-xl font-bold tracking-tight text-slate-900">
            관련 글
          </h3>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedPosts.map((rp) => (
              <Link
                key={rp.id}
                href={`/blog/${rp.slug}`}
                className="group overflow-hidden rounded-2xl border border-slate-100 bg-white transition-all hover:-translate-y-0.5 hover:border-transparent hover:shadow-lg"
              >
                <div className="relative aspect-[16/10]">
                  <Image
                    src={rp.thumbnailUrl || "/blog-default-thumbnail.png"}
                    alt={rp.title}
                    fill
                    className="object-cover"
                    sizes="400px"
                  />
                </div>
                <div className="px-5 pb-5 pt-4">
                  <div className="mb-2 flex items-center gap-2">
                    {rp.category && (
                      <span className="text-xs font-semibold text-primary-600">
                        {rp.category}
                      </span>
                    )}
                    <span className="text-xs text-slate-400">
                      {formatDate(rp.publishedAt || rp.createdAt)}
                    </span>
                  </div>
                  <h4 className="line-clamp-2 text-[17px] font-bold leading-snug text-slate-800">
                    {rp.title}
                  </h4>
                  {rp.excerpt && (
                    <p className="mt-2 line-clamp-2 text-[13px] text-slate-500">
                      {rp.excerpt}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
