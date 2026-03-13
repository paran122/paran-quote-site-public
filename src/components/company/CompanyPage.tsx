"use client";

import { useState, useEffect, useRef, useCallback, forwardRef, type ReactNode } from "react";
import Link from "next/link";
import {
  motion,
  useInView,
  type Variants,
} from "framer-motion";
import Image from "next/image";
import {
  ChevronDown,
  ArrowRight,
  ArrowDown,
  Phone,
  Mail,
  MapPin,
  Building2,
  Users,
  Award,
  Calendar,
} from "lucide-react";
import type { BlogPost } from "@/types";

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

const HeroSection = forwardRef<HTMLDivElement>(function HeroSection(_props, ref) {
  const lines: { text: string; accent?: boolean }[] = [
    { text: "행사, 그 이상의" },
    { text: "가치를 만들고", accent: true },
    { text: "있습니다" },
  ];

  return (
    <div
      ref={ref}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden pt-14"
    >
      <div className="mx-auto max-w-[1200px] px-5 text-center">
        <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-6xl lg:text-7xl">
          {lines.map((line, i) => (
            <motion.span
              key={line.text}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.2, duration: 0.7, ease: "easeOut" }}
              className={`block ${line.accent ? "text-blue-500" : ""}`}
            >
              {line.text}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.7 }}
          className="mx-auto mt-8 max-w-2xl text-base leading-relaxed opacity-70 md:text-lg"
        >
          파란컴퍼니는 세미나, 컨퍼런스, 포럼, 축제의 기획부터 운영까지
          원스톱으로 제공하는 행사 전문 에이전시입니다.
        </motion.p>
      </div>

      {/* scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.5 }}
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
    </div>
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
    <div ref={ref} className="flex flex-col items-center py-8">
      <span className="font-display text-4xl font-bold text-blue-400 md:text-5xl">
        {count}
        {item.suffix}
      </span>
      <span className="mt-2 text-sm opacity-60">{item.label}</span>
    </div>
  );
}

function StatsSection({ inverted }: { inverted: boolean }) {
  return (
    <Section className={`border-y py-4 transition-colors duration-[800ms] ${inverted ? "border-slate-200" : "border-white/10"}`}>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
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
    <Section className="py-28 md:py-36">
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
    <Section className="py-20 md:py-28">
      <div ref={ref} className="relative grid gap-12 md:grid-cols-2 md:gap-0">
        {/* diagonal divider (hidden on mobile) */}
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
          <span className="text-xs font-semibold tracking-widest text-blue-500">
            TOTAL MANAGEMENT
          </span>
          <h3 className="mt-3 text-2xl font-bold text-slate-900 md:text-3xl">
            행사 전체 운영
          </h3>
          <p className="mt-4 leading-relaxed text-slate-600">
            기획부터 공간 디자인, 콘텐츠 제작, 현장 운영, 사후 관리까지
            행사의 모든 과정을 원스톱으로 맡깁니다.
            검증된 프로세스와 전담 팀 배치로 처음부터 끝까지 책임지고 진행합니다.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {["기획/운영", "공간디자인", "콘텐츠", "전시/부스", "인쇄물"].map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600"
              >
                {tag}
              </span>
            ))}
          </div>
          <Link
            href="/work"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-500 transition-colors hover:text-blue-600"
          >
            포트폴리오 보기 <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        {/* right — 개별 서비스 */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeUp}
          custom={1}
          className="flex flex-col items-start pl-0 md:pl-16"
        >
          <span className="text-xs font-semibold tracking-widest text-blue-500">
            INDIVIDUAL SERVICES
          </span>
          <h3 className="mt-3 text-2xl font-bold text-slate-900 md:text-3xl">
            필요한 서비스만 선택
          </h3>
          <p className="mt-4 leading-relaxed text-slate-600">
            전체 행사가 아니더라도, 필요한 서비스만 골라서 의뢰할 수 있습니다.
            기획서 작성, 인쇄 디자인, 전시 부스 시공, 영상 제작 등
            개별 서비스만으로도 전문가 수준의 결과물을 받아보세요.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {["기획서", "인쇄디자인", "전시부스", "영상제작", "온라인중계", "기념품"].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-blue-200 bg-white px-3 py-1 text-xs font-medium text-blue-600"
              >
                {tag}
              </span>
            ))}
          </div>
          <Link
            href="/work"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-500 transition-colors hover:text-blue-600"
          >
            서비스 사례 보기 <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   5. FEATURE BAND (50/50)
   ═══════════════════════════════════════════════════════════════ */

function FeatureBandStat({
  value,
  suffix,
  label,
  active,
}: {
  value: number;
  suffix: string;
  label: string;
  active: boolean;
}) {
  const count = useCountUp(value, 1800, active);
  return (
    <div className="text-center">
      <p className="font-display text-2xl font-bold text-white md:text-3xl">
        {count}
        {suffix}
      </p>
      <p className="mt-1 text-xs text-blue-100">{label}</p>
    </div>
  );
}

function FeatureBand() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const bandStats = [
    { value: 10, suffix: "+", label: "Years" },
    { value: 6, suffix: "", label: "In-house Teams" },
    { value: 100, suffix: "%", label: "One-stop" },
  ];

  return (
    <Section fullWidth className="py-0">
      <div ref={ref} className="grid min-h-[480px] md:grid-cols-2">
        {/* left — light blue */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex flex-col justify-center bg-blue-50 px-8 py-16 md:px-16"
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
          <Link
            href="/work"
            className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-blue-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-600"
          >
            자세히 보기 <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        {/* right — blue gradient */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-blue-500 to-blue-700 px-8 py-16 md:px-16"
        >
          <p className="select-none font-display text-7xl font-black tracking-tight text-white/10 md:text-9xl">
            PARAN
          </p>
          <div className="mt-auto flex justify-around gap-6">
            {bandStats.map((s) => (
              <FeatureBandStat
                key={s.label}
                value={s.value}
                suffix={s.suffix}
                label={s.label}
                active={isInView}
              />
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
  gradient: string;
}

const serviceItems: ServiceAccordionItem[] = [
  {
    number: "01",
    title: "행사 기획 / 운영",
    description:
      "클라이언트의 목표와 예산을 분석하고, 행사 컨셉 설계부터 프로그램 구성, 현장 운영, 사후 관리까지 전 과정을 체계적으로 관리합니다. 참가자 동선 설계, 연사 섭외, 의전 프로토콜, 안전 관리 등 행사의 성패를 좌우하는 디테일까지 놓치지 않습니다.",
    tags: ["세미나", "컨퍼런스", "포럼", "축제", "교육연수", "런칭행사"],
    gradient: "from-blue-500 to-cyan-400",
  },
  {
    number: "02",
    title: "행사 공간 디자인",
    description:
      "행사의 목적과 브랜드 아이덴티티에 맞는 공간을 설계하고, 참가자의 경험을 극대화하는 연출을 제공합니다. 3D 렌더링으로 사전 시뮬레이션을 진행하여 시행착오를 줄이고, 로비부터 메인홀까지 일관된 비주얼 경험을 만듭니다.",
    tags: ["로비연출", "조형물", "체험부스", "포토존", "사이니지", "무대디자인"],
    gradient: "from-blue-600 to-indigo-500",
  },
  {
    number: "03",
    title: "콘텐츠 제작",
    description:
      "행사 홍보부터 현장 기록, 결과 보고까지 전문 콘텐츠 팀이 높은 퀄리티의 결과물을 제작합니다. 사전 티저 영상, 현장 스케치 영상, SNS 카드뉴스, 사진 촬영 및 보정, 결과보고서까지 행사의 시작과 끝을 콘텐츠로 완성합니다.",
    tags: ["홍보영상", "SNS콘텐츠", "e-러닝", "실시간중계", "결과보고서"],
    gradient: "from-indigo-500 to-purple-500",
  },
  {
    number: "04",
    title: "전시 / 부스 시공",
    description:
      "전시회, 박람회, 체험존 등 다양한 전시 공간을 설계부터 시공, 철거까지 원스톱으로 진행합니다. 캐릭터 조형물, 대형 현수막, LED 디스플레이 등 시선을 사로잡는 요소와 효율적인 관람 동선을 결합하여 방문객 체류 시간을 극대화합니다.",
    tags: ["전시부스", "박람회", "체험존", "조형물제작", "LED설치", "시공관리"],
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    number: "05",
    title: "온라인 / 하이브리드 행사",
    description:
      "실시간 스트리밍, 화상 연결, 온라인 참여형 프로그램 등 비대면 행사의 기술적 요소를 안정적으로 운영합니다. 오프라인과 온라인 참가자 모두에게 몰입감 있는 경험을 제공하는 하이브리드 행사를 기획하고, 실시간 투표, Q&A, 채팅 연동까지 지원합니다.",
    tags: ["실시간중계", "하이브리드", "웨비나", "온라인플랫폼", "화상회의"],
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    number: "06",
    title: "인쇄물 / 기념품 제작",
    description:
      "행사 초대장, 프로그램북, 현수막, 배너 등 인쇄물부터 참가자 기념품, VIP 선물 세트까지 행사에 필요한 모든 제작물을 디자인하고 납품합니다. 브랜드 가이드라인에 맞춘 일관된 디자인으로 행사의 완성도를 한 단계 높입니다.",
    tags: ["초대장", "프로그램북", "현수막", "배너", "기념품", "굿즈"],
    gradient: "from-amber-500 to-orange-500",
  },
];

function AccordionServices() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <Section className="py-20 md:py-28">
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
          SERVICES
        </motion.span>
        <motion.h2
          variants={fadeUp}
          custom={1}
          className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl"
        >
          파란컴퍼니가 만드는 행사
        </motion.h2>

        <div className="mt-12 divide-y divide-slate-200 border-y border-slate-200">
          {serviceItems.map((item, i) => {
            const isOpen = openIdx === i;
            return (
              <motion.div
                key={item.number}
                variants={fadeUp}
                custom={i + 2}
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 py-6 text-left transition-colors hover:bg-slate-50"
                >
                  <div className="flex items-baseline gap-4">
                    <span className="font-display text-sm font-semibold text-blue-500">
                      {item.number}
                    </span>
                    <span className="text-lg font-semibold text-slate-900 md:text-xl">
                      {item.title}
                    </span>
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  className="overflow-hidden transition-all duration-500 ease-in-out"
                  style={{ maxHeight: isOpen ? "500px" : "0px" }}
                >
                  <div className="grid gap-6 pb-8 md:grid-cols-2">
                    <div>
                      <p className="leading-relaxed text-slate-600">
                        {item.description}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div
                      className={`hidden h-32 rounded-xl bg-gradient-to-br ${item.gradient} md:block`}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
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
      className="relative flex aspect-square w-full max-w-[600px] cursor-grab items-center justify-center select-none active:cursor-grabbing"
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
    <Section className="py-20 md:py-28">
      <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
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
   8. HIGHLIGHTS TIMELINE
   ═══════════════════════════════════════════════════════════════ */

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  hasImage?: boolean;
}

const timelineEvents: TimelineEvent[] = [
  {
    year: "2026",
    title: "중앙아시아 교육협력포럼",
    description: "경기도교육청 주관 국제 포럼 행사 진행",
    hasImage: true,
  },
  {
    year: "2025",
    title: "직장인 문화예술클럽 시범사업",
    description: "한국문화예술교육진흥원 위탁 운영",
  },
  {
    year: "2025",
    title: "여성기업인증 획득",
    description: "사업영역 확장과 함께 여성기업으로 공식 인증",
  },
  {
    year: "2024",
    title: "동동동화축제 운영",
    description: "남원시 대규모 축제 종합 운영",
    hasImage: true,
  },
];

function HighlightsSection() {
  return (
    <Section className="bg-blue-50 py-20 md:py-28">
      <motion.span
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-xs font-semibold tracking-widest text-blue-500"
      >
        HIGHLIGHTS
      </motion.span>
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl"
      >
        주요 연혁
      </motion.h2>

      <div className="mt-12 space-y-0 divide-y divide-slate-200">
        {timelineEvents.map((evt, i) => (
          <motion.div
            key={`${evt.year}-${evt.title}`}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
            custom={i}
            className="grid items-center gap-6 py-8 md:grid-cols-[80px_1fr_160px]"
          >
            <span className="font-display text-2xl font-bold text-blue-500">
              {evt.year}
            </span>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                {evt.title}
              </h3>
              <p className="mt-1 text-sm text-slate-500">{evt.description}</p>
            </div>
            {evt.hasImage ? (
              <div
                className="h-24 w-full rounded-xl bg-gradient-to-br from-blue-400 to-blue-300 shadow-md transition-transform duration-300 hover:rotate-0"
                style={{ transform: "rotate(-3deg)" }}
              />
            ) : (
              <div className="hidden md:block" />
            )}
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   9. TEAM
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
  return (
    <Section className="py-20 md:py-28">
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

        <div className="mt-12 grid gap-6 md:grid-cols-3">
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
    <Section className="py-20 md:py-28">
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

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {posts.map((post, i) => (
            <motion.div key={post.id} variants={fadeUp} custom={i + 2}>
              <Link
                href={`/blog/${post.slug}`}
                className="group grid gap-5 rounded-2xl border border-slate-200 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg sm:grid-cols-[1fr_140px]"
              >
                <div className="flex flex-col justify-between">
                  <div>
                    {post.category && (
                      <span className="text-xs font-medium text-blue-500">
                        {post.category}
                      </span>
                    )}
                    <h3 className="mt-1 line-clamp-2 text-base font-semibold text-slate-900 transition-colors group-hover:text-blue-600 md:text-lg">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-500">
                        {post.excerpt}
                      </p>
                    )}
                  </div>
                  <p className="mt-3 text-xs text-slate-400">
                    {post.publishedAt ? formatDate(post.publishedAt) : ""}
                  </p>
                </div>
                {post.thumbnailUrl && (
                  <div className="relative hidden aspect-[4/3] overflow-hidden rounded-xl sm:block">
                    <Image
                      src={post.thumbnailUrl}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="140px"
                    />
                  </div>
                )}
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
   11. CTA BAND
   ═══════════════════════════════════════════════════════════════ */

function CTABand() {
  return (
    <Section
      fullWidth
      className="bg-gradient-to-br from-slate-900 to-slate-800 py-20 md:py-24"
    >
      <div className="mx-auto max-w-[1200px] px-5 text-center md:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl font-bold text-white md:text-3xl"
        >
          행사를 준비하고 계신가요?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mt-3 text-slate-400"
        >
          파란컴퍼니와 함께 성공적인 행사를 만들어보세요.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <Link
            href="/?scrollTo=contact"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl hover:shadow-blue-500/30"
          >
            견적 요청하기 <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   12. COMPANY INFO
   ═══════════════════════════════════════════════════════════════ */

interface InfoRow {
  icon: ReactNode;
  label: string;
  value: string;
  href?: string;
}

const infoRows: InfoRow[] = [
  { icon: <Building2 className="h-4 w-4" />, label: "회사명", value: "파란컴퍼니 주식회사" },
  { icon: <Users className="h-4 w-4" />, label: "대표", value: "김미경" },
  { icon: <Calendar className="h-4 w-4" />, label: "설립", value: "2015년 (2022 법인전환)" },
  {
    icon: <MapPin className="h-4 w-4" />,
    label: "주소",
    value: "경기도 수원시 팔달구 효원로 278, 6층 603호",
  },
  { icon: <Phone className="h-4 w-4" />, label: "전화", value: "02-6342-2800", href: "tel:02-6342-2800" },
  { icon: <Mail className="h-4 w-4" />, label: "이메일", value: "info@parancompany.co.kr", href: "mailto:info@parancompany.co.kr" },
  { icon: <Award className="h-4 w-4" />, label: "인증", value: "여성기업인증 (2025)" },
];

function CompanyInfo() {
  return (
    <Section className="py-20 md:py-28">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={staggerContainer}
      >
        <motion.h2
          variants={fadeUp}
          custom={0}
          className="text-3xl font-bold text-slate-900 md:text-4xl"
        >
          회사 정보
        </motion.h2>

        <div className="mt-10 divide-y divide-slate-200 border-y border-slate-200">
          {infoRows.map((row, i) => (
            <motion.div
              key={row.label}
              variants={fadeUp}
              custom={i + 1}
              className="grid grid-cols-[100px_1fr] items-center gap-4 py-4 md:grid-cols-[160px_1fr]"
            >
              <span className="flex items-center gap-2 text-sm font-medium text-slate-500">
                {row.icon}
                {row.label}
              </span>
              {row.href ? (
                <a href={row.href} className="text-sm text-slate-900 underline-offset-2 hover:text-blue-600 hover:underline md:text-base">
                  {row.value}
                </a>
              ) : (
                <span className="text-sm text-slate-900 md:text-base">
                  {row.value}
                </span>
              )}
            </motion.div>
          ))}
        </div>
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
      <FeatureBand />
      <AccordionServices />
      <ClientsSection />
      <HighlightsSection />
      <TeamSection />
      <BlogSection posts={blogPosts} />
      <CTABand />
      <CompanyInfo />
    </div>
  );
}
