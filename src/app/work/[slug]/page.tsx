import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { fetchPortfolioBySlug, fetchPortfolioMedia, fetchPortfolios, fetchAllPortfolioMedia, fetchEventReviews } from "@/lib/queries";
import type { EventReview } from "@/types";
import { PORTFOLIOS } from "@/lib/portfolioData";
import WorkDetailClient from "./WorkDetailClient";
import type { Portfolio, PortfolioMedia } from "@/types";

const SITE_URL = "https://parancompany.co.kr";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = decodeURIComponent(params.slug);
  let portfolio = await fetchPortfolioBySlug(slug).catch(() => null);
  if (!portfolio) {
    portfolio = PORTFOLIOS.find((p) => p.slug === slug && p.isVisible) ?? null;
  }
  if (!portfolio) return {};

  const title = `${portfolio.title} | 포트폴리오`;
  const description =
    portfolio.description ||
    `${portfolio.client ? portfolio.client + " | " : ""}${portfolio.title} - 파란컴퍼니 행사 대행 사례`;
  const url = `${SITE_URL}/work/${portfolio.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${portfolio.title} | 파란컴퍼니 포트폴리오`,
      description,
      type: "article",
      url,
      ...(portfolio.imageUrl ? { images: [{ url: portfolio.imageUrl }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${portfolio.title} | 파란컴퍼니 포트폴리오`,
      description,
      ...(portfolio.imageUrl ? { images: [portfolio.imageUrl] } : {}),
    },
  };
}

export default async function WorkDetailPage({ params }: Props) {
  const slug = decodeURIComponent(params.slug);

  let portfolio = await fetchPortfolioBySlug(slug).catch(() => null);
  if (!portfolio) {
    portfolio = PORTFOLIOS.find((p) => p.slug === slug && p.isVisible) ?? null;
  }
  if (!portfolio) notFound();

  let media: PortfolioMedia[] = [];
  let allPortfolios: Portfolio[] = [];
  let allMedia: PortfolioMedia[] = [];
  let reviews: EventReview[] = [];
  try {
    [media, allPortfolios, allMedia, reviews] = await Promise.all([
      fetchPortfolioMedia(portfolio.id),
      fetchPortfolios(),
      fetchAllPortfolioMedia(),
      fetchEventReviews(portfolio.id),
    ]);
  } catch {
    try { media = await fetchPortfolioMedia(portfolio.id); } catch { /* */ }
  }

  if (allPortfolios.length === 0) allPortfolios = PORTFOLIOS;
  const visibleAll = allPortfolios.filter((p) => p.isVisible);

  // 이전/다음 포트폴리오
  const currentIdx = visibleAll.findIndex((p) => p.slug === portfolio.slug || p.id === portfolio.id);
  const prevPortfolio = currentIdx > 0 ? visibleAll[currentIdx - 1] : null;
  const nextPortfolio = currentIdx < visibleAll.length - 1 ? visibleAll[currentIdx + 1] : null;

  // 관련 행사: 카테고리(tags[0]) 또는 고객사 일치, 최대 3개
  const category = portfolio.tags?.[0];
  const related = visibleAll
    .filter((p) => p.id !== portfolio.id)
    .map((p) => {
      let score = 0;
      if (category && p.tags?.[0] === category) score += 3;
      if (portfolio.client && p.client === portfolio.client) score += 2;
      const commonTags = (p.tags || []).filter((t) => (portfolio.tags || []).includes(t));
      score += commonTags.length * 0.5;
      return { portfolio: p, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((r) => {
      const pm = allMedia.filter((m) => m.portfolioId === r.portfolio.id && m.type === "photo");
      return { ...r.portfolio, thumbnailUrl: pm[0]?.url || r.portfolio.imageUrl || "" };
    });

  const url = `${SITE_URL}/work/${portfolio.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: portfolio.title,
    description: portfolio.description ?? "",
    url,
    ...(portfolio.imageUrl ? { image: portfolio.imageUrl } : {}),
    creator: {
      "@type": "Organization",
      name: "파란컴퍼니",
      url: SITE_URL,
    },
    ...(portfolio.client
      ? { accountablePerson: { "@type": "Organization", name: portfolio.client } }
      : {}),
    ...(reviews.length > 0
      ? {
          review: reviews.map((r) => ({
            "@type": "Review",
            author: {
              "@type": "Person",
              name: r.reviewerName,
              ...(r.organization ? { worksFor: { "@type": "Organization", name: r.organization } } : {}),
            },
            reviewBody: r.content,
            reviewRating: {
              "@type": "Rating",
              ratingValue: String(r.rating),
              bestRating: "5",
            },
          })),
        }
      : {}),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "홈", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "포트폴리오", item: `${SITE_URL}/work` },
      { "@type": "ListItem", position: 3, name: portfolio.title, item: url },
    ],
  };

  // 영상이 있는 행사에 VideoObject 구조화 데이터 추가
  const videos = media.filter((m) => m.type === "video");
  const videoLdList = videos.map((v) => ({
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: v.label || `${portfolio.title} 현장영상`,
    description: `${portfolio.title} - ${portfolio.client ? portfolio.client + " " : ""}행사 현장영상`,
    contentUrl: v.url,
    thumbnailUrl: portfolio.imageUrl || `${SITE_URL}/og-image.png`,
    uploadDate: portfolio.eventDate || new Date().toISOString(),
  }));

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
      {videoLdList.map((vLd, i) => (
        <script
          key={`video-ld-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(vLd) }}
        />
      ))}
      <WorkDetailClient
        portfolio={portfolio}
        media={media}
        relatedEvents={related}
        prevPortfolio={prevPortfolio ? { slug: prevPortfolio.slug || prevPortfolio.id, title: prevPortfolio.title } : null}
        nextPortfolio={nextPortfolio ? { slug: nextPortfolio.slug || nextPortfolio.id, title: nextPortfolio.title } : null}
      />
    </>
  );
}
