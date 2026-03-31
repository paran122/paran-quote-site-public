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
  title: "기업행사 대행 — 세미나·워크숍·성과발표회 기획 전문",
  description:
    "기업행사 대행 전문 에이전시. 산업 세미나, 비전선포식, 성과발표회, 기업 워크숍을 기획부터 디자인·운영까지 원스톱 대행합니다. 자동차부품산업진흥재단 등 다수 실적. 무료 견적 요청.",
  keywords: [
    "기업행사대행", "기업행사기획", "기업세미나", "기업워크숍",
    "행사대행", "행사대행업체", "세미나대행", "성과발표회",
  ],
  alternates: { canonical: `${SITE_URL}/services/corporate` },
  openGraph: {
    title: "기업행사 대행 | 파란컴퍼니",
    description: "기업 세미나·워크숍·성과발표회 전문. 기획부터 운영까지 원스톱 대행. 250+ 프로젝트 경험.",
    type: "website",
    url: `${SITE_URL}/services/corporate`,
  },
  twitter: {
    card: "summary_large_image",
    title: "기업행사 대행 | 파란컴퍼니",
    description: "기업 세미나·워크숍·성과발표회 전문. 기획부터 운영까지 원스톱 대행.",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "홈", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "서비스", item: `${SITE_URL}/services` },
    { "@type": "ListItem", position: 3, name: "기업행사 대행", item: `${SITE_URL}/services/corporate` },
  ],
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "기업행사 대행",
  description: "산업 세미나, 비전선포식, 성과발표회, 기업 워크숍을 기획부터 디자인·운영·결과보고까지 원스톱 대행",
  provider: { "@type": "Organization", name: "파란컴퍼니", url: SITE_URL },
  areaServed: { "@type": "Country", name: "대한민국" },
  serviceType: "Corporate Event Planning",
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "기업행사 대행 비용은 얼마인가요?", acceptedAnswer: { "@type": "Answer", text: "소규모 세미나(50명)는 약 300만 원부터, 중규모 행사(150명)는 약 800만 원부터 시작합니다. 행사 규모·유형·필요 서비스에 따라 달라지며, 상세 견적서를 1영업일 내에 제공합니다." } },
    { "@type": "Question", name: "기업행사 준비 기간은 얼마나 필요한가요?", acceptedAnswer: { "@type": "Answer", text: "소규모 세미나는 최소 3~4주, 100명 이상 행사는 6~8주 전 의뢰를 권장합니다. 기획안 작성, 시안물 디자인, 장소 확인, 리허설 등을 고려한 기간입니다." } },
    { "@type": "Question", name: "연사 섭외도 해주시나요?", acceptedAnswer: { "@type": "Answer", text: "네, 행사 주제에 맞는 전문 연사·사회자를 섭외합니다. 산업별 전문가 네트워크를 보유하고 있어 적합한 연사를 추천해 드립니다." } },
    { "@type": "Question", name: "행사 디자인도 포함되나요?", acceptedAnswer: { "@type": "Answer", text: "네, 자체 디자인팀이 포스터·현수막·리플렛·자료집·명찰 등 모든 시안물을 직접 디자인합니다. 외주 없이 한 팀에서 기획과 디자인을 동시에 진행합니다." } },
  ],
};

const eventTypes = [
  {
    icon: "/icons/service-icon-seminar-v4.png",
    title: "산업 세미나·컨퍼런스",
    desc: "업계 트렌드 공유, 신제품 발표, 기술 세미나 등 산업별 전문 세미나를 기획·운영합니다. 연사 섭외, 자료집 제작, 참가자 관리까지 포함됩니다.",
  },
  {
    icon: "/icons/service-icon-vision-v1.png",
    title: "비전선포식·성과발표회",
    desc: "기업의 비전 선포, 연간 성과 발표, 창립기념일 행사 등을 대행합니다. 기업 브랜드에 맞는 연출과 프로그램을 기획합니다.",
  },
  {
    icon: "/icons/service-icon-education-v4.png",
    title: "기업 교육·연수",
    desc: "신입사원 교육, 리더십 워크숍, 직무교육 등 기업 맞춤 교육 프로그램을 기획합니다. 커리큘럼 설계부터 강사 섭외, 교육 자료 제작까지 지원합니다.",
  },
  {
    icon: "/icons/service-icon-culture-v1.png",
    title: "문화·복지 프로그램",
    desc: "임직원 문화 프로그램, 체험형 워크숍, 팀빌딩 행사 등을 기획·운영합니다. 참가자 경험을 중심으로 프로그램을 설계합니다.",
  },
];

const CORP_SLUGS = [
  "auto-seminar-fall", "auto-seminar-summer", "auto-seminar-spring",
  "culture-club-operation", "culture-club-showcase",
];

export default async function CorporatePage() {
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
    .filter((p) => p.isVisible && p.slug && CORP_SLUGS.includes(p.slug))
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
            <span className="text-white/60">기업행사 대행</span>
          </nav>
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-6">
              기업행사 대행
            </h1>
            <p className="text-base md:text-lg text-slate-300 leading-relaxed mb-10">
              산업 세미나, 워크숍, 성과발표회 등 기업 행사를
              기획부터 디자인·운영까지 원스톱으로 대행합니다.
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
            기업행사, 왜 전문 대행사에 맡겨야 할까요?
          </h2>

          <p className="text-slate-600 leading-[1.8] mb-6">
            기업행사는 회사의 브랜드 이미지와 직결됩니다.
            산업 세미나에서 전문성을 보여줘야 하고, 성과발표회에서는
            임직원의 동기부여와 비전 공유가 이루어져야 합니다.
            이런 행사를 내부 인력으로 준비하면 본업에 지장이 생기고,
            행사 퀄리티도 보장하기 어렵습니다.
          </p>

          <div className="my-8 p-5 rounded-xl bg-blue-50/60 border-l-4 border-blue-500">
            <p className="text-slate-700 text-sm leading-[1.8] font-medium">
              파란컴퍼니는 자동차부품산업진흥재단, 한국문화예술교육진흥원 등
              다양한 기업·기관의 행사를 수행하며 산업별 전문성을 쌓았습니다.
              기획팀과 디자인팀이 함께 움직여 행사 컨셉에 맞는 일관된
              결과물을 빠르게 제작합니다.
            </p>
          </div>

          <p className="text-slate-600 leading-[1.8] mb-6">
            기업행사 대행에서 가장 중요한 것은 행사 목적에 맞는 기획력입니다.
            단순히 행사를 &quot;치르는&quot; 것이 아니라, 행사를 통해
            달성하고자 하는 목표—브랜드 인지도 강화, 고객 네트워킹,
            임직원 교육—를 정확히 이해하고 프로그램을 설계합니다.
          </p>

          <p className="text-slate-600 leading-[1.8] mb-6">
            기업행사 대행 비용은 행사 규모와 서비스 범위에 따라 달라집니다.
            행사 정보를 알려주시면 1영업일 내에 상세 견적서를 보내드립니다.
            소규모 세미나부터 200명 이상의 대규모 행사까지 대응 가능하며,
            연사 섭외, 장소 예약, 케이터링 등 부대 서비스도 함께 제공합니다.
          </p>

          <p className="text-slate-600 leading-[1.8]">
            또한 자체 디자인팀을 보유하고 있어 포스터, 현수막, 리플렛,
            자료집, 명찰 등 행사에 필요한 모든 시안물을 직접 디자인합니다.
            외주 없이 한 팀에서 기획과 디자인을 동시에 진행하기 때문에
            수정·보완이 빠르고, 행사 컨셉이 일관됩니다.
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
                기업행사는 회사의 브랜드 이미지를 반영한 디자인 퀄리티가
                중요합니다. 파란컴퍼니는 기획팀과 디자인팀이 처음부터
                함께 움직여, 행사 컨셉에 맞는 포스터·현수막·리플렛·자료집·명찰
                등 모든 시안물을 통일된 톤으로 제작합니다.
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
            이런 기업행사를 대행합니다
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
            title="기업행사 대행 수행 사례"
            portfolios={filtered}
            media={media}
            altPrefix="기업행사 대행 사례"
          />
        </div>
      </section>

      {/* 프로세스 */}
      <ServiceProcess />

      {/* FAQ */}
      <section className="py-16 md:py-24 px-5 md:px-8">
        <div className="mx-auto max-w-[800px]">
          <h2 className="text-xl md:text-2xl font-bold mb-10">
            기업행사 대행 자주 묻는 질문
          </h2>
          <ServiceFAQ
            items={[
              {
                q: "기업행사 대행 비용은 얼마인가요?",
                a: "소규모 세미나(50명)는 약 300만 원부터, 중규모 행사(150명)는 약 800만 원부터 시작합니다. 행사 규모·유형·필요 서비스에 따라 달라지며, 행사 세부사항을 확인한 후 1영업일 내에 상세 견적서를 제공합니다.",
              },
              {
                q: "기업행사 준비 기간은 얼마나 필요한가요?",
                a: "소규모 세미나는 최소 3~4주, 100명 이상 행사는 6~8주 전 의뢰를 권장합니다. 기획안 작성, 시안물 디자인, 장소 확인, 리허설 등을 고려한 기간이며, 급한 일정도 협의 가능합니다.",
              },
              {
                q: "연사 섭외도 해주시나요?",
                a: "네, 행사 주제에 맞는 전문 연사·사회자를 섭외합니다. 산업별 전문가 네트워크를 보유하고 있어 적합한 연사를 추천해 드리며, 섭외 비용은 별도 안내합니다.",
              },
              {
                q: "행사 디자인도 포함되나요?",
                a: "네, 자체 디자인팀이 포스터·현수막·리플렛·자료집·명찰 등 모든 시안물을 직접 디자인합니다. 외주 없이 한 팀에서 기획과 디자인을 동시에 진행하여 컨셉 일관성과 빠른 수정이 가능합니다.",
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
        title="기업행사 대행, 경험 있는 전문 업체에 맡기세요"
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
