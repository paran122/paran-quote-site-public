import Link from "next/link";
import Image from "next/image";
import { Check, X, Quotes, ShieldCheck, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import type { EventService } from "../_events";
import { EVENT_CASE, EVENT_COMMON, EVENT_GALLERY, EVENT_HERO_IMAGE, EVENT_SERVICES, EVENT_STRIP } from "../_events";
import ServiceFAQ from "./ServiceFAQ";
import ServiceCTA from "./ServiceCTA";
import ServiceSubNav from "./ServiceSubNav";

const SITE_URL = "https://parancompany.co.kr";

const RELATED_LABELS: Record<EventService["key"], string> = {
  conference: "컨퍼런스·세미나 기획",
  education: "교육·워크숍 기획",
  booth: "전시·홍보부스 운영",
  government: "공공기관 행사 대행",
};

export default function EventGroupPage({ service }: { service: EventService }) {
  const pageUrl = `${SITE_URL}/services/${service.key}`;
  const heroImage = EVENT_HERO_IMAGE[service.key];
  const gallery = EVENT_GALLERY[service.key];
  const caseStudy = EVENT_CASE[service.key];

  // 관련 서비스: 나머지 행사 서비스 2개 + 디자인 + 비용안내 (government는 숨은 SEO 랜딩 — 메뉴·관련에서 제외)
  const others = (Object.keys(EVENT_SERVICES) as EventService["key"][])
    .filter((k) => k !== service.key && k !== "government")
    .slice(0, 2)
    .map((k) => ({ href: `/services/${k}`, label: RELATED_LABELS[k] }));
  const relatedServices = [
    ...others,
    { href: "/services/design", label: "행사 디자인·시안물" },
    { href: "/guide/pricing", label: "비용·견적 안내" },
  ];

  const breadcrumbJsonLd = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "홈", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "서비스", item: `${SITE_URL}/services` },
      { "@type": "ListItem", position: 3, name: service.label, item: pageUrl },
    ],
  };
  const serviceJsonLd = {
    "@context": "https://schema.org", "@type": "Service", name: `${service.label} 대행`, description: service.metaDescription,
    provider: { "@type": "Organization", name: "파란컴퍼니", url: SITE_URL },
    areaServed: { "@type": "Country", name: "대한민국" }, serviceType: service.serviceType,
    offers: { "@type": "Offer", priceCurrency: "KRW", price: service.price, description: service.priceNote, availability: "https://schema.org/InStock" },
  };
  const faqJsonLd = {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: service.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
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
            <span className="text-white/60">{service.label}</span>
          </nav>
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-12 items-center">
            <div>
              <p className="mb-4 text-[12px] font-bold uppercase tracking-[0.14em] text-blue-300">{service.label}</p>
              <h1 className="whitespace-nowrap text-[clamp(20px,5.5vw,36px)] lg:text-[clamp(28px,3vw,42px)] font-bold tracking-tight text-white mb-5 leading-[1.35] md:leading-[1.3]">{service.h1}</h1>
              <p className="text-base md:text-lg text-slate-300 leading-relaxed mb-7">{service.intro}</p>
              <div className="mb-8 flex flex-nowrap gap-1.5 sm:flex-wrap sm:gap-2.5">
                {service.badges.map((b) => (
                  <span key={b} className="inline-flex shrink items-center gap-1 whitespace-nowrap rounded-full border border-blue-400/30 bg-blue-400/10 px-2 py-1 text-[10.5px] font-medium text-blue-200 sm:gap-1.5 sm:px-3.5 sm:py-1.5 sm:text-xs">
                    <Check size={12} weight="bold" className="shrink-0" /> {b}
                  </span>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/guide/pricing" className="text-center px-6 py-3.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-colors">비용·견적 안내 →</Link>
              </div>
            </div>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.6)]">
              <Image src={heroImage} alt={`${service.label} 수행 사례`} fill className="object-cover" sizes="(max-width:1024px) 100vw, 45vw" priority unoptimized />
            </div>
          </div>
        </div>
      </section>

      <ServiceSubNav />

      {/* ═══ 수행 사례 갤러리 (실명 캡션 — 증거 먼저) ═══ */}
      <section className="bg-white py-16 md:py-24 px-5 md:px-8">
        <div className="mx-auto max-w-[1200px]">
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-blue-600 mb-3">PORTFOLIO</p>
          <div className="flex items-end justify-between mb-10 gap-4">
            <h2 className="text-xl md:text-3xl font-bold text-[#0d1a4e]">수행 사례</h2>
            <Link href={service.workHref} className="shrink-0 text-sm text-blue-600 font-medium hover:underline">전체 보기 →</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-3 gap-y-6 md:gap-x-4 md:gap-y-8">
            {gallery.map((img) => (
              <div key={img.src} className="group">
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                  <Image src={img.src} alt={img.alt} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width:768px) 50vw, 33vw" unoptimized />
                </div>
                <div className="mt-2.5 px-0.5">
                  <p className="text-[13px] md:text-sm font-bold text-[#0d1a4e] leading-snug">{img.event}</p>
                  <p className="text-[11px] md:text-xs text-slate-400 mt-0.5">{img.client}{img.meta ? ` · ${img.meta}` : ""}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 대표 사례 (CASE STUDY) ═══ */}
      <section className="bg-slate-50 py-16 md:py-24 px-5 md:px-8">
        <div className="mx-auto max-w-[1100px]">
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-blue-600 mb-3">CASE STUDY</p>
          <h2 className="text-xl md:text-3xl font-bold text-[#0d1a4e] mb-10">사례로 보는 진행 과정</h2>
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_24px_60px_-30px_rgba(13,26,110,0.25)] grid lg:grid-cols-[0.95fr_1.05fr]">
            <div className="relative min-h-[240px] lg:min-h-0">
              <Image src={caseStudy.image} alt={`${caseStudy.event} 현장`} fill className="object-cover" sizes="(max-width:1024px) 100vw, 45vw" unoptimized />
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
            <p className="text-sm text-slate-500">비슷한 행사를 준비 중이신가요?</p>
            <Link href="/?scrollTo=estimate" className="text-sm font-bold text-blue-600 hover:underline">예상 비용 바로 확인하기 →</Link>
          </div>
        </div>
      </section>

      {/* ═══ 고민 ↔ 해결 ═══ */}
      <section className="bg-[#091041] py-16 md:py-24 px-5 md:px-8">
        <div className="mx-auto max-w-[1000px]">
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-blue-300 mb-3">YOUR CONCERNS</p>
          <h2 className="text-xl md:text-3xl font-bold text-white mb-10">담당자의 고민, 이렇게 해결합니다</h2>
          <div className="grid gap-3 md:gap-4">
            {EVENT_COMMON.painSolutions.map((ps, i) => (
              <div key={ps.pain} className={`${i >= 3 ? "hidden md:grid" : "grid"} md:grid-cols-[1fr_auto_1.2fr] items-center gap-2 md:gap-5 p-5 md:px-7 md:py-5 rounded-2xl border border-white/10 bg-white/[0.04]`}>
                <p className="text-sm font-medium text-slate-300/70 leading-snug">&ldquo;{ps.pain}&rdquo;</p>
                <ArrowRight size={16} weight="bold" className="hidden md:block text-blue-400/60" />
                <p className="text-sm md:text-[15px] font-semibold text-white leading-[1.65]">{ps.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 대행 항목 ═══ */}
      <section className="bg-white py-16 md:py-24 px-5 md:px-8">
        <div className="mx-auto max-w-[1000px]">
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-blue-600 mb-3">LINEUP</p>
          <h2 className="text-xl md:text-3xl font-bold text-[#0d1a4e] mb-10">이런 행사를 대행합니다</h2>
          <div className="grid sm:grid-cols-2 gap-3 md:gap-5">
            {service.lineup.map((item) => (
              <div key={item.name} className="p-4 md:p-7 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 md:gap-4 mb-2 md:mb-3">
                  <div className="w-9 h-9 md:w-[46px] md:h-[46px] shrink-0 rounded-xl md:rounded-[14px] bg-blue-50 flex items-center justify-center">
                    <item.icon size={20} weight="fill" color="#2563EB" />
                  </div>
                  <h3 className="font-bold text-[15px] md:text-lg text-[#0d1a4e]">{item.name}</h3>
                </div>
                <p className="text-slate-600 text-[13px] md:text-sm leading-[1.65] mb-1.5 md:mb-2">{item.desc}</p>
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
          <h2 className="text-xl md:text-3xl font-bold text-[#0d1a4e] mb-10">일반 대행사와 비교해 보세요</h2>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_60px_-30px_rgba(13,26,110,0.2)]">
            <div className="grid grid-cols-[0.8fr_1fr_1.1fr] md:grid-cols-[1.1fr_1fr_1fr] bg-[#091041] text-white text-[11px] md:text-sm font-bold">
              <div className="px-2.5 py-3 md:px-6 md:py-4">항목</div>
              <div className="px-2.5 py-3 md:px-6 md:py-4 text-slate-300">일반 대행사</div>
              <div className="px-2.5 py-3 md:px-6 md:py-4 text-blue-300 bg-blue-600/15">파란컴퍼니</div>
            </div>
            {EVENT_COMMON.comparisonRows.map((row, i) => (
              <div key={row.label} className={`grid grid-cols-[0.8fr_1fr_1.1fr] md:grid-cols-[1.1fr_1fr_1fr] text-[11px] md:text-sm border-t border-slate-100 ${i % 2 ? "bg-slate-50/50" : "bg-white"}`}>
                <div className="px-2.5 py-3 md:px-6 md:py-4 font-bold text-[#0d1a4e] break-keep">{row.label}</div>
                <div className="px-2.5 py-3 md:px-6 md:py-4 text-slate-400 flex items-start gap-1 md:gap-1.5 break-keep"><X size={12} weight="bold" className="mt-0.5 shrink-0 text-slate-300 md:hidden" /><X size={15} weight="bold" className="mt-0.5 hidden shrink-0 text-slate-300 md:block" /> {row.general}</div>
                <div className="px-2.5 py-3 md:px-6 md:py-4 font-semibold text-[#0d1a4e] bg-blue-50/40 border-l border-blue-100 flex items-start gap-1 md:gap-1.5 break-keep"><Check size={12} weight="bold" className="mt-0.5 shrink-0 text-blue-600 md:hidden" /><Check size={15} weight="bold" className="mt-0.5 hidden shrink-0 text-blue-600 md:block" /> {row.ours}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 실적 + 현장 사진 + 클라이언트 ═══ */}
      <section className="bg-[#091041] py-16 md:py-20 px-5 md:px-8">
        <div className="mx-auto max-w-[1000px]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-3 mb-8 md:mb-10">
            {EVENT_STRIP[service.key].map((img) => (
              <div key={img.src} className="relative aspect-[4/3] rounded-xl overflow-hidden border border-white/10">
                <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="(max-width:768px) 50vw, 25vw" unoptimized />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
            {EVENT_COMMON.stats.map((s) => (
              <div key={s.label} className="text-center p-6 rounded-2xl border border-white/10 bg-white/[0.04]">
                <div className="text-3xl md:text-4xl font-extrabold text-blue-400 mb-1.5">{s.num}</div>
                <div className="mx-auto mb-2 h-0.5 w-7 rounded bg-blue-400/60" />
                <div className="text-xs md:text-sm text-slate-300/80 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-center">
            {EVENT_COMMON.clients.map((c) => (
              <span key={c} className="text-xs md:text-sm text-white/40">{c}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 프로세스 ═══ */}
      <section className="bg-slate-50 py-16 md:py-24 px-5 md:px-8">
        <div className="mx-auto max-w-[1100px]">
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-blue-600 mb-3">PROCESS</p>
          <h2 className="text-xl md:text-3xl font-bold text-[#0d1a4e] mb-10">의뢰부터 결과보고까지</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
            {EVENT_COMMON.process.map((step, i) => (
              <div key={step.title} className="p-4 md:p-5 rounded-2xl bg-white border border-slate-200/80">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-base text-blue-600 font-extrabold">{i + 1}</div>
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
          <div className="grid md:grid-cols-3 gap-3 md:gap-5">
            {EVENT_COMMON.testimonials.map((t) => (
              <div key={t.name} className="flex flex-col gap-2.5 md:gap-4 p-4 md:p-7 rounded-2xl border border-slate-200/80 bg-white shadow-sm">
                <Quotes size={22} weight="fill" className="text-blue-500/40" />
                <blockquote className="flex-1 text-[14px] md:text-[15px] font-medium leading-[1.65] md:leading-[1.7] text-[#0d1a4e]">{t.quote}</blockquote>
                <div className="border-t border-slate-100 pt-2.5 md:pt-4">
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
          <h2 className="text-xl md:text-3xl font-bold text-[#0d1a4e] mb-10">{service.label} 자주 묻는 질문</h2>
          <ServiceFAQ items={service.faq} />
          <div className="text-center mt-8">
            <Link href="/faq" className="text-sm text-blue-600 font-medium hover:underline">전체 FAQ 보기 →</Link>
          </div>
        </div>
      </section>

      {/* ═══ 보장 뱃지 ═══ */}
      <section className="bg-[#091041] pt-16 md:pt-20 px-5 md:px-8">
        <div className="mx-auto max-w-[920px]">
          <div className="grid sm:grid-cols-3 gap-4">
            {EVENT_COMMON.guarantees.map((g) => (
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
        relatedServices={relatedServices}
        bgImage={heroImage}
      />
    </>
  );
}
