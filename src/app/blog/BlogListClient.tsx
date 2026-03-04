"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
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

const PH_EDITOR: (BlogPost & { authorName: string })[] = [
  { id: "ph-e1", title: "AI가 바꾸는 행사 기획: 자동화부터 개인화 경험까지", slug: "", content: "", excerpt: "인공지능 기술이 행사 산업에 미치는 영향과 실제 도입 사례를 살펴봅니다.", category: "트렌드", tags: [], isPublished: true, isFeatured: false, sortOrder: 0, createdAt: "2024-03-01", updatedAt: "2024-03-01", authorName: "박지현" },
  { id: "ph-e2", title: "야외 행사 우천 대비 매뉴얼: 플랜 B는 이렇게", slug: "", content: "", excerpt: "갑작스러운 날씨 변화에도 행사를 성공적으로 진행하는 비상 대응 매뉴얼.", category: "행사 기획", tags: [], isPublished: true, isFeatured: false, sortOrder: 0, createdAt: "2024-02-28", updatedAt: "2024-02-28", authorName: "김태호" },
  { id: "ph-e3", title: "글로벌 IT 컨퍼런스 800명: 동시통역부터 네트워킹까지", slug: "", content: "", excerpt: "대규모 국제 행사를 성공적으로 운영한 파란컴퍼니의 이야기.", category: "행사 후기", tags: [], isPublished: true, isFeatured: false, sortOrder: 0, createdAt: "2024-02-20", updatedAt: "2024-02-20", authorName: "이서연" },
];

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
  index,
  sizes = "400px",
}: {
  post: BlogPost;
  index: number;
  sizes?: string;
}) {
  if (post.thumbnailUrl) {
    return (
      <Image
        src={post.thumbnailUrl}
        alt={post.title}
        fill
        className="object-cover"
        sizes={sizes}
      />
    );
  }
  return (
    <div
      className={`absolute inset-0 bg-gradient-to-br ${PH_GRADIENTS[index % PH_GRADIENTS.length]}`}
    />
  );
}

/* ════════════════════════════════════════════════════════
   메인 컴포넌트
   ════════════════════════════════════════════════════════ */
export default function BlogListClient({ posts, featuredPosts = [], categories }: Props) {
  const [activeCategory, setActiveCategory] = useState("전체");

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

  // 데이터 분배: 메가(1) + 서브(3) + 에디터(최대3, DB 기반) + 최신(나머지)
  const featured = hasData ? (nonFeatured[0] ?? filtered[0]) : PH_FEATURED;
  const subCards = hasData ? nonFeatured.slice(1, 4) : PH_SUB;
  const editorPicks = featuredPosts.length > 0
    ? featuredPosts.slice(0, 3).map((p) => ({ ...p, authorName: "" }))
    : (hasData ? nonFeatured.slice(4, 7).map((p) => ({ ...p, authorName: "" })) : PH_EDITOR);
  const latestPosts = hasData
    ? nonFeatured.slice(4, 10).map((p) => ({ ...p, authorName: "" }))
    : PH_LATEST;

  return (
    <div className="min-h-screen bg-white pt-14">
      {/* ═══ Hero (미세 그래디언트 배경) ═══ */}
      <div className="bg-gradient-to-b from-[#e8edff] via-[#f2f5ff] to-white pb-10 pt-16 sm:pb-14">
        <div className="mx-auto max-w-[1200px] px-6">
          <h1 className="text-[28px] font-black leading-[1.1] tracking-[-0.025em] text-slate-900 sm:text-[36px]">
            파란컴퍼니 블로그
          </h1>
          <p className="mt-2 text-[14px] leading-relaxed text-slate-400">
            성공적인 행사 기획의 모든 것
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
        {/* ═══ Mega Featured (이미지 + 오버레이) ═══ */}
        <MegaFeatured post={featured} />

        {/* ═══ 3 Overlay Sub-Featured ═══ */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subCards.map((post, i) => (
            <OverlayCard key={post.id} post={post} index={i + 1} />
          ))}
        </div>

        {/* ═══ 에디터 추천 ═══ */}
        <div className="mt-10 border-t border-slate-100 pt-8 sm:mt-12 sm:pt-10">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-[18px] font-bold tracking-[-0.01em] text-slate-900">
              에디터 추천
            </h2>
            <span className="text-[13px] font-medium text-slate-400 hover:text-slate-600">
              전체보기
            </span>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {editorPicks.map((post, i) => (
              <EditorPickCard key={post.id} post={post} index={i + 4} />
            ))}
          </div>
        </div>

        {/* ═══ 최신 글 (리스트 + 하이라이트 사이드) ═══ */}
        <div className="mt-10 border-t border-slate-100 pt-8 sm:mt-12 sm:pt-10">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-[18px] font-bold tracking-[-0.01em] text-slate-900">
              최신 글
            </h2>
            <span className="text-[13px] font-medium text-slate-400 hover:text-slate-600">
              전체보기
            </span>
          </div>

          <div className="flex flex-col gap-8 lg:flex-row">
            {/* 왼쪽: 리스트 3개 */}
            <div className="flex flex-1 flex-col divide-y divide-slate-100">
              {latestPosts.slice(0, 3).map((post, i) => (
                <LatestListItem key={post.id} post={post} index={i + 7} />
              ))}
            </div>

            {/* 오른쪽: 하이라이트 카드 (첫 번째 글 = 최신/베스트) */}
            <HighlightCard post={featured} />
          </div>
        </div>

        {/* ═══ CTA 섹션 ═══ */}
        <div className="mb-12 mt-12 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 px-8 py-12 text-center sm:mb-16 sm:mt-14 sm:py-14">
          <h2 className="text-[22px] font-bold leading-tight tracking-[-0.02em] text-white sm:text-[28px]">
            행사 기획이 필요하신가요?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[14px] leading-[1.7] text-slate-400">
            기업행사, 세미나, 컨퍼런스 등 어떤 행사든
            <br />
            견적부터 실행까지 전문 팀이 함께합니다.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/checkout"
              className="rounded-lg bg-primary px-6 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-primary-600"
            >
              무료 견적요청
            </Link>
            <a
              href="https://pf.kakao.com/_xkexdLG/chat"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-[#FEE500] px-6 py-3 text-[14px] font-semibold text-[#3C1E1E] transition-opacity hover:opacity-90"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                <path d="M12 3C6.48 3 2 6.58 2 10.9c0 2.78 1.86 5.22 4.65 6.6l-.96 3.56c-.08.3.26.54.52.37l4.23-2.82c.5.05 1.02.09 1.56.09 5.52 0 10-3.58 10-7.9C22 6.58 17.52 3 12 3z" />
              </svg>
              카카오톡 상담
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

/** Mega Featured — 큰 이미지에 하단 오버레이 */
function MegaFeatured({ post }: { post: BlogPost }) {
  const placeholder = isPh(post);

  const content = (
    <div className="group relative overflow-hidden rounded-lg">
      {/* 이미지 — 모바일은 더 높게 */}
      <div className="relative aspect-[16/9] sm:aspect-[21/9]">
        <CardImage post={post} index={0} sizes="1200px" />
      </div>

      {/* 왼쪽 그래디언트 오버레이 */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

      {/* 콘텐츠 — 왼쪽 세로 중앙 */}
      <div className="absolute inset-y-0 left-0 flex w-[75%] flex-col justify-center p-5 sm:w-[55%] sm:p-6 sm:pl-10">
        <span className="mb-3 inline-block self-start rounded-md bg-amber-500 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
          Featured
        </span>
        <h2 className="mb-2 text-[22px] font-extrabold leading-[1.25] tracking-[-0.02em] text-white sm:text-[28px]">
          {post.title}
        </h2>
        {post.excerpt && (
          <p className="mb-4 text-[14px] leading-[1.7] text-white/70">
            {post.excerpt}
          </p>
        )}
        <span className="inline-flex w-fit items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-[13px] font-semibold text-white transition-all group-hover:gap-3">
          자세히 보기 <ArrowRight className="h-4 w-4" />
        </span>
      </div>

      {placeholder && (
        <div className="absolute right-4 top-4 rounded bg-white/10 px-2 py-1 text-[10px] text-white/40">
          글을 발행하면 여기에 표시됩니다
        </div>
      )}
    </div>
  );

  if (placeholder) return <div>{content}</div>;
  return <Link href={`/blog/${post.slug}`}>{content}</Link>;
}

/** Overlay Card — 이미지 위에 하단 텍스트 오버레이 (4/3) */
function OverlayCard({ post, index }: { post: BlogPost; index: number }) {
  const placeholder = isPh(post);

  const content = (
    <div className="group relative overflow-hidden rounded-lg">
      <div className="relative aspect-[4/3]">
        <CardImage post={post} index={index} sizes="400px" />
      </div>
      {/* 오버레이 — 하단 60% 그래디언트 */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      {/* 텍스트 — 왼쪽 중앙 (하단 영역 내) */}
      <div className="absolute inset-x-0 bottom-0 flex h-[55%] flex-col justify-center px-5 pb-4">
        {post.category && (
          <span className={`mb-2 inline-block self-start rounded px-2.5 py-0.5 text-[11px] font-bold ${getBadgeColor(post.category)}`}>
            {post.category}
          </span>
        )}
        <h3 className="line-clamp-2 text-[16px] font-extrabold leading-[1.35] text-white">
          {post.title}
        </h3>
        <div className="mt-2 flex items-center gap-2 text-[12px] text-white/60">
          <span>{readTime(post.content) || 5}분 읽기</span>
          <span className="h-0.5 w-0.5 rounded-full bg-white/40" />
          <span>{formatDate(post.publishedAt || post.createdAt)}</span>
        </div>
      </div>
    </div>
  );

  if (placeholder) return <div>{content}</div>;
  return (
    <Link href={`/blog/${post.slug}`} className="transition-transform hover:-translate-y-1">
      {content}
    </Link>
  );
}

/** Editor Pick Card — 이미지 + body(뱃지,제목,excerpt,저자칩) */
function EditorPickCard({
  post,
  index,
}: {
  post: BlogPost & { authorName?: string };
  index: number;
}) {
  const placeholder = isPh(post);
  const authorInitial = post.authorName ? post.authorName[0] : "";

  const content = (
    <div className="group overflow-hidden rounded-lg border border-slate-100 bg-white transition-all hover:-translate-y-0.5 hover:border-transparent hover:shadow-lg">
      <div className="relative aspect-[16/10]">
        <CardImage post={post} index={index} sizes="400px" />
      </div>
      <div className="px-5 pb-5 pt-4">
        {post.category && (
          <span className={`inline-block rounded px-2 py-0.5 text-[11px] font-semibold ${getBadgeColor(post.category)}`}>
            {post.category}
          </span>
        )}
        <h3 className="mt-2 line-clamp-2 text-[15px] font-extrabold leading-[1.35] tracking-[-0.01em] text-slate-900">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="mt-1.5 line-clamp-2 text-[13px] leading-[1.6] text-slate-500">
            {post.excerpt}
          </p>
        )}
        <div className="mt-3 flex items-center justify-between">
          {post.authorName && (
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-500">
                {authorInitial}
              </div>
              <span className="text-[12px] text-slate-500">{post.authorName}</span>
            </div>
          )}
          <span className="text-[12px] text-slate-400">
            {readTime(post.content) || 5}분 읽기
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

/** Highlight Card — 최신 글 섹션 오른쪽 베스트 카드 */
function HighlightCard({ post }: { post: BlogPost }) {
  const placeholder = isPh(post);
  const inner = (
    <div className="group relative h-full w-full overflow-hidden rounded-lg">
      <div className="relative aspect-[4/3] w-full lg:absolute lg:inset-0 lg:aspect-auto">
        <CardImage post={post} index={0} sizes="340px" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
      <div className="absolute inset-0 flex flex-col justify-end p-6">
        <span className="mb-2 inline-block self-start rounded bg-primary/90 px-2.5 py-0.5 text-[11px] font-bold text-white">
          BEST
        </span>
        {post.category && (
          <span className="mb-1 text-[12px] font-medium text-white/60">
            {post.category}
          </span>
        )}
        <h3 className="line-clamp-3 text-[17px] font-bold leading-[1.35] text-white sm:text-[18px]">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="mt-2 line-clamp-2 text-[12px] leading-[1.6] text-white/60">
            {post.excerpt}
          </p>
        )}
        <span className="mt-3 inline-flex w-fit items-center gap-1.5 text-[12px] font-semibold text-white/80 transition-colors group-hover:text-white">
          자세히 보기 <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </div>
  );
  if (placeholder) return <div className="w-full lg:w-[400px] lg:self-stretch">{inner}</div>;
  return (
    <Link href={`/blog/${post.slug}`} className="block w-full lg:w-[400px] lg:self-stretch">
      {inner}
    </Link>
  );
}
