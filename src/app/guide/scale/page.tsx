import type { Metadata } from "next";
import ScaleClient from "./ScaleClient";

const SITE_URL = "https://parancompany.co.kr";

export const metadata: Metadata = {
  title: "행사 규모별 가이드",
  description:
    "30명 소규모 세미나부터 500명 대규모 컨퍼런스까지, 규모에 따라 달라지는 준비사항과 필요 인력, 장비, 예산 범위를 안내합니다.",
  alternates: { canonical: `${SITE_URL}/guide/scale` },
  openGraph: {
    title: "행사 규모별 가이드 | 파란컴퍼니",
    description: "30명~500명, 규모에 따라 달라지는 행사 준비사항 안내.",
    type: "article",
    url: `${SITE_URL}/guide/scale`,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "행사 규모별 가이드 — 30명부터 500명까지",
  description:
    "30명 소규모 세미나부터 500명 대규모 컨퍼런스까지, 규모에 따라 달라지는 준비사항과 필요 인력, 장비, 예산 범위를 안내합니다.",
  author: { "@type": "Organization", name: "파란컴퍼니" },
  publisher: { "@type": "Organization", name: "파란컴퍼니", url: SITE_URL },
  mainEntityOfPage: `${SITE_URL}/guide/scale`,
};

export default function ScalePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ScaleClient />
    </>
  );
}
