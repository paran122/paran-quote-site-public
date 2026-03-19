"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import type { BlogPost } from "@/types";

function formatDate(dateStr?: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return `${d.getUTCFullYear()}.${String(d.getUTCMonth() + 1).padStart(2, "0")}.${String(d.getUTCDate()).padStart(2, "0")}`;
}

/* ────────────────────────────────────────────
 *  카드 스택 컴포넌트 — 드래그 + 자동 넘김
 * ──────────────────────────────────────────── */

interface CardStackProps {
  posts: BlogPost[];
  interval?: number;
}

/** 드래그 임계값 (px) — 이 이상 움직이면 카드 넘김 */
const DRAG_THRESHOLD = 60;

export default function BlogCardStack({ posts, interval = 5000 }: CardStackProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(1); // 1: 아래→위, -1: 위→아래
  const isDragging = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  const goTo = useCallback((dir: 1 | -1) => {
    setDirection(dir);
    setCurrentIndex((prev) => (prev + dir + posts.length) % posts.length);
  }, [posts.length]);

  const advance = useCallback(() => {
    goTo(1);
  }, [goTo]);

  useEffect(() => {
    if (posts.length <= 1 || isPaused) return;
    timerRef.current = setInterval(advance, interval);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [posts.length, isPaused, interval, advance]);

  const handleDragEnd = useCallback((_: unknown, info: PanInfo) => {
    const { offset } = info;
    // 세로 또는 가로 드래그 감지
    if (Math.abs(offset.y) > DRAG_THRESHOLD || Math.abs(offset.x) > DRAG_THRESHOLD) {
      // 위/왼쪽 → 다음, 아래/오른쪽 → 이전
      const dir = (offset.y < -DRAG_THRESHOLD || offset.x < -DRAG_THRESHOLD) ? 1 : -1;
      goTo(dir as 1 | -1);
    }
    // 짧은 지연 후 드래그 플래그 해제 (클릭 링크 방지용)
    setTimeout(() => { isDragging.current = false; }, 50);
  }, [goTo]);

  if (posts.length === 0) return null;

  const current = posts[currentIndex];

  const variants = {
    enter: (d: number) => ({ opacity: 0, y: d > 0 ? 40 : -40 }),
    center: { opacity: 1, y: 0, scale: 1, rotate: 0 },
    exit: (d: number) => ({ opacity: 0, y: d > 0 ? -30 : 30 }),
  };

  return (
    <div
      className="relative w-full aspect-[3/4.2] sm:aspect-[3/3.8]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence mode="popLayout" custom={direction}>
        <motion.div
          key={current.id}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          drag
          dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
          dragElastic={0.15}
          onDragStart={() => { isDragging.current = true; }}
          onDragEnd={handleDragEnd}
          whileDrag={{ scale: 1.03, boxShadow: "0 25px 50px rgba(0,0,0,0.2)", cursor: "grabbing" }}
          className="absolute inset-0 cursor-grab"
        >
          <Link
            href={`/blog/${current.slug}`}
            className="block h-full"
            draggable={false}
            onClick={(e) => { if (isDragging.current) e.preventDefault(); }}
          >
            <div className="relative h-full overflow-hidden rounded-xl bg-white shadow-md ring-1 ring-black/5">
              <div className="relative h-[58%] overflow-hidden">
                <Image
                  src={current.thumbnailUrl || "/blog-default-thumbnail.png"}
                  alt={current.title}
                  fill
                  className="object-cover pointer-events-none select-none"
                  sizes="(max-width: 640px) 90vw, 350px"
                  draggable={false}
                />
              </div>
              <div className="p-4 pb-5">
                {current.category && (
                  <span className="text-[11px] font-semibold text-blue-500">
                    {current.category}
                  </span>
                )}
                <h3 className="mt-1 line-clamp-2 text-[14px] font-bold leading-snug text-gray-900 sm:text-[15px]">
                  {current.title}
                </h3>
                {current.excerpt && (
                  <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-gray-500 sm:text-[12px]">
                    {current.excerpt}
                  </p>
                )}
                <p className="mt-1.5 text-[10px] text-gray-400">
                  {formatDate(current.publishedAt || current.createdAt)}
                </p>
              </div>
            </div>
          </Link>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
