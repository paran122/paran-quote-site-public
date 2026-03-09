import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  fetchPublishedBlogPostBySlug,
  fetchPublishedBlogPosts,
  fetchPortfolios,
} from "@/lib/queries";
import BlogContent from "@/components/blog/BlogContent";
import { SocialSidebarFixed, SocialLinksVertical, SocialLinksInline } from "@/components/blog/SocialSidebar";
import { MotionPage, MotionSection, MotionTitle } from "./BlogDetailMotion";
import BlogDetailCTA from "./BlogDetailCTA";
import type { Portfolio } from "@/types";

/* ── 카테고리 색상 (Pitch 스타일: 눈에 띄게) ── */
const CATEGORY_COLOR = "text-[13px] font-semibold text-[#4B5EDB]";

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

function formatDateShort(dateStr?: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
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
  let relatedPortfolios: Portfolio[] = [];
  try {
    const [allPosts, allPortfolios] = await Promise.all([
      fetchPublishedBlogPosts(post.category || undefined, 4),
      fetchPortfolios(),
    ]);
    relatedPosts = allPosts.filter((p) => p.id !== post.id).slice(0, 3);

    // 태그/카테고리 기반 포트폴리오 매칭
    const postKeywords = [
      ...(post.tags || []),
      post.category,
    ].filter(Boolean).map((k) => k!.toLowerCase());
    relatedPortfolios = allPortfolios
      .filter((pf) => {
        const pfKeywords = [
          pf.eventType,
          pf.title,
          ...(pf.tags || []),
        ].map((k) => k.toLowerCase());
        return postKeywords.some((pk) =>
          pfKeywords.some((fk) => fk.includes(pk) || pk.includes(fk)),
        );
      })
      .slice(0, 3);
  } catch {
    // ignore
  }

  const socialLinks = {
    naverBlogUrl: post.naverBlogUrl,
    instagramUrl: post.instagramUrl,
    youtubeUrl: post.youtubeUrl,
  };

  return (
    <MotionPage>
      <div className="min-h-screen bg-white pt-16">
        {/* ═══ Social Sidebar (데스크탑 1400px+: 왼쪽 고정) ═══ */}
        <SocialSidebarFixed {...socialLinks} />

        {/* ═══ Header (Pitch 스타일: 날짜 위 → 제목 중앙 → 카테고리) ═══ */}
        <MotionSection className="mx-auto max-w-[1000px] px-6 pb-10 pt-12 text-center">
          {/* 날짜 + 읽기 시간 */}
          <p className="mb-5 text-[16px] text-slate-400 sm:text-[18px]">
            {formatDate(post.publishedAt || post.createdAt)}
            <span className="mx-2">·</span>
            {estimateReadTime(post.content)}분 읽기
          </p>

          {/* 제목 (큰 사이즈, Pitch 스타일) */}
          <MotionTitle className="mb-5 text-[36px] font-extrabold leading-[1.05] tracking-[-0.02em] text-slate-900 sm:text-[48px] lg:text-[56px]">
            {post.title}
          </MotionTitle>

          {/* 카테고리 */}
          {post.category && (
            <p className={`text-[14px] font-medium ${CATEGORY_COLOR}`}>
              {post.category}
            </p>
          )}
        </MotionSection>

        {/* ═══ Hero Image (full-width, no border-radius) ═══ */}
        <MotionSection className="pb-12">
          <BlogContent
            html={post.content}
            thumbnailUrl={post.thumbnailUrl}
            title={post.title}
            afterHero={
              <>
                {/* 800px+: 본문 왼쪽 세로 sticky 사이드바 */}
                <div className="absolute -left-[60px] top-0 hidden min-[800px]:block min-[1400px]:hidden">
                  <div className="sticky top-[40%]">
                    <SocialLinksVertical {...socialLinks} />
                  </div>
                </div>
                {/* 모바일(< 800px): 본문 위 가로 인라인 */}
                <div className="mb-8 min-[800px]:hidden">
                  <SocialLinksInline {...socialLinks} />
                </div>
              </>
            }
          />
        </MotionSection>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <MotionSection className="mx-auto max-w-[640px] border-t border-slate-200 px-6 py-8">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="cursor-default rounded-full bg-primary-50 px-4 py-1.5 text-sm font-medium text-primary-600 transition-colors hover:bg-primary-100"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </MotionSection>
        )}

        {/* ═══ Related Posts (Pitch 스타일 3열 이미지 카드) ═══ */}
        {relatedPosts.length > 0 && (
          <MotionSection className="mx-auto max-w-[1200px] border-t border-slate-100 px-6 pb-20 pt-14">
            <h3 className="mb-8 text-[14px] font-semibold tracking-[0.12em] text-slate-900">
              RELATED ARTICLES
            </h3>
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((rp) => (
                <Link
                  key={rp.id}
                  href={`/blog/${rp.slug}`}
                  className="group"
                >
                  {/* 이미지 */}
                  <div className="relative aspect-[3/2] overflow-hidden rounded-md">
                    <Image
                      src={rp.thumbnailUrl || "/blog-default-thumbnail.png"}
                      alt={rp.title}
                      fill
                      className="object-cover"
                      sizes="400px"
                    />
                    <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
                  </div>
                  {/* 제목 (밑줄 → hover: 밑줄 사라짐 + primary) */}
                  <h4 className="mt-5 line-clamp-2 text-[20px] font-semibold leading-snug tracking-[-0.02em] text-slate-900 sm:text-[22px]">
                    <span className="underline decoration-slate-900/40 underline-offset-[3px] transition-all duration-300 group-hover:text-primary group-hover:decoration-transparent">
                      {rp.title}
                    </span>
                  </h4>
                  {/* 카테고리 */}
                  {rp.category && (
                    <span className={`mt-2 inline-block ${CATEGORY_COLOR}`}>
                      {rp.category}
                    </span>
                  )}
                  {/* excerpt */}
                  {rp.excerpt && (
                    <p className="mt-1 line-clamp-2 text-[14px] leading-relaxed text-slate-500">
                      {rp.excerpt}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </MotionSection>
        )}

        {/* Related Portfolios */}
        {relatedPortfolios.length > 0 && (
          <MotionSection className="mx-auto max-w-[1200px] border-t border-slate-100 px-6 pb-12 pt-14">
            <h3 className="mb-8 text-[14px] font-semibold tracking-[0.12em] text-slate-900">
              RELATED PORTFOLIOS
            </h3>
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPortfolios.map((pf) => (
                <Link
                  key={pf.id}
                  href={`/work#${pf.slug || pf.id}`}
                  className="group"
                >
                  {pf.imageUrl && (
                    <div className="relative aspect-[3/2] overflow-hidden rounded-md">
                      <Image
                        src={pf.imageUrl}
                        alt={pf.title}
                        fill
                        className="object-cover"
                        sizes="400px"
                      />
                      <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
                    </div>
                  )}
                  <h4 className="mt-5 line-clamp-2 text-[20px] font-semibold leading-snug tracking-[-0.02em] text-slate-900">
                    <span className="underline decoration-slate-900/40 underline-offset-[3px] transition-all duration-300 group-hover:text-primary group-hover:decoration-transparent">
                      {pf.title}
                    </span>
                  </h4>
                  <span className={`mt-2 inline-block ${CATEGORY_COLOR}`}>
                    {pf.eventType}
                  </span>
                  {pf.venue && (
                    <p className="mt-1 text-[13px] text-slate-400">{pf.venue}</p>
                  )}
                </Link>
              ))}
            </div>
          </MotionSection>
        )}

        {/* CTA */}
        <MotionSection className="mx-auto max-w-[1200px] px-6 pb-20 pt-4">
          <BlogDetailCTA />
        </MotionSection>
      </div>
    </MotionPage>
  );
}
