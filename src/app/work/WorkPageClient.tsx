"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Camera } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ContactModal from "@/components/ui/ContactModal";
import { BlurFade } from "@/components/ui/blur-fade";
import { PulsatingButton } from "@/components/ui/pulsating-button";
import { GRADIENT_MAP, EVENT_WORK_GROUPS, eventGroupOf } from "@/lib/portfolioData";
import { DESIGN_WORK_GROUPS, designGroupOf } from "@/lib/designWorks";
import type { Portfolio, PortfolioMedia } from "@/types";

/** 카테고리(=event_type 6분류) 컬러맵 */
const categoryStyle: Record<string, string> = {
  // 행사 대행 3종
  "컨퍼런스·세미나": "bg-emerald-100 text-emerald-700",
  "교육·워크숍": "bg-amber-100 text-amber-700",
  "전시·홍보부스": "bg-purple-100 text-purple-700",
  // 디자인 3종
  "현수막·포스터": "bg-rose-100 text-rose-700",
  "PPT·카드뉴스·편집디자인": "bg-blue-100 text-blue-700",
  "전시부스·포토존": "bg-violet-100 text-violet-700",
  // 구 태그 호환
  포럼: "bg-purple-100 text-purple-700",
  세미나: "bg-emerald-100 text-emerald-700",
  행사운영: "bg-blue-100 text-blue-700",
  교육: "bg-amber-100 text-amber-700",
};

/** 통합 사이드바용 그룹 항목 (전체 제외). value = event_type 값으로 필터 */
const EVENT_CATS = EVENT_WORK_GROUPS.filter((g) => g.key !== "전체").map((g) => ({
  value: g.key as string,
  label: g.label,
}));
/** 디자인 그룹: key=인쇄물/디지털/공간, label=현수막·포스터 등(=event_type). value=label */
const DESIGN_CATS = DESIGN_WORK_GROUPS.filter((g) => g.key !== "전체").map((g) => ({
  value: g.label, // event_type 값과 동일
  label: g.label,
}));

/** 통합 사이드바 항목 — accent: 행사=blue, 디자인=violet */
function SidebarItem({ label, count, isActive, onClick, accent = "blue" }: {
  label: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
  accent?: "blue" | "violet";
}) {
  const activeText = accent === "violet" ? "text-violet-700" : "text-blue-700";
  const activeBg = accent === "violet" ? "bg-violet-50/80" : "bg-blue-50/80";
  const activeRail = accent === "violet" ? "before:bg-violet-500" : "before:bg-blue-500";
  return (
    <button
      onClick={onClick}
      className={`relative w-full flex items-center justify-between rounded-md px-2.5 py-[7px] text-[13px] transition-colors
        before:absolute before:-left-[13px] before:top-1/2 before:h-4 before:w-[2px] before:-translate-y-1/2 before:rounded-full before:transition-opacity ${
        isActive
          ? `${activeBg} ${activeText} font-semibold before:opacity-100 ${activeRail}`
          : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/60 before:opacity-0"
      }`}
    >
      <span className="truncate">{label}</span>
      <span className={`ml-2 text-[11px] tabular-nums ${isActive ? activeText : "text-slate-300"}`}>
        {count}
      </span>
    </button>
  );
}

/** 섹션: 헤더 + 트리 레일 그룹 */
function SidebarGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-5">
      <p className="px-1.5 text-[12px] font-semibold text-slate-800">{label}</p>
      <div className="mt-1.5 ml-2 flex flex-col gap-px border-l border-slate-200 pl-3">
        {children}
      </div>
    </div>
  );
}

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
  // categoryFilter = "전체" 또는 event_type 6값 중 하나
  const [categoryFilter, setCategoryFilter] = useState("전체");
  const [search, setSearch] = useState("");
  const [contactOpen, setContactOpen] = useState(false);

  /** URL 쿼리 파라미터로 초기 필터 (블로그 CTA 등 deep-link, 구 링크 호환) */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const category = params.get("category");
    const design = params.get("design");

    if (category) {
      // event_type 값 직매칭, 구 태그값(포럼/세미나 등)은 그룹으로 변환
      const v = EVENT_WORK_GROUPS.some((g) => g.key === category) ? category : eventGroupOf(category);
      if (v) setCategoryFilter(v);
    } else if (design) {
      // 구 디자인 그룹키(인쇄물/디지털/공간) 또는 카테고리 → event_type 라벨로 변환
      const grpKey = DESIGN_WORK_GROUPS.some((g) => g.key === design) ? design : designGroupOf(design);
      const label = DESIGN_WORK_GROUPS.find((g) => g.key === grpKey)?.label;
      if (label) setCategoryFilter(label);
    }
  }, []);

  const visiblePortfolios = useMemo(() => portfolios.filter((p) => p.isVisible), [portfolios]);

  const getCategoryCount = (cat: string) =>
    cat === "전체"
      ? visiblePortfolios.length
      : visiblePortfolios.filter((p) => p.eventType === cat).length;

  /** 필터링 — event_type 6분류 기준 단일 그리드, 최신 등록순 */
  const filtered = useMemo(() => {
    let list = visiblePortfolios;

    if (categoryFilter !== "전체") {
      list = list.filter((p) => p.eventType === categoryFilter);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.venue.toLowerCase().includes(q) ||
          (p.client ?? "").toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // 최신 등록순 (createdAt 내림차순, 없으면 연도 내림차순)
    return [...list].sort((a, b) => {
      const da = a.createdAt ?? "";
      const db = b.createdAt ?? "";
      if (da && db && da !== db) return db.localeCompare(da);
      if (da !== db) return da ? -1 : 1;
      return (b.year ?? 0) - (a.year ?? 0);
    });
  }, [visiblePortfolios, categoryFilter, search]);

  return (
    <div className="pt-[56px] min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="py-16 text-center">
        <BlurFade>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            포트폴리오
          </h1>
          <p className="text-slate-500 text-[13px] mt-2">
            파란컴퍼니와 함께한 행사 기획·운영과 디자인 사례를 소개합니다
          </p>
        </BlurFade>
        <BlurFade delay={0.1}>
          <div className="flex justify-center gap-10 mt-8">
            <div className="text-center">
              <p className="font-num text-2xl font-bold text-slate-900">250+</p>
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
          {/* 사이드바 (desktop) — 행사 3그룹 + 디자인 3그룹 통합 */}
          <aside className="hidden lg:block w-[220px] shrink-0 self-start sticky top-[104px] max-h-[calc(100vh-120px)] overflow-y-auto scrollbar-hide">
            <div>
              <nav className="flex flex-col">
                <button
                  onClick={() => setCategoryFilter("전체")}
                  className={`flex w-full items-center justify-between rounded-md px-1.5 py-1.5 text-[12px] font-semibold text-slate-800 transition-colors ${
                    categoryFilter === "전체"
                      ? "bg-blue-50/80 text-blue-700"
                      : "hover:bg-slate-100/70"
                  }`}
                >
                  <span>전체</span>
                  <span className="ml-2 text-[11px] tabular-nums text-slate-300">
                    {getCategoryCount("전체")}
                  </span>
                </button>

                <SidebarGroup label="행사 대행">
                  {EVENT_CATS.map(({ value, label }) => (
                    <SidebarItem
                      key={value}
                      label={label}
                      count={getCategoryCount(value)}
                      isActive={categoryFilter === value}
                      onClick={() => setCategoryFilter(value)}
                    />
                  ))}
                </SidebarGroup>

                <SidebarGroup label="디자인">
                  {DESIGN_CATS.map(({ value, label }) => (
                    <SidebarItem
                      key={value}
                      label={label}
                      count={getCategoryCount(value)}
                      isActive={categoryFilter === value}
                      onClick={() => setCategoryFilter(value)}
                      accent="violet"
                    />
                  ))}
                </SidebarGroup>
              </nav>

              {/* CTA */}
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
            {/* 모바일 통합 pill — 전체 + 행사 3 + 디자인 3 (lg:hidden) */}
            <div className="lg:hidden mb-4 -mx-6 px-6">
              <div className="overflow-x-auto scrollbar-hide">
                <div className="flex gap-2 pb-1">
                  <button
                    onClick={() => setCategoryFilter("전체")}
                    className={`rounded-full px-3.5 py-1.5 text-[12px] font-medium whitespace-nowrap transition-colors ${
                      categoryFilter === "전체"
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                    }`}
                  >
                    전체
                  </button>
                  {EVENT_CATS.map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => setCategoryFilter(value)}
                      className={`rounded-full px-3.5 py-1.5 text-[12px] font-medium whitespace-nowrap transition-colors ${
                        categoryFilter === value
                          ? "bg-slate-900 text-white"
                          : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                  {DESIGN_CATS.map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => setCategoryFilter(value)}
                      className={`rounded-full px-3.5 py-1.5 text-[12px] font-medium whitespace-nowrap transition-colors ${
                        categoryFilter === value
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 검색 */}
            <div className="mb-4 flex sm:mb-6 sm:justify-end">
              <div className="relative w-full sm:w-auto sm:min-w-[180px] sm:max-w-[300px]">
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

            {/* 카드 그리드 (행사+디자인 통합) */}
            {filtered.length === 0 ? (
              <div className="text-center py-20 text-slate-400">
                <p className="text-lg">검색 결과가 없습니다</p>
                <p className="text-[13px] mt-1">다른 조건으로 검색해보세요</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:gap-6">
                {filtered.map((pf, idx) => {
                  const cat = pf.eventType ?? pf.tags[0] ?? "";
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

                          {/* 호버 오버레이 */}
                          <div className="absolute inset-0 z-10 bg-blue-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-center p-4">
                            <span className="rounded-full border border-white/40 px-3 py-1 text-[10px] font-medium text-white mb-2">
                              {cat}
                            </span>
                            <p className="text-[15px] font-bold text-white leading-snug">{pf.title}</p>
                            <p className="text-[12px] text-white/60 mt-1">{pf.venue}</p>
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
          </div>
        </div>
      </div>

      <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} />
    </div>
  );
}
