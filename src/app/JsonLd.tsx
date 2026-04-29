/**
 * 사이트 전역 JSON-LD 구조화 데이터 (layout.tsx에서 모든 페이지에 포함됨).
 *
 * 여기에는 사이트 전체에 한 번만 정의해야 하는 스키마만 둔다:
 *   - Organization (회사 정보)
 *   - LocalBusiness (오프라인 사업장)
 *   - WebSite (사이트 메타)
 *
 * FAQPage / BreadcrumbList 등 페이지 단위 스키마는 각 page.tsx에서 자체적으로 출력한다.
 * (글로벌에 두면 모든 페이지에 같은 스키마가 출력돼 페이지별 스키마와 충돌하므로 금지)
 */
export default function JsonLd() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://parancompany.co.kr";

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "파란컴퍼니",
    url: siteUrl,
    logo: `${siteUrl}/logo.svg`,
    description:
      "행사 대행 전문 업체. 세미나·컨퍼런스·포럼 기획부터 운영까지 원스톱 대행 서비스. 공공기관·기업 대상 250건 이상의 프로젝트 수행, 기획·디자인·운영을 책임집니다.",
    foundingDate: "2015",
    numberOfEmployees: {
      "@type": "QuantitativeValue",
      value: 8,
    },
    award: ["여성기업인증", "직접생산확인증명서(행사대행업)"],
    hasCredential: [
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "여성기업확인서",
        recognizedBy: { "@type": "Organization", name: "여성기업종합지원센터" },
      },
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "직접생산확인증명서",
        recognizedBy: { "@type": "Organization", name: "중소벤처기업부" },
      },
    ],
    taxID: "291-86-02802",
    areaServed: {
      "@type": "Country",
      name: "대한민국",
    },
    knowsAbout: [
      "행사 대행",
      "행사 기획",
      "세미나 대행",
      "컨퍼런스 운영",
      "포럼 기획",
      "행사 디자인",
      "공간 연출",
      "행사 영상 촬영",
      "케이터링",
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "효원로 278, 6층 603호",
      addressLocality: "수원시 팔달구",
      addressRegion: "경기도",
      addressCountry: "KR",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+82-2-6342-2800",
      contactType: "customer service",
      availableLanguage: "Korean",
    },
  };

  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "파란컴퍼니",
    image: `${siteUrl}/og-image.png`,
    url: siteUrl,
    telephone: "+82-2-6342-2800",
    address: {
      "@type": "PostalAddress",
      streetAddress: "효원로 278, 6층 603호",
      addressLocality: "수원시 팔달구",
      addressRegion: "경기도",
      addressCountry: "KR",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
    areaServed: {
      "@type": "Country",
      name: "대한민국",
    },
    priceRange: "$$",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      bestRating: "5",
      ratingCount: "4",
    },
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "파란컴퍼니",
    url: siteUrl,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
    </>
  );
}
