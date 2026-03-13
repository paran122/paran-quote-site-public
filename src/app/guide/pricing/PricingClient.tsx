"use client";

import GuideClient from "../GuideClient";

interface PriceItem {
  name: string;
  range: string;
  note: string;
}

interface PriceCategory {
  title: string;
  items: PriceItem[];
}

const priceCategories: PriceCategory[] = [
  {
    title: "기획·운영",
    items: [
      { name: "행사 기획서 (컨퍼런스)", range: "150만 원부터", note: "기획안, 운영 매뉴얼, 타임테이블, 예산안 포함" },
      { name: "행사 기획서 (세미나·교육)", range: "120만 원부터", note: "교육 커리큘럼 설계, 연사 섭외 지원 포함" },
      { name: "현장 운영 인력 (PM)", range: "별도 상담", note: "전담 프로젝트 매니저 1명 배치" },
      { name: "현장 운영 스태프", range: "별도 상담", note: "등록·안내·진행 보조 인력 1명 기준" },
    ],
  },
  {
    title: "디자인·시안물",
    items: [
      { name: "메인 현수막", range: "80만 원부터", note: "디자인 시안 제공, 출력·설치 포함" },
      { name: "배너·엑스배너", range: "40만 원부터", note: "디자인 시안 제공" },
      { name: "포스터", range: "별도 상담", note: "웹용·인쇄용 동시 제작" },
      { name: "자료집·리플렛", range: "별도 상담", note: "편집 디자인 + 인쇄·제본" },
      { name: "명찰·네임택", range: "별도 상담", note: "디자인 + 인쇄" },
    ],
  },
  {
    title: "영상·음향·장비",
    items: [
      { name: "음향 시스템", range: "250만 원부터", note: "스피커, 마이크, 전문 엔지니어 포함" },
      { name: "LED 스크린", range: "300만 원부터", note: "P3.9 고화질 패널, 영상 송출 운영" },
      { name: "행사 촬영 (사진)", range: "80만 원부터", note: "전 과정 촬영, 보정 납품" },
      { name: "행사 촬영 (영상)", range: "별도 상담", note: "현장 촬영 + 하이라이트 편집 영상" },
    ],
  },
  {
    title: "부대 서비스",
    items: [
      { name: "전문 MC·사회자", range: "150만 원부터", note: "대본 작성 포함" },
      { name: "포토존 제작", range: "120만 원부터", note: "맞춤 디자인, 설치·철거 포함" },
      { name: "등록 데스크 설치", range: "200만 원부터", note: "접수대, 안내판, QR 체크인 시스템" },
      { name: "커피·다과 케이터링", range: "50만 원부터", note: "바리스타 서비스 + 다과 세팅" },
      { name: "뷔페 케이터링", range: "150만 원부터", note: "한식/양식 코스, 서빙 인력 포함" },
    ],
  },
];

interface PackageExample {
  title: string;
  scale: string;
  range: string;
  includes: string[];
}

const packageExamples: PackageExample[] = [
  {
    title: "소규모 세미나",
    scale: "30~50명",
    range: "300만 원부터",
    includes: ["기획서", "디자인(현수막·배너·명찰)", "자료집", "현장 운영"],
  },
  {
    title: "중규모 컨퍼런스",
    scale: "100~200명",
    range: "800만 원부터",
    includes: ["기획서", "디자인 풀세트", "음향 시스템", "현장 촬영", "현장 운영", "다과 케이터링"],
  },
  {
    title: "대규모 포럼·국제행사",
    scale: "300~500명",
    range: "2,000만 원부터",
    includes: ["기획서", "디자인 풀세트", "음향+LED", "MC", "촬영(사진+영상)", "등록 시스템", "포토존", "케이터링"],
  },
];

export default function PricingClient() {
  return (
    <GuideClient
      title="행사 비용 가이드"
      description="항목별 비용 범위와 규모별 예산 설계를 참고하세요"
    >
      <div className="space-y-8">
        {/* 안내 문구 */}
        <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-4">
          <p className="text-sm font-medium leading-relaxed text-amber-900">
            아래 금액은 일반적인 업계 참고 범위이며, 실제 비용은 행사 규모·장소·일정·세부 요구사항에 따라 달라집니다.
            정확한 견적은 상담 후 항목별로 투명하게 산출해 드립니다.
          </p>
        </div>

        {/* 항목별 비용 */}
        {priceCategories.map((cat, ci) => (
          <div
            key={ci}
            className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm md:p-6"
          >
            <h2 className="mb-4 text-base font-bold text-slate-900 md:text-lg">
              {cat.title}
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="pb-2 text-left font-medium text-slate-500">항목</th>
                    <th className="pb-2 text-left font-medium text-slate-500">참고 가격</th>
                    <th className="hidden pb-2 text-left font-medium text-slate-500 md:table-cell">비고</th>
                  </tr>
                </thead>
                <tbody>
                  {cat.items.map((item, ii) => (
                    <tr key={ii} className="border-b border-slate-50 last:border-0">
                      <td className="py-2.5 text-slate-800">
                        {item.name}
                        <p className="mt-0.5 text-xs text-slate-400 md:hidden">{item.note}</p>
                      </td>
                      <td className="py-2.5 align-top font-medium text-blue-600">{item.range}</td>
                      <td className="hidden py-2.5 text-slate-500 md:table-cell">{item.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        {/* 규모별 예산 예시 */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm md:p-6">
          <h2 className="mb-1 text-base font-bold text-slate-900 md:text-lg">
            규모별 예산 예시
          </h2>
          <p className="mb-4 text-xs text-slate-400">실제 견적은 포함 항목에 따라 달라집니다</p>
          <div className="grid gap-4 md:grid-cols-3">
            {packageExamples.map((pkg, pi) => (
              <div key={pi} className="rounded-lg border border-slate-100 p-4">
                <h3 className="text-sm font-semibold text-slate-900">{pkg.title}</h3>
                <p className="mt-0.5 text-xs text-slate-500">{pkg.scale}</p>
                <p className="mt-2 text-lg font-bold text-blue-600">{pkg.range}</p>
                <ul className="mt-3 space-y-1">
                  {pkg.includes.map((inc, ii) => (
                    <li key={ii} className="flex items-start gap-1.5 text-xs text-slate-600">
                      <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-blue-400" />
                      {inc}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* 비용 절감 팁 */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm md:p-6">
          <h2 className="mb-3 text-base font-bold text-slate-900 md:text-lg">
            예산 절감 팁
          </h2>
          <ul className="space-y-2">
            {[
              "규모가 커도 기획비·디자인비는 동일하므로, 인당 단가는 규모가 클수록 낮아집니다.",
              "현수막·배너를 직접 제작하고 기획·운영만 의뢰하면 비용을 줄일 수 있습니다.",
              "참석자가 직접 보는 항목(자료집, 무대 연출)에 예산을 집중하고, 후선 업무는 절감하는 것이 효과적입니다.",
              "같은 고객사의 반복 행사는 시안물 템플릿 재활용으로 디자인 비용을 절감할 수 있습니다.",
            ].map((tip, ti) => (
              <li key={ti} className="flex items-start gap-2 text-sm text-slate-600">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </GuideClient>
  );
}
