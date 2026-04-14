"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { BlurFade } from "@/components/ui/blur-fade";

const steps = [
  { num: "01", title: "기획 및 전략 수립", desc: "행사 목표·대상 설정\n장소·일정 계획\n프로그램 설계" },
  { num: "02", title: "준비 및 실행계획", desc: "연사·공연자 섭외\n장소 예약, 행사 자료·공간 준비\n참가자 모집, 홍보" },
  { num: "03", title: "운영 및 진행", desc: "현장 운영 인력 배치\n참가자 등록~행사 진행\n피드백 수집 체계적 관리" },
  { num: "04", title: "평가 및 개선", desc: "행사 성과 평가\n참가자 피드백 수집·분석\n개선 방안 도출" },
  { num: "05", title: "후속 관리", desc: "행사 자료 공유\n참가자 네트워크 구축\n결과 보고서 작성" },
];

export default function Process() {
  return (
    <section id="process" className="relative overflow-hidden bg-gray-950 px-4 py-10 md:px-12 md:py-24 lg:px-20">
      <style>{`
        @keyframes border-sweep { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes aurora { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        @keyframes glow-trail {
          0% { left: 6%; opacity: 0; }
          5% { opacity: 1; }
          90% { opacity: 1; }
          100% { left: 90%; opacity: 0; }
        }
        @keyframes glow-trail-m {
          0% { left: 10%; opacity: 0; }
          5% { opacity: 1; }
          90% { opacity: 1; }
          100% { left: 85%; opacity: 0; }
        }
      `}</style>
      <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 50% 50%, rgba(59,130,246,0.08), transparent 60%)" }} />

      <div className="relative mx-auto max-w-6xl">
        <BlurFade delay={0.1}>
          <div className="mb-1 text-center font-[var(--font-inter)] text-xs font-extrabold tracking-[0.25em] text-blue-400/80 md:text-base">PROCESS</div>
          <div className="mx-auto mb-2 h-[2px] w-8 rounded-full bg-blue-400/40 md:mb-4 md:w-10" />
          <h2 className="mb-2 text-center text-xl font-bold text-white md:mb-4 md:text-5xl">서비스 진행 프로세스</h2>
          <p className="mx-auto mb-6 max-w-lg text-center text-xs text-white/50 md:mb-14 md:text-base">체계적인 5단계 프로세스로 성공적인 행사를 만듭니다</p>
        </BlurFade>

        {/* Desktop — 5열 1줄 */}
        <div className="hidden lg:block">
          <div className="relative grid grid-cols-5 gap-5">
            <div className="pointer-events-none absolute left-[10%] right-[10%] top-[24px] z-0 h-1.5 rounded-full bg-white/5" />
            <motion.div
              className="pointer-events-none absolute left-[10%] top-[24px] z-0 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
              initial={{ width: 0 }}
              whileInView={{ width: "80%" }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 1.5, ease: "easeOut" }}
              style={{ boxShadow: "0 0 12px rgba(59,130,246,0.4)" }}
            />
            <div
              className="pointer-events-none absolute top-[16px] z-[1] h-5 w-20 rounded-full"
              style={{
                background: "radial-gradient(ellipse, rgba(59,130,246,0.9), rgba(139,92,246,0.4) 40%, transparent 70%)",
                animation: "glow-trail 3s ease-in-out infinite",
                filter: "blur(6px)",
              }}
            />

            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="flex flex-col items-center"
              >
                <motion.div
                  className="relative z-10 mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-sm font-bold text-white"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.4 + 0.3, duration: 0.4, type: "spring" }}
                  style={{ boxShadow: "0 0 20px rgba(59,130,246,0.4)" }}
                >
                  {step.num}
                </motion.div>

                <div className="relative w-full flex-1 overflow-hidden rounded-xl p-px">
                  <div
                    className="absolute inset-[-50%] z-0"
                    style={{
                      background: "conic-gradient(from 0deg, transparent 10%, rgba(59,130,246,0.9), rgba(139,92,246,0.6), transparent 50%)",
                      animation: `border-sweep ${3 + i * 0.3}s linear infinite`,
                    }}
                  />
                  <div className="relative z-10 h-full overflow-hidden rounded-[11px] bg-[#091041]">
                    <div
                      className="pointer-events-none absolute inset-0 opacity-[0.18]"
                      style={{
                        background: "linear-gradient(135deg, rgba(59,130,246,0.8), rgba(139,92,246,0.6), rgba(6,182,212,0.6), rgba(59,130,246,0.8))",
                        backgroundSize: "300% 300%",
                        animation: `aurora ${6 + i}s ease-in-out infinite`,
                        animationDelay: `${i * -1}s`,
                      }}
                    />
                    <div className="relative px-4 py-5 text-center">
                      <h3 className="mb-2 text-[13px] font-bold text-blue-300">{step.title}</h3>
                      <p className="whitespace-pre-line text-xs leading-relaxed text-gray-400">{step.desc}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile — 3+2 두 줄, PC 효과 그대로 */}
        <div className="space-y-4 lg:hidden">
          {[steps.slice(0, 3), steps.slice(3)].map((row, rowIdx) => (
            <div key={rowIdx} className={`relative grid gap-2 ${row.length === 3 ? "grid-cols-3" : "grid-cols-2 mx-auto max-w-[67%]"}`}>
              {/* 프로그레스 바 */}
              <div className="pointer-events-none absolute left-[15%] right-[15%] top-[14px] z-0 h-1 rounded-full bg-white/5" />
              <motion.div
                className="pointer-events-none absolute left-[15%] top-[14px] z-0 h-1 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                initial={{ width: 0 }}
                whileInView={{ width: "70%" }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + rowIdx * 0.5, duration: 1, ease: "easeOut" }}
                style={{ boxShadow: "0 0 8px rgba(59,130,246,0.4)" }}
              />
              <div
                className="pointer-events-none absolute top-[10px] z-[1] h-3 w-10 rounded-full"
                style={{
                  background: "radial-gradient(ellipse, rgba(59,130,246,0.9), rgba(139,92,246,0.4) 40%, transparent 70%)",
                  animation: "glow-trail-m 3s ease-in-out infinite",
                  animationDelay: `${rowIdx * 1.5}s`,
                  filter: "blur(4px)",
                }}
              />

              {row.map((step, i) => {
                const globalIdx = rowIdx * 3 + i;
                return (
                  <motion.div
                    key={step.num}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: globalIdx * 0.1, duration: 0.4 }}
                    className="flex flex-col items-center"
                  >
                    <motion.div
                      className="relative z-10 mb-2 flex h-7 w-7 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: globalIdx * 0.2 + 0.2, duration: 0.3, type: "spring" }}
                      style={{ boxShadow: "0 0 12px rgba(59,130,246,0.4)" }}
                    >
                      {step.num}
                    </motion.div>

                    <div className="relative w-full flex-1 overflow-hidden rounded-lg p-px">
                      <div
                        className="absolute inset-[-50%] z-0"
                        style={{
                          background: "conic-gradient(from 0deg, transparent 10%, rgba(59,130,246,0.9), rgba(139,92,246,0.6), transparent 50%)",
                          animation: `border-sweep ${3 + globalIdx * 0.3}s linear infinite`,
                        }}
                      />
                      <div className="relative z-10 h-full overflow-hidden rounded-[7px] bg-[#091041]">
                        <div
                          className="pointer-events-none absolute inset-0 opacity-[0.18]"
                          style={{
                            background: "linear-gradient(135deg, rgba(59,130,246,0.8), rgba(139,92,246,0.6), rgba(6,182,212,0.6), rgba(59,130,246,0.8))",
                            backgroundSize: "300% 300%",
                            animation: `aurora ${6 + globalIdx}s ease-in-out infinite`,
                            animationDelay: `${globalIdx * -1}s`,
                          }}
                        />
                        <div className="relative px-1.5 py-2 text-center">
                          <h3 className="mb-0.5 text-[9px] font-bold leading-tight text-blue-300">{step.title}</h3>
                          <p className="whitespace-pre-line text-[7px] leading-[1.4] text-gray-400">{step.desc}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ))}
        </div>

        {/* 가이드 링크 */}
        <BlurFade delay={0.3}>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-[10px] text-white/35 md:mt-12 md:text-xs">
            <span className="text-[10px] text-white/50 md:text-xs">자세히 알아보기</span>
            <Link href="/guide/process" className="inline-flex items-center gap-0.5 transition-colors hover:text-blue-400">
              진행 절차 <ArrowRight size={10} />
            </Link>
            <Link href="/guide/checklist" className="inline-flex items-center gap-0.5 transition-colors hover:text-blue-400">
              준비 체크리스트 <ArrowRight size={10} />
            </Link>
            <Link href="/guide/pricing" className="inline-flex items-center gap-0.5 transition-colors hover:text-blue-400">
              비용 가이드 <ArrowRight size={10} />
            </Link>
          </div>
        </BlurFade>
      </div>
    </section>
  );
}
