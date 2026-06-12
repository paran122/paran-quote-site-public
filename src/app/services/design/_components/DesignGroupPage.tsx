import Link from "next/link";
import Image from "next/image";
import { Check, X, Quotes, ShieldCheck, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import type { DesignGroup } from "../_groups";
import { DESIGN_CASE, DESIGN_COMMON, DESIGN_GALLERY, DESIGN_HERO_IMAGE } from "../_groups";
import ServiceFAQ from "../../_components/ServiceFAQ";
import ServiceCTA from "../../_components/ServiceCTA";
import ServiceSubNav from "../../_components/ServiceSubNav";

const SITE_URL = "https://parancompany.co.kr";

export default function DesignGroupPage({ group }: { group: DesignGroup }) {
  const pageUrl = `${SITE_URL}/services/design/${group.key}`;
  const heroImage = DESIGN_HERO_IMAGE[group.key];
  const gallery = DESIGN_GALLERY[group.key];
  const caseStudy = DESIGN_CASE[group.key];

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
              <h1 className="whitespace-nowrap text-[clamp(20px,5.5vw,36px)] lg:text-[clamp(28px,3vw,42px)] font-bold tracking-tight text-white mb-5 leading-[1.35] md:leading-[1.3]">{group.h1}</h1>
              <p className="text-base md:text-lg text-slate-300 leading-relaxed mb-7">{group.intro}</p>
              <div className="mb-8 flex flex-wrap gap-2.5">
                {["시안 3~5일", "수정 3회 포함", "원본 제공"].map((b) => (
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

      {/* ═══ 작업 사례 갤러리 (캡션 상시 노출 — 증거 먼저) ═══ */}
      <section className="bg-white py-16 md:py-24 px-5 md:px-8">
        <div className="mx-auto max-w-[1200px]">
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-blue-600 mb-3">PORTFOLIO</p>
          <div className="flex items-end justify-between mb-10 gap-4">
            <h2 className="text-xl md:text-3xl font-bold text-[#0d1a4e]">작업 사례</h2>
            {group.workFilter && (
              <Link href={`/work?view=design&design=${encodeURIComponent(group.workFilter)}`} className="shrink-0 text-sm text-blue-600 font-medium hover:underline">전체 보기 →</Link>
            )}
          </div>
          <div className={group.key === "space"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-6 md:gap-x-5 md:gap-y-8"
            : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-5 md:gap-x-4 md:gap-y-6"}>
            {gallery.map((img) => {
              const [kind, name] = img.alt.split(" - ");
              return (
                <div key={img.src} className="group">
                  <div className={group.key === "space"
                    ? "relative aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 bg-slate-50"
                    : "relative aspect-[3/4] rounded-xl overflow-hidden border border-slate-200 bg-slate-100"}>
                    <Image src={img.src} alt={img.alt} fill className={group.key === "space"
                      ? "object-contain transition-transform duration-500 group-hover:scale-105"
                      : "object-cover transition-transform duration-500 group-hover:scale-105"} sizes="(max-width:768px) 50vw, 33vw" />
                  </div>
                  <div className="mt-2 px-0.5">
                    <p className="text-[13px] font-bold text-[#0d1a4e] leading-snug">{name ?? kind}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{name ? kind : ""}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ 대표 사례 (CASE STUDY) ═══ */}
      <section className="bg-slate-50 py-16 md:py-24 px-5 md:px-8">
        <div className="mx-auto max-w-[1100px]">
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-blue-600 mb-3">CASE STUDY</p>
          <h2 className="text-xl md:text-3xl font-bold text-[#0d1a4e] mb-10">사례로 보는 진행 과정</h2>
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_24px_60px_-30px_rgba(13,26,110,0.25)] grid lg:grid-cols-[0.95fr_1.05fr]">
            <div className={group.key === "space" ? "relative min-h-[240px] lg:min-h-0 bg-slate-50" : "relative min-h-[240px] lg:min-h-0"}>
              <Image src={caseStudy.image} alt={`${caseStudy.event} 작업물`} fill className={group.key === "space" ? "object-contain" : "object-cover"} sizes="(max-width:1024px) 100vw, 45vw" unoptimized />
            </div>
            <div className="p-6 md:p-10">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="rounded-full bg-blue-600/10 px-3 py-1 text-[11px] font-bold text-blue-700">{caseStudy.client}</span>
                <span className="text-[11px] text-slate-400">{caseStudy.badge}</span>
              </div>
              <h3 className="text-lg md:text-2xl font-bold text-[#0d1a4e] mb-5">{caseStudy.event}</h3>
              <div className="space-y-5">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 mb-1.5">과제</p>
                  <p className="text-sm text-slate-600 leading-[1.75]">{caseStudy.challenge}</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 mb-1.5">진행</p>
                  <ul className="space-y-1.5">
                    {caseStudy.solutions.map((s) => (
                      <li key={s} className="flex items-start gap-2 text-sm text-slate-600 leading-[1.7]">
                        <Check size={15} weight="bold" className="mt-1 shrink-0 text-blue-600" /> {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl bg-blue-50/70 border border-blue-100 px-4 py-3.5">
                  <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-blue-600 mb-1">결과</p>
                  <p className="text-sm font-medium text-[#0d1a4e] leading-[1.7]">{caseStudy.result}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2 text-center">
            <p className="text-sm text-slate-500">비슷한 작업을 준비 중이신가요?</p>
            <Link href="/services/design/estimate" className="text-sm font-bold text-blue-600 hover:underline">디자인 견적 바로 계산하기 →</Link>
          </div>
        </div>
      </section>

      {/* ═══ 고민 ↔ 해결 ═══ */}
      <section className="bg-[#091041] py-16 md:py-24 px-5 md:px-8">
        <div className="mx-auto max-w-[1000px]">
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-blue-300 mb-3">YOUR CONCERNS</p>
          <h2 className="text-xl md:text-3xl font-bold text-white mb-10">담당자의 고민, 이렇게 해결합니다</h2>
          <div className="grid gap-3 md:gap-4">
            {DESIGN_COMMON.painSolutions.map((ps) => (
              <div key={ps.pain} className="grid md:grid-cols-[1fr_auto_1.2fr] items-center gap-2 md:gap-5 p-5 md:px-7 md:py-5 rounded-2xl border border-white/10 bg-white/[0.04]">
                <p className="text-sm font-medium text-slate-300/70 leading-snug">&ldquo;{ps.pain}&rdquo;</p>
                <ArrowRight size={16} weight="bold" className="hidden md:block text-blue-400/60" />
                <p className="text-sm md:text-[15px] font-semibold text-white leading-[1.65]">{ps.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 제작 항목 ═══ */}
      <section className="bg-white py-16 md:py-24 px-5 md:px-8">
        <div className="mx-auto max-w-[1000px]">
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-blue-600 mb-3">LINEUP</p>
          <h2 className="text-xl md:text-3xl font-bold text-[#0d1a4e] mb-10">제작 항목</h2>
          <div className="grid sm:grid-cols-2 gap-4 md:gap-5">
            {group.items.map((item) => (
              <div key={item.anchor} id={item.anchor} className="scroll-mt-28 p-6 md:p-7 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-[46px] h-[46px] shrink-0 rounded-[14px] bg-blue-50 flex items-center justify-center">
                    <item.icon size={24} weight="fill" color="#2563EB" />
                  </div>
                  <h3 className="font-bold text-base md:text-lg text-[#0d1a4e]">{item.name}</h3>
                </div>
                <p className="text-slate-600 text-sm leading-[1.7] mb-3">{item.desc}</p>
                <p className="text-xs text-blue-700 bg-blue-50/70 rounded-lg px-3 py-2 inline-block mb-2">{item.specs}</p>
                <p className="text-xs text-slate-400">{item.examples}</p>
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
          <div className="-mx-5 overflow-x-auto px-5 md:mx-0 md:px-0">
            <div className="min-w-[480px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_60px_-30px_rgba(13,26,110,0.2)]">
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
            {DESIGN_COMMON.process.map((step) => (
              <div key={step.title} className="p-4 md:p-5 rounded-2xl bg-white border border-slate-200/80">
                <div className="flex items-center gap-2 mb-2">
                  <div className="shrink-0 rounded-full bg-blue-50 px-2.5 py-1 text-[13px] text-blue-600 font-extrabold">{step.badge}</div>
                  <h4 className="font-bold text-base text-[#0d1a4e]">{step.title}</h4>
                </div>
                <p className="text-[13px] md:text-sm text-slate-500 leading-[1.65]">{step.desc}</p>
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
        bgImage={heroImage}
        relatedServices={[
          { href: "/services/design", label: "행사 디자인 전체" },
          { href: "/services/design/estimate", label: "디자인 견적 계산" },
          { href: "/services/booth", label: "전시·홍보부스 운영" },
          { href: "/guide/pricing", label: "비용·견적 안내" },
        ]}
      />
    </>
  );
}
