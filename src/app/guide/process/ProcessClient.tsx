"use client";

import GuideClient from "../GuideClient";

interface Step {
  number: string;
  title: string;
  timing: string;
  description: string;
  details: string[];
}

const steps: Step[] = [
  {
    number: "01",
    title: "상담 및 요구사항 파악",
    timing: "D-30 이전",
    description: "전화, 카카오톡, 또는 방문 상담을 통해 행사의 목적, 규모, 예산, 일정을 확인합니다.",
    details: [
      "행사 목적과 기대 효과 확인",
      "참석 대상 및 예상 인원 파악",
      "희망 일정과 장소 조건 확인",
      "예산 범위 및 필요 서비스 범위 협의",
    ],
  },
  {
    number: "02",
    title: "기획안·견적서 제출",
    timing: "상담 후 약 3~5일",
    description: "행사 콘셉트, 프로그램 구성, 항목별 견적을 포함한 기획 제안서를 제출합니다.",
    details: [
      "행사 콘셉트 및 슬로건 제안",
      "프로그램 타임테이블 초안",
      "항목별 상세 견적서 (기획, 디자인, 장비, 인력 등)",
      "유사 행사 레퍼런스 및 포트폴리오 공유",
    ],
  },
  {
    number: "03",
    title: "계약 체결",
    timing: "행사 D-21 이전 권장",
    description: "기획안과 견적 확정 후 계약을 체결합니다. 공공기관의 경우 조달 절차에 맞춰 진행합니다.",
    details: [
      "최종 서비스 범위 및 금액 확정",
      "계약서 작성 및 날인",
      "착수금 지급 (비율은 계약 조건에 따라 협의)",
      "전담 PM 배정 및 커뮤니케이션 채널 개설",
    ],
  },
  {
    number: "04",
    title: "세부 기획·디자인 제작",
    timing: "D-21 ~ D-7",
    description: "시안물 디자인, 프로그램 확정, 연사 조율, 장비 확정 등 실무 준비를 진행합니다.",
    details: [
      "포스터, 현수막, 배너, 명찰 등 시안물 디자인",
      "자료집·리플렛 편집 및 인쇄",
      "연사·강사 발표 자료 취합 및 검토",
      "음향·영상·조명 장비 사양 확정",
      "참가자 모집 및 사전 등록 관리",
    ],
  },
  {
    number: "05",
    title: "사전 리허설·현장 답사",
    timing: "D-3 ~ D-1",
    description: "현장을 직접 방문하여 동선, 장비, 세팅을 확인하고 리허설을 진행합니다.",
    details: [
      "행사장 현장 답사 및 배치도 확정",
      "음향·영상 장비 테스트",
      "참가자 동선 및 VIP 의전 동선 확인",
      "큐시트 최종 점검 및 스태프 역할 분담",
      "비상 상황 대응 매뉴얼 공유",
    ],
  },
  {
    number: "06",
    title: "행사 당일 운영",
    timing: "D-Day",
    description: "등록·안내·진행·촬영·돌발 상황 대응까지, 전담 팀이 현장을 운영합니다.",
    details: [
      "현장 세팅 (현수막, 배너, 접수대, 포토존)",
      "참가자 등록 및 안내",
      "큐시트 기반 프로그램 진행 관리",
      "현장 사진·영상 촬영",
      "만족도 조사 실시",
    ],
  },
  {
    number: "07",
    title: "결과보고서 제출 및 정산",
    timing: "행사 종료 후",
    description: "행사 결과를 정리하고 보고서를 제출합니다. 비용 정산 후 프로젝트를 마무리합니다.",
    details: [
      "결과보고서 작성 (참석 통계, 만족도, 현장 사진)",
      "촬영 원본 파일 및 편집 영상 전달",
      "최종 비용 정산 및 잔금 처리",
      "개선사항 피드백 공유",
    ],
  },
];

export default function ProcessClient() {
  return (
    <GuideClient
      title="행사 진행 절차"
      description="상담부터 결과보고까지, 7단계로 체계적으로 진행합니다"
    >
      <div className="space-y-4">
        <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-4">
          <p className="text-sm leading-relaxed text-slate-500">
            아래 절차는 일반적인 진행 과정이며, 행사 유형·규모·일정에 따라 단계와 소요 기간이 달라질 수 있습니다.
          </p>
        </div>
        {steps.map((step, i) => (
          <div
            key={i}
            className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm md:p-6"
          >
            <div className="flex items-start gap-4">
              {/* Step Number */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                {step.number}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-slate-900 md:text-lg">
                    {step.title}
                  </h2>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
                    {step.timing}
                  </span>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                  {step.description}
                </p>
                <ul className="mt-3 space-y-1.5">
                  {step.details.map((detail, di) => (
                    <li
                      key={di}
                      className="flex items-start gap-2 text-sm text-slate-600"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {/* Connector line */}
            {i < steps.length - 1 && (
              <div className="ml-5 mt-4 h-4 w-px bg-blue-200" />
            )}
          </div>
        ))}
      </div>
    </GuideClient>
  );
}
