import Link from "next/link";
import type { DesignGroup } from "../_groups";
import ServiceFAQ from "../../_components/ServiceFAQ";
import ServiceProcess from "../../_components/ServiceProcess";
import ServiceCTA from "../../_components/ServiceCTA";
import TrustBadges from "../../_components/TrustBadges";
import ServiceSubNav from "../../_components/ServiceSubNav";

const SITE_URL = "https://parancompany.co.kr";

export default function DesignGroupPage({ group }: { group: DesignGroup }) {
  const pageUrl = `${SITE_URL}/services/design/${group.key}`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "홈", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "서비스", item: `${SITE_URL}/services` },
      { "@type": "ListItem", position: 3, name: "행사 디자인", item: `${SITE_URL}/services/design` },
      { "@type": "ListItem", position: 4, name: group.label, item: pageUrl },
    ],
  };

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: group.label,
    description: group.metaDescription,
    provider: { "@type": "Organization", name: "파란컴퍼니", url: SITE_URL },
    areaServed: { "@type": "Country", name: "대한민국" },
    serviceType: "Design",
    offers: {
      "@type": "Offer",
      priceCurrency: "KRW",
      description: "수량·규격에 따라 별도 견적. 수정 3회 포함.",
      availability: "https://schema.org/InStock",
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: group.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* Hero */}
      <section className="relative bg-[#091041] pt-28 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="relative z-10 mx-auto max-w-[1200px] px-5 md:px-8">
          <nav aria-label="breadcrumb" className="hidden md:block text-[11px] text-white/40 mb-8">
            <Link href="/" className="hover:text-white/70 transition-colors">홈</Link>
            <span className="mx-2 text-white/20">/</span>
            <Link href="/services" className="hover:text-white/70 transition-colors">서비스</Link>
            <span className="mx-2 text-white/20">/</span>
            <Link href="/services/design" className="hover:text-white/70 transition-colors">행사 디자인</Link>
            <span className="mx-2 text-white/20">/</span>
            <span className="text-white/60">{group.label}</span>
          </nav>
          <div className="max-w-3xl">
            <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-white mb-5">
              {group.h1}
            </h1>
            <p className="text-base md:text-lg text-slate-300 leading-relaxed mb-8">
              {group.intro}
            </p>
            <TrustBadges variant="dark" />
          </div>
        </div>
      </section>

      <ServiceSubNav />

      {/* 품목 */}
      <section className="py-16 md:py-24 px-5 md:px-8">
        <div className="mx-auto max-w-[1000px]">
          <h2 className="text-xl md:text-2xl font-bold mb-10">제작 항목</h2>
          <div className="grid gap-5 md:gap-6">
            {group.items.map((item) => (
              <div
                key={item.anchor}
                id={item.anchor}
                className="scroll-mt-28 p-6 md:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-5 md:gap-7"
              >
                <div className="shrink-0">
                  <div className="w-[58px] h-[58px] rounded-[17px] bg-blue-50 flex items-center justify-center">
                    <item.icon size={28} weight="fill" color="#2563EB" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-2">{item.name}</h3>
                  <p className="text-slate-600 text-sm leading-[1.8] mb-3">{item.desc}</p>
                  <p className="text-xs text-blue-700 bg-blue-50/70 rounded-lg px-3 py-2 inline-block mb-2">{item.specs}</p>
                  <p className="text-xs text-slate-400">{item.examples}</p>
                </div>
              </div>
            ))}
          </div>

          {/* 견적·포트폴리오 CTA */}
          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <Link
              href="/services/design/estimate"
              className="flex-1 text-center px-6 py-4 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-colors"
            >
              디자인 견적 바로 계산하기 →
            </Link>
            {group.workFilter && (
              <Link
                href={`/work?view=design&design=${encodeURIComponent(group.workFilter)}`}
                className="flex-1 text-center px-6 py-4 rounded-xl border border-slate-300 text-slate-700 font-medium text-sm hover:bg-slate-50 transition-colors"
              >
                관련 포트폴리오 보기 →
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* 프로세스 */}
      <ServiceProcess />

      {/* FAQ */}
      <section className="py-16 md:py-24 px-5 md:px-8">
        <div className="mx-auto max-w-[800px]">
          <h2 className="text-xl md:text-2xl font-bold mb-10">{group.label} 자주 묻는 질문</h2>
          <ServiceFAQ items={group.faq} />
          <div className="text-center mt-8">
            <Link href="/faq" className="text-sm text-blue-600 font-medium hover:underline">
              전체 FAQ 보기 →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <ServiceCTA
        title="필요한 디자인, 견적부터 확인해 보세요"
        relatedServices={[
          { href: "/services/design", label: "행사 디자인 전체" },
          { href: "/services/design/estimate", label: "디자인 견적 계산" },
          { href: "/services/government", label: "공공기관 행사 대행" },
          { href: "/guide/pricing", label: "비용·견적 안내" },
        ]}
      />
    </>
  );
}
