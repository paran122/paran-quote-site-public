import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import TrustBadges from "./_components/TrustBadges";

const SITE_URL = "https://parancompany.co.kr";

export const metadata: Metadata = {
  title: "행사 대행 서비스 — 기획부터 운영까지 원스톱",
  description:
    "파란컴퍼니의 행사 대행 서비스. 기업행사, 공공기관행사, 컨퍼런스, 세미나, 행사 디자인 등 250+ 프로젝트 경험의 전문 에이전시가 기획부터 운영까지 책임집니다.",
  alternates: { canonical: `${SITE_URL}/services` },
  openGraph: {
    title: "행사 대행 서비스 | 파란컴퍼니",
    description:
      "기업·공공기관 행사 기획부터 디자인·운영까지. 250+ 프로젝트 수행 전문 에이전시.",
    type: "website",
    url: `${SITE_URL}/services`,
  },
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
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "행사 대행 서비스 카탈로그",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "기업행사 기획·대행",
          url: `${SITE_URL}/services/corporate`,
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "공공기관 행사 대행",
          url: `${SITE_URL}/services/government`,
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "컨퍼런스·포럼 기획",
          url: `${SITE_URL}/services/conference`,
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "세미나·워크숍 기획",
          url: `${SITE_URL}/services/seminar`,
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

const services = [
  {
    href: "/services/corporate",
    icon: "/icons/service-icon-exhibition-v4.png",
    title: "기업행사 기획·대행",
    desc: "세미나, 워크숍, 비전선포식, 성과발표회 등 기업 행사를 기획부터 운영까지 책임집니다.",
  },
  {
    href: "/services/government",
    icon: "/icons/service-icon-government-v1.png",
    title: "공공기관 행사 대행",
    desc: "정부·지자체·공기업 행사를 조달 규정에 맞춰 기획·운영합니다. 여성기업 인증 보유.",
  },
  {
    href: "/services/conference",
    icon: "/icons/service-icon-seminar-v4.png",
    title: "컨퍼런스·포럼·학술대회",
    desc: "100~500명 규모의 컨퍼런스, 포럼, 학술대회를 하이브리드 운영까지 지원합니다.",
  },
  {
    href: "/services/seminar",
    icon: "/icons/service-icon-education-v4.png",
    title: "세미나·워크숍 기획",
    desc: "전문 세미나와 참여형 워크숍을 기획하고, 연사 섭외부터 운영까지 대행합니다.",
  },
  {
    href: "/services/design",
    icon: "/icons/service-icon-design-v1.png",
    title: "행사 디자인·시안물",
    desc: "포스터, 현수막, 리플렛, 자료집, 명찰 등 행사에 필요한 모든 시안물을 디자인합니다.",
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />

      {/* Hero */}
      <section className="bg-[#0f1a3c] pt-12 md:pt-16 pb-28 md:pb-40">
        <div className="mx-auto max-w-[1200px] px-5 md:px-8">
          <nav className="text-[11px] text-white/40 mb-16 md:mb-24">
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

      {/* 서비스 카드 그리드 */}
      <section className="pb-16 md:pb-24 px-5 md:px-8">
        <div className="mx-auto max-w-[1200px]">
          <h2 className="text-xl md:text-2xl font-bold mb-8 text-center">
            서비스 분야
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((svc) => (
              <Link
                key={svc.href}
                href={svc.href}
                className="group block p-5 md:p-6 rounded-xl border border-slate-200/80 bg-white shadow-sm hover:border-blue-200 hover:shadow-lg transition-all"
              >
                <div className="w-14 h-14 mb-4 group-hover:scale-110 transition-transform">
                  <Image src={svc.icon} alt={svc.title} width={56} height={56} className="object-contain" />
                </div>
                <h3 className="text-lg font-bold mb-1 group-hover:text-blue-600 transition-colors">
                  {svc.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-3">
                  {svc.desc}
                </p>
                <span className="text-xs text-blue-500 font-medium">
                  자세히 보기 →
                </span>
              </Link>
            ))}

            {/* 비용·견적 카드 — 기존 /guide/pricing 연결 */}
            <Link
              href="/guide/pricing"
              className="group block p-5 md:p-6 rounded-xl border border-slate-200/80 bg-white shadow-sm hover:border-blue-200 hover:shadow-lg transition-all"
            >
              <div className="w-14 h-14 mb-4 group-hover:scale-110 transition-transform">
                <Image src="/icons/service-icon-pricing-v1.png" alt="비용·견적 안내" width={56} height={56} className="object-contain" />
              </div>
              <h3 className="text-lg font-bold mb-1 group-hover:text-blue-600 transition-colors">
                비용·견적 안내
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-3">
                행사 규모·유형별 비용 구조와 견적 프로세스를 안내합니다.
              </p>
              <span className="text-xs text-blue-500 font-medium">
                비용 가이드 보기 →
              </span>
            </Link>
          </div>
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
