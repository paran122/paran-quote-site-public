"use client";

import { useRef, useState, useEffect, useCallback, Children } from "react";

interface Props {
  children: React.ReactNode;
  /** sm 이상에서 적용할 grid 클래스 (기본: sm:grid-cols-2 sm:gap-8) */
  desktopGrid?: string;
  /** 모바일 자동 슬라이드 간격 ms (기본: 3000) */
  autoPlayMs?: number;
  /** 모바일에서 한 장씩 꽉 차게 (gap 0, full-width) */
  mobileFullWidth?: boolean;
}

export default function CardCarousel({ children, desktopGrid = "sm:grid-cols-2 sm:gap-8", autoPlayMs = 3000, mobileFullWidth }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const touchRef = useRef(false);
  const childCount = Children.count(children);

  const mobileGap = mobileFullWidth ? 0 : 16;

  /** 현재 보이는 카드 인덱스 추적 */
  const updateActiveIdx = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>(":scope > *");
    if (!card) return;
    const idx = Math.round(el.scrollLeft / (card.offsetWidth + mobileGap));
    setActiveIdx(Math.min(idx, childCount - 1));
  }, [childCount, mobileGap]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateActiveIdx, { passive: true });
    return () => el.removeEventListener("scroll", updateActiveIdx);
  }, [updateActiveIdx]);

  /** 자동 슬라이드 (모바일만 — sm 미만) */
  useEffect(() => {
    if (childCount <= 1) return;
    const mq = window.matchMedia("(min-width: 640px)");
    if (mq.matches) return;

    const timer = setInterval(() => {
      if (touchRef.current) return;
      const el = scrollRef.current;
      if (!el) return;
      const card = el.querySelector<HTMLElement>(":scope > *");
      if (!card) return;
      const distance = card.offsetWidth + mobileGap;
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft >= maxScroll - 4) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: distance, behavior: "smooth" });
      }
    }, autoPlayMs);

    return () => clearInterval(timer);
  }, [childCount, autoPlayMs, mobileGap]);

  /** 터치 중에는 자동 슬라이드 일시정지 */
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const start = () => { touchRef.current = true; };
    const end = () => { touchRef.current = false; };
    el.addEventListener("touchstart", start, { passive: true });
    el.addEventListener("touchend", end, { passive: true });
    return () => {
      el.removeEventListener("touchstart", start);
      el.removeEventListener("touchend", end);
    };
  }, []);

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className={`flex ${mobileFullWidth ? "gap-0" : "gap-4"} overflow-x-auto snap-x snap-mandatory sm:grid sm:gap-6 sm:overflow-visible ${desktopGrid}`}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {children}
      </div>

      {/* 모바일 인디케이터 도트 */}
      {childCount > 1 && (
        <div className="flex sm:hidden justify-center gap-1.5 mt-4">
          {Array.from({ length: childCount }, (_, i) => (
            <span
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                i === activeIdx ? "bg-slate-600" : "bg-slate-300"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
