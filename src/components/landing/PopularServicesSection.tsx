"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatPrice } from "@/lib/constants";
import { useCatalogStore } from "@/stores/catalogStore";
import { useInView } from "@/lib/utils";

export default function PopularServicesSection() {
  const services = useCatalogStore((s) => s.services);
  const POPULAR_SERVICES = services.filter((s) => s.isPopular);
  const { ref, inView } = useInView(0.15);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    return () => el.removeEventListener("scroll", checkScroll);
  }, [checkScroll]);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = 280;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <section className="bg-white py-20">
      <div
        ref={ref}
        className={`max-w-content mx-auto px-6 transition-all duration-700 ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="mb-10">
          <h2 className="text-slate-900">인기 서비스</h2>
          <p className="mt-2 text-slate-500 text-[15px]">
            가장 많이 선택하는 행사 서비스를 만나보세요
          </p>
        </div>

        {/* 스크롤 영역 + 화살표 */}
        <div className="relative group">
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-9 h-9 bg-white border border-slate-200 rounded-full flex items-center justify-center hover:border-slate-300 transition-all opacity-0 group-hover:opacity-100"
              aria-label="이전"
            >
              <ChevronLeft size={16} className="text-slate-600" />
            </button>
          )}

          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-9 h-9 bg-white border border-slate-200 rounded-full flex items-center justify-center hover:border-slate-300 transition-all opacity-0 group-hover:opacity-100"
              aria-label="다음"
            >
              <ChevronRight size={16} className="text-slate-600" />
            </button>
          )}

          {canScrollRight && (
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-[5] pointer-events-none" />
          )}

          <div
            ref={scrollRef}
            className="overflow-x-auto snap-x snap-mandatory flex gap-4 pb-4 scrollbar-hide"
          >
            {POPULAR_SERVICES.map((service, i) => (
              <Link
                key={service.id}
                href={`/services/${service.id}`}
                className={`min-w-[240px] snap-start bg-white border border-slate-200 rounded-[10px] overflow-hidden
                  hover:border-slate-300 transition-all duration-200 cursor-pointer
                  ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                style={{ transitionDelay: inView ? `${i * 80}ms` : "0ms" }}
              >
                <div className="h-[110px] relative">
                  {service.imageUrl ? (
                    <Image
                      src={service.imageUrl}
                      alt={service.name}
                      fill
                      sizes="240px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                      <span className="text-lg font-bold text-slate-300">
                        {service.name[0]}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-[14px] font-semibold text-slate-900">{service.name}</h3>
                  <p className="text-[13px] text-slate-500 mt-1 line-clamp-1">
                    {service.description}
                  </p>
                  <p className="mt-2.5 font-num font-semibold text-slate-900 text-[14px]">
                    {formatPrice(service.basePrice)}원~
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
