"use client";

import { motion } from "framer-motion";
import { PulsatingButton } from "@/components/ui/pulsating-button";
import { BlurFade } from "@/components/ui/blur-fade";
import CertBadges from "@/components/common/CertBadges";
import { TitleGlitchReveal } from "./HeroTitleAnimations";

const HeroVideo = () => (
  <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-2xl shadow-blue-900/30 backdrop-blur-sm">
    <div className="relative aspect-video w-full bg-black/60">
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/hero-poster.jpg"
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>
    </div>
  </div>
);

export default function HeroParticle() {

  return (
    <section id="hero" className="relative flex items-center overflow-hidden bg-[#070720] lg:min-h-screen">

      {/* Content: Left text + Right video */}
      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-8 px-6 pt-24 pb-10 md:gap-12 md:px-12 md:pb-16 lg:grid-cols-2 lg:gap-16 lg:pt-0 lg:pb-0">
        {/* Left: Text */}
        <div>
          <div>
            <TitleGlitchReveal />
          </div>

          <div className="sm:w-fit">
          <BlurFade delay={0.3}>
            <div className="mb-5 text-sm leading-relaxed text-white/40 md:mb-8 md:text-base md:leading-relaxed">
              <span className="block tracking-[0.2em]">파란컴퍼니 | 행사 전문 에이전시</span>
              <span className="block tracking-normal">기획 · 디자인 · 운영 · 결과보고 <span className="whitespace-nowrap">— 한 팀이 원스톱으로 처리</span></span>
            </div>
          </BlurFade>

          {/* Mobile: 영상 (서브카피 바로 아래) */}
          <BlurFade delay={0.35}>
            <div className="mb-5 lg:hidden">
              <HeroVideo />
            </div>
          </BlurFade>

          <BlurFade delay={0.4}>
            <div className="mb-6 flex flex-col gap-3 sm:flex-row md:mb-10 md:gap-4">
              <PulsatingButton
                pulseColor="#2563eb"
                className="bg-blue-600 px-8 py-3.5 text-base font-semibold md:py-4"
                onClick={() => document.querySelector("#estimate")?.scrollIntoView({ behavior: "smooth" })}
              >
                무료 견적 보기
              </PulsatingButton>
              <motion.button
                whileHover={{ scale: 1.05, borderColor: "rgba(59,130,246,0.5)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.querySelector("#portfolio")?.scrollIntoView({ behavior: "smooth" })}
                className="relative hidden overflow-hidden rounded-lg border border-white/30 bg-white/10 px-8 py-3.5 text-sm font-semibold text-white/80 backdrop-blur-sm transition-colors hover:bg-white/20 hover:text-white sm:block md:py-4"
              >
                <span className="relative z-10">포트폴리오</span>
                <div
                  className="absolute inset-0 animate-[light-sweep_3s_ease-in-out_infinite] opacity-40"
                  style={{
                    background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.3) 50%, transparent 60%)",
                    backgroundSize: "200% 100%",
                  }}
                />
              </motion.button>
            </div>
          </BlurFade>
          </div>

          {/* Stats row */}
          <BlurFade delay={0.5}>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:gap-4">
              {[
                { key: "projects", value: "250+", label: "수행 프로젝트", gradient: "from-blue-400/20 to-cyan-400/20" },
                { key: "renewal", value: "90%", label: "재계약률", gradient: "from-violet-400/20 to-blue-400/20" },
                { key: "satisfaction", value: "93점", label: "참가자 만족도", gradient: "from-sky-400/20 to-indigo-400/20" },
                { key: "clients", value: "50+", label: "클라이언트", gradient: "from-cyan-400/20 to-blue-400/20" },
              ].map((stat) => (
                <div
                  key={stat.key}
                  className={`rounded-xl bg-gradient-to-br ${stat.gradient} px-4 py-3 backdrop-blur-lg md:py-4`}
                >
                  <div className="text-xl font-bold text-white">{stat.value}</div>
                  <div className="mt-0.5 text-xs text-white/50 md:mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </BlurFade>

          {/* 공공 입찰·수의계약 적격 인증 (클릭 시 원본) */}
          <BlurFade delay={0.6}>
            <div className="mt-5">
              <CertBadges variant="dark" />
            </div>
          </BlurFade>
        </div>

        {/* Right: Video (PC만) */}
        <BlurFade delay={0.3} className="hidden lg:block">
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            {/* Glow behind video */}
            <div className="absolute -inset-4 rounded-3xl bg-blue-500/10 blur-2xl" />
            <HeroVideo />
          </motion.div>
        </BlurFade>
      </div>
    </section>
  );
}
