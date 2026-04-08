"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  children: React.ReactNode;
  /** sm 이상에서 적용할 grid 클래스 (기본: sm:grid-cols-2 sm:gap-8) */
  desktopGrid?: string;
}

export default function CardCarousel({ children, desktopGrid = "sm:grid-cols-2 sm:gap-8" }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>(":scope > *");
    if (!card) return;
    const gap = 16;
    const distance = card.offsetWidth + gap;
    el.scrollBy({ left: dir === "left" ? -distance : distance, behavior: "smooth" });
  };

  return (
    <div className="relative">
      {canLeft && (
        <button
          onClick={() => scroll("left")}
          className="sm:hidden absolute -left-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 border border-slate-200 shadow-md flex items-center justify-center active:bg-slate-100"
          aria-label="이전"
        >
          <ChevronLeft className="w-4 h-4 text-slate-600" />
        </button>
      )}
      {canRight && (
        <button
          onClick={() => scroll("right")}
          className="sm:hidden absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 border border-slate-200 shadow-md flex items-center justify-center active:bg-slate-100"
          aria-label="다음"
        >
          <ChevronRight className="w-4 h-4 text-slate-600" />
        </button>
      )}

      <div
        ref={scrollRef}
        className={`flex gap-4 overflow-x-auto snap-x snap-mandatory sm:grid sm:overflow-visible ${desktopGrid}`}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {children}
      </div>
    </div>
  );
}
