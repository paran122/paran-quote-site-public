"use client";

import { useState } from "react";
import { Plus, Phone, MessageCircle, ArrowRight, CalendarCheck, Calculator, ClipboardList, Trophy, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { BlurFade } from "@/components/ui/blur-fade";

/* ─── 내부 링크 헬퍼 ─── */
const A = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link href={href} className="text-blue-600 underline underline-offset-2 hover:text-blue-500">
    {children}
  </Link>
);

/* ─── FAQ 데이터 ─── */
interface FAQItem {
  question: string;
  answer: React.ReactNode;
}

interface FAQCategory {
  id: string;
  label: string;
  desc: string;
  icon: LucideIcon;
  items: FAQItem[];
}

const categories: FAQCategory[] = [
  {
    id: "service",
    label: "서비스",
    desc: "행사 종류, 규모, 서비스 범위",
    icon: CalendarCheck,
    items: [
      {
        question: "파란컴퍼니는 어떤 회사인가요?",
        answer: (
          <>
            파란컴퍼니는 <strong className="text-slate-900">2015년 설립</strong>된 행사 기획·운영 전문 에이전시입니다. 세미나, 컨퍼런스, 포럼, 학술대회, 워크숍 등 공공·기업 행사를 전문으로 하며, 기획 단계부터 디자인·시안물 제작·현장 운영·결과보고서까지 원스톱으로 제공합니다. 여성기업 인증 업체이며, 경기도 수원에 본사를 두고 서울·경기를 포함한 전국 단위로 행사를 수행합니다. 경기도교육청, 해군, 한국문화예술교육진흥원, 자동차부품산업진흥재단 등 다양한 공공기관·기업과 지속적으로 협업하고 있습니다.
          </>
        ),
      },
      {
        question: "어떤 종류의 행사를 전문으로 하나요?",
        answer: (
          <>
            세미나, 컨퍼런스, 포럼, 학술대회, 심포지엄, 워크숍, 기념식, 런칭 행사, 결과공유회, 체험형 캠프 등 다양한 형태의 행사를 기획·운영합니다. 특히 공공기관과 기업의 세미나·컨퍼런스 대행에 강점이 있으며, <strong className="text-slate-900">250건 이상</strong>의 <A href="/work">프로젝트 수행 경험</A>을 보유하고 있습니다.
          </>
        ),
      },
      {
        question: "소규모(30명) 행사도 가능한가요?",
        answer: (
          <>
            네, 가능합니다. <strong className="text-slate-900">30명 이하</strong>의 소규모 세미나부터 <strong className="text-slate-900">500명 이상</strong>의 대규모 컨퍼런스까지 규모에 관계없이 대응합니다. 소규모 행사의 경우 PM 1명과 운영 스태프 1~2명의 핵심 인력 중심으로 효율적인 구성을 제안드립니다.
          </>
        ),
      },
      {
        question: "기획만 맡기거나 운영만 맡길 수 있나요?",
        answer: (
          <>
            네, 가능합니다. 기획만, 디자인만, 운영만, 또는 시안물 제작만 등 필요한 부분만 선택하여 의뢰하실 수 있습니다. 물론 기획부터 디자인·시안물 제작·현장 운영까지 원스톱으로 맡기시면 전체 행사의 톤앤매너가 일관되고 가장 효율적입니다.
          </>
        ),
      },
      {
        question: "디자인(포스터, 현수막)이나 영상 촬영도 해주나요?",
        answer: (
          <>
            네, 행사에 필요한 모든 디자인과 촬영을 자체 역량으로 수행합니다. 포스터, 현수막, 엑스배너, 리플렛, 초청장, 명찰, 자료집 등 인쇄물은 물론 카드뉴스, 웹배너, SNS 콘텐츠 등 디지털 디자인까지 제작합니다.
          </>
        ),
      },
    ],
  },
  {
    id: "cost",
    label: "비용·견적",
    desc: "가격, 견적 방법, 예산 조율",
    icon: Calculator,
    items: [
      {
        question: "세미나 대행 비용은 얼마인가요?",
        answer: (
          <>
            행사 규모, 형태, 서비스 범위에 따라 달라집니다. 소규모 세미나(30~50명)는 약 <strong className="text-slate-900">800만 원부터</strong>, 중규모 컨퍼런스(100~200명)는 약 <strong className="text-slate-900">2,500만 원부터</strong> 시작합니다. 정확한 견적은 행사 내용을 확인한 후 항목별로 투명하게 산출해 드립니다.
          </>
        ),
      },
      {
        question: "견적은 어떻게 받나요?",
        answer: (
          <>
            세 가지 방법으로 견적을 받으실 수 있습니다. 홈페이지 하단의 견적 요청 폼, <a href="tel:02-6342-2800" className="text-blue-600 underline underline-offset-2 hover:text-blue-500">전화(02-6342-2800)</a>, 또는 <a href="https://pf.kakao.com/_xkexdLG" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline underline-offset-2 hover:text-blue-500">카카오톡 상담</a>을 통해 문의하시면 <strong className="text-slate-900">1영업일 내</strong>에 항목별 맞춤 견적서를 보내드립니다.
          </>
        ),
      },
      {
        question: "예산이 제한적인데 조율 가능한가요?",
        answer: (
          <>
            네, 충분히 가능합니다. 견적서를 <strong className="text-slate-900">항목별 엑셀 파일</strong>로 드리기 때문에, 필요한 항목만 선택해 과업을 맡기시면 그 부분만 대행할 수 있습니다. 예산 범위를 알려주시면 우선순위에 맞는 구성도 함께 제안드립니다.
          </>
        ),
      },
      {
        question: "행사 규모에 따라 가격이 어떻게 달라지나요?",
        answer: (
          <>
            주요 변동 요소는 참석자 수, 행사 기간, 장소 규모, 필요 장비, 케이터링 여부, 시안물 종류와 수량입니다. 일반적으로 참석자 수가 2배가 되더라도 기획비나 디자인비는 동일하므로 전체 비용이 2배로 늘지 않으며, 규모가 클수록 인당 단가는 낮아지는 구조입니다.
          </>
        ),
      },
    ],
  },
  {
    id: "process",
    label: "진행절차",
    desc: "준비 기간, 진행 순서, 인력 구성",
    icon: ClipboardList,
    items: [
      {
        question: "행사 준비 기간은 최소 얼마나 필요한가요?",
        answer: (
          <>
            소규모 세미나(50명 이하)는 최소 <strong className="text-slate-900">2~3주</strong>, 100명 이상 컨퍼런스·포럼은 최소 <strong className="text-slate-900">6~8주</strong>, 300명 이상 대규모 행사는 최소 <strong className="text-slate-900">10~12주</strong> 전에 의뢰해 주시는 것이 좋습니다. 급하게 진행해야 하는 경우에도 최소 1주 이상이면 핵심 서비스 중심으로 대응 가능합니다.
          </>
        ),
      },
      {
        question: "진행 절차가 어떻게 되나요?",
        answer: (
          <>
            총 7단계로 진행됩니다. <strong className="text-slate-900">상담</strong> → <strong className="text-slate-900">기획안·견적서</strong> → <strong className="text-slate-900">계약</strong> → <strong className="text-slate-900">세부 기획·디자인</strong> → <strong className="text-slate-900">리허설</strong> → <strong className="text-slate-900">행사 운영</strong> → <strong className="text-slate-900">결과보고서</strong>. 각 단계마다 전담 PM이 실시간으로 진행 상황을 공유합니다.
          </>
        ),
      },
      {
        question: "현장에 몇 명이 지원 나오나요?",
        answer: (
          <>
            행사 규모와 성격에 따라 <strong className="text-slate-900">2~10명</strong>의 전문 인력이 투입됩니다. 소규모는 PM 1명 + 스태프 1~2명, 중규모는 PM + 디자이너 + 음향·영상 기사 + 스태프 3~5명, 대규모는 역할별로 최대 10명 이상이 배치됩니다.
          </>
        ),
      },
      {
        question: "행사 후 결과보고서를 받을 수 있나요?",
        answer: (
          <>
            네, 모든 행사 완료 후 결과보고서를 제공합니다. 행사 개요, 프로그램 진행 과정, 현장 사진·영상, 참석자 통계, 만족도 조사 결과, 개선 제안 사항 등이 체계적으로 정리됩니다. 행사 종료 후 <strong className="text-slate-900">3~5영업일</strong> 내에 발송합니다.
          </>
        ),
      },
    ],
  },
  {
    id: "company",
    label: "실적·규모",
    desc: "회사 소개, 고객사, 수행 실적",
    icon: Trophy,
    items: [
      {
        question: "공공기관 행사 경험이 있나요?",
        answer: (
          <>
            네, 파란컴퍼니의 핵심 역량이 공공기관 행사 대행입니다. 경기도교육청, 해군, 한국문화예술교육진흥원, 한국예술인복지재단, 한국에너지정보문화재단, 합동참모본부, 자동차부품산업진흥재단 등과 지속적으로 협업하고 있습니다. <A href="/work">수행 실적 보기</A>
          </>
        ),
      },
      {
        question: "지금까지 몇 건의 행사를 수행했나요?",
        answer: (
          <>
            2015년 설립 이후 <strong className="text-slate-900">250건 이상</strong>의 행사를 성공적으로 수행했습니다. 연간 <strong className="text-slate-900">100여 회</strong>의 행사를 운영하고 있으며, 고객 재계약률 <strong className="text-slate-900">90%</strong>가 저희 서비스 품질에 대한 가장 확실한 지표입니다.
          </>
        ),
      },
      {
        question: "어떤 고객사와 일하나요?",
        answer: (
          <>
            <strong className="text-slate-900">50개 이상</strong>의 기관·기업과 협업하고 있습니다. 다수의 고객사가 연간 계약 또는 반복 의뢰 형태로 장기 파트너십을 유지하고 있습니다. <A href="/work">포트폴리오에서 확인하기</A>
          </>
        ),
      },
      {
        question: "전국 어디서든 행사 진행이 가능한가요?",
        answer: (
          <>
            네, 서울·경기는 물론 대전, 부산, 광주, 제주 등 <strong className="text-slate-900">전국 단위</strong>로 행사를 수행합니다. <strong className="text-slate-900">40개 이상</strong>의 지역별 협력사 네트워크를 통해 어느 지역에서든 동일한 수준의 서비스 품질을 보장합니다.
          </>
        ),
      },
      {
        question: "온라인·하이브리드 행사도 운영하나요?",
        answer: (
          <>
            네, YouTube·Zoom·Teams 등을 활용한 온라인 생중계와 오프라인 현장을 결합한 <strong className="text-slate-900">하이브리드 행사</strong>를 운영합니다. 참가자 만족도 <strong className="text-slate-900">93점</strong>(100점 만점)의 높은 평가를 받고 있습니다.
          </>
        ),
      },
      {
        question: "연사·강사 섭외도 해주나요?",
        answer: (
          <>
            네, <strong className="text-slate-900">80명 이상</strong>의 연사·강사 풀을 보유하고 있어 행사 주제와 대상에 맞는 최적의 강사를 섭외해 드립니다. 강연료 협상, 일정 조율, 발표 자료 수합, 당일 의전까지 원스톱으로 지원합니다.
          </>
        ),
      },
    ],
  },
];

const totalQuestions = categories.reduce((sum, c) => sum + c.items.length, 0);

export { categories };

export default function FAQClient() {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (question: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(question)) next.delete(question);
      else next.add(question);
      return next;
    });
  };

  const scrollToCategory = (id: string) => {
    document.getElementById(`faq-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-[56px]">
      {/* Hero */}
      <section className="py-12 text-center md:py-16">
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

      {/* 카테고리 바로가기 칩 */}
      <BlurFade delay={0.15}>
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-2 px-4 pb-10 md:px-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => scrollToCategory(cat.id)}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-blue-300 hover:text-blue-600"
            >
              <cat.icon size={15} strokeWidth={1.8} className="text-blue-600" />
              {cat.label}
              <span className="text-xs text-slate-400">({cat.items.length})</span>
            </button>
          ))}
        </div>
      </BlurFade>

      {/* 전체 질문 목록 — 카테고리별 섹션 */}
      <BlurFade delay={0.2}>
        <section className="mx-auto max-w-3xl px-4 pb-20 md:px-6">
          {categories.map((cat) => (
            <div key={cat.id} id={`faq-${cat.id}`} className="mb-14 scroll-mt-24 last:mb-0">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <cat.icon size={20} strokeWidth={1.8} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">{cat.label}</h2>
                  <p className="text-xs text-slate-400">{cat.desc}</p>
                </div>
              </div>

              <div className="space-y-3">
                {cat.items.map((item) => {
                  const isOpen = openItems.has(item.question);
                  return (
                    <div
                      key={item.question}
                      className="rounded-xl border border-slate-200/80 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-all duration-200 hover:border-slate-300 hover:shadow-md"
                    >
                      <button
                        onClick={() => toggleItem(item.question)}
                        aria-expanded={isOpen}
                        className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left md:px-6"
                      >
                        <span className="text-[15px] font-medium text-slate-900 md:text-base">
                          {item.question}
                        </span>
                        <span
                          className={`shrink-0 text-blue-600 transition-transform duration-200 ${isOpen ? "rotate-45" : ""}`}
                        >
                          <Plus size={18} />
                        </span>
                      </button>
                      <div
                        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                      >
                        <div className="overflow-hidden">
                          <div className="border-t border-slate-100 px-5 pb-5 pt-4 md:px-6">
                            <div className="border-l-2 border-blue-500/40 pl-4">
                              <p className="text-[14px] leading-relaxed text-slate-700">
                                {item.answer}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
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

      {/* 내부 링크 배너 */}
      <div className="mx-auto max-w-3xl px-6 pb-16">
        <Link
          href="/guide/pricing"
          className="group flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50/50 px-6 py-5 transition-all hover:border-blue-200 hover:bg-blue-50"
        >
          <div>
            <p className="text-[15px] font-semibold text-slate-800">행사 비용이 궁금하신가요?</p>
            <p className="mt-1 text-[13px] text-slate-500">규모별·유형별 비용 가이드를 확인해보세요</p>
          </div>
          <span className="flex shrink-0 items-center gap-1 text-[14px] font-medium text-blue-600 transition-transform group-hover:translate-x-0.5">
            비용 가이드
            <ArrowRight className="h-4 w-4" />
          </span>
        </Link>
      </div>
    </div>
  );
}
