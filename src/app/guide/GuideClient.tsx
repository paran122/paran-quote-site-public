"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Phone, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { BlurFade } from "@/components/ui/blur-fade";

/* ─── 가이드 메뉴 ─── */
export const GUIDE_MENUS = [
  { href: "/guide/checklist", label: "행사 준비 체크리스트", desc: "기획부터 마무리까지 4단계 체크리스트" },
  { href: "/guide/process", label: "진행 절차", desc: "상담부터 결과보고까지 7단계" },
  { href: "/guide/pricing", label: "행사 비용 가이드", desc: "항목별 비용 범위와 예산 설계" },
  { href: "/guide/venue", label: "행사 장소 선택", desc: "장소 유형별 특성과 체크포인트" },
  { href: "/guide/scale", label: "규모별 가이드", desc: "30명부터 500명까지 규모별 준비사항" },
] as const;

/* ─── 공통 레이아웃 ─── */
interface GuideClientProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export default function GuideClient({ title, description, children }: GuideClientProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-50 pt-[56px]">
      {/* Hero */}
      <section className="py-12 text-center md:py-16">
        <BlurFade>
          <p className="text-xs font-medium uppercase tracking-widest text-blue-600">Guide</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl lg:text-4xl">
            {title}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-slate-500">{description}</p>
        </BlurFade>
      </section>

      {/* Nav + Content */}
      <BlurFade delay={0.15}>
        <section className="mx-auto max-w-4xl px-4 pb-20 md:px-6">
          {/* 탭 네비게이션 */}
          <div className="relative border-b border-slate-200">
            {/* 모바일 스크롤 힌트: 오른쪽 그라데이션 */}
            <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-8 bg-gradient-to-l from-slate-50 to-transparent md:hidden" />
            <div className="-mx-4 flex gap-1 overflow-x-auto px-4 pb-px scrollbar-none md:mx-0 md:px-0">
              {GUIDE_MENUS.map((menu) => {
                const isActive = pathname === menu.href;
                return (
                  <Link
                    key={menu.href}
                    href={menu.href}
                    className={cn(
                      "relative shrink-0 px-3 py-2.5 text-xs font-medium transition-colors md:px-4 md:text-sm",
                      isActive ? "text-slate-900" : "text-slate-400 hover:text-slate-600"
                    )}
                  >
                    {menu.label}
                    {isActive && (
                      <motion.div
                        layoutId="guide-tab-indicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* 콘텐츠 */}
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="mt-8"
          >
            {children}
          </motion.div>
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
