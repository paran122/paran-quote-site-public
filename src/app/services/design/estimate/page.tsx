import type { Metadata } from "next";
import { Suspense } from "react";
import EstimateCalculator from "./_components/EstimateCalculator";

const SITE_URL = "https://parancompany.co.kr";

export const metadata: Metadata = {
  title: "디자인 견적 계산기 — 포스터·리플렛·현수막·PPT 실시간 견적 | 파란컴퍼니",
  description:
    "디자인 셀프 견적 계산기. 포스터·리플렛·현수막·카탈로그·PPT·카드뉴스·전시부스 항목을 선택하면 실시간으로 예상 견적을 확인할 수 있습니다. VAT 포함, 수정 3회 기준. 2개 이상 10% 할인.",
  keywords: ["디자인견적", "디자인견적계산기", "포스터견적", "현수막견적", "PPT견적", "디자인비용"],
  alternates: { canonical: `${SITE_URL}/services/design/estimate` },
  openGraph: {
    title: "디자인 견적 계산기 | 파란컴퍼니",
    description: "포스터·리플렛·현수막·PPT 등 디자인 항목을 선택하면 실시간 예상 견적. 2개 이상 10% 할인.",
    type: "website",
    url: `${SITE_URL}/services/design/estimate`,
    images: [{ url: "/og-image.png?v=2", width: 1200, height: 630, alt: "디자인 견적 계산기 - 파란컴퍼니" }],
  },
  twitter: { card: "summary_large_image", title: "디자인 견적 계산기 | 파란컴퍼니", description: "포스터·리플렛·현수막·PPT 디자인 실시간 견적 계산기." },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "홈", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "서비스", item: `${SITE_URL}/services` },
    { "@type": "ListItem", position: 3, name: "행사 디자인", item: `${SITE_URL}/services/design` },
    { "@type": "ListItem", position: 4, name: "디자인 견적 계산기", item: `${SITE_URL}/services/design/estimate` },
  ],
};

export default function EstimatePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      {/* Hero */}
      <section className="bg-[#091041] pt-28 pb-14 md:pt-32 md:pb-16">
        <div className="mx-auto max-w-[1000px] px-5 md:px-8">
          <nav aria-label="breadcrumb" className="hidden md:block text-[11px] text-white/40 mb-6">
            <span className="text-white/40">홈 / 서비스 / 행사 디자인 / </span>
            <span className="text-white/60">디자인 견적 계산기</span>
          </nav>
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-white mb-4">
            디자인 견적 계산기
          </h1>
          <p className="text-base md:text-lg text-slate-300 leading-relaxed">
            필요한 디자인 항목을 선택하면 예상 견적을 바로 확인할 수 있습니다.
            정확한 견적은 문의 후 1영업일 내 안내드립니다.
          </p>
        </div>
      </section>

      <Suspense fallback={<div className="py-24 text-center text-slate-400">불러오는 중…</div>}>
        <EstimateCalculator />
      </Suspense>
    </>
  );
}
