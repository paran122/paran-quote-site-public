import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { fetchPortfolios, fetchAllPortfolioMedia } from "@/lib/queries";
import { PORTFOLIOS } from "@/lib/portfolioData";
import type { Portfolio, PortfolioMedia } from "@/types";
import ServiceFAQ from "../_components/ServiceFAQ";
import ServicePortfolio from "../_components/ServicePortfolio";
import ServiceProcess from "../_components/ServiceProcess";
import ServiceCTA from "../_components/ServiceCTA";
import TrustBadges from "../_components/TrustBadges";
import ServiceSNS from "../_components/ServiceSNS";

const SITE_URL = "https://parancompany.co.kr";

export const metadata: Metadata = {
  title: "컨퍼런스·포럼 대행 — 학술대회·국제포럼 기획 전문",
  description:
    "컨퍼런스·포럼 대행 전문 에이전시. 학술대회, 국제 컨퍼런스, 정책 포럼을 기획부터 운영까지 원스톱 대행합니다. 하이브리드 행사 지원. KLS 국제학술대회 등 다수 실적. 무료 견적 요청.",
  keywords: [
    "컨퍼런스대행", "포럼대행", "학술대회대행", "국제컨퍼런스",
    "행사대행", "행사대행업체", "컨퍼런스기획", "포럼기획",
  ],
  alternates: { canonical: `${SITE_URL}/services/conference` },
  openGraph: {
    title: "컨퍼런스·포럼 대행 | 파란컴퍼니",
    description: "학술대회·국제포럼 전문. 기획부터 운영까지 원스톱 대행. 하이브리드 행사 지원.",
    type: "website",
    url: `${SITE_URL}/services/conference`,
  },
  twitter: {
    card: "summary_large_image",
    title: "컨퍼런스·포럼 대행 | 파란컴퍼니",
    description: "학술대회·국제포럼 전문. 기획부터 운영까지 원스톱 대행.",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "홈", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "서비스", item: `${SITE_URL}/services` },
    { "@type": "ListItem", position: 3, name: "컨퍼런스·포럼 대행", item: `${SITE_URL}/services/conference` },
  ],
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "컨퍼런스·포럼 대행",
  description: "학술대회, 국제 컨퍼런스, 정책 포럼을 기획부터 디자인·운영·결과보고까지 원스톱 대행",
  provider: { "@type": "Organization", name: "파란컴퍼니", url: SITE_URL },
  areaServed: { "@type": "Country", name: "대한민국" },
  serviceType: "Conference Planning",
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "컨퍼런스 대행 비용은 얼마인가요?", acceptedAnswer: { "@type": "Answer", text: "100명 규모 컨퍼런스는 약 800만 원부터, 300명 이상 대규모 포럼은 약 2,000만 원부터 시작합니다. 연사 섭외, 동시통역, 하이브리드 운영 여부에 따라 달라지며, 상세 견적서를 제공합니다." } },
    { "@type": "Question", name: "하이브리드(온·오프라인) 컨퍼런스도 가능한가요?", acceptedAnswer: { "@type": "Answer", text: "네, 온라인 실시간 중계와 오프라인 행사를 동시에 운영하는 하이브리드 컨퍼런스를 지원합니다. 영상 중계 세팅, 온라인 참가자 관리, 실시간 Q&A 운영까지 포함됩니다." } },
    { "@type": "Question", name: "국제 컨퍼런스 동시통역도 가능한가요?", acceptedAnswer: { "@type": "Answer", text: "네, 영어·중국어·일본어 등 동시통역 서비스를 제공합니다. 통역 장비 세팅, 통역사 섭외, 발표 자료 번역 등을 지원합니다." } },
    { "@type": "Question", name: "컨퍼런스 준비 기간은 얼마나 필요한가요?", acceptedAnswer: { "@type": "Answer", text: "100명 규모는 최소 6~8주, 300명 이상 대규모 행사는 최소 10~12주 전 의뢰를 권장합니다. 연사 섭외, 장소 예약, 프로그램 구성, 홍보물 제작 등을 고려한 기간입니다." } },
  ],
};

const eventTypes = [
  {
    icon: "/icons/service-icon-forum-v4.png",
    title: "국제 컨퍼런스",
    desc: "국내외 연사를 초청하는 대규모 국제 컨퍼런스를 기획·운영합니다. 동시통역, 하이브리드 중계, VIP 의전, 네트워킹 세션까지 포함됩니다.",
  },
  {
    icon: "/icons/service-icon-academic-v1.png",
    title: "학술 포럼·학술대회",
    desc: "교육기관·연구기관·학회의 학술 포럼과 학술대회를 대행합니다. 논문 발표 세션 운영, 포스터 세션 관리, 참가자 등록 시스템까지 지원합니다.",
  },
  {
    icon: "/icons/service-icon-debate-v1.png",
    title: "정책 포럼·토론회",
    desc: "정부·지자체·공공기관의 정책 포럼, 공청회, 토론회를 기획합니다. 전문 사회자 섭외, 토론 패널 구성, 속기록 서비스를 제공합니다.",
  },
  {
    icon: "/icons/service-icon-hybrid-v1.png",
    title: "하이브리드 컨퍼런스",
    desc: "온라인과 오프라인을 동시에 운영하는 하이브리드 행사를 지원합니다. 실시간 영상 중계, 온라인 참가자 관리, 실시간 Q&A 시스템을 제공합니다.",
  },
];

const CONF_SLUGS = [
  "international-forum", "kls", "goyang-conference",
];

export default async function ConferencePage() {
  let portfolios: Portfolio[] = [];
  let media: PortfolioMedia[] = [];

  try {
    [portfolios, media] = await Promise.all([
      fetchPortfolios(),
      fetchAllPortfolioMedia(),
    ]);
  } catch {
    portfolios = PORTFOLIOS;
  }

  const filtered = portfolios
    .filter((p) => p.isVisible && p.slug && CONF_SLUGS.includes(p.slug))
    .slice(0, 3);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* Hero */}
      <section className="bg-[#0f1a3c] pt-12 md:pt-16 pb-28 md:pb-40">
        <div className="mx-auto max-w-[1200px] px-5 md:px-8">
          <nav className="text-[11px] text-white/40 mb-16 md:mb-24">
            <Link href="/" className="hover:text-white/70 transition-colors">홈</Link>
            <span className="mx-2 text-white/20">/</span>
            <Link href="/services" className="hover:text-white/70 transition-colors">서비스</Link>
            <span className="mx-2 text-white/20">/</span>
            <span className="text-white/60">컨퍼런스·포럼 대행</span>
          </nav>
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-6">
              컨퍼런스·포럼 대행
            </h1>
            <p className="text-base md:text-lg text-slate-300 leading-relaxed mb-10">
              학술대회, 국제 컨퍼런스, 정책 포럼을
              기획부터 운영까지 원스톱으로 대행합니다.
            </p>
            <TrustBadges variant="dark" />
          </div>
        </div>
      </section>

      {/* 본문 + SNS */}
      <section className="py-16 md:py-24 px-5 md:px-8">
        <div className="mx-auto max-w-[900px] relative">
          <aside className="hidden xl:flex flex-col items-center gap-3 absolute -right-24 top-0 sticky" style={{ position: "sticky", top: 100 }}>
            <ServiceSNS layout="vertical" />
          </aside>

          <h2 className="text-xl md:text-2xl font-bold mb-8">
            컨퍼런스·포럼, 왜 전문 대행사가 필요할까요?
          </h2>

          <p className="text-slate-600 leading-[1.8] mb-6">
            컨퍼런스와 포럼은 일반 행사와 달리 프로그램 구성의 전문성이
            핵심입니다. 기조연설, 세션별 발표, 패널 토론, 네트워킹 등
            복합적인 프로그램을 체계적으로 설계하고 운영해야 합니다.
            100명 이상의 참가자를 관리하면서 동시에 연사 동선, 장비 세팅,
            타임라인 관리까지 완벽하게 수행하려면 전문 대행사의
            경험이 필요합니다.
          </p>

          <div className="my-8 p-5 rounded-xl bg-blue-50/60 border-l-4 border-blue-500">
            <p className="text-slate-700 text-sm leading-[1.8] font-medium">
              파란컴퍼니는 중앙아시아 교육협력포럼, KLS 한국어교육
              국제학술대회, 고양 학교체육 성장 컨퍼런스 등 다양한
              규모의 컨퍼런스·포럼을 성공적으로 운영한 경험이 있습니다.
            </p>
          </div>

          <p className="text-slate-600 leading-[1.8] mb-6">
            특히 하이브리드(온·오프라인) 행사가 보편화되면서 영상 중계,
            온라인 참가자 관리, 실시간 Q&A 등 기술적 운영 역량도
            갖추고 있어야 합니다. 파란컴퍼니는 오프라인 행사 운영과
            온라인 중계를 동시에 처리하는 하이브리드 행사 경험을
            보유하고 있습니다.
          </p>

          <p className="text-slate-600 leading-[1.8] mb-6">
            컨퍼런스 대행 비용은 규모, 연사 수, 하이브리드 운영 여부,
            동시통역 필요 여부에 따라 달라집니다. 행사 정보를
            알려주시면 1영업일 내에 상세 견적서를 보내드립니다.
          </p>

          <p className="text-slate-600 leading-[1.8]">
            자체 디자인팀이 포스터, 현수막, 자료집, 명찰, 초청장 등
            컨퍼런스에 필요한 모든 시안물을 직접 디자인합니다.
            행사 컨셉에 맞는 통일된 비주얼 아이덴티티를 제공하여
            행사의 전문성과 격을 높입니다.
          </p>
        </div>
      </section>

      {/* 기획·디자인 강점 */}
      <section className="py-16 md:py-24 px-5 md:px-8">
        <div className="mx-auto max-w-[1200px]">
          <div className="p-8 md:p-10 rounded-2xl border border-slate-200/80 bg-white shadow-sm flex flex-col md:flex-row gap-8 md:gap-14 items-start">
            <div className="flex-1">
              <h2 className="text-xl md:text-2xl font-bold mb-5">
                기획부터 디자인까지, 한 팀이 만드는 완성도
              </h2>
              <p className="text-slate-600 text-sm leading-[1.8] mb-6">
                컨퍼런스는 행사의 격에 맞는 디자인 퀄리티가 중요합니다.
                파란컴퍼니는 기획팀과 디자인팀이 처음부터 함께 움직여,
                행사 컨셉에 맞는 초청장·포스터·현수막·자료집·명찰 등
                모든 시안물을 통일된 톤으로 제작합니다.
              </p>
              <Link
                href="/services/design"
                className="inline-flex items-center gap-1.5 text-sm text-blue-600 font-medium hover:underline"
              >
                행사 디자인 서비스 자세히 보기
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="flex-shrink-0 w-full md:w-auto">
              <div className="grid grid-cols-3 gap-3 text-center">
                {[
                  { num: "6~9종", label: "행사당 시안물" },
                  { num: "자체", label: "디자인팀 보유" },
                  { num: "1일", label: "수정 반영" },
                ].map((s) => (
                  <div key={s.label} className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="text-xl font-extrabold text-blue-600 font-num">{s.num}</div>
                    <div className="text-xs text-slate-500 mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 행사 유형 */}
      <section className="bg-slate-50 py-16 md:py-24 px-5 md:px-8">
        <div className="mx-auto max-w-[1200px]">
          <h2 className="text-xl md:text-2xl font-bold mb-10">
            이런 컨퍼런스·포럼을 대행합니다
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {eventTypes.map((et) => (
              <div key={et.title} className="p-6 md:p-7 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <div className="flex justify-center mb-4">
                  <img src={et.icon} alt={et.title} className="w-14 h-14 object-contain" />
                </div>
                <h3 className="font-bold text-lg mb-3">{et.title}</h3>
                <p className="text-slate-500 text-sm leading-[1.7]">{et.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 포트폴리오 */}
      <section className="py-16 md:py-24 px-5 md:px-8">
        <div className="mx-auto max-w-[1200px]">
          <ServicePortfolio
            title="컨퍼런스·포럼 수행 사례"
            portfolios={filtered}
            media={media}
            altPrefix="컨퍼런스 포럼 대행 사례"
          />
        </div>
      </section>

      {/* 프로세스 */}
      <ServiceProcess />

      {/* FAQ */}
      <section className="py-16 md:py-24 px-5 md:px-8">
        <div className="mx-auto max-w-[800px]">
          <h2 className="text-xl md:text-2xl font-bold mb-10">
            컨퍼런스·포럼 대행 자주 묻는 질문
          </h2>
          <ServiceFAQ
            items={[
              {
                q: "컨퍼런스 대행 비용은 얼마인가요?",
                a: "100명 규모 컨퍼런스는 약 800만 원부터, 300명 이상 대규모 포럼은 약 2,000만 원부터 시작합니다. 연사 섭외, 동시통역, 하이브리드 운영 여부에 따라 달라지며, 행사 세부사항 확인 후 상세 견적서를 제공합니다.",
              },
              {
                q: "하이브리드(온·오프라인) 컨퍼런스도 가능한가요?",
                a: "네, 온라인 실시간 중계와 오프라인 행사를 동시에 운영하는 하이브리드 컨퍼런스를 지원합니다. 영상 중계 세팅, 온라인 참가자 관리, 실시간 Q&A 운영까지 포함됩니다.",
              },
              {
                q: "국제 컨퍼런스 동시통역도 가능한가요?",
                a: "네, 영어·중국어·일본어 등 동시통역 서비스를 제공합니다. 통역 장비 세팅, 전문 통역사 섭외, 발표 자료 번역 등을 지원하며, 비용은 별도 안내합니다.",
              },
              {
                q: "컨퍼런스 준비 기간은 얼마나 필요한가요?",
                a: "100명 규모는 최소 6~8주, 300명 이상 대규모 행사는 최소 10~12주 전 의뢰를 권장합니다. 연사 섭외, 장소 예약, 프로그램 구성, 홍보물 제작 등을 고려한 기간입니다.",
              },
            ]}
          />
          <div className="text-center mt-8">
            <Link href="/faq" className="text-sm text-blue-600 font-medium hover:underline">
              전체 FAQ 보기 →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <ServiceCTA
        title="컨퍼런스·포럼, 경험 있는 전문 업체에 맡기세요"
        relatedServices={[
          { href: "/services/government", label: "공공기관 행사 대행" },
          { href: "/services/seminar", label: "세미나·워크숍 기획" },
          { href: "/services/design", label: "행사 디자인·시안물" },
          { href: "/guide/pricing", label: "비용·견적 안내" },
        ]}
      />
    </>
  );
}
