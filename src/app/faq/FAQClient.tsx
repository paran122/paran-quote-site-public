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
            파란컴퍼니는 <strong className="text-slate-900">2015년 설립</strong>된 행사 기획·운영 전문 에이전시입니다. 세미나, 컨퍼런스, 포럼, 학술대회, 워크숍 등 공공·기업 행사를 전문으로 하며, 기획 단계부터 디자인·시안물 제작·현장 운영·결과보고서까지 원스톱으로 제공합니다. 여성기업 인증 업체이며, 경기도 수원에 본사를 두고 서울·경기를 포함한 전국 단위로 행사를 수행합니다. 경기도교육청, 해군, 한국문화예술교육진흥원, 자동차부품산업진흥재단 등 다양한 공공기관·기업과 지속적으로 협업하고 있습니다.
          </>
        ),
      },
      {
        question: "어떤 종류의 행사를 전문으로 하나요?",
        answer: (
          <>
            세미나, 컨퍼런스, 포럼, 학술대회, 심포지엄, 워크숍, 기념식, 런칭 행사, 결과공유회, 체험형 캠프 등 다양한 형태의 행사를 기획·운영합니다. 특히 공공기관과 기업의 세미나·컨퍼런스 대행에 강점이 있으며, <strong className="text-slate-900">250건 이상</strong>의 <A href="/work">프로젝트 수행 경험</A>을 보유하고 있습니다. 최근에는 국제 포럼(한중수교 기념 포럼), 전국 순회 교육(예술인 권리보호 교육 연간 100회), 교육 플랫폼 런칭 행사(KLS 글로벌 프리미어), SNS 콘텐츠 제작(합동참모본부) 등 행사 운영뿐 아니라 콘텐츠 기획·제작 영역까지 서비스를 확장하고 있습니다.
          </>
        ),
      },
      {
        question: "소규모(30명) 행사도 가능한가요?",
        answer: (
          <>
            네, 가능합니다. <strong className="text-slate-900">30명 이하</strong>의 소규모 세미나부터 <strong className="text-slate-900">500명 이상</strong>의 대규모 컨퍼런스까지 규모에 관계없이 대응합니다. 소규모 행사의 경우 PM 1명과 운영 스태프 1~2명의 핵심 인력 중심으로 효율적인 구성을 제안드리며, 불필요한 항목은 빼고 꼭 필요한 서비스만 선별하여 예산 대비 최대 효과를 내는 방식으로 진행합니다. 실제로 30~50명 규모의 내부 워크숍, 정책 간담회, 전문가 세미나 등을 다수 수행한 경험이 있으며, 소규모일수록 참석자 한 분 한 분의 경험이 중요하기 때문에 세밀한 동선 설계와 맞춤형 자료 제작에 더 집중합니다.
          </>
        ),
      },
      {
        question: "기획만 맡기거나 운영만 맡길 수 있나요?",
        answer: (
          <>
            네, 가능합니다. 기획만, 디자인만, 운영만, 또는 시안물 제작만 등 필요한 부분만 선택하여 의뢰하실 수 있습니다. 예를 들어 사내 기획팀이 있지만 현장 운영 인력이 부족한 경우 운영 대행만, 행사 콘셉트는 정해졌지만 포스터·현수막 등 시안물 디자인이 필요한 경우 디자인만 맡기시는 고객사도 있습니다. 물론 기획부터 디자인·시안물 제작·현장 운영까지 원스톱으로 맡기시면 전체 행사의 톤앤매너가 일관되고, 담당자 간 커뮤니케이션 비용이 줄어들어 가장 효율적인 결과를 만들 수 있습니다.
          </>
        ),
      },
      {
        question: "디자인(포스터, 현수막)이나 영상 촬영도 해주나요?",
        answer: (
          <>
            네, 행사에 필요한 모든 디자인과 촬영을 자체 역량으로 수행합니다. 포스터, 현수막, 엑스배너, 리플렛, 초청장, 명찰, 자료집, 에세이집 등 인쇄물은 물론 카드뉴스, 웹배너, 인포그래픽, SNS 콘텐츠 등 디지털 디자인까지 제작하며, 고객사 CI/BI에 맞춘 통일된 비주얼 아이덴티티를 구현합니다. 현장에서는 전문 장비를 활용한 사진·영상 촬영을 진행하고, 행사 후에는 하이라이트 영상 편집과 결과보고서용 기록 촬영물을 정리하여 제공합니다. 최근에는 전시부스·등신대·포토존 등 공간 연출 시안물 제작까지 서비스 범위를 넓혔습니다.
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
            행사 규모, 형태, 서비스 범위에 따라 달라집니다. 소규모 세미나(30~50명, 기획+디자인+운영)는 약 <strong className="text-slate-900">300만 원부터</strong>, 중규모 컨퍼런스(100~200명, 기획+디자인+음향+운영)는 약 <strong className="text-slate-900">800만 원부터</strong> 시작합니다. 여기에 포토존·전시부스·케이터링·촬영 등 추가 항목에 따라 비용이 조정됩니다. 예를 들어 배너·엑스배너 디자인은 40만 원부터, 메인 현수막 제작은 80만 원부터, 행사 촬영은 80만 원부터 이용 가능합니다. 정확한 견적은 행사 내용을 확인한 후 항목별로 투명하게 산출해 드리며, 불필요한 비용 없이 예산에 맞춘 최적의 구성을 제안합니다.
          </>
        ),
      },
      {
        question: "견적은 어떻게 받나요?",
        answer: (
          <>
            세 가지 방법으로 견적을 받으실 수 있습니다. 첫째, 홈페이지 하단의 견적 요청 폼을 통해 행사 일시, 규모, 필요 서비스를 입력하시면 <strong className="text-slate-900">1영업일 내</strong>에 항목별 맞춤 견적서를 이메일로 보내드립니다. 둘째, <a href="tel:02-6342-2800" className="text-blue-600 underline underline-offset-2 hover:text-blue-500">전화(02-6342-2800)</a>로 직접 상담하시면 즉시 대략적인 예산 범위를 안내받으실 수 있습니다. 셋째, <a href="https://pf.kakao.com/_xkexdLG" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline underline-offset-2 hover:text-blue-500">카카오톡 상담</a>을 통해 편하게 문의하실 수도 있습니다. 견적서에는 기획, 디자인, 시안물 제작, 장비, 인력, 케이터링 등 항목별 단가가 명시되어 있어 투명하게 비교·검토하실 수 있으며, 공공기관의 경우 조달 절차에 맞는 견적 서식으로 제출합니다.
          </>
        ),
      },
      {
        question: "예산이 제한적인데 조율 가능한가요?",
        answer: (
          <>
            네, 충분히 가능합니다. 예산 범위를 알려주시면 그 안에서 최대 효과를 낼 수 있도록 우선순위에 따른 서비스 구성을 제안드립니다. 예를 들어 현수막은 자체 제작하시고 기획·운영만 맡기시거나, 인쇄물 디자인은 포함하되 케이터링은 직접 수배하시는 등 유연하게 조율합니다. 핵심은 참석자가 직접 보고 느끼는 항목(무대 연출, 자료집 퀄리티, 현장 운영)에 예산을 집중하고, 후선 업무는 비용을 절감하는 전략입니다. 실제로 많은 공공기관 고객사에서 연간 예산 범위 내에서 최적의 구성을 함께 설계하여 진행하고 있습니다.
          </>
        ),
      },
      {
        question: "행사 규모에 따라 가격이 어떻게 달라지나요?",
        answer: (
          <>
            주요 변동 요소는 참석자 수, 행사 기간, 장소 규모, 필요 장비(음향·LED 스크린 등), 케이터링 여부, 시안물 종류와 수량입니다. 일반적으로 참석자 수가 2배가 되더라도 기획비나 디자인비는 동일하므로 전체 비용이 2배로 늘지 않으며, 규모가 클수록 인당 단가는 낮아지는 구조입니다. 예를 들어 50명 세미나에서 자료집·명찰 제작비와 200명 세미나의 자료집·명찰 제작비는 인쇄 수량 차이만 발생하고 디자인비는 같습니다. 반면 음향 시스템(250만 원~)이나 LED 스크린(300만 원~)처럼 장소 규모에 따라 장비 사양이 달라지는 항목은 규모에 비례하여 비용이 증가합니다.
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
            소규모 세미나(50명 이하)는 최소 <strong className="text-slate-900">2~3주</strong>, 중대규모 컨퍼런스·포럼(100명 이상)은 최소 <strong className="text-slate-900">4~6주</strong> 전에 의뢰해 주시는 것이 좋습니다. 이 기간에는 기획안 수립, 시안물 디자인(포스터·현수막·자료집 등), 인쇄물 제작, 장소·장비 확정, 케이터링 준비, 리허설 등이 포함됩니다. 특히 전시부스나 대형 포토존 등 제작 기간이 필요한 시안물이 있으면 최소 3주 이상의 여유가 필요합니다. 급하게 진행해야 하는 경우에도 최소 <strong className="text-slate-900">1주</strong> 이상이면 핵심 서비스 중심으로 대응 가능하지만, 여유 있게 준비할수록 더 높은 퀄리티를 보장할 수 있습니다.
          </>
        ),
      },
      {
        question: "진행 절차가 어떻게 되나요?",
        answer: (
          <>
            총 7단계로 진행됩니다. <strong className="text-slate-900">1단계</strong> 상담 및 요구사항 파악(전화·카카오톡·방문 상담으로 행사 목적, 규모, 예산 확인) → <strong className="text-slate-900">2단계</strong> 기획안·견적서 제출(행사 콘셉트, 프로그램 구성, 항목별 견적 제안) → <strong className="text-slate-900">3단계</strong> 계약 체결 → <strong className="text-slate-900">4단계</strong> 세부 기획·디자인(시안물 디자인, 프로그램 확정, 연사 조율, 장비 확정) → <strong className="text-slate-900">5단계</strong> 사전 리허설(현장 답사, 동선 확인, 장비 테스트) → <strong className="text-slate-900">6단계</strong> 행사 당일 운영(등록·안내·진행·촬영·돌발 상황 대응) → <strong className="text-slate-900">7단계</strong> 결과보고서 제출 및 정산. 각 단계마다 전담 PM이 배정되어 실시간으로 진행 상황을 공유하며, 주요 의사결정 시점마다 고객사 확인을 거칩니다.
          </>
        ),
      },
      {
        question: "현장에 몇 명이 지원 나오나요?",
        answer: (
          <>
            행사 규모와 성격에 따라 <strong className="text-slate-900">2~10명</strong>의 전문 인력이 투입됩니다. 소규모 세미나(50명 이하)는 PM 1명 + 운영 스태프 1~2명으로 구성되며, 중규모 컨퍼런스(100~200명)는 PM + 디자이너 + 음향·영상 기사 + 운영 스태프 3~5명이 투입됩니다. 대규모 행사(300명 이상)의 경우 등록 데스크, 세션별 진행, VIP 의전, 촬영 등 역할별로 인력을 세분화하여 최대 10명 이상이 배치됩니다. 모든 현장 인력은 사전 리허설에 참여하여 동선, 큐시트, 돌발 상황 대응 매뉴얼을 숙지한 상태로 행사에 투입되며, 필요 인력 구성은 사전 협의를 통해 확정합니다.
          </>
        ),
      },
      {
        question: "행사 후 결과보고서를 받을 수 있나요?",
        answer: (
          <>
            네, 모든 행사 완료 후 결과보고서를 제공합니다. 보고서에는 행사 개요(일시·장소·참석자 수), 프로그램 진행 과정, 현장 사진·영상(촬영 서비스 이용 시), 참석자 통계, 만족도 조사 결과, 개선 제안 사항 등이 체계적으로 정리됩니다. 공공기관의 경우 관내 보고 형식(기관별 지정 양식)에 맞춰 작성해 드리며, 감사·평가 자료로 활용 가능한 수준의 문서를 제공합니다. 일반적으로 행사 종료 후 <strong className="text-slate-900">3~5영업일</strong> 내에 결과보고서를 발송하며, 촬영 원본 파일과 편집 영상은 별도 전달합니다.
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
            네, 파란컴퍼니의 핵심 역량이 공공기관 행사 대행입니다. 경기도교육청(KLS 글로벌 프리미어, 교육감협의회 부스, 인쇄물 디자인), 해군(필승해군캠프), 한국문화예술교육진흥원(직장인 문화예술클럽 결과공유회), 한국예술인복지재단(전국 순회 예술인 권리보호 교육), 한국에너지정보문화재단(지역사회 역량강화 프로그램), 합동참모본부(SNS 콘텐츠 제작), 자동차부품산업진흥재단(춘·추계 세미나) 등 중앙 부처, 지자체, 공기업, 공공재단과 지속적으로 협업하고 있습니다. 공공조달 절차, 관내 보고 형식, 정산 서류 작성에 익숙하며, 나라장터·조달청 등록 절차도 지원합니다. <A href="/work">수행 실적 보기</A>
          </>
        ),
      },
      {
        question: "지금까지 몇 건의 행사를 수행했나요?",
        answer: (
          <>
            2015년 설립 이후 <strong className="text-slate-900">250건 이상</strong>의 행사를 성공적으로 수행했습니다. 포럼, 세미나, 행사운영, 교육, 콘텐츠 제작 등 5개 분야에 걸쳐 폭넓은 경험을 보유하고 있으며, 연간 <strong className="text-slate-900">100회 이상</strong>의 행사를 운영하고 있습니다. 특히 한국예술인복지재단의 전국 순회 교육처럼 연간 100회에 달하는 장기 프로젝트를 안정적으로 운영한 경험은 대규모 반복 행사에서의 품질 관리 역량을 증명합니다. 고객 재계약률 <strong className="text-slate-900">90%</strong>가 저희 서비스 품질에 대한 가장 확실한 지표입니다.
          </>
        ),
      },
      {
        question: "어떤 고객사와 일하나요?",
        answer: (
          <>
            <strong className="text-slate-900">50개 이상</strong>의 기관·기업과 협업하고 있습니다. 주요 고객사로는 경기도교육청, 해군본부, 합동참모본부, 한국문화예술교육진흥원, 한국예술인복지재단, 한국에너지정보문화재단, 자동차부품산업진흥재단 등이 있으며, 이 외에도 대학교, 협회·학회, 민간기업 등 다양한 분야의 고객사가 있습니다. 업종별 행사 특성(공공기관의 격식과 절차, 기업의 브랜딩 요구, 학술 행사의 전문성 등)을 이해하고 있어 각 기관의 문화와 요구에 맞춘 기획이 가능합니다. 다수의 고객사가 연간 계약 또는 반복 의뢰 형태로 장기 파트너십을 유지하고 있습니다. <A href="/work">포트폴리오에서 확인하기</A>
          </>
        ),
      },
      {
        question: "전국 어디서든 행사 진행이 가능한가요?",
        answer: (
          <>
            네, 가능합니다. 경기도 수원에 본사를 두고 있지만 서울, 경기는 물론 대전, 부산, 광주, 제주 등 <strong className="text-slate-900">전국 단위</strong>로 행사를 수행합니다. 실제로 자동차부품산업 세미나는 대전 ICC호텔에서, 예술인 권리보호 교육은 전국 각지에서 100회 이상 순회 진행한 바 있습니다. <strong className="text-slate-900">40개 이상</strong>의 지역별 협력사 네트워크(음향·영상·케이터링·인쇄 등)를 통해 어느 지역에서든 동일한 수준의 서비스 품질을 보장하며, 사전 현장 답사를 통해 지역 특성에 맞는 최적의 운영 방안을 설계합니다.
          </>
        ),
      },
      {
        question: "온라인·하이브리드 행사도 운영하나요?",
        answer: (
          <>
            네, YouTube·Zoom·Teams 등을 활용한 온라인 생중계와 오프라인 현장을 결합한 <strong className="text-slate-900">하이브리드 행사</strong>를 운영합니다. 안정적인 송출 환경 구축을 위해 전문 스트리밍 장비와 백업 회선을 준비하며, 온라인 참가자를 위한 실시간 채팅·Q&A·설문 기능도 지원합니다. 오프라인 참석자와 온라인 시청자 모두가 동일한 수준의 행사 경험을 할 수 있도록 카메라 앵글, 음향, 자막 등을 세밀하게 설계합니다. 하이브리드 행사 운영 노하우를 꾸준히 축적해 왔으며, 참가자 만족도 <strong className="text-slate-900">93점</strong>(100점 만점)의 높은 평가를 받고 있습니다.
          </>
        ),
      },
      {
        question: "연사·강사 섭외도 해주나요?",
        answer: (
          <>
            네, <strong className="text-slate-900">80명 이상</strong>의 연사·강사 풀을 보유하고 있어 행사 주제와 대상에 맞는 최적의 강사를 섭외해 드립니다. 학계(대학교수, 연구원), 산업계(기업 임원, 기술 전문가), 공공 분야(정책 전문가, 전직 공무원) 등 다양한 분야의 전문가와 협업한 경험이 있으며, 자동차부품산업 세미나에서는 산업통상자원부·현대자동차그룹 관계자, 국제 포럼에서는 해외 학자 등 VIP 연사 의전까지 담당했습니다. 강연료 협상, 일정 조율, 발표 자료 수합, 당일 의전까지 연사 관리 전 과정을 원스톱으로 지원합니다.
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
