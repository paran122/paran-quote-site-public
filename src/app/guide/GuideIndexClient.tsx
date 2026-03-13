"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Phone, MessageCircle, ArrowRight } from "lucide-react";
import { BlurFade } from "@/components/ui/blur-fade";
import { GUIDE_MENUS } from "./GuideClient";

export default function GuideIndexClient() {
  return (
    <div className="min-h-screen bg-slate-50 pt-[56px]">
      {/* Hero */}
      <section className="py-12 text-center md:py-16">
        <BlurFade>
          <p className="text-xs font-medium uppercase tracking-widest text-blue-600">
            Guide
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl lg:text-4xl">
            행사 가이드
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-slate-500">
            성공적인 행사 기획에 필요한 실무 정보를 주제별로 정리했습니다
          </p>
        </BlurFade>
      </section>

      {/* 가이드 카드 목록 */}
      <BlurFade delay={0.15}>
        <section className="mx-auto max-w-4xl px-4 pb-20 md:px-6">
          <div className="flex flex-wrap justify-center gap-4">
            {GUIDE_MENUS.map((menu, i) => (
              <motion.div
                key={menu.href}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.35 }}
                className="w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.75rem)]"
              >
                <Link
                  href={menu.href}
                  className="group flex h-full flex-col rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all hover:border-blue-200 hover:shadow-md"
                >
                  <h2 className="text-base font-bold text-slate-900 md:text-lg">
                    {menu.label}
                  </h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-500">
                    {menu.desc}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-blue-600 transition-colors group-hover:text-blue-500">
                    자세히 보기
                    <ArrowRight
                      size={14}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      </BlurFade>

      {/* CTA */}
      <BlurFade delay={0.1}>
        <section className="px-4 py-16 text-center md:px-6 md:py-20">
          <h2 className="text-xl font-bold text-slate-900 md:text-2xl">
            행사 기획, 어디서부터 시작할지 고민이신가요?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-slate-500">
            전화, 카카오톡, 또는 홈페이지를 통해 편하게 문의해 주세요.
          </p>
          <div className="mx-auto mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <a
              href="/#contact"
              className="inline-flex items-center rounded-lg bg-blue-600 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
            >
              무료 상담 받기
            </a>
            <a
              href="tel:02-6342-2802"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
            >
              <Phone size={15} />
              02-6342-2802
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
