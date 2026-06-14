import type { Metadata } from "next";

const SITE_URL = "https://parancompany.co.kr";

export const metadata: Metadata = {
  title: "안광성 이사 | 파란컴퍼니 디자인 파트",
  description:
    "파란컴퍼니 디자인 파트 이사 안광성. 디자인 경력 20년, 공공기관 디자인 프로젝트 250건 이상을 총괄한 편집디자인·인쇄물 전문가입니다.",
  alternates: { canonical: `${SITE_URL}/authors/ahn-kwangsung` },
  openGraph: {
    title: "안광성 이사 | 파란컴퍼니 디자인 파트",
    description: "디자인 경력 20년 · 250+ 공공기관 디자인 프로젝트 총괄. 편집디자인·인쇄물 전문가.",
    type: "profile",
    url: `${SITE_URL}/authors/ahn-kwangsung`,
    images: [
      {
        url: "https://parancompany.co.kr/og-image.png?v=2",
        width: 1200,
        height: 630,
        alt: "파란컴퍼니 - 행사 기획·디자인·운영 전문 에이전시",
      },
    ],
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "안광성",
  alternateName: "Ahn Kwangsung",
  jobTitle: "디자인 파트 이사",
  worksFor: {
    "@type": "Organization",
    name: "파란컴퍼니",
    url: SITE_URL,
  },
  knowsAbout: [
    "편집디자인",
    "인쇄물 디자인",
    "브랜드 아이덴티티",
    "공공기관 디자인",
    "포스터 디자인",
    "리플렛 디자인",
    "PPT 디자인",
  ],
  url: `${SITE_URL}/authors/ahn-kwangsung`,
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "홈", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "안광성 이사", item: `${SITE_URL}/authors/ahn-kwangsung` },
  ],
};

export default function AuthorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      {/* ═══ 히어로 (다크) ═══ */}
      <section className="bg-[#0f1a3c] pt-28 pb-14 sm:pt-32 sm:pb-16">
        <div className="mx-auto max-w-[720px] px-6">
          <p className="text-[13px] font-medium tracking-widest text-slate-400">
            글쓴이 프로필
          </p>
          <h1 className="mt-3 text-[32px] font-extrabold tracking-tight text-white sm:text-[40px]">
            안광성 이사
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-slate-300">
            파란컴퍼니(주) 디자인 파트 이사 · 디자인 경력 20년 · 250+ 공공기관 디자인 프로젝트 총괄
          </p>
        </div>
      </section>

      {/* ═══ 본문 ═══ */}
      <article className="bg-slate-50 pb-20">
        <div className="mx-auto max-w-[720px] px-6 pt-12">
          {/* 소개 */}
          <section className="mb-10">
            <h2 className="mb-4 text-[17px] font-bold text-slate-900">소개</h2>
            <p className="text-[15px] leading-[1.9] text-slate-600">
              안광성 이사는 <strong className="text-slate-800">파란컴퍼니(주) 디자인 파트 이사</strong>로서,
              2015년 회사 설립 이래 공공기관 및 기업 대상 디자인 프로젝트를 총괄해왔습니다.
              편집디자인과 인쇄물 전문가로 <strong className="text-slate-800">디자인 총 경력 20년</strong>,
              공공기관 대상 250건 이상의 디자인 프로젝트를 리드했습니다.
            </p>
          </section>

          {/* 전문 분야 */}
          <section className="mb-10">
            <h2 className="mb-4 text-[17px] font-bold text-slate-900">전문 분야</h2>
            <ul className="space-y-2.5 text-[15px] text-slate-600">
              <li>
                <strong className="text-slate-800">편집디자인</strong>
                {" — "}리플렛, 팜플렛, 자료집, 매뉴얼, 보고서
              </li>
              <li>
                <strong className="text-slate-800">인쇄물 디자인</strong>
                {" — "}포스터, 현수막, 배너, 명찰, 초대장
              </li>
              <li>
                <strong className="text-slate-800">브랜드 아이덴티티</strong>
                {" — "}로고, 키비주얼, 행사 CI, 가이드라인
              </li>
              <li>
                <strong className="text-slate-800">발표 자료 디자인</strong>
                {" — "}PPT, 카드뉴스, 인포그래픽
              </li>
              <li>
                <strong className="text-slate-800">공공기관 디자인 프로세스</strong>
                {" — "}과업지시서 대응, 수의계약·조달 요건 충족 디자인
              </li>
            </ul>
          </section>

          {/* 주요 고객 */}
          <section className="mb-10">
            <h2 className="mb-4 text-[17px] font-bold text-slate-900">주요 고객</h2>
            <p className="text-[15px] leading-[1.9] text-slate-600">
              경기도교육청 · 한국문화예술교육진흥원 · 대한민국 해군 · 한국수력원자력 ·
              KAP 한국자동차부품산업진흥재단 · 지자체 행사 및 축제 주관기관 등 공공·준공공 영역의
              행사·교육·홍보 디자인을 전담합니다.
            </p>
          </section>

          {/* 소속 회사 */}
          <section className="mb-10">
            <h2 className="mb-4 text-[17px] font-bold text-slate-900">소속 회사</h2>
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <h3 className="text-[16px] font-bold text-slate-900">파란컴퍼니(주)</h3>
              <ul className="mt-3 space-y-1.5 text-[14px] leading-[1.8] text-slate-600">
                <li>· <strong className="text-slate-700">2015년 설립</strong> — 행사·디자인 전문 에이전시</li>
                <li>· <strong className="text-slate-700">대표이사</strong> 김미경 / <strong className="text-slate-700">디자인 파트 이사</strong> 안광성</li>
                <li>· <strong className="text-slate-700">여성기업 인증</strong> / 직접생산확인증명서(행사대행업) 보유</li>
                <li>· 공공기관 수의계약·조달 입찰 참여 자격</li>
                <li>· 누적 <strong className="text-slate-700">250+ 프로젝트</strong></li>
                <li>· 경기도 수원시 팔달구 효원로 278, 6층 603호</li>
              </ul>
            </div>
          </section>

          {/* 문의 및 협업 */}
          <section>
            <h2 className="mb-4 text-[17px] font-bold text-slate-900">문의 및 협업</h2>
            <p className="mb-3 text-[15px] text-slate-600">
              디자인 의뢰, 공공기관 디자인 과업 문의, 협업 제안은 아래로 연락 주시기 바랍니다.
            </p>
            <ul className="space-y-1.5 text-[15px] text-slate-600">
              <li>
                이메일 —{" "}
                <a href="mailto:info@parancompany.co.kr" className="text-primary hover:underline">
                  info@parancompany.co.kr
                </a>
              </li>
              <li>
                대표 번호 — <a href="tel:02-6342-2800" className="text-primary hover:underline">02-6342-2800</a> (평일 09:00~18:00)
              </li>
              <li>
                카카오톡 채널 —{" "}
                <a href="https://pf.kakao.com/_xkexdLG" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  파란컴퍼니 상담
                </a>
              </li>
            </ul>
          </section>
        </div>
      </article>
    </>
  );
}
