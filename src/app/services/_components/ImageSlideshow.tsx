"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

interface SlideshowImage {
  src: string;
  alt: string;
  caption?: string;
}

interface Props {
  images: SlideshowImage[];
  interval?: number;
  linkHref?: string;
  linkText?: string;
}

export default function ImageSlideshow({
  images,
  interval = 4000,
  linkHref,
  linkText,
}: Props) {
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
    <div>
      <div className="relative aspect-[9/6] bg-slate-100">
        {images.map((img, i) => (
          <div
            key={img.src}
            className={`absolute inset-0 transition-opacity duration-[1200ms] ease-in-out ${
              i === current ? "opacity-100" : "opacity-0"
            }`}
            style={{ zIndex: i === current ? 2 : 1 }}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-contain bg-white"
              sizes="(max-width: 768px) 100vw, 900px"
              priority={i === 0}
            />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between px-4 py-2 bg-slate-50">
        <p className="text-xs text-slate-400 transition-opacity duration-500">
          {images[current]?.caption}
        </p>
        <div className="flex items-center gap-3 shrink-0 ml-4">
          <span className="text-[10px] text-slate-300">
            {current + 1} / {images.length}
          </span>
          {linkHref && linkText && (
            <Link
              href={linkHref}
              className="text-xs text-blue-600 font-medium hover:underline"
            >
              {linkText}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
