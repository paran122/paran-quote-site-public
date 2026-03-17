"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { BlogPost } from "@/types";

function formatDate(dateStr?: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return `${d.getUTCFullYear()}.${String(d.getUTCMonth() + 1).padStart(2, "0")}.${String(d.getUTCDate()).padStart(2, "0")}`;
}

/* ────────────────────────────────────────────
 *  A 기반 4가지 변형
 * ──────────────────────────────────────────── */
export type FlipMode = "A";

const FLIP_CONFIG = {
  flipping: { y: "-25%", opacity: 0, scale: 1.0, rotateX: -15 },
  transition: { duration: 1.0, ease: [0.25, 0.46, 0.45, 0.94] },
};

/* ────────────────────────────────────────────
 *  카드 스택 컴포넌트
 * ──────────────────────────────────────────── */

interface CardStackProps {
  posts: BlogPost[];
  interval?: number;
}

const OFFSET = 8;
const SCALE_STEP = 0;
const DIM_STEP = 0.15;
const VISIBLE = 3;

const spring = { type: "spring" as const, stiffness: 120, damping: 20 };

export default function BlogCardStack({ posts, interval = 5000 }: CardStackProps) {
  const [cards, setCards] = useState(posts);
  const [isPaused, setIsPaused] = useState(false);
  const [flipping, setFlipping] = useState(false);
  const flipTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => { setCards(posts); }, [posts]);

  const advance = useCallback(() => {
    if (flipping) return;
    setFlipping(true);
    flipTimeoutRef.current = setTimeout(() => {
      setCards((prev) => [...prev.slice(1), prev[0]]);
      setFlipping(false);
    }, (FLIP_CONFIG.transition.duration as number) * 800);
  }, [flipping]);

  useEffect(() => {
    return () => { if (flipTimeoutRef.current) clearTimeout(flipTimeoutRef.current); };
  }, []);

  useEffect(() => {
    if (cards.length <= 1 || isPaused || flipping) return;
    const timer = setInterval(advance, interval);
    return () => clearInterval(timer);
  }, [cards.length, isPaused, interval, advance, flipping]);

  if (cards.length === 0) return null;

  const visibleCards = cards.slice(0, VISIBLE);

  return (
    <div
      className="relative w-full aspect-[3/4.2] sm:aspect-[3/3.8]"
      style={{ perspective: "1200px" }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <ul className="relative m-0 h-full w-full list-none p-0">
        {visibleCards
          .slice()
          .reverse()
          .map((post, reversedI) => {
            const i = VISIBLE - 1 - reversedI;
            const isFront = i === 0;
            const brightness = Math.max(0.4, 1 - i * DIM_STEP);

            // 플립 중인 맨앞 카드
            const flipAnimate = isFront && flipping
              ? {
                  ...FLIP_CONFIG.flipping,
                  zIndex: VISIBLE + 1,
                }
              : {
                  top: `${i * -OFFSET}%`,
                  scale: 1 - i * SCALE_STEP,
                  filter: `brightness(${brightness})`,
                  zIndex: VISIBLE - i,
                  y: 0,
                  opacity: 1,
                  rotateX: 0,
                };

            return (
              <motion.li
                key={post.id}
                className="absolute inset-0 list-none overflow-hidden rounded-xl"
                style={{
                  transformOrigin: "center bottom",
                  boxShadow: isFront
                    ? "0 20px 40px rgba(0,0,0,0.15)"
                    : "0 10px 20px rgba(0,0,0,0.08)",
                  backfaceVisibility: "hidden",
                }}
                animate={flipAnimate}
                transition={
                  isFront && flipping
                    ? FLIP_CONFIG.transition
                    : isFront
                      ? { duration: 0 }
                      : { duration: 0 }
                }
              >
                <Link href={`/blog/${post.slug}`} className="block h-full" draggable={false}>
                  <div className="relative h-full overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/5">
                    <div className="relative h-[58%] overflow-hidden">
                      <Image
                        src={post.thumbnailUrl || "/blog-default-thumbnail.png"}
                        alt={post.title}
                        fill
                        className="object-cover pointer-events-none select-none"
                        sizes="(max-width: 640px) 90vw, 350px"
                        draggable={false}
                      />
                    </div>
                    <div className="p-4 pb-5">
                      {post.category && (
                        <span className="text-[11px] font-semibold text-blue-500">
                          {post.category}
                        </span>
                      )}
                      <h3 className="mt-1 line-clamp-2 text-[14px] font-bold leading-snug text-gray-900 sm:text-[15px]">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-gray-500 sm:text-[12px]">
                          {post.excerpt}
                        </p>
                      )}
                      <p className="mt-1.5 text-[10px] text-gray-400">
                        {formatDate(post.publishedAt || post.createdAt)}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.li>
            );
          })}
      </ul>
    </div>
  );
}

/* ────────────────────────────────────────────
 *  고정 카드 (가운데 가이드용)
 * ──────────────────────────────────────────── */
export function BlogFixedCard({ post }: { post: BlogPost }) {
  return (
    <div className="w-full aspect-[3/4.2] sm:aspect-[3/3.8]">
      <Link href={`/blog/${post.slug}`} className="group block h-full">
        <div className="h-full overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/5 transition-shadow hover:shadow-md">
          <div className="relative h-[58%] overflow-hidden">
            <Image
              src={post.thumbnailUrl || "/blog-default-thumbnail.png"}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 90vw, 350px"
            />
          </div>
          <div className="p-4 pb-5">
            {post.category && (
              <span className="text-[11px] font-semibold text-blue-500">
                {post.category}
              </span>
            )}
            <h3 className="mt-1 line-clamp-2 text-[14px] font-bold leading-snug text-gray-900 sm:text-[15px]">
              {post.title}
            </h3>
            {post.excerpt && (
              <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-gray-500 sm:text-[12px]">
                {post.excerpt}
              </p>
            )}
            <p className="mt-1.5 text-[10px] text-gray-400">
              {formatDate(post.publishedAt || post.createdAt)}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}
