import { fetchPortfolios, fetchAllPortfolioMedia } from "@/lib/queries";
import { PORTFOLIOS } from "@/lib/portfolioData";
import type { Portfolio, PortfolioMedia } from "@/types";
import WorkPageClient from "./WorkPageClient";

export default async function WorkPage() {
  let portfolios: Portfolio[] = [];
  let portfolioMedia: PortfolioMedia[] = [];

  try {
    [portfolios, portfolioMedia] = await Promise.all([
      fetchPortfolios(),
      fetchAllPortfolioMedia(),
    ]);
  } catch {
    portfolios = PORTFOLIOS;
    portfolioMedia = [];
  }

  // 폴백: Supabase에서 빈 결과가 오면 상수 데이터 사용
  if (portfolios.length === 0) {
    portfolios = PORTFOLIOS;
  }

  const visiblePortfolios = portfolios.filter((p) => p.isVisible);

  // JSON-LD 구조화 데이터
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "행사 대행 포트폴리오 · 사례",
    description:
      "파란컴퍼니의 행사 대행 포트폴리오입니다. 경기도교육청, 해군, 한국문화예술교육진흥원 등 다양한 고객사의 행사 사례를 확인하세요.",
    url: "https://parancompany.co.kr/work",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: visiblePortfolios.length,
      itemListElement: visiblePortfolios.map((pf, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        item: {
          "@type": "CreativeWork",
          name: pf.title,
          description: pf.description ?? "",
          url: `https://parancompany.co.kr/work/${pf.slug || pf.id}`,
          ...(pf.imageUrl ? { image: pf.imageUrl } : {}),
          creator: {
            "@type": "Organization",
            name: "파란컴퍼니",
          },
          ...(pf.client ? { accountablePerson: { "@type": "Organization", name: pf.client } } : {}),
        },
      })),
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "홈", item: "https://parancompany.co.kr" },
      { "@type": "ListItem", position: 2, name: "포트폴리오", item: "https://parancompany.co.kr/work" },
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
      <WorkPageClient
        portfolios={portfolios}
        portfolioMedia={portfolioMedia}
      />
    </>
  );
}
