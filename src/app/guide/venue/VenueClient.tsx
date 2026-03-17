"use client";

import GuideClient from "../GuideClient";
import { MapPin } from "lucide-react";

interface VenueType {
  title: string;
  capacity: string;
  costLevel: string;
  pros: string[];
  cons: string[];
  bestFor: string;
}

const venueTypes: VenueType[] = [
  {
    title: "호텔 연회장·그랜드볼룸",
    capacity: "100 ~ 500명",
    costLevel: "비용 높음",
    pros: [
      "고급스러운 분위기, 음향·조명 시설 완비",
      "케이터링·주차 등 부대시설 일괄 제공",
      "VIP 의전에 적합한 별도 대기실",
    ],
    cons: [
      "비용이 비교적 높음",
      "외부 장비 반입 제한이 있을 수 있음",
      "주말·성수기 예약 경쟁 치열",
    ],
    bestFor: "컨퍼런스, 포럼, 기념식, VIP 행사",
  },
  {
    title: "컨벤션센터·전시관",
    capacity: "200 ~ 1,000명 이상",
    costLevel: "비용 높음",
    pros: [
      "대규모 행사에 적합한 넓은 공간",
      "전시 부스 설치 등 자유로운 공간 활용",
      "음향·영상 장비 기본 제공 (시설에 따라 다름)",
    ],
    cons: [
      "독립적인 분위기 연출이 어려울 수 있음",
      "케이터링 별도 수배 필요",
      "교통 접근성 확인 필요",
    ],
    bestFor: "대규모 컨퍼런스, 전시·체험 행사, 학술대회",
  },
  {
    title: "대학교·공공기관 강당",
    capacity: "50 ~ 300명",
    costLevel: "비용 낮음",
    pros: [
      "비용이 저렴하거나 무료인 경우가 많음",
      "프로젝터·마이크 등 기본 장비 구비",
      "교육·학술 행사의 공신력 확보",
    ],
    cons: [
      "공간 연출에 제한이 있을 수 있음",
      "주차 공간 부족할 수 있음",
      "대관 절차가 복잡할 수 있음 (공공기관)",
    ],
    bestFor: "세미나, 교육, 워크숍, 학술 행사",
  },
  {
    title: "연수원·리조트",
    capacity: "30 ~ 200명",
    costLevel: "비용 보통",
    pros: [
      "숙박+교육 일체형 운영 가능",
      "외부 방해 없는 집중 환경",
      "팀빌딩·레크리에이션 연계 용이",
    ],
    cons: [
      "도심에서 먼 경우가 많아 교통 수배 필요",
      "음향·영상 장비 추가 반입 필요할 수 있음",
      "식사 메뉴 선택이 제한적",
    ],
    bestFor: "1박 2일 교육·연수, 워크숍, 캠프",
  },
  {
    title: "카페·세미나룸·공유 공간",
    capacity: "10 ~ 50명",
    costLevel: "비용 낮음",
    pros: [
      "소규모 행사에 적합한 아담한 공간",
      "비용이 저렴하고 예약이 간편",
      "음료·다과 포함 가능",
    ],
    cons: [
      "음향·영상 장비 부족할 수 있음",
      "주차 공간 제한",
      "브랜딩·공간 연출에 제한",
    ],
    bestFor: "소규모 세미나, 간담회, 내부 워크숍",
  },
];

const checkpoints = [
  { title: "수용 인원", desc: "예상 참석자 수의 120%를 기준으로 장소를 선택하세요. 여유 공간이 있어야 등록 데스크, 포토존, 다과 테이블 등을 배치할 수 있습니다." },
  { title: "교통 접근성", desc: "대중교통 접근성이 좋은 장소가 참석률을 높입니다. 주차 공간이 부족하면 사전에 주변 주차장 정보를 안내하거나 셔틀버스를 운행하세요." },
  { title: "기자재·장비", desc: "프로젝터, 스크린, 마이크, 스피커 등 기본 장비가 갖춰져 있는지 확인하세요. 부족한 장비는 외부 임차가 필요하며 추가 비용이 발생합니다." },
  { title: "인터넷·전기 용량", desc: "온라인 생중계나 전자 등록 시스템을 사용한다면 안정적인 유선 인터넷과 충분한 전기 용량(콘센트 위치 포함)을 반드시 확인하세요." },
  { title: "세팅·철거 시간", desc: "행사 전날 또는 당일 오전에 세팅할 수 있는지 확인하세요. 현수막·배너 설치, 음향 테스트 등에 최소 2~3시간이 필요합니다." },
  { title: "식사·다과", desc: "행사장 내 케이터링이 가능한지, 외부 음식 반입이 허용되는지 확인하세요. 인근 식당 정보도 사전에 파악해 두면 좋습니다." },
];

export default function VenueClient() {
  return (
    <GuideClient
      title="행사 장소 선택 가이드"
      description="행사 유형과 규모에 맞는 최적의 장소를 선택하는 방법"
    >
      <div className="space-y-8">
        <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-4">
          <p className="text-sm leading-relaxed text-slate-500">
            아래 비용 등급은 장소 유형 간 상대적 비교를 위한 참고 정보입니다.
            정확한 대관료는 장소·시기·이용 조건에 따라 달라지며, 상담 시 안내해 드립니다.
          </p>
        </div>
        {/* 장소 유형별 */}
        {venueTypes.map((venue, vi) => (
          <div
            key={vi}
            className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm md:p-6"
          >
            <div className="mb-3 flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-blue-500" />
                <h2 className="text-base font-bold text-slate-900 md:text-lg">
                  {venue.title}
                </h2>
              </div>
              <span className="shrink-0 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                {venue.capacity}
              </span>
            </div>
            <p className="mb-3 text-sm text-slate-500">
              대관료: <span className="font-medium text-slate-700">{venue.costLevel}</span>
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="mb-1.5 text-xs font-semibold text-green-700">장점</p>
                <ul className="space-y-1">
                  {venue.pros.map((p, pi) => (
                    <li key={pi} className="flex items-start gap-1.5 text-sm text-slate-600">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green-400" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-1.5 text-xs font-semibold text-amber-700">유의사항</p>
                <ul className="space-y-1">
                  {venue.cons.map((c, ci) => (
                    <li key={ci} className="flex items-start gap-1.5 text-sm text-slate-600">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="mt-3 rounded-md bg-slate-50 px-3 py-2 text-xs text-slate-500">
              <span className="font-medium text-slate-700">추천 행사:</span> {venue.bestFor}
            </p>
          </div>
        ))}

        {/* 장소 선택 체크포인트 */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm md:p-6">
          <h2 className="mb-4 text-base font-bold text-slate-900 md:text-lg">
            장소 선택 시 체크포인트
          </h2>
          <div className="space-y-3">
            {checkpoints.map((cp, ci) => (
              <div key={ci}>
                <h3 className="text-sm font-semibold text-slate-800">{cp.title}</h3>
                <p className="mt-0.5 text-sm leading-relaxed text-slate-600">{cp.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </GuideClient>
  );
}
