"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, MapPin, Camera } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ContactModal from "@/components/ui/ContactModal";
import { BlurFade } from "@/components/ui/blur-fade";
import { PulsatingButton } from "@/components/ui/pulsating-button";
import { GRADIENT_MAP } from "@/lib/portfolioData";
import type { Portfolio, PortfolioMedia } from "@/types";

/** tags[0] 기반 카테고리 컬러맵 */
const categoryStyle: Record<string, string> = {
  포럼: "bg-purple-100 text-purple-700",
  세미나: "bg-emerald-100 text-emerald-700",
  행사운영: "bg-blue-100 text-blue-700",
  교육: "bg-amber-100 text-amber-700",
  콘텐츠: "bg-orange-100 text-orange-700",
};

/** CTA rotating 행사 유형 */
interface WorkPageClientProps {
  portfolios: Portfolio[];
  portfolioMedia: PortfolioMedia[];
}

/** 카드 썸네일: Ken Burns 효과로 현장사진 자동 회전 */
function CardPhotoRotator({ photos, gradientType }: {
  photos: { src: string; label: string }[];
  gradientType: string;
}) {
  const [idx, setIdx] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [inView, setInView] = useState(false);
  const [portraitSet, setPortraitSet] = useState<Set<number>>(new Set());
  const [errorSet, setErrorSet] = useState<Set<number>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);
  const randomDelay = useRef(0);
  const gradient = GRADIENT_MAP[gradientType] ?? "from-slate-100 to-slate-200";

  useEffect(() => {
    setIdx(Math.floor(Math.random() * Math.max(photos.length, 1)));
    randomDelay.current = Math.random() * 4000;
    setMounted(true);
  }, [photos.length]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (photos.length <= 1 || !inView || !mounted) return;
    const randomNext = () => {
      setIdx((prev) => {
        const validIndices = Array.from({ length: photos.length }, (_, i) => i).filter((i) => !errorSet.has(i) && i !== prev);
        if (validIndices.length === 0) return prev;
        return validIndices[Math.floor(Math.random() * validIndices.length)];
      });
    };
    let timer: ReturnType<typeof setInterval>;
    const delay = setTimeout(() => {
      randomNext();
      timer = setInterval(randomNext, 5000);
    }, randomDelay.current);
    return () => { clearTimeout(delay); clearInterval(timer); };
  }, [photos.length, inView, mounted]);

  if (photos.length === 0) {
    return (
      <div ref={containerRef} className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${gradient}`}>
        <Camera className="h-8 w-8 text-white/40" />
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`absolute inset-0 bg-gradient-to-br ${gradient}`}>
      <AnimatePresence initial={false}>
        <motion.div
          key={idx}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={photos[idx].src}
            alt={photos[idx].label}
            fill
            className={portraitSet.has(idx) ? "object-contain" : "object-cover"}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onLoad={(e) => {
              const img = e.currentTarget as HTMLImageElement;
              if (img.naturalHeight > img.naturalWidth) {
                setPortraitSet((prev) => new Set(prev).add(idx));
              }
            }}
            onError={() => {
              setErrorSet((prev) => new Set(prev).add(idx));
            }}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function WorkPageClient({ portfolios, portfolioMedia }: WorkPageClientProps) {
  const [categoryFilter, setCategoryFilter] = useState("전체");
  const [yearFilter, setYearFilter] = useState("전체");
  const [search, setSearch] = useState("");
  const [contactOpen, setContactOpen] = useState(false);

  const visiblePortfolios = useMemo(() => portfolios.filter((p) => p.isVisible), [portfolios]);

  /** tags[0] 기반 카테고리 목록 + 개수 */
  const categoriesWithCount = useMemo(() => {
    const countMap: Record<string, number> = {};
    visiblePortfolios.forEach((p) => {
      const cat = p.tags[0];
      if (cat) countMap[cat] = (countMap[cat] ?? 0) + 1;
    });
    return Object.entries(countMap).map(([name, count]) => ({ name, count }));
  }, [visiblePortfolios]);

  const CATEGORIES = useMemo(() => {
    return ["전체", ...categoriesWithCount.map((c) => c.name)];
  }, [categoriesWithCount]);

  const getCategoryCount = (cat: string) => {
    if (cat === "전체") return visiblePortfolios.length;
    return categoriesWithCount.find((c) => c.name === cat)?.count ?? 0;
  };

  /** 연도 목록 */
  const YEARS = useMemo(() => {
    const years = Array.from(new Set(visiblePortfolios.map((p) => String(p.year))));
    years.sort((a, b) => Number(b) - Number(a));
    return ["전체", ...years];
  }, [visiblePortfolios]);

  /** 필터링 */
  const filtered = useMemo(() => {
    let list = visiblePortfolios;

    if (categoryFilter !== "전체") {
      list = list.filter((p) => p.tags[0] === categoryFilter);
    }
    if (yearFilter !== "전체") {
      list = list.filter((p) => p.year === Number(yearFilter));
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.venue.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return list;
  }, [visiblePortfolios, categoryFilter, yearFilter, search]);

  const totalCount = visiblePortfolios.length;

  return (
    <div className="pt-[56px] min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="py-16 text-center">
        <BlurFade>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            행사 대행 포트폴리오
          </h1>
          <p className="text-slate-500 text-[13px] mt-2">
            파란컴퍼니와 함께한 행사 사례를 소개합니다
          </p>
        </BlurFade>
        <BlurFade delay={0.1}>
          <div className="flex justify-center gap-10 mt-8">
            <div className="text-center">
              <p className="font-num text-2xl font-bold text-slate-900">
                {totalCount}+
              </p>
              <p className="text-[12px] text-slate-400 mt-1">프로젝트</p>
            </div>
            <div className="text-center">
              <p className="font-num text-2xl font-bold text-slate-900">93점</p>
              <p className="text-[12px] text-slate-400 mt-1">참가자 만족도</p>
            </div>
            <div className="text-center">
              <p className="font-num text-2xl font-bold text-slate-900">90%</p>
              <p className="text-[12px] text-slate-400 mt-1">재계약률</p>
            </div>
          </div>
        </BlurFade>
      </section>

      {/* 메인 레이아웃: 사이드바 + 콘텐츠 */}
      <div className="max-w-content mx-auto px-6 py-6">
        <div className="flex gap-6">
          {/* 사이드바 (desktop) */}
          <aside className="hidden lg:block w-[220px] shrink-0">
            <div className="sticky top-[72px]">
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 px-3">
                카테고리
              </p>
              <nav className="flex flex-col gap-0.5">
                {CATEGORIES.map((cat) => {
                  const isActive = categoryFilter === cat;
                  const count = getCategoryCount(cat);
                  return (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-[13px] transition-all ${
                        isActive
                          ? "border-l-2 border-blue-500 bg-blue-50 text-slate-900 font-semibold"
                          : "border-l-2 border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                      }`}
                    >
                      <span>{cat}</span>
                      <span className={`text-[11px] px-1.5 py-0.5 rounded-full font-medium ${
                        isActive
                          ? "bg-blue-100 text-blue-600"
                          : "bg-slate-100 text-slate-500"
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </nav>

              {/* CTA — 카테고리 하단 */}
              <div className="relative mt-8 overflow-hidden rounded-[14px] border border-slate-200/60 bg-white/40 backdrop-blur-xl">
                <div className="pointer-events-none absolute -top-10 -right-10 h-28 w-28 rounded-full bg-blue-400/20 blur-2xl" />
                <div className="pointer-events-none absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-indigo-400/15 blur-2xl" />
                <div className="relative px-5 py-8 text-center">
                  <p className="text-slate-800 text-[15px] font-bold leading-snug">
                    행사 기획이<br />필요하신가요?
                  </p>
                  <p className="text-slate-400 text-[12px] mt-2.5 leading-relaxed">
                    기획부터 디자인 · 운영까지<br />원스톱으로 진행합니다
                  </p>
                  <PulsatingButton
                    pulseColor="#2563eb"
                    className="mt-5 w-full bg-blue-600 py-3 text-[13px] font-semibold"
                    onClick={() => setContactOpen(true)}
                  >
                    무료 상담 받기
                  </PulsatingButton>
                </div>
              </div>
            </div>
          </aside>

          {/* 콘텐츠 영역 */}
          <div className="flex-1 min-w-0">
            {/* 모바일 카테고리 pill (lg:hidden) */}
            <div className="lg:hidden mb-4 -mx-6 px-6 overflow-x-auto scrollbar-hide">
              <div className="flex gap-2 pb-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`rounded-full px-3.5 py-1.5 text-[12px] font-medium whitespace-nowrap transition-colors ${
                      categoryFilter === cat
                        ? cat === "전체"
                          ? "bg-slate-900 text-white"
                          : categoryStyle[cat] ?? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* 연도 필터 + 검색 */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
              {YEARS.map((y) => (
                <button
                  key={y}
                  onClick={() => setYearFilter(y)}
                  className={`rounded-full px-3.5 py-1.5 text-[12px] font-medium font-num transition-colors ${
                    yearFilter === y
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
                >
                  {y === "전체" ? "전체 연도" : y}
                </button>
              ))}
              <div className="relative flex-1 min-w-[180px] max-w-[300px] ml-auto">
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="검색..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-full border border-slate-200 bg-white pl-10 pr-4 py-2 text-[12px] text-slate-900 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-200"
                />
              </div>
            </div>

            {/* 카드 그리드 */}
            {filtered.length === 0 ? (
              <div className="text-center py-20 text-slate-400">
                <p className="text-lg">검색 결과가 없습니다</p>
                <p className="text-[13px] mt-1">다른 조건으로 검색해보세요</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {filtered.map((pf, idx) => {
                  const cat = pf.tags[0] ?? "";
                  const pfMedia = portfolioMedia.filter((m) => m.portfolioId === pf.id);
                  const photos = pfMedia
                    .filter((m) => m.type === "photo")
                    .map((m) => ({ src: m.url, label: m.label }));
                  const galleryImages = pfMedia
                    .filter((m) => m.type === "gallery")
                    .map((m) => ({ src: m.url, label: m.label }));
                  // 현장사진 우선, 없으면 시안물, 없으면 imageUrl 폴백
                  const cardPhotos = photos.length > 0
                    ? photos
                    : galleryImages.length > 0
                      ? galleryImages
                      : pf.imageUrl
                        ? [{ src: pf.imageUrl, label: pf.title }]
                        : [];

                  return (
                    <BlurFade key={pf.id} delay={0.04 * Math.min(idx, 8)}>
                      <Link
                        href={`/work/${pf.slug || pf.id}`}
                        className="group block rounded-[10px] overflow-hidden bg-white border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-200"
                      >
                        {/* 썸네일 */}
                        <div className="relative aspect-[16/10] overflow-hidden">
                          <CardPhotoRotator
                            photos={cardPhotos}
                            gradientType={pf.gradientType}
                          />


                          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                            <h3 className="text-[13px] font-bold text-white leading-snug translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                              {pf.title}
                            </h3>
                            <div className="flex items-center gap-1.5 mt-1 text-[12px] text-white/80 translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                              <MapPin size={11} />
                              {pf.venue}
                            </div>
                          </div>
                        </div>

                        {/* 카드 정보 */}
                        <div className="p-4">
                          <div className="flex items-center gap-2 mb-1.5">
                            {cat && (
                              <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${categoryStyle[cat] ?? "bg-slate-100 text-slate-600"}`}>
                                {cat}
                              </span>
                            )}
                            <span className="text-[12px] text-slate-400 font-num">
                              {pf.year}
                            </span>
                          </div>
                          <h3 className="text-[13px] font-semibold text-slate-900 leading-snug">
                            {pf.title}
                          </h3>
                          <div className="flex items-center gap-1.5 mt-1.5 text-[12px] text-slate-500">
                            <MapPin size={12} />
                            {pf.venue}
                          </div>
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {pf.tags.slice(1, 4).map((tag) => (
                              <span
                                key={tag}
                                className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-[4px]"
                              >
                                #{tag}
                              </span>
                            ))}
                            {pf.tags.length > 4 && (
                              <span className="text-[10px] text-slate-400">
                                +{pf.tags.length - 4}
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    </BlurFade>
                  );
                })}
              </div>
            )}

          </div>
        </div>

      </div>

      <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} />
    </div>
  );
}
