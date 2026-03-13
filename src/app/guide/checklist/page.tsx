import type { Metadata } from "next";
import ChecklistClient from "./ChecklistClient";

const SITE_URL = "https://parancompany.co.kr";

export const metadata: Metadata = {
  title: "행사 준비 체크리스트",
  description:
    "행사 기획부터 마무리까지 빠짐없이 준비하는 4단계 체크리스트. 세미나, 컨퍼런스, 포럼, 교육 행사 준비에 필요한 모든 항목을 확인하세요.",
  alternates: { canonical: `${SITE_URL}/guide/checklist` },
  openGraph: {
    title: "행사 준비 체크리스트 | 파란컴퍼니",
    description: "행사 기획부터 마무리까지 빠짐없이 준비하는 4단계 체크리스트.",
    type: "article",
    url: `${SITE_URL}/guide/checklist`,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "행사 준비 체크리스트",
  description:
    "행사 기획부터 마무리까지 빠짐없이 준비하는 4단계 체크리스트.",
  step: [
    {
      "@type": "HowToStep",
      name: "1단계: 기획 및 섭외",
      text: "행사 개최 계획 확정, 공동 주최/주관 기관 협의, 강사·연사 섭외, 행사장 예약, 시설·기자재 사전 점검, 예산안 확정",
    },
    {
      "@type": "HowToStep",
      name: "2단계: 준비 및 제작",
      text: "참가자 모집, 웹 포스터·상세 안내 페이지 제작, 현수막·배너·명찰 디자인 및 제작, 자료집 편집·인쇄, 기념품·설문지 준비",
    },
    {
      "@type": "HowToStep",
      name: "3단계: 행사 당일",
      text: "현장 세팅, 참가자 등록 및 안내, 큐시트 기반 시간 관리, 현장 촬영, 만족도 조사, 돌발 상황 대응",
    },
    {
      "@type": "HowToStep",
      name: "4단계: 사후 처리",
      text: "설문 결과 분석, 사진·영상 보정, 결과보고서 작성, 비용 정산, 참가자 감사 메시지 발송",
    },
  ],
};

export default function ChecklistPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ChecklistClient />
    </>
  );
}
