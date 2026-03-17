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
      { name: "기획·운영 (세미나·컨퍼런스)", range: "500만 원~", note: "기획안, 운영 매뉴얼, 타임테이블, 예산안, 현장 운영 포함" },
      { name: "기획·운영 (포럼)", range: "700만 원~", note: "패널 토론 구성, 통역 연계, 현장 운영 포함" },
      { name: "결과보고서", range: "150만 원~", note: "행사 성과 분석 및 결과 보고서 작성" },
    ],
  },
  {
    title: "디자인·시안물",
    items: [
      { name: "포스터", range: "50만 원~", note: "웹용·인쇄용 동시 제작" },
      { name: "메인 현수막", range: "20만 원~", note: "디자인 시안 제공, 출력·설치 포함" },
      { name: "배너·엑스배너", range: "15만 원~", note: "디자인 시안 제공" },
      { name: "자료집·리플렛", range: "100만 원~", note: "편집 디자인 + 인쇄·제본" },
      { name: "참가자 키트", range: "5만 원~", note: "명찰, 자료, 기념품 등 1세트 기준" },
    ],
  },
  {
    title: "영상·촬영",
    items: [
      { name: "영상 촬영", range: "200만 원~", note: "현장 촬영 + 하이라이트 편집 영상" },
      { name: "하이브리드 중계", range: "300만 원~", note: "온·오프라인 동시 생중계" },
    ],
  },
  {
    title: "특수 서비스",
    items: [
      { name: "연사 섭외", range: "200만 원~", note: "전문 연사 매칭 및 섭외 대행" },
      { name: "통역 서비스", range: "200만 원~", note: "동시통역 장비 + 통역사" },
      { name: "공간 디자인", range: "800만 원~", note: "축제·페스티벌 공간 연출" },
      { name: "무대 설치", range: "500만 원~", note: "무대 구조물 설치·철거" },
      { name: "체험부스", range: "100만 원~", note: "참여형 체험 부스 1개 기준" },
      { name: "안전관리", range: "500만 원~", note: "안전요원 배치 및 안전 관리 계획" },
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
    range: "700만 원~",
    includes: ["기획·운영", "포스터", "현수막·배너", "참가자 키트", "결과보고서"],
  },
  {
    title: "중규모 컨퍼런스",
    scale: "100~200명",
    range: "1,500만 원~",
    includes: ["기획·운영", "포스터", "현수막·배너", "참가자 키트", "자료집", "영상 촬영", "연사 섭외", "결과보고서"],
  },
  {
    title: "대규모 포럼·국제행사",
    scale: "300~500명",
    range: "2,000만 원~",
    includes: ["기획·운영", "포스터", "현수막·배너", "참가자 키트", "자료집", "영상 촬영", "연사 섭외", "통역 서비스", "하이브리드 중계", "결과보고서"],
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
        <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-4">
          <p className="text-sm leading-relaxed text-slate-500">
            아래 금액은 소규모 기준 최소 단가이며, 행사 규모·장소·세부 요구사항에 따라 달라집니다.
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
                    <th className="pb-2 text-left font-medium text-slate-500">최소 가격</th>
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
