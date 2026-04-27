"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import GuideClient from "../GuideClient";
import { PRICE_CATEGORIES, PACKAGE_EXAMPLES, formatPriceRange } from "@/lib/pricing";

export default function PricingClient() {
  return (
    <GuideClient
      title="행사 대행 비용·견적 안내"
      description="항목별 가격과 규모별 예산 가이드를 확인하세요"
    >
      <div className="space-y-8">
        {/* 안내 문구 */}
        <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-4">
          <p className="text-sm leading-relaxed text-slate-500">
            아래 행사 대행 비용은 소규모 기준 최소 단가이며, 행사 규모·장소·세부 요구사항에 따라 달라집니다.
            정확한 견적은 상담 후 항목별로 투명하게 산출해 드립니다.
          </p>
        </div>

        {/* 항목별 비용 */}
        {PRICE_CATEGORIES.map((cat, ci) => (
          <div
            key={ci}
            className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm md:p-6"
          >
            <h2 className="mb-4 text-base font-bold text-slate-900 md:text-lg">
              {cat.title}
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="pb-2 text-left font-medium text-slate-500">항목</th>
                    <th className="pb-2 text-left font-medium text-slate-500">최소 가격</th>
                    <th className="hidden pb-2 text-left font-medium text-slate-500 md:table-cell">비고</th>
                  </tr>
                </thead>
                <tbody>
                  {cat.items.map((item, ii) => (
                    <tr key={ii} className="border-b border-slate-50 last:border-0">
                      <td className="py-2.5 text-slate-800">
                        {item.name}
                        <p className="mt-0.5 text-xs text-slate-400 md:hidden">{item.note}</p>
                      </td>
                      <td className="py-2.5 align-top font-medium text-blue-600">{formatPriceRange(item.price)}</td>
                      <td className="hidden py-2.5 text-slate-500 md:table-cell">{item.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        {/* 규모별 예산 예시 */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm md:p-6">
          <h2 className="mb-1 text-base font-bold text-slate-900 md:text-lg">
            규모별 예산 예시
          </h2>
          <p className="mb-4 text-xs text-slate-400">실제 견적은 포함 항목에 따라 달라집니다</p>
          {/* Desktop: 3-column grid */}
          <div className="hidden gap-4 md:grid md:grid-cols-3">
            {PACKAGE_EXAMPLES.map((pkg, pi) => (
              <div key={pi} className="rounded-lg border border-slate-100 p-4">
                <h3 className="text-sm font-semibold text-slate-900">{pkg.title}</h3>
                <p className="mt-0.5 text-xs text-slate-500">{pkg.scale}</p>
                <p className="mt-2 text-lg font-bold text-blue-600">{pkg.range}</p>
                <ul className="mt-3 space-y-1">
                  {pkg.includes.map((inc, ii) => (
                    <li key={ii} className="flex items-start gap-1.5 text-xs text-slate-600">
                      <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-blue-400" />
                      {inc}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          {/* Mobile: single card with arrows */}
          <PackageSlider packages={PACKAGE_EXAMPLES} />
        </div>

        {/* 비용 절감 팁 */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm md:p-6">
          <h2 className="mb-3 text-base font-bold text-slate-900 md:text-lg">
            예산 절감 팁
          </h2>
          <ul className="space-y-2">
            {[
              "규모가 커도 기획비·디자인비는 동일하므로, 인당 단가는 규모가 클수록 낮아집니다.",
              "현수막·배너를 직접 제작하고 기획·운영만 의뢰하면 비용을 줄일 수 있습니다.",
              "참석자가 직접 보는 항목(자료집, 무대 연출)에 예산을 집중하고, 후선 업무는 절감하는 것이 효과적입니다.",
              "같은 고객사의 반복 행사는 시안물 템플릿 재활용으로 디자인 비용을 절감할 수 있습니다.",
            ].map((tip, ti) => (
              <li key={ti} className="flex items-start gap-2 text-sm text-slate-600">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 내부 링크 배너 */}
      <div className="mt-12">
        <Link
          href="/work"
          className="group flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50/50 px-6 py-5 transition-all hover:border-blue-200 hover:bg-blue-50"
        >
          <div>
            <p className="text-[15px] font-semibold text-slate-800">실제 행사 사례가 궁금하신가요?</p>
            <p className="mt-1 text-[13px] text-slate-500">250+ 프로젝트 포트폴리오를 확인해보세요</p>
          </div>
          <span className="flex shrink-0 items-center gap-1 text-[14px] font-medium text-blue-600 transition-transform group-hover:translate-x-0.5">
            포트폴리오
            <ArrowRight className="h-4 w-4" />
          </span>
        </Link>
      </div>
    </GuideClient>
  );
}

/* Mobile package slider with arrows */
function PackageSlider({ packages }: { packages: typeof PACKAGE_EXAMPLES }) {
  const [idx, setIdx] = useState(0);
  const pkg = packages[idx];

  return (
    <div className="md:hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}
          className="rounded-lg border border-slate-100 p-4"
        >
          <h3 className="text-sm font-semibold text-slate-900">{pkg.title}</h3>
          <p className="mt-0.5 text-xs text-slate-500">{pkg.scale}</p>
          <p className="mt-2 text-lg font-bold text-blue-600">{pkg.range}</p>
          <ul className="mt-3 space-y-1">
            {pkg.includes.map((inc, ii) => (
              <li key={ii} className="flex items-start gap-1.5 text-xs text-slate-600">
                <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-blue-400" />
                {inc}
              </li>
            ))}
          </ul>
        </motion.div>
      </AnimatePresence>

      <div className="mt-3 flex items-center justify-between">
        <button
          onClick={() => setIdx((prev) => (prev - 1 + packages.length) % packages.length)}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 text-slate-500"
          aria-label="이전"
        >
          <ArrowRight className="h-4 w-4 rotate-180" />
        </button>
        <div className="flex gap-1.5">
          {packages.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`h-1.5 rounded-full transition-all ${i === idx ? "w-4 bg-blue-500" : "w-1.5 bg-slate-300"}`}
              aria-label={`${i + 1}번째`}
            />
          ))}
        </div>
        <button
          onClick={() => setIdx((prev) => (prev + 1) % packages.length)}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 text-slate-500"
          aria-label="다음"
        >
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
