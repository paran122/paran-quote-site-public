"use client";

import { motion } from "framer-motion";
import { Particles } from "@/components/ui/particles";
import { PulsatingButton } from "@/components/ui/pulsating-button";
import { BlurFade } from "@/components/ui/blur-fade";
import { TitleGlitchReveal } from "./HeroTitleAnimations";

export default function HeroParticle() {

  return (
    <section id="hero" className="relative flex min-h-screen items-center overflow-hidden bg-[#050510]">
      {/* Primary particles */}
      <Particles
        quantity={120}
        staticity={15}
        ease={30}
        color="#60a5fa"
        className="opacity-80"
      />
      {/* Secondary particles */}
      <Particles
        quantity={40}
        staticity={10}
        ease={20}
        color="#22d3ee"
        className="opacity-50"
      />

      {/* Glow orbs */}
      <div className="pointer-events-none absolute -left-40 top-1/4 h-96 w-96 rounded-full bg-blue-600/20 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 bottom-1/4 h-96 w-96 rounded-full bg-indigo-600/15 blur-[120px]" />

      {/* Subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `linear-gradient(rgba(96,165,250,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(96,165,250,0.4) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Content: Left text + Right video */}
      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 px-6 pt-24 pb-16 md:px-12 lg:grid-cols-2 lg:gap-16 lg:pt-0 lg:pb-0">
        {/* Left: Text */}
        <div>
          <div>
            <TitleGlitchReveal />
          </div>

          <div className="sm:w-fit">
          <BlurFade delay={0.3}>
            <div className="mb-8 text-sm leading-relaxed text-white/40 md:text-base md:leading-relaxed">
              <span className="block tracking-[0.2em]">파란컴퍼니 | 행사 전문 에이전시</span>
              <span className="block tracking-[0.15em] sm:tracking-normal sm:text-justify sm:[text-align-last:justify]">기획 → 디자인 → 운영 → 평가 → 완성</span>
            </div>
          </BlurFade>

          <BlurFade delay={0.4}>
            <div className="mb-10 flex flex-col gap-4 sm:flex-row">
              <PulsatingButton
                pulseColor="#2563eb"
                className="bg-blue-600 px-8 py-4 text-base font-semibold"
                onClick={() => document.querySelector("#estimate")?.scrollIntoView({ behavior: "smooth" })}
              >
                프로젝트 시작하기
              </PulsatingButton>
              <motion.button
                whileHover={{ scale: 1.05, borderColor: "rgba(59,130,246,0.5)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.querySelector("#portfolio")?.scrollIntoView({ behavior: "smooth" })}
                className="relative overflow-hidden rounded-lg border border-white/30 bg-white/10 px-8 py-4 text-sm font-semibold text-white/80 backdrop-blur-sm transition-colors hover:bg-white/20 hover:text-white"
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
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { key: "projects", value: "250+", label: "수행 프로젝트", gradient: "from-blue-400/20 to-cyan-400/20" },
                { key: "renewal", value: "90%", label: "재계약률", gradient: "from-violet-400/20 to-blue-400/20" },
                { key: "satisfaction", value: "93점", label: "참가자 만족도", gradient: "from-sky-400/20 to-indigo-400/20" },
                { key: "clients", value: "50+", label: "클라이언트", gradient: "from-cyan-400/20 to-blue-400/20" },
              ].map((stat) => (
                <div
                  key={stat.key}
                  className={`rounded-xl bg-gradient-to-br ${stat.gradient} px-4 py-4 backdrop-blur-lg`}
                >
                  <div className="text-xl font-bold text-white">{stat.value}</div>
                  <div className="mt-1 text-xs text-white/50">{stat.label}</div>
                </div>
              ))}
            </div>
          </BlurFade>
        </div>

        {/* Right: Video */}
        <BlurFade delay={0.3}>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            {/* Glow behind video */}
            <div className="absolute -inset-4 rounded-3xl bg-blue-500/10 blur-2xl" />

            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-2xl shadow-blue-900/30 backdrop-blur-sm">

              {/* Self-hosted video */}
              <div className="relative aspect-video w-full bg-black/60">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  className="absolute inset-0 h-full w-full object-cover"
                >
                  <source src="/hero-video.mp4" type="video/mp4" />
                </video>
              </div>
            </div>
          </motion.div>
        </BlurFade>
      </div>
    </section>
  );
}
