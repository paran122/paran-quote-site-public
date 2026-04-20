import type { Metadata } from "next";

const SITE_URL = "https://parancompany.co.kr";

export const metadata: Metadata = {
  title: "김미경 대표 | 파란컴퍼니",
  description:
    "파란컴퍼니 대표 김미경. 행사 기획 경력 10년, 250건 이상의 공공기관·기업 행사 프로젝트를 총괄한 행사 기획 전문가입니다.",
  alternates: { canonical: `${SITE_URL}/authors/kim-mikyung` },
  openGraph: {
    title: "김미경 대표 | 파란컴퍼니",
    description: "행사 기획 경력 10년 · 250+ 프로젝트 총괄. 파란컴퍼니 대표.",
    type: "profile",
    url: `${SITE_URL}/authors/kim-mikyung`,
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "김미경",
  jobTitle: "대표",
  worksFor: {
    "@type": "Organization",
    name: "파란컴퍼니",
    url: SITE_URL,
  },
  knowsAbout: [
    "행사 기획",
    "세미나 대행",
    "컨퍼런스 운영",
    "포럼 기획",
    "공공기관 행사",
  ],
  url: `${SITE_URL}/authors/kim-mikyung`,
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "홈", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "김미경 대표", item: `${SITE_URL}/authors/kim-mikyung` },
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
            김미경 대표
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-slate-300">
            파란컴퍼니(주) 대표 · 행사 기획 경력 10년 · 250+ 공공기관·기업 프로젝트 총괄
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
              김미경 대표는 <strong className="text-slate-800">파란컴퍼니(주) 대표</strong>로서,
              2015년 회사 설립 이래 공공기관 및 기업 대상 행사 프로젝트를 총괄해왔습니다.
              세미나·컨퍼런스·포럼 전문가로 <strong className="text-slate-800">행사 기획 총 경력 10년</strong>,
              공공기관 대상 250건 이상의 행사 프로젝트를 리드했습니다.
            </p>
          </section>

          {/* 전문 분야 */}
          <section className="mb-10">
            <h2 className="mb-4 text-[17px] font-bold text-slate-900">전문 분야</h2>
            <ul className="space-y-2.5 text-[15px] text-slate-600">
              <li>
                <strong className="text-slate-800">공공기관 행사 기획·대행</strong>
                {" — "}세미나, 포럼, 컨퍼런스, 학술대회
              </li>
              <li>
                <strong className="text-slate-800">기업행사 기획</strong>
                {" — "}산업 세미나, 워크숍, 비전선포식, 성과발표회
              </li>
              <li>
                <strong className="text-slate-800">행사 디자인 총괄</strong>
                {" — "}포스터, 현수막, 자료집, 공간연출, 무대 디자인
              </li>
              <li>
                <strong className="text-slate-800">전국 순회 교육·시리즈 행사 운영</strong>
                {" — "}다권역 동시 진행, 장기 프로그램
              </li>
              <li>
                <strong className="text-slate-800">행정 서류</strong>
                {" — "}결과보고서, 정산 자료, 산출내역서 작성
              </li>
            </ul>
          </section>

          {/* 주요 고객 */}
          <section className="mb-10">
            <h2 className="mb-4 text-[17px] font-bold text-slate-900">주요 고객</h2>
            <p className="text-[15px] leading-[1.9] text-slate-600">
              경기도교육청 · 교육부 · 대한민국 해군 · 수원시 · 한국예술인복지재단 ·
              경기도평생교육진흥원 · KAP 한국자동차부품산업진흥재단 등 공공·준공공 영역의
              행사 기획·운영을 전담합니다.
            </p>
          </section>

          {/* 소속 회사 */}
          <section className="mb-10">
            <h2 className="mb-4 text-[17px] font-bold text-slate-900">소속 회사</h2>
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <h3 className="text-[16px] font-bold text-slate-900">파란컴퍼니(주)</h3>
              <ul className="mt-3 space-y-1.5 text-[14px] leading-[1.8] text-slate-600">
                <li>· <strong className="text-slate-700">2015년 설립</strong> — 행사 전문 에이전시</li>
                <li>· <strong className="text-slate-700">대표이사</strong> 김미경</li>
                <li>· <strong className="text-slate-700">여성기업 인증</strong> / 직접생산확인증명서(행사대행업) 보유</li>
                <li>· 공공기관 수의계약·조달 입찰 참여 자격</li>
                <li>· 누적 <strong className="text-slate-700">250+ 프로젝트</strong></li>
                <li>· 경기도 수원시 팔달구 효원로 278, 6층 603호</li>
                <li>· 패밀리 사이트: <a href="https://parandesign.kr" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">parandesign.kr</a> (디자인)</li>
              </ul>
            </div>
          </section>

          {/* 문의 및 협업 */}
          <section>
            <h2 className="mb-4 text-[17px] font-bold text-slate-900">문의 및 협업</h2>
            <p className="mb-3 text-[15px] text-slate-600">
              행사 기획 의뢰, 공공기관 과업 문의, 협업 제안은 아래로 연락 주시기 바랍니다.
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
