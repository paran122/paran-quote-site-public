"use client";

import { useState, useEffect, useRef, useCallback, forwardRef, type ReactNode } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useInView,
  type Variants,
} from "framer-motion";
import Image from "next/image";
import {
  ChevronDown,
  ArrowRight,
  ArrowDown,
} from "lucide-react";
import type { BlogPost } from "@/types";
import ContactModal from "@/components/ui/ContactModal";
import { Particles } from "@/components/ui/particles";

/* ─────────────────────────── helpers ─────────────────────────── */

function useCountUp(target: number, duration = 1800, active = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) {
      setCount(0);
      return;
    }
    const start = performance.now();
    let raf: number;
    function tick(now: number) {
      const p = Math.min((now - start) / duration, 1);
      const ease = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      setCount(Math.round(ease * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, active]);

  return count;
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: "easeOut" },
  }),
};

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

/* ─────────────────────── Section wrapper ─────────────────────── */

function Section({
  children,
  className = "",
  id,
  fullWidth = false,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  fullWidth?: boolean;
}) {
  return (
    <section id={id} className={`${fullWidth ? "" : "px-5 md:px-8"} ${className}`}>
      {fullWidth ? (
        children
      ) : (
        <div className="mx-auto max-w-[1200px]">{children}</div>
      )}
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   1. HERO — dark→white inversion on scroll
   ═══════════════════════════════════════════════════════════════ */

/* Hero CSS injected once */
const heroStyles = `
  @keyframes hero-grid-draw { 0% { stroke-dashoffset: 1000; opacity: 0; } 50% { opacity: 0.3; } 100% { stroke-dashoffset: 0; opacity: 0.15; } }
  @keyframes hero-pulse-glow { 0%, 100% { opacity: 0.1; transform: scale(1); } 50% { opacity: 0.3; transform: scale(1.1); } }
  @keyframes hero-word-appear { 0% { opacity: 0; transform: translateY(8px); } 100% { opacity: 1; transform: translateY(0); } }
  .hero-grid-line { stroke: #3b82f6; stroke-width: 0.5; opacity: 0; stroke-dasharray: 5 5; stroke-dashoffset: 1000; animation: hero-grid-draw 2s ease-out forwards; }
  .hero-dot { fill: #60a5fa; opacity: 0; animation: hero-pulse-glow 3s ease-in-out infinite; }
  #hero-mouse-grad { position: fixed; pointer-events: none; border-radius: 9999px; background: radial-gradient(circle, rgba(59,130,246,0.06), rgba(37,99,235,0.04), transparent 70%); transform: translate(-50%,-50%); will-change: left, top, opacity; transition: left 70ms linear, top 70ms linear, opacity 300ms ease-out; }
  @keyframes particle-breathe { 0%, 100% { opacity: 0.2; } 50% { opacity: 1; } }
`;

const HeroSection = forwardRef<HTMLDivElement>(function HeroSection(_props, ref) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, opacity: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY, opacity: 1 });
    const onLeave = () => setMousePos((p) => ({ ...p, opacity: 0 }));
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const mainWords = [
    { text: "행사,", accent: false },
    { text: "그", accent: false },
    { text: "이상의", accent: false },
  ];
  const accentWords = [
    { text: "가치를" },
    { text: "만들고" },
  ];
  const lastWords = [{ text: "있습니다" }];
  const subWords = ["파란컴퍼니는", "세미나,", "컨퍼런스,", "포럼,", "축제의", "기획부터", "운영까지", "원스톱으로", "제공하는", "행사", "전문", "에이전시입니다."];

  let wordIdx = 0;

  return (
    <>
      <style>{heroStyles}</style>
      <div
        ref={ref}
        className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden pt-14"
      >
        {/* Particles — desktop: 40, mobile: 20, breathing effect */}
        <div className="absolute inset-0 hidden animate-[particle-breathe_6s_ease-in-out_infinite] md:block">
          <Particles
            quantity={40}
            staticity={15}
            ease={30}
            color="#60a5fa"
            className="opacity-40"
          />
        </div>
        <div className="absolute inset-0 animate-[particle-breathe_6s_ease-in-out_infinite] md:hidden">
          <Particles
            quantity={20}
            staticity={15}
            ease={30}
            color="#60a5fa"
            className="opacity-40"
          />
        </div>

        {/* Grid background */}
        <svg className="absolute inset-0 h-full w-full pointer-events-none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <pattern id="heroGrid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(59,130,246,0.06)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#heroGrid)" />
          <line x1="0" y1="20%" x2="100%" y2="20%" className="hero-grid-line" style={{ animationDelay: "0.5s" }} />
          <line x1="0" y1="80%" x2="100%" y2="80%" className="hero-grid-line" style={{ animationDelay: "1s" }} />
          <line x1="20%" y1="0" x2="20%" y2="100%" className="hero-grid-line" style={{ animationDelay: "1.5s" }} />
          <line x1="80%" y1="0" x2="80%" y2="100%" className="hero-grid-line" style={{ animationDelay: "2s" }} />
          <circle cx="20%" cy="20%" r="2" className="hero-dot" style={{ animationDelay: "3s" }} />
          <circle cx="80%" cy="20%" r="2" className="hero-dot" style={{ animationDelay: "3.2s" }} />
          <circle cx="20%" cy="80%" r="2" className="hero-dot" style={{ animationDelay: "3.4s" }} />
          <circle cx="80%" cy="80%" r="2" className="hero-dot" style={{ animationDelay: "3.6s" }} />
        </svg>

        {/* Main content */}
        <div className="relative z-10 mx-auto max-w-[1200px] px-5 text-center">
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-6xl lg:text-7xl">
            {/* 행사, 그 이상의 */}
            <span className="mb-2 block">
              {mainWords.map((w) => {
                const delay = 0.5 + wordIdx * 0.15;
                wordIdx++;
                return (
                  <motion.span
                    key={`main-${w.text}`}
                    initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ delay, duration: 0.5, ease: "easeOut" }}
                    className="mx-[0.1em] inline-block"
                  >
                    {w.text}
                  </motion.span>
                );
              })}
            </span>
            {/* 가치를 만들고 */}
            <span className="mb-2 block text-blue-500">
              {accentWords.map((w) => {
                const delay = 0.5 + wordIdx * 0.15;
                wordIdx++;
                return (
                  <motion.span
                    key={`accent-${w.text}`}
                    initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ delay, duration: 0.5, ease: "easeOut" }}
                    className="mx-[0.1em] inline-block"
                  >
                    {w.text}
                  </motion.span>
                );
              })}
            </span>
            {/* 있습니다 */}
            <span className="block">
              {lastWords.map((w) => {
                const delay = 0.5 + wordIdx * 0.15;
                wordIdx++;
                return (
                  <motion.span
                    key={`last-${w.text}`}
                    initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ delay, duration: 0.5, ease: "easeOut" }}
                    className="mx-[0.1em] inline-block"
                  >
                    {w.text}
                  </motion.span>
                );
              })}
            </span>
          </h1>

          {/* Subtitle — word by word */}
          <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed opacity-70 md:text-lg">
            {subWords.map((w, i) => (
              <motion.span
                key={`sub-${i}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 0.7, y: 0 }}
                transition={{ delay: 1.2 + i * 0.06, duration: 0.4, ease: "easeOut" }}
                className="mx-[0.12em] inline-block"
              >
                {w}
              </motion.span>
            ))}
          </p>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.5 }}
          className="absolute bottom-10 flex flex-col items-center gap-2"
        >
          <span className="text-xs tracking-widest opacity-50">SCROLL</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            <ArrowDown className="h-5 w-5 opacity-50" />
          </motion.div>
        </motion.div>

        {/* Mouse-following gradient */}
        <div
          id="hero-mouse-grad"
          className="h-60 w-60 blur-xl md:h-96 md:w-96 md:blur-3xl"
          style={{ left: `${mousePos.x}px`, top: `${mousePos.y}px`, opacity: mousePos.opacity }}
        />
      </div>
    </>
  );
});

/* ═══════════════════════════════════════════════════════════════
   2. STATS BAND
   ═══════════════════════════════════════════════════════════════ */

interface StatItem {
  value: number;
  suffix: string;
  plus?: boolean;
  label: string;
}

const statsData: StatItem[] = [
  { value: 250, suffix: "+", plus: true, label: "프로젝트 수행" },
  { value: 50, suffix: "+", plus: true, label: "클라이언트" },
  { value: 90, suffix: "%", label: "재계약률" },
  { value: 93, suffix: "점", label: "참가자 만족도" },
];

function StatCard({ item }: { item: StatItem }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const count = useCountUp(item.value, 1800, isInView);

  return (
    <div ref={ref} className="flex flex-col items-center py-4 md:py-8">
      <span className="font-display text-2xl font-bold text-blue-400 md:text-5xl">
        {count}
        {item.suffix}
      </span>
      <span className="mt-1 text-[10px] opacity-60 md:mt-2 md:text-sm">{item.label}</span>
    </div>
  );
}

function StatsSection({ inverted }: { inverted: boolean }) {
  return (
    <Section className={`border-y py-4 transition-colors duration-[800ms] ${inverted ? "border-slate-200" : "border-white/10"}`}>
      <div className="grid grid-cols-4 gap-1 md:gap-4">
        {statsData.map((s) => (
          <StatCard key={s.label} item={s} />
        ))}
      </div>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   3. MISSION — word-by-word illumination
   ═══════════════════════════════════════════════════════════════ */

const missionText =
  "단순 대행을 넘어, 행사의 목표를 함께 설계하고 현장의 완성도를 높이는 통합 솔루션을 만듭니다.";

const boldRanges = [
  { start: 0, end: 3 }, // "단순 대행을 넘어,"
  { start: 13, end: 16 }, // "통합 솔루션을 만듭니다."
];

function isWordBold(idx: number): boolean {
  return boldRanges.some((r) => idx >= r.start && idx <= r.end);
}

function MissionSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function onScroll() {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const vh = window.innerHeight;
      // Start illuminating when section enters viewport, finish when top is near center
      const raw = 1 - (rect.top - vh * 0.3) / (vh * 0.8);
      setProgress(Math.max(0, Math.min(1, raw)));
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const words = missionText.split(/(\s+)/);
  // Filter only actual words (not whitespace) for index counting
  let wordIdx = -1;

  return (
    <Section className="py-14 md:py-36">
      <div ref={sectionRef} className="mx-auto max-w-3xl text-center">
        <p className="text-2xl font-medium leading-relaxed md:text-3xl lg:text-4xl">
          {words.map((token, i) => {
            const isSpace = /^\s+$/.test(token);
            if (!isSpace) wordIdx++;
            const totalWords = words.filter((t) => !/^\s+$/.test(t)).length;
            const lit = wordIdx / totalWords < progress;
            const bold = !isSpace && isWordBold(wordIdx);
            return (
              <span
                key={i}
                className={`transition-opacity duration-300 ${bold ? "font-bold" : ""}`}
                style={{ opacity: isSpace ? 1 : lit ? 1 : 0.15 }}
              >
                {token}
              </span>
            );
          })}
        </p>
      </div>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   4. TWO-COLUMN SERVICES (diagonal divider)
   ═══════════════════════════════════════════════════════════════ */

function TwoColumnServices() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <Section className="py-12 md:py-28">
      <div ref={ref} className="relative grid grid-cols-2 gap-4 md:gap-0">
        {/* diagonal divider (desktop only) */}
        <div
          className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px origin-center -translate-x-1/2 bg-slate-200 md:block"
          style={{ transform: "translateX(-50%) rotate(12deg)" }}
        />

        {/* left — 전체 운영 */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeUp}
          custom={0}
          className="flex flex-col items-start pr-0 md:pr-16"
        >
          <span className="text-[10px] font-semibold tracking-widest text-blue-500 md:text-xs">
            TOTAL MANAGEMENT
          </span>
          <h3 className="mt-2 text-base font-bold text-slate-900 md:mt-3 md:text-3xl">
            행사 전체 운영
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-slate-600 md:mt-4 md:text-base">
            <span className="md:hidden">기획부터 운영까지 모든 과정을 원스톱으로 맡깁니다.</span>
            <span className="hidden md:inline">기획부터 공간 디자인, 콘텐츠 제작, 현장 운영, 사후 관리까지
            행사의 모든 과정을 원스톱으로 맡깁니다.
            검증된 프로세스와 전담 팀 배치로 처음부터 끝까지 책임지고 진행합니다.</span>
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5 md:mt-4 md:gap-2">
            {["기획/운영", "공간디자인", "콘텐츠", "전시/부스", "인쇄물"].map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-600 md:px-3 md:py-1 md:text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.div>

        {/* right — 개별 서비스 */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeUp}
          custom={1}
          className="flex flex-col items-start pl-0 md:pl-16"
        >
          <span className="text-[10px] font-semibold tracking-widest text-blue-500 md:text-xs">
            INDIVIDUAL SERVICES
          </span>
          <h3 className="mt-2 text-base font-bold text-slate-900 md:mt-3 md:text-3xl">
            필요한 서비스만 선택
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-slate-600 md:mt-4 md:text-base">
            <span className="md:hidden">필요한 서비스만 골라서 의뢰할 수 있습니다.</span>
            <span className="hidden md:inline">전체 행사가 아니더라도, 필요한 서비스만 골라서 의뢰할 수 있습니다.
            기획서 작성, 인쇄 디자인, 전시 부스 시공, 영상 제작 등
            개별 서비스만으로도 전문가 수준의 결과물을 받아보세요.</span>
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5 md:mt-4 md:gap-2">
            {["기획서", "인쇄디자인", "전시부스", "영상제작", "온라인중계", "기념품"].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-blue-200 bg-white px-2 py-0.5 text-[10px] font-medium text-blue-600 md:px-3 md:py-1 md:text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* 하단 중앙 포트폴리오 링크 */}
      <motion.div
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={fadeUp}
        custom={2}
        className="mt-10 text-center"
      >
        <Link
          href="/work"
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-500 transition-colors hover:text-blue-600"
        >
          포트폴리오 보기 <ArrowRight className="h-4 w-4" />
        </Link>
      </motion.div>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   5. FEATURE BAND (50/50)
   ═══════════════════════════════════════════════════════════════ */

function FeatureBand({ onContact }: { onContact: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  const bandLabels = [
    { top: "기획→운영", bottom: "전 과정 책임 진행" },
    { top: "전담 PM 배치", bottom: "일관된 커뮤니케이션" },
    { top: "사후 관리 포함", bottom: "결과보고서까지 완료" },
  ];

  return (
    <Section fullWidth className="py-0">
      <div ref={ref} className="grid md:min-h-[480px] md:grid-cols-2">
        {/* left — light blue */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex flex-col justify-center bg-blue-50 px-8 py-10 md:px-16 md:py-16"
        >
          <span className="text-xs font-semibold tracking-widest text-blue-500">
            WHY PARAN
          </span>
          <h3 className="mt-4 text-2xl font-bold text-slate-900 md:text-3xl">
            왜 파란컴퍼니의
            <br />
            행사가 다른가
          </h3>
          <p className="mt-4 max-w-md leading-relaxed text-slate-600">
            기획, 디자인, 콘텐츠 제작, 운영까지 모든 역량을 내부에 보유하고
            있습니다. 외주 의존 없이 일관된 퀄리티로 행사의 완성도를 높이는 것이
            파란컴퍼니만의 강점입니다.
          </p>
          <button
            onClick={onContact}
            className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-blue-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-600"
          >
            문의하기 <ArrowRight className="h-4 w-4" />
          </button>
        </motion.div>

        {/* right — dark navy */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative flex flex-col justify-between overflow-hidden bg-[#091041] px-8 py-10 md:px-16 md:py-16"
        >
          <div className="flex items-center justify-center">
            <Image
              src="/logo-white.png"
              alt="파란컴퍼니 로고"
              width={320}
              height={140}
              className="w-64 md:w-80"
            />
          </div>
          <div className="mt-auto flex justify-around gap-6">
            {bandLabels.map((item) => (
              <div key={item.top} className="text-center">
                <p className="text-base font-bold text-white md:text-lg">{item.top}</p>
                <p className="mt-1 text-xs text-slate-400">{item.bottom}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   6. ACCORDION SERVICES
   ═══════════════════════════════════════════════════════════════ */

interface ServiceAccordionItem {
  number: string;
  title: string;
  description: string;
  tags: string[];
  images: string[];
}

const serviceItems: ServiceAccordionItem[] = [
  {
    number: "01",
    title: "행사 기획 / 운영",
    description:
      "클라이언트의 목표와 예산을 분석하고, 행사 컨셉 설계부터 프로그램 구성, 현장 운영, 사후 관리까지 전 과정을 체계적으로 관리합니다. 참가자 동선 설계, 연사 섭외, 의전 프로토콜, 안전 관리 등 행사의 성패를 좌우하는 디테일까지 놓치지 않습니다.",
    tags: ["세미나", "컨퍼런스", "포럼", "축제", "교육연수", "런칭행사"],
    images: [
      "/images/company-services/planning-1.webp",
      "/images/company-services/planning-2.webp",
      "/images/company-services/planning-3.webp",
      "/images/company-services/planning-4.webp",
    ],
  },
  {
    number: "02",
    title: "행사 공간 디자인",
    description:
      "행사의 목적과 브랜드 아이덴티티에 맞는 공간을 설계하고, 참가자의 경험을 극대화하는 연출을 제공합니다. 3D 렌더링으로 사전 시뮬레이션을 진행하여 시행착오를 줄이고, 로비부터 메인홀까지 일관된 비주얼 경험을 만듭니다.",
    tags: ["로비연출", "조형물", "체험부스", "포토존", "사이니지", "무대디자인"],
    images: [
      "/images/company-services/design-1.webp",
      "/images/company-services/design-2.webp",
      "/images/company-services/design-3.webp",
    ],
  },
  {
    number: "03",
    title: "콘텐츠 제작",
    description:
      "행사 홍보부터 현장 기록, 결과 보고까지 전문 콘텐츠 팀이 높은 퀄리티의 결과물을 제작합니다. 사전 티저 영상, 현장 스케치 영상, SNS 카드뉴스, 사진 촬영 및 보정, 결과보고서까지 행사의 시작과 끝을 콘텐츠로 완성합니다.",
    tags: ["홍보영상", "SNS콘텐츠", "e-러닝", "실시간중계", "결과보고서"],
    images: [
      "/images/company-services/contents-1.webp",
      "/images/company-services/contents-2.webp",
      "/images/company-services/contents-3.webp",
      "/images/company-services/contents-4.webp",
    ],
  },
  {
    number: "04",
    title: "전시 / 부스 시공",
    description:
      "전시회, 박람회, 체험존 등 다양한 전시 공간을 설계부터 시공, 철거까지 원스톱으로 진행합니다. 캐릭터 조형물, 대형 현수막, LED 디스플레이 등 시선을 사로잡는 요소와 효율적인 관람 동선을 결합하여 방문객 체류 시간을 극대화합니다.",
    tags: ["전시부스", "박람회", "체험존", "조형물제작", "LED설치", "시공관리"],
    images: [
      "/images/company-services/exhibition-1.webp",
      "/images/company-services/exhibition-2.webp",
      "/images/company-services/exhibition-3.webp",
      "/images/company-services/exhibition-4.webp",
      "/images/company-services/exhibition-5.webp",
    ],
  },
  {
    number: "05",
    title: "인쇄물 / 기념품 제작",
    description:
      "행사 초대장, 프로그램북, 현수막, 배너 등 인쇄물부터 참가자 기념품, VIP 선물 세트까지 행사에 필요한 모든 제작물을 디자인하고 납품합니다. 브랜드 가이드라인에 맞춘 일관된 디자인으로 행사의 완성도를 한 단계 높입니다.",
    tags: ["초대장", "프로그램북", "현수막", "배너", "기념품", "굿즈"],
    images: [
      "/images/company-services/print-1.webp",
      "/images/company-services/print-2.webp",
      "/images/company-services/print-3.webp",
      "/images/company-services/print-4.webp",
    ],
  },
];

function ServiceCard({ item, isOpen, onToggle }: {
  item: ServiceAccordionItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const [imgIdx, setImgIdx] = useState(0);
  const hasMultiple = item.images.length > 1;

  useEffect(() => {
    if (!hasMultiple) return;
    const timer = setInterval(() => {
      setImgIdx((prev) => (prev + 1) % item.images.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [hasMultiple, item.images.length]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5 }}
      onClick={onToggle}
      className="group w-full cursor-pointer md:w-[calc(50%-16px)] md:max-w-[440px]"
    >
      {/* 이미지 카드 */}
      <div className="relative overflow-hidden rounded-2xl bg-slate-900">
        <div className="relative h-[240px] md:h-[320px]">
          {/* 제목 오버레이 (이미지 위) */}
          <div className={`absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-black/50 via-black/20 to-transparent px-5 pt-4 pb-10 transition-opacity duration-500 ${isOpen ? "opacity-0" : "opacity-100"}`}>
            <span className="text-xs font-medium tracking-wider text-white/80" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}>{item.number}</span>
            <h3 className="mt-0.5 text-base font-semibold text-white md:text-lg" style={{ textShadow: '0 1px 6px rgba(0,0,0,0.7), 0 0 2px rgba(0,0,0,0.3)' }}>{item.title}</h3>
          </div>
          {/* Crossfade: 모든 이미지를 겹쳐놓고 opacity로 전환 — 흰 공백 없음 */}
          {item.images.map((src, i) => (
            <div
              key={src}
              className="absolute inset-0 transition-opacity duration-1000"
              style={{ opacity: i === imgIdx ? 1 : 0 }}
            >
              <Image
                src={src}
                alt={item.title}
                fill
                className={`object-cover transition-all duration-700 ${isOpen ? "scale-[1.02] opacity-60" : "scale-100 opacity-100"}`}
                sizes="(max-width: 768px) 100vw, 560px"
              />
            </div>
          ))}

          {/* 슬라이드 인디케이터 (여러 장일 때만) */}
          {hasMultiple && !isOpen && (
            <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
              {item.images.map((_, i) => (
                <span
                  key={i}
                  className={`block h-1 rounded-full transition-all ${i === imgIdx ? "w-4 bg-white" : "w-1.5 bg-white/50"}`}
                />
              ))}
            </div>
          )}

          {/* 접힌 상태: 하단 화살표 */}
          <div
            className={`absolute inset-x-0 bottom-0 p-6 transition-opacity duration-500 ${isOpen ? "pointer-events-none opacity-0" : "opacity-100"}`}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/40 bg-black/30 text-white shadow-md backdrop-blur-sm transition-colors group-hover:bg-black/50">
              <ArrowRight className="h-4 w-4 drop-shadow-sm" />
            </div>
          </div>

          {/* 펼친 상태: 설명 + 태그 */}
          <div
            className={`absolute inset-0 flex flex-col justify-between rounded-2xl bg-white/80 px-6 pt-8 pb-6 backdrop-blur-none transition-all duration-500 md:px-8 md:pt-10 md:pb-8 ${isOpen ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"}`}
          >
            <div>
              <p className="text-sm leading-relaxed text-slate-700 md:text-base">
                {item.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-slate-200/80 px-3 py-1 text-xs font-medium text-slate-700 backdrop-blur-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 text-slate-500">
                <ChevronDown className="h-4 w-4 rotate-180" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function AccordionServices() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [mobileIdx, setMobileIdx] = useState(0);

  return (
    <Section fullWidth className="bg-[#f1f3f8] py-14 md:py-28">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8">
      <div className="text-center">
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-xs font-semibold tracking-widest text-blue-500"
        >
          SERVICES
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mt-3 text-2xl font-bold text-slate-900 md:text-4xl"
        >
          파란컴퍼니가 만드는 행사
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-2 text-sm text-slate-500 md:mt-3 md:text-base"
        >
          기획부터 운영까지, 행사의 모든 과정을 책임집니다
        </motion.p>
      </div>

      {/* Desktop: card grid */}
      <div className="mt-12 hidden flex-wrap justify-center gap-x-8 gap-y-12 md:flex">
        {serviceItems.map((item, i) => (
          <ServiceCard
            key={item.number}
            item={item}
            isOpen={openIdx === i}
            onToggle={() => setOpenIdx(openIdx === i ? null : i)}
          />
        ))}
      </div>

      {/* Mobile: single card with arrows */}
      <div className="mt-8 md:hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={mobileIdx}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
            className=""
          >
            <div className="mb-2 flex items-baseline gap-2 px-1">
              <span className="text-xs font-medium text-slate-400">{serviceItems[mobileIdx].number}</span>
              <h3 className="text-lg font-bold text-slate-900">{serviceItems[mobileIdx].title}</h3>
            </div>
            <div className="overflow-hidden rounded-2xl bg-[#f8f9fa]">
            <div className="relative h-[200px]">
              <Image
                src={serviceItems[mobileIdx].images[0]}
                alt={serviceItems[mobileIdx].title}
                fill
                className="object-cover"
                sizes="100vw"
              />
            </div>
            <div className="p-5">
              <p className="mt-2 line-clamp-3 min-h-[3.75rem] text-xs leading-relaxed text-slate-600">
                {serviceItems[mobileIdx].description}
              </p>
              <div className="mt-3 flex min-h-[2rem] flex-wrap gap-1.5">
                {serviceItems[mobileIdx].tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-slate-200/80 px-2.5 py-0.5 text-[10px] font-medium text-slate-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={() => setMobileIdx((prev) => (prev - 1 + serviceItems.length) % serviceItems.length)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 text-slate-500 transition-colors hover:bg-slate-100"
            aria-label="이전"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
          </button>
          <div className="flex gap-1.5">
            {serviceItems.map((_, i) => (
              <button
                key={i}
                onClick={() => setMobileIdx(i)}
                className={`h-1.5 rounded-full transition-all ${i === mobileIdx ? "w-4 bg-blue-500" : "w-1.5 bg-slate-300"}`}
                aria-label={`${i + 1}번째 서비스`}
              />
            ))}
          </div>
          <button
            onClick={() => setMobileIdx((prev) => (prev + 1) % serviceItems.length)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 text-slate-500 transition-colors hover:bg-slate-100"
            aria-label="다음"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      </div>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   7. CLIENTS (3D logo globe + info)
   ═══════════════════════════════════════════════════════════════ */

interface ClientLogo {
  name: string;
  logo: string;
}

const clientLogos: ClientLogo[] = [
  { name: "경기도교육청", logo: "/logos/gyeonggido-edu.jpg" },
  { name: "합동참모본부", logo: "/logos/jcs.png" },
  { name: "해군본부", logo: "/logos/navy-ops.png" },
  { name: "자동차부품산업진흥재단", logo: "/logos/kapf.svg" },
  { name: "한국에너지정보문화재단", logo: "/logos/keicf.png" },
  { name: "한국문화예술교육진흥원", logo: "/logos/arte.png" },
  { name: "한국예술인복지재단", logo: "/logos/kawf.png" },
];

const clientNamesOnly = [
  "농업정책보험금융원",
  "남원시",
  "교육감협의회",
  "한국산업인력공단",
  "경기도평생교육진흥원",
  "과학기술정보통신부",
  "국방부",
  "충청남도교육청",
];

function LogoGlobe() {
  const angleRef = useRef({ x: -15, y: 0 });
  const dragRef = useRef({ active: false, startX: 0, startY: 0, startAngleX: 0, startAngleY: 0 });
  const autoRotateRef = useRef(true);
  const rafRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isVisibleRef = useRef(true);
  const [positions, setPositions] = useState<{ x: number; y: number; z: number; scale: number; opacity: number }[]>([]);

  const radius = 280;
  const total = clientLogos.length;

  const computePositions = useCallback(() => {
    const ax = (angleRef.current.x * Math.PI) / 180;
    const ay = (angleRef.current.y * Math.PI) / 180;
    const cosAx = Math.cos(ax), sinAx = Math.sin(ax);
    const cosAy = Math.cos(ay), sinAy = Math.sin(ay);

    const pts = [];
    for (let i = 0; i < total; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / total);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const x0 = radius * Math.sin(phi) * Math.cos(theta);
      const y0 = radius * Math.sin(phi) * Math.sin(theta);
      const z0 = radius * Math.cos(phi);

      const y1 = y0 * cosAx - z0 * sinAx;
      const z1 = y0 * sinAx + z0 * cosAx;
      const x2 = x0 * cosAy + z1 * sinAy;
      const z2 = -x0 * sinAy + z1 * cosAy;

      const rawScale = (z2 + radius * 1.5) / (radius * 2.5);
      const scale = Math.max(0.6, rawScale);
      const opacity = Math.max(0.35, Math.min(1, (z2 + radius) / (radius * 1.5)));
      pts.push({ x: x2, y: y1, z: z2, scale, opacity });
    }
    setPositions(pts);
  }, [total]);

  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      const observer = new IntersectionObserver(
        ([entry]) => { isVisibleRef.current = entry.isIntersecting; },
        { threshold: 0.1 }
      );
      observer.observe(el);
      return () => observer.disconnect();
    }
  }, []);

  useEffect(() => {
    function animate() {
      if (isVisibleRef.current) {
        if (autoRotateRef.current) {
          angleRef.current.y += 0.25;
        }
        computePositions();
      }
      rafRef.current = requestAnimationFrame(animate);
    }
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [computePositions]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    dragRef.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      startAngleX: angleRef.current.x,
      startAngleY: angleRef.current.y,
    };
    autoRotateRef.current = false;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    angleRef.current.y = dragRef.current.startAngleY + dx * 0.4;
    angleRef.current.x = dragRef.current.startAngleX + dy * 0.4;
  }, []);

  const handlePointerUp = useCallback(() => {
    dragRef.current.active = false;
    autoRotateRef.current = true;
  }, []);

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      className="relative flex aspect-square w-full max-w-[600px] cursor-grab items-center justify-center overflow-hidden select-none active:cursor-grabbing"
    >
      {clientLogos.map((client, i) => {
        const pos = positions[i];
        if (!pos) return null;
        return (
          <div
            key={client.name}
            className="absolute flex h-36 w-36 items-center justify-center transition-none md:h-44 md:w-44"
            style={{
              transform: `translate3d(${pos.x}px, ${pos.y}px, 0) scale(${pos.scale})`,
              opacity: pos.opacity,
              zIndex: Math.round(pos.z + radius),
            }}
            title={client.name}
          >
            <Image
              src={client.logo}
              alt={client.name}
              width={144}
              height={144}
              className="h-full w-full object-contain drop-shadow-sm"
            />
          </div>
        );
      })}
    </div>
  );
}

function ClientsSection() {
  return (
    <Section className="py-14 md:py-28">
      <div className="grid items-center gap-8 md:grid-cols-2 md:gap-16">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex justify-center"
        >
          <LogoGlobe />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <span className="text-xs font-semibold tracking-widest text-blue-500">
            PARTNERS
          </span>
          <h2 className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl">
            함께한 고객사
          </h2>
          <p className="mt-4 leading-relaxed text-slate-600">
            공공기관, 재단, 지자체 등 다양한 분야의 기관과 함께 250건 이상의
            행사를 성공적으로 수행했습니다.
          </p>
          <div className="mt-6 grid grid-cols-3 gap-3">
            {[...clientLogos, ...clientNamesOnly.map((n) => ({ name: n, logo: "" }))].map((c) => (
              <span
                key={c.name}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-center text-xs font-medium text-slate-700 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
              >
                {c.name}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   8. TEAM
   ═══════════════════════════════════════════════════════════════ */

interface TeamCard {
  icon: string;
  label: string;
  enLabel: string;
  description: string;
}

const teamCards: TeamCard[] = [
  {
    icon: "/icons/team-planning.png",
    label: "기획팀",
    enLabel: "PLANNING TEAM",
    description:
      "클라이언트의 목표와 예산을 분석하고, 행사 컨셉 설계부터 프로그램 구성, 제안서 작성까지 전략적으로 기획합니다. 참가자 경험을 극대화하는 프로그램을 설계합니다.",
  },
  {
    icon: "/icons/team-operations.png",
    label: "운영팀",
    enLabel: "OPERATIONS TEAM",
    description:
      "현장 운영 총괄, 참가자 동선 관리, 연사·VIP 의전, 협력업체 조율까지 행사 당일의 모든 실행을 책임집니다. 안전 관리와 돌발 상황 대응도 전담합니다.",
  },
  {
    icon: "/icons/team-contents.png",
    label: "콘텐츠팀",
    enLabel: "CONTENTS TEAM",
    description:
      "공간 디자인(로비 연출, 조형물, 키비주얼, 사이니지)과 홍보 영상, SNS 콘텐츠 등 행사의 시각적 경험을 설계하고 제작합니다.",
  },
];

function TeamSection() {
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <Section className="py-12 md:py-28">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={staggerContainer}
      >
        <motion.span
          variants={fadeUp}
          custom={0}
          className="text-xs font-semibold tracking-widest text-blue-500"
        >
          ORGANIZATION
        </motion.span>
        <motion.h2
          variants={fadeUp}
          custom={1}
          className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl"
        >
          전문 조직
        </motion.h2>

        {/* Desktop: 3-column grid */}
        <div className="mt-12 hidden gap-6 md:grid md:grid-cols-3">
          {teamCards.map((card, i) => (
            <motion.div
              key={card.enLabel}
              variants={fadeUp}
              custom={i + 2}
              className="group rounded-2xl border border-slate-200 p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg"
            >
              <div className="inline-flex h-20 w-20 items-center justify-center">
                <Image
                  src={card.icon}
                  alt={card.label}
                  width={64}
                  height={64}
                  className="h-16 w-16"
                />
              </div>
              <h3 className="mt-5 text-lg font-bold text-slate-900">
                {card.label}
              </h3>
              <p className="mt-1 font-display text-xs tracking-wider text-slate-400">
                {card.enLabel}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                {card.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Mobile: single card with arrows + animation */}
        <div className="mt-8 md:hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIdx}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden rounded-2xl border border-slate-200 p-5"
            >
              <div className="flex items-start gap-4">
                <div className="inline-flex h-14 w-14 shrink-0 items-center justify-center">
                  <Image
                    src={teamCards[activeIdx].icon}
                    alt={teamCards[activeIdx].label}
                    width={56}
                    height={56}
                    className="h-12 w-12"
                  />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {teamCards[activeIdx].label}
                  </h3>
                  <p className="font-display text-[10px] tracking-wider text-slate-400">
                    {teamCards[activeIdx].enLabel}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-slate-600">
                {teamCards[activeIdx].description}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={() => setActiveIdx((prev) => (prev - 1 + teamCards.length) % teamCards.length)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 text-slate-500 transition-colors hover:bg-slate-100"
              aria-label="이전"
            >
              <ArrowRight className="h-4 w-4 rotate-180" />
            </button>
            <div className="flex gap-1.5">
              {teamCards.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIdx(i)}
                  className={`h-1.5 rounded-full transition-all ${i === activeIdx ? "w-4 bg-blue-500" : "w-1.5 bg-slate-300"}`}
                  aria-label={`${i + 1}번째 카드`}
                />
              ))}
            </div>
            <button
              onClick={() => setActiveIdx((prev) => (prev + 1) % teamCards.length)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 text-slate-500 transition-colors hover:bg-slate-100"
              aria-label="다음"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   10. BLOG SECTION (Toss Newsroom style)
   ═══════════════════════════════════════════════════════════════ */

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getUTCFullYear()}.${String(d.getUTCMonth() + 1).padStart(2, "0")}.${String(d.getUTCDate()).padStart(2, "0")}`;
}

function BlogSection({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) return null;

  return (
    <Section className="py-12 md:py-28">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={staggerContainer}
      >
        <div className="flex items-end justify-between">
          <div>
            <motion.span
              variants={fadeUp}
              custom={0}
              className="text-xs font-semibold tracking-widest text-blue-500"
            >
              BLOG
            </motion.span>
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl"
            >
              파란 인사이트
            </motion.h2>
          </div>
          <motion.div variants={fadeUp} custom={1}>
            <Link
              href="/blog"
              className="hidden items-center gap-1 text-sm font-semibold text-blue-500 transition-colors hover:text-blue-600 md:inline-flex"
            >
              더 많은 글 보기 <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 md:mt-12 md:gap-6">
          {posts.map((post, i) => (
            <motion.div key={post.id} variants={fadeUp} custom={i + 2}>
              <Link
                href={`/blog/${post.slug}`}
                className="group flex flex-col gap-3 rounded-xl border border-slate-200 p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg md:grid md:grid-cols-[1fr_140px] md:gap-5 md:rounded-2xl md:p-5"
              >
                {post.thumbnailUrl && (
                  <div className="relative aspect-[16/9] overflow-hidden rounded-lg md:order-2 md:aspect-[4/3] md:rounded-xl">
                    <Image
                      src={post.thumbnailUrl}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 45vw, 140px"
                    />
                  </div>
                )}
                <div className="flex flex-col justify-between md:order-1">
                  <div>
                    {post.category && (
                      <span className="text-[10px] font-medium text-blue-500 md:text-xs">
                        {post.category}
                      </span>
                    )}
                    <h3 className="mt-0.5 line-clamp-2 text-sm font-semibold text-slate-900 transition-colors group-hover:text-blue-600 md:mt-1 md:text-lg">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="mt-1 line-clamp-2 hidden text-sm leading-relaxed text-slate-500 md:block">
                        {post.excerpt}
                      </p>
                    )}
                  </div>
                  <p className="mt-2 text-[10px] text-slate-400 md:mt-3 md:text-xs">
                    {post.publishedAt ? formatDate(post.publishedAt) : ""}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div variants={fadeUp} custom={6} className="mt-8 text-center md:hidden">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-sm font-semibold text-blue-500"
          >
            더 많은 글 보기 <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </motion.div>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════════════════════ */

export default function CompanyPage({ blogPosts = [] }: { blogPosts?: BlogPost[] }) {
  const heroRef = useRef<HTMLDivElement>(null);
  const [inverted, setInverted] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  const handleScroll = useCallback(() => {
    if (!heroRef.current) return;
    const { bottom } = heroRef.current.getBoundingClientRect();
    setInverted(bottom < window.innerHeight * 0.5);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div
      className="transition-colors duration-[800ms] ease-in-out"
      style={{
        backgroundColor: inverted ? "#ffffff" : "#0b0f1a",
        color: inverted ? "#0f172a" : "#f8fafc",
      }}
    >
      <HeroSection ref={heroRef} />
      <StatsSection inverted={inverted} />
      <MissionSection />
      <TwoColumnServices />
      <FeatureBand onContact={() => setContactOpen(true)} />
      <AccordionServices />
      <ClientsSection />
      <TeamSection />
      <BlogSection posts={blogPosts} />

      {/* 내부 링크 배너 */}
      <div className="mx-auto max-w-5xl px-6 py-12">
        <Link
          href="/work"
          className="group flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50/50 px-6 py-5 transition-all hover:border-blue-200 hover:bg-blue-50"
        >
          <div>
            <p className="text-[15px] font-semibold text-slate-800">실제 행사 사례가 궁금하신가요?</p>
            <p className="mt-1 text-[13px] text-slate-500">250+ 프로젝트 포트폴리오를 확인해보세요</p>
          </div>
          <span className="flex shrink-0 items-center gap-1 text-[14px] font-medium text-blue-600 transition-transform group-hover:translate-x-0.5">
            포트폴리오
            <ArrowRight className="h-4 w-4" />
          </span>
        </Link>
      </div>

      <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} />
    </div>
  );
}
