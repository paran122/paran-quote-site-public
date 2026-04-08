"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import { useState } from "react";

const steps: Array<{
  num: string;
  title: string;
  desc: string;
  isStrength: boolean;
  strengthMsg: string;
  clickLabel?: boolean;
}> = [
  {
    num: "01",
    title: "상담",
    desc: "행사 목적, 규모, 예산, 일정을\n파악하고 방향을 설정합니다.",
    isStrength: false,
    strengthMsg: "",
  },
  {
    num: "02",
    title: "기획",
    desc: "행사 컨셉, 프로그램, 연사 섭외 등\n맞춤 기획안과 견적서를 제출합니다.",
    isStrength: true,
    strengthMsg: "고객이 원하는 방향을 빠르게 파악하고, 행사 목적에 맞는 기획안을 제안합니다.",
  },
  {
    num: "03",
    title: "디자인·제작",
    desc: "포스터, 현수막, 명찰, 자료집 등\n시안물을 디자인하고 제작합니다.",
    isStrength: true,
    strengthMsg: "자체 디자인팀이 행사 컨셉에 맞는 시안물을 통일된 톤으로 빠르게 제작합니다.",
    clickLabel: true,
  },
  {
    num: "04",
    title: "현장 운영",
    desc: "리허설을 거쳐 당일 행사를 운영합니다.\n음향·조명·진행을 전담합니다.",
    isStrength: false,
    strengthMsg: "",
  },
  {
    num: "05",
    title: "결과보고",
    desc: "사진·영상, 참석자 통계, 만족도 조사\n결과보고서를 납품합니다.",
    isStrength: false,
    strengthMsg: "",
  },
];

/* click 라벨: 원 상단 테두리 중앙에 텍스트 */
function ClickLabel() {
  return (
    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-20 px-2 bg-slate-50 text-[9px] font-bold text-blue-500 tracking-widest">
      click
    </span>
  );
}

export default function ServiceProcess() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  return (
    <section className="bg-slate-50 py-16 md:py-24 px-5 md:px-8">
      <div className="mx-auto max-w-[1200px]">
        <h2 className="text-xl md:text-2xl font-bold text-center mb-14">
          진행 프로세스
        </h2>


        <div className="relative">
          {/* 연결 라인 (데스크톱) */}
          <div className="hidden md:block absolute top-[42px] left-[10%] right-[10%] h-px bg-blue-200" />

          {/* 모바일: 가로 컴팩트 */}
          <div className="flex md:hidden flex-col gap-3">
            {steps.map((s) => (
              <div key={s.num} className="flex items-center gap-3">
                <div className="relative shrink-0">
                  {s.isStrength && (
                    <Star className="absolute -top-1 -right-1 w-3 h-3 text-blue-500 fill-blue-500" />
                  )}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold font-num ${
                    s.isStrength ? "bg-blue-600 text-white" : "bg-white border-2 border-blue-200 text-blue-600"
                  }`}>
                    {s.num}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm">{s.title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed truncate">{s.desc.replace(/\n/g, " ")}</p>
                </div>
              </div>
            ))}
          </div>

          {/* 데스크톱: 기존 5열 */}
          <div className="hidden md:grid md:grid-cols-5 gap-4">
            {steps.map((s, i) => (
              <div
                key={s.num}
                className="relative text-center cursor-pointer group"
                onMouseEnter={() => setActiveIdx(i)}
                onMouseLeave={() => setActiveIdx(null)}
                onClick={() => setActiveIdx(activeIdx === i ? null : i)}
              >
                {s.isStrength && (
                  <div className="absolute -top-1 left-1/2 translate-x-2 z-20">
                    <Star className="w-4 h-4 text-blue-500 fill-blue-500" />
                  </div>
                )}

                <div
                  className={`relative z-10 mx-auto w-[84px] h-[84px] rounded-full flex flex-col items-center justify-center shadow-sm mb-5 transition-all duration-300 ${
                    activeIdx === i
                      ? "bg-blue-600 border-2 border-blue-600 scale-110 shadow-lg shadow-blue-200"
                      : s.isStrength
                        ? "bg-white border-2 border-blue-400 group-hover:border-blue-500 group-hover:shadow-md"
                        : "bg-white border-2 border-blue-200 group-hover:border-blue-300 group-hover:shadow-md"
                  }`}
                >
                  <span
                    className={`text-2xl font-extrabold font-num leading-none transition-colors duration-300 ${
                      activeIdx === i ? "text-white" : "text-blue-600"
                    }`}
                  >
                    {s.num}
                  </span>
                  {s.clickLabel && <ClickLabel />}
                </div>

                <h3
                  className={`font-bold text-sm mb-2 transition-colors duration-300 ${
                    activeIdx === i ? "text-blue-600" : ""
                  }`}
                >
                  {s.title}
                </h3>

                <div className="min-h-[48px]">
                  {activeIdx === i && s.isStrength && s.strengthMsg ? (
                    <p className="text-blue-600 text-xs leading-relaxed font-medium animate-[fadeIn_0.2s_ease-out]">
                      {s.strengthMsg}
                    </p>
                  ) : (
                    <p className="text-slate-500 text-xs leading-relaxed whitespace-pre-line">
                      {s.desc}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <Link
            href="/guide/process"
            className="text-sm text-blue-600 font-medium hover:underline"
          >
            상세 프로세스 보기 →
          </Link>
        </div>
      </div>
    </section>
  );
}
