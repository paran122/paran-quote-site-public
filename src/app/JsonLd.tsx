const faqData = [
  { q: "어떤 종류의 행사를 전문으로 하나요?", a: "세미나, 컨퍼런스, 포럼, 학술대회, 심포지엄, 워크숍, 기념식, 축제 등 다양한 형태의 행사를 기획·운영합니다. 특히 공공기관과 기업의 세미나·컨퍼런스 대행에 강점이 있으며, 250건 이상의 프로젝트 수행 경험을 보유하고 있습니다." },
  { q: "소규모(30명) 행사도 가능한가요?", a: "네, 가능합니다. 30명 이하의 소규모 세미나부터 500명 이상의 대규모 컨퍼런스까지 규모에 관계없이 대응합니다." },
  { q: "기획만 맡기거나 운영만 맡길 수 있나요?", a: "네, 가능합니다. 기획만, 디자인만, 운영만 등 필요한 부분만 선택하여 의뢰하실 수 있습니다." },
  { q: "시안물(포스터, 현수막) 제작도 해주나요?", a: "네, 행사 시안물 디자인을 전문적으로 제작합니다. 포스터, 현수막, 배너, 리플렛, 초청장, 명찰, 무대 디자인 등 행사에 필요한 모든 인쇄물과 디지털 디자인을 자체 제작합니다." },
  { q: "행사 영상 촬영/편집도 가능한가요?", a: "네, 행사 현장 촬영(사진·영상)과 편집 서비스를 제공합니다. 행사 스케치 영상, 인터뷰 촬영, 하이라이트 영상 제작 등이 가능합니다." },
  { q: "세미나 대행 비용은 얼마인가요?", a: "행사 규모, 형태, 서비스 범위에 따라 달라집니다. 소규모 세미나(30~50명)는 약 300만 원부터, 중규모 컨퍼런스(100~200명)는 약 800만 원부터 시작합니다." },
  { q: "견적은 어떻게 받나요?", a: "홈페이지의 '견적 요청' 버튼을 통해 간단한 행사 정보를 입력하시면 1영업일 내에 맞춤 견적서를 보내드립니다. 전화(02-6342-2800) 또는 카카오톡 상담으로도 견적 문의가 가능합니다." },
  { q: "패키지와 개별 서비스의 차이는?", a: "패키지는 기획·디자인·운영을 묶어 할인된 가격으로 제공하는 상품이며, 개별 서비스는 필요한 항목만 선택하는 방식입니다. 패키지 이용 시 약 10~20% 비용 절감 효과가 있습니다." },
  { q: "예산이 제한적인데 조율 가능한가요?", a: "네, 가능합니다. 예산 범위 내에서 최대 효과를 낼 수 있도록 우선순위에 따른 서비스 구성을 제안드립니다." },
  { q: "행사 규모에 따라 가격이 어떻게 달라지나요?", a: "참석자 수, 행사 기간, 장소 규모, 필요 장비, 케이터링 여부 등에 따라 가격이 달라집니다. 규모가 클수록 단가 효율이 높아집니다." },
  { q: "행사 준비 기간은 최소 얼마나 필요한가요?", a: "소규모 세미나는 최소 2~3주, 중대규모 컨퍼런스·포럼은 최소 4~6주 전에 의뢰해 주시는 것이 좋습니다." },
  { q: "진행 절차가 어떻게 되나요?", a: "상담 및 요구사항 파악 → 기획안·견적서 제출 → 계약 → 세부 기획·디자인 → 사전 리허설 → 행사 당일 운영 → 결과보고서 제출 순서로 진행됩니다." },
  { q: "현장에 몇 명이 지원 나오나요?", a: "행사 규모와 성격에 따라 2~10명의 전문 인력이 투입됩니다. 소규모 세미나는 PM 1명 + 운영 1~2명, 대규모 행사는 PM + 디자이너 + 음향·영상 + 운영 스태프로 구성됩니다." },
  { q: "행사 후 결과보고서를 받을 수 있나요?", a: "네, 모든 행사 완료 후 결과보고서를 제공합니다. 행사 개요, 진행 과정, 현장 사진·영상, 참석자 통계, 만족도 조사 결과 등을 포함합니다." },
  { q: "파란컴퍼니는 어떤 회사인가요?", a: "파란컴퍼니는 2015년 설립된 행사 기획·운영 전문 에이전시입니다. 세미나, 컨퍼런스, 포럼, 학술대회 등을 전문으로 하며, 여성기업 인증 업체입니다." },
  { q: "공공기관 행사 경험이 있나요?", a: "네, 다수의 공공기관 행사를 수행한 경험이 있습니다. 교육부, 해군, 경기도교육청, 수원시 등 정부 부처 및 지자체, 공기업의 세미나·포럼·컨퍼런스를 진행했습니다." },
  { q: "지금까지 몇 건의 행사를 수행했나요?", a: "2015년 설립 이후 250건 이상의 행사를 성공적으로 수행했습니다. 연간 100여 회의 행사를 진행하고 있습니다." },
  { q: "어떤 고객사와 일하나요?", a: "공공기관(교육부, 해군, 경기도교육청, 수원시 등), 공기업, 대학교, 협회·학회, 민간기업 등 다양한 분야의 고객사와 협업하고 있습니다." },
];

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
      "세미나·컨퍼런스·포럼 행사 기획 운영 전문 에이전시. 공공기관·기업 대상 250건 이상의 프로젝트 수행, 기획부터 디자인·운영까지 원스톱 서비스를 제공합니다.",
    foundingDate: "2015",
    numberOfEmployees: {
      "@type": "QuantitativeValue",
      value: 8,
    },
    award: "여성기업인증",
    areaServed: {
      "@type": "Country",
      name: "대한민국",
    },
    knowsAbout: [
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

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    url: `${siteUrl}/faq`,
    mainEntity: faqData.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "홈",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "자주 묻는 질문",
        item: `${siteUrl}/faq`,
      },
    ],
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
    </>
  );
}
