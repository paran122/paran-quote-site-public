"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BlurFade } from "@/components/ui/blur-fade";
import BlogCardStack from "./BlogCardStack";
import type { BlogPost } from "@/types";

const GUIDE_CATEGORIES = ["기획 가이드", "현장 노하우", "행사 정보"];

export default function BlogSection() {
  const [eventPosts, setEventPosts] = useState<BlogPost[]>([]);
  const [guidePosts, setGuidePosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const eventFetches = Promise.all([
      fetch("/api/blog?page=1&category=행사 기획").then((r) => r.ok ? r.json() : { posts: [] }),
      fetch("/api/blog?page=1&category=행사 후기").then((r) => r.ok ? r.json() : { posts: [] }),
    ]).then(([a, b]: { posts: BlogPost[] }[]) =>
      [...a.posts, ...b.posts]
        .filter((p, i, arr) => arr.findIndex((q) => q.id === p.id) === i)
        .sort((x, y) =>
          new Date(y.publishedAt || y.createdAt || "").getTime() -
          new Date(x.publishedAt || x.createdAt || "").getTime()
        )
    );

    const guideFetches = Promise.all(
      GUIDE_CATEGORIES.map((cat) =>
        fetch(`/api/blog?page=1&category=${encodeURIComponent(cat)}`)
          .then((r) => r.ok ? r.json() : { posts: [] })
      )
    ).then((results: { posts: BlogPost[] }[]) =>
      results.flatMap((r) => r.posts)
        .sort((x, y) =>
          new Date(y.publishedAt || y.createdAt || "").getTime() -
          new Date(x.publishedAt || x.createdAt || "").getTime()
        )
    );

    Promise.all([eventFetches, guideFetches])
      .then(([events, guides]) => {
        setEventPosts(events);
        setGuidePosts(guides);
      })
      .catch(() => {});
  }, []);

  if (eventPosts.length === 0) return <section id="blog" />;

  const leftPosts = eventPosts.filter((_, i) => i % 2 === 0);
  const rightPosts = eventPosts.filter((_, i) => i % 2 === 1);

  return (
    <section id="blog" className="relative overflow-hidden bg-[#f8f9fb] px-4 py-10 md:px-12 md:py-24 lg:px-20">
      <div className="relative mx-auto max-w-6xl">
        <BlurFade delay={0.1}>
          <div className="mb-1 text-center font-[var(--font-inter)] text-xs font-extrabold tracking-[0.25em] text-blue-500/80 md:text-base">
            BLOG
          </div>
          <div className="mx-auto mb-2 h-[2px] w-8 rounded-full bg-blue-400 md:mb-4 md:w-10" />
          <h2 className="mb-2 text-center text-xl font-bold text-gray-900 md:mb-4 md:text-5xl">
            블로그
          </h2>
          <p className="mx-auto mb-6 max-w-lg text-center text-xs text-gray-400 md:mb-14 md:text-base">
            행사 기획 노하우와 현장 사례를 공유합니다
          </p>
        </BlurFade>

        {/* 3열 레이아웃: 카드스택 | 고정 | 카드스택 */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* 1번: 왼쪽 카드 스택 */}
          <div className="relative">
            <BlogCardStack posts={leftPosts} interval={4000} />
          </div>

          {/* 2번: 가운데 카드 스택 (가이드 카테고리) */}
          <div className="relative hidden sm:block">
            <BlogCardStack
              posts={guidePosts.length > 0 ? guidePosts : leftPosts}
              interval={5000}
            />
          </div>

          {/* 3번: 오른쪽 카드 스택 */}
          <div className="relative hidden lg:block">
            <BlogCardStack
              posts={rightPosts.length > 0 ? rightPosts : leftPosts}
              interval={6000}
            />
          </div>
        </div>

        {/* CTA 버튼 */}
        <BlurFade delay={0.3}>
          <div className="mt-8 text-center md:mt-12">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-6 py-2.5 text-[13px] font-semibold text-gray-700 transition-all hover:border-blue-300 hover:text-blue-600 hover:shadow-sm md:px-8 md:py-3 md:text-[14px]"
            >
              블로그 더 보기
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </BlurFade>
      </div>
    </section>
  );
}
