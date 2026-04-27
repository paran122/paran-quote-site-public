"use client";

import Link from "next/link";
import GuideClient from "../GuideClient";
import { Users, ArrowRight } from "lucide-react";

interface ScaleGuide {
  title: string;
  range: string;
  budget: string;
  personnel: string;
  venue: string;
  equipment: string[];
  designItems: string[];
  tips: string[];
}

const scales: ScaleGuide[] = [
  {
    title: "소규모 행사",
    range: "30 ~ 50명",
    budget: "800만 원~",
    personnel: "PM 1명 + 스태프 1~2명",
    venue: "세미나룸, 카페, 공공기관 회의실",
    equipment: [
      "빔프로젝터 + 스크린 (장소 기본 제공 확인)",
      "유선 마이크 1~2대",
      "노트북 1대 (발표용)",
    ],
    designItems: [
      "현수막 1개",
      "엑스배너 1~2개",
      "명찰 (참석자 수만큼)",
      "자료집 또는 리플렛",
    ],
    tips: [
      "소규모일수록 참석자 한 명 한 명의 경험이 중요합니다. 세밀한 동선 설계와 맞춤형 자료에 집중하세요.",
      "불필요한 항목은 과감히 빼고, 핵심 서비스에 예산을 집중하는 것이 효과적입니다.",
      "등록 데스크 대신 간이 접수대로 대체하면 비용과 공간을 절약할 수 있습니다.",
    ],
  },
  {
    title: "중규모 행사",
    range: "100 ~ 200명",
    budget: "2,500만 원~",
    personnel: "PM 1명 + 디자이너 + 음향 기사 + 스태프 3~5명",
    venue: "호텔 연회장, 대학 강당, 컨벤션센터 소홀",
    equipment: [
      "라인어레이 스피커 시스템",
      "무선 마이크 3~4대",
      "LED 스크린 또는 대형 프로젝터",
      "현장 촬영 장비 (카메라 1~2대)",
    ],
    designItems: [
      "메인 현수막 + 외부 현수막",
      "엑스배너 3~4개",
      "포스터 (온·오프라인)",
      "명찰 + 자료집",
      "포토존 또는 등신대",
    ],
    tips: [
      "사전 리허설이 필수입니다. 음향·영상 테스트를 당일 아침이 아닌 전날에 진행하세요.",
      "참가자 사전 등록 시스템(이벤터스 등)을 활용하면 당일 접수 혼잡을 줄일 수 있습니다.",
      "큐시트를 분 단위로 작성하고, 스태프 전원에게 사전 공유하세요.",
      "VIP가 있다면 별도 대기실과 의전 동선을 반드시 확보하세요.",
    ],
  },
  {
    title: "대규모 행사",
    range: "300 ~ 500명 이상",
    budget: "5,000만 원~",
    personnel: "PM + 부PM + 디자이너 + 음향·영상 기사 + MC + 스태프 7~10명 이상",
    venue: "컨벤션센터, 호텔 그랜드볼룸, 대형 강당",
    equipment: [
      "대형 LED 스크린 (P3.9 이상)",
      "라인어레이 스피커 + 모니터 스피커",
      "무선 마이크 5대 이상",
      "촬영팀 (사진 + 영상 각 1팀)",
      "조명 시스템",
      "동시통역 장비 (국제 행사 시)",
    ],
    designItems: [
      "메인 현수막 + 외부 현수막 + 입구 아치",
      "엑스배너 5개 이상",
      "포스터, 리플렛, 초청장",
      "자료집 + 에세이집",
      "명찰 (직급별 구분)",
      "포토존 + 전시 부스",
      "카드뉴스, SNS 콘텐츠",
    ],
    tips: [
      "역할별 인력 배치가 핵심입니다. 등록, 세션 진행, VIP 의전, 촬영 등 역할을 세분화하세요.",
      "비상 상황 대응 매뉴얼을 사전에 작성하고 전체 스태프에게 공유하세요.",
      "참가자 동선과 VIP 동선을 분리하여 설계하세요.",
      "행사 전날 풀 리허설은 필수이며, 큐시트를 2~3회 이상 점검하세요.",
      "보도자료를 사전에 작성하고 언론사에 배포하면 행사 홍보 효과를 높일 수 있습니다.",
    ],
  },
];

export default function ScaleClient() {
  return (
    <GuideClient
      title="행사 규모별 가이드"
      description="30명부터 500명까지, 규모에 따라 달라지는 준비사항을 안내합니다"
    >
      <div className="space-y-8">
        <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-4">
          <p className="text-sm leading-relaxed text-slate-500">
            아래 예산은 소규모 기준 최소 금액이며, 포함 항목과 행사 조건에 따라 달라집니다.
            정확한 견적은 상담 시 안내드립니다.
          </p>
        </div>
        {scales.map((scale, si) => (
          <div
            key={si}
            className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm md:p-6"
          >
            {/* Header */}
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                <Users size={18} className="text-blue-600" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 md:text-lg">
                  {scale.title}
                </h2>
                <p className="text-xs text-slate-500">{scale.range}</p>
              </div>
              <span className="ml-auto rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                {scale.budget}
              </span>
            </div>

            {/* 기본 정보 */}
            <div className="mb-4 grid gap-3 rounded-lg bg-slate-50 p-4 text-sm md:grid-cols-2">
              <div>
                <span className="text-xs font-medium text-slate-500">투입 인력</span>
                <p className="mt-0.5 text-slate-800">{scale.personnel}</p>
              </div>
              <div>
                <span className="text-xs font-medium text-slate-500">추천 장소</span>
                <p className="mt-0.5 text-slate-800">{scale.venue}</p>
              </div>
            </div>

            {/* 장비·디자인 */}
            <div className="mb-4 grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="mb-2 text-sm font-semibold text-slate-800">필요 장비</h3>
                <ul className="space-y-1.5">
                  {scale.equipment.map((eq, ei) => (
                    <li key={ei} className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                      {eq}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="mb-2 text-sm font-semibold text-slate-800">시안물·디자인</h3>
                <ul className="space-y-1.5">
                  {scale.designItems.map((di, dii) => (
                    <li key={dii} className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                      {di}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 팁 */}
            <div className="rounded-lg border border-blue-50 bg-blue-50/30 p-4">
              <h3 className="mb-2 text-sm font-semibold text-blue-800">운영 팁</h3>
              <ul className="space-y-1.5">
                {scale.tips.map((tip, ti) => (
                  <li key={ti} className="flex items-start gap-2 text-sm text-blue-700">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* 내부 링크 배너 */}
      <div className="mt-12">
        <Link
          href="/work"
          className="group flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50/50 px-6 py-5 transition-all hover:border-blue-200 hover:bg-blue-50"
        >
          <div>
            <p className="text-[15px] font-semibold text-slate-800">실제 포트폴리오를 확인해보세요</p>
            <p className="mt-1 text-[13px] text-slate-500">규모별 행사 사례 250+ 프로젝트</p>
          </div>
          <span className="flex shrink-0 items-center gap-1 text-[14px] font-medium text-blue-600 transition-transform group-hover:translate-x-0.5">
            포트폴리오
            <ArrowRight className="h-4 w-4" />
          </span>
        </Link>
      </div>
    </GuideClient>
  );
}
