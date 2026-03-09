"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import type { BlogPost } from "@/types";

/* ── Framer-style staggered fade-in from left ── */
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.25 } },
};
const fadeIn = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] as const } },
};
const itemFadeIn = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
};

const DEFAULT_CATEGORIES = [
  "행사 기획",
  "행사 후기",
  "트렌드",
  "체크리스트",
  "장비/기술",
];

/* ── 카테고리 색상 (Pitch 스타일: 약간 두껍게) ── */
const CATEGORY_COLOR = "font-medium text-[#586EE0]";

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
  currentCategory: string;
  categories: string[];
}

export default function BlogArchiveClient({
  posts: initialPosts,
  totalCount,
  currentCategory,
  categories,
}: Props) {
  const [posts, setPosts] = useState(initialPosts);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const hasMore = posts.length < totalCount;

  const mergedCategories = Array.from(
    new Set([...DEFAULT_CATEGORIES, ...categories]),
  );
  const allCategories = ["전체", ...mergedCategories];

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const nextPage = page + 1;
      const params = new URLSearchParams();
      params.set("page", String(nextPage));
      if (currentCategory !== "전체") params.set("category", currentCategory);

      const res = await fetch(`/api/blog?${params.toString()}`);
      const data = await res.json() as { posts: BlogPost[] };

      setPosts((prev) => [...prev, ...data.posts]);
      setPage(nextPage);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, currentCategory]);

  function buildCategoryHref(category: string) {
    if (category === "전체") return "/blog/all";
    return `/blog/all?category=${encodeURIComponent(category)}`;
  }

  return (
    <motion.div
      className="min-h-screen bg-slate-50 pt-14"
      initial="hidden"
      animate="show"
      variants={stagger}
    >
      {/* Header */}
      <motion.div variants={fadeIn} className="bg-white pb-10 pt-16 sm:pb-14">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="flex items-center gap-3">
            <Link
              href="/blog"
              className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            >
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-[14px] font-semibold tracking-[0.12em] text-slate-900">
                ALL ARTICLES
              </h1>
              <p className="mt-1.5 text-[13px] text-slate-400">
                총 {totalCount}개의 글
              </p>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="mt-7 flex gap-1 overflow-x-auto scrollbar-hide">
            {allCategories.map((cat) => (
              <Link
                key={cat}
                href={buildCategoryHref(cat)}
                className={`whitespace-nowrap rounded-md px-2.5 py-1 text-[15px] transition-colors ${
                  currentCategory === cat
                    ? "bg-indigo-50 font-medium text-indigo-600"
                    : "text-slate-800 hover:bg-slate-50"
                }`}
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="mx-auto max-w-[1200px] px-6 pb-20 pt-10">
        {posts.length > 0 ? (
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
          >
            {posts.map((post, i) => (
              <motion.div key={post.id} variants={itemFadeIn}>
                {/* 매 5번째(0-indexed: 4, 9, 14...)에 이미지 카드 */}
                {i > 0 && i % 5 === 4 ? (
                  <BentoImageRow post={post} />
                ) : (
                  <TextRow post={post} />
                )}
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="py-20 text-center text-slate-400">
            {currentCategory !== "전체"
              ? `"${currentCategory}" 카테고리에 글이 없습니다.`
              : "아직 발행된 글이 없습니다."}
          </div>
        )}

        {/* 더 보기 버튼 */}
        {hasMore && (
          <motion.div variants={fadeIn} className="mt-10 text-center">
            <button
              onClick={loadMore}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-8 py-3 text-[14px] font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
                  로딩 중...
                </>
              ) : (
                "더 보기"
              )}
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

/* ── Text Row — 텍스트 리스트 행 (Pitch 스타일) ── */
function TextRow({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <div className="group flex items-center justify-between gap-4 border-b border-slate-100 py-5 sm:py-6">
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-1 text-[16px] font-semibold leading-snug tracking-[-0.02em] text-slate-900 sm:text-[18px]">
            <span className="underline decoration-slate-900/20 underline-offset-2 transition-colors group-hover:text-primary group-hover:decoration-primary/40">
              {post.title}
            </span>
          </h3>
        </div>
        <div className="flex flex-shrink-0 items-center gap-3">
          {post.category && (
            <span className={`text-[12px] font-normal ${CATEGORY_COLOR}`}>
              {post.category}
            </span>
          )}
          <span className="whitespace-nowrap text-[12px] text-slate-400">
            {formatDate(post.publishedAt || post.createdAt)}
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ── Bento Image Row — 이미지 카드 (매 5번째 항목, Pitch 스타일) ── */
function BentoImageRow({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <div className="group my-6 overflow-hidden sm:my-8">
        <div className="grid items-center sm:grid-cols-2">
          {/* 이미지 */}
          <div className="relative aspect-[16/9] overflow-hidden rounded-md">
            <Image
              src={post.thumbnailUrl || "/blog-default-thumbnail.png"}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, 600px"
            />
          </div>
          {/* 텍스트 */}
          <div className="px-0 py-4 sm:px-10 sm:py-6">
            <h3 className="line-clamp-2 text-[20px] font-semibold leading-snug tracking-[-0.02em] text-slate-900 sm:text-[24px]">
              <span className="underline decoration-slate-900/20 underline-offset-2 transition-colors group-hover:text-primary group-hover:decoration-primary/40">
                {post.title}
              </span>
            </h3>
            {post.excerpt && (
              <p className="mt-3 line-clamp-2 text-[15px] leading-relaxed text-slate-600">
                {post.excerpt}
              </p>
            )}
            <div className="mt-4 flex items-center gap-3">
              {post.category && (
                <span className={`text-[12px] font-normal ${CATEGORY_COLOR}`}>
                  {post.category}
                </span>
              )}
              <span className="text-[12px] text-slate-400">
                {formatDate(post.publishedAt || post.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
