import type { Metadata } from "next";
import PricingClient from "./PricingClient";

const SITE_URL = "https://parancompany.co.kr";

export const metadata: Metadata = {
  title: "행사 비용 가이드",
  description:
    "세미나, 컨퍼런스, 포럼 등 행사 대행 비용의 항목별 가격 범위와 예산 설계 방법을 안내합니다.",
  alternates: { canonical: `${SITE_URL}/guide/pricing` },
  openGraph: {
    title: "행사 비용 가이드 | 파란컴퍼니",
    description: "행사 대행 비용의 항목별 가격 범위와 예산 설계 방법 안내.",
    type: "article",
    url: `${SITE_URL}/guide/pricing`,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "행사 비용 가이드 — 항목별 가격 범위와 예산 설계",
  description:
    "세미나, 컨퍼런스, 포럼 등 행사 대행 비용의 항목별 가격 범위와 예산 설계 방법을 안내합니다.",
  author: { "@type": "Organization", name: "파란컴퍼니" },
  publisher: { "@type": "Organization", name: "파란컴퍼니", url: SITE_URL },
  mainEntityOfPage: `${SITE_URL}/guide/pricing`,
};

export default function PricingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PricingClient />
    </>
  );
}
