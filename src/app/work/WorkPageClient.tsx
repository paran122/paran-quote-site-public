"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Camera, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ContactModal from "@/components/ui/ContactModal";
import { BlurFade } from "@/components/ui/blur-fade";
import { PulsatingButton } from "@/components/ui/pulsating-button";
import { GRADIENT_MAP } from "@/lib/portfolioData";
import { DESIGN_WORKS, type DesignWork } from "@/lib/designWorks";
import type { Portfolio, PortfolioMedia } from "@/types";

/** tags[0] 기반 카테고리 컬러맵 */
const categoryStyle: Record<string, string> = {
  포럼: "bg-purple-100 text-purple-700",
  세미나: "bg-emerald-100 text-emerald-700",
  행사운영: "bg-blue-100 text-blue-700",
  교육: "bg-amber-100 text-amber-700",
  콘텐츠: "bg-orange-100 text-orange-700",
};

/** 뷰 모드 */
type ViewMode = "design" | "event";

/** 디자인별 카테고리 정의 */
const DESIGN_CATEGORIES = [
  { key: "전체", label: "전체" },
  { key: "전시부스", label: "전시부스" },
  { key: "포스터", label: "포스터" },
  { key: "리플렛", label: "리플렛" },
  { key: "카탈로그", label: "카탈로그" },
  { key: "배너·현수막", label: "배너/현수막" },
  { key: "PPT", label: "PPT" },
  { key: "카드뉴스", label: "카드뉴스" },
] as const;

/** 디자인별 전체 보기 정렬: 첫 4개 고정 + 나머지 랜덤 */
const PINNED_IDS = ["b03", "b08", "b01", "b04"];

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/** 라이트박스 모달 */
function DesignLightbox({ work, onClose }: { work: DesignWork; onClose: () => void }) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"
      >
        <X size={24} />
      </button>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="relative max-w-[90vw] max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={work.image}
          alt={`${work.title} — ${work.event}`}
          width={1400}
          height={1050}
          className="rounded-lg object-contain max-h-[85vh] w-auto"
          unoptimized
        />
        <div className="absolute bottom-0 left-0 right-0 rounded-b-lg bg-gradient-to-t from-black/70 to-transparent px-5 py-4">
          <p className="text-[14px] font-bold text-white">{work.title}</p>
          <p className="text-[12px] text-white/70">{work.event}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

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
  const [viewMode, setViewMode] = useState<ViewMode>("event");
  const [categoryFilter, setCategoryFilter] = useState("전체");
  const [designFilter, setDesignFilter] = useState("전체");
  const [yearFilter, setYearFilter] = useState("전체");
  const [search, setSearch] = useState("");
  const [contactOpen, setContactOpen] = useState(false);
  const [lightboxWork, setLightboxWork] = useState<DesignWork | null>(null);
  const closeLightbox = useCallback(() => setLightboxWork(null), []);

  /** 디자인 작업물 정렬: 고정 4개 + 나머지 랜덤 (클라이언트에서만 셔플) */
  const [shuffledRest, setShuffledRest] = useState<DesignWork[]>([]);
  const [shuffleReady, setShuffleReady] = useState(false);

  useEffect(() => {
    const rest = DESIGN_WORKS.filter((d) => !PINNED_IDS.includes(d.id));
    setShuffledRest(shuffleArray(rest));
    setShuffleReady(true);
  }, []);

  const sortedDesignWorks = useMemo(() => {
    let list: DesignWork[];
    if (designFilter !== "전체") {
      list = DESIGN_WORKS.filter((d) => d.category === designFilter);
    } else {
      const pinned = PINNED_IDS.map((id) => DESIGN_WORKS.find((d) => d.id === id)!).filter(Boolean);
      const rest = shuffleReady ? shuffledRest : DESIGN_WORKS.filter((d) => !PINNED_IDS.includes(d.id));
      list = [...pinned, ...rest];
    }
    if (yearFilter !== "전체") {
      list = list.filter((d) => d.year === Number(yearFilter));
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((d) =>
        d.title.toLowerCase().includes(q) ||
        d.event.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q)
      );
    }
    return list;
  }, [designFilter, shuffledRest, shuffleReady, yearFilter, search]);

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
            {viewMode === "design" ? "행사 디자인 포트폴리오" : "행사 대행 포트폴리오"}
          </h1>
          <p className="text-slate-500 text-[13px] mt-2">
            {viewMode === "design"
              ? "전시부스, 포스터, 리플렛 등 행사 디자인 작업물을 소개합니다"
              : "파란컴퍼니와 함께한 행사 사례를 소개합니다"}
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
          <aside className="hidden lg:block w-[220px] shrink-0 self-start sticky top-[104px] max-h-[calc(100vh-120px)] overflow-y-auto scrollbar-hide">
            <div>
              {/* 뷰 모드 전환 탭 */}
              <div className="flex rounded-lg bg-slate-100 p-1 mb-5">
                <button
                  onClick={() => { setViewMode("design"); setDesignFilter("전체"); }}
                  className={`flex-1 rounded-md py-2 text-[12px] font-semibold transition-all ${
                    viewMode === "design"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  디자인별
                </button>
                <button
                  onClick={() => { setViewMode("event"); setCategoryFilter("전체"); }}
                  className={`flex-1 rounded-md py-2 text-[12px] font-semibold transition-all ${
                    viewMode === "event"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  행사별
                </button>
              </div>

              {viewMode === "design" ? (
                <>
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3 px-3">
                    디자인 유형
                  </p>
                  <nav className="flex flex-col gap-0.5">
                    {DESIGN_CATEGORIES.map(({ key, label }) => {
                      const isActive = designFilter === key;
                      const count = key === "전체"
                        ? DESIGN_WORKS.length
                        : DESIGN_WORKS.filter((d) => d.category === key).length;
                      return (
                        <button
                          key={key}
                          onClick={() => setDesignFilter(key)}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-[13px] transition-all ${
                            isActive
                              ? "border-l-2 border-blue-500 bg-blue-50 text-slate-900 font-semibold"
                              : "border-l-2 border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                          }`}
                        >
                          <span>{label}</span>
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
                </>
              ) : (
                <>
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3 px-3">
                    행사 유형
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
                </>
              )}

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
            {/* 모바일 뷰 전환 + 카테고리 pill (lg:hidden) */}
            <div className="lg:hidden mb-4 -mx-6 px-6">
              {/* 모바일 뷰 전환 */}
              <div className="flex rounded-lg bg-slate-100 p-1 mb-3">
                <button
                  onClick={() => { setViewMode("design"); setDesignFilter("전체"); }}
                  className={`flex-1 rounded-md py-2 text-[12px] font-semibold transition-all ${
                    viewMode === "design"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500"
                  }`}
                >
                  디자인별
                </button>
                <button
                  onClick={() => { setViewMode("event"); setCategoryFilter("전체"); }}
                  className={`flex-1 rounded-md py-2 text-[12px] font-semibold transition-all ${
                    viewMode === "event"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500"
                  }`}
                >
                  행사별
                </button>
              </div>
              {/* 모바일 카테고리 pill */}
              <div className="overflow-x-auto scrollbar-hide">
                <div className="flex gap-2 pb-1">
                  {viewMode === "design"
                    ? DESIGN_CATEGORIES.map(({ key, label }) => (
                        <button
                          key={key}
                          onClick={() => setDesignFilter(key)}
                          className={`rounded-full px-3.5 py-1.5 text-[12px] font-medium whitespace-nowrap transition-colors ${
                            designFilter === key
                              ? "bg-slate-900 text-white"
                              : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                          }`}
                        >
                          {label}
                        </button>
                      ))
                    : CATEGORIES.map((cat) => (
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
                      ))
                  }
                </div>
              </div>
            </div>

            {/* 공통: 연도 필터 + 검색 */}
            <div className="mb-4 flex flex-col gap-2 sm:mb-6 sm:flex-row sm:flex-wrap sm:items-center">
              <div className="flex flex-wrap gap-2">
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
              </div>
              <div className="relative w-full sm:ml-auto sm:w-auto sm:min-w-[180px] sm:max-w-[300px] sm:flex-1">
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

            {viewMode === "design" ? (
              /* ── 디자인별 뷰 ── */
              <>
                {designFilter !== "전체" && (
                  <h2 className="text-lg font-bold text-slate-900 mb-4">
                    {designFilter} 디자인
                    <span className="ml-2 text-[13px] font-normal text-slate-400">
                      {sortedDesignWorks.length}건
                    </span>
                  </h2>
                )}
                {sortedDesignWorks.length === 0 ? (
                  <div className="text-center py-20 text-slate-400">
                    <p className="text-lg">작업물이 없습니다</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 sm:gap-6">
                    {sortedDesignWorks.map((work, idx) => (
                      <BlurFade key={work.id} delay={idx < 6 ? 0.03 * idx : 0}>
                        <button
                          onClick={() => setLightboxWork(work)}
                          className="group relative block w-full text-left rounded-[10px] overflow-hidden bg-white border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-200"
                        >
                          <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                            <Image
                              src={work.image}
                              alt={`${work.title} — ${work.event}`}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                              sizes="(max-width: 640px) calc(50vw - 12px), calc(50vw - 140px)"
                              unoptimized
                              {...(idx < 4 ? { priority: true } : { loading: "lazy" as const })}
                            />

                            {/* 호버 오버레이 */}
                            <div className="absolute inset-0 z-10 bg-blue-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-center p-4">
                              <span className="rounded-full border border-white/40 px-3 py-1 text-[10px] font-medium text-white mb-2">
                                {work.category}
                              </span>
                              <p className="text-[15px] font-bold text-white leading-snug">{work.title}</p>
                              <p className="text-[12px] text-white/60 mt-1">{work.event}</p>
                              <div className="mt-3 rounded-full bg-white/20 px-3 py-1 text-[10px] text-white">
                                클릭하여 확대
                              </div>
                            </div>
                          </div>

                          <span className="sr-only">
                            {work.category} — {work.title} — {work.event}
                          </span>
                        </button>
                      </BlurFade>
                    ))}
                  </div>
                )}
              </>
            ) : (
              /* ── 행사별 뷰 ── */
              <>
                {/* 카드 그리드 */}
                {filtered.length === 0 ? (
                  <div className="text-center py-20 text-slate-400">
                    <p className="text-lg">검색 결과가 없습니다</p>
                    <p className="text-[13px] mt-1">다른 조건으로 검색해보세요</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 sm:gap-6">
                    {filtered.map((pf, idx) => {
                      const cat = pf.tags[0] ?? "";
                      const pfMedia = portfolioMedia.filter((m) => m.portfolioId === pf.id);
                      const photos = pfMedia
                        .filter((m) => m.type === "photo")
                        .map((m) => ({ src: m.url, label: m.label }));
                      const galleryImages = pfMedia
                        .filter((m) => m.type === "gallery")
                        .map((m) => ({ src: m.url, label: m.label }));
                      const cardPhotos = photos.length > 0
                        ? photos
                        : galleryImages.length > 0
                          ? galleryImages
                          : pf.imageUrl
                            ? [{ src: pf.imageUrl, label: pf.title }]
                            : [];

                      return (
                        <BlurFade key={pf.id} delay={idx < 6 ? 0.04 * idx : 0}>
                          <Link
                            href={`/work/${pf.slug || pf.id}`}
                            className="group flex h-full flex-col rounded-[10px] overflow-hidden bg-white border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-200"
                          >
                            {/* 썸네일 */}
                            <div className="relative aspect-[16/10] overflow-hidden">
                              <CardPhotoRotator
                                photos={cardPhotos}
                                gradientType={pf.gradientType}
                              />

                              {/* 호버 오버레이 — 디자인별과 동일 스타일 */}
                              <div className="absolute inset-0 z-10 bg-blue-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-center p-4">
                                <span className="rounded-full border border-white/40 px-3 py-1 text-[10px] font-medium text-white mb-2">
                                  {cat}
                                </span>
                                <p className="text-[15px] font-bold text-white leading-snug">{pf.title}</p>
                                <p className="text-[12px] text-white/60 mt-1">{pf.venue} · {pf.year}</p>
                                <div className="mt-3 rounded-full bg-white/20 px-3 py-1 text-[10px] text-white">
                                  자세히 보기
                                </div>
                              </div>
                            </div>

                            {/* 카드 정보 */}
                            <div className="flex flex-1 flex-col p-3 sm:p-4">
                              <div className="flex items-center gap-1.5 mb-1 sm:gap-2 sm:mb-1.5">
                                {cat && (
                                  <span className={`rounded-full px-2 py-0.5 text-[9px] font-medium sm:px-2.5 sm:text-[10px] ${categoryStyle[cat] ?? "bg-slate-100 text-slate-600"}`}>
                                    {cat}
                                  </span>
                                )}
                                <span className="text-[10px] text-slate-400 font-num sm:text-[12px]">
                                  {pf.year}
                                </span>
                              </div>
                              <h3 className="min-h-[2.25rem] text-[12px] font-semibold text-slate-900 leading-snug line-clamp-2 sm:text-[13px]">
                                {pf.title}
                              </h3>
                              {pf.description && (
                                <p className="mt-1 hidden text-[12px] text-slate-500 leading-relaxed sm:mt-1.5 sm:line-clamp-2">
                                  {pf.description}
                                </p>
                              )}
                              <div className="mt-auto pt-2 sm:pt-3">
                                <div className="flex h-[1.25rem] flex-wrap gap-1 overflow-hidden sm:hidden">
                                  {pf.tags.slice(1, 3).map((tag) => (
                                    <span key={tag} className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-[4px]">
                                      #{tag}
                                    </span>
                                  ))}
                                  {pf.tags.length > 3 && (
                                    <span className="text-[9px] text-slate-400">+{pf.tags.length - 3}</span>
                                  )}
                                </div>
                                <div className="hidden flex-wrap gap-1.5 sm:flex">
                                  {pf.tags.slice(1).map((tag) => (
                                    <span key={tag} className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-[4px]">
                                      #{tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </Link>
                        </BlurFade>
                      );
                    })}
                  </div>
                )}
              </>
            )}

          </div>
        </div>

      </div>

      <AnimatePresence>
        {lightboxWork && <DesignLightbox work={lightboxWork} onClose={closeLightbox} />}
      </AnimatePresence>
      <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} />
    </div>
  );
}
