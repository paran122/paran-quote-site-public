"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Phone,
  MessageCircle,
  ArrowRight,
  ClipboardCheck,
  ListOrdered,
  Calculator,
  MapPin,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { BlurFade } from "@/components/ui/blur-fade";
import { GUIDE_MENUS } from "./GuideClient";

const GUIDE_ICONS: Record<string, LucideIcon> = {
  "/guide/checklist": ClipboardCheck,
  "/guide/process": ListOrdered,
  "/guide/pricing": Calculator,
  "/guide/venue": MapPin,
  "/guide/scale": Users,
};



/* ────────────────────────────────────────────
 *  D: 센터 아이콘 — 아이콘 가운데 크게, 텍스트 아래
 * ──────────────────────────────────────────── */
function CardD({ href, label, desc }: { href: string; label: string; desc: string }) {
  const Icon = GUIDE_ICONS[href];
  return (
    <motion.div whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 300, damping: 15 }}>
      <Link
        href={href}
        className="group flex h-48 flex-col items-center rounded-xl border border-slate-200/80 bg-white p-3 text-center shadow-sm transition-all hover:border-blue-200 hover:shadow-lg sm:h-80 sm:rounded-2xl sm:p-6"
      >
        {Icon ? (
          <div className="mb-2 mt-1 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-transform group-hover:scale-105 sm:mb-4 sm:mt-6 sm:h-20 sm:w-20 sm:rounded-2xl">
            <Icon size={24} strokeWidth={1.6} className="sm:hidden" />
            <Icon size={36} strokeWidth={1.6} className="hidden sm:block" />
          </div>
        ) : null}
        <h2 className="text-[13px] font-bold text-slate-900 sm:text-lg">{label}</h2>
        <p className="mt-1 flex-1 text-[11px] leading-relaxed text-slate-500 sm:mt-2 sm:text-sm">{desc}</p>
        <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 sm:mt-3 sm:text-sm">
          자세히 보기 <ArrowRight size={12} className="sm:hidden" /><ArrowRight size={14} className="hidden sm:block" />
        </span>
      </Link>
    </motion.div>
  );
}


/* ────────────────────────────────────────────
 *  메인 페이지
 * ──────────────────────────────────────────── */
export default function GuideIndexClient() {
  return (
    <div className="min-h-screen bg-slate-50 pt-[56px]">
      {/* Hero */}
      <section className="py-12 text-center md:py-16">
        <BlurFade>
          <p className="text-xs font-medium uppercase tracking-widest text-blue-600">Guide</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl lg:text-4xl">행사 가이드</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-slate-500">
            성공적인 행사 기획에 필요한 실무 정보를 주제별로 정리했습니다
          </p>
        </BlurFade>
      </section>


      {/* 가이드 카드 */}
      <BlurFade delay={0.15}>
        <section className="mx-auto max-w-5xl px-4 pb-20 md:px-6">
          <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
            {GUIDE_MENUS.map((menu, i) => {
              return (
                <motion.div
                  key={menu.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.35 }}
                >
                  <CardD href={menu.href} label={menu.label} desc={menu.desc} />
                </motion.div>
              );
            })}
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
