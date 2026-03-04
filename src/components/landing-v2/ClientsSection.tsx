"use client";

import { useState, useEffect, useRef, useCallback, type CSSProperties } from "react";
import Image from "next/image";
import { BlurFade } from "@/components/ui/blur-fade";
import { Star } from "lucide-react";
import { fetchTopReviews } from "@/lib/queries";
import type { EventReview } from "@/types";

const clients = [
  { name: "경기도교육청", logo: "/logos/gyeonggido-edu.jpg" },
  { name: "합동참모본부", logo: "/logos/jcs.png" },
  { name: "해군 작전사령부", logo: "/logos/navy-ops.png" },
  { name: "자동차부품산업진흥재단", logo: "/logos/kapf.svg" },
  { name: "한국에너지정보문화재단", logo: "/logos/keicf.png" },
  { name: "한국문화예술교육진흥원", logo: "/logos/arte.png" },
  { name: "한국예술인복지재단", logo: "/logos/kawf.png" },
];

const repeated = [...clients, ...clients];

const FALLBACK_REVIEWS: Pick<EventReview, "reviewerName" | "organization" | "content" | "rating">[] = [
  {
    reviewerName: "김정훈 소령",
    organization: "해군본부",
    content: "세미나 기획부터 운영까지 원스톱으로 진행해주셔서 편했습니다. 참가자 만족도 설문에서도 역대 최고점을 받았습니다.",
    rating: 5,
  },
  {
    reviewerName: "박수진 과장",
    organization: "경기도교육청",
    content: "교육 연수 프로그램 구성이 체계적이었고, 현장 운영도 매끄러웠습니다. 내년에도 함께하고 싶습니다.",
    rating: 5,
  },
  {
    reviewerName: "이승우 팀장",
    organization: "한국에너지정보문화재단",
    content: "포럼 공간 디자인과 연출이 인상적이었습니다. 참석자분들의 반응이 좋았고 결과보고서도 꼼꼼했습니다.",
    rating: 5,
  },
  {
    reviewerName: "최영미 주임",
    organization: "자동차부품산업진흥재단",
    content: "축제 행사 안전관리부터 체험부스 운영까지 전문적으로 진행해주셨습니다. 대규모 행사인데도 차질 없이 마무리되었습니다.",
    rating: 4,
  },
];

/** 실명 마스킹: "박수진 과장" → "박OO 과장" */
function maskName(name: string): string {
  const parts = name.trim().split(/\s+/);
  const fullName = parts[0]; // "박수진"
  const title = parts.slice(1).join(" "); // "과장"
  const surname = fullName.charAt(0);
  const masked = surname + "OO";
  return title ? `${masked} ${title}` : masked;
}

function ReviewCarousel({ reviews }: { reviews: Pick<EventReview, "reviewerName" | "organization" | "content" | "rating">[] }) {
  const [current, setCurrent] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scrollTo = useCallback((idx: number) => {
    if (!scrollRef.current) return;
    const card = scrollRef.current.children[idx] as HTMLElement | undefined;
    if (card) {
      scrollRef.current.scrollTo({ left: card.offsetLeft - 16, behavior: "smooth" });
      setCurrent(idx);
    }
  }, []);

  // Auto-scroll
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrent((prev) => {
        const next = (prev + 1) % reviews.length;
        scrollTo(next);
        return next;
      });
    }, 5000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [reviews.length, scrollTo]);

  // Snap detection on manual scroll
  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const scrollLeft = container.scrollLeft;
    let closest = 0;
    let minDist = Infinity;
    for (let i = 0; i < container.children.length; i++) {
      const child = container.children[i] as HTMLElement;
      const dist = Math.abs(child.offsetLeft - 16 - scrollLeft);
      if (dist < minDist) {
        minDist = dist;
        closest = i;
      }
    }
    if (closest !== current) {
      setCurrent(closest);
      // Reset auto-scroll timer on manual interaction
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setCurrent((prev) => {
          const next = (prev + 1) % reviews.length;
          scrollTo(next);
          return next;
        });
      }, 5000);
    }
  }, [current, reviews.length, scrollTo]);

  return (
    <div>
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-3 scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {reviews.map((review, i) => (
          <div
            key={i}
            className="w-[280px] flex-shrink-0 snap-start rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
          >
            {/* Stars */}
            <div className="mb-2 flex gap-0.5">
              {Array.from({ length: 5 }, (_, s) => (
                <Star
                  key={s}
                  className={`h-3.5 w-3.5 ${s < review.rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`}
                />
              ))}
            </div>
            {/* Content */}
            <p className="mb-3 line-clamp-3 text-xs leading-relaxed text-gray-600">
              &ldquo;{review.content}&rdquo;
            </p>
            {/* Author */}
            <div className="border-t border-gray-50 pt-2">
              <p className="text-[11px] font-semibold text-gray-800">{maskName(review.reviewerName)}</p>
              {review.organization && (
                <p className="text-[10px] text-gray-400">{review.organization}</p>
              )}
            </div>
          </div>
        ))}
      </div>
      {/* Dots */}
      <div className="mt-2 flex justify-center gap-1.5">
        {reviews.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === current ? "w-4 bg-blue-500" : "w-1.5 bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default function Clients() {
  const [reviews, setReviews] = useState<Pick<EventReview, "reviewerName" | "organization" | "content" | "rating">[]>(FALLBACK_REVIEWS);
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    fetchTopReviews(6)
      .then((data) => {
        if (data.length > 0) setReviews(data);
      })
      .catch(() => {
        // DB에 후기 데이터 없으면 폴백 유지
      });
  }, []);

  // Pause carousel animation when out of viewport
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "100px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const animState: CSSProperties = inView ? {} : { animationPlayState: "paused" };

  return (
    <section ref={sectionRef} id="clients" className="relative overflow-hidden bg-white px-4 py-10 md:px-12 md:py-24 lg:px-20">
      <style>{`
        @keyframes cl { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes cr { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
      <div className="relative mx-auto max-w-6xl">
        <BlurFade delay={0.1}>
          <div className="mb-1 text-center font-[var(--font-inter)] text-xs font-extrabold tracking-[0.25em] text-blue-500/80 md:text-base">CLIENTS</div>
          <div className="mx-auto mb-2 h-[2px] w-8 rounded-full bg-blue-400 md:mb-4 md:w-10" />
          <h2 className="mb-2 text-center text-xl font-bold text-gray-900 md:mb-4 md:text-5xl">주요 고객사</h2>
          <p className="mx-auto mb-5 max-w-lg text-center text-xs text-gray-400 md:mb-14 md:text-base">공공기관·재단과 함께 신뢰를 쌓아갑니다</p>
        </BlurFade>
        <div className="overflow-hidden rounded-xl md:rounded-2xl">
          <div className="relative bg-[#f8f9fb] py-3 md:py-6">
            <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-12 bg-gradient-to-r from-[#f8f9fb] to-transparent md:w-24" />
            <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-12 bg-gradient-to-l from-[#f8f9fb] to-transparent md:w-24" />
            <div className="overflow-hidden">
              <div className="flex items-center" style={{ animation: "cl 26s linear infinite", ...animState }}>
                {repeated.map((c, i) => (
                  <div key={i} className="flex flex-shrink-0 items-center justify-center px-5 md:px-10">
                    <Image src={c.logo} alt={c.name} width={128} height={40} className="h-6 w-20 object-contain md:h-10 md:w-32" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="relative bg-[#eef3ff] py-3 md:py-5">
            <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-12 bg-gradient-to-r from-[#eef3ff] to-transparent md:w-24" />
            <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-12 bg-gradient-to-l from-[#eef3ff] to-transparent md:w-24" />
            <div className="overflow-hidden">
              <div className="flex items-center" style={{ animation: "cr 35s linear infinite", ...animState }}>
                {[...reviews, ...reviews].map((r, i) => (
                  <div key={i} className="flex-shrink-0 px-4 md:px-6" style={{ width: "260px" }}>
                    <p className="line-clamp-2 text-[11px] leading-snug text-blue-900/70 md:text-[13px]">
                      &ldquo;{r.content}&rdquo;
                    </p>
                    <p className="mt-0.5 text-[10px] font-semibold text-blue-500/60 md:text-[11px]">
                      {maskName(r.reviewerName)} · {r.organization}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile-only: Review Carousel */}
        <div className="mt-6 md:hidden">
          <h3 className="mb-3 text-center text-sm font-bold text-gray-800">고객 후기</h3>
          <ReviewCarousel reviews={reviews} />
        </div>
      </div>
    </section>
  );
}
