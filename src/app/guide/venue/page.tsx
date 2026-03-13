import type { Metadata } from "next";
import VenueClient from "./VenueClient";

const SITE_URL = "https://parancompany.co.kr";

export const metadata: Metadata = {
  title: "행사 장소 선택 가이드",
  description:
    "세미나, 컨퍼런스, 교육 행사에 적합한 장소를 선택하는 방법. 장소 유형별 특성, 수용 인원, 체크포인트를 확인하세요.",
  alternates: { canonical: `${SITE_URL}/guide/venue` },
  openGraph: {
    title: "행사 장소 선택 가이드 | 파란컴퍼니",
    description: "행사에 적합한 장소를 선택하는 방법과 체크포인트.",
    type: "article",
    url: `${SITE_URL}/guide/venue`,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "행사 장소 선택 가이드 — 유형별 특성과 체크포인트",
  description:
    "세미나, 컨퍼런스, 교육 행사에 적합한 장소를 선택하는 방법. 장소 유형별 특성, 수용 인원, 체크포인트를 확인하세요.",
  author: { "@type": "Organization", name: "파란컴퍼니" },
  publisher: { "@type": "Organization", name: "파란컴퍼니", url: SITE_URL },
  mainEntityOfPage: `${SITE_URL}/guide/venue`,
};

export default function VenuePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <VenueClient />
    </>
  );
}
