"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Phone, MessageCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { BlurFade } from "@/components/ui/blur-fade";

/* ─── 내부 링크 헬퍼 ─── */
const A = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link href={href} className="text-blue-600 underline underline-offset-2 hover:text-blue-500">
    {children}
  </Link>
);

/* ─── FAQ 데이터 (JSX 답변 — 내부 링크 + 수치 강조) ─── */
interface FAQItem {
  question: string;
  answer: React.ReactNode;
}

interface FAQCategory {
  id: string;
  label: string;
  desc: string;
  items: FAQItem[];
}

const categories: FAQCategory[] = [
  {
    id: "service",
    label: "서비스",
    desc: "행사 종류, 규모, 서비스 범위",
    items: [
      {
        question: "파란컴퍼니는 어떤 회사인가요?",
        answer: (
          <>
            파란컴퍼니는 <strong className="text-slate-900">2015년 설립</strong>된 행사 기획·운영 전문 에이전시입니다. 세미나, 컨퍼런스, 포럼, 학술대회 등을 전문으로 하며, 기획부터 디자인·운영까지 원스톱 서비스를 제공합니다. 여성기업 인증 업체이며, 경기도 수원에 본사를 두고 전국 단위로 행사를 수행합니다.
          </>
        ),
      },
      {
        question: "어떤 종류의 행사를 전문으로 하나요?",
        answer: (
          <>
            세미나, 컨퍼런스, 포럼, 학술대회, 심포지엄, 워크숍, 기념식, 축제 등 다양한 형태의 행사를 기획·운영합니다. 특히 공공기관과 기업의 세미나·컨퍼런스 대행에 강점이 있으며, <strong className="text-slate-900">250건 이상</strong>의 <A href="/work">프로젝트 수행 경험</A>을 보유하고 있습니다.
          </>
        ),
      },
      {
        question: "소규모(30명) 행사도 가능한가요?",
        answer: (
          <>
            네, 가능합니다. <strong className="text-slate-900">30명 이하</strong>의 소규모 세미나부터 <strong className="text-slate-900">500명 이상</strong>의 대규모 컨퍼런스까지 규모에 관계없이 대응합니다. 소규모 행사에는 핵심 인력 중심의 효율적인 구성을 제안드리며, 예산에 맞춘 최적의 서비스를 제공합니다.
          </>
        ),
      },
      {
        question: "기획만 맡기거나 운영만 맡길 수 있나요?",
        answer: (
          <>
            네, 가능합니다. 기획만, 디자인만, 운영만 등 필요한 부분만 선택하여 의뢰하실 수 있습니다. 물론 기획부터 디자인·운영까지 원스톱으로 맡기시면 일관된 퀄리티와 효율적인 비용으로 진행할 수 있어 가장 추천드립니다.
          </>
        ),
      },
      {
        question: "디자인(포스터, 현수막)이나 영상 촬영도 해주나요?",
        answer: (
          <>
            네, 행사에 필요한 디자인과 촬영을 모두 지원합니다. 포스터, 현수막, 배너, 리플렛, 초청장, 명찰 등 인쇄물과 디지털 디자인을 자체 제작하며, 고객사 CI/BI에 맞춘 통일된 비주얼을 제공합니다. 현장 사진·영상 촬영, 하이라이트 영상 편집, 결과보고서용 기록 촬영도 가능합니다.
          </>
        ),
      },
    ],
  },
  {
    id: "cost",
    label: "비용·견적",
    desc: "가격, 견적 방법, 예산 조율",
    items: [
      {
        question: "세미나 대행 비용은 얼마인가요?",
        answer: (
          <>
            행사 규모, 형태, 서비스 범위에 따라 달라집니다. 소규모 세미나(30~50명)는 약 <strong className="text-slate-900">300만 원부터</strong>, 중규모 컨퍼런스(100~200명)는 약 <strong className="text-slate-900">800만 원부터</strong> 시작합니다. 정확한 견적은 행사 내용을 확인한 후 맞춤 산출해 드립니다.
          </>
        ),
      },
      {
        question: "견적은 어떻게 받나요?",
        answer: (
          <>
            홈페이지의 <A href="/build">견적 요청</A> 버튼을 통해 간단한 행사 정보를 입력하시면 <strong className="text-slate-900">1영업일 내</strong>에 맞춤 견적서를 보내드립니다. <a href="tel:02-6342-2800" className="text-blue-600 underline underline-offset-2 hover:text-blue-500">전화(02-6342-2800)</a> 또는 <a href="https://pf.kakao.com/_xkexdLG" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline underline-offset-2 hover:text-blue-500">카카오톡 상담</a>으로도 견적 문의가 가능합니다.
          </>
        ),
      },
      {
        question: "패키지와 개별 서비스의 차이는?",
        answer: (
          <>
            패키지는 기획·디자인·운영을 묶어 할인된 가격으로 제공하는 상품이며, 개별 서비스는 필요한 항목만 선택하는 방식입니다. 패키지 이용 시 약 <strong className="text-slate-900">10~20% 비용 절감</strong> 효과가 있고, 담당자 간 커뮤니케이션도 원활하여 대부분의 고객사에서 선호합니다.
          </>
        ),
      },
      {
        question: "예산이 제한적인데 조율 가능한가요?",
        answer: (
          <>
            네, 가능합니다. 예산 범위 내에서 최대 효과를 낼 수 있도록 우선순위에 따른 서비스 구성을 제안드립니다. 핵심 항목 중심으로 구성하거나, 일부 항목은 자체 진행하시도록 안내해 드리는 등 유연하게 조율합니다.
          </>
        ),
      },
      {
        question: "행사 규모에 따라 가격이 어떻게 달라지나요?",
        answer: (
          <>
            참석자 수, 행사 기간, 장소 규모, 필요 장비, 케이터링 여부 등에 따라 가격이 달라집니다. 일반적으로 참석자 수가 2배가 되더라도 비용이 2배로 늘지는 않으며, 규모가 클수록 단가 효율이 높아집니다.
          </>
        ),
      },
    ],
  },
  {
    id: "process",
    label: "진행절차",
    desc: "준비 기간, 진행 순서, 인력 구성",
    items: [
      {
        question: "행사 준비 기간은 최소 얼마나 필요한가요?",
        answer: (
          <>
            소규모 세미나는 최소 <strong className="text-slate-900">2~3주</strong>, 중대규모 컨퍼런스·포럼은 최소 <strong className="text-slate-900">4~6주</strong> 전에 의뢰해 주시는 것이 좋습니다. 시안물 디자인, 장소 섭외, 장비 준비 등을 고려하면 여유 있게 준비할수록 더 높은 퀄리티를 보장할 수 있습니다.
          </>
        ),
      },
      {
        question: "진행 절차가 어떻게 되나요?",
        answer: (
          <>
            상담 및 요구사항 파악 → 기획안·견적서 제출 → 계약 → 세부 기획·디자인 → 사전 리허설 → 행사 당일 운영 → 결과보고서 제출 순서로 진행됩니다. 각 단계별로 담당 매니저가 밀착 소통하며, 실시간 진행 상황을 공유합니다.
          </>
        ),
      },
      {
        question: "현장에 몇 명이 지원 나오나요?",
        answer: (
          <>
            행사 규모와 성격에 따라 <strong className="text-slate-900">2~10명</strong>의 전문 인력이 투입됩니다. 소규모 세미나는 PM 1명 + 운영 1~2명, 대규모 행사는 PM + 디자이너 + 음향·영상 + 운영 스태프로 구성됩니다. 필요 인력은 사전에 협의하여 확정합니다.
          </>
        ),
      },
      {
        question: "행사 후 결과보고서를 받을 수 있나요?",
        answer: (
          <>
            네, 모든 행사 완료 후 결과보고서를 제공합니다. 행사 개요, 진행 과정, 현장 사진·영상, 참석자 통계, 만족도 조사 결과 등을 포함하며, 공공기관의 경우 관내 보고 형식에 맞춰 작성해 드립니다.
          </>
        ),
      },
    ],
  },
  {
    id: "company",
    label: "실적·규모",
    desc: "회사 소개, 고객사, 수행 실적",
    items: [
      {
        question: "공공기관 행사 경험이 있나요?",
        answer: (
          <>
            네, 다수의 공공기관 행사를 수행한 경험이 있습니다. 교육부, 해군, 경기도교육청, 수원시, 한국문화예술교육진흥원 등 정부 부처 및 지자체, 공기업의 세미나·포럼·컨퍼런스를 진행했습니다. 공공조달 절차와 관내 보고 형식에 익숙하며, 관련 서류 작성도 지원합니다. <A href="/work">수행 실적 보기</A>
          </>
        ),
      },
      {
        question: "지금까지 몇 건의 행사를 수행했나요?",
        answer: (
          <>
            2015년 설립 이후 <strong className="text-slate-900">250건 이상</strong>의 행사를 성공적으로 수행했습니다. 연간 <strong className="text-slate-900">100회 이상</strong>의 행사를 운영하고 있으며, 고객 재계약률 <strong className="text-slate-900">90%</strong>가 저희의 자부심입니다.
          </>
        ),
      },
      {
        question: "어떤 고객사와 일하나요?",
        answer: (
          <>
            <strong className="text-slate-900">50개 이상</strong>의 기관·기업과 협업하고 있습니다. 공공기관(교육부, 해군, 경기도교육청, 수원시 등), 공기업, 대학교, 협회·학회, 민간기업 등 다양한 분야의 고객사가 있으며, 업종별 행사 특성을 이해하고 있어 맞춤형 기획이 가능합니다. <A href="/work">포트폴리오에서 확인하기</A>
          </>
        ),
      },
      {
        question: "전국 어디서든 행사 진행이 가능한가요?",
        answer: (
          <>
            네, 가능합니다. 경기도 수원에 본사를 두고 있지만 서울, 경기, 경남, 전남, 충남 등 <strong className="text-slate-900">전국 단위</strong>로 행사를 수행합니다. <strong className="text-slate-900">40개 이상</strong>의 협력사 네트워크를 통해 지역에 관계없이 동일한 수준의 서비스를 제공합니다.
          </>
        ),
      },
      {
        question: "온라인·하이브리드 행사도 운영하나요?",
        answer: (
          <>
            네, YouTube·Zoom 등을 활용한 온라인 생중계와 오프라인 현장을 결합한 <strong className="text-slate-900">하이브리드 행사</strong>를 운영합니다. 코로나 이후 축적한 노하우로 안정적인 송출 환경을 구축하며, 참가자 만족도 <strong className="text-slate-900">93점</strong>(100점 만점)의 높은 평가를 받고 있습니다.
          </>
        ),
      },
      {
        question: "연사·강사 섭외도 해주나요?",
        answer: (
          <>
            네, <strong className="text-slate-900">80명 이상</strong>의 연사·강사 풀을 보유하고 있어 행사 주제와 대상에 맞는 최적의 강사를 섭외해 드립니다. 학계, 산업계, 공공 분야 등 다양한 분야의 전문가와 협업한 경험이 있으며, 강연료 협상과 일정 조율까지 원스톱으로 지원합니다.
          </>
        ),
      },
    ],
  },
];

const totalQuestions = categories.reduce((sum, c) => sum + c.items.length, 0);

export { categories };

export default function FAQClient() {
  const [activeTab, setActiveTab] = useState("service");
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const activeCategory = categories.find((c) => c.id === activeTab)!;

  const toggleItem = (question: string) => {
    setOpenItems((prev) => {
      if (prev.has(question)) {
        return new Set<string>();
      }
      return new Set([question]);
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-[56px]">
      {/* Hero — BlurFade (포트폴리오와 통일) */}
      <section className="py-16 text-center md:py-20">
        <BlurFade>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl lg:text-5xl">
            자주 묻는 질문
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-slate-500 md:text-base">
            파란컴퍼니의 행사 대행 서비스에 대해 궁금한 점을 확인하세요
          </p>
        </BlurFade>
        <BlurFade delay={0.1}>
          <p className="mt-5 text-xs text-slate-400">
            {categories.map((c) => c.label).join(" · ")} — {totalQuestions}개의 답변
          </p>
        </BlurFade>
      </section>

      {/* Tabs + Content */}
      <BlurFade delay={0.2}>
      <section className="mx-auto max-w-3xl px-4 pb-20 pt-10 md:px-6">
        {/* Tab Buttons */}
        <div className="border-b border-slate-200">
          <div className="flex gap-2 overflow-x-auto pb-px md:gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={cn(
                  "relative shrink-0 px-4 py-2.5 text-sm font-medium transition-colors md:text-base",
                  activeTab === cat.id
                    ? "text-slate-900"
                    : "text-slate-400 hover:text-slate-600"
                )}
              >
                {cat.label}
                {activeTab === cat.id && (
                  <motion.div
                    layoutId="faq-tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 카테고리 설명 */}
        <AnimatePresence mode="wait">
          <motion.p
            key={activeTab + "-desc"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="mt-4 text-xs text-slate-400"
          >
            {activeCategory.desc}
          </motion.p>
        </AnimatePresence>

        {/* Accordion */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            id={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="mt-4 space-y-3"
          >
            {activeCategory.items.map((item, idx) => {
              const isOpen = openItems.has(item.question);
              return (
                <motion.div
                  key={item.question}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: idx * 0.05 }}
                  className="rounded-xl border border-slate-200/80 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-all duration-200 hover:border-slate-300 hover:shadow-md"
                >
                  <button
                    onClick={() => toggleItem(item.question)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left md:px-6"
                  >
                    <span className="text-[15px] font-medium text-slate-900 md:text-base">
                      {item.question}
                    </span>
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="shrink-0 text-blue-600"
                    >
                      <Plus size={18} />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-slate-100 px-5 pb-5 pt-4 md:px-6">
                          <div className="border-l-2 border-blue-500/40 pl-4">
                            <p className="text-[14px] leading-relaxed text-slate-700">
                              {item.answer}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </section>
      </BlurFade>

      {/* CTA */}
      <BlurFade delay={0.1}>
      <section className="py-16 text-center md:py-20">
        <h2 className="text-xl font-bold text-slate-900 md:text-2xl">
          더 궁금한 점이 있으신가요?
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-slate-500">
          전화, 카카오톡, 또는 홈페이지를 통해 편하게 문의해 주세요.
          1영업일 내에 답변드립니다.
        </p>
        <div className="mx-auto mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <a
            href="/#contact"
            className="inline-flex items-center rounded-lg bg-blue-600 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
          >
            문의하기
          </a>
          <a
            href="tel:02-6342-2800"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
          >
            <Phone size={15} />
            02-6342-2800
          </a>
          <a
            href="https://pf.kakao.com/_xkexdLG"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
          >
            <MessageCircle size={15} />
            카카오톡 상담
          </a>
        </div>
      </section>
      </BlurFade>
    </div>
  );
}
