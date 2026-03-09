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

/* ── 기본 카테고리 ── */
const DEFAULT_CATEGORIES = [
  "행사 기획",
  "행사 후기",
  "트렌드",
  "체크리스트",
  "장비/기술",
];

/* ── 카테고리 색상 (Pitch 스타일: 눈에 띄게) ── */
const CATEGORY_COLOR = "text-[13px] font-semibold text-[#4B5EDB]";

/* ── 플레이스홀더 데이터 ── */
const PH_FEATURED: BlogPost = {
  id: "placeholder-featured",
  title: "2024년 기업 행사 트렌드 TOP 10",
  slug: "",
  content: "",
  excerpt: "하이브리드에서 몰입형 경험까지, 올해 주목해야 할 행사 트렌드를 분석합니다.",
  category: "트렌드",
  tags: [],
  isPublished: true,
  isFeatured: false,
  sortOrder: 0,
  createdAt: "2024-01-01",
  updatedAt: "2024-01-01",
};

const PH_SUB: BlogPost[] = [
  { id: "ph-s1", title: "행사 D-30 완벽 체크리스트", slug: "", content: "", category: "체크리스트", tags: [], isPublished: true, isFeatured: false, sortOrder: 0, createdAt: "2024-02-15", updatedAt: "2024-02-15" },
  { id: "ph-s2", title: "해군본부 창설기념 세미나 200명", slug: "", content: "", category: "행사 후기", tags: [], isPublished: true, isFeatured: false, sortOrder: 0, createdAt: "2024-02-10", updatedAt: "2024-02-10" },
  { id: "ph-s3", title: "LED 월 vs 프로젝터 선택 가이드", slug: "", content: "", category: "장비/기술", tags: [], isPublished: true, isFeatured: false, sortOrder: 0, createdAt: "2024-02-05", updatedAt: "2024-02-05" },
];

const PH_EDITOR: BlogPost = {
  id: "ph-e1", title: "중앙아시아 교육협력포럼 행사 후기: 5개국 교육 전문가 한자리에", slug: "", content: "", excerpt: "중앙아시아 5개국 교육 전문가들이 모인 국제 포럼의 기획부터 현장 운영까지, 대규모 국제행사의 노하우를 공유합니다.", thumbnailUrl: "https://aiarnrhftmuffmcninyl.supabase.co/storage/v1/object/public/portfolio/international-forum/photo-06.webp", category: "행사 후기", tags: ["국제행사", "포럼"], isPublished: true, isFeatured: false, sortOrder: 0, createdAt: "2024-03-01", updatedAt: "2024-03-01",
};

const PH_MORE: BlogPost[] = [
  { id: "ph-r1", title: "워크숍 기획 A to Z: 참여율 90% 만드는 비법", slug: "", content: "", excerpt: "참여형 워크숍을 설계하고 실행하는 단계별 가이드와 현장 팁을 공유합니다.", category: "행사 기획", tags: [], isPublished: true, isFeatured: false, sortOrder: 0, createdAt: "2024-01-18", updatedAt: "2024-01-18" },
  { id: "ph-r2", title: "메타버스 행사의 현실: 성공과 실패 사례 분석", slug: "", content: "", excerpt: "가상 공간 행사의 실제 운영 사례와 참석자 반응, 그리고 개선 방향을 정리했습니다.", category: "트렌드", tags: [], isPublished: true, isFeatured: false, sortOrder: 0, createdAt: "2024-01-12", updatedAt: "2024-01-12" },
  { id: "ph-r3", title: "음향 시스템 완벽 가이드: 공간별 최적 세팅", slug: "", content: "", excerpt: "소규모 회의실부터 대형 홀까지, 공간 특성에 맞는 음향 장비 선택과 세팅법.", category: "장비/기술", tags: [], isPublished: true, isFeatured: false, sortOrder: 0, createdAt: "2024-01-05", updatedAt: "2024-01-05" },
];

/* ── 유틸 ── */
function formatDate(dateStr?: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}

function isPh(post: BlogPost) {
  return post.id.startsWith("ph") || post.id === "placeholder-featured";
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
    new Set([...DEFAULT_CATEGORIES, ...categories]),
  );
  const allCategories = ["전체", ...mergedCategories];

  const filtered = initialPosts.filter(
    (post) => activeCategory === "전체" || post.category === activeCategory,
  );

  const hasData = filtered.length > 0;

  // 에디터 추천: DB에서 is_featured=true인 글 (sort_order 정렬)
  const featuredIds = new Set(featuredPosts.map((p) => p.id));
  const nonFeatured = filtered.filter((p) => !featuredIds.has(p.id));

  // 데이터 분배: 메가(1) + 서브(3) = Best 4 + 에디터(1) + 나머지는 More articles
  const featured = hasData ? (nonFeatured[0] ?? filtered[0]) : PH_FEATURED;
  const subCards = hasData ? nonFeatured.slice(1, 4) : PH_SUB;

  // 에디터 추천: featuredPosts 중 첫 번째 1개
  const filteredFeatured = featuredPosts.filter(
    (p) => activeCategory === "전체" || p.category === activeCategory,
  );
  const editorPick: BlogPost | null = filteredFeatured.length > 0
    ? filteredFeatured[0]
    : (nonFeatured[4] ?? PH_EDITOR);

  // More articles: 메가+서브에 사용된 글 제외
  const usedIds = new Set([featured.id, ...subCards.map((p) => p.id)]);
  const remaining = nonFeatured.filter((p) => !usedIds.has(p.id));
  const moreArticles = hasData
    ? [...remaining, ...morePosts]
    : PH_MORE;

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
      className="min-h-screen bg-white pb-20 pt-14 sm:pb-28"
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
        {/* ═══ Mega Featured (Pitch Hero 스타일) ═══ */}
        <motion.div variants={fadeIn} className="mt-2">
          <BlogPostCard
            variant="featured"
            tag={featured.category || "트렌드"}
            date={formatDate(featured.publishedAt || featured.createdAt)}
            title={featured.title}
            description={featured.excerpt || ""}
            imageUrl={featured.thumbnailUrl}
            href={isPh(featured) ? "" : `/blog/${featured.slug}`}
          />
        </motion.div>

        {/* ═══ Sub-Featured (3열 이미지 카드) ═══ */}
        <motion.div variants={fadeIn} className="-mx-6 mt-20 flex snap-x sm:mt-24 snap-mandatory gap-6 overflow-x-auto px-6 pb-2 scrollbar-hide sm:mx-0 sm:grid sm:snap-none sm:grid-cols-2 sm:gap-10 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3">
          {subCards.map((post, i) => (
            <div key={post.id} className="w-[80%] flex-shrink-0 snap-start sm:w-auto">
              <ArticleCard post={post} index={i + 1} />
            </div>
          ))}
        </motion.div>

        {/* ═══ 에디터 추천 ═══ */}
        {editorPick && (
          <motion.div variants={fadeIn} className="mt-20 pt-12 sm:mt-24 sm:pt-16">
            <div className="mb-10">
              <h2 className="text-[14px] font-semibold tracking-[0.12em] text-slate-900">
                EDITOR&apos;S PICK
              </h2>
            </div>
            <EditorPickHero post={editorPick} />
          </motion.div>
        )}

        {/* ═══ More Articles (Pitch 스타일 3열 이미지 카드 그리드) ═══ */}
        <motion.div variants={fadeIn} className="mt-20 pt-12 sm:mt-24 sm:pt-16">
          <div className="mb-10">
            <h2 className="text-[14px] font-semibold tracking-[0.12em] text-slate-900">
              MORE ARTICLES
            </h2>
          </div>

          <motion.div
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
            className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3"
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
function ArticleCard({ post, index }: { post: BlogPost; index: number }) {
  const placeholder = isPh(post);

  const card = (
    <div className="group">
      {/* 이미지 블록 */}
      <div className="relative aspect-[3/2] overflow-hidden rounded-md">
        <Image
          src={post.thumbnailUrl || "/blog-default-thumbnail.png"}
          alt={post.title}
          fill
          className="object-cover"
          sizes="400px"
          priority={index < 3}
        />
        <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
      </div>

      {/* 제목 (이미지 아래, 밑줄 기본 → hover시 밑줄 사라짐 + primary) */}
      <h3 className="mt-5 text-[20px] font-semibold leading-snug tracking-[-0.02em] text-slate-900 sm:text-[22px]">
        <span className="underline decoration-slate-900/40 underline-offset-[3px] transition-all duration-300 group-hover:text-primary group-hover:decoration-transparent">
          {post.title}
        </span>
      </h3>

      {/* 카테고리 (텍스트만) */}
      {post.category && (
        <span className={`mt-2 inline-block ${CATEGORY_COLOR}`}>
          {post.category}
        </span>
      )}

      {/* 설명 */}
      {post.excerpt && (
        <p className="mt-1 line-clamp-2 text-[14px] leading-relaxed text-slate-500">
          {post.excerpt}
        </p>
      )}
    </div>
  );

  if (placeholder) return card;
  return <Link href={`/blog/${post.slug}`}>{card}</Link>;
}

/** Editor Pick Hero — 가로형 이미지 + 텍스트 */
function EditorPickHero({ post }: { post: BlogPost }) {
  const placeholder = isPh(post);

  const content = (
    <div className="group overflow-hidden rounded-md bg-white transition-all hover:shadow-lg">
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
            <span className="underline decoration-slate-900/40 underline-offset-[3px] transition-all duration-300 group-hover:text-primary group-hover:decoration-transparent">
              {post.title}
            </span>
          </h3>
          {post.excerpt && (
            <p className="mt-3 line-clamp-2 text-[15px] leading-[1.8] text-slate-600">
              {post.excerpt}
            </p>
          )}
          <p className="mt-4 text-[13px] text-slate-400">
            {formatDate(post.publishedAt || post.createdAt)}
          </p>
          <span className="mt-4 inline-flex w-fit items-center gap-1.5 text-[14px] font-semibold text-slate-800 transition-colors group-hover:text-primary">
            자세히 보기
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </div>
  );

  if (placeholder) return <div>{content}</div>;
  return <Link href={`/blog/${post.slug}`}>{content}</Link>;
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
        <ArticleCard post={post} index={index + 5} />
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
