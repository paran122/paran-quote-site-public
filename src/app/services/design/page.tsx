import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
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
import ImageSlideshow from "../_components/ImageSlideshow";

const SITE_URL = "https://parancompany.co.kr";

export const metadata: Metadata = {
  title: "행사 디자인·시안물 제작 — 포스터·현수막·리플렛·자료집 전문",
  description:
    "행사 디자인 전문 에이전시. 포스터, 현수막, 리플렛, 자료집, 명찰, 초청장 등 행사에 필요한 모든 시안물을 자체 디자인팀이 제작합니다. 기획과 디자인을 동시에 진행하여 일관된 퀄리티. 무료 견적 요청.",
  keywords: [
    "행사디자인", "행사시안물", "포스터디자인", "현수막디자인",
    "리플렛디자인", "자료집디자인", "명찰디자인", "행사대행",
  ],
  alternates: { canonical: `${SITE_URL}/services/design` },
  openGraph: {
    title: "행사 디자인·시안물 제작 | 파란컴퍼니",
    description: "포스터·현수막·리플렛·자료집 등 행사 시안물 전문. 자체 디자인팀 보유. 250+ 프로젝트 경험.",
    type: "website",
    url: `${SITE_URL}/services/design`,
    images: [{ url: "/og-image.png?v=2", width: 1200, height: 630, alt: "행사 디자인·시안물 제작 - 파란컴퍼니" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "행사 디자인·시안물 제작 | 파란컴퍼니",
    description: "포스터·현수막·리플렛·자료집 등 행사 시안물 전문. 자체 디자인팀 보유.",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "홈", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "서비스", item: `${SITE_URL}/services` },
    { "@type": "ListItem", position: 3, name: "행사 디자인·시안물", item: `${SITE_URL}/services/design` },
  ],
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "행사 디자인·시안물 제작",
  description: "포스터, 현수막, 리플렛, 자료집, 명찰, 초청장 등 행사에 필요한 모든 시안물을 자체 디자인팀이 제작",
  provider: { "@type": "Organization", name: "파란컴퍼니", url: SITE_URL },
  areaServed: { "@type": "Country", name: "대한민국" },
  serviceType: "Event Design",
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "행사 디자인만 별도로 의뢰할 수 있나요?", acceptedAnswer: { "@type": "Answer", text: "네, 디자인만 별도로 의뢰하실 수 있습니다. 포스터, 현수막, 리플렛, 자료집, 명찰 등 필요한 시안물만 선택하여 제작이 가능합니다." } },
    { "@type": "Question", name: "시안물 수정은 몇 회까지 가능한가요?", acceptedAnswer: { "@type": "Answer", text: "기본 3회 수정이 포함되어 있으며, 추가 수정도 협의 가능합니다. 1차 시안 제출 후 피드백을 반영하여 빠르게 수정합니다. 보통 1영업일 내 수정 반영됩니다." } },
    { "@type": "Question", name: "디자인 작업 기간은 얼마나 걸리나요?", acceptedAnswer: { "@type": "Answer", text: "1~2종 시안물은 3~5영업일, 6~9종 풀 패키지는 약 2주 소요됩니다. 급한 일정의 경우 우선 작업도 가능하니 미리 문의해 주세요." } },
    { "@type": "Question", name: "인쇄·제작까지 포함되나요?", acceptedAnswer: { "@type": "Answer", text: "네, 디자인부터 인쇄·제작까지 원스톱으로 진행합니다. 포스터, 현수막, 리플렛, 자료집 등의 인쇄물 제작과 배송까지 관리합니다." } },
  ],
};

const designItems = [
  {
    icon: "/icons/service-icon-poster-v1.png",
    title: "포스터·현수막",
    desc: "행사 컨셉에 맞는 포스터와 현수막을 디자인합니다. 실내외 현수막, 가로·세로 배너, X배너 등 다양한 규격에 대응합니다.",
    examples: "포스터, 현수막, X배너, 엑스배너, 걸개현수막",
  },
  {
    icon: "/icons/service-icon-leaflet-v1.png",
    title: "리플렛·자료집",
    desc: "행사 프로그램 안내 리플렛, 발표 자료집, 교육 교재 등을 편집·디자인합니다. 인쇄용 고해상도 작업과 PDF 납품 모두 가능합니다.",
    examples: "3단 리플렛, 자료집, 교육 교재, 프로그램북",
  },
  {
    icon: "/icons/service-icon-badge-v1.png",
    title: "명찰·초청장",
    desc: "참가자 명찰, VIP 초청장, 참가 확인증 등을 디자인합니다. 행사 전체 시안물과 통일된 디자인 톤을 유지합니다.",
    examples: "명찰, 초청장, 참가확인증, 수료증",
  },
  {
    icon: "/icons/service-icon-cardnews-v1.png",
    title: "카드뉴스·SNS 콘텐츠",
    desc: "행사 홍보용 카드뉴스, SNS 이미지, 웹 배너 등 온라인 콘텐츠를 제작합니다. 플랫폼별 최적 사이즈로 제작합니다.",
    examples: "카드뉴스, 인스타그램 이미지, 웹 배너",
  },
];

// 디자인 페이지는 모든 포트폴리오가 대상 (모든 행사에 디자인 작업 포함)
const DESIGN_SLUGS = [
  "education-council-booth", "jcs-sns", "parent-education",
];

export default async function DesignPage() {
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

  const filtered = DESIGN_SLUGS
    .map((slug) => portfolios.find((p) => p.isVisible && p.slug === slug))
    .filter((p): p is Portfolio => !!p);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* Hero */}
      <section className="relative bg-[#0f1a3c] pt-12 md:pt-16 pb-28 md:pb-40 overflow-hidden">
        <HeroSlideshow
          contain
          images={[
            { src: "https://syzsqdgvculdzfepdlsi.supabase.co/storage/v1/object/public/portfolio/education-council-booth/booth-large.webp", alt: "전시부스 디자인 시안 - 교육감협의회 대형전시부스" },
            { src: "https://syzsqdgvculdzfepdlsi.supabase.co/storage/v1/object/public/portfolio/education-council-booth/standee-large.webp", alt: "행사 디자인 시안 - 교육감협의회 대형등신대" },
            { src: "https://syzsqdgvculdzfepdlsi.supabase.co/storage/v1/object/public/portfolio/education-council-booth/booth.webp", alt: "행사 시안물 제작 - 교육감협의회 부스 디자인" },
            { src: "https://syzsqdgvculdzfepdlsi.supabase.co/storage/v1/object/public/portfolio/education-council-booth/table-standee.webp", alt: "행사 디자인 제작 - 교육감협의회 테이블 등신대" },
          ]}
        />
        <div className="relative z-10 mx-auto max-w-[1200px] px-5 md:px-8">
          <nav aria-label="breadcrumb" className="hidden md:block text-[11px] text-white/40 mb-24">
            <Link href="/" className="hover:text-white/70 transition-colors">홈</Link>
            <span className="mx-2 text-white/20">/</span>
            <Link href="/services" className="hover:text-white/70 transition-colors">서비스</Link>
            <span className="mx-2 text-white/20">/</span>
            <span className="text-white/60">행사 디자인·시안물</span>
          </nav>
          <div className="text-center max-w-3xl mx-auto pt-16 md:pt-0">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-6">
              행사 디자인·시안물 제작
            </h1>
            <p className="text-base md:text-lg text-slate-300 leading-relaxed mb-10">
              포스터, 현수막, 리플렛, 자료집, 명찰 등
              행사에 필요한 모든 시안물을 자체 디자인팀이 제작합니다.
            </p>
            <TrustBadges variant="dark" />
          </div>
        </div>
      </section>

      <ServiceSubNav />

      {/* 본문 + SNS */}
      <section className="py-16 md:py-24 px-5 md:px-8">
        <div className="mx-auto max-w-[900px] relative">
          <aside className="hidden xl:flex flex-col items-center gap-3 absolute -right-24 top-[100px] sticky">
            <ServiceSNS layout="vertical" />
          </aside>

          <h2 className="text-xl md:text-2xl font-bold mb-8">
            행사 디자인, 왜 기획사에 맡겨야 할까요?
          </h2>

          <p className="text-slate-600 leading-[1.8] mb-6">
            행사 디자인은 단순히 예쁜 시안물을 만드는 것이 아닙니다.
            행사의 목적, 참가자 특성, 행사장 환경을 모두 고려하여
            디자인해야 합니다. 일반 디자인 업체에 별도 의뢰하면
            행사 맥락을 설명하는 데 시간이 걸리고, 기획 의도와
            디자인 결과물 사이에 괴리가 생기기 쉽습니다.
          </p>

          <div className="my-8 p-5 rounded-xl bg-blue-50/60 border-l-4 border-blue-500">
            <p className="text-slate-700 text-sm leading-[1.8] font-medium">
              파란컴퍼니는 250건 이상의 행사에서 포스터·현수막·리플렛·자료집·명찰
              등 총 6~9종의 시안물을 직접 디자인해 왔습니다.
              기획팀과 디자인팀이 한 팀이기 때문에 행사 컨셉이 시안물에
              자연스럽게 반영되고, 수정 반영이 빠릅니다.
            </p>
          </div>

          <p className="text-slate-600 leading-[1.8] mb-6">
            기획과 디자인을 동시에 진행하는 것이 가장 큰 강점입니다.
            행사 컨셉이 확정되면 바로 디자인 작업에 들어가기 때문에
            별도의 디자인 브리핑이 필요 없고, 기획 변경 사항이
            실시간으로 시안물에 반영됩니다. 포스터, 현수막, 리플렛,
            자료집, 명찰 등 모든 시안물이 하나의 디자인 톤으로
            통일됩니다.
          </p>

          <p className="text-slate-600 leading-[1.8] mb-6">
            디자인만 별도로 의뢰하는 것도 가능합니다. 행사 기획은
            자체적으로 진행하되, 시안물 디자인만 전문가에게 맡기고 싶은
            경우에도 포스터 1종부터 풀 패키지까지 유연하게 대응합니다.
          </p>

          <p className="text-slate-600 leading-[1.8]">
            인쇄·제작까지 원스톱으로 진행합니다. 디자인 파일 납품은
            물론, 인쇄물 제작과 행사장 배송까지 한 번에 처리하여
            담당자의 업무 부담을 줄여드립니다.
          </p>

          {/* 리플렛 시안물 슬라이드쇼 */}
          <div className="my-10 rounded-2xl overflow-hidden shadow-md">
            <ImageSlideshow
              images={[
                { src: "https://syzsqdgvculdzfepdlsi.supabase.co/storage/v1/object/public/portfolio/parent-education/leaflet.webp", alt: "리플렛 디자인 - 찾아가는 경기학부모교육", caption: "리플렛 | 찾아가는 경기학부모교육" },
                { src: "https://syzsqdgvculdzfepdlsi.supabase.co/storage/v1/object/public/portfolio/education-council-booth/booth-large.webp", alt: "전시부스 디자인 - 교육감협의회 대형전시부스", caption: "전시부스 | 교육감협의회 부스 설치" },
                { src: "https://syzsqdgvculdzfepdlsi.supabase.co/storage/v1/object/public/portfolio/goyang-conference/leaflet.webp", alt: "리플렛 디자인 - 고양 학교체육 성장 컨퍼런스", caption: "리플렛 | 고양 학교체육 성장 컨퍼런스" },
                { src: "https://syzsqdgvculdzfepdlsi.supabase.co/storage/v1/object/public/portfolio/goyang-conference/booth-large.webp", alt: "전시부스 디자인 - 고양 학교체육 컨퍼런스", caption: "전시부스 | 고양 학교체육 성장 컨퍼런스" },
                { src: "https://syzsqdgvculdzfepdlsi.supabase.co/storage/v1/object/public/portfolio/international-forum/leaflet.webp", alt: "리플렛 디자인 - 중앙아시아 교육협력포럼", caption: "리플렛 | 중앙아시아 교육협력포럼" },
                { src: "https://syzsqdgvculdzfepdlsi.supabase.co/storage/v1/object/public/portfolio/education-council-booth/booth.webp", alt: "전시부스 디자인 - 교육감협의회 부스", caption: "전시부스 | 교육감협의회 부스 설치" },
                { src: "https://syzsqdgvculdzfepdlsi.supabase.co/storage/v1/object/public/portfolio/kls/leaflet.webp", alt: "리플렛 디자인 - KLS 한국어교육 국제학술대회", caption: "리플렛 | KLS 한국어교육 국제학술대회" },
                { src: "https://syzsqdgvculdzfepdlsi.supabase.co/storage/v1/object/public/portfolio/international-forum/booth-large-2.webp", alt: "전시부스 디자인 - 중앙아시아 교육협력포럼", caption: "전시부스 | 중앙아시아 교육협력포럼" },
              ]}
              linkHref="/work"
              linkText="포트폴리오 전체 보기 →"
            />
          </div>

          {/* 비용 간략 안내 */}
          <div className="mt-10 p-5 rounded-xl border border-blue-100 bg-blue-50/40">
            <h3 className="font-bold text-sm mb-2">행사 디자인 비용 안내</h3>
            <p className="text-sm text-slate-600 leading-[1.8]">
              포스터·현수막 등 1~2종 시안물은 개별 견적으로, 6~9종
              풀 패키지는 행사 대행 견적에 포함됩니다. 디자인만 별도
              의뢰하는 것도 가능하며, 수량과 규격에 따라 달라집니다.
              행사 정보를 알려주시면 1영업일 내에 안내드립니다.
            </p>
            <Link href="/guide/pricing" className="inline-block mt-3 text-sm text-blue-600 font-medium hover:underline">
              비용·견적 상세 안내 →
            </Link>
          </div>
        </div>
      </section>

      {/* 자체 디자인팀 강점 */}
      <section className="pt-0 pb-16 md:pt-0 md:pb-24 px-5 md:px-8">
        <div className="mx-auto max-w-[1200px]">
          <div className="p-8 md:p-10 rounded-2xl border border-slate-200/80 bg-white shadow-sm flex flex-col md:flex-row gap-8 md:gap-14 items-start">
            <div className="flex-1">
              <h2 className="text-xl md:text-2xl font-bold mb-5">
                자체 디자인팀이 만드는 차이
              </h2>
              <p className="text-slate-600 text-sm leading-[1.8] mb-6">
                외부 디자인 업체에 별도로 의뢰하면 기획 의도를 전달하는 데
                시간이 걸리고, 수정 요청마다 추가 비용이 발생합니다.
                파란컴퍼니는 기획팀과 디자인팀이 같은 공간에서 함께 일하기
                때문에 커뮤니케이션 비용이 제로이고, 수정 반영이
                1영업일 이내로 빠릅니다.
              </p>
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

      {/* 디자인 항목 */}
      <section className="bg-slate-50 py-16 md:py-24 px-5 md:px-8">
        <div className="mx-auto max-w-[1200px]">
          <h2 className="text-xl md:text-2xl font-bold mb-10">
            제작 가능한 시안물
          </h2>
          <CardCarousel>
            {designItems.map((item) => (
              <div key={item.title} className="snap-center shrink-0 w-[75vw] sm:w-auto sm:shrink p-6 md:p-7 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <div className="flex justify-center mb-4">
                  <Image src={item.icon} alt={item.title} width={56} height={56} className="object-contain" />
                </div>
                <h3 className="font-bold text-lg mb-3">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-[1.7] mb-3">{item.desc}</p>
                <p className="text-xs text-slate-400">{item.examples}</p>
              </div>
            ))}
          </CardCarousel>
        </div>
      </section>

      {/* 파란디자인 CTA */}
      <section className="py-12 md:py-16 px-5 md:px-8">
        <div className="mx-auto max-w-[1200px]">
          <a
            href="https://parandesign.kr"
            target="_blank"
            rel="noopener noreferrer"
            className="group block rounded-2xl overflow-hidden bg-gradient-to-r from-[#0f1a3c] to-[#1e3a6e] p-8 md:p-12 transition-transform hover:scale-[1.01]"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <p className="text-blue-300 text-sm font-medium mb-2">파란컴퍼니 디자인 전문 브랜드</p>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                  파란디자인
                </h3>
                <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-lg">
                  행사 시안물 외에도 브랜딩, 인쇄물, 편집 디자인이 필요하시다면
                  파란디자인에서 더 다양한 디자인 서비스를 만나보세요.
                </p>
              </div>
              <div className="shrink-0 flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 border border-white/20 text-white font-medium text-sm group-hover:bg-white/20 transition-colors">
                파란디자인 바로가기
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1"><path d="M7 17l9.2-9.2M17 17V7H7"/></svg>
              </div>
            </div>
          </a>
        </div>
      </section>

      {/* 포트폴리오 */}
      <section className="py-16 md:py-24 px-5 md:px-8">
        <div className="mx-auto max-w-[1200px]">
          <ServicePortfolio
            title="행사 디자인 수행 사례"
            portfolios={filtered}
            media={media}
            altPrefix="행사 디자인 시안물 제작 사례"
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
            행사 디자인 자주 묻는 질문
          </h2>
          <ServiceFAQ
            items={[
              {
                q: "행사 디자인만 별도로 의뢰할 수 있나요?",
                a: "네, 디자인만 별도로 의뢰하실 수 있습니다. 포스터, 현수막, 리플렛, 자료집, 명찰 등 필요한 시안물만 선택하여 제작이 가능합니다. 행사 기획과 함께 의뢰하시면 더 일관된 결과물을 받으실 수 있습니다.",
              },
              {
                q: "시안물 수정은 몇 회까지 가능한가요?",
                a: "기본 3회 수정이 포함되어 있으며, 추가 수정도 협의 가능합니다. 1차 시안 제출 후 피드백을 반영하여 빠르게 수정합니다. 보통 1영업일 내에 수정이 반영됩니다.",
              },
              {
                q: "디자인 작업 기간은 얼마나 걸리나요?",
                a: "1~2종 시안물은 3~5영업일, 6~9종 풀 패키지는 약 2주 소요됩니다. 급한 일정의 경우 우선 작업도 가능하니 미리 문의해 주세요.",
              },
              {
                q: "인쇄·제작까지 포함되나요?",
                a: "네, 디자인부터 인쇄·제작까지 원스톱으로 진행합니다. 포스터, 현수막, 리플렛, 자료집 등의 인쇄물 제작과 행사장 배송까지 관리합니다. 인쇄 비용은 수량과 규격에 따라 별도 안내합니다.",
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
        title="행사 디자인, 기획부터 함께하는 전문 팀에 맡기세요"
        relatedServices={[
          { href: "/services/government", label: "공공기관 행사 대행" },
          { href: "/services/corporate", label: "기업행사 기획·대행" },
          { href: "/services/conference", label: "컨퍼런스·포럼 기획" },
          { href: "/guide/pricing", label: "비용·견적 안내" },
        ]}
      />
    </>
  );
}
