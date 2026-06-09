import Link from "next/link";
import Image from "next/image";
import { Check, X, Quotes, ShieldCheck } from "@phosphor-icons/react/dist/ssr";
import type { DesignGroup } from "../_groups";
import { DESIGN_COMMON, DESIGN_GALLERY, DESIGN_HERO_IMAGE } from "../_groups";
import ServiceFAQ from "../../_components/ServiceFAQ";
import ServiceCTA from "../../_components/ServiceCTA";
import ServiceSubNav from "../../_components/ServiceSubNav";

const SITE_URL = "https://parancompany.co.kr";

export default function DesignGroupPage({ group }: { group: DesignGroup }) {
  const pageUrl = `${SITE_URL}/services/design/${group.key}`;
  const heroImage = DESIGN_HERO_IMAGE[group.key];
  const gallery = DESIGN_GALLERY[group.key];

  const breadcrumbJsonLd = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "홈", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "서비스", item: `${SITE_URL}/services` },
      { "@type": "ListItem", position: 3, name: "행사 디자인", item: `${SITE_URL}/services/design` },
      { "@type": "ListItem", position: 4, name: group.label, item: pageUrl },
    ],
  };
  const serviceJsonLd = {
    "@context": "https://schema.org", "@type": "Service", name: group.label, description: group.metaDescription,
    provider: { "@type": "Organization", name: "파란컴퍼니", url: SITE_URL },
    areaServed: { "@type": "Country", name: "대한민국" }, serviceType: "Design",
    offers: { "@type": "Offer", priceCurrency: "KRW", description: "수량·규격에 따라 별도 견적. 수정 3회 포함.", availability: "https://schema.org/InStock" },
  };
  const faqJsonLd = {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: group.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* ═══ Hero (2-col: 카피 + 이미지) ═══ */}
      <section className="relative bg-[#091041] pt-28 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-60" style={{ background: "radial-gradient(55% 55% at 85% 15%, rgba(37,99,235,0.28) 0%, transparent 70%)" }} />
        <div className="relative z-10 mx-auto max-w-[1200px] px-5 md:px-8">
          <nav aria-label="breadcrumb" className="hidden md:block text-[11px] text-white/40 mb-8">
            <Link href="/" className="hover:text-white/70 transition-colors">홈</Link><span className="mx-2 text-white/20">/</span>
            <Link href="/services" className="hover:text-white/70 transition-colors">서비스</Link><span className="mx-2 text-white/20">/</span>
            <Link href="/services/design" className="hover:text-white/70 transition-colors">행사 디자인</Link><span className="mx-2 text-white/20">/</span>
            <span className="text-white/60">{group.label}</span>
          </nav>
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-12 items-center">
            <div>
              <p className="mb-4 text-[12px] font-bold uppercase tracking-[0.14em] text-blue-300">{group.label}</p>
              <h1 className="text-2xl md:text-4xl lg:text-[44px] font-bold tracking-tight text-white mb-5 leading-[1.2]">{group.h1}</h1>
              <p className="text-base md:text-lg text-slate-300 leading-relaxed mb-7">{group.intro}</p>
              <div className="mb-8 flex flex-wrap gap-2.5">
                {["시안 3~5일", "수정 3회 포함", "AI+PSD+PDF 원본 제공"].map((b) => (
                  <span key={b} className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/30 bg-blue-400/10 px-3.5 py-1.5 text-xs font-medium text-blue-200">
                    <Check size={14} weight="bold" /> {b}
                  </span>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/services/design/estimate" className="text-center px-6 py-3.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-colors">디자인 견적 바로 계산 →</Link>
                {group.workFilter && (
                  <Link href={`/work?view=design&design=${encodeURIComponent(group.workFilter)}`} className="text-center px-6 py-3.5 rounded-xl border border-white/20 text-white font-medium text-sm hover:bg-white/10 transition-colors">작업 사례 보기 →</Link>
                )}
              </div>
            </div>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.6)]">
              <Image src={heroImage} alt={`${group.label} 대표 작업물`} fill className="object-cover" sizes="(max-width:1024px) 100vw, 45vw" priority />
            </div>
          </div>
        </div>
      </section>

      <ServiceSubNav />

      {/* ═══ 고민 ═══ */}
      <section className="bg-white py-16 md:py-24 px-5 md:px-8">
        <div className="mx-auto max-w-[1200px]">
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-blue-600 mb-3">PAIN POINTS</p>
          <h2 className="text-xl md:text-3xl font-bold text-[#0d1a4e] mb-10">혹시 이런 고민, 있으셨나요?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {DESIGN_COMMON.painPoints.map((p) => (
              <div key={p.num} className="group p-6 md:p-7 rounded-2xl border border-slate-200/80 bg-white shadow-sm hover:-translate-y-1.5 hover:border-blue-300 hover:shadow-[0_20px_40px_-20px_rgba(37,99,235,0.3)] transition-all">
                <div className="text-sm font-extrabold tracking-[0.08em] text-blue-600 mb-3">{p.num}</div>
                <h3 className="font-bold text-lg text-[#0d1a4e] mb-2 leading-snug">{p.title}</h3>
                <p className="text-slate-500 text-sm leading-[1.7]">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 솔루션 ═══ */}
      <section className="bg-[#091041] py-16 md:py-24 px-5 md:px-8">
        <div className="mx-auto max-w-[1200px]">
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-blue-300 mb-3">WHY PARAN</p>
          <h2 className="text-xl md:text-3xl font-bold text-white mb-10">파란컴퍼니가 다른 이유</h2>
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
        </div>
      </section>

      {/* ═══ 작업 사례 갤러리 ═══ */}
      <section className="bg-white py-16 md:py-24 px-5 md:px-8">
        <div className="mx-auto max-w-[1200px]">
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-blue-600 mb-3">PORTFOLIO</p>
          <div className="flex items-end justify-between mb-10 gap-4">
            <h2 className="text-xl md:text-3xl font-bold text-[#0d1a4e]">{group.label} 작업 사례</h2>
            {group.workFilter && (
              <Link href={`/work?view=design&design=${encodeURIComponent(group.workFilter)}`} className="shrink-0 text-sm text-blue-600 font-medium hover:underline">전체 보기 →</Link>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {gallery.map((img) => (
              <div key={img.src} className="group relative aspect-[3/4] rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                <Image src={img.src} alt={img.alt} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width:768px) 50vw, 25vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#091041]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <span className="text-white text-xs font-medium leading-snug">{img.alt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 비교표 ═══ */}
      <section className="bg-slate-50 py-16 md:py-24 px-5 md:px-8">
        <div className="mx-auto max-w-[920px]">
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-blue-600 mb-3">COMPARISON</p>
          <h2 className="text-xl md:text-3xl font-bold text-[#0d1a4e] mb-10">일반 업체와 비교해 보세요</h2>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_60px_-30px_rgba(13,26,110,0.2)]">
            <div className="grid grid-cols-[1.1fr_1fr_1fr] bg-[#091041] text-white text-xs md:text-sm font-bold">
              <div className="px-4 md:px-6 py-4">항목</div>
              <div className="px-4 md:px-6 py-4 text-slate-300">일반 업체</div>
              <div className="px-4 md:px-6 py-4 text-blue-300 bg-blue-600/15">파란컴퍼니</div>
            </div>
            {DESIGN_COMMON.comparisonRows.map((row, i) => (
              <div key={row.label} className={`grid grid-cols-[1.1fr_1fr_1fr] text-xs md:text-sm border-t border-slate-100 ${i % 2 ? "bg-slate-50/50" : "bg-white"}`}>
                <div className="px-4 md:px-6 py-4 font-bold text-[#0d1a4e]">{row.label}</div>
                <div className="px-4 md:px-6 py-4 text-slate-400 flex items-start gap-1.5"><X size={15} weight="bold" className="mt-0.5 shrink-0 text-slate-300" /> {row.general}</div>
                <div className="px-4 md:px-6 py-4 font-semibold text-[#0d1a4e] bg-blue-50/40 border-l border-blue-100 flex items-start gap-1.5"><Check size={15} weight="bold" className="mt-0.5 shrink-0 text-blue-600" /> {row.ours}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 실적 + 클라이언트 ═══ */}
      <section className="bg-[#091041] py-16 md:py-20 px-5 md:px-8">
        <div className="mx-auto max-w-[1000px]">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
            {DESIGN_COMMON.stats.map((s) => (
              <div key={s.label} className="text-center p-6 rounded-2xl border border-white/10 bg-white/[0.04]">
                <div className="text-3xl md:text-4xl font-extrabold text-blue-400 mb-1.5">{s.num}</div>
                <div className="mx-auto mb-2 h-0.5 w-7 rounded bg-blue-400/60" />
                <div className="text-xs md:text-sm text-slate-300/80 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-center">
            {DESIGN_COMMON.clients.map((c) => (
              <span key={c} className="text-xs md:text-sm text-white/40">{c}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 프로세스 (디자인 전용) ═══ */}
      <section className="bg-slate-50 py-16 md:py-24 px-5 md:px-8">
        <div className="mx-auto max-w-[1100px]">
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-blue-600 mb-3">PROCESS</p>
          <h2 className="text-xl md:text-3xl font-bold text-[#0d1a4e] mb-10">의뢰부터 납품까지, 약 7일</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
            {DESIGN_COMMON.process.map((step, i) => (
              <div key={step.title} className="relative p-5 rounded-2xl bg-white border border-slate-200/80 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 font-extrabold">{i + 1}</div>
                <div className="inline-block mb-2 rounded-full bg-blue-600/10 px-2.5 py-1 text-[11px] font-bold text-blue-600">{step.badge}</div>
                <h4 className="font-bold text-sm text-[#0d1a4e] mb-1">{step.title}</h4>
                <p className="text-xs text-slate-500 leading-[1.6]">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 후기 ═══ */}
      <section className="bg-white py-16 md:py-24 px-5 md:px-8">
        <div className="mx-auto max-w-[1100px]">
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-blue-600 mb-3">CLIENT VOICE</p>
          <h2 className="text-xl md:text-3xl font-bold text-[#0d1a4e] mb-10">담당자분들의 이야기</h2>
          <div className="grid md:grid-cols-3 gap-4 md:gap-5">
            {DESIGN_COMMON.testimonials.map((t) => (
              <div key={t.name} className="flex flex-col gap-4 p-6 md:p-7 rounded-2xl border border-slate-200/80 bg-white shadow-sm">
                <Quotes size={28} weight="fill" className="text-blue-500/40" />
                <blockquote className="flex-1 text-[15px] font-medium leading-[1.7] text-[#0d1a4e]">{t.quote}</blockquote>
                <div className="border-t border-slate-100 pt-4">
                  <div className="text-sm font-bold text-[#0d1a4e]">{t.name}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="bg-slate-50 py-16 md:py-24 px-5 md:px-8">
        <div className="mx-auto max-w-[800px]">
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-blue-600 mb-3">FAQ</p>
          <h2 className="text-xl md:text-3xl font-bold text-[#0d1a4e] mb-10">{group.label} 자주 묻는 질문</h2>
          <ServiceFAQ items={group.faq} />
          <div className="text-center mt-8">
            <Link href="/faq" className="text-sm text-blue-600 font-medium hover:underline">전체 FAQ 보기 →</Link>
          </div>
        </div>
      </section>

      {/* ═══ 보장 뱃지 ═══ */}
      <section className="bg-[#091041] pt-16 md:pt-20 px-5 md:px-8">
        <div className="mx-auto max-w-[920px]">
          <div className="grid sm:grid-cols-3 gap-4">
            {DESIGN_COMMON.guarantees.map((g) => (
              <div key={g.title} className="flex items-start gap-4 p-5 md:p-6 rounded-2xl border border-white/10 bg-white/[0.05]">
                <div className="shrink-0 w-11 h-11 rounded-xl bg-blue-500/15 flex items-center justify-center">
                  <ShieldCheck size={22} weight="fill" color="#60a5fa" />
                </div>
                <div>
                  <div className="font-bold text-white text-sm">{g.title}</div>
                  <div className="text-xs text-slate-300/70 mt-1">{g.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <ServiceCTA
        title="안심하고 맡기세요 — 영업일 1일 이내 연락드립니다"
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
