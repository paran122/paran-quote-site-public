"use client";

import { useState } from "react";
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

type CardStyle = "A" | "B" | "C" | "D" | "E";
const GUIDE_ILLUSTS: Record<string, string> = {
  "/guide/checklist": "/guide-icons/checklist-3.png",
  "/guide/process": "/guide-icons/process.png",
  "/guide/pricing": "/guide-icons/pricing.png",
  "/guide/venue": "/guide-icons/venue.png",
  "/guide/scale": "/guide-icons/scale.png",
};

const GUIDE_ICONS: Record<string, LucideIcon> = {
  "/guide/checklist": ClipboardCheck,
  "/guide/process": ListOrdered,
  "/guide/pricing": Calculator,
  "/guide/venue": MapPin,
  "/guide/scale": Users,
};

const GUIDE_COLORS: Record<string, { bg: string; icon: string; accent: string }> = {
  "/guide/checklist": { bg: "from-blue-50 to-blue-100", icon: "text-blue-500", accent: "bg-blue-500" },
  "/guide/process": { bg: "from-violet-50 to-violet-100", icon: "text-violet-500", accent: "bg-violet-500" },
  "/guide/pricing": { bg: "from-emerald-50 to-emerald-100", icon: "text-emerald-500", accent: "bg-emerald-500" },
  "/guide/venue": { bg: "from-amber-50 to-amber-100", icon: "text-amber-500", accent: "bg-amber-500" },
  "/guide/scale": { bg: "from-rose-50 to-rose-100", icon: "text-rose-500", accent: "bg-rose-500" },
};

const STYLE_LABELS: Record<CardStyle, string> = {
  A: "A. 링크카드",
  B: "B. 다크 피처",
  C: "C. 가로형",
  D: "D. 센터 아이콘",
  E: "E. 그라데이션",
};

/* ────────────────────────────────────────────
 *  A: 링크카드 스타일 — 텍스트 왼쪽 위, 큰 아이콘 오른쪽 아래
 * ──────────────────────────────────────────── */
function CardA({ href, label, desc }: { href: string; label: string; desc: string }) {
  const Icon = GUIDE_ICONS[href];
  const color = GUIDE_COLORS[href];
  return (
    <motion.div whileHover={{ scale: 1.03, y: -5 }} transition={{ type: "spring", stiffness: 300, damping: 15 }}>
      <Link
        href={href}
        className={`group relative flex h-64 flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-br ${color.bg} p-6 shadow-sm transition-shadow hover:shadow-lg`}
      >
        <div className="z-10">
          <h2 className="text-lg font-bold text-slate-900 md:text-xl">{label}</h2>
          <p className="mt-2 max-w-[75%] text-sm leading-relaxed text-slate-500">{desc}</p>
        </div>
        <span className="z-10 inline-flex items-center gap-1 text-sm font-medium text-blue-600">
          자세히 보기 <ArrowRight size={14} />
        </span>
        {Icon && (
          <div className="absolute -bottom-4 -right-4 opacity-15">
            <Icon size={140} strokeWidth={1} />
          </div>
        )}
      </Link>
    </motion.div>
  );
}

/* ────────────────────────────────────────────
 *  B: 다크 피처 스타일 — 어두운 배경, 큰 아이콘 상단
 * ──────────────────────────────────────────── */
function CardB({ href, label, desc }: { href: string; label: string; desc: string }) {
  const Icon = GUIDE_ICONS[href];
  const color = GUIDE_COLORS[href];
  return (
    <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
      <Link
        href={href}
        className="group flex h-72 flex-col rounded-2xl border border-slate-700/50 bg-slate-900 p-6 shadow-lg transition-shadow hover:shadow-2xl"
      >
        {Icon && (
          <div className={`mb-5 ${color.icon}`}>
            <Icon size={44} strokeWidth={1.5} />
          </div>
        )}
        <h2 className="text-lg font-bold text-white md:text-xl">{label}</h2>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-400">{desc}</p>
        <div className="mt-4 flex items-center gap-1 text-sm font-medium text-slate-300 transition-colors group-hover:text-white">
          자세히 보기 <ArrowRight size={14} />
        </div>
      </Link>
    </motion.div>
  );
}

/* ────────────────────────────────────────────
 *  C: 가로형 — 아이콘 왼쪽, 텍스트 오른쪽
 * ──────────────────────────────────────────── */
function CardC({ href, label, desc }: { href: string; label: string; desc: string }) {
  const Icon = GUIDE_ICONS[href];
  const color = GUIDE_COLORS[href];
  return (
    <motion.div whileHover={{ x: 4 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
      <Link
        href={href}
        className="group flex items-start gap-5 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all hover:border-blue-200 hover:shadow-md"
      >
        {Icon && (
          <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${color.bg}`}>
            <Icon size={28} strokeWidth={1.8} className={color.icon} />
          </div>
        )}
        <div className="flex-1">
          <h2 className="text-base font-bold text-slate-900 md:text-lg">{label}</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{desc}</p>
          <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-blue-600 transition-colors group-hover:text-blue-500">
            자세히 보기 <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

/* ────────────────────────────────────────────
 *  D: 센터 아이콘 — 아이콘 가운데 크게, 텍스트 아래
 * ──────────────────────────────────────────── */
function CardD({ href, label, desc, illustSrc }: { href: string; label: string; desc: string; illustSrc?: string }) {
  const Icon = GUIDE_ICONS[href];
  return (
    <motion.div whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 300, damping: 15 }}>
      <Link
        href={href}
        className="group flex h-48 flex-col items-center rounded-xl border border-slate-200/80 bg-white p-3 text-center shadow-sm transition-all hover:border-blue-200 hover:shadow-lg sm:h-80 sm:rounded-2xl sm:p-6"
      >
        {illustSrc ? (
          <div className="mb-2 flex h-16 w-16 items-center justify-center overflow-hidden transition-transform group-hover:scale-105 sm:mb-4 sm:h-28 sm:w-28">
            <img src={illustSrc} alt={label} className="h-full w-full object-contain" />
          </div>
        ) : Icon ? (
          <div className="mb-2 flex h-16 w-16 items-center justify-center text-slate-300 sm:mb-4 sm:h-28 sm:w-28">
            <Icon size={36} strokeWidth={1.2} className="sm:hidden" />
            <Icon size={56} strokeWidth={1.2} className="hidden sm:block" />
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
 *  E: 그라데이션 — 컬러 상단 배경 + 아이콘 + 하단 텍스트
 * ──────────────────────────────────────────── */
function CardE({ href, label, desc }: { href: string; label: string; desc: string }) {
  const Icon = GUIDE_ICONS[href];
  const color = GUIDE_COLORS[href];
  return (
    <motion.div whileHover={{ scale: 1.03 }} transition={{ type: "spring", stiffness: 300, damping: 15 }}>
      <Link
        href={href}
        className="group flex h-72 flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all hover:shadow-lg"
      >
        {/* 상단 컬러 영역 */}
        <div className={`flex h-28 items-center justify-center bg-gradient-to-br ${color.bg}`}>
          {Icon && <Icon size={48} strokeWidth={1.5} className={`${color.icon} transition-transform group-hover:scale-110`} />}
        </div>
        {/* 하단 텍스트 */}
        <div className="flex flex-1 flex-col p-5">
          <h2 className="text-base font-bold text-slate-900 md:text-lg">{label}</h2>
          <p className="mt-1.5 flex-1 text-sm leading-relaxed text-slate-500">{desc}</p>
          <span className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-blue-600">
            자세히 보기 <ArrowRight size={14} />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

/* ────────────────────────────────────────────
 *  메인 페이지
 * ──────────────────────────────────────────── */
export default function GuideIndexClient() {
  const [style] = useState<CardStyle>("D");

  const CardComponent = { A: CardA, B: CardB, C: CardC, D: CardD, E: CardE }[style];

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
              const illustSrc = GUIDE_ILLUSTS[menu.href];
              return (
                <motion.div
                  key={menu.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.35 }}
                >
                  <CardD href={menu.href} label={menu.label} desc={menu.desc} illustSrc={illustSrc} />
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
