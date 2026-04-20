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

const SITE_URL = "https://parancompany.co.kr";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await fetchPublishedBlogPostBySlug(decodeURIComponent(params.slug));
  if (!post) return {};

  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt || "";
  const image = post.ogImageUrl || post.thumbnailUrl || "/og-image.png";
  const url = `${SITE_URL}/blog/${post.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      type: "article",
      url,
      publishedTime: post.publishedAt || post.createdAt,
      modifiedTime: post.updatedAt,
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
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

/** HTML 태그 제거 후 한글 기준 읽기 시간 계산 (분당 500자) */
function estimateReadTime(content: string): number {
  const text = content.replace(/<[^>]*>/g, "").trim();
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

  const postUrl = `${SITE_URL}/blog/${post.slug}`;
  const postText = post.content.replace(/<[^>]*>/g, "");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt || "",
    image: post.ogImageUrl || post.thumbnailUrl || `${SITE_URL}/og-image.png`,
    url: postUrl,
    datePublished: post.publishedAt || post.createdAt,
    dateModified: post.updatedAt,
    wordCount: postText.split(/\s+/).filter(Boolean).length,
    author: {
      "@type": "Person",
      name: "김미경",
      jobTitle: "대표",
      worksFor: { "@type": "Organization", name: "파란컴퍼니", url: SITE_URL },
    },
    publisher: {
      "@type": "Organization",
      name: "파란컴퍼니",
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": postUrl },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "홈", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "블로그", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: postUrl },
    ],
  };

  return (
    <MotionPage>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <div className="min-h-screen bg-slate-50 pt-16">
        {/* ═══ Social Sidebar (데스크탑 1400px+: 왼쪽 고정) ═══ */}
        <SocialSidebarFixed {...socialLinks} />

        {/* ═══ Header (Pitch 스타일: 날짜 위 → 제목 중앙 → 카테고리) ═══ */}
        <MotionSection className="mx-auto max-w-[1000px] px-6 pb-10 pt-12 text-center">
          {/* 저자 + 날짜 + 읽기 시간 */}
          <p className="mb-5 text-[16px] text-slate-400 sm:text-[18px]">
            <Link href="/authors/kim-mikyung" className="text-slate-600 hover:text-primary transition-colors">
              김미경 대표
            </Link>
            <span className="mx-1.5 text-slate-300">|</span>
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

        {/* ═══ 저자 프로필 카드 ═══ */}
        <MotionSection className="mx-auto max-w-[640px] border-t border-slate-200 px-6 py-10">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
              김
            </div>
            <div className="flex-1">
              <Link href="/authors/kim-mikyung" className="text-[16px] font-bold text-slate-900 hover:text-primary transition-colors">
                김미경 대표
              </Link>
              <p className="mt-0.5 text-[13px] text-slate-500">
                파란컴퍼니 · 행사 기획 경력 10년 · 250+ 프로젝트 총괄
              </p>
              <p className="mt-2 text-[14px] leading-relaxed text-slate-600">
                공공기관·기업 대상 세미나, 컨퍼런스, 포럼 등 다양한 행사를 기획·운영하고 있습니다.
              </p>
              <Link
                href="/authors/kim-mikyung"
                className="mt-2 inline-block text-[13px] font-medium text-primary hover:underline"
              >
                다른 글 보기 →
              </Link>
            </div>
          </div>
        </MotionSection>

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
                  href={`/work/${pf.slug || pf.id}`}
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
