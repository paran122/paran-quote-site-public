"use client";

import Link from "next/link";
import GuideClient from "../GuideClient";
import { CheckSquare, ArrowRight } from "lucide-react";

interface CheckItem {
  text: string;
}

interface Stage {
  title: string;
  timing: string;
  items: CheckItem[];
}

const stages: Stage[] = [
  {
    title: "1단계: 기획 및 섭외",
    timing: "D-30 ~ D-14",
    items: [
      { text: "행사 개최 계획(안) 최종 확정" },
      { text: "공동 주최/주관 기관 협의 및 역할 분담 확정" },
      { text: "강사·연사 최종 명단 확정 및 섭외 완료" },
      { text: "강의 주제, 시간, 발표 자료(PPT) 수령" },
      { text: "행사장 예약 및 확정" },
      { text: "행사장 시설·기자재 사전 점검 (음향, 조명, 프로젝터, 인터넷)" },
      { text: "식사·다과 장소 협의 및 예약" },
      { text: "숙소, 이동 차량(버스) 예약 (1박 이상 행사 시)" },
      { text: "최종 예산안 확정 및 집행 계획 수립" },
    ],
  },
  {
    title: "2단계: 준비 및 제작",
    timing: "D-14 ~ D-1",
    items: [
      { text: "참가자 모집 및 신청 접수 (이벤터스 등 활용)" },
      { text: "행사 웹 포스터·상세 안내 페이지 제작" },
      { text: "현수막, 배너, 엑스배너 디자인 및 제작" },
      { text: "참석자 명단 기반 명찰 디자인 및 제작" },
      { text: "자료집(교재) 편집, 인쇄, 제본" },
      { text: "강사 프로필 및 소개 자료 정리" },
      { text: "확정 인원으로 식당·숙소·차량 최종 예약" },
      { text: "참가자 대상 상세 일정 및 준비물 안내 (문자/메일)" },
      { text: "기념품·참가 선물 준비" },
      { text: "만족도 조사 설문지 제작 (온라인 링크)" },
    ],
  },
  {
    title: "3단계: 행사 당일",
    timing: "D-Day",
    items: [
      { text: "현장 세팅: 현수막·배너 설치, 장비(음향·영상) 점검" },
      { text: "접수대 준비: 명찰, 자료집, 기념품, 방명록, 필기구" },
      { text: "참가자 등록 및 자료 배부" },
      { text: "큐시트 기반 시간 관리 (사회자·MC 연계)" },
      { text: "현장 사진·영상 촬영" },
      { text: "VIP 의전 및 동선 관리" },
      { text: "만족도 조사 실시 (QR코드 또는 설문 링크 안내)" },
      { text: "돌발 상황 대응 (예비 장비, 비상 연락망 확보)" },
    ],
  },
  {
    title: "4단계: 사후 처리",
    timing: "D+1 ~ D+7",
    items: [
      { text: "참가자 설문 결과 취합 및 분석" },
      { text: "현장 사진·영상 보정 및 정리" },
      { text: "결과보고서 작성 (참석 통계, 만족도, 현장 사진 포함)" },
      { text: "강사료·인건비 지급 처리" },
      { text: "전체 집행 비용 정산" },
      { text: "기념품·물품 잔량 확인 및 반납" },
      { text: "참가자 감사 메시지 발송" },
      { text: "개선사항 정리 (다음 행사 반영)" },
    ],
  },
];

export default function ChecklistClient() {
  return (
    <GuideClient
      title="행사 준비 체크리스트"
      description="기획부터 마무리까지, 빠짐없이 준비하는 4단계 체크리스트"
    >
      <div className="space-y-8">
        {/* 안내 문구 */}
        <div className="rounded-lg border border-blue-100 bg-blue-50/60 px-4 py-3">
          <p className="text-sm leading-relaxed text-slate-600">
            아래 체크리스트는 행사 준비 전반을 위한 <span className="font-medium text-slate-800">참고용 가이드</span>입니다.
            파란컴퍼니의 서비스 범위는 행사 유형과 규모에 따라 달라지며, 상담을 통해 맞춤 안내해 드립니다.
          </p>
        </div>

        {stages.map((stage, si) => (
          <div
            key={si}
            className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm md:p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 md:text-lg">
                {stage.title}
              </h2>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                {stage.timing}
              </span>
            </div>
            <ul className="space-y-2.5">
              {stage.items.map((item, ii) => (
                <li key={ii} className="flex items-start gap-2.5">
                  <CheckSquare
                    size={16}
                    className="mt-0.5 shrink-0 text-blue-500/60"
                  />
                  <span className="text-sm leading-relaxed text-slate-700">
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* 행사 유형별 추가 체크포인트 */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm md:p-6">
          <h2 className="mb-4 text-base font-bold text-slate-900 md:text-lg">
            행사 유형별 추가 체크포인트
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="mb-1.5 text-sm font-semibold text-slate-800">세미나·컨퍼런스</h3>
              <p className="text-sm leading-relaxed text-slate-600">
                발표 자료 사전 취합 및 호환성 테스트, 동시통역 장비(국제 행사 시), 참석자 사전 등록 시스템 구축, 네임택·좌석 배치도 준비
              </p>
            </div>
            <div>
              <h3 className="mb-1.5 text-sm font-semibold text-slate-800">교육·연수</h3>
              <p className="text-sm leading-relaxed text-slate-600">
                교육 자료집 인쇄 및 제본, 실습 재료·장비 준비, 수료증 제작, 숙소·식사·차량 예약 (1박 이상 시)
              </p>
            </div>
            <div>
              <h3 className="mb-1.5 text-sm font-semibold text-slate-800">포럼·심포지엄</h3>
              <p className="text-sm leading-relaxed text-slate-600">
                패널 토론 좌석 배치, VIP 의전 동선, 보도자료 작성 및 언론 초대, 동시통역 수신기 배포
              </p>
            </div>
            <div>
              <h3 className="mb-1.5 text-sm font-semibold text-slate-800">전시·체험 행사</h3>
              <p className="text-sm leading-relaxed text-slate-600">
                전시 부스 설계·시공, 체험 프로그램 재료 수량 확인, 관람 동선 설계, 포토존·등신대 제작
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 내부 링크 배너 */}
      <div className="mt-12">
        <Link
          href="/company"
          className="group flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50/50 px-6 py-5 transition-all hover:border-blue-200 hover:bg-blue-50"
        >
          <div>
            <p className="text-[15px] font-semibold text-slate-800">파란컴퍼니는 어떤 회사인가요?</p>
            <p className="mt-1 text-[13px] text-slate-500">250+ 프로젝트, 재계약률 90%의 행사 전문 에이전시</p>
          </div>
          <span className="flex shrink-0 items-center gap-1 text-[14px] font-medium text-blue-600 transition-transform group-hover:translate-x-0.5">
            회사소개
            <ArrowRight className="h-4 w-4" />
          </span>
        </Link>
      </div>
    </GuideClient>
  );
}
