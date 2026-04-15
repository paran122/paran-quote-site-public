import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Microphone, GraduationCap, Handshake, CalendarCheck } from "@phosphor-icons/react/dist/ssr";
import type { Icon as PhosphorIcon } from "@phosphor-icons/react";
import { fetchPortfolios, fetchAllPortfolioMedia } from "@/lib/queries";
import { PORTFOLIOS } from "@/lib/portfolioData";
import type { Portfolio, PortfolioMedia } from "@/types";
import ServiceFAQ from "../_components/ServiceFAQ";
import ServicePortfolio from "../_components/ServicePortfolio";
import ServiceProcess from "../_components/ServiceProcess";
import ServiceCTA from "../_components/ServiceCTA";
import TrustBadges from "../_components/TrustBadges";
import ServiceSNS from "../_components/ServiceSNS";
import HeroSlideshow from "../_components/HeroSlideshow";
import ServiceSubNav from "../_components/ServiceSubNav";
import CardCarousel from "../_components/CardCarousel";

const SITE_URL = "https://parancompany.co.kr";

export const metadata: Metadata = {
  title: "세미나·워크숍 대행 — 교육세미나·역량강화 기획 전문",
  description:
    "세미나·워크숍 대행 전문 에이전시. 교육 세미나, 역량강화 워크숍, 직무교육을 기획부터 운영까지 원스톱 대행합니다. 연사 섭외, 교육자료 제작 포함. 무료 견적 요청.",
  keywords: [
    "세미나대행", "워크숍대행", "워크샵", "세미나기획",
    "교육세미나", "행사대행", "행사대행업체", "워크숍기획",
    "역량강화", "전문사회자",
  ],
  alternates: { canonical: `${SITE_URL}/services/seminar` },
  openGraph: {
    title: "세미나·워크숍 대행 | 파란컴퍼니",
    description: "교육세미나·역량강화 워크숍 전문. 기획부터 운영까지 원스톱 대행. 250+ 프로젝트 경험.",
    type: "website",
    url: `${SITE_URL}/services/seminar`,
    images: [{ url: "/og-image.png?v=2", width: 1200, height: 630, alt: "세미나·워크숍 대행 - 파란컴퍼니" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "세미나·워크숍 대행 | 파란컴퍼니",
    description: "교육세미나·역량강화 워크숍 전문. 기획부터 운영까지 원스톱 대행.",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "홈", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "서비스", item: `${SITE_URL}/services` },
    { "@type": "ListItem", position: 3, name: "세미나·워크숍 대행", item: `${SITE_URL}/services/seminar` },
  ],
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "세미나·워크숍 대행",
  description: "교육 세미나, 역량강화 워크숍, 직무교육을 기획부터 디자인·운영·결과보고까지 원스톱 대행",
  provider: { "@type": "Organization", name: "파란컴퍼니", url: SITE_URL },
  areaServed: { "@type": "Country", name: "대한민국" },
  serviceType: "Seminar Workshop Planning",
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "세미나 대행 비용은 얼마인가요?", acceptedAnswer: { "@type": "Answer", text: "소규모 세미나(50명)는 약 300만 원부터, 100명 이상 세미나는 약 600만 원부터 시작합니다. 연사 섭외, 자료집 제작, 현장 운영 범위에 따라 달라집니다." } },
    { "@type": "Question", name: "워크숍 프로그램 설계도 해주시나요?", acceptedAnswer: { "@type": "Answer", text: "네, 워크숍 목표에 맞는 프로그램을 직접 설계합니다. 참여형 활동, 그룹 토론, 실습 세션 등을 포함한 맞춤 커리큘럼을 제안합니다." } },
    { "@type": "Question", name: "연사·강사 섭외도 포함되나요?", acceptedAnswer: { "@type": "Answer", text: "네, 세미나 주제에 맞는 전문 연사·강사를 섭외합니다. 산업별 전문가 네트워크를 보유하고 있어 적합한 연사를 추천해 드립니다." } },
    { "@type": "Question", name: "세미나 준비 기간은 얼마나 필요한가요?", acceptedAnswer: { "@type": "Answer", text: "소규모(50명)는 최소 3~4주, 100명 이상은 최소 6주 전에 의뢰하시는 것이 좋습니다. 연사 섭외, 자료집 제작, 홍보물 디자인 등을 고려한 기간입니다." } },
  ],
};

const eventTypes: Array<{ icon: PhosphorIcon; title: string; desc: string }> = [
  {
    icon: Microphone,
    title: "전문 세미나",
    desc: "산업별 전문 세미나를 기획·운영합니다. 주제 선정, 연사 섭외, 자료집 제작, 참가자 관리, 현장 운영까지 전 과정을 책임집니다.",
  },
  {
    icon: GraduationCap,
    title: "교육·연수 프로그램",
    desc: "역량강화 교육, 직무교육, 신규 임용자 교육 등을 대행합니다. 교육 목표에 맞는 커리큘럼 설계부터 강사 섭외, 교육 자료 제작까지 지원합니다.",
  },
  {
    icon: Handshake,
    title: "참여형 워크숍",
    desc: "그룹 토론, 아이디어 발산, 팀빌딩 등 참가자가 직접 참여하는 워크숍을 설계합니다. 퍼실리테이터 섭외와 워크숍 도구 준비까지 포함됩니다.",
  },
  {
    icon: CalendarCheck,
    title: "정기 세미나·시리즈",
    desc: "월간·분기별 정기 세미나 시리즈를 운영합니다. 연간 계획 수립, 회차별 주제 기획, 참가자 DB 관리, 만족도 추적까지 지속적으로 관리합니다.",
  },
];

const SEMINAR_SLUGS = [
  "auto-seminar-fall", "auto-seminar-summer", "auto-seminar-spring",
  "community-energy", "parent-education", "artist-rights",
];

export default async function SeminarPage() {
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
    .filter((p) => p.isVisible && p.slug && SEMINAR_SLUGS.includes(p.slug))
    .slice(0, 3);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* Hero */}
      <section className="relative bg-[#091041] pt-12 md:pt-16 pb-28 md:pb-40 overflow-hidden">
        <HeroSlideshow
          images={[
            { src: "https://aiarnrhftmuffmcninyl.supabase.co/storage/v1/object/public/qs-portfolio/community-energy/photo-08.webp", alt: "세미나 대행 - 지역사회 역량강화 프로그램 현장" },
            { src: "https://aiarnrhftmuffmcninyl.supabase.co/storage/v1/object/public/qs-portfolio/auto-seminar-spring/photo-06.webp", alt: "세미나 대행 - 춘계 자동차부품산업 세미나 현장" },
            { src: "https://aiarnrhftmuffmcninyl.supabase.co/storage/v1/object/public/qs-portfolio/artist-rights/photo-04.webp", alt: "워크숍 대행 - 예술인 권리보호 교육 현장" },
            { src: "https://aiarnrhftmuffmcninyl.supabase.co/storage/v1/object/public/qs-portfolio/community-energy/photo-15.webp", alt: "교육 세미나 대행 - 지역사회 역량강화 프로그램" },
            { src: "https://aiarnrhftmuffmcninyl.supabase.co/storage/v1/object/public/qs-portfolio/auto-seminar-spring/photo-12.webp", alt: "교육 세미나 대행 - 춘계 자동차부품산업 세미나" },
          ]}
        />
        <div className="relative z-10 mx-auto max-w-[1200px] px-5 md:px-8">
          <nav aria-label="breadcrumb" className="hidden md:block text-[11px] text-white/40 mb-24">
            <Link href="/" className="hover:text-white/70 transition-colors">홈</Link>
            <span className="mx-2 text-white/20">/</span>
            <Link href="/services" className="hover:text-white/70 transition-colors">서비스</Link>
            <span className="mx-2 text-white/20">/</span>
            <span className="text-white/60">세미나·워크숍 대행</span>
          </nav>
          <div className="text-center max-w-3xl mx-auto pt-16 md:pt-0">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-6">
              세미나·워크숍 대행
            </h1>
            <p className="text-base md:text-lg text-slate-300 leading-relaxed mb-10">
              교육 세미나, 역량강화 워크숍, 직무교육을
              기획부터 운영까지 원스톱으로 대행합니다.
            </p>
            <TrustBadges variant="dark" />
          </div>
        </div>
      </section>

      <ServiceSubNav />

      {/* 본문 + SNS */}
      <section className="py-16 md:py-24 px-5 md:px-8">
        <div className="mx-auto max-w-[900px] relative">
          <aside className="hidden xl:flex flex-col items-center gap-3 fixed right-6 top-1/2 -translate-y-1/2 z-40">
            <ServiceSNS layout="vertical" />
          </aside>

          <h2 className="text-xl md:text-2xl font-bold mb-8">
            세미나·워크숍, 왜 전문 대행사에 맡겨야 할까요?
          </h2>

          <p className="text-slate-600 leading-[1.8] mb-6">
            세미나와 워크숍은 단순히 장소와 연사만 준비하면 되는 행사가
            아닙니다. 참가자의 학습 효과와 만족도를 높이려면 프로그램 구성,
            교육 자료 제작, 현장 운영 동선까지 세밀하게 설계해야 합니다.
            내부 인력이 본업과 병행하면서 준비하면 퀄리티가 떨어지기
            쉽습니다.
          </p>

          <div className="my-8 p-5 rounded-xl bg-blue-50/60 border-l-4 border-blue-500">
            <p className="text-slate-700 text-sm leading-[1.8] font-medium">
              파란컴퍼니는 자동차부품산업진흥재단 정기 세미나(연 3회),
              지역사회 역량강화 프로그램, 찾아가는 경기학부모교육 등
              다양한 분야의 세미나·워크숍을 수행한 경험이 있습니다.
            </p>
          </div>

          <p className="text-slate-600 leading-[1.8] mb-6">
            세미나 대행에서 가장 중요한 것은 행사 목적에 맞는 프로그램
            구성입니다. 단순 강연형인지, 참여형 워크숍인지, 정기 시리즈인지에
            따라 프로그램 설계, 연사 섭외, 교육 자료 형태가 완전히 달라집니다.
            파란컴퍼니는 행사 목적을 정확히 파악한 후 최적의 프로그램을
            제안합니다.
          </p>

          <p className="text-slate-600 leading-[1.8] mb-6">
            세미나 대행 비용은 규모, 연사, 자료집 제작 범위에 따라 달라집니다.
            행사 정보를 알려주시면 1영업일 내에 상세 견적서를 보내드립니다.
          </p>

          <p className="text-slate-600 leading-[1.8]">
            자체 디자인팀이 포스터, 현수막, 자료집, 명찰 등 세미나에
            필요한 모든 시안물을 직접 디자인합니다. 행사 컨셉에 맞는
            통일된 비주얼을 제공하여 참가자에게 전문적인 인상을 줍니다.
          </p>

          {/* 행사 사진 */}
          <div className="my-10 rounded-2xl overflow-hidden shadow-md">
            <Image
              src="https://aiarnrhftmuffmcninyl.supabase.co/storage/v1/object/public/qs-portfolio/community-energy/photo-01.webp"
              alt="세미나 대행 현장 사진 - 지역사회 역량강화 프로그램 (약 100명 규모)"
              width={900}
              height={500}
              className="w-full h-auto object-cover"
            />
            <div className="flex items-center justify-between px-4 py-2 bg-slate-50">
              <p className="text-xs text-slate-400">
                지역사회 역량강화 프로그램 | 한국에너지정보문화재단 | 약 100명 규모
              </p>
              <Link href="/work/community-energy" className="text-xs text-blue-600 font-medium hover:underline shrink-0 ml-4">
                이 행사 상세 보기 →
              </Link>
            </div>
          </div>

          {/* 서비스 범위 */}
          <h2 className="text-xl md:text-2xl font-bold mt-14 mb-6">
            세미나·워크숍 대행 서비스 범위
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-4">
            {[
              { title: "기획·커리큘럼 설계", items: "교육 목표 분석, 프로그램 구성, 타임라인 작성, 시나리오 작성" },
              { title: "연사·강사 섭외", items: "전문 연사, 강사, 전문 사회자, 퍼실리테이터 섭외" },
              { title: "디자인·제작", items: "포스터, 현수막, 자료집, 리플렛, 명찰, 엑스배너, 교육 교재" },
              { title: "현장 운영", items: "음향·조명·영상 세팅, 참가자 접수, 교육 자료 배포" },
              { title: "워크숍 도구", items: "참여형 활동 설계, 그룹 토론 운영, 워크숍 키트 제작" },
              { title: "사후 관리", items: "결과보고서, 참석자 통계, 만족도 조사, 사진 납품" },
            ].map((s) => (
              <div key={s.title} className="px-3 py-2.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-100 text-center sm:text-left">
                <h3 className="font-bold text-sm">{s.title}</h3>
                <p className="hidden sm:block text-xs text-slate-500 leading-relaxed mt-1">{s.items}</p>
              </div>
            ))}
          </div>

          {/* 비용 간략 안내 */}
          <div className="mt-10 p-5 rounded-xl border border-blue-100 bg-blue-50/40">
            <h3 className="font-bold text-sm mb-2">세미나·워크숍 대행 비용 안내</h3>
            <p className="text-sm text-slate-600 leading-[1.8]">
              소규모 세미나(50명)는 약 300만 원부터, 100명 이상 세미나는
              약 600만 원부터 시작합니다. 연사 섭외, 자료집 제작, 현장 운영
              범위에 따라 달라지며, 행사 정보를 알려주시면 1영업일 내에
              항목별 상세 견적서를 보내드립니다.
            </p>
            <Link href="/guide/pricing" className="inline-block mt-3 text-sm text-blue-600 font-medium hover:underline">
              비용·견적 상세 안내 →
            </Link>
          </div>
        </div>
      </section>

      {/* 기획·디자인 강점 */}
      <section className="pt-0 pb-16 md:pt-0 md:pb-24 px-5 md:px-8">
        <div className="mx-auto max-w-[1200px]">
          <div className="p-8 md:p-10 rounded-2xl border border-slate-200/80 bg-white shadow-sm flex flex-col md:flex-row gap-8 md:gap-14 items-start">
            <div className="flex-1">
              <h2 className="text-xl md:text-2xl font-bold mb-5">
                교육 효과를 높이는 시안물 디자인
              </h2>
              <p className="text-slate-600 text-sm leading-[1.8] mb-6">
                세미나 자료집과 워크숍 교재는 참가자의 학습 효과에 직접
                영향을 줍니다. 파란컴퍼니 디자인팀은 교육 목표를 이해한
                상태에서 자료집·리플렛·포스터·명찰을 제작하기 때문에
                내용 전달력이 높고 가독성이 뛰어납니다.
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
            이런 세미나·워크숍을 대행합니다
          </h2>
          <CardCarousel>
            {eventTypes.map((et) => (
              <div key={et.title} className="snap-center shrink-0 w-[75vw] sm:w-auto sm:shrink p-6 md:p-7 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <div className="flex justify-center mb-4">
                  <div className="w-[58px] h-[58px] rounded-[17px] bg-blue-50 flex items-center justify-center">
                    <et.icon size={28} weight="fill" color="#2563EB" />
                  </div>
                </div>
                <h3 className="font-bold text-lg mb-3">{et.title}</h3>
                <p className="text-slate-500 text-sm leading-[1.7]">{et.desc}</p>
              </div>
            ))}
          </CardCarousel>
        </div>
      </section>

      {/* 포트폴리오 */}
      <section className="py-16 md:py-24 px-5 md:px-8">
        <div className="mx-auto max-w-[1200px]">
          <ServicePortfolio
            title="세미나·워크숍 수행 사례"
            portfolios={filtered}
            media={media}
            altPrefix="세미나 워크숍 대행 사례"
            mobileCarousel
          />
        </div>
      </section>

      {/* 프로세스 */}
      <ServiceProcess />

      {/* FAQ */}
      <section className="py-16 md:py-24 px-5 md:px-8">
        <div className="mx-auto max-w-[800px]">
          <h2 className="text-xl md:text-2xl font-bold mb-10">
            세미나·워크숍 대행 자주 묻는 질문
          </h2>
          <ServiceFAQ
            items={[
              {
                q: "세미나 대행 비용은 얼마인가요?",
                a: "소규모 세미나(50명)는 약 300만 원부터, 100명 이상 세미나는 약 600만 원부터 시작합니다. 연사 섭외, 자료집 제작, 현장 운영 범위에 따라 달라지며, 행사 세부사항 확인 후 상세 견적서를 제공합니다.",
              },
              {
                q: "워크숍 프로그램 설계도 해주시나요?",
                a: "네, 워크숍 목표에 맞는 프로그램을 직접 설계합니다. 참여형 활동, 그룹 토론, 실습 세션 등을 포함한 맞춤 커리큘럼을 제안하며, 퍼실리테이터 섭외도 가능합니다.",
              },
              {
                q: "연사·강사 섭외도 포함되나요?",
                a: "네, 세미나 주제에 맞는 전문 연사·강사를 섭외합니다. 산업별 전문가 네트워크를 보유하고 있어 적합한 연사를 추천해 드리며, 섭외 비용은 별도 안내합니다.",
              },
              {
                q: "세미나 준비 기간은 얼마나 필요한가요?",
                a: "소규모(50명)는 최소 3~4주, 100명 이상은 최소 6주 전에 의뢰하시는 것이 좋습니다. 연사 섭외, 자료집 제작, 홍보물 디자인 등을 고려한 기간이며, 급한 일정도 협의 가능합니다.",
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
        title="세미나·워크숍, 경험 있는 전문 업체에 맡기세요"
        relatedServices={[
          { href: "/services/government", label: "공공기관 행사 대행" },
          { href: "/services/conference", label: "컨퍼런스·포럼 기획" },
          { href: "/services/design", label: "행사 디자인·시안물" },
          { href: "/guide/pricing", label: "비용·견적 안내" },
        ]}
      />
    </>
  );
}
