"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { BlogPostCard } from "@/components/ui/card-18";
import ContactModal from "@/components/ui/ContactModal";
import type { BlogPost } from "@/types";

/* ── Framer-style staggered fade-in from left ── */
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.3 } },
};
const fadeIn = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] as const } },
};
const itemFadeIn = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
};

interface Props {
  posts: BlogPost[];
  featuredPosts?: BlogPost[];
  categories: string[];
  totalCount: number;
}

/* ── 기본 카테고리 (글이 있는 것만 표시하기 위해 순서 정의용) ── */
const CATEGORY_ORDER = [
  "행사 기획",
  "행사 후기",
  "기획 가이드",
  "현장 노하우",
  "행사 정보",
];

/* ── SEO 가이드 카테고리 (히어로 제외 대상) ── */
const GUIDE_CATEGORIES = new Set(["기획 가이드", "현장 노하우", "행사 정보"]);

/* ── 카테고리 색상 (Pitch 스타일: 눈에 띄게) ── */
const CATEGORY_COLOR = "text-[13px] font-semibold text-[#4B5EDB]";


/* ── 유틸 ── */
function formatDate(dateStr?: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}

/** HTML 태그 제거 후 한글 기준 읽기 시간 계산 (분당 500자) */
function estimateReadTime(content?: string): number {
  if (!content) return 1;
  const text = content.replace(/<[^>]*>/g, "").trim();
  return Math.max(1, Math.round(text.length / 500));
}


/* ════════════════════════════════════════════════════════
   메인 컴포넌트
   ════════════════════════════════════════════════════════ */
export default function BlogListClient({ posts: initialPosts, featuredPosts = [], categories, totalCount }: Props) {
  const [activeCategory, setActiveCategory] = useState("전체");
  const [contactOpen, setContactOpen] = useState(false);
  const [morePosts, setMorePosts] = useState<BlogPost[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [morePage, setMorePage] = useState(1);

  const mergedCategories = Array.from(
    new Set([...CATEGORY_ORDER, ...categories]),
  );
  const allCategories = ["전체", ...mergedCategories];

  const filtered = initialPosts.filter(
    (post) => activeCategory === "전체" || post.category === activeCategory,
  );

  // 에디터 추천: DB에서 is_featured=true인 글 (sort_order 정렬)
  const featuredIds = new Set(featuredPosts.map((p) => p.id));

  // 전체 탭일 때 히어로는 행사 기획/후기만, 가이드 카테고리는 별도 섹션
  const isGuideCategory = (cat?: string) => GUIDE_CATEGORIES.has(cat ?? "");
  const heroCandidates = activeCategory === "전체"
    ? filtered.filter((p) => !isGuideCategory(p.category) && !featuredIds.has(p.id))
    : filtered.filter((p) => !featuredIds.has(p.id));

  // 데이터 분배: 메가(1) + 서브(3) + 에디터(1) + 나머지
  const featured = heroCandidates[0] ?? null;
  const subCards = heroCandidates.slice(1, 4);

  // 가이드 섹션 (전체 탭에서만 표시, 3개 가이드 카테고리 통합)
  const guideSectionPosts = activeCategory === "전체"
    ? filtered.filter((p) => isGuideCategory(p.category))
    : [];

  // 에디터 추천: featuredPosts 중 첫 번째 1개
  const filteredFeatured = featuredPosts.filter(
    (p) => activeCategory === "전체" || p.category === activeCategory,
  );
  const editorPick: BlogPost | null = filteredFeatured.length > 0
    ? filteredFeatured[0]
    : (heroCandidates[4] ?? null);

  // More articles: 메가+서브+가이드 섹션에 사용된 글 제외
  const usedIds = new Set([
    featured?.id,
    ...subCards.map((p) => p.id),
    ...guideSectionPosts.map((p) => p.id),
  ].filter(Boolean));
  const remaining = filtered.filter((p) => !featuredIds.has(p.id) && !usedIds.has(p.id));
  const moreArticles = [...remaining, ...morePosts];

  // 이미 표시된 총 갯수로 "더 보기" 가능 여부 계산
  const displayedCount = usedIds.size + moreArticles.length + (editorPick ? 1 : 0);
  const hasMoreToLoad = activeCategory === "전체" && displayedCount < totalCount;

  const loadMore = useCallback(async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    try {
      const nextPage = morePage + 1;
      const params = new URLSearchParams();
      params.set("page", String(nextPage));
      if (activeCategory !== "전체") params.set("category", activeCategory);

      const res = await fetch(`/api/blog?${params.toString()}`);
      const data = await res.json() as { posts: BlogPost[] };

      setMorePosts((prev) => [...prev, ...data.posts]);
      setMorePage(nextPage);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, morePage, activeCategory]);

  return (
    <motion.div
      className="min-h-screen bg-slate-50 pb-20 pt-14 sm:pb-28"
      initial="hidden"
      animate="show"
      variants={stagger}
    >
      {/* ═══ Hero ═══ */}
      <motion.div
        className="pb-10 pt-16 sm:pb-14"
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.2 } } }}
      >
        <div className="mx-auto max-w-[1200px] px-6">
          <motion.h1
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
            className="text-[28px] font-black leading-[1.1] tracking-[-0.025em] text-slate-900 sm:text-[36px]"
          >
            {"PARAN Blog".split("").map((ch, i) => (
              <motion.span
                key={i}
                variants={{ hidden: { opacity: 0, x: -8 }, show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } } }}
                className="inline-block"
                style={ch === " " ? { width: "0.25em" } : undefined}
              >
                {ch === " " ? "\u00A0" : ch}
              </motion.span>
            ))}
          </motion.h1>
          <motion.p
            variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as const } } }}
            className="mt-2 text-[14px] leading-relaxed text-slate-400"
          >
            Insights for Successful Event Planning
          </motion.p>

          {/* Category Tabs */}
          <motion.div
            variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const } } }}
            className="mt-7 flex gap-1.5 overflow-x-auto scrollbar-hide"
          >
            {allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap rounded-md px-2.5 py-1 text-[15px] transition-colors ${
                  activeCategory === cat
                    ? "bg-indigo-50 font-medium text-indigo-600"
                    : "text-slate-800 hover:bg-slate-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>
        </div>
      </motion.div>

      <div className="mx-auto max-w-[1200px] px-6">
        {/* ═══ 빈 카테고리: Coming Soon ═══ */}
        {filtered.length === 0 && (
          <EmptyCategory
            category={activeCategory}
            onBack={() => setActiveCategory("전체")}
          />
        )}

        {/* ═══ Mega Featured (Pitch Hero 스타일) ═══ */}
        {featured && (
          <motion.div variants={fadeIn} className="mt-2">
            <BlogPostCard
              variant="featured"
              tag={featured.category || "트렌드"}
              date={formatDate(featured.publishedAt || featured.createdAt)}
              title={featured.title}
              description={featured.excerpt || ""}
              imageUrl={featured.thumbnailUrl}
              href={`/blog/${featured.slug}`}
              readTime={estimateReadTime(featured.content)}
            />
          </motion.div>
        )}

        {/* ═══ Sub-Featured (3열 이미지 카드) ═══ */}
        {subCards.length > 0 && (
          <motion.div variants={fadeIn} className="-mr-6 mt-12 flex snap-x sm:mt-24 snap-mandatory gap-5 overflow-x-auto pr-6 pb-2 scrollbar-hide sm:mr-0 sm:grid sm:snap-none sm:grid-cols-2 sm:gap-10 sm:overflow-visible sm:pr-0 sm:pb-0 lg:grid-cols-3">
            {subCards.map((post, i) => (
              <div key={post.id} className="w-[80%] flex-shrink-0 snap-start sm:w-auto">
                <ArticleCard post={post} index={i + 1} />
              </div>
            ))}
          </motion.div>
        )}

        {/* ═══ 에디터 추천 ═══ */}
        {editorPick && (
          <motion.div variants={fadeIn} className="mt-10 pt-6 sm:mt-24 sm:pt-16">
            <div className="mb-10">
              <h2 className="text-[14px] font-semibold tracking-[0.12em] text-slate-900">
                EDITOR&apos;S PICK
              </h2>
            </div>
            <EditorPickHero post={editorPick} />
          </motion.div>
        )}

        {/* ═══ More Articles (Pitch 스타일 3열 이미지 카드 그리드) ═══ */}
        {(moreArticles.length > 0 || hasMoreToLoad) && (
          <motion.div variants={fadeIn} className="mt-10 pt-6 sm:mt-24 sm:pt-16">
            <div className="mb-10">
              <h2 className="text-[14px] font-semibold tracking-[0.12em] text-slate-900">
                MORE ARTICLES
              </h2>
            </div>

            <motion.div
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
              className="grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-10 lg:grid-cols-3"
            >
              {moreArticles.map((post, i) => (
                <MoreArticleItem
                  key={post.id}
                  post={post}
                  index={i}
                  onContactOpen={() => setContactOpen(true)}
                />
              ))}
            </motion.div>

            {/* 더 보기 버튼 */}
            {hasMoreToLoad && (
              <div className="mt-12 text-center">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-8 py-3 text-[14px] font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50 disabled:opacity-50"
                >
                  {loadingMore ? (
                    <>
                      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
                      로딩 중...
                    </>
                  ) : (
                    "더 보기"
                  )}
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* ═══ 행사 가이드 섹션 (신문 기사 스타일) ═══ */}
        {guideSectionPosts.length > 0 && (
          <motion.div variants={fadeIn} className="mt-10 pt-6 sm:mt-24 sm:pt-16">
            <div className="mb-6 flex items-end justify-between sm:mb-8">
              <div>
                <h2 className="text-[14px] font-semibold tracking-[0.12em] text-slate-900">
                  EVENT GUIDE
                </h2>
                <p className="mt-1 text-[13px] text-slate-400">
                  행사 기획에 필요한 실무 가이드
                </p>
              </div>
              <button
                onClick={() => setActiveCategory("기획 가이드")}
                className="text-[13px] font-medium text-slate-500 hover:text-primary transition-colors"
              >
                전체 보기 →
              </button>
            </div>
            <div className="divide-y divide-slate-200 border-t border-slate-200">
              {guideSectionPosts.slice(0, 6).map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group block py-4 sm:py-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 text-[12px] sm:text-[13px]">
                        {post.category && (
                          <span className="font-semibold text-[#4B5EDB]">{post.category}</span>
                        )}
                        <span className="text-slate-300">·</span>
                        <span className="text-slate-400">{formatDate(post.publishedAt || post.createdAt)}</span>
                      </div>
                      <h3 className="mt-1 text-[15px] font-semibold leading-snug text-slate-900 transition-colors group-hover:text-primary sm:text-[16px]">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-slate-500 sm:text-[14px]">
                          {post.excerpt}
                        </p>
                      )}
                    </div>
                    <ArrowRight className="mt-3 h-4 w-4 flex-shrink-0 text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:text-primary sm:mt-4" />
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}

        <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} />
      </div>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════
   Sub-components
   ════════════════════════════════════════════════════════ */

/** Article Card — Pitch 스타일: 이미지 → 제목(밑줄) → 카테고리 → 설명
 *  hover: 밑줄 사라짐 + 텍스트 primary 색 */
function ArticleCard({ post, index, compact }: { post: BlogPost; index: number; compact?: boolean }) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <div className="group">
        {/* 이미지 블록 */}
        <div className="relative aspect-[3/2] overflow-hidden rounded-md">
          <Image
            src={post.thumbnailUrl || "/blog-default-thumbnail.png"}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 45vw, 400px"
            priority={index < 3}
          />
          <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
        </div>

        {/* 제목 */}
        <h3 className={`mt-3 font-semibold leading-snug tracking-[-0.02em] text-slate-900 sm:mt-5 ${compact ? "line-clamp-2 text-[13px] sm:line-clamp-none sm:text-[18px]" : "text-[17px] sm:text-[18px]"}`}>
          <span className="underline decoration-slate-300/60 underline-offset-[3px] transition-all duration-300 group-hover:text-primary group-hover:decoration-transparent">
            {post.title}
          </span>
        </h3>

        {/* 카테고리 + 읽기 시간 */}
        <div className={`mt-1.5 flex items-center gap-1.5 sm:mt-2 ${compact ? "text-[11px] sm:text-[13px]" : "text-[13px]"}`}>
          {post.category && (
            <span className="font-semibold text-[#4B5EDB]">{post.category}</span>
          )}
          <span className="text-slate-300">·</span>
          <span className="text-slate-400">{estimateReadTime(post.content)}분 읽기</span>
        </div>

        {/* 설명 — compact 모드에서 모바일 숨김 */}
        {post.excerpt && (
          <p className={`mt-1 line-clamp-2 text-[14px] leading-relaxed text-slate-500 ${compact ? "hidden sm:block" : ""}`}>
            {post.excerpt}
          </p>
        )}
      </div>
    </Link>
  );
}

/** Editor Pick Hero — 가로형 이미지 + 텍스트 */
function EditorPickHero({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <div className="group overflow-hidden rounded-md transition-all hover:shadow-lg">
        <div className="grid items-center gap-0 sm:grid-cols-2">
          {/* 이미지 */}
          <div className="relative aspect-[16/9] overflow-hidden rounded-md">
            <Image
              src={post.thumbnailUrl || "/blog-default-thumbnail.png"}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 600px"
            />
            <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
          </div>
          {/* 텍스트 */}
          <div className="flex flex-col justify-center px-6 py-5 sm:px-8 sm:py-8">
            {post.category && (
              <span className={`mb-3 ${CATEGORY_COLOR}`}>
                {post.category}
              </span>
            )}
            <h3 className="line-clamp-2 text-[22px] font-semibold leading-snug tracking-[-0.02em] text-slate-900 sm:text-[26px]">
              <span className="underline decoration-slate-300/60 underline-offset-[3px] transition-all duration-300 group-hover:text-primary group-hover:decoration-transparent">
                {post.title}
              </span>
            </h3>
            {post.excerpt && (
              <p className="mt-3 line-clamp-2 text-[15px] leading-[1.8] text-slate-600">
                {post.excerpt}
              </p>
            )}
            <p className="mt-4 flex items-center gap-1.5 text-[13px] text-slate-400">
              {formatDate(post.publishedAt || post.createdAt)}
              <span className="text-slate-300">·</span>
              <span>{estimateReadTime(post.content)}분 읽기</span>
            </p>
            <span className="mt-4 inline-flex w-fit items-center gap-1.5 text-[14px] font-semibold text-slate-800 transition-colors group-hover:text-primary">
              자세히 보기
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function EmptyCategory({ category, onBack }: { category: string; onBack: () => void }) {
  return (
    <motion.div variants={fadeIn} className="flex flex-col items-center justify-center py-28 text-center">
      <p
        className="text-[36px] font-bold tracking-wide text-primary sm:text-[48px]"
        style={{ textShadow: "0 0 20px rgba(59,130,246,0.4), 0 0 40px rgba(59,130,246,0.15)" }}
      >
        COMING SOON
      </p>
      <p className="mt-3 text-[15px] text-slate-400">
        {category} 카테고리 — 준비 중
      </p>
      <button onClick={onBack} className="mt-8 rounded-full border border-slate-200 px-6 py-2.5 text-[13px] font-medium text-slate-600 hover:bg-slate-50 transition-colors">
        전체 글 보기
      </button>
    </motion.div>
  );
}

/** More Article Item — 매 6번째(2행) 뒤에 인라인 CTA 삽입 */
function MoreArticleItem({
  post,
  index,
  onContactOpen,
}: {
  post: BlogPost;
  index: number;
  onContactOpen: () => void;
}) {
  const showCta = index > 0 && (index + 1) % 6 === 0;

  return (
    <>
      <motion.div variants={itemFadeIn}>
        <ArticleCard post={post} index={index + 5} compact />
      </motion.div>
      {showCta && (
        <motion.div
          variants={itemFadeIn}
          className="col-span-full rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 px-8 py-10 text-center sm:py-12"
        >
          <h3 className="text-[20px] font-bold leading-tight tracking-[-0.02em] text-white sm:text-[24px]">
            행사 기획이 필요하신가요?
          </h3>
          <p className="mx-auto mt-2 max-w-md text-[14px] leading-[1.7] text-slate-400">
            기업행사, 세미나, 컨퍼런스 등 어떤 행사든
            <br />
            견적부터 실행까지 전문 팀이 함께합니다.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onContactOpen}
              className="relative overflow-hidden rounded-lg bg-primary px-6 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-primary-600"
            >
              <span className="relative z-10">무료 견적요청</span>
              <span
                className="absolute inset-0 animate-[light-sweep_2.5s_ease-in-out_infinite] opacity-40"
                style={{
                  background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.4) 50%, transparent 60%)",
                  backgroundSize: "200% 100%",
                }}
              />
            </button>
          </div>
        </motion.div>
      )}
    </>
  );
}
