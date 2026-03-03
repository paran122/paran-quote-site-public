"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import { BlurFade } from "@/components/ui/blur-fade";

const stats = [
  { key: "PROJECTS", num: 250, suffix: "건", plus: true, label: "프로젝트 수행", color: "blue" },
  { key: "CLIENTS", num: 50, suffix: "개사", plus: true, label: "클라이언트", color: "violet" },
  { key: "RENEWAL", num: 90, suffix: "%", plus: false, label: "재계약률", color: "sky" },
  { key: "SATISFACTION", num: 93, suffix: "점", plus: false, label: "참가자 만족도", color: "indigo" },
  { key: "ANNUAL", num: 100, suffix: "회", plus: true, label: "연간 행사 수행", color: "cyan" },
  { key: "PARTNERS", num: 40, suffix: "개", plus: true, label: "파트너 기관", color: "purple" },
];

const maxNums: Record<string, number> = { PROJECTS: 300, CLIENTS: 100, RENEWAL: 100, SATISFACTION: 100, ANNUAL: 150, PARTNERS: 50 };

type ColorDef = { stroke: string; glow: string };
const colors: Record<string, ColorDef> = {
  blue: { stroke: "#3b82f6", glow: "rgba(59,130,246,0.35)" },
  violet: { stroke: "#8b5cf6", glow: "rgba(139,92,246,0.35)" },
  sky: { stroke: "#0ea5e9", glow: "rgba(14,165,233,0.35)" },
  indigo: { stroke: "#6366f1", glow: "rgba(99,102,241,0.35)" },
  cyan: { stroke: "#06b6d4", glow: "rgba(6,182,212,0.35)" },
  purple: { stroke: "#a855f7", glow: "rgba(168,85,247,0.35)" },
};

function CountUpLoop({ target, plus }: { target: number; plus: boolean }) {
  const [count, setCount] = useState(0);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    const dur = 1800;
    const start = performance.now();
    let raf: number;
    function tick(now: number) {
      const p = Math.min((now - start) / dur, 1);
      const e = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      setCount(Math.round(e * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, cycle]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(0);
      setCycle((c) => c + 1);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return <>{count}{plus && "+"}</>;
}

function StatCard({ s, i }: { s: typeof stats[0]; i: number }) {
  const rOuter = 44, rInner = 34;
  const circOuter = 2 * Math.PI * rOuter, circInner = 2 * Math.PI * rInner;
  const c = colors[s.color];
  const pct = s.num / (maxNums[s.key] || 100);
  const outerCtrl = useAnimation();
  const innerCtrl = useAnimation();

  const animate = useCallback(async () => {
    while (true) {
      outerCtrl.set({ strokeDashoffset: circOuter });
      innerCtrl.set({ strokeDashoffset: circInner });
      outerCtrl.start({
        strokeDashoffset: circOuter * (1 - pct),
        transition: { delay: i * 0.1 + 0.2, duration: 1.4, ease: "easeOut" },
      });
      await innerCtrl.start({
        strokeDashoffset: circInner * (1 - pct),
        transition: { delay: i * 0.1 + 0.5, duration: 1.2, ease: "easeOut" },
      });
      await new Promise((res) => setTimeout(res, 4000));
    }
  }, [outerCtrl, innerCtrl, circOuter, circInner, pct, i]);

  const cardRef = useRef<HTMLDivElement>(null);
  const inView = useInView(cardRef, { once: false, margin: "-60px" });

  useEffect(() => {
    if (inView) animate();
    return () => { outerCtrl.stop(); innerCtrl.stop(); };
  }, [inView, animate, outerCtrl, innerCtrl]);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, rotateX: 20 }}
      whileInView={{ opacity: 1, rotateX: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.1, duration: 0.6 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="flex flex-col items-center rounded-lg bg-gray-900 px-1.5 py-2 shadow-lg sm:rounded-2xl sm:p-5"
    >
      <div className="relative h-[55px] w-[55px] sm:h-[100px] sm:w-[100px]">
        <svg className="-rotate-90" width="100%" height="100%" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={rOuter} fill="none" stroke="#1e293b" strokeWidth="2" />
          <motion.circle
            cx="50" cy="50" r={rOuter} fill="none"
            stroke={c.stroke} strokeWidth="2" strokeLinecap="round"
            strokeDasharray={circOuter}
            initial={{ strokeDashoffset: circOuter }}
            animate={outerCtrl}
            opacity={0.35}
            style={{ filter: `drop-shadow(0 0 3px ${c.glow})` }}
          />
          <circle cx="50" cy="50" r={rInner} fill="none" stroke="#1e293b" strokeWidth="4" />
          <motion.circle
            cx="50" cy="50" r={rInner} fill="none"
            stroke={c.stroke} strokeWidth="4" strokeLinecap="round"
            strokeDasharray={circInner}
            initial={{ strokeDashoffset: circInner }}
            animate={innerCtrl}
            style={{ filter: `drop-shadow(0 0 6px ${c.glow})` }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-white">
          <span className="text-[11px] font-extrabold leading-none sm:text-[18px]">
            <CountUpLoop target={s.num} plus={s.plus} />
          </span>
          <span className="ml-0.5 text-[8px] font-bold text-white/50 sm:text-[11px]">{s.suffix}</span>
        </div>
      </div>
      <div className="mt-1 text-[9px] font-semibold text-white sm:mt-3 sm:text-[13px]">{s.label}</div>
    </motion.div>
  );
}

export default function About() {
  return (
    <section id="about" className="hidden md:block relative overflow-hidden bg-gradient-to-b from-white to-blue-50/50 px-6 py-12 md:px-12 md:py-24 lg:px-20">
      <div className="pointer-events-none absolute -right-32 -top-32 h-64 w-64 rounded-full bg-blue-100/60 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-1 font-[var(--font-inter)] text-sm font-extrabold tracking-[0.25em] text-blue-500/80 md:text-base">ABOUT US</div>
        <div className="mb-4 h-[2px] w-10 rounded-full bg-blue-400" />
        <h2 className="mb-4 whitespace-nowrap text-[6.5vw] font-bold text-gray-900 md:mb-6 md:text-5xl">
          {"행사의 모든 것, ".split("").map((char, i) => (
            <motion.span
              key={`a-${i}`}
              animate={{ opacity: [0, 1, 1, 0], x: [-20, 0, 0, -20] }}
              transition={{ duration: 3, delay: i * 0.05, repeat: Infinity, repeatDelay: 1 }}
              className="inline-block"
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
          {"원스톱".split("").map((char, i) => (
            <motion.span
              key={`b-${i}`}
              animate={{ opacity: [0, 1, 1, 0], x: [-20, 0, 0, -20] }}
              transition={{ duration: 3, delay: (9 + i) * 0.05, repeat: Infinity, repeatDelay: 1 }}
              className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
            >
              {char}
            </motion.span>
          ))}
          {"으로".split("").map((char, i) => (
            <motion.span
              key={`c-${i}`}
              animate={{ opacity: [0, 1, 1, 0], x: [-20, 0, 0, -20] }}
              transition={{ duration: 3, delay: (12 + i) * 0.05, repeat: Infinity, repeatDelay: 1 }}
              className="inline-block"
            >
              {char}
            </motion.span>
          ))}
        </h2>

        <BlurFade delay={0.2}>
          <p className="mb-8 max-w-2xl text-sm leading-relaxed text-gray-500 md:mb-14 md:text-base" style={{ wordBreak: "keep-all" }}>
            창의적 기획과 전문적 실행력을 바탕으로 세미나·컨퍼런스·포럼·축제 등
            행사 기획·운영부터 로비·조형물·체험존 등 공간 디자인, 콘텐츠 제작까지
            원스톱으로 제공하는 행사 전문 에이전시입니다.
          </p>
        </BlurFade>

        <div className="grid grid-cols-3 gap-1.5 sm:gap-5 lg:grid-cols-6">
          {stats.map((s, i) => (
            <StatCard key={s.key} s={s} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
