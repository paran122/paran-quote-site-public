"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { SearchX } from "lucide-react";
import { Particles } from "@/components/ui/particles";
import { PulsatingButton } from "@/components/ui/pulsating-button";
import GNB from "@/components/layout/GNB";
import Footer from "@/components/layout/Footer";

const ease = [0.43, 0.13, 0.23, 0.96] as const;

const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease, delayChildren: 0.1, staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease },
  },
};

const numberVariants = {
  hidden: (direction: number) => ({
    opacity: 0,
    x: direction * 40,
    y: 15,
    rotate: direction * 5,
  }),
  visible: {
    opacity: 0.7,
    x: 0,
    y: 0,
    rotate: 0,
    transition: { duration: 0.8, ease },
  },
};

const iconVariants = {
  hidden: { scale: 0.8, opacity: 0, y: 15, rotate: -5 },
  visible: {
    scale: 1,
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: { duration: 0.6, ease },
  },
  floating: {
    y: [-5, 5],
    transition: {
      y: { duration: 2, ease: "easeInOut" as const, repeat: Infinity, repeatType: "reverse" as const },
    },
  },
} satisfies import("framer-motion").Variants;

export default function NotFound() {
  return (
    <>
      <GNB />
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#050510] px-4">
        {/* Particles */}
        <Particles quantity={80} staticity={15} ease={30} color="#60a5fa" className="opacity-70" />
        <Particles quantity={30} staticity={10} ease={20} color="#22d3ee" className="opacity-40" />

        {/* Glow orbs */}
        <div className="pointer-events-none absolute -left-40 top-1/4 h-96 w-96 rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="pointer-events-none absolute -right-40 bottom-1/4 h-96 w-96 rounded-full bg-indigo-600/15 blur-[120px]" />

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            className="relative z-10 text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {/* 4 [icon] 4 */}
            <div className="mb-8 flex items-center justify-center gap-4 md:mb-12 md:gap-6">
              <motion.span
                className="select-none font-num text-[80px] font-bold text-white/70 md:text-[120px]"
                variants={numberVariants}
                custom={-1}
              >
                4
              </motion.span>
              <motion.div variants={iconVariants} animate={["visible", "floating"]}>
                <SearchX className="h-[72px] w-[72px] text-primary-400 md:h-[100px] md:w-[100px]" strokeWidth={1.5} />
              </motion.div>
              <motion.span
                className="select-none font-num text-[80px] font-bold text-white/70 md:text-[120px]"
                variants={numberVariants}
                custom={1}
              >
                4
              </motion.span>
            </div>

            {/* Title */}
            <motion.h1
              className="mb-4 select-none font-display text-2xl font-bold text-white/80 md:mb-6 md:text-4xl"
              variants={itemVariants}
            >
              페이지를 찾을 수 없습니다
            </motion.h1>

            {/* Description */}
            <motion.p
              className="mb-8 select-none text-sm text-white/50 md:mb-12 md:text-base"
              variants={itemVariants}
            >
              요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다
            </motion.p>

            {/* CTA Button */}
            <motion.div className="flex justify-center" variants={itemVariants}>
              <Link href="/">
                <PulsatingButton className="px-8 py-3 text-sm font-semibold md:text-base">
                  홈으로 돌아가기
                </PulsatingButton>
              </Link>
            </motion.div>

            {/* Sub links */}
            <motion.div
              className="mt-10 flex items-center justify-center gap-6 text-sm md:mt-12"
              variants={itemVariants}
            >
              <Link
                href="/work"
                className="select-none text-white/40 underline underline-offset-4 transition-colors hover:text-white/70"
              >
                포트폴리오 보기
              </Link>
              <span className="text-white/20">|</span>
              <Link
                href="/?scrollTo=contact"
                className="select-none text-white/40 underline underline-offset-4 transition-colors hover:text-white/70"
              >
                견적 문의하기
              </Link>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
      <Footer />
    </>
  );
}
