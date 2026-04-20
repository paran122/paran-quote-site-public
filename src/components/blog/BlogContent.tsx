"use client";

import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import DOMPurify from "dompurify";
import { ChevronLeft, ChevronRight, X, ArrowLeft, ArrowRight } from "lucide-react";

interface Props {
  html: string;
  thumbnailUrl?: string | null;
  title?: string;
  afterHero?: React.ReactNode;
}

interface ImageItem {
  src: string;
  alt: string;
  noHero?: boolean;
}

/* HTML에서 blog-photo-grid 이미지를 분리 */
function extractPhotoGrid(html: string) {
  const gridRegex = /<h2>현장 사진<\/h2>\s*<div class="blog-photo-grid">([\s\S]*?)<\/div>/;
  const match = html.match(gridRegex);
  if (!match) return { cleanHtml: html, gridImages: [] as ImageItem[] };

  const imgRegex = /<img[^>]*src="([^"]+)"[^>]*alt="([^"]*)"[^>]*>/g;
  const gridImages: ImageItem[] = [];
  let imgMatch;
  while ((imgMatch = imgRegex.exec(match[1])) !== null) {
    const noHero = imgMatch[0].includes("data-no-hero");
    gridImages.push({ src: imgMatch[1], alt: imgMatch[2], noHero });
  }

  const cleanHtml = html.replace(gridRegex, "");
  return { cleanHtml, gridImages };
}

export default function BlogContent({ html, thumbnailUrl, title, afterHero }: Props) {
  const contentRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [heroIndex, setHeroIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const { cleanHtml: rawCleanHtml, gridImages } = extractPhotoGrid(html);
  const [cleanHtml, setCleanHtml] = useState(rawCleanHtml);

  useEffect(() => {
    setCleanHtml(DOMPurify.sanitize(rawCleanHtml));
  }, [rawCleanHtml]);

  useEffect(() => {
    if (!contentRef.current) return;
    const list: ImageItem[] = [];
    const seenSrcs = new Set<string>();

    if (thumbnailUrl) {
      list.push({ src: thumbnailUrl, alt: title || "" });
      seenSrcs.add(thumbnailUrl);
    }

    // 본문 내 이미지 — noHero가 아닌 것만 수집 (중복 src 제외)
    const imgs = contentRef.current.querySelectorAll("img");
    const cleanups: (() => void)[] = [];
    imgs.forEach((img) => {
      const noHero = img.hasAttribute("data-no-hero");
      if (!noHero && !seenSrcs.has(img.src)) {
        seenSrcs.add(img.src);
        list.push({ src: img.src, alt: img.alt });
      }
      // noHero가 아닌 이미지만 라이트박스 클릭 핸들러 추가
      if (!noHero) {
        const idx = list.findIndex((item) => item.src === img.src);
        if (idx >= 0) {
          img.classList.add("cursor-pointer");
          const handler = () => setLightboxIndex(idx);
          img.addEventListener("click", handler);
          cleanups.push(() => img.removeEventListener("click", handler));
        }
      }
    });

    // 그리드 이미지 추가 (noHero 제외, 중복 제외)
    gridImages.forEach((gi) => {
      if (!gi.noHero && !seenSrcs.has(gi.src)) {
        seenSrcs.add(gi.src);
        list.push({ src: gi.src, alt: gi.alt });
      }
    });

    setImages(list);
    return () => { cleanups.forEach((fn) => fn()); };
  }, [html, thumbnailUrl, title, gridImages.length]);

  /* 캐러셀 스크롤 */
  const checkScroll = useCallback(() => {
    if (!carouselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
  }, []);

  useEffect(() => {
    checkScroll();
  }, [gridImages.length, checkScroll]);

  const scrollCarousel = (dir: "left" | "right") => {
    if (!carouselRef.current) return;
    carouselRef.current.scrollBy({
      left: dir === "left" ? -260 : 260,
      behavior: "smooth",
    });
  };

  /* 히어로 (images에는 이미 noHero 제외된 것만 포함) */
  const heroPrev = useCallback(() => {
    setHeroIndex((i) => (i > 0 ? i - 1 : images.length - 1));
  }, [images.length]);

  const heroNext = useCallback(() => {
    setHeroIndex((i) => (i < images.length - 1 ? i + 1 : 0));
  }, [images.length]);

  /* 라이트박스 */
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const lightboxPrev = useCallback(
    () => setLightboxIndex((i) => (i !== null && i > 0 ? i - 1 : i)),
    [],
  );
  const lightboxNext = useCallback(
    () =>
      setLightboxIndex((i) =>
        i !== null && i < images.length - 1 ? i + 1 : i,
      ),
    [images.length],
  );

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") lightboxNext();
      if (e.key === "ArrowLeft") lightboxPrev();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handler);
    };
  }, [lightboxIndex, closeLightbox, lightboxNext, lightboxPrev]);

  const heroItem = images[heroIndex];

  return (
    <>
      {/* 히어로 캐러셀 */}
      {images.length > 0 && heroItem && (
        <div className="group relative mx-auto mb-12 max-w-[1100px]">
          <div
            className="relative aspect-[2.2/1] cursor-pointer overflow-hidden"
            onClick={() => setLightboxIndex(heroIndex)}
          >
            <Image
              key={heroItem.src}
              src={heroItem.src}
              alt={heroItem.alt}
              fill
              className="object-cover"
              sizes="960px"
              priority={heroIndex === 0}
            />
          </div>

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); heroPrev(); }}
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white/80 opacity-0 transition-opacity hover:bg-black/60 group-hover:opacity-100"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); heroNext(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white/80 opacity-0 transition-opacity hover:bg-black/60 group-hover:opacity-100"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <div className="absolute bottom-3 right-3 rounded-full bg-black/50 px-3 py-1 text-xs text-white/80">
                {heroIndex + 1} / {images.length}
              </div>
            </>
          )}
        </div>
      )}

      {/* 본문 (사진 그리드 제거된 HTML) */}
      <div className="relative mx-auto mt-14 max-w-[640px] px-5 sm:px-0">
        {afterHero}
        <div
          ref={contentRef}
          className="prose-blog"
          dangerouslySetInnerHTML={{ __html: cleanHtml }}
        />
      </div>

      {/* 현장 사진 가로 캐러셀 */}
      {gridImages.length > 0 && (
        <div className="mx-auto mt-10 max-w-[640px]">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-tight text-slate-900">
              현장 사진
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => scrollCarousel("left")}
                disabled={!canScrollLeft}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-white/90 transition-colors hover:bg-slate-700 disabled:opacity-30"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => scrollCarousel("right")}
                disabled={!canScrollRight}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-white/90 transition-colors hover:bg-slate-700 disabled:opacity-30"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div
            ref={carouselRef}
            onScroll={checkScroll}
            className="flex gap-3 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {gridImages.map((img, i) => {
              const lightboxIdx = img.noHero ? -1 : images.findIndex((item) => item.src === img.src);
              return (
              <motion.div
                key={img.src}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08, ease: "easeOut" }}
                whileHover={{ scale: 1.03, rotate: 1, transition: { duration: 0.25 } }}
                onClick={() => {
                  if (lightboxIdx >= 0) setLightboxIndex(lightboxIdx);
                }}
                className={`relative h-[140px] w-[200px] flex-shrink-0 overflow-hidden rounded-lg shadow-sm sm:h-[160px] sm:w-[230px] ${lightboxIdx >= 0 ? "cursor-pointer" : ""}`}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover"
                  sizes="230px"
                />
              </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* 라이트박스 */}
      {lightboxIndex !== null && images[lightboxIndex] && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>

          {lightboxIndex > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); lightboxPrev(); }}
              className="absolute left-4 rounded-full bg-white/10 p-3 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
          )}

          <img
            src={images[lightboxIndex].src}
            alt={images[lightboxIndex].alt}
            className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {lightboxIndex < images.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); lightboxNext(); }}
              className="absolute right-4 rounded-full bg-white/10 p-3 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
            >
              <ChevronRight className="h-8 w-8" />
            </button>
          )}

          <div className="absolute bottom-6 rounded-full bg-white/10 px-4 py-1.5 text-sm text-white/70">
            {lightboxIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
