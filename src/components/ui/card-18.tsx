"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

/* ── 카테고리 색상 (Pitch 스타일: 눈에 띄게) ── */
const CATEGORY_COLOR = "text-[13px] font-semibold text-[#4B5EDB]";

export interface BlogPostCardProps {
  className?: string;
  variant?: "default" | "featured";
  tag: string;
  date: string;
  title: string;
  description: string;
  imageUrl?: string;
  href: string;
  readMoreText?: string;
  readTime?: number;
}

const BlogPostCard = React.forwardRef<HTMLDivElement, BlogPostCardProps>(
  (
    {
      className,
      variant = "default",
      tag,
      date,
      title,
      description,
      imageUrl,
      href,
      readMoreText = "자세히 보기",
      readTime,
    },
    ref
  ) => {
    const isPlaceholder = !href;

    if (variant === "featured") {
      /* ═══ Pitch Hero 스타일: 왼쪽 텍스트 + 오른쪽 이미지 ═══ */
      const content = (
        <div className={`group relative overflow-hidden rounded-lg ${className || ""}`}>
          <div className="grid items-stretch md:grid-cols-2">
            {/* 텍스트 영역 */}
            <div className="flex flex-col justify-center px-6 py-8 sm:px-10 sm:py-12 md:py-16">
              {/* 카테고리 + 날짜 */}
              <div className="mb-5 flex items-center gap-1.5 text-[12px]">
                <span className={`${CATEGORY_COLOR}`}>{tag}</span>
                <span className="text-slate-300">·</span>
                <span className="text-slate-400">{date}</span>
                {readTime && (
                  <>
                    <span className="text-slate-300">·</span>
                    <span className="text-slate-400">{readTime}분 읽기</span>
                  </>
                )}
              </div>

              {/* 제목 (기본: 밑줄 없음 → hover: 밑줄 애니메이션 + primary 색) */}
              <h2 className="text-[26px] font-extrabold leading-[1.15] tracking-[-0.02em] text-slate-900 transition-colors duration-300 group-hover:text-primary sm:text-[30px] lg:text-[32px]">
                <span className="bg-gradient-to-r from-primary to-primary bg-[length:0%_2px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 group-hover:bg-[length:100%_2px]">
                  {title}
                </span>
              </h2>

              {/* 설명 */}
              {description && (
                <p className="mt-4 line-clamp-2 text-[15px] leading-[1.7] text-slate-500">
                  {description}
                </p>
              )}

              {/* CTA 버튼 */}
              <div className="mt-8">
                <span className="inline-flex items-center gap-2 text-[14px] font-semibold text-slate-800 transition-colors group-hover:text-primary">
                  {readMoreText}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </div>

            {/* 이미지 영역 */}
            <div className="relative aspect-[4/3] overflow-hidden md:aspect-auto md:min-h-[360px]">
              <Image
                src={imageUrl || "/blog-default-thumbnail.png"}
                alt={title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
            </div>
          </div>

          {/* 링크 오버레이 */}
          {!isPlaceholder && (
            <Link href={href} className="absolute inset-0 z-10" aria-label={title}>
              <span className="sr-only">{title}</span>
            </Link>
          )}
        </div>
      );

      return (
        <div ref={ref}>
          {content}
        </div>
      );
    }

    /* ═══ Default variant (카드) ═══ */
    return (
      <motion.div
        ref={ref}
        className={`group relative overflow-hidden rounded-md border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:shadow-md ${className || ""}`}
        variants={{ hover: { y: -4, transition: { duration: 0.2, ease: "easeInOut" as const } } }}
        whileHover="hover"
      >
        {!isPlaceholder && (
          <Link href={href} className="absolute inset-0 z-10" aria-label={title}>
            <span className="sr-only">{title}</span>
          </Link>
        )}
        <div className="p-6">
          <div className="mb-4 flex items-center gap-3 text-[12px]">
            <span className={`font-normal ${CATEGORY_COLOR}`}>{tag}</span>
            <span className="text-slate-400">{date}</span>
          </div>
          <h3 className="mb-3 text-xl font-bold leading-tight text-slate-900">
            <span className="underline decoration-slate-900/20 underline-offset-2 transition-all duration-300 group-hover:text-primary group-hover:decoration-transparent">
              {title}
            </span>
          </h3>
          <p className="text-[14px] leading-[1.7] text-slate-500">{description}</p>
        </div>
      </motion.div>
    );
  }
);

BlogPostCard.displayName = "BlogPostCard";
export { BlogPostCard };
