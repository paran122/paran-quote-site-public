"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { BlurFade } from "@/components/ui/blur-fade";
import { X, ChevronLeft, ChevronRight, Camera, Palette } from "lucide-react";
import { useCatalogStore } from "@/stores/catalogStore";
import type { Portfolio, PortfolioMedia } from "@/types";

/** 세로 이미지 자동 감지 — 세로면 object-contain, 가로면 object-cover */
function AutoFitImage({ src, alt, sizes, className = "" }: {
  src: string; alt: string; sizes: string; className?: string;
}) {
  const [isPortrait, setIsPortrait] = useState(false);
  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={`${isPortrait ? "object-contain" : "object-cover"} ${className}`}
      sizes={sizes}
      onLoad={(e) => {
        const img = e.currentTarget as HTMLImageElement;
        if (img.naturalHeight > img.naturalWidth) setIsPortrait(true);
      }}
    />
  );
}

interface Project {
  slug: string;
  name: string;
  client: string;
  date: string;
  category: string;
  deliverables: string[];
  images: { src: string; label: string }[];
  photos: { src: string; label: string }[];
  video?: string;
  portfolioId: string;
}

/** Portfolio + Media → Project (UI) 변환 */
function portfolioToProject(pf: Portfolio, media: PortfolioMedia[]): Project {
  const date = pf.eventDate
    ? pf.eventDate.slice(0, 7).replace("-", ".")
    : String(pf.year);

  const mine = media.filter((m) => m.portfolioId === pf.id);
  const gallery = mine.filter((m) => m.type === "gallery");
  const photos = mine.filter((m) => m.type === "photo");
  const video = mine.find((m) => m.type === "video");

  const images = gallery.map((m) => ({ src: m.url, label: m.label }));

  return {
    slug: pf.slug ?? pf.id,
    name: pf.title,
    client: pf.client ?? "",
    date,
    category: pf.tags[0] ?? pf.eventType,
    deliverables: pf.deliverables ?? [],
    images: images.length > 0 ? images : [{ src: pf.imageUrl ?? "", label: pf.title }],
    photos: photos.map((m) => ({ src: m.url, label: m.label })),
    video: video?.url,
    portfolioId: pf.id,
  };
}

const categoryStyle: Record<string, string> = {
  포럼: "bg-purple-100 text-purple-700",
  세미나: "bg-emerald-100 text-emerald-700",
  행사운영: "bg-blue-100 text-blue-700",
  교육: "bg-amber-100 text-amber-700",
  콘텐츠: "bg-orange-100 text-orange-700",
};

function PhotoLightbox({
  photos,
  initialIdx,
  onClose,
}: {
  photos: { src: string; label: string }[];
  initialIdx: number;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(initialIdx);

  const goNext = useCallback(() => {
    setIdx((i) => (i + 1) % photos.length);
  }, [photos.length]);

  const goPrev = useCallback(() => {
    setIdx((i) => (i - 1 + photos.length) % photos.length);
  }, [photos.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, goNext, goPrev]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md"
      onClick={onClose}
    >
      <div className="relative flex h-full w-full items-center justify-center" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20"
        >
          <X className="h-6 w-6 text-white" />
        </button>

        <div className="absolute top-4 left-4 rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white/90 backdrop-blur-sm">
          {idx + 1} / {photos.length}
        </div>

        <button
          onClick={goPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 transition-colors hover:bg-white/20"
        >
          <ChevronLeft className="h-6 w-6 text-white" />
        </button>

        <div className="relative h-[80vh] w-[80vw]">
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative h-full w-full"
            >
              <Image
                src={photos[idx].src}
                alt={photos[idx].label}
                fill
                className="object-contain"
                sizes="80vw"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <button
          onClick={goNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 transition-colors hover:bg-white/20"
        >
          <ChevronRight className="h-6 w-6 text-white" />
        </button>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-lg bg-black/50 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
          {photos[idx].label}
        </div>
      </div>
    </motion.div>
  );
}

function PhotoToggleCell({
  photoA,
  photoB,
  delay,
  onClick,
}: {
  photoA: { src: string; label: string };
  photoB: { src: string; label: string };
  delay: number;
  onClick: (idx: number) => void;
}) {
  const [showSecond, setShowSecond] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    const startDelay = setTimeout(() => {
      setShowSecond(true);
      timer = setInterval(() => {
        setShowSecond((s) => !s);
      }, 4000);
    }, delay);
    return () => { clearTimeout(startDelay); clearInterval(timer); };
  }, [delay]);

  return (
    <div
      className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-lg bg-gray-100 md:rounded-2xl"
      onClick={() => onClick(showSecond ? 1 : 0)}
    >
      {/* B layer (아래) */}
      <div className="absolute inset-0">
        <AutoFitImage src={photoB.src} alt={photoB.label} sizes="(max-width: 768px) 50vw, 25vw" />
      </div>
      {/* A layer (위) — opacity로 크로스페이드 */}
      <motion.div
        animate={{ opacity: showSecond ? 0 : 1 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
        className="absolute inset-0"
      >
        <AutoFitImage src={photoA.src} alt={photoA.label} sizes="(max-width: 768px) 50vw, 25vw" />
      </motion.div>
      {/* Hover scale effect */}
      <div className="absolute inset-0 transition-transform duration-300 group-hover:scale-105" />
    </div>
  );
}

/* ── Photo Section Styles ── */
function PhotoSection({
  photos,
  hasPhotos,
  onPhotoClick,
  photoStyle,
}: {
  photos: { src: string; label: string }[];
  hasPhotos: boolean;
  onPhotoClick: (idx: number) => void;
  photoStyle: number;
}) {
  const [photoIdx, setPhotoIdx] = useState(0);

  // Auto-advance for slideshow styles
  useEffect(() => {
    if (!hasPhotos || photos.length <= 1) return;
    if (photoStyle === 0 || photoStyle === 2) {
      const timer = setInterval(() => {
        setPhotoIdx((i) => (i + 1) % photos.length);
      }, 3000);
      return () => clearInterval(timer);
    }
  }, [hasPhotos, photos.length, photoStyle, photoIdx]);

  const header = (
    <div className="mb-2 flex items-center gap-2 md:mb-4 md:gap-3">
      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-blue-600 shadow-md shadow-blue-200 md:h-9 md:w-9">
        <Camera className="h-2.5 w-2.5 text-white drop-shadow-sm md:h-[18px] md:w-[18px]" />
      </div>
      <h5 className="text-[11px] font-bold tracking-tight text-gray-800 md:text-[17px]">현장사진</h5>
      {hasPhotos && (
        <span className="rounded-full bg-gradient-to-r from-sky-50 to-blue-50 border border-blue-200/60 px-1.5 py-0.5 text-[8px] font-semibold text-blue-600 md:px-2.5 md:text-xs">{photos.length}장</span>
      )}
    </div>
  );

  const placeholder = (
    <div className="grid grid-cols-3 gap-1.5 md:grid-cols-4 md:gap-3">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex aspect-[4/3] flex-col items-center justify-center rounded-xl bg-gray-100 md:rounded-2xl">
          <Camera className="mb-1 h-5 w-5 text-gray-300 md:mb-1.5 md:h-8 md:w-8" />
          <span className="text-[9px] font-medium text-gray-400 md:text-[11px]">준비 중</span>
        </div>
      ))}
    </div>
  );

  if (!hasPhotos) {
    return <div className="px-5 pt-4 pb-2 md:px-10 md:pt-6 md:pb-4">{header}{placeholder}</div>;
  }

  /* Style 0: 슬라이드쇼 — 메인 1장 + 카운터 + 진행바 */
  if (photoStyle === 0) {
    return (
      <div className="px-5 pt-4 pb-2 md:px-10 md:pt-6 md:pb-4">
        {header}
        <div className="relative mx-auto aspect-[16/9] max-w-full overflow-hidden rounded-xl bg-gray-100 md:max-w-[90%]">
          <AnimatePresence mode="wait">
            <motion.div key={photoIdx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="absolute inset-0">
              <AutoFitImage src={photos[photoIdx].src} alt={photos[photoIdx].label || `사진 ${photoIdx + 1}`} sizes="90vw" />
            </motion.div>
          </AnimatePresence>
          <div className="absolute top-2 left-2 rounded-full bg-black/50 px-2.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm md:top-3 md:left-3 md:text-xs">
            {photoIdx + 1} / {photos.length}
          </div>
          <button onClick={() => setPhotoIdx((i) => (i - 1 + photos.length) % photos.length)} className="absolute left-1.5 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1 shadow md:left-3 md:p-1.5">
            <ChevronLeft className="h-3.5 w-3.5 text-gray-700 md:h-5 md:w-5" />
          </button>
          <button onClick={() => setPhotoIdx((i) => (i + 1) % photos.length)} className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1 shadow md:right-3 md:p-1.5">
            <ChevronRight className="h-3.5 w-3.5 text-gray-700 md:h-5 md:w-5" />
          </button>
          <div className="absolute bottom-0 left-0 h-0.5 w-full bg-black/10">
            <motion.div key={photoIdx} initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 3, ease: "linear" }} className="h-full bg-blue-500" />
          </div>
        </div>
      </div>
    );
  }

  /* Style 1: 대표 4장 + 더보기 버튼 */
  if (photoStyle === 1) {
    const preview = photos.slice(0, 4);
    const remaining = photos.length - 4;
    return (
      <div className="px-5 pt-4 pb-2 md:px-10 md:pt-6 md:pb-4">
        {header}
        <div className="mx-auto grid max-w-full grid-cols-2 gap-1.5 md:max-w-[90%] md:gap-3">
          {preview.map((p, i) => (
            <div key={i} className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-lg bg-gray-100" onClick={() => onPhotoClick(i)}>
              <AutoFitImage src={p.src} alt={p.label || `사진 ${i + 1}`} sizes="45vw" className="transition-transform duration-300 group-hover:scale-105" />
              {i === 3 && remaining > 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <span className="text-lg font-bold text-white md:text-2xl">+{remaining}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* Style 2: 메인 1장 크게 + 하단 썸네일 스트립 */
  if (photoStyle === 2) {
    return (
      <div className="px-5 pt-4 pb-2 md:px-10 md:pt-6 md:pb-4">
        {header}
        <div className="mx-auto max-w-full md:max-w-[90%]">
          <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-gray-100 cursor-pointer" onClick={() => onPhotoClick(photoIdx)}>
            <AnimatePresence mode="wait">
              <motion.div key={photoIdx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="absolute inset-0">
                <AutoFitImage src={photos[photoIdx].src} alt="" sizes="90vw" />
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="mt-2 flex gap-1 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
            {photos.map((p, i) => (
              <button key={i} onClick={() => setPhotoIdx(i)} className={`flex-shrink-0 overflow-hidden rounded-md transition-all ${i === photoIdx ? "ring-2 ring-blue-500 opacity-100" : "opacity-50 hover:opacity-80"}`}>
                <Image src={p.src} alt="" width={64} height={44} className="h-8 w-12 object-cover md:h-11 md:w-16" />
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* Style 3: 가로 마퀴 자동 흐름 */
  if (photoStyle === 3) {
    const doubled = [...photos, ...photos];
    return (
      <div className="px-5 pt-4 pb-2 md:px-10 md:pt-6 md:pb-4">
        {header}
        <style>{`@keyframes photo-flow{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`}</style>
        <div className="overflow-hidden rounded-xl">
          <div className="flex gap-1.5" style={{ width: "max-content", animation: `photo-flow ${photos.length * 3}s linear infinite` }}>
            {doubled.map((p, i) => (
              <div key={i} className="relative h-24 w-36 flex-shrink-0 cursor-pointer overflow-hidden rounded-lg bg-gray-100 md:h-36 md:w-52" onClick={() => onPhotoClick(i % photos.length)}>
                <AutoFitImage src={p.src} alt="" sizes="150px" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* Style 4: 콜라주 — 대표 1장 크게 + 2장 작게 + 더보기 */
  return (
    <div className="px-5 pt-4 pb-2 md:px-10 md:pt-6 md:pb-4">
      {header}
      <div className="mx-auto grid max-w-full grid-cols-3 gap-1.5 md:max-w-[90%] md:gap-2" style={{ gridTemplateRows: "1fr 1fr" }}>
        <div className="col-span-2 row-span-2 relative aspect-[4/3] cursor-pointer overflow-hidden rounded-xl bg-gray-100" onClick={() => onPhotoClick(0)}>
          <AutoFitImage src={photos[0].src} alt="" sizes="60vw" />
        </div>
        <div className="relative aspect-[4/3] cursor-pointer overflow-hidden rounded-xl bg-gray-100" onClick={() => onPhotoClick(1)}>
          <AutoFitImage src={photos[1].src} alt="" sizes="30vw" />
        </div>
        <div className="relative aspect-[4/3] cursor-pointer overflow-hidden rounded-xl bg-gray-100" onClick={() => onPhotoClick(2)}>
          <AutoFitImage src={photos[2].src} alt="" sizes="30vw" />
          {photos.length > 3 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer" onClick={(e) => { e.stopPropagation(); onPhotoClick(2); }}>
              <span className="text-sm font-bold text-white md:text-lg">+{photos.length - 3}장</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PortfolioModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const photoStyle = 2; // fixed: thumbnail strip

  const photos = project.photos;
  const hasPhotos = photos.length > 0;

  const goNext = useCallback(() => {
    setCurrentIdx((i) => (i + 1) % project.images.length);
  }, [project.images.length]);

  const goPrev = useCallback(() => {
    setCurrentIdx((i) => (i - 1 + project.images.length) % project.images.length);
  }, [project.images.length]);

  // 자동 재생: 3초마다 다음 이미지로 전환
  useEffect(() => {
    if (paused || project.images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIdx((i) => (i + 1) % project.images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [paused, project.images.length, currentIdx]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (lightboxIdx !== null) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") { setPaused(true); goNext(); }
      if (e.key === "ArrowLeft") { setPaused(true); goPrev(); }
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose, goNext, goPrev, lightboxIdx]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", duration: 0.4 }}
        className="relative max-h-[95vh] w-full max-w-[90vw] overflow-y-auto rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title bar - sticky */}
        <div className="sticky top-0 z-10 bg-gradient-to-b from-[#4f46e5] to-[#6ea8fe] px-5 py-3 rounded-t-2xl md:px-10 md:py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-4">
              <h4 className="text-[11px] font-bold tracking-tight text-white md:text-lg">{project.name}</h4>
              <span className="h-4 w-px bg-white/30 md:h-6" />
              <span className="rounded-md bg-white/20 px-1.5 py-0.5 text-[9px] font-semibold text-white md:rounded-lg md:px-3 md:py-1.5 md:text-sm">{project.client}</span>
            </div>
            <button
              onClick={onClose}
              className="rounded-full bg-white/20 p-1.5 transition-colors hover:bg-white/30 md:p-2"
            >
              <X className="h-4 w-4 text-white md:h-5 md:w-5" />
            </button>
          </div>
        </div>

        {/* Photos section — 현장사진이 있을 때만 표시 */}
        {hasPhotos && (
          <>
            {/* Mobile: slideshow + thumbnail strip */}
            <div className="md:hidden">
              <PhotoSection photos={photos} hasPhotos={true} onPhotoClick={(idx) => setLightboxIdx(idx)} photoStyle={photoStyle} />
            </div>
            {/* PC: original 4-column toggle grid */}
            <div className="hidden md:block px-10 pt-6 pb-4">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-blue-600 shadow-md shadow-blue-200">
                  <Camera className="h-[18px] w-[18px] text-white drop-shadow-sm" />
                </div>
                <h5 className="text-[17px] font-bold tracking-tight text-gray-800">현장사진</h5>
                <span className="rounded-full bg-gradient-to-r from-sky-50 to-blue-50 border border-blue-200/60 px-2.5 py-0.5 text-xs font-semibold text-blue-600">{photos.length}장</span>
              </div>
              <div className="mx-auto grid max-w-[90%] grid-cols-4 gap-3">
                {Array.from({ length: Math.ceil(photos.length / 2) }).map((_, i) => {
                  const idxA = i * 2;
                  const idxB = i * 2 + 1;
                  const hasB = idxB < photos.length;
                  return hasB ? (
                    <PhotoToggleCell
                      key={i}
                      photoA={photos[idxA]}
                      photoB={photos[idxB]}
                      delay={i * 200}
                      onClick={(subIdx) => setLightboxIdx(idxA + subIdx)}
                    />
                  ) : (
                    <div
                      key={i}
                      className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-2xl bg-gray-100"
                      onClick={() => setLightboxIdx(idxA)}
                    >
                      <Image
                        src={photos[idxA].src}
                        alt={photos[idxA].label}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="25vw"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Divider between sections */}
            <div className="mx-5 my-4 h-[3px] rounded-full bg-gray-200 md:mx-10 md:my-0 md:h-px md:rounded-none md:border-t md:border-gray-200 md:bg-transparent" />
          </>
        )}

        {/* Design section */}
        <div className="px-5 pt-3 pb-2 md:px-10 md:pt-4">
          <div className="mb-3 flex items-center gap-2 md:mb-4 md:gap-3">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-violet-400 to-purple-600 shadow-md shadow-purple-200 md:h-9 md:w-9">
              <Palette className="h-2.5 w-2.5 text-white drop-shadow-sm md:h-[18px] md:w-[18px]" />
            </div>
            <h5 className="text-[11px] font-bold tracking-tight text-gray-800 md:text-[17px]">시안물</h5>
            <span className="rounded-full bg-violet-100 px-1.5 py-0.5 text-[8px] font-bold text-violet-700 md:px-2.5 md:text-xs">{project.images.length}건</span>
          </div>

          {/* Image carousel */}
          <div className="relative mx-auto aspect-[16/9] w-full max-w-full rounded-xl overflow-hidden bg-gray-100 md:max-w-[90%]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIdx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative h-full w-full"
              >
                <Image
                  src={project.images[currentIdx].src}
                  alt={project.images[currentIdx].label}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 1152px"
                  priority={currentIdx === 0}
                />
              </motion.div>
            </AnimatePresence>

            {project.images.length > 1 && (
              <>
                <button
                  onClick={() => { setPaused(true); goPrev(); }}
                  className="absolute left-1.5 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-1 shadow-md transition-colors hover:bg-white md:left-3 md:p-2"
                >
                  <ChevronLeft className="h-4 w-4 text-gray-700 md:h-5 md:w-5" />
                </button>
                <button
                  onClick={() => { setPaused(true); goNext(); }}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-1 shadow-md transition-colors hover:bg-white md:right-3 md:p-2"
                >
                  <ChevronRight className="h-4 w-4 text-gray-700 md:h-5 md:w-5" />
                </button>
              </>
            )}

            {/* Navigation counter + play/pause */}
            <div className="absolute top-1.5 left-1.5 flex items-center gap-1 md:top-4 md:left-4 md:gap-2">
              <div className="rounded-full bg-black/40 px-1.5 py-0.5 text-[8px] font-medium text-white/90 backdrop-blur-sm md:px-3 md:py-1 md:text-xs">
                {currentIdx + 1} / {project.images.length}
              </div>
              {project.images.length > 1 && (
                <button
                  onClick={() => setPaused((p) => !p)}
                  className="rounded-full bg-black/40 px-1.5 py-0.5 text-[8px] font-medium text-white/90 backdrop-blur-sm transition-colors hover:bg-black/60 md:px-2.5 md:py-1 md:text-xs"
                >
                  {paused ? "▶ 재생" : "⏸ 일시정지"}
                </button>
              )}
            </div>

            {/* Current label */}
            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 rounded-full bg-black/40 px-2 py-0.5 text-[8px] font-medium text-white backdrop-blur-sm md:bottom-4 md:px-4 md:py-1.5 md:text-sm">
              {project.images[currentIdx].label}
            </div>
          </div>

          {/* Thumbnails */}
          <div className="mx-auto flex max-w-full gap-1.5 overflow-x-auto bg-gray-50/50 p-2 md:max-w-[90%] md:gap-2 md:p-3 rounded-b-xl mb-3 md:mb-4">
            {project.images.map((img, i) => (
              <button
                key={img.src}
                onClick={() => { setPaused(true); setCurrentIdx(i); }}
                className={`flex-shrink-0 flex flex-col items-center gap-0.5 rounded-md border-2 transition-all md:gap-1 md:rounded-lg ${
                  i === currentIdx ? "border-blue-500 shadow-md" : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <Image src={img.src} alt={img.label} width={96} height={64} className="h-10 w-16 object-cover rounded-t-sm md:h-16 md:w-24 md:rounded-t-md" />
                <span className={`text-[7px] pb-0.5 md:text-[10px] md:pb-1 ${i === currentIdx ? "font-semibold text-blue-600" : "text-gray-400"}`}>{img.label}</span>
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Photo lightbox */}
      <AnimatePresence>
        {lightboxIdx !== null && photos.length > 0 && (
          <PhotoLightbox
            photos={photos}
            initialIdx={lightboxIdx}
            onClose={() => setLightboxIdx(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* 사진 콜라주 영상 목록 (외곽 검은 테두리 크롭 대상) */
const COLLAGE_VIDEO_NAMES = new Set([
  "문화예술클럽 결과공유회",
  "필승해군캠프",
  "지역사회 역량강화 프로그램",
  "추계 자동차부품산업 세미나",
  "예술인 권리보호 교육",
  "교육감협의회 부스 설치",
]);

/** Lazy video: only plays when visible in viewport */
function LazyVideo({ src, className }: { src: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);
  const [opacity, setOpacity] = useState(1);
  const [isPortrait, setIsPortrait] = useState(false);
  const fadeTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (inView) {
      el.play().catch(() => {});
    } else {
      el.pause();
    }
  }, [inView]);

  // Crossfade: fade out near the end, fade back in at the start
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const FADE_DURATION = 0.5; // seconds before end to start fading

    const onTimeUpdate = () => {
      if (!el.duration || !isFinite(el.duration)) return;
      const remaining = el.duration - el.currentTime;
      if (remaining <= FADE_DURATION) {
        setOpacity(remaining / FADE_DURATION);
      } else if (el.currentTime <= FADE_DURATION) {
        setOpacity(Math.min(1, el.currentTime / FADE_DURATION));
      } else {
        setOpacity(1);
      }
    };

    el.addEventListener("timeupdate", onTimeUpdate);
    return () => {
      el.removeEventListener("timeupdate", onTimeUpdate);
      if (fadeTimerRef.current) clearInterval(fadeTimerRef.current);
    };
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      loop
      muted
      playsInline
      preload="none"
      className={isPortrait ? (className || "").replace("object-cover", "object-contain") : className}
      style={{ opacity, transition: "opacity 0.15s ease" }}
      onLoadedMetadata={(e) => {
        const v = e.currentTarget;
        if (v.videoHeight > v.videoWidth) setIsPortrait(true);
      }}
    />
  );
}

/** Card thumbnail: soft zoom + dissolve (Ken Burns lite) */
function CardPhotoRotator({ photos, sizes, stagger = 0, priority = false }: { photos: { src: string; label: string }[]; sizes: string; stagger?: number; priority?: boolean }) {
  const [idx, setIdx] = useState(0);
  const [inView, setInView] = useState(false);
  const [portraitSet, setPortraitSet] = useState<Set<number>>(new Set());
  const [errorSet, setErrorSet] = useState<Set<number>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);

  // Viewport detection
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

  // Only run timer when in viewport
  useEffect(() => {
    if (photos.length <= 1 || !inView) return;
    const pickRandom = (prev: number) => {
      const validIndices = Array.from({ length: photos.length }, (_, i) => i).filter((i) => !errorSet.has(i) && i !== prev);
      if (validIndices.length === 0) return prev;
      return validIndices[Math.floor(Math.random() * validIndices.length)];
    };
    let cancelled = false;
    const randomInterval = () => 3000 + Math.random() * 3000; // 3~6초 랜덤
    const tick = () => {
      if (cancelled) return;
      setIdx((i) => pickRandom(i));
      setTimeout(tick, randomInterval());
    };
    const delay = setTimeout(tick, stagger);
    return () => { cancelled = true; clearTimeout(delay); };
  }, [photos.length, stagger, inView]);

  if (photos.length === 0) {
    return (
      <div ref={containerRef} className="flex h-full w-full items-center justify-center text-gray-300">
        <Camera className="h-6 w-6 md:h-12 md:w-12" />
      </div>
    );
  }

  // 다음 이미지 프리로드
  const nextIdx = (idx + 1) % photos.length;

  return (
    <div ref={containerRef} className="absolute inset-0">
      {/* 현재 이미지 아래에 깔리는 이전 이미지 (흰 화면 방지) */}
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
            sizes={sizes}
            priority={priority}
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
      {/* 다음 이미지 프리로드 (숨김) */}
      {photos.length > 1 && !errorSet.has(nextIdx) && (
        <Image
          src={photos[nextIdx].src}
          alt=""
          fill
          className="pointer-events-none opacity-0"
          sizes={sizes}
          aria-hidden
        />
      )}
    </div>
  );
}

function MobilePortfolioCard({ p, onSelect, index = 0 }: { p: Project; onSelect: (p: Project) => void; index?: number }) {
  return (
    <div
      onClick={() => onSelect(p)}
      className="w-[48vw] flex-shrink-0 cursor-pointer overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
        {p.video && !COLLAGE_VIDEO_NAMES.has(p.name) ? (
          <LazyVideo src={p.video} className="h-full w-full object-cover" />
        ) : (
          <CardPhotoRotator photos={p.photos.length > 0 ? p.photos : p.images} sizes="48vw" stagger={index * 150} />
        )}
      </div>
      <div className="px-1.5 py-1">
        <p className="text-[7px] font-semibold text-blue-500">{p.client}</p>
        <h3 className="text-[9px] font-bold leading-tight text-gray-800 line-clamp-1">{p.name}</h3>
      </div>
    </div>
  );
}

function MobilePortfolioCarousel({ filtered, onSelect }: { filtered: Project[]; onSelect: (p: Project) => void }) {
  const half = Math.ceil(filtered.length / 2);
  const topRow = filtered.slice(0, half);
  const bottomRow = filtered.slice(half);

  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const topOffset = useRef(0);
  const bottomOffset = useRef(0);
  const pausedUntil = useRef(0);
  const animatingRef = useRef(false);

  // Auto-scroll with rAF
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const now = Date.now();
      if (now > pausedUntil.current && !animatingRef.current) {
        const topEl = topRef.current;
        const bottomEl = bottomRef.current;
        if (topEl) {
          const halfW = topEl.scrollWidth / 2;
          topOffset.current -= 0.3;
          if (topOffset.current <= -halfW) topOffset.current += halfW;
          topEl.style.transform = `translateX(${topOffset.current}px)`;
        }
        if (bottomEl) {
          const halfW = bottomEl.scrollWidth / 2;
          bottomOffset.current += 0.3;
          if (bottomOffset.current >= 0) bottomOffset.current -= halfW;
          bottomEl.style.transform = `translateX(${bottomOffset.current}px)`;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    // Init bottom offset
    if (bottomRef.current) {
      bottomOffset.current = -(bottomRef.current.scrollWidth / 2);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [filtered]);

  const handleArrow = useCallback((dir: "prev" | "next") => {
    if (animatingRef.current) return;
    animatingRef.current = true;
    const cardW = window.innerWidth * 0.48 + 8;
    const delta = dir === "next" ? -cardW : cardW;

    const topStart = topOffset.current;
    const bottomStart = bottomOffset.current;
    const topTarget = topStart + delta;
    const bottomTarget = bottomStart + delta;
    const startTime = performance.now();

    const animate = (now: number) => {
      const t = Math.min((now - startTime) / 400, 1);
      const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

      topOffset.current = topStart + (topTarget - topStart) * ease;
      bottomOffset.current = bottomStart + (bottomTarget - bottomStart) * ease;

      if (topRef.current) topRef.current.style.transform = `translateX(${topOffset.current}px)`;
      if (bottomRef.current) bottomRef.current.style.transform = `translateX(${bottomOffset.current}px)`;

      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        animatingRef.current = false;
        pausedUntil.current = Date.now() + 3000;
      }
    };
    requestAnimationFrame(animate);
  }, []);

  // Touch swipe
  const touchStartX = useRef(0);
  const touchStartTopOffset = useRef(0);
  const touchStartBottomOffset = useRef(0);
  const isDragging = useRef(false);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (animatingRef.current) return;
    touchStartX.current = e.touches[0].clientX;
    touchStartTopOffset.current = topOffset.current;
    touchStartBottomOffset.current = bottomOffset.current;
    isDragging.current = true;
    pausedUntil.current = Infinity; // pause auto while dragging
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const dx = e.touches[0].clientX - touchStartX.current;
    topOffset.current = touchStartTopOffset.current + dx;
    bottomOffset.current = touchStartBottomOffset.current + dx;
    if (topRef.current) topRef.current.style.transform = `translateX(${topOffset.current}px)`;
    if (bottomRef.current) bottomRef.current.style.transform = `translateX(${bottomOffset.current}px)`;
  }, []);

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const cardW = window.innerWidth * 0.48 + 8;
    // Snap: if dragged more than 1/4 card, move to next/prev
    if (Math.abs(dx) > cardW * 0.25) {
      const cards = Math.round(Math.abs(dx) / cardW) || 1;
      const snapDelta = (dx > 0 ? cardW : -cardW) * cards;
      const topTarget = touchStartTopOffset.current + snapDelta;
      const bottomTarget = touchStartBottomOffset.current + snapDelta;
      const topStart = topOffset.current;
      const bottomStart = bottomOffset.current;
      animatingRef.current = true;
      const startTime = performance.now();
      const snap = (now: number) => {
        const t = Math.min((now - startTime) / 300, 1);
        const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        topOffset.current = topStart + (topTarget - topStart) * ease;
        bottomOffset.current = bottomStart + (bottomTarget - bottomStart) * ease;
        if (topRef.current) topRef.current.style.transform = `translateX(${topOffset.current}px)`;
        if (bottomRef.current) bottomRef.current.style.transform = `translateX(${bottomOffset.current}px)`;
        if (t < 1) requestAnimationFrame(snap);
        else { animatingRef.current = false; pausedUntil.current = Date.now() + 3000; }
      };
      requestAnimationFrame(snap);
    } else {
      // Snap back
      pausedUntil.current = Date.now() + 3000;
    }
  }, []);

  return (
    <div
      className="relative md:hidden space-y-2"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Top row */}
      <div className="overflow-hidden">
        <div ref={topRef} className="flex gap-2 will-change-transform" style={{ width: "max-content" }}>
          {[...topRow, ...topRow].map((p, i) => (
            <MobilePortfolioCard key={`t-${p.slug}-${i}`} p={p} onSelect={onSelect} index={i} />
          ))}
        </div>
      </div>
      {/* Bottom row */}
      <div className="overflow-hidden">
        <div ref={bottomRef} className="flex gap-2 will-change-transform" style={{ width: "max-content" }}>
          {[...bottomRow, ...bottomRow].map((p, i) => (
            <MobilePortfolioCard key={`b-${p.slug}-${i}`} p={p} onSelect={onSelect} index={i + 50} />
          ))}
        </div>
      </div>
      {/* Arrow buttons */}
      <button
        onClick={() => handleArrow("prev")}
        className="absolute left-1.5 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-xl border border-gray-200 active:scale-90 transition-transform"
      >
        <ChevronLeft className="h-5 w-5 text-gray-700" />
      </button>
      <button
        onClick={() => handleArrow("next")}
        className="absolute right-1.5 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-xl border border-gray-200 active:scale-90 transition-transform"
      >
        <ChevronRight className="h-5 w-5 text-gray-700" />
      </button>
    </div>
  );
}

export default function Portfolio() {
  const portfolios = useCatalogStore((s) => s.portfolios);
  const portfolioMedia = useCatalogStore((s) => s.portfolioMedia);
  const [active, setActive] = useState("전체");
  const [selected, setSelected] = useState<Project | null>(null);

  const projects = useMemo(
    () => portfolios.filter((pf) => pf.isVisible).map((pf) => portfolioToProject(pf, portfolioMedia)),
    [portfolios, portfolioMedia],
  );

  const categories = useMemo(() => {
    const cats = Array.from(new Set(projects.map((p) => p.category)));
    const order = ["포럼", "세미나", "행사운영", "교육", "전시", "콘텐츠"];
    return cats.sort((a, b) => {
      const ia = order.indexOf(a);
      const ib = order.indexOf(b);
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    });
  }, [projects]);

  const filtered = active === "전체" ? projects : projects.filter((p) => p.category === active);

  return (
    <section id="portfolio" className="relative overflow-hidden bg-gradient-to-b from-blue-50/30 to-white px-4 py-10 md:px-12 md:py-24 lg:px-20">
      <div className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-indigo-100/40 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <BlurFade delay={0.1}>
          <div className="mb-1 text-center font-[var(--font-inter)] text-xs font-extrabold tracking-[0.25em] text-blue-500/80 md:text-left md:text-base">PORTFOLIO</div>
          <div className="mx-auto mb-2 h-[2px] w-8 rounded-full bg-blue-400 md:mx-0 md:mb-4 md:w-10" />
          <h2 className="mb-2 text-center text-xl font-bold text-gray-900 md:mb-4 md:text-left md:text-5xl">주요 프로젝트</h2>
          <p className="mb-4 text-center text-xs text-gray-400 md:mb-10 md:text-left md:text-base">(2025~2026)</p>
        </BlurFade>

        {/* Filter tabs */}
        <BlurFade delay={0.2}>
          <div className="mb-4 flex flex-wrap justify-center gap-1 md:mb-10 md:justify-start md:gap-2">
            {["전체", ...categories].map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`rounded-full px-2.5 py-1 text-[10px] font-medium transition-all md:px-4 md:py-2 md:text-sm ${
                  active === cat
                    ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                    : "bg-sky-100 text-sky-600 hover:bg-sky-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </BlurFade>

        {/* Portfolio — Mobile: 2-col auto-scroll carousel */}
        <MobilePortfolioCarousel filtered={filtered} onSelect={setSelected} />

        {/* Portfolio — Desktop: 3-col grid */}
        <motion.div layout className="hidden md:grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <motion.div
                key={project.slug}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                onClick={() => setSelected(project)}
                className="group cursor-pointer overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-lg hover:-translate-y-1"
              >
                {/* Thumbnail */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                  {project.video && !COLLAGE_VIDEO_NAMES.has(project.name) ? (
                    <LazyVideo src={project.video} className="h-full w-full object-cover" />
                  ) : (
                    <CardPhotoRotator photos={project.photos.length > 0 ? project.photos : project.images} sizes="(max-width: 768px) 50vw, 33vw" stagger={i * 200} priority={i < 3} />
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${categoryStyle[project.category] || "bg-gray-100 text-gray-600"}`}>
                      {project.category}
                    </span>
                    <span className="text-xs text-gray-300">{project.date}</span>
                  </div>
                  <p className="mb-1 text-xs font-semibold text-blue-500">{project.client}</p>
                  <h3 className="mb-3 text-sm font-bold leading-snug text-gray-800">{project.name}</h3>
                  <div className="flex flex-wrap gap-1">
                    {project.deliverables.slice(0, 4).map((d) => (
                      <span key={d} className="rounded bg-gray-50 px-1.5 py-0.5 text-[10px] text-gray-400">
                        {d}
                      </span>
                    ))}
                    {project.deliverables.length > 4 && (
                      <span className="rounded bg-gray-50 px-1.5 py-0.5 text-[10px] text-gray-400">
                        +{project.deliverables.length - 4}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <PortfolioModal project={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
