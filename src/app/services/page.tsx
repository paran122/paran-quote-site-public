import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import TrustBadges from "./_components/TrustBadges";
import { CurrencyKrw } from "@phosphor-icons/react/dist/ssr";

const SITE_URL = "https://parancompany.co.kr";

export const metadata: Metadata = {
  title: "행사 대행 서비스 — 기획부터 운영까지 원스톱",
  description:
    "파란컴퍼니의 행사 대행 서비스. 기업행사, 공공기관행사, 컨퍼런스, 세미나, 행사 디자인 등 250+ 프로젝트 경험의 전문 에이전시가 기획부터 운영까지 책임집니다.",
  keywords: [
    "행사대행", "행사대행업체", "행사기획", "행사대행서비스",
    "기업행사", "공공기관행사", "세미나대행", "컨퍼런스대행",
    "워크숍", "심포지엄", "시무식", "송년회",
  ],
  alternates: { canonical: `${SITE_URL}/services` },
  openGraph: {
    title: "행사 대행 서비스 | 파란컴퍼니",
    description:
      "기업·공공기관 행사 기획부터 디자인·운영까지. 250+ 프로젝트 수행 전문 에이전시.",
    type: "website",
    url: `${SITE_URL}/services`,
    images: [{ url: "/og-image.png?v=2", width: 1200, height: 630, alt: "파란컴퍼니 행사 대행 서비스 - 기획부터 운영까지 원스톱" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "행사 대행 서비스 | 파란컴퍼니",
    description: "기업·공공기관 행사 기획부터 디자인·운영까지. 250+ 프로젝트 수행 전문 에이전시.",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "홈", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "서비스", item: `${SITE_URL}/services` },
  ],
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "행사 대행 서비스",
  description:
    "세미나, 컨퍼런스, 포럼 등 행사 기획부터 디자인·운영까지 원스톱 대행 서비스",
  provider: {
    "@type": "Organization",
    name: "파란컴퍼니",
    url: SITE_URL,
  },
  areaServed: { "@type": "Country", name: "대한민국" },
  serviceType: "Event Planning",
  serviceArea: [
    { "@type": "City", name: "서울" },
    { "@type": "AdministrativeArea", name: "경기도" },
    { "@type": "Country", name: "대한민국" },
  ],
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "KRW",
    lowPrice: "8000000",
    description: "소규모 행사 800만 원부터, 중규모 2,500만 원부터, 대규모 5,000만 원부터",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "행사 대행 서비스 카탈로그",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "컨퍼런스·세미나 대행",
          url: `${SITE_URL}/services/conference`,
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "교육·워크숍 대행",
          url: `${SITE_URL}/services/education`,
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "전시·홍보부스 대행",
          url: `${SITE_URL}/services/booth`,
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "행사 디자인·시안물 제작",
          url: `${SITE_URL}/services/design`,
        },
      },
    ],
  },
};

interface ServiceCard {
  href: string;
  image: string;
  title: string;
  desc: string;
}

const eventServices: ServiceCard[] = [
  {
    href: "/services/conference",
    image: "/assets/images/services/hero-conference-auto-seminar.webp",
    title: "컨퍼런스·세미나",
    desc: "컨퍼런스·포럼·학술대회·심포지엄 — 연사 섭외부터 하이브리드 중계까지 원스톱 대행.",
  },
  {
    href: "/services/education",
    image: "/assets/images/services/hero-education-community.webp",
    title: "교육·워크숍",
    desc: "임직원 연수·역량강화 워크숍·청소년 캠프 — 커리큘럼 설계부터 현장 운영까지.",
  },
  {
    href: "/services/booth",
    image: "/assets/images/services/hero-booth-nhis.webp",
    title: "전시·홍보부스",
    desc: "박람회 전시부스·체험부스·포토존 — 디자인부터 시공·현장 운영까지.",
  },
];

const designServices: ServiceCard[] = [
  {
    href: "/services/design/print",
    image: "/assets/images/poster/landing/poster-2026-goyang.webp",
    title: "현수막·포스터",
    desc: "현수막·포스터·리플렛·카탈로그 — 카피라이팅부터 인쇄용 파일까지. 시안 3~5일.",
  },
  {
    href: "/services/design/digital",
    image: "/assets/images/ppt/landing/ppt-community-energy.webp",
    title: "PPT·카드뉴스·편집디자인",
    desc: "발표용 PPT·SNS 카드뉴스·자료집 편집디자인 — 장당 5만원~, 시안 2~3일.",
  },
  {
    href: "/services/design/space",
    image: "/assets/images/booth/landing/photozone-2026-international-forum.webp",
    title: "전시부스·포토존",
    desc: "전시부스·포토존 디자인·시공 — 3D 시뮬레이션 제공, 행사 디자인 통합 패키지.",
  },
];

const stats = [
  { value: "250+", label: "수행 프로젝트" },
  { value: "90%", label: "재계약률" },
  { value: "93점", label: "참가자 만족도" },
  { value: "원스톱", label: "기획→디자인→운영" },
];

export default function ServicesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />

      {/* Hero */}
      <section className="bg-[#091041] pt-12 md:pt-16 pb-28 md:pb-40">
        <div className="mx-auto max-w-[1200px] px-5 md:px-8">
          <nav aria-label="breadcrumb" className="text-[11px] text-white/40 mb-16 md:mb-24">
            <Link href="/" className="hover:text-white/70 transition-colors">홈</Link>
            <span className="mx-2 text-white/20">/</span>
            <span className="text-white/60">서비스</span>
          </nav>
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-6">
              행사 대행 서비스
            </h1>
            <p className="text-base md:text-lg text-slate-300 leading-relaxed mb-10">
              기업·공공기관 행사 기획부터 디자인·운영까지 원스톱으로 대행합니다.
            </p>
            <TrustBadges variant="dark" />
          </div>
        </div>
      </section>

      {/* 소개 텍스트 */}
      <section className="py-12 md:py-16 px-5 md:px-8">
        <div className="mx-auto max-w-[800px]">
          <p className="text-slate-600 leading-relaxed mb-4">
            파란컴퍼니는 2015년 설립 이후 공공기관·기업 대상으로 250건 이상의
            행사를 성공적으로 수행해 온 행사 대행 전문 에이전시입니다. 세미나,
            컨퍼런스, 포럼, 워크숍, 축제 등 다양한 행사를 기획부터 디자인, 현장
            운영, 결과보고까지 원스톱으로 대행합니다.
          </p>
          <p className="text-slate-500 text-sm leading-relaxed">
            행사 목적과 일정만 알려주시면, 기획안 작성부터 장소 섭외, 연사 초청,
            홍보물 디자인, 현장 세팅, 참가자 관리, 결과보고서까지 한 팀이
            책임집니다.
          </p>
        </div>
      </section>

      {/* 행사 대행 서비스 — 사진 카드 */}
      <section className="pb-12 md:pb-16 px-5 md:px-8">
        <div className="mx-auto max-w-[1200px]">
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-blue-600 mb-2">EVENT SERVICE</p>
          <h2 className="text-xl md:text-2xl font-bold mb-6">행사 대행</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {eventServices.map((svc) => (
              <Link
                key={svc.href}
                href={svc.href}
                className="group block overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm hover:border-blue-200 hover:shadow-xl transition-all"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <Image
                    src={svc.image}
                    alt={`${svc.title} 대행 — 파란컴퍼니 수행 현장`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold group-hover:text-blue-600 transition-colors">
                    {svc.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed mt-1.5">
                    {svc.desc}
                  </p>
                  <span className="mt-3 inline-block text-[13px] font-medium text-blue-600">
                    자세히 보기 →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 행사 디자인 서비스 — 사진 카드 */}
      <section className="pb-12 md:pb-16 px-5 md:px-8">
        <div className="mx-auto max-w-[1200px]">
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-blue-600 mb-2">DESIGN SERVICE</p>
          <div className="flex items-end justify-between mb-6 gap-4">
            <h2 className="text-xl md:text-2xl font-bold">행사 디자인</h2>
            <Link href="/services/design" className="shrink-0 text-sm text-blue-600 font-medium hover:underline">
              디자인 서비스 전체 보기 →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {designServices.map((svc) => (
              <Link
                key={svc.href}
                href={svc.href}
                className="group block overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm hover:border-blue-200 hover:shadow-xl transition-all"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <Image
                    src={svc.image}
                    alt={`${svc.title} 디자인 — 파란컴퍼니 작업물`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold group-hover:text-blue-600 transition-colors">
                    {svc.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed mt-1.5">
                    {svc.desc}
                  </p>
                  <span className="mt-3 inline-block text-[13px] font-medium text-blue-600">
                    자세히 보기 →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 비용·견적 배너 */}
      <section className="pb-16 md:pb-24 px-5 md:px-8">
        <div className="mx-auto max-w-[1200px]">
          <Link
            href="/guide/pricing"
            className="group flex items-center justify-between gap-4 rounded-2xl border border-blue-100 bg-blue-50/60 px-6 py-5 hover:bg-blue-50 hover:border-blue-200 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-white text-blue-600">
                <CurrencyKrw size={22} weight="fill" />
              </div>
              <div>
                <p className="font-bold text-[15px] text-slate-900">비용·견적 안내</p>
                <p className="text-[13px] text-slate-500 mt-0.5">행사 규모·유형별 비용 구조와 견적 프로세스</p>
              </div>
            </div>
            <span className="shrink-0 text-sm font-medium text-blue-600">비용 가이드 →</span>
          </Link>
        </div>
      </section>

      {/* 통계 */}
      <section className="bg-slate-50 py-16 md:py-20 px-5 md:px-8">
        <div className="mx-auto max-w-[1200px]">
          <h2 className="text-xl md:text-2xl font-bold text-center mb-10">
            왜 파란컴퍼니인가
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="text-3xl md:text-4xl font-extrabold text-blue-600 font-num">
                  {s.value}
                </div>
                <div className="text-sm text-slate-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
          <p className="text-slate-500 text-sm text-center mt-8 max-w-2xl mx-auto leading-relaxed">
            여성기업 인증을 보유한 행사 대행 전문 업체로, 교육부·해군·경기도교육청
            등 다수의 공공기관 행사를 수행한 경험이 있습니다.
          </p>
          <div className="flex items-center justify-center gap-4 mt-6">
            <Link href="/work" className="text-sm text-blue-600 font-medium hover:underline">
              포트폴리오 보기 →
            </Link>
            <Link href="/company" className="text-sm text-blue-600 font-medium hover:underline">
              회사소개 보기 →
            </Link>
          </div>
        </div>
      </section>

      {/* 주요 고객사 */}
      <section className="py-16 md:py-20 px-5 md:px-8">
        <div className="mx-auto max-w-[1200px]">
          <h2 className="text-xl md:text-2xl font-bold text-center mb-4">
            주요 고객사
          </h2>
          <p className="text-slate-500 text-sm text-center mb-8">
            정부 부처, 지자체, 공기업, 재단 등 다양한 기관의 행사를 수행하고 있습니다.
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 max-w-[800px] mx-auto">
            {[
              "경기도교육청", "교육부", "해군본부", "합동참모본부", "국방부",
              "과학기술|정보통신부", "수원시", "고양시", "남원시",
              "자동차부품산업|진흥재단", "한국문화예술|교육진흥원",
              "한국에너지|정보문화재단", "한국예술인|복지재단",
              "한국산업|인력공단", "농업정책|보험금융원",
            ].map((name) => (
              <span
                key={name}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-center text-xs font-medium text-slate-700 break-keep"
              >
                {name.split("|").map((part, i, arr) => (
                  <span key={i}>
                    {part}
                    {i < arr.length - 1 && <wbr />}
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 px-5 md:px-8 text-center">
        <div className="mx-auto max-w-[600px]">
          <h2 className="text-xl md:text-2xl font-bold mb-3">
            행사 기획, 어디서부터 시작해야 할지 모르겠다면
          </h2>
          <p className="text-slate-500 text-sm mb-8">
            행사 일정과 규모만 알려주시면, 1영업일 내에 맞춤 견적서를
            보내드립니다.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/?scrollTo=contact"
              className="btn-primary btn-lg w-full sm:w-auto"
            >
              무료 견적 요청하기
            </Link>
            <a
              href="tel:02-6342-2800"
              className="btn-outline btn-lg w-full sm:w-auto"
            >
              02-6342-2800
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
