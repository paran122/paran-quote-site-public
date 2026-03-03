"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BlurFade } from "@/components/ui/blur-fade";
import { CalendarCheck, Palette, Video, Check, ChevronDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const services: {
  id: string;
  num: string;
  title: string;
  tag: string;
  desc: string;
  icon: LucideIcon;
  details: string[];
  headerGradient: string;
  tagColor: string;
  iconColor: string;
  checkColor: string;
  checkBg: string;
  btnColor: string;
}[] = [
  {
    id: "event",
    num: "01",
    title: "행사 기획·운영",
    tag: "핵심",
    desc: "대규모 세미나·컨퍼런스·포럼·런칭행사·축제 등 행사의 기획부터 현장 운영까지 원스톱 수행",
    icon: CalendarCheck,
    headerGradient: "bg-[#dbeafe]",
    tagColor: "text-blue-700 bg-blue-500/10",
    iconColor: "text-blue-500",
    checkColor: "text-blue-500",
    checkBg: "bg-blue-100",
    btnColor: "border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white",
    details: [
      "세미나·컨퍼런스 운영",
      "포럼 운영 (통역·하이브리드 포함)",
      "런칭행사 기획·운영",
      "축제·페스티벌 종합 운영",
      "교육·연수 프로그램",
      "참가자 관리 시스템",
      "연사·강사 매칭 (80+명 풀)",
      "결과보고서 작성",
    ],
  },
  {
    id: "design",
    num: "02",
    title: "공간 디자인",
    tag: "디자인",
    desc: "행사 공간의 시각적 완성도를 높이는 디자인·제작 서비스",
    icon: Palette,
    headerGradient: "bg-[#e8def8]",
    tagColor: "text-purple-700 bg-purple-500/10",
    iconColor: "text-purple-500",
    checkColor: "text-purple-500",
    checkBg: "bg-purple-100",
    btnColor: "border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white",
    details: [
      "로비·입구 연출",
      "조형물 제작·설치",
      "체험부스·포토존",
      "키비주얼·사이니지",
      "무대·배경 디자인",
      "현수막·배너 제작",
    ],
  },
  {
    id: "content",
    num: "03",
    title: "콘텐츠 제작",
    tag: "미디어",
    desc: "홍보·보고 영상, SNS 콘텐츠(카드뉴스·숏폼·웹툰) 등 다양한 미디어 콘텐츠를 기획·제작합니다",
    icon: Video,
    headerGradient: "bg-[#d9f2d0]",
    tagColor: "text-green-700 bg-green-500/10",
    iconColor: "text-green-500",
    checkColor: "text-green-500",
    checkBg: "bg-green-100",
    btnColor: "border-green-500 text-green-500 hover:bg-green-500 hover:text-white",
    details: [
      "홍보·보고 영상 촬영·편집",
      "SNS 콘텐츠 (카드뉴스, 숏폼, 웹툰)",
      "온라인 교육 콘텐츠 (e-러닝)",
      "실시간 중계 (YouTube·Zoom)",
    ],
  },
];

function ServiceCardMobile({ service, i }: { service: typeof services[0]; i: number }) {
  const [open, setOpen] = useState(false);
  const Icon = service.icon;

  return (
    <BlurFade delay={0.15 + i * 0.08}>
      <div className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm">
        <button
          onClick={() => setOpen((o) => !o)}
          className={`flex w-full flex-col items-center justify-center ${service.headerGradient} px-2 py-5 text-center`}
        >
          <div className="mb-1.5 flex h-6 w-6 items-center justify-center rounded-md bg-white/60">
            <Icon className={`h-3 w-3 ${service.iconColor}`} strokeWidth={1.5} />
          </div>
          <h3 className="text-[10px] font-bold leading-tight text-gray-900">{service.title}</h3>
          <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="mt-1">
            <ChevronDown className="h-3 w-3 text-gray-400" />
          </motion.span>
        </button>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ul className="space-y-0.5 px-2 py-1.5 border-t border-gray-100">
                {service.details.map((detail) => (
                  <li key={detail} className="flex items-start gap-1">
                    <div className={`mt-0.5 flex h-3 w-3 shrink-0 items-center justify-center rounded-full ${service.checkBg}`}>
                      <Check className={`h-1.5 w-1.5 ${service.checkColor}`} strokeWidth={3} />
                    </div>
                    <span className="text-[8px] leading-tight text-gray-500">{detail}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </BlurFade>
  );
}

export default function Services() {
  return (
    <section id="services" className="relative bg-gray-100 px-4 py-10 md:px-12 md:py-24 lg:px-20">
      <div className="mx-auto max-w-6xl">
        <BlurFade delay={0.1}>
          <div className="mb-1 text-center font-[var(--font-inter)] text-xs font-extrabold tracking-[0.25em] text-blue-500/80 md:text-base">SERVICES</div>
          <div className="mx-auto mb-2 h-[2px] w-8 rounded-full bg-blue-400 md:mb-4 md:w-10" />
          <h2 className="mb-2 text-center text-xl font-bold text-gray-900 md:mb-4 md:text-5xl">
            사업 영역
          </h2>
          <p className="mx-auto mb-5 max-w-lg text-center text-xs text-gray-400 md:mb-14 md:text-base">
            핵심 3대 영역 전문인력으로 원스톱 서비스를 제공합니다
          </p>
        </BlurFade>

        {/* Mobile — 3열 아코디언 */}
        <div className="grid grid-cols-3 gap-1.5 md:hidden">
          {services.map((service, i) => (
            <ServiceCardMobile key={service.id} service={service} i={i} />
          ))}
        </div>

        {/* Desktop — 기존 3열 카드 */}
        <div className="hidden md:grid items-stretch gap-6 md:grid-cols-3">
          {services.map((service, i) => {
            const Icon = service.icon;
            return (
              <BlurFade key={service.id} delay={0.2 + i * 0.1} className="h-full">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg shadow-gray-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className={`${service.headerGradient} px-7 pb-5 pt-6`}>
                    <div className="mb-3 flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/60">
                        <Icon className={`h-5 w-5 ${service.iconColor}`} strokeWidth={1.5} />
                      </div>
                      <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${service.tagColor}`}>
                        {service.tag}
                      </span>
                    </div>
                    <h3 className="mb-1.5 text-xl font-bold text-gray-900">{service.title}</h3>
                    <p className="text-sm leading-relaxed text-gray-500">{service.desc}</p>
                  </div>
                  <div className="flex flex-1 flex-col px-7 pb-6 pt-4">
                    <ul className="flex-1 space-y-2.5">
                      {service.details.map((detail) => (
                        <li key={detail} className="flex items-center gap-3">
                          <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${service.checkBg}`}>
                            <Check className={`h-3 w-3 ${service.checkColor}`} strokeWidth={3} />
                          </div>
                          <span className="text-sm text-gray-500">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </BlurFade>
            );
          })}
        </div>
      </div>
    </section>
  );
}
