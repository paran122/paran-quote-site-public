"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

interface Props {
  images: Array<{ src: string; alt: string }>;
  /** 전환 간격 (ms) */
  interval?: number;
  /** true면 이미지를 잘리지 않게 contain으로 표시 */
  contain?: boolean;
}

export default function HeroSlideshow({ images, interval = 5000, contain }: Props) {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(next, interval);
    return () => clearInterval(timer);
  }, [next, interval, images.length]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#0f1a3c]">
      {/* 모든 이미지를 항상 렌더링, 현재만 보이고 나머지는 숨김 */}
      {images.map((img, i) => (
        <div
          key={img.src}
          className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
          style={{ zIndex: i === current ? 2 : 1 }}
        >
          <Image
            src={img.src}
            alt={img.alt}
            fill
            className={contain ? "object-contain" : "object-cover object-[50%_35%]"}
            priority={i === 0}
            sizes="100vw"
          />
        </div>
      ))}
      {/* 어두운 오버레이 — 텍스트 가독성 확보 */}
      <div className="absolute inset-0 z-[3] bg-[#0f1a3c]/75" />
    </div>
  );
}
