import type { Metadata } from "next";
import ProcessClient from "./ProcessClient";

const SITE_URL = "https://parancompany.co.kr";

export const metadata: Metadata = {
  title: "행사 진행 절차",
  description:
    "상담부터 결과보고까지 7단계로 진행되는 행사 대행 절차를 안내합니다. 각 단계별 소요 기간과 주요 업무를 확인하세요.",
  alternates: { canonical: `${SITE_URL}/guide/process` },
  openGraph: {
    title: "행사 진행 절차 | 파란컴퍼니",
    description: "상담부터 결과보고까지 7단계 행사 대행 절차 안내.",
    type: "article",
    url: `${SITE_URL}/guide/process`,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "행사 진행 절차",
  description:
    "상담부터 결과보고까지 7단계로 진행되는 행사 대행 절차 안내.",
  step: [
    { "@type": "HowToStep", name: "상담 및 요구사항 파악", text: "전화, 카카오톡, 또는 방문 상담을 통해 행사의 목적, 규모, 예산, 일정을 확인합니다." },
    { "@type": "HowToStep", name: "기획안·견적서 제출", text: "행사 콘셉트, 프로그램 구성, 항목별 견적을 포함한 기획 제안서를 제출합니다." },
    { "@type": "HowToStep", name: "계약 체결", text: "기획안과 견적 확정 후 계약을 체결합니다." },
    { "@type": "HowToStep", name: "세부 기획·디자인 제작", text: "시안물 디자인, 프로그램 확정, 연사 조율, 장비 확정 등 실무 준비를 진행합니다." },
    { "@type": "HowToStep", name: "사전 리허설·현장 답사", text: "현장을 직접 방문하여 동선, 장비, 세팅을 확인하고 리허설을 진행합니다." },
    { "@type": "HowToStep", name: "행사 당일 운영", text: "등록·안내·진행·촬영·돌발 상황 대응까지, 전담 팀이 현장을 운영합니다." },
    { "@type": "HowToStep", name: "결과보고서 제출 및 정산", text: "행사 결과를 정리하고 보고서를 제출합니다. 비용 정산 후 프로젝트를 마무리합니다." },
  ],
};

export default function ProcessPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProcessClient />
    </>
  );
}
