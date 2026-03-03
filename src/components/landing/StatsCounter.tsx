"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from "framer-motion";
import type { ThemeKey } from "@/lib/themes";

function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.unobserve(el); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function useCountUp(target: number, duration: number, start: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number;
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(target * ease(progress));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

/* ─── 반시계 방향 MovingBorder ─── */
function CounterClockwiseBorder({
  children,
  duration = 3000,
  rx,
  ry,
}: {
  children: React.ReactNode;
  duration?: number;
  rx?: string;
  ry?: string;
}) {
  const pathRef = useRef<SVGRectElement>(null);
  const progress = useMotionValue<number>(0);

  useAnimationFrame((time) => {
    const length = pathRef.current?.getTotalLength();
    if (length) {
      const pxPerMillisecond = length / duration;
      // 반시계 방향: length에서 빼기
      progress.set(length - ((time * pxPerMillisecond) % length));
    }
  });

  const x = useTransform(
    progress,
    (val) => pathRef.current?.getPointAtLength(val).x ?? 0
  );
  const y = useTransform(
    progress,
    (val) => pathRef.current?.getPointAtLength(val).y ?? 0
  );

  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="absolute h-full w-full"
        width="100%"
        height="100%"
      >
        <rect
          fill="none"
          width="100%"
          height="100%"
          rx={rx}
          ry={ry}
          ref={pathRef}
        />
      </svg>
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          display: "inline-block",
          transform,
        }}
      >
        {children}
      </motion.div>
    </>
  );
}

const STATS = [
  { value: 250, suffix: "건+", label: "누적 프로젝트", desc: "기획·운영 실적" },
  { value: 50, suffix: "+", label: "클라이언트", desc: "신뢰하는 파트너" },
  { value: 93, suffix: "점", label: "참가자 만족도", desc: "평균 평가 점수" },
  { value: 90, suffix: "%", label: "재계약률", desc: "지속되는 신뢰" },
];

// 카드별 다른 속도
const DURATIONS = [2500, 3800, 3000, 4500];

interface StatCardProps {
  value: number;
  suffix: string;
  label: string;
  desc: string;
  delay: number;
  duration: number;
  started: boolean;
}

function MovingBorderStatCard({ value, suffix, label, desc, delay, duration, started }: StatCardProps) {
  const [show, setShow] = useState(false);
  const count = useCountUp(value, 2000, show);

  useEffect(() => {
    if (!started) return;
    const t = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(t);
  }, [started, delay]);

  const isDecimal = value % 1 !== 0;
  const displayValue = isDecimal ? count.toFixed(1) : Math.floor(count).toLocaleString("ko-KR");
  const borderRadius = "0.75rem";

  return (
    <div
      className={`
        relative p-[1px] overflow-hidden transition-all duration-700
        ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
      `}
      style={{ borderRadius, transitionDelay: show ? "0ms" : `${delay}ms` }}
    >
      {/* 반시계 방향 무빙 보더 */}
      <div
        className="absolute inset-0"
        style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}
      >
        <CounterClockwiseBorder duration={duration} rx="30%" ry="30%">
          <div className="h-20 w-20 opacity-[0.8] bg-[radial-gradient(#818CF8_40%,transparent_60%)]" />
        </CounterClockwiseBorder>
      </div>

      {/* 카드 내용 */}
      <div
        className="relative backdrop-blur-xl bg-slate-900/80 border border-slate-700/30 p-6 md:p-8 text-center"
        style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}
      >
        <div className="font-num text-4xl md:text-5xl font-bold tracking-tight text-white">
          {displayValue}
          <span className="text-2xl md:text-3xl ml-0.5 text-indigo-400">{suffix}</span>
        </div>
        <p className="text-sm font-semibold mt-3 text-white/90">{label}</p>
        <p className="text-xs mt-1 text-slate-500">{desc}</p>
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function StatsCounter({ theme }: { theme: ThemeKey }) {
  const { ref, inView } = useInView(0.3);

  return (
    <section
      ref={ref}
      className="relative py-16 md:py-20 bg-[#0B1120]"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B1120] via-[#0d1526] to-[#0B1120]" />

      <div className="relative z-10 max-w-content mx-auto px-6 lg:pl-[176px]">
        <div
          className={`text-center mb-10 md:mb-14 transition-all duration-700 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            숫자로 증명하는 신뢰
          </h2>
          <p className="mt-3 text-slate-400 text-sm">
            파란컴퍼니가 만들어온 성과입니다
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {STATS.map((stat, i) => (
            <MovingBorderStatCard
              key={stat.label}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              desc={stat.desc}
              delay={i * 150}
              duration={DURATIONS[i]}
              started={inView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
