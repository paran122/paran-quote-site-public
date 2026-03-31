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
import ReasonStylePicker from "../_components/ReasonStylePicker";

const SITE_URL = "https://parancompany.co.kr";

export const metadata: Metadata = {
  title: "공공기관 행사 대행 — 정부·지자체·공기업 행사 전문",
  description:
    "공공기관 행사 대행 전문 에이전시. 정부·지자체·공기업 세미나·포럼·컨퍼런스를 조달 규정에 맞춰 기획·운영합니다. 교육부·해군·경기도교육청 등 다수 실적. 여성기업 인증. 무료 견적 요청.",
  keywords: [
    "공공기관행사대행", "공공기관행사", "관공서행사대행",
    "행사대행", "행사용역", "공공기관 세미나", "행사대행업체",
  ],
  alternates: { canonical: `${SITE_URL}/services/government` },
  openGraph: {
    title: "공공기관 행사 대행 | 파란컴퍼니",
    description: "정부·지자체·공기업 행사 전문. 조달 규정에 맞춘 투명한 행사 대행. 250+ 프로젝트 경험.",
    type: "website",
    url: `${SITE_URL}/services/government`,
  },
  twitter: {
    card: "summary_large_image",
    title: "공공기관 행사 대행 | 파란컴퍼니",
    description: "정부·지자체·공기업 행사 전문. 조달 규정에 맞춘 투명한 행사 대행.",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "홈", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "서비스", item: `${SITE_URL}/services` },
    { "@type": "ListItem", position: 3, name: "공공기관 행사 대행", item: `${SITE_URL}/services/government` },
  ],
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "공공기관 행사 대행",
  description: "정부 부처, 지자체, 공기업의 세미나·포럼·컨퍼런스를 조달 규정에 맞춰 기획부터 디자인·운영·결과보고까지 원스톱 대행",
  provider: { "@type": "Organization", name: "파란컴퍼니", url: SITE_URL },
  areaServed: { "@type": "Country", name: "대한민국" },
  serviceType: "Government Event Planning",
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "공공기관 행사 대행 시 어떤 서류가 필요한가요?", acceptedAnswer: { "@type": "Answer", text: "사업자등록증, 직접생산확인증명서(행사대행업), 여성기업확인서, 실적증명서 등이 필요합니다. 파란컴퍼니는 여성기업 인증과 직접생산확인증명서를 보유하고 있어 수의계약 및 조달 입찰에 참여할 수 있습니다." } },
    { "@type": "Question", name: "공공기관 행사 대행 비용은 얼마인가요?", acceptedAnswer: { "@type": "Answer", text: "소규모 세미나(50명)는 약 300만 원부터, 중규모 포럼(150명)은 약 800만 원부터 시작합니다. 공공기관 예산 기준에 맞춰 산출내역서와 견적서를 제출합니다." } },
    { "@type": "Question", name: "결과보고서와 정산 자료를 받을 수 있나요?", acceptedAnswer: { "@type": "Answer", text: "네, 공공기관 기준에 맞는 결과보고서, 정산내역서, 참석자명부, 사진대지, 만족도 조사 결과 등 모든 행정 서류를 제공합니다." } },
    { "@type": "Question", name: "행사 준비 기간은 얼마나 필요한가요?", acceptedAnswer: { "@type": "Answer", text: "소규모 세미나(50명)는 최소 3~4주, 중규모 포럼(150명 이상)은 최소 6~8주 전에 의뢰하시는 것이 좋습니다. 급한 일정도 협의 가능합니다." } },
  ],
};

const eventTypes = [
  {
    icon: "/icons/service-icon-debate-v1.png",
    title: "정책 세미나·토론회",
    desc: "정부 부처·지자체의 정책 세미나, 공청회, 토론회를 기획·운영합니다. 주제에 맞는 전문 사회자를 섭외하고, 속기록 서비스와 실시간 자막을 제공합니다. 토론 패널 구성과 질의응답 진행까지 포함됩니다.",
  },
  {
    icon: "/icons/service-icon-forum-v4.png",
    title: "학술 포럼·국제 컨퍼런스",
    desc: "교육부·연구기관·학회의 학술 포럼, 국제 컨퍼런스를 대행합니다. 국내외 연사 섭외, 동시통역(영·중·일), 논문 발표 세션 운영, 하이브리드(온·오프라인) 행사를 지원합니다.",
  },
  {
    icon: "/icons/service-icon-education-v4.png",
    title: "교육·연수 프로그램",
    desc: "공무원 연수, 역량강화 교육, 직무교육, 신규 임용자 교육 등을 대행합니다. 교육 목표에 맞는 커리큘럼 설계부터 강사 섭외, 교육 자료 제작, 현장 운영, 만족도 조사까지 전 과정을 책임집니다.",
  },
  {
    icon: "/icons/service-icon-exhibition-v4.png",
    title: "기관 행사 운영·전시",
    desc: "장병 캠프, 문화 프로그램, 전시부스 설치 등 기관 특성에 맞는 행사를 기획·운영합니다. 기관의 브랜드 아이덴티티를 반영한 공간 연출과 참가자 경험 설계를 제공합니다.",
  },
];

const GOV_SLUGS = [
  "international-forum", "parent-education", "goyang-conference", "kls",
  "culture-club-operation", "culture-club-showcase", "navy-camp",
  "community-energy", "artist-rights", "education-council-booth",
  "auto-seminar-fall", "auto-seminar-summer", "auto-seminar-spring",
];


export default async function GovernmentPage() {
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
    .filter((p) => p.isVisible && p.slug && GOV_SLUGS.includes(p.slug))
    .slice(0, 3);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* ━━ Hero (다크, GNB 이어짐) ━━ */}
      <section className="bg-[#0f1a3c] pt-12 md:pt-16 pb-28 md:pb-40">
        <div className="mx-auto max-w-[1200px] px-5 md:px-8">
          {/* 브레드크럼 */}
          <nav className="text-[11px] text-white/40 mb-16 md:mb-24">
            <Link href="/" className="hover:text-white/70 transition-colors">홈</Link>
            <span className="mx-2 text-white/20">/</span>
            <Link href="/services" className="hover:text-white/70 transition-colors">서비스</Link>
            <span className="mx-2 text-white/20">/</span>
            <span className="text-white/60">공공기관 행사 대행</span>
          </nav>

          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-6">
              공공기관 행사 대행
            </h1>
            <p className="text-base md:text-lg text-slate-300 leading-relaxed mb-10">
              정부 부처, 지자체, 공기업의 세미나·포럼·컨퍼런스를
              조달 규정에 맞춰 기획·운영합니다.
            </p>
            <TrustBadges variant="dark" />
          </div>
        </div>
      </section>

      {/* ━━ 본문 + SNS 사이드 ━━ */}
      <section className="py-16 md:py-24 px-5 md:px-8">
        <div className="mx-auto max-w-[900px] relative">

          {/* SNS — 세로 배치, 본문 오른쪽 바깥 고정 */}
          <aside className="hidden xl:flex flex-col items-center gap-3 absolute -right-24 top-0 sticky" style={{ position: "sticky", top: 100 }}>
            <ServiceSNS layout="vertical" />
          </aside>

          <h2 className="text-xl md:text-2xl font-bold mb-8">
            공공기관 행사 대행, 왜 전문 업체에 맡겨야 할까요?
          </h2>

              <p className="text-slate-600 leading-[1.8] mb-6">
                공공기관 행사 대행은 일반 기업행사와 다릅니다. 조달 규정에 따른
                입찰·계약 절차, 예산 집행 기준, 결과보고서 양식, 정산 증빙 등
                공공기관 특유의 행정 프로세스를 정확히 이해하고 있어야 합니다.
                행사 자체는 잘 치르면서도, 사전에 계약 서류를 정확히 준비하고
                사후에 감사 대비 정산 자료를 빠짐없이 제출하는 업체를 선택하는 것이 중요합니다.
              </p>

              {/* 중간 하이라이트 박스 */}
              <div className="my-8 p-5 rounded-xl bg-blue-50/60 border-l-4 border-blue-500">
                <p className="text-slate-700 text-sm leading-[1.8] font-medium">
                  파란컴퍼니는 교육부, 해군, 경기도교육청, 수원시, 고양시 등
                  다수의 공공기관 행사를 수행하며 풍부한 경험을 쌓았습니다.
                  직접생산확인증명서(행사대행업)와 여성기업확인서를
                  보유하고 있어 나라장터 입찰 및 수의계약 모두 가능합니다.
                </p>
              </div>

              <p className="text-slate-600 leading-[1.8] mb-6">
                공공기관 행사 대행에서 가장 중요한 것은 행정 대응 능력입니다.
                행사 기획서, 산출내역서, 결과보고서, 참석자명부, 사진대지 등
                공공기관에서 요구하는 모든 행정 서류를 기본으로 제공하며,
                기획부터 시안물 디자인, 음향·조명·영상 등 현장 운영,
                그리고 결과보고서 납품까지 한 번에 처리하는 원스톱 서비스가
                가장 큰 강점입니다.
              </p>

              <p className="text-slate-600 leading-[1.8] mb-6">
                관공서 행사 대행 경험이 풍부한 파란컴퍼니는 연간 약 15~20건의
                공공기관 행사를 수행하고 있으며, 행사 규모 50명~400명까지
                다양한 규모의 행사를 대행한 실적이 있습니다.
                공공기관 행사 대행 비용은 행사 규모와 서비스 범위에 따라
                달라지며, 행사 정보를 알려주시면 1영업일 내에 산출내역서가
                포함된 상세 견적서를 보내드립니다.
              </p>

              <p className="text-slate-600 leading-[1.8]">
                또한 파란컴퍼니는 자체 디자인팀을 보유하고 있어 포스터, 현수막,
                리플렛, 자료집, 명찰 등 행사에 필요한 모든 시안물을 직접
                디자인합니다. 외주 없이 한 팀에서 기획과 디자인을 동시에
                진행하기 때문에 행사 컨셉이 일관되고, 수정·보완이 빠릅니다.
              </p>
        </div>
      </section>

      {/* ━━ 선택하는 이유 (스타일 토글) ━━ */}
      <ReasonStylePicker />

      {/* ━━ 기획·디자인 강점 ━━ */}
      <section className="py-16 md:py-24 px-5 md:px-8">
        <div className="mx-auto max-w-[1200px]">
          <div className="p-8 md:p-10 rounded-2xl border border-slate-200/80 bg-white shadow-sm flex flex-col md:flex-row gap-8 md:gap-14 items-start">
            <div className="flex-1">
              <h2 className="text-xl md:text-2xl font-bold mb-5">
                기획부터 디자인까지, 한 팀이 만드는 완성도
              </h2>
              <p className="text-slate-600 text-sm leading-[1.8] mb-6">
                공공기관 행사는 기관의 격에 맞는 디자인 퀄리티가 중요합니다.
                파란컴퍼니는 기획팀과 디자인팀이 처음부터 함께 움직여,
                행사 컨셉에 맞는 포스터·현수막·리플렛·자료집·명찰 등
                모든 시안물을 통일된 톤으로 제작합니다.
                외부 디자인 업체에 별도로 의뢰할 필요가 없어
                커뮤니케이션 비용이 줄고, 수정 반영이 빠릅니다.
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
                    <div className="text-xl font-extrabold text-blue-600 font-num">
                      {s.num}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━ 행사 유형 ━━ */}
      <section className="bg-slate-50 py-16 md:py-24 px-5 md:px-8">
        <div className="mx-auto max-w-[1200px]">
          <h2 className="text-xl md:text-2xl font-bold mb-10">
            이런 공공기관 행사를 대행합니다
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {eventTypes.map((et) => (
              <div
                key={et.title}
                className="p-6 md:p-7 rounded-2xl bg-white border border-slate-200/80 shadow-sm"
              >
                <div className="flex justify-center mb-4">
                  <img src={et.icon} alt={et.title} className="w-14 h-14 object-contain" />
                </div>
                <h3 className="font-bold text-lg mb-3">{et.title}</h3>
                <p className="text-slate-500 text-sm leading-[1.7]">
                  {et.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━ 포트폴리오 ━━ */}
      <section className="py-16 md:py-24 px-5 md:px-8">
        <div className="mx-auto max-w-[1200px]">
          <ServicePortfolio
            title="공공기관 행사 대행 수행 사례"
            portfolios={filtered}
            media={media}
            altPrefix="공공기관 행사 대행 사례"
          />
        </div>
      </section>

      {/* ━━ 프로세스 ━━ */}
      <ServiceProcess />

      {/* ━━ FAQ ━━ */}
      <section className="py-16 md:py-24 px-5 md:px-8">
        <div className="mx-auto max-w-[800px]">
          <h2 className="text-xl md:text-2xl font-bold mb-10">
            공공기관 행사 대행 자주 묻는 질문
          </h2>
          <ServiceFAQ
            items={[
              {
                q: "공공기관 행사 대행 시 어떤 서류가 필요한가요?",
                a: "사업자등록증, 직접생산확인증명서(행사대행업), 여성기업확인서, 실적증명서 등이 필요합니다. 파란컴퍼니는 여성기업 인증과 직접생산확인증명서를 보유하고 있어 수의계약 및 조달 입찰에 참여할 수 있습니다.",
              },
              {
                q: "공공기관 행사 대행 비용은 얼마인가요?",
                a: "소규모 세미나(50명)는 약 300만 원부터, 중규모 포럼(150명)은 약 800만 원부터 시작합니다. 공공기관 예산 기준에 맞춰 산출내역서와 견적서를 제출합니다. 정확한 비용은 행사 세부사항을 확인한 후 안내드립니다.",
              },
              {
                q: "결과보고서와 정산 자료를 받을 수 있나요?",
                a: "네, 공공기관 기준에 맞는 결과보고서, 정산내역서, 참석자명부, 사진대지, 만족도 조사 결과 등 모든 행정 서류를 제공합니다. 감사 대비 증빙 자료도 체계적으로 관리합니다.",
              },
              {
                q: "행사 준비 기간은 얼마나 필요한가요?",
                a: "소규모 세미나(50명)는 최소 3~4주, 중규모 포럼(150명 이상)은 최소 6~8주 전에 의뢰하시는 것이 좋습니다. 기획안 작성, 시안물 디자인, 장소 확인, 리허설 등을 고려한 기간이며, 급한 일정도 협의 가능합니다.",
              },
            ]}
          />
          <div className="text-center mt-8">
            <Link
              href="/faq"
              className="text-sm text-blue-600 font-medium hover:underline"
            >
              전체 FAQ 보기 →
            </Link>
          </div>
        </div>
      </section>

      {/* ━━ CTA + 관련 서비스 ━━ */}
      <ServiceCTA
        title="공공기관 행사 대행, 경험 있는 전문 업체에 맡기세요"
        relatedServices={[
          { href: "/services/conference", label: "컨퍼런스·포럼 기획" },
          { href: "/services/seminar", label: "세미나·워크숍 기획" },
          { href: "/services/design", label: "행사 디자인·시안물" },
          { href: "/guide/pricing", label: "비용·견적 안내" },
        ]}
      />
    </>
  );
}
