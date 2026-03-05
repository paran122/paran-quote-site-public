"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import type { BlogPost } from "@/types";

const PER_PAGE = 9;

const DEFAULT_CATEGORIES = [
  "행사 기획",
  "행사 후기",
  "트렌드",
  "체크리스트",
  "장비/기술",
];

const BADGE_COLORS: Record<string, string> = {
  "체크리스트": "bg-blue-50 text-blue-600",
  "행사 후기": "bg-emerald-50 text-emerald-600",
  "장비/기술": "bg-violet-50 text-violet-600",
  "트렌드": "bg-rose-50 text-rose-600",
  "행사 기획": "bg-amber-50 text-amber-600",
};

function getBadgeColor(category?: string) {
  if (!category) return "bg-slate-100 text-slate-500";
  return BADGE_COLORS[category] ?? "bg-slate-100 text-slate-500";
}


function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}

interface Props {
  posts: BlogPost[];
  totalCount: number;
  currentPage: number;
  currentCategory: string;
  categories: string[];
}

function buildHref(category: string, page: number) {
  const params = new URLSearchParams();
  if (category !== "전체") params.set("category", category);
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return `/blog/all${qs ? `?${qs}` : ""}`;
}

export default function BlogArchiveClient({
  posts,
  totalCount,
  currentPage,
  currentCategory,
  categories,
}: Props) {
  const mergedCategories = Array.from(
    new Set([...DEFAULT_CATEGORIES, ...categories]),
  );
  const allCategories = ["전체", ...mergedCategories];
  const totalPages = Math.max(1, Math.ceil(totalCount / PER_PAGE));

  return (
    <div className="min-h-screen bg-slate-50 pt-14">
      {/* Header */}
      <div className="bg-white pb-10 pt-16 sm:pb-14">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="flex items-center gap-3">
            <Link
              href="/blog"
              className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            >
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-[24px] font-black leading-[1.1] tracking-[-0.025em] text-slate-900 sm:text-[30px]">
                All Articles
              </h1>
              <p className="mt-1 text-[13px] text-slate-400">
                총 {totalCount}개의 글
              </p>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="mt-7 flex gap-1.5 overflow-x-auto scrollbar-hide">
            {allCategories.map((cat) => (
              <Link
                key={cat}
                href={buildHref(cat, 1)}
                className={`whitespace-nowrap rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${
                  currentCategory === cat
                    ? "bg-slate-800 text-white"
                    : "bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                }`}
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] px-6 pb-16 pt-6">
        {/* Grid */}
        {posts.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {posts.map((post, i) => (
              <ArchiveCard key={post.id} post={post} index={i} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-slate-400">
            {currentCategory !== "전체"
              ? `"${currentCategory}" 카테고리에 글이 없습니다.`
              : "아직 발행된 글이 없습니다."}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            category={currentCategory}
          />
        )}
      </div>
    </div>
  );
}

/* ── Archive Card ── */
function ArchiveCard({ post }: { post: BlogPost; index?: number }) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <div className="group grid h-full grid-rows-[auto_1fr_auto] overflow-hidden rounded-lg border border-slate-100 bg-white transition-all hover:-translate-y-0.5 hover:border-transparent hover:shadow-lg">
        {/* 이미지 */}
        <div className="relative aspect-[16/9] overflow-hidden">
          <Image
            src={post.thumbnailUrl || "/blog-default-thumbnail.png"}
            alt={post.title}
            fill
            className="object-cover transition-opacity duration-200 group-hover:opacity-80"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>

        {/* 본문 */}
        <div className="px-4 pb-1 pt-3.5 sm:px-5 sm:pt-4">
          <div className="mb-2 flex items-center gap-2">
            {post.category && (
              <span
                className={`inline-block rounded px-2 py-0.5 text-[11px] font-semibold ${getBadgeColor(post.category)}`}
              >
                {post.category}
              </span>
            )}
            <span className="text-[11px] text-slate-400">
              {formatDate(post.publishedAt || post.createdAt)}
            </span>
          </div>
          <h3 className="line-clamp-2 min-h-[calc(2*15px*1.4)] text-[15px] font-bold leading-[1.4] tracking-[-0.01em] text-slate-900">
            {post.title}
          </h3>
        </div>

        {/* 푸터 */}
        <div className="flex items-center px-4 pb-4 pt-2 sm:px-5">
          <span className="flex items-center gap-1 text-[12px] font-medium text-slate-400 transition-colors group-hover:text-primary">
            자세히 보기
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ── Pagination ── */
function Pagination({
  currentPage,
  totalPages,
  category,
}: {
  currentPage: number;
  totalPages: number;
  category: string;
}) {
  const pages = buildPageNumbers(currentPage, totalPages);

  return (
    <nav className="mt-10 flex items-center justify-center gap-1">
      {/* Prev */}
      {currentPage > 1 ? (
        <Link
          href={buildHref(category, currentPage - 1)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
      ) : (
        <span className="flex h-9 w-9 items-center justify-center text-slate-200">
          <ChevronLeft className="h-4 w-4" />
        </span>
      )}

      {/* Page numbers */}
      {pages.map((p, i) =>
        p === "..." ? (
          <span
            key={`ellipsis-${i}`}
            className="flex h-9 w-9 items-center justify-center text-[13px] text-slate-300"
          >
            ...
          </span>
        ) : (
          <Link
            key={p}
            href={buildHref(category, p as number)}
            className={`flex h-9 w-9 items-center justify-center rounded-lg text-[13px] font-medium transition-colors ${
              p === currentPage
                ? "bg-slate-800 text-white"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            }`}
          >
            {p}
          </Link>
        ),
      )}

      {/* Next */}
      {currentPage < totalPages ? (
        <Link
          href={buildHref(category, currentPage + 1)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
        >
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <span className="flex h-9 w-9 items-center justify-center text-slate-200">
          <ChevronRight className="h-4 w-4" />
        </span>
      )}
    </nav>
  );
}

/** Build page number array: 1 2 3 ... 8 형태 */
function buildPageNumbers(
  current: number,
  total: number,
): (number | "...")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "...")[] = [];

  if (current <= 4) {
    for (let i = 1; i <= 5; i++) pages.push(i);
    pages.push("...", total);
  } else if (current >= total - 3) {
    pages.push(1, "...");
    for (let i = total - 4; i <= total; i++) pages.push(i);
  } else {
    pages.push(1, "...");
    for (let i = current - 1; i <= current + 1; i++) pages.push(i);
    pages.push("...", total);
  }

  return pages;
}
