import type { Metadata } from "next";
import GuideIndexClient from "./GuideIndexClient";

const SITE_URL = "https://parancompany.co.kr";

export const metadata: Metadata = {
  title: "행사 가이드",
  description:
    "행사 준비 체크리스트, 진행 절차, 비용 가이드, 장소 선택, 규모별 가이드까지. 성공적인 행사 기획에 필요한 모든 정보를 한 곳에서 확인하세요.",
  alternates: { canonical: `${SITE_URL}/guide` },
  openGraph: {
    title: "행사 가이드 | 파란컴퍼니",
    description:
      "행사 준비부터 마무리까지, 기획에 필요한 실무 가이드 모음.",
    type: "website",
    url: `${SITE_URL}/guide`,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "행사 가이드 — 파란컴퍼니",
  description:
    "행사 준비 체크리스트, 진행 절차, 비용 가이드, 장소 선택, 규모별 가이드를 포함한 행사 기획 실무 가이드 모음.",
  publisher: { "@type": "Organization", name: "파란컴퍼니", url: SITE_URL },
  mainEntityOfPage: `${SITE_URL}/guide`,
  hasPart: [
    {
      "@type": "Article",
      name: "행사 준비 체크리스트",
      url: `${SITE_URL}/guide/checklist`,
    },
    {
      "@type": "Article",
      name: "행사 진행 절차",
      url: `${SITE_URL}/guide/process`,
    },
    {
      "@type": "Article",
      name: "행사 비용 가이드",
      url: `${SITE_URL}/guide/pricing`,
    },
    {
      "@type": "Article",
      name: "행사 장소 선택 가이드",
      url: `${SITE_URL}/guide/venue`,
    },
    {
      "@type": "Article",
      name: "행사 규모별 가이드",
      url: `${SITE_URL}/guide/scale`,
    },
  ],
};

export default function GuidePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <GuideIndexClient />
    </>
  );
}
