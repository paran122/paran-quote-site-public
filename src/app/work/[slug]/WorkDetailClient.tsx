"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, MapPin, Home, Building2, Calendar, Tag, Users, FileText, Image as ImageIcon, Printer, BookOpen, Palette, Package, Pen, Monitor, Megaphone, Gift, Sticker, KeyRound, LayoutGrid } from "lucide-react";
import ContactModal from "@/components/ui/ContactModal";
import { GRADIENT_MAP } from "@/lib/portfolioData";
import type { Portfolio, PortfolioMedia } from "@/types";

/** 제작물 → 아이콘 매핑 */
const DELIVERABLE_ICON: Record<string, React.ElementType> = {
  포스터: ImageIcon,
  포토존: ImageIcon,
  리플렛: FileText,
  엑스배너: LayoutGrid,
  현수막: LayoutGrid,
  명찰: KeyRound,
  자료집: BookOpen,
  에세이집: BookOpen,
  카드뉴스: FileText,
  등신대: ImageIcon,
  전시부스: Package,
  전시패널: LayoutGrid,
  초대장: Pen,
  큐카드: FileText,
  인포그래픽: Palette,
  폼보드: LayoutGrid,
  일력: Calendar,
  키링: Gift,
  쇼핑백: Package,
  스티커: Sticker,
  배너: LayoutGrid,
  웹배너: Monitor,
  상세페이지: Monitor,
  인스타그램: Megaphone,
  "유튜브 썸네일": Monitor,
  "SNS 콘텐츠": Megaphone,
  "기념일 디자인": Palette,
  기념품: Gift,
  "대형등신대": ImageIcon,
  "테이블등신대": ImageIcon,
};

const categoryStyle: Record<string, string> = {
  포럼: "bg-purple-100 text-purple-700",
  세미나: "bg-emerald-100 text-emerald-700",
  행사운영: "bg-blue-100 text-blue-700",
  교육: "bg-amber-100 text-amber-700",
  콘텐츠: "bg-orange-100 text-orange-700",
};

function SafeImage({ src, alt, fill, sizes, className, priority, onLoad }: {
  src: string;
  alt: string;
  fill?: boolean;
  sizes?: string;
  className?: string;
  priority?: boolean;
  onLoad?: () => void;
}) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
        <span className="text-sm text-slate-400">이미지 로드 실패</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      sizes={sizes}
      className={className}
      priority={priority}
      onLoad={onLoad}
      onError={() => setHasError(true)}
    />
  );
}

interface RelatedEvent {
  id: string;
  title: string;
  slug?: string;
  tags: string[];
  client?: string;
  year: number;
  venue: string;
  thumbnailUrl: string;
}

interface WorkDetailClientProps {
  portfolio: Portfolio;
  media: PortfolioMedia[];
  relatedEvents?: RelatedEvent[];
  prevPortfolio?: { slug: string; title: string } | null;
  nextPortfolio?: { slug: string; title: string } | null;
}

export default function WorkDetailClient({ portfolio, media, relatedEvents = [], prevPortfolio, nextPortfolio }: WorkDetailClientProps) {
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [selectedSession, setSelectedSession] = useState<number | null>(null);
  const [photoExpanded, setPhotoExpanded] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  const category = portfolio.tags[0] ?? "";

  // 세션 목록
  const sessions = useMemo(() => {
    const sessionSet = new Set<number>();
    media
      .filter((m) => m.session != null)
      .forEach((m) => sessionSet.add(m.session as number));
    return Array.from(sessionSet).sort((a, b) => a - b);
  }, [media]);
  const hasSessions = sessions.length > 1;

  // 세션이 있으면 1회차 자동 선택
  useEffect(() => {
    if (hasSessions && selectedSession === null) {
      setSelectedSession(sessions[0]);
    }
  }, [hasSessions, sessions, selectedSession]);

  // 세션 변경 시 갤러리 리셋
  useEffect(() => {
    setGalleryIndex(0);
    setImageLoaded(false);
    setPhotoExpanded(false);
  }, [selectedSession]);

  // 갤러리 이미지
  const galleryImages = useMemo(() => {
    return media
      .filter((m) => {
        if (m.type !== "gallery") return false;
        if (hasSessions && selectedSession !== null) {
          return m.session === selectedSession || m.session == null;
        }
        return true;
      })
      .map((m) => m.url);
  }, [media, hasSessions, selectedSession]);
  const hasGallery = galleryImages.length > 0;

  // 현장사진
  const photoImages = useMemo(() => {
    return media
      .filter((m) => {
        if (m.type !== "photo") return false;
        if (hasSessions && selectedSession !== null) {
          return m.session === selectedSession || m.session == null;
        }
        return true;
      })
      .map((m) => ({ url: m.url, label: m.label }));
  }, [media, hasSessions, selectedSession]);
  const hasPhotos = photoImages.length > 0;
  const PHOTO_PREVIEW_COUNT = 8;

  // 현장영상
  const videoMedia = useMemo(() => {
    return media.filter((m) => {
      if (m.type !== "video") return false;
      if (hasSessions && selectedSession !== null) {
        return m.session === selectedSession || m.session == null;
      }
      return true;
    });
  }, [media, hasSessions, selectedSession]);
  const hasVideos = videoMedia.length > 0;

  const handleGalleryNav = useCallback((dir: "prev" | "next", total: number) => {
    setImageLoaded(false);
    setGalleryIndex((prev) =>
      dir === "prev"
        ? prev > 0 ? prev - 1 : total - 1
        : prev < total - 1 ? prev + 1 : 0
    );
  }, []);

  // 인접 이미지 프리로드
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
    <div className="pt-[56px] min-h-screen bg-slate-50">
      <div className="max-w-[960px] mx-auto px-6 py-8">
        {/* 브레드크럼 */}
        <nav className="flex items-center gap-1.5 text-[12px] text-slate-400 mb-6">
          <Link href="/" className="hover:text-slate-600 transition-colors">
            <Home size={13} />
          </Link>
          <span>/</span>
          <Link href="/work" className="hover:text-slate-600 transition-colors">
            포트폴리오
          </Link>
          <span>/</span>
          <span className="text-slate-600">{portfolio.title}</span>
        </nav>

        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            {category && (
              <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${categoryStyle[category] ?? "bg-slate-100 text-slate-600"}`}>
                {category}
              </span>
            )}
            <span className="text-[12px] text-slate-400 font-num">{portfolio.year}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {portfolio.title}
          </h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-[13px] text-slate-500">
            <span className="flex items-center gap-1">
              <MapPin size={14} />
              {portfolio.venue}
            </span>
            {portfolio.client && (
              <span>{portfolio.client}</span>
            )}
            {portfolio.eventDate && (
              <span className="font-num">
                {new Date(portfolio.eventDate).toLocaleDateString("ko-KR", { year: "numeric", month: "long" })}
              </span>
            )}
          </div>
        </div>

        {/* 회차 토글 */}
        {hasSessions && (
          <div className="flex gap-1.5 mb-6">
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

        {/* 시안물 캐러셀 */}
        <div className="relative aspect-[16/10] rounded-[10px] overflow-hidden bg-slate-100 mb-2">
          {hasGallery ? (
            <>
              {!imageLoaded && (
                <div className="absolute inset-0 bg-slate-200 animate-pulse" />
              )}
              <SafeImage
                key={galleryImages[galleryIndex]}
                src={galleryImages[galleryIndex]}
                alt={`${portfolio.title} - ${galleryIndex + 1}`}
                fill
                sizes="(max-width: 960px) 100vw, 960px"
                priority
                className={`object-contain transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
                onLoad={() => setImageLoaded(true)}
              />
              {galleryImages.length > 1 && (
                <>
                  <button
                    onClick={() => handleGalleryNav("prev", galleryImages.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 rounded-full flex items-center justify-center hover:bg-black/60 transition-colors"
                  >
                    <ChevronLeft size={20} className="text-white" />
                  </button>
                  <button
                    onClick={() => handleGalleryNav("next", galleryImages.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 rounded-full flex items-center justify-center hover:bg-black/60 transition-colors"
                  >
                    <ChevronRight size={20} className="text-white" />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white text-[12px] px-3 py-1 rounded-full font-num">
                    {galleryIndex + 1} / {galleryImages.length}
                  </div>
                </>
              )}
            </>
          ) : portfolio.imageUrl ? (
            <SafeImage
              src={portfolio.imageUrl}
              alt={portfolio.title}
              fill
              sizes="960px"
              className="object-contain"
              priority
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${GRADIENT_MAP[portfolio.gradientType] ?? "from-slate-100 to-slate-200"} flex items-center justify-center`}>
              <span className="text-5xl font-bold text-white/60">{portfolio.title.slice(0, 2)}</span>
            </div>
          )}
        </div>

        {/* 썸네일 스트립 */}
        {hasGallery && galleryImages.length > 1 && (
          <div className="flex gap-1.5 mb-8 overflow-x-auto scrollbar-hide pb-1">
            {galleryImages.map((url, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setImageLoaded(false);
                  setGalleryIndex(idx);
                }}
                className={`relative w-[64px] h-[48px] rounded-[6px] overflow-hidden shrink-0 border-2 transition-colors ${
                  idx === galleryIndex
                    ? "border-primary"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <SafeImage
                  src={url}
                  alt={`썸네일 ${idx + 1}`}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* 행사 개요 카드 */}
        <div className="bg-slate-50 rounded-[12px] p-5 sm:p-6 mb-8">
          <h2 className="text-[14px] font-semibold text-slate-800 mb-4">행사 개요</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {portfolio.client && (
              <div className="flex items-start gap-2.5">
                <Building2 size={15} className="text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[11px] text-slate-400 font-medium">고객사</p>
                  <p className="text-[13px] text-slate-700">{portfolio.client}</p>
                </div>
              </div>
            )}
            <div className="flex items-start gap-2.5">
              <MapPin size={15} className="text-slate-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-[11px] text-slate-400 font-medium">장소</p>
                <p className="text-[13px] text-slate-700">{portfolio.venue}</p>
              </div>
            </div>
            {portfolio.eventDate && (
              <div className="flex items-start gap-2.5">
                <Calendar size={15} className="text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[11px] text-slate-400 font-medium">일시</p>
                  <p className="text-[13px] text-slate-700 font-num">
                    {new Date(portfolio.eventDate).toLocaleDateString("ko-KR", { year: "numeric", month: "long" })}
                  </p>
                </div>
              </div>
            )}
            {category && (
              <div className="flex items-start gap-2.5">
                <Tag size={15} className="text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[11px] text-slate-400 font-medium">유형</p>
                  <p className="text-[13px] text-slate-700">{category}</p>
                </div>
              </div>
            )}
            {portfolio.attendees && (
              <div className="flex items-start gap-2.5">
                <Users size={15} className="text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[11px] text-slate-400 font-medium">참여 인원</p>
                  <p className="text-[13px] text-slate-700">{portfolio.attendees}</p>
                </div>
              </div>
            )}
          </div>

          {/* 제작물 목록 */}
          {portfolio.deliverables && portfolio.deliverables.length > 0 && (
            <div className="mt-5 pt-4 border-t border-slate-200">
              <div className="flex items-center gap-1.5 mb-3">
                <Printer size={14} className="text-slate-400" />
                <p className="text-[11px] text-slate-400 font-medium">제작물</p>
                <span className="text-[11px] text-slate-300 font-num">{portfolio.deliverables.length}종</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {portfolio.deliverables.map((item) => {
                  const Icon = DELIVERABLE_ICON[item] ?? FileText;
                  return (
                    <span
                      key={item}
                      className="inline-flex items-center gap-1.5 text-[12px] bg-white text-slate-600 px-2.5 py-1.5 rounded-lg border border-slate-200"
                    >
                      <Icon size={13} className="text-slate-400 shrink-0" />
                      {item}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* 시안물 태그 (deliverables가 없을 때 tags로 폴백) */}
          {(!portfolio.deliverables || portfolio.deliverables.length === 0) && portfolio.tags.length > 1 && (
            <div className="mt-5 pt-4 border-t border-slate-200">
              <div className="flex items-center gap-1.5 mb-3">
                <Printer size={14} className="text-slate-400" />
                <p className="text-[11px] text-slate-400 font-medium">제작물</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {portfolio.tags.slice(1).map((tag) => {
                  const Icon = DELIVERABLE_ICON[tag] ?? FileText;
                  return (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 text-[12px] bg-white text-slate-600 px-2.5 py-1.5 rounded-lg border border-slate-200"
                    >
                      <Icon size={13} className="text-slate-400 shrink-0" />
                      {tag}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 행사 설명 */}
        {portfolio.description && (
          <div className="mb-8">
            <h2 className="text-[14px] font-semibold text-slate-800 mb-3">행사 소개</h2>
            <p className="max-w-[640px] text-[14px] leading-[1.8] text-slate-600">
              {portfolio.description}
            </p>
          </div>
        )}

        {/* 현장사진 그리드 */}
        {hasPhotos && (
          <section className="mb-8">
            <h2 className="text-[15px] font-semibold text-slate-800 mb-4">
              현장사진
              <span className="text-slate-400 font-normal ml-1.5 text-[13px]">
                ({photoImages.length}장)
              </span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {(photoExpanded ? photoImages : photoImages.slice(0, PHOTO_PREVIEW_COUNT)).map((photo, idx) => (
                <div
                  key={idx}
                  className="relative aspect-square rounded-[8px] overflow-hidden bg-slate-100"
                >
                  <SafeImage
                    src={photo.url}
                    alt={photo.label}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
            {photoImages.length > PHOTO_PREVIEW_COUNT && (
              <button
                onClick={() => setPhotoExpanded(!photoExpanded)}
                className="w-full mt-3 py-2.5 text-[13px] text-slate-500 hover:text-slate-700 bg-slate-50 rounded-lg transition-colors"
              >
                {photoExpanded
                  ? "접기"
                  : `+${photoImages.length - PHOTO_PREVIEW_COUNT}장 더보기`}
              </button>
            )}
          </section>
        )}

        {/* 현장영상 */}
        {hasVideos && (
          <section className="mb-8">
            <h2 className="text-[15px] font-semibold text-slate-800 mb-4">
              현장영상
              <span className="text-slate-400 font-normal ml-1.5 text-[13px]">
                ({videoMedia.length}개)
              </span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {videoMedia.map((v) => (
                <div key={v.id} className="rounded-[8px] overflow-hidden bg-black">
                  <video
                    src={v.url}
                    controls
                    preload="metadata"
                    className="w-full aspect-video"
                    playsInline
                  >
                    <track kind="captions" />
                  </video>
                  {v.label && (
                    <p className="text-[12px] text-slate-400 px-3 py-2 bg-slate-900">
                      {v.label}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

      </div>

      {/* 관련 행사 */}
      {relatedEvents.length > 0 && (
        <section className="max-w-[960px] mx-auto px-6 mt-12">
          <h2 className="text-[17px] font-bold text-slate-800 mb-4">관련 행사</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {relatedEvents.map((evt) => (
              <Link
                key={evt.id}
                href={`/work/${evt.slug || evt.id}`}
                className="group block overflow-hidden rounded-xl border border-slate-100 bg-white transition-shadow hover:shadow-md"
              >
                <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                  {evt.thumbnailUrl ? (
                    <SafeImage
                      src={evt.thumbnailUrl}
                      alt={evt.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <ImageIcon className="h-6 w-6 text-slate-300" />
                    </div>
                  )}
                </div>
                <div className="p-3">
                  {evt.tags?.[0] && (
                    <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${categoryStyle[evt.tags[0]] || "bg-slate-100 text-slate-600"}`}>
                      {evt.tags[0]}
                    </span>
                  )}
                  <p className="mt-1.5 text-[14px] font-semibold text-slate-800 leading-snug line-clamp-1">{evt.title}</p>
                  <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-400">
                    <MapPin className="h-3 w-3" />
                    <span>{evt.venue}</span>
                    <span className="mx-0.5">·</span>
                    <span>{evt.year}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 이전/다음 내비게이션 */}
      {(prevPortfolio || nextPortfolio) && (
        <nav className="max-w-[960px] mx-auto px-6 mt-10">
          <div className="flex items-stretch gap-3 border-t border-slate-200 pt-6">
            {prevPortfolio ? (
              <Link
                href={`/work/${prevPortfolio.slug}`}
                className="flex-1 group flex items-center gap-2 rounded-lg border border-slate-100 px-4 py-3 transition-colors hover:bg-slate-50"
              >
                <ChevronLeft className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:-translate-x-0.5" />
                <div className="min-w-0">
                  <p className="text-[11px] text-slate-400">이전 행사</p>
                  <p className="text-[13px] font-medium text-slate-700 truncate">{prevPortfolio.title}</p>
                </div>
              </Link>
            ) : <div className="flex-1" />}
            {nextPortfolio ? (
              <Link
                href={`/work/${nextPortfolio.slug}`}
                className="flex-1 group flex items-center justify-end gap-2 rounded-lg border border-slate-100 px-4 py-3 text-right transition-colors hover:bg-slate-50"
              >
                <div className="min-w-0">
                  <p className="text-[11px] text-slate-400">다음 행사</p>
                  <p className="text-[13px] font-medium text-slate-700 truncate">{nextPortfolio.title}</p>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5" />
              </Link>
            ) : <div className="flex-1" />}
          </div>
        </nav>
      )}

      {/* 하단 CTA */}
      <div className="max-w-[960px] mx-auto px-6">
        <div className="flex items-center justify-between border-t border-slate-200 py-8 mt-6">
          <div>
            <p className="text-[15px] font-semibold text-slate-800">이 행사가 마음에 드셨나요?</p>
            <p className="text-[13px] text-slate-400 mt-0.5">비슷한 행사를 기획해 드립니다</p>
          </div>
          <div className="flex items-center gap-2.5">
            <Link
              href="/work"
              className="btn-ghost btn-md"
            >
              목록으로
            </Link>
            <button
              onClick={() => setContactOpen(true)}
              className="btn-primary btn-md"
            >
              상담받기
            </button>
          </div>
        </div>
      </div>

      <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} />
    </div>
  );
}
