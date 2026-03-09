"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Image from "next/image";
import { Search, X, MapPin, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import ContactModal from "@/components/ui/ContactModal";
import Masonry from "react-masonry-css";
import { GRADIENT_MAP } from "@/lib/portfolioData";
import { useCatalogStore } from "@/stores/catalogStore";
import type { Portfolio } from "@/types";

export default function WorkPage() {
  const portfolios = useCatalogStore((s) => s.portfolios);
  const portfolioMedia = useCatalogStore((s) => s.portfolioMedia);
  const [typeFilter, setTypeFilter] = useState("전체");
  const [yearFilter, setYearFilter] = useState("전체");
  const [search, setSearch] = useState("");

  const EVENT_TYPES = useMemo(() => {
    const types = Array.from(new Set(portfolios.filter((p) => p.isVisible).map((p) => p.eventType)));
    return ["전체", ...types];
  }, [portfolios]);

  const YEARS = useMemo(() => {
    const years = Array.from(new Set(portfolios.filter((p) => p.isVisible).map((p) => String(p.year))));
    years.sort((a, b) => Number(b) - Number(a));
    return ["전체", ...years];
  }, [portfolios]);
  const [contactOpen, setContactOpen] = useState(false);
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(
    null
  );
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [selectedSession, setSelectedSession] = useState<number | null>(null);
  const [photoExpanded, setPhotoExpanded] = useState(false);

  const filtered = useMemo(() => {
    let list = portfolios.filter((p) => p.isVisible);

    if (typeFilter !== "전체") {
      list = list.filter((p) => p.eventType === typeFilter);
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
          p.tags.some((t) => t.includes(q))
      );
    }

    return list;
  }, [portfolios, typeFilter, yearFilter, search]);

  const totalCount = portfolios.filter((p) => p.isVisible).length;

  const openPortfolio = (pf: Portfolio) => {
    setSelectedPortfolio(pf);
    setGalleryIndex(0);
    setImageLoaded(false);
    setSelectedSession(null);
    setPhotoExpanded(false);
  };

  const handleGalleryNav = useCallback((dir: "prev" | "next", total: number) => {
    setImageLoaded(false);
    setGalleryIndex((prev) =>
      dir === "prev"
        ? prev > 0 ? prev - 1 : total - 1
        : prev < total - 1 ? prev + 1 : 0
    );
  }, []);

  // 해당 포트폴리오에 존재하는 세션 목록
  const sessions = useMemo(() => {
    if (!selectedPortfolio) return [];
    const sessionSet = new Set<number>();
    portfolioMedia
      .filter((m) => m.portfolioId === selectedPortfolio.id && m.session != null)
      .forEach((m) => sessionSet.add(m.session as number));
    return Array.from(sessionSet).sort((a, b) => a - b);
  }, [selectedPortfolio, portfolioMedia]);
  const hasSessions = sessions.length > 1;

  // 세션이 바뀌면 갤러리 인덱스 리셋
  useEffect(() => {
    setGalleryIndex(0);
    setImageLoaded(false);
    setPhotoExpanded(false);
  }, [selectedSession]);

  // 세션이 있는 포트폴리오를 처음 열면 1회차 자동 선택
  useEffect(() => {
    if (hasSessions && selectedSession === null) {
      setSelectedSession(sessions[0]);
    }
  }, [hasSessions, sessions, selectedSession]);

  const galleryImages = useMemo(() => {
    if (!selectedPortfolio) return [];
    return portfolioMedia
      .filter((m) => {
        if (m.portfolioId !== selectedPortfolio.id || m.type !== "gallery") return false;
        if (hasSessions && selectedSession !== null) {
          return m.session === selectedSession || m.session == null;
        }
        return true;
      })
      .map((m) => m.url);
  }, [selectedPortfolio, portfolioMedia, hasSessions, selectedSession]);
  const hasGallery = galleryImages.length > 0;

  // 현장사진 (세션 필터 적용)
  const photoImages = useMemo(() => {
    if (!selectedPortfolio) return [];
    return portfolioMedia
      .filter((m) => {
        if (m.portfolioId !== selectedPortfolio.id || m.type !== "photo") return false;
        if (hasSessions && selectedSession !== null) {
          return m.session === selectedSession || m.session == null;
        }
        return true;
      })
      .map((m) => ({ url: m.url, label: m.label }));
  }, [selectedPortfolio, portfolioMedia, hasSessions, selectedSession]);
  const hasPhotos = photoImages.length > 0;
  const PHOTO_PREVIEW_COUNT = 6;

  // 인접 이미지 프리로드: 현재 보는 이미지의 좌/우 1장씩 미리 다운로드
  useEffect(() => {
    if (!hasGallery || galleryImages.length <= 1) return;
    const toPreload = [
      galleryImages[(galleryIndex + 1) % galleryImages.length],
      galleryImages[(galleryIndex - 1 + galleryImages.length) % galleryImages.length],
    ];
    const links: HTMLLinkElement[] = [];
    toPreload.forEach((url) => {
      if (!url) return;
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = url;
      document.head.appendChild(link);
      links.push(link);
    });
    return () => links.forEach((l) => l.remove());
  }, [galleryIndex, galleryImages, hasGallery]);

  return (
    <div className="pt-[56px] min-h-screen">
      {/* Hero */}
      <section className="bg-white border-b border-slate-200 py-16 text-center">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">포트폴리오</h1>
        <p className="text-slate-500 text-[13px] mt-2">
          파란컴퍼니가 함께한 행사들을 소개합니다
        </p>
        <div className="flex justify-center gap-10 mt-8">
          <div className="text-center">
            <p className="font-num text-2xl font-bold text-slate-900">
              {totalCount}+
            </p>
            <p className="text-[12px] text-slate-400 mt-1">프로젝트</p>
          </div>
          <div className="text-center">
            <p className="font-num text-2xl font-bold text-slate-900">
              93점
            </p>
            <p className="text-[12px] text-slate-400 mt-1">참가자 만족도</p>
          </div>
          <div className="text-center">
            <p className="font-num text-2xl font-bold text-slate-900">
              90%
            </p>
            <p className="text-[12px] text-slate-400 mt-1">재계약률</p>
          </div>
        </div>
      </section>

      {/* 필터 */}
      <div className="max-w-content mx-auto px-6 py-6 flex flex-wrap items-center gap-3">
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-[6px] border border-slate-200 bg-white px-4 py-2.5 text-[13px] text-slate-600 focus:outline-none focus:border-slate-400"
        >
          {EVENT_TYPES.map((t) => (
            <option key={t} value={t}>
              유형: {t}
            </option>
          ))}
        </select>
        <select
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          className="rounded-[6px] border border-slate-200 bg-white px-4 py-2.5 text-[13px] text-slate-600 focus:outline-none focus:border-slate-400"
        >
          {YEARS.map((y) => (
            <option key={y} value={y}>
              연도: {y}
            </option>
          ))}
        </select>
        <div className="relative flex-1 min-w-[180px] max-w-[300px]">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-[6px] border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-[13px] text-slate-900 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-200"
          />
        </div>
      </div>

      {/* Masonry 그리드 */}
      <div className="max-w-content mx-auto px-6 pb-16">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <p className="text-lg">검색 결과가 없습니다</p>
            <p className="text-[13px] mt-1">다른 조건으로 검색해보세요</p>
          </div>
        ) : (
          <Masonry
            breakpointCols={{ default: 3, 1024: 2, 640: 1 }}
            className="flex gap-6 -ml-6"
            columnClassName="pl-6 bg-clip-padding"
          >
            {filtered.map((pf) => {
              const gradient =
                GRADIENT_MAP[pf.gradientType] ?? "from-slate-100 to-slate-200";

              return (
                <div
                  key={pf.id}
                  onClick={() => openPortfolio(pf)}
                  className="cursor-pointer group rounded-[10px] overflow-hidden bg-white border border-slate-200 hover:border-slate-300 transition-all duration-200 mb-6"
                >
                  {/* 썸네일 */}
                  <div className="relative h-[220px]">
                    {pf.imageUrl ? (
                      <Image
                        src={pf.imageUrl}
                        alt={pf.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${gradient} flex flex-col items-center justify-center`}>
                        <span className="text-5xl">{pf.emoji}</span>
                      </div>
                    )}

                    {/* 이벤트 유형 뱃지 */}
                    <span className="absolute top-3 left-3 text-[11px] font-medium bg-white/90 text-slate-700 px-2.5 py-1 rounded-[4px]">
                      {pf.eventType}
                    </span>

                    {/* 미디어 카운트 */}
                    {(() => {
                      const cnt = portfolioMedia.filter((m) => m.portfolioId === pf.id && (m.type === "gallery" || m.type === "photo")).length;
                      return cnt > 0 ? (
                        <span className="absolute top-3 right-3 text-[10px] font-semibold bg-black/50 text-white px-2 py-0.5 rounded-full">
                          +{cnt} 사진
                        </span>
                      ) : null;
                    })()}

                    {/* Hover 오버레이 + 텍스트 슬라이드업 */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
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
                      {pf.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-[4px]"
                        >
                          #{tag}
                        </span>
                      ))}
                      {pf.tags.length > 3 && (
                        <span className="text-[10px] text-slate-400">
                          +{pf.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </Masonry>
        )}
      </div>

      {/* CTA */}
      <div className="max-w-content mx-auto px-6 pb-20">
        <div className="bg-slate-900 rounded-[14px] p-12 text-center">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            다음 행사의 주인공이 되어보세요
          </h2>
          <p className="text-slate-400 text-[13px] mt-2">
            파란컴퍼니와 함께라면 성공적인 행사를 만들 수 있습니다
          </p>
          <button
            onClick={() => setContactOpen(true)}
            className="btn-white btn-lg justify-center mt-6 inline-flex"
          >
            무료 견적 시작하기
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} />

      {/* 상세 모달 */}
      {selectedPortfolio && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          onClick={() => setSelectedPortfolio(null)}
        >
          {/* 오버레이 */}
          <div className="absolute inset-0 bg-black/20" />

          {/* 모달 */}
          <div
            className="relative max-w-[640px] w-full bg-white rounded-[14px] overflow-hidden max-h-[90vh] overflow-y-auto"
            style={{ boxShadow: "0 8px 32px 0 rgb(0 0 0 / 0.08), 0 2px 8px 0 rgb(0 0 0 / 0.04)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 닫기 */}
            <button
              onClick={() => setSelectedPortfolio(null)}
              className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors"
              aria-label="닫기"
            >
              <X size={16} className="text-slate-600" />
            </button>

            {/* 썸네일 또는 갤러리 */}
            <div className="relative h-[400px] bg-slate-100">
              {hasGallery ? (
                <>
                  {/* 로딩 스켈레톤 */}
                  {!imageLoaded && (
                    <div className="absolute inset-0 bg-slate-200 animate-pulse" />
                  )}
                  <Image
                    key={galleryImages[galleryIndex]}
                    src={galleryImages[galleryIndex]}
                    alt={`${selectedPortfolio.title} - ${galleryIndex + 1}`}
                    fill
                    sizes="640px"
                    priority
                    className={`object-contain transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
                    onLoad={() => setImageLoaded(true)}
                  />
                  {/* 갤러리 네비게이션 */}
                  {galleryImages.length > 1 && (
                    <>
                      <button
                        onClick={() => handleGalleryNav("prev", galleryImages.length)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 rounded-full flex items-center justify-center hover:bg-black/60 transition-colors"
                      >
                        <ChevronLeft size={16} className="text-white" />
                      </button>
                      <button
                        onClick={() => handleGalleryNav("next", galleryImages.length)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 rounded-full flex items-center justify-center hover:bg-black/60 transition-colors"
                      >
                        <ChevronRight size={16} className="text-white" />
                      </button>
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white text-[12px] px-3 py-1 rounded-full">
                        {galleryIndex + 1} / {galleryImages.length}
                      </div>
                    </>
                  )}
                </>
              ) : selectedPortfolio.imageUrl ? (
                <Image
                  src={selectedPortfolio.imageUrl}
                  alt={selectedPortfolio.title}
                  fill
                  sizes="640px"
                  className="object-contain"
                />
              ) : (
                <div
                  className={`w-full h-full bg-gradient-to-br ${
                    GRADIENT_MAP[selectedPortfolio.gradientType] ??
                    "from-slate-100 to-slate-200"
                  } flex items-center justify-center`}
                >
                  <span className="text-7xl">{selectedPortfolio.emoji}</span>
                </div>
              )}
            </div>

            {/* 갤러리 썸네일 */}
            {hasGallery && galleryImages.length > 1 && (
              <div className="flex gap-1.5 px-8 pt-4 overflow-x-auto scrollbar-hide">
                {galleryImages.map((url, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setImageLoaded(false);
                      setGalleryIndex(idx);
                    }}
                    className={`relative w-[56px] h-[42px] rounded-[6px] overflow-hidden shrink-0 border-2 transition-colors ${
                      idx === galleryIndex
                        ? "border-primary"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={url}
                      alt={`썸네일 ${idx + 1}`}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* 회차 토글 */}
            {hasSessions && (
              <div className="flex gap-1.5 px-8 pt-4">
                {sessions.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSession(s)}
                    className={`text-[12px] px-3 py-1.5 rounded-full font-medium transition-colors ${
                      selectedSession === s
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                    }`}
                  >
                    {s}회차
                  </button>
                ))}
              </div>
            )}

            {/* 정보 */}
            <div className="p-8">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-medium bg-primary-50 text-primary px-2 py-0.5 rounded-[4px]">
                  {selectedPortfolio.eventType}
                </span>
                <span className="text-[12px] text-slate-400 font-num">
                  {selectedPortfolio.year}
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                {selectedPortfolio.title}
              </h2>
              <div className="flex items-center gap-1.5 mt-2 text-[13px] text-slate-500">
                <MapPin size={14} />
                {selectedPortfolio.venue}
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {selectedPortfolio.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[12px] bg-slate-100 text-slate-600 px-2.5 py-1 rounded-[4px]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {selectedPortfolio.description && (
                <p className="mt-4 text-[13px] text-slate-600 leading-relaxed">
                  {selectedPortfolio.description}
                </p>
              )}

              {/* 현장사진 그리드 */}
              {hasPhotos && (
                <div className="mt-6">
                  <h3 className="text-[13px] font-semibold text-slate-700 mb-3">
                    현장사진
                    <span className="text-slate-400 font-normal ml-1">
                      ({photoImages.length}장)
                    </span>
                  </h3>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(photoExpanded ? photoImages : photoImages.slice(0, PHOTO_PREVIEW_COUNT)).map((photo, idx) => (
                      <div
                        key={idx}
                        className="relative aspect-square rounded-[6px] overflow-hidden bg-slate-100"
                      >
                        <Image
                          src={photo.url}
                          alt={photo.label}
                          fill
                          sizes="200px"
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  {photoImages.length > PHOTO_PREVIEW_COUNT && (
                    <button
                      onClick={() => setPhotoExpanded(!photoExpanded)}
                      className="w-full mt-2 py-2 text-[12px] text-slate-500 hover:text-slate-700 transition-colors"
                    >
                      {photoExpanded
                        ? "접기"
                        : `+${photoImages.length - PHOTO_PREVIEW_COUNT}장 더보기`}
                    </button>
                  )}
                </div>
              )}

              <div className="mt-6 flex gap-3">
                <button
                  className="btn-primary btn-md flex-1 justify-center"
                  onClick={() => {
                    setSelectedPortfolio(null);
                    setContactOpen(true);
                  }}
                >
                  비슷한 행사 견적 요청
                </button>
                <button
                  onClick={() => setSelectedPortfolio(null)}
                  className="btn-ghost btn-md"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
