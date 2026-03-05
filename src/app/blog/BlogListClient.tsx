"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { BlogPostCard } from "@/components/ui/card-18";
import ContactModal from "@/components/ui/ContactModal";
import type { BlogPost } from "@/types";

interface Props {
  posts: BlogPost[];
  featuredPosts?: BlogPost[];
  categories: string[];
}

/* ── 기본 카테고리 ── */
const DEFAULT_CATEGORIES = [
  "행사 기획",
  "행사 후기",
  "트렌드",
  "체크리스트",
  "장비/기술",
];

/* ── 뱃지 색상 매핑 ── */
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

/* ── 플레이스홀더 그래디언트 (통일된 네이비) ── */
const PH_GRADIENTS = [
  "from-[#1a2744] to-[#0f1a2e]",
  "from-[#1e2d4a] to-[#131f35]",
  "from-[#1a2a45] to-[#0e1828]",
  "from-[#1c2e4c] to-[#111d33]",
  "from-[#182640] to-[#0d1726]",
  "from-[#1f3050] to-[#142238]",
  "from-[#1b2b48] to-[#101c30]",
  "from-[#1d2f4e] to-[#122036]",
  "from-[#192843] to-[#0f192c]",
];

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
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const PH_SUB: BlogPost[] = [
  { id: "ph-s1", title: "행사 D-30 완벽 체크리스트", slug: "", content: "", category: "체크리스트", tags: [], isPublished: true, isFeatured: false, sortOrder: 0, createdAt: "2024-02-15", updatedAt: "2024-02-15" },
  { id: "ph-s2", title: "해군본부 창설기념 세미나 200명", slug: "", content: "", category: "행사 후기", tags: [], isPublished: true, isFeatured: false, sortOrder: 0, createdAt: "2024-02-10", updatedAt: "2024-02-10" },
  { id: "ph-s3", title: "LED 월 vs 프로젝터 선택 가이드", slug: "", content: "", category: "장비/기술", tags: [], isPublished: true, isFeatured: false, sortOrder: 0, createdAt: "2024-02-05", updatedAt: "2024-02-05" },
];

const PH_EDITOR: BlogPost = {
  id: "ph-e1", title: "중앙아시아 교육협력포럼 행사 후기: 5개국 교육 전문가 한자리에", slug: "", content: "", excerpt: "중앙아시아 5개국 교육 전문가들이 모인 국제 포럼의 기획부터 현장 운영까지, 대규모 국제행사의 노하우를 공유합니다.", thumbnailUrl: "https://aiarnrhftmuffmcninyl.supabase.co/storage/v1/object/public/portfolio/international-forum/photo-06.webp", category: "행사 후기", tags: ["국제행사", "포럼"], isPublished: true, isFeatured: false, sortOrder: 0, createdAt: "2024-03-01", updatedAt: "2024-03-01",
};

const PH_LATEST: (BlogPost & { authorName: string })[] = [
  { id: "ph-r1", title: "워크숍 기획 A to Z: 참여율 90% 만드는 비법", slug: "", content: "", excerpt: "참여형 워크숍을 설계하고 실행하는 단계별 가이드와 현장 팁을 공유합니다.", category: "행사 기획", tags: [], isPublished: true, isFeatured: false, sortOrder: 0, createdAt: "2024-01-18", updatedAt: "2024-01-18", authorName: "박지현" },
  { id: "ph-r2", title: "메타버스 행사의 현실: 성공과 실패 사례 분석", slug: "", content: "", excerpt: "가상 공간 행사의 실제 운영 사례와 참석자 반응, 그리고 개선 방향을 정리했습니다.", category: "트렌드", tags: [], isPublished: true, isFeatured: false, sortOrder: 0, createdAt: "2024-01-12", updatedAt: "2024-01-12", authorName: "이서연" },
  { id: "ph-r3", title: "음향 시스템 완벽 가이드: 공간별 최적 세팅", slug: "", content: "", excerpt: "소규모 회의실부터 대형 홀까지, 공간 특성에 맞는 음향 장비 선택과 세팅법.", category: "장비/기술", tags: [], isPublished: true, isFeatured: false, sortOrder: 0, createdAt: "2024-01-05", updatedAt: "2024-01-05", authorName: "김태호" },
];

/* ── 유틸 ── */
function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}

function readTime(content: string): number {
  const text = content.replace(/<[^>]*>/g, "");
  return Math.max(1, Math.round(text.length / 500));
}

function isPh(post: BlogPost) {
  return post.id.startsWith("ph") || post.id === "placeholder-featured";
}

/* ── 이미지 or 그래디언트 ── */
function CardImage({
  post,
  sizes = "400px",
}: {
  post: BlogPost;
  index?: number;
  sizes?: string;
}) {
  return (
    <Image
      src={post.thumbnailUrl || "/blog-default-thumbnail.png"}
      alt={post.title}
      fill
      className="object-cover"
      sizes={sizes}
    />
  );
}

/* ════════════════════════════════════════════════════════
   메인 컴포넌트
   ════════════════════════════════════════════════════════ */
export default function BlogListClient({ posts, featuredPosts = [], categories }: Props) {
  const [activeCategory, setActiveCategory] = useState("전체");
  const [contactOpen, setContactOpen] = useState(false);

  const mergedCategories = Array.from(
    new Set([...DEFAULT_CATEGORIES, ...categories]),
  );
  const allCategories = ["전체", ...mergedCategories];

  const filtered = posts.filter(
    (post) => activeCategory === "전체" || post.category === activeCategory,
  );

  const hasData = filtered.length > 0;

  // 에디터 추천: DB에서 is_featured=true인 글 (sort_order 정렬)
  const featuredIds = new Set(featuredPosts.map((p) => p.id));
  const nonFeatured = filtered.filter((p) => !featuredIds.has(p.id));

  // 데이터 분배: 메가(1) + 서브(3) = Best 4 + 에디터(1) + 최신(나머지)
  const featured = hasData ? (nonFeatured[0] ?? filtered[0]) : PH_FEATURED;
  const subCards = hasData ? nonFeatured.slice(1, 4) : PH_SUB;

  // 에디터 추천: featuredPosts 중 첫 번째 1개
  const filteredFeatured = featuredPosts.filter(
    (p) => activeCategory === "전체" || p.category === activeCategory,
  );
  const editorPick: BlogPost | null = filteredFeatured.length > 0
    ? filteredFeatured[0]
    : (nonFeatured[4] ?? PH_EDITOR);

  // 최신 글: 메가+서브에 사용된 글 제외
  const usedIds = new Set([featured.id, ...subCards.map((p) => p.id)]);
  const remaining = nonFeatured.filter((p) => !usedIds.has(p.id));
  const latestPosts = hasData
    ? remaining.slice(0, 6).map((p) => ({ ...p, authorName: "" }))
    : PH_LATEST;

  return (
    <div className="min-h-screen bg-slate-50 pt-14">
      {/* ═══ Hero ═══ */}
      <div className="bg-white pb-10 pt-16 sm:pb-14">
        <div className="mx-auto max-w-[1200px] px-6">
          <h1 className="text-[28px] font-black leading-[1.1] tracking-[-0.025em] text-slate-900 sm:text-[36px]">
            PARAN Blog
          </h1>
          <p className="mt-2 text-[14px] leading-relaxed text-slate-400">
            Insights for Successful Event Planning
          </p>

          {/* Category Tabs */}
          <div className="mt-7 flex gap-1.5 overflow-x-auto scrollbar-hide">
            {allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${
                  activeCategory === cat
                    ? "bg-slate-800 text-white"
                    : "bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] px-6">
        {/* ═══ Mega Featured (card-18 featured) ═══ */}
        <BlogPostCard
          variant="featured"
          tag={featured.category || "트렌드"}
          date={formatDate(featured.publishedAt || featured.createdAt)}
          title={featured.title}
          description={featured.excerpt || ""}
          imageUrl={featured.thumbnailUrl}
          href={isPh(featured) ? "" : `/blog/${featured.slug}`}
        />

        {/* ═══ Sub-Featured (Best 4 중 하단 3개) ═══ */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subCards.map((post, i) => (
            <HoverRevealCard key={post.id} post={post} index={i + 1} />
          ))}
        </div>

        {/* ═══ 에디터 추천 ═══ */}
        {editorPick && (
          <div className="mt-14 border-t border-slate-100 pt-10 sm:mt-16 sm:pt-12">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-[18px] font-bold tracking-[-0.01em] text-slate-900">
                에디터 추천
              </h2>
              <Link href="/blog/all" className="text-[13px] font-medium text-slate-400 transition-colors hover:text-slate-600">
                전체보기
              </Link>
            </div>
            <EditorPickHero post={editorPick} />
          </div>
        )}

        {/* ═══ 최신 글 (리스트 + 하이라이트 사이드) ═══ */}
        <div className="mt-14 border-t border-slate-100 pt-10 sm:mt-16 sm:pt-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-[18px] font-bold tracking-[-0.01em] text-slate-900">
              최신 글
            </h2>
            <Link href="/blog/all" className="text-[13px] font-medium text-slate-400 transition-colors hover:text-slate-600">
              전체보기
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 sm:gap-x-8">
            {latestPosts.slice(0, 6).map((post, i) => (
              <div key={post.id} className="border-b border-slate-100 last:border-b-0 sm:[&:nth-last-child(-n+2)]:border-b-0">
                <LatestListItem post={post} index={i + 7} />
              </div>
            ))}
          </div>
        </div>

        <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} />

        {/* ═══ CTA 섹션 ═══ */}
        <div className="mb-16 mt-16 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 px-8 py-12 text-center sm:mb-20 sm:mt-20 sm:py-14">
          <h2 className="text-[22px] font-bold leading-tight tracking-[-0.02em] text-white sm:text-[28px]">
            행사 기획이 필요하신가요?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[14px] leading-[1.7] text-slate-400">
            기업행사, 세미나, 컨퍼런스 등 어떤 행사든
            <br />
            견적부터 실행까지 전문 팀이 함께합니다.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setContactOpen(true)}
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
            <a
              href="https://pf.kakao.com/_xkexdLG/chat"
              target="_blank"
              rel="noopener noreferrer"
              className="relative inline-flex items-center gap-2 overflow-hidden rounded-lg bg-[#FEE500] px-6 py-3 text-[14px] font-semibold text-[#3C1E1E] transition-opacity hover:opacity-90"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="relative z-10 h-4 w-4">
                <path d="M12 3C6.48 3 2 6.58 2 10.9c0 2.78 1.86 5.22 4.65 6.6l-.96 3.56c-.08.3.26.54.52.37l4.23-2.82c.5.05 1.02.09 1.56.09 5.52 0 10-3.58 10-7.9C22 6.58 17.52 3 12 3z" />
              </svg>
              <span className="relative z-10">카카오톡 상담</span>
              <span
                className="absolute inset-0 animate-[light-sweep_4s_ease-in-out_infinite] opacity-50"
                style={{
                  background: "linear-gradient(105deg, transparent 40%, rgba(180,120,0,0.35) 50%, transparent 60%)",
                  backgroundSize: "200% 100%",
                }}
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   Sub-components
   ════════════════════════════════════════════════════════ */

/** Hover Reveal Card — 옵션 2: 흰배경 낮게 유지, 텍스트 상시 노출 */
function HoverRevealCard({ post, index }: { post: BlogPost; index: number }) {
  const placeholder = isPh(post);

  const card = (
    <div className="group overflow-hidden rounded-xl border border-slate-100 transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-lg">
      {/* 이미지 — hover 시 살짝 확대 */}
      <div className="relative aspect-[5/3] overflow-hidden">
        <div className="h-full w-full transition-transform duration-500 ease-out group-hover:scale-105">
          <CardImage post={post} index={index} sizes="400px" />
        </div>
        {/* 모바일 전용 하단 그래디언트 */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent sm:hidden" />
        <div className="absolute inset-x-0 bottom-0 z-10 p-4 sm:hidden">
          <h3 className="line-clamp-2 text-[15px] font-bold leading-tight text-white">
            {post.title}
          </h3>
        </div>
      </div>

      {/* 하단 텍스트 패널 — 데스크톱 상시 노출, 콤팩트 */}
      <div className="hidden bg-white px-4 py-3 sm:block">
        {post.category && (
          <span className={`mb-1.5 inline-block rounded px-2 py-0.5 text-[11px] font-semibold ${getBadgeColor(post.category)}`}>
            {post.category}
          </span>
        )}
        <h3 className="line-clamp-2 text-[14px] font-bold leading-snug text-slate-900">
          {post.title}
        </h3>
        <span className="mt-1.5 inline-flex items-center gap-1 text-[12px] font-medium text-slate-400 transition-colors group-hover:text-primary">
          자세히 보기 <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </div>
  );

  if (placeholder) return card;
  return <Link href={`/blog/${post.slug}`}>{card}</Link>;
}

/** Editor Pick Hero — 가로형 이미지 + 텍스트 (Blog8 스타일) */
function EditorPickHero({ post }: { post: BlogPost }) {
  const placeholder = isPh(post);

  const content = (
    <div className="group overflow-hidden rounded-lg border border-slate-100 bg-white transition-all hover:border-transparent hover:shadow-lg">
      <div className="grid items-center gap-0 sm:grid-cols-2">
        {/* 이미지 — hover 시 확대 */}
        <div className="relative aspect-[16/9] overflow-hidden">
          <div className="relative h-full w-full transition-transform duration-500 ease-in-out group-hover:scale-105">
            <CardImage post={post} index={4} sizes="(max-width: 640px) 100vw, 600px" />
          </div>
        </div>
        {/* 텍스트 */}
        <div className="flex flex-col justify-center px-6 py-5 sm:px-8 sm:py-8">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            {post.category && (
              <span className={`inline-block rounded px-2.5 py-0.5 text-[11px] font-semibold ${getBadgeColor(post.category)}`}>
                {post.category}
              </span>
            )}
            {post.tags && post.tags.length > 0 && post.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                {tag}
              </span>
            ))}
          </div>
          <h3 className="line-clamp-2 text-[18px] font-extrabold leading-[1.35] tracking-[-0.01em] text-slate-900 sm:text-[22px]">
            <span className="bg-gradient-to-r from-primary to-primary bg-[length:0%_2px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 group-hover:bg-[length:100%_2px]">
              {post.title}
            </span>
          </h3>
          {post.excerpt && (
            <p className="mt-2.5 line-clamp-2 text-[14px] leading-[1.7] text-slate-500">
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

/** Latest List Item — 왼쪽 썸네일 + 오른쪽 텍스트 (Siege Media 스타일) */
function LatestListItem({
  post,
  index,
}: {
  post: BlogPost & { authorName?: string };
  index: number;
}) {
  const placeholder = isPh(post);

  const content = (
    <div className="group flex gap-5 py-6 sm:gap-6">
      {/* 왼쪽 썸네일 */}
      <div className="relative h-[100px] w-[150px] flex-shrink-0 overflow-hidden rounded-lg sm:h-[130px] sm:w-[200px]">
        <CardImage post={post} index={index} sizes="200px" />
      </div>
      {/* 오른쪽 텍스트 */}
      <div className="flex min-w-0 flex-col justify-center">
        {post.category && (
          <span className="mb-1.5 text-[12px] font-semibold text-primary">
            {post.category}
          </span>
        )}
        <h4 className="line-clamp-2 text-[16px] font-bold leading-[1.4] tracking-[-0.01em] text-slate-900 transition-colors group-hover:text-primary sm:text-[18px]">
          {post.title}
        </h4>
        <div className="mt-2 text-[13px] text-slate-400">
          {formatDate(post.publishedAt || post.createdAt)}
          <span className="mx-1.5">·</span>
          {readTime(post.content) || 5}분 읽기
        </div>
      </div>
    </div>
  );

  if (placeholder) return <div>{content}</div>;
  return <Link href={`/blog/${post.slug}`}>{content}</Link>;
}

