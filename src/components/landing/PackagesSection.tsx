"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronDown, Check } from "lucide-react";
import { formatPrice } from "@/lib/constants";
import { useCatalogStore } from "@/stores/catalogStore";
import { useInView } from "@/lib/utils";

export default function PackagesSection() {
  const PACKAGES = useCatalogStore((s) => s.packages);
  const SERVICES = useCatalogStore((s) => s.services);
  const { ref, inView } = useInView(0.1);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <section className="bg-slate-50 py-20">
      <div
        ref={ref}
        className={`max-w-content mx-auto px-6 transition-all duration-700 ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="mb-10">
          <h2 className="text-slate-900">추천 패키지</h2>
          <p className="mt-2 text-slate-500 text-[15px]">
            행사 유형에 맞춘 패키지로 더 합리적으로
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PACKAGES.map((pkg, i) => {
            const isExpanded = expandedId === pkg.id;
            const includedServices = SERVICES.filter((s) =>
              pkg.includedServiceIds.includes(s.id)
            );

            return (
              <div
                key={pkg.id}
                className={`bg-white border border-slate-200 rounded-[10px] overflow-hidden hover:border-slate-300 transition-all duration-300 ${
                  inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
                style={{ transitionDelay: inView ? `${i * 100}ms` : "0ms" }}
              >
                {/* 썸네일 영역 */}
                <div className="h-[120px] relative">
                  {pkg.imageUrl ? (
                    <Image
                      src={pkg.imageUrl}
                      alt={pkg.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                      <span className="text-lg font-bold text-slate-300">
                        {pkg.name[0]}
                      </span>
                    </div>
                  )}
                  <span className="absolute top-3 right-3 text-[11px] font-medium bg-slate-900 text-white px-2 py-1 rounded-[4px]">
                    {pkg.discountRate}% 할인
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="text-[15px] font-semibold text-slate-900 mb-1">{pkg.name}</h3>

                  {/* 포함 서비스 토글 */}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : pkg.id)}
                    className="flex items-center gap-1 text-[12px] text-slate-500 font-medium mt-2 hover:text-slate-700"
                  >
                    포함 서비스 {includedServices.length}개
                    <ChevronDown
                      size={12}
                      className={`transition-transform duration-200 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      isExpanded ? "max-h-[200px] mt-3" : "max-h-0"
                    }`}
                  >
                    <ul className="space-y-1.5">
                      {includedServices.map((s) => (
                        <li
                          key={s.id}
                          className="flex items-center gap-2 text-[13px] text-slate-600"
                        >
                          <Check size={12} className="text-slate-400 shrink-0" />
                          {s.name}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* 가격 */}
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <p className="text-[13px] text-slate-400 line-through font-num">
                      {formatPrice(pkg.originalPrice)}원
                    </p>
                    <p className="text-lg font-bold font-num text-slate-900 mt-0.5">
                      {formatPrice(pkg.discountPrice)}원
                    </p>
                  </div>

                  <Link
                    href="/build"
                    className="mt-3 w-full py-2.5 text-[13px] font-medium rounded-[6px] bg-primary text-white hover:bg-primary-600 transition-colors flex items-center justify-center gap-1.5"
                  >
                    패키지 시작하기
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
