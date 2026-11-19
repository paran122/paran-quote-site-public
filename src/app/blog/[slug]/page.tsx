import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
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

/* ── 블로그 슬러그 → 포트폴리오 직접 매핑 (행사 후기/기획 카테고리) ── */
const BLOG_TO_PORTFOLIO: Record<string, { slug: string; title: string }> = {
  "공공기관-포럼-기획-대행-사례": { slug: "international-forum", title: "중앙아시아 교육협력포럼" },
  "전시부스-디자인-시공-교육감협의회": { slug: "education-council-booth", title: "교육감협의회 부스 설치" },
  "학교체육-컨퍼런스-기획-스포츠-공간연출": { slug: "goyang-conference", title: "고양 학교체육 성장 컨퍼런스" },
  "결과공유회-기획-문화예술클럽": { slug: "culture-club-showcase", title: "문화예술클럽 결과공유회" },
  "교육-런칭-행사-기획-KLS-글로벌프리미어": { slug: "kls", title: "KLS 한국어교육 국제학술대회" },
  "장기-교육-캠프-기획-해군캠프": { slug: "navy-camp", title: "필승해군캠프" },
  "시리즈-행사-운영-경기학부모교육": { slug: "parent-education", title: "찾아가는 경기학부모교육" },
  "시리즈-행사-마지막-회차-운영": { slug: "parent-education", title: "찾아가는 경기학부모교육" },
  "AI-교육-세미나-운영-유튜버-궤도": { slug: "parent-education", title: "찾아가는 경기학부모교육" },
  "관공서-강당-행사-기획-아누리홀": { slug: "parent-education", title: "찾아가는 경기학부모교육" },
  "LED-Wall-행사-운영-EBS-스페이스홀": { slug: "parent-education", title: "찾아가는 경기학부모교육" },
  "학부모-교육-행사-기획-등록-동선": { slug: "parent-education", title: "찾아가는 경기학부모교육" },
  "전국-순회-교육-운영-예술인-권리보호": { slug: "artist-rights", title: "예술인 권리보호 교육" },
  "코엑스-스튜디오159-대관-led-대관료-좌석": {
    slug: "제12회-2026년-보건의료빅데이터ai-활용-창업경진대회",
    title: "코엑스 스튜디오159 창업경진대회 시상식",
  },
};

/* ── 글 내용 기반 CTA 자동 매칭 ──
 * 우선순위: 디자인 카테고리(구체적) → 행사 유형 → 가이드/일반.
 * 키워드 매칭 점수가 같으면 배열 앞쪽 규칙이 이김.
 */
const CTA_RULES: {
  keywords: string[];
  href: string;
  title: string;
  description: string;
  label: string;
}[] = [
  // ── 디자인 주제 글 → 새 서비스 상세 (2026-11-19: 블로그로 들어온 방문이 서비스로 이어지지 않아 사례 목록 대신 서비스로 연결) ──
  {
    keywords: ["현수막", "엑스배너", "x배너", "x-배너", "롤배너", "롤업배너", "배너"],
    href: "/services/banner",
    title: "현수막·X배너 디자인과 제작을 맡기고 싶다면",
    description: "구성을 고르면 금액이 바로 보이고, 그대로 견적을 요청할 수 있습니다",
    label: "현수막·X배너 서비스",
  },
  {
    keywords: ["포스터"],
    href: "/services/poster",
    title: "행사 포스터 디자인을 맡기고 싶다면",
    description: "구성을 고르면 금액이 바로 보이고, 그대로 견적을 요청할 수 있습니다",
    label: "포스터 서비스",
  },
  {
    keywords: ["자료집", "카탈로그", "책자", "에세이집", "제본", "무선제본", "중철제본"],
    href: "/services/booklet",
    title: "자료집·책자 편집과 인쇄를 맡기고 싶다면",
    description: "구성을 고르면 금액이 바로 보이고, 그대로 견적을 요청할 수 있습니다",
    label: "책자·자료집 서비스",
  },
  {
    keywords: ["리플렛", "리플릿", "팸플릿", "팜플렛"],
    href: "/services/leaflet",
    title: "리플렛 디자인과 인쇄를 맡기고 싶다면",
    description: "구성을 고르면 금액이 바로 보이고, 그대로 견적을 요청할 수 있습니다",
    label: "리플렛 서비스",
  },
  {
    keywords: ["카드뉴스", "sns 콘텐츠", "sns콘텐츠", "인스타그램"],
    href: "/services/card-news",
    title: "카드뉴스 제작을 맡기고 싶다면",
    description: "구성을 고르면 금액이 바로 보이고, 그대로 견적을 요청할 수 있습니다",
    label: "카드뉴스 서비스",
  },
  {
    keywords: ["ppt", "발표자료", "프레젠테이션"],
    href: "/services/ppt",
    title: "행사 진행 PPT 디자인을 맡기고 싶다면",
    description: "구성을 고르면 금액이 바로 보이고, 그대로 견적을 요청할 수 있습니다",
    label: "행사 PPT 서비스",
  },
  {
    keywords: ["포토존", "포토월"],
    href: "/services/photo-wall",
    title: "포토월 디자인과 설치를 맡기고 싶다면",
    description: "구성을 고르면 금액이 바로 보이고, 그대로 견적을 요청할 수 있습니다",
    label: "포토월 서비스",
  },
  {
    keywords: ["전시부스", "체험부스", "공간연출", "부스"],
    href: "/services/booth-graphic",
    title: "부스 그래픽 디자인과 제작을 맡기고 싶다면",
    description: "구성을 고르면 금액이 바로 보이고, 그대로 견적을 요청할 수 있습니다",
    label: "부스 그래픽 서비스",
  },
  // ── 행사 유형별 → 행사 대행 서비스 (2026-11-19: 사례 목록 대신 새 행사 대행 페이지로. 규칙 자리·키워드는 그대로) ──
  {
    keywords: ["포럼", "심포지엄"],
    href: "/services/event-agency",
    title: "포럼·심포지엄을 기획부터 운영까지 맡기고 싶다면",
    description: "행사 대행 사례를 보고 상담을 요청할 수 있습니다",
    label: "행사 대행 서비스",
  },
  {
    keywords: ["세미나", "컨퍼런스", "학술"],
    href: "/services/event-agency",
    title: "세미나·컨퍼런스를 기획부터 운영까지 맡기고 싶다면",
    description: "행사 대행 사례를 보고 상담을 요청할 수 있습니다",
    label: "행사 대행 서비스",
  },
  // ── 가이드/일반 ──
  {
    keywords: ["비용", "견적", "예산", "가격", "단가", "패키지"],
    href: "/guide/pricing",
    title: "행사 비용이 궁금하신가요?",
    description: "규모별·유형별 비용 가이드를 확인해보세요",
    label: "비용 가이드",
  },
  {
    keywords: ["체크리스트", "기획서", "d-30", "d30"],
    href: "/guide/checklist",
    title: "행사 준비, 빠진 건 없나요?",
    description: "D-30부터 당일까지 체크리스트로 점검하세요",
    label: "체크리스트",
  },
  {
    keywords: ["절차", "프로세스", "순서", "단계", "흐름", "큐시트"],
    href: "/guide/process",
    title: "행사 진행 절차가 궁금하신가요?",
    description: "상담부터 결과보고서까지 7단계 프로세스",
    label: "진행 절차",
  },
  {
    keywords: ["장소", "무대", "강당", "호텔", "볼룸", "대관", "행사장"],
    href: "/guide/venue",
    title: "행사 장소 선택이 고민이신가요?",
    description: "유형별 장소 비교와 대관 가이드를 확인하세요",
    label: "장소 가이드",
  },
  {
    keywords: ["규모", "소규모", "대규모", "인원", "100명", "300명", "500명"],
    href: "/guide/scale",
    title: "우리 행사 규모에 맞는 구성은?",
    description: "규모별 예산·인력·장비 가이드를 확인하세요",
    label: "규모별 가이드",
  },
  {
    keywords: ["공공기관", "교육청", "지자체", "정부", "관공서", "입찰", "rfp"],
    href: "/work",
    title: "공공기관 행사 사례를 확인해보세요",
    description: "실적의 60% 이상이 공공기관 행사입니다",
    label: "포트폴리오",
  },
  // ── 행사 기획·대행 글 → 행사 대행 서비스 (2026-11-19). 맨 끝에 두어 위 규칙과 점수가 같으면 위 규칙이 먼저 ──
  {
    keywords: ["행사 기획", "행사기획", "행사 대행", "행사대행", "행사 운영", "행사운영"],
    href: "/services/event-agency",
    title: "행사를 기획부터 운영까지 맡기고 싶다면",
    description: "행사 대행 사례를 보고 상담을 요청할 수 있습니다",
    label: "행사 대행 서비스",
  },
];

function getServiceCTA(
  slug?: string | null,
  category?: string | null,
  tags?: string[] | null,
  title?: string,
): { href: string; title: string; description: string; label: string } {
  // 1) 슬러그 직접 매칭이 있으면 해당 포트폴리오 상세로
  if (slug && BLOG_TO_PORTFOLIO[slug]) {
    const pf = BLOG_TO_PORTFOLIO[slug];
    return {
      href: `/work/${pf.slug}`,
      title: "이 글의 행사 사례를 자세히 보기",
      description: `${pf.title} 포트폴리오에서 더 많은 현장 사진과 디자인을 확인하세요`,
      label: "행사 사례 보기",
    };
  }

  // 2) 키워드 점수 기반 매칭
  const text = [category, title, ...(tags ?? [])].filter(Boolean).join(" ").toLowerCase();

  let bestMatch: typeof CTA_RULES[number] | null = null;
  let bestScore = 0;

  for (const rule of CTA_RULES) {
    const score = rule.keywords.filter((kw) => text.includes(kw)).length;
    if (score > bestScore) {
      bestScore = score;
      bestMatch = rule;
    }
  }

  if (bestMatch) return bestMatch;

  // 2-1) 종이·규격·인쇄 일반 글: 맞는 서비스가 하나로 정해지지 않으면 서비스 목록으로
  if (["스노우지", "아트지", "용지", "종이", "인쇄", "cmyk", "사이즈", "규격"].some((kw) => text.includes(kw))) {
    return {
      href: "/services/",
      title: "인쇄물 디자인부터 제작까지 맡기고 싶다면",
      description: "구성을 고르면 금액이 바로 보이고, 그대로 견적을 요청할 수 있습니다",
      label: "서비스 보기",
    };
  }

  // 3) 폴백 — 회사소개
  return {
    href: "/company",
    title: "파란컴퍼니는 어떤 회사인가요?",
    description: "250+ 프로젝트, 재계약률 90%의 행사 전문 에이전시",
    label: "회사소개",
  };
}

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

  // FAQ JSON-LD: 본문에서 Q&A 패턴 자동 추출
  const faqItems: { question: string; answer: string }[] = [];
  const faqRegex = /<p>\s*<strong>\s*Q\.\s*(.+?)<\/strong>\s*<\/p>\s*<p>\s*A\.\s*(.+?)<\/p>/g;
  let faqMatch;
  while ((faqMatch = faqRegex.exec(post.content)) !== null) {
    faqItems.push({ question: faqMatch[1].trim(), answer: faqMatch[2].trim() });
  }
  const faqLd = faqItems.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  } : null;

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
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      )}
      <div className="min-h-screen bg-slate-50 pt-16">
        {/* ═══ Social Sidebar (데스크탑 1400px+: 왼쪽 고정) ═══ */}
        <SocialSidebarFixed {...socialLinks} />

        {/* ═══ Header (Pitch 스타일: 날짜 위 → 제목 중앙 → 카테고리) ═══ */}
        <MotionSection className="mx-auto max-w-[1000px] px-6 pb-14 pt-20 sm:pb-16 sm:pt-24 text-center">
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

        {/* ═══ 행사 대행 서비스 내부 링크 배너 (글 내용 기반 자동 매칭) ═══ */}
        {(() => {
          const cta = getServiceCTA(post.slug, post.category, post.tags, post.title);
          return (
            <MotionSection className="mx-auto max-w-[640px] px-6 py-6">
              <Link
                href={cta.href}
                className="group flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50/50 px-6 py-5 transition-all hover:border-blue-200 hover:bg-blue-50"
              >
                <div>
                  <p className="text-[15px] font-semibold text-slate-800">
                    {cta.title}
                  </p>
                  <p className="mt-1 text-[13px] text-slate-500">
                    {cta.description}
                  </p>
                </div>
                <span className="flex shrink-0 items-center gap-1 text-[14px] font-medium text-blue-600 transition-transform group-hover:translate-x-0.5">
                  {cta.label}
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            </MotionSection>
          );
        })()}

        {/* ═══ 저자 프로필 카드 ═══ */}
        <MotionSection className="mx-auto max-w-[640px] px-6 py-10">
          <div className="rounded-2xl bg-slate-50 p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                <Image src="/logo.svg" alt="파란컴퍼니 로고" width={32} height={32} />
              </div>
              <div className="flex-1">
                <p className="text-[12px] font-medium text-slate-400">글쓴이</p>
                <Link href="/authors/kim-mikyung" className="text-[16px] font-bold text-slate-900 hover:text-primary transition-colors">
                  김미경 대표
                </Link>
                <p className="mt-0.5 text-[13px] text-slate-500">
                  파란컴퍼니 · 행사 기획 경력 10년 · 250+ 프로젝트 총괄
                </p>
                <p className="mt-2 text-[14px] leading-relaxed text-slate-600">
                  공공기관·기업 대상 세미나, 컨퍼런스, 포럼 등 다양한 행사를 기획·운영하고 있습니다.
                  파란컴퍼니는 <strong className="font-semibold">2015년 설립</strong>된 <strong className="font-semibold">여성기업 인증</strong>·<strong className="font-semibold">직접생산확인증명서</strong> 보유 행사 전문 에이전시입니다.
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {["세미나", "컨퍼런스", "포럼", "공공기관 전문"].map((tag) => (
                    <span key={tag} className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-600">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-3 flex items-center gap-1.5 text-[13px] text-slate-500">
                  <span>문의</span>
                  <a href="mailto:cs@parancompany.co.kr" className="text-primary hover:underline">
                    cs@parancompany.co.kr
                  </a>
                  <span>·</span>
                  <Link href="/authors/kim-mikyung" className="font-medium text-primary hover:underline">
                    다른 글 보기 →
                  </Link>
                </div>
              </div>
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
