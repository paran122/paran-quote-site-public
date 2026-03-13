"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { BlurFade } from "@/components/ui/blur-fade";
import type { BlogPost } from "@/types";

function formatDate(dateStr?: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

export default function BlogSection() {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    fetch("/api/blog?page=1")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data: { posts: BlogPost[] }) => setPosts(data.posts.slice(0, 3)))
      .catch(() => {});
  }, []);

  if (posts.length === 0) return <section id="blog" />;

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

        {/* 카드 그리드 */}
        <div className={`grid gap-6 ${posts.length === 1 ? "mx-auto max-w-md" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
          {posts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
            >
              <Link href={`/blog/${post.slug}`} className="group block">
                <div className="overflow-hidden rounded-xl bg-white shadow-sm transition-shadow hover:shadow-md">
                  {/* 이미지 */}
                  <div className="relative aspect-[3/2] overflow-hidden">
                    <Image
                      src={post.thumbnailUrl || "/blog-default-thumbnail.png"}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, 400px"
                    />
                  </div>
                  {/* 텍스트 */}
                  <div className="p-4 md:p-5">
                    {post.category && (
                      <span className="text-[12px] font-semibold text-blue-500">
                        {post.category}
                      </span>
                    )}
                    <h3 className="mt-1 line-clamp-2 text-[15px] font-bold leading-snug text-gray-900 md:text-[17px]">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="mt-1.5 line-clamp-2 text-[12px] leading-relaxed text-gray-500 md:text-[13px]">
                        {post.excerpt}
                      </p>
                    )}
                    <p className="mt-2 text-[11px] text-gray-400">
                      {formatDate(post.publishedAt || post.createdAt)}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
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
