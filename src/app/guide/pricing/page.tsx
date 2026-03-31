import type { Metadata } from "next";
import PricingClient from "./PricingClient";

const SITE_URL = "https://parancompany.co.kr";

export const metadata: Metadata = {
  title: "행사 대행 비용·견적 안내 | 파란컴퍼니",
  description:
    "행사 대행 비용이 궁금하신가요? 세미나·컨퍼런스·포럼 등 항목별 가격과 규모별 예산 가이드를 확인하세요. 소규모 600만 원부터, 투명한 견적을 안내드립니다.",
  alternates: { canonical: `${SITE_URL}/guide/pricing` },
  openGraph: {
    title: "행사 대행 비용·견적 안내 | 파란컴퍼니",
    description:
      "세미나·컨퍼런스·포럼 항목별 가격과 규모별 예산 가이드. 소규모 600만 원부터, 투명한 견적 안내.",
    type: "article",
    url: `${SITE_URL}/guide/pricing`,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "행사 대행 비용·견적 안내",
  description:
    "세미나, 컨퍼런스, 포럼 등 행사 대행 비용의 항목별 가격 범위와 규모별 예산 설계 방법을 안내합니다. 소규모 600만 원부터 대규모 3,000만 원까지 투명한 견적을 제공합니다.",
  provider: {
    "@type": "Organization",
    name: "파란컴퍼니",
    url: SITE_URL,
  },
  areaServed: "KR",
  serviceType: "행사 기획 대행",
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "행사 대행 비용은 얼마인가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "소규모 세미나(30~50명) 600만 원부터, 중규모 컨퍼런스(100~200명) 1,500만 원, 대규모 포럼·국제행사(300~500명) 3,000만 원부터 시작합니다. 행사 규모·장소·포함 항목에 따라 달라지며, 상담 후 투명하게 견적을 안내드립니다.",
      },
    },
    {
      "@type": "Question",
      name: "견적에 포함되는 항목은 무엇인가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "기획·운영, 디자인(포스터·현수막·배너), 영상 촬영, 케이터링, 연사 섭외, 음향 시스템 등 필요한 항목만 선택하여 맞춤 견적을 구성합니다.",
      },
    },
    {
      "@type": "Question",
      name: "행사 대행 견적은 어떻게 받나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "전화(02-6342-2800) 또는 홈페이지 견적 시뮬레이터를 통해 간편하게 예상 비용을 확인하실 수 있습니다. 상담 후 항목별 상세 견적서를 보내드립니다.",
      },
    },
  ],
};

export default function PricingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <PricingClient />
    </>
  );
}
