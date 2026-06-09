import Link from "next/link";
import { Check, X } from "@phosphor-icons/react/dist/ssr";
import type { DesignGroup } from "../_groups";
import { DESIGN_COMMON } from "../_groups";
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
    offers: { "@type": "Offer", priceCurrency: "KRW", description: "수량·규격에 따라 별도 견적. 수정 3회 포함.", availability: "https://schema.org/InStock" },
  };
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: group.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* ═══ Hero ═══ */}
      <section className="relative bg-[#091041] pt-28 pb-20 md:pt-32 md:pb-28 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-60" style={{ background: "radial-gradient(60% 60% at 80% 10%, rgba(37,99,235,0.25) 0%, transparent 70%)" }} />
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
            <p className="mb-4 text-[12px] font-bold uppercase tracking-[0.14em] text-blue-300">{group.label}</p>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-5 leading-[1.2]">
              {group.h1}
            </h1>
            <p className="text-base md:text-lg text-slate-300 leading-relaxed mb-7 max-w-2xl">{group.intro}</p>
            <div className="mb-8 flex flex-wrap gap-2.5">
              {["시안 3~5일", "수정 3회 포함", "공공기관 수의계약 가능"].map((b) => (
                <span key={b} className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/30 bg-blue-400/10 px-3.5 py-1.5 text-xs font-medium text-blue-200">
                  <Check size={14} weight="bold" /> {b}
                </span>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/services/design/estimate" className="text-center px-6 py-3.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-colors">
                디자인 견적 바로 계산 →
              </Link>
              {group.workFilter && (
                <Link href={`/work?view=design&design=${encodeURIComponent(group.workFilter)}`} className="text-center px-6 py-3.5 rounded-xl border border-white/20 text-white font-medium text-sm hover:bg-white/10 transition-colors">
                  작업 사례 보기 →
                </Link>
              )}
            </div>
            <div className="mt-8"><TrustBadges variant="dark" /></div>
          </div>
        </div>
      </section>

      <ServiceSubNav />

      {/* ═══ 고민 (Pain Points) ═══ */}
      <section className="bg-white py-16 md:py-24 px-5 md:px-8">
        <div className="mx-auto max-w-[1200px]">
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-blue-600 mb-3">PAIN POINTS</p>
          <h2 className="text-xl md:text-3xl font-bold text-[#0d1a4e] mb-3">혹시 이런 고민, 있으셨나요?</h2>
          <p className="text-slate-500 text-sm md:text-base mb-10">디자인 업체와 일하며 한 번쯤 겪는 문제들. 파란컴퍼니는 이 지점부터 다릅니다.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {DESIGN_COMMON.painPoints.map((p) => (
              <div key={p.num} className="group p-6 md:p-7 rounded-2xl border border-slate-200/80 bg-white shadow-sm hover:-translate-y-1.5 hover:border-blue-300 hover:shadow-[0_20px_40px_-20px_rgba(37,99,235,0.3)] transition-all">
                <div className="text-sm font-extrabold tracking-[0.08em] text-blue-600 mb-3">{p.num}</div>
                <h3 className="font-bold text-lg text-[#0d1a4e] mb-2">{p.title}</h3>
                <p className="text-slate-500 text-sm leading-[1.7]">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 솔루션 (Why) ═══ */}
      <section className="bg-[#091041] py-16 md:py-24 px-5 md:px-8">
        <div className="mx-auto max-w-[1200px]">
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-blue-300 mb-3">WHY PARAN</p>
          <h2 className="text-xl md:text-3xl font-bold text-white mb-10">파란컴퍼니에 맡겨야 하는 이유</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {DESIGN_COMMON.solutionCards.map((c) => (
              <div key={c.title} className="p-6 md:p-7 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm hover:-translate-y-2 hover:bg-white/[0.07] hover:border-blue-400/40 transition-all">
                <div className="w-[52px] h-[52px] rounded-[15px] bg-blue-500/15 border border-blue-400/25 flex items-center justify-center mb-4">
                  <c.icon size={26} weight="fill" color="#60a5fa" />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-blue-300 mb-2">{c.kicker}</p>
                <h3 className="font-bold text-lg text-white mb-2 leading-snug">{c.title}</h3>
                <p className="text-slate-300/80 text-sm leading-[1.7]">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 제작 항목 ═══ */}
      <section className="bg-slate-50 py-16 md:py-24 px-5 md:px-8">
        <div className="mx-auto max-w-[1000px]">
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-blue-600 mb-3">LINEUP</p>
          <h2 className="text-xl md:text-3xl font-bold text-[#0d1a4e] mb-10">제작 항목</h2>
          <div className="grid gap-5 md:gap-6">
            {group.items.map((item) => (
              <div key={item.anchor} id={item.anchor} className="scroll-mt-28 p-6 md:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-5 md:gap-7">
                <div className="shrink-0">
                  <div className="w-[58px] h-[58px] rounded-[17px] bg-blue-50 flex items-center justify-center">
                    <item.icon size={28} weight="fill" color="#2563EB" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-[#0d1a4e] mb-2">{item.name}</h3>
                  <p className="text-slate-600 text-sm leading-[1.8] mb-3">{item.desc}</p>
                  <p className="text-xs text-blue-700 bg-blue-50/70 rounded-lg px-3 py-2 inline-block mb-2">{item.specs}</p>
                  <p className="text-xs text-slate-400">{item.examples}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <Link href="/services/design/estimate" className="flex-1 text-center px-6 py-4 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-colors">
              디자인 견적 바로 계산하기 →
            </Link>
            {group.workFilter && (
              <Link href={`/work?view=design&design=${encodeURIComponent(group.workFilter)}`} className="flex-1 text-center px-6 py-4 rounded-xl border border-slate-300 text-slate-700 font-medium text-sm hover:bg-white transition-colors">
                관련 포트폴리오 보기 →
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ═══ 비교표 ═══ */}
      <section className="bg-white py-16 md:py-24 px-5 md:px-8">
        <div className="mx-auto max-w-[920px]">
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-blue-600 mb-3">COMPARISON</p>
          <h2 className="text-xl md:text-3xl font-bold text-[#0d1a4e] mb-10">일반 업체와 비교해 보세요</h2>
          <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-[0_20px_60px_-30px_rgba(13,26,110,0.2)]">
            <div className="grid grid-cols-[1.1fr_1fr_1fr] bg-[#091041] text-white text-xs md:text-sm font-bold">
              <div className="px-4 md:px-6 py-4">항목</div>
              <div className="px-4 md:px-6 py-4 text-slate-300">일반 디자인 업체</div>
              <div className="px-4 md:px-6 py-4 text-blue-300 bg-blue-600/15">파란컴퍼니</div>
            </div>
            {DESIGN_COMMON.comparisonRows.map((row, i) => (
              <div key={row.label} className={`grid grid-cols-[1.1fr_1fr_1fr] text-xs md:text-sm border-t border-slate-100 ${i % 2 ? "bg-slate-50/50" : "bg-white"}`}>
                <div className="px-4 md:px-6 py-4 font-bold text-[#0d1a4e]">{row.label}</div>
                <div className="px-4 md:px-6 py-4 text-slate-400 flex items-start gap-1.5">
                  <X size={15} weight="bold" className="mt-0.5 shrink-0 text-slate-300" /> {row.general}
                </div>
                <div className="px-4 md:px-6 py-4 font-semibold text-[#0d1a4e] bg-blue-50/40 border-l border-blue-100 flex items-start gap-1.5">
                  <Check size={15} weight="bold" className="mt-0.5 shrink-0 text-blue-600" /> {row.ours}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 실적 ═══ */}
      <section className="bg-[#091041] py-16 md:py-20 px-5 md:px-8">
        <div className="mx-auto max-w-[1000px]">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {DESIGN_COMMON.stats.map((s) => (
              <div key={s.label} className="text-center p-6 rounded-2xl border border-white/10 bg-white/[0.04]">
                <div className="text-3xl md:text-4xl font-extrabold text-blue-400 mb-1.5">{s.num}</div>
                <div className="mx-auto mb-2 h-0.5 w-7 rounded bg-blue-400/60" />
                <div className="text-xs md:text-sm text-slate-300/80 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 프로세스 ═══ */}
      <ServiceProcess />

      {/* ═══ FAQ ═══ */}
      <section className="bg-white py-16 md:py-24 px-5 md:px-8">
        <div className="mx-auto max-w-[800px]">
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-blue-600 mb-3">FAQ</p>
          <h2 className="text-xl md:text-3xl font-bold text-[#0d1a4e] mb-10">{group.label} 자주 묻는 질문</h2>
          <ServiceFAQ items={group.faq} />
          <div className="text-center mt-8">
            <Link href="/faq" className="text-sm text-blue-600 font-medium hover:underline">전체 FAQ 보기 →</Link>
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
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
