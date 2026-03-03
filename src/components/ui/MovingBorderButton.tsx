"use client";

import React, { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";

function MovingBorder({
  children,
  duration = 2000,
  rx,
  ry,
}: {
  children: React.ReactNode;
  duration?: number;
  rx?: string;
  ry?: string;
}) {
  const pathRef = useRef<SVGRectElement>(null);
  const progress = useMotionValue<number>(0);

  useAnimationFrame((time) => {
    const length = pathRef.current?.getTotalLength();
    if (length) {
      const pxPerMillisecond = length / duration;
      progress.set((time * pxPerMillisecond) % length);
    }
  });

  const x = useTransform(
    progress,
    (val) => pathRef.current?.getPointAtLength(val).x ?? 0
  );
  const y = useTransform(
    progress,
    (val) => pathRef.current?.getPointAtLength(val).y ?? 0
  );

  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="absolute h-full w-full"
        width="100%"
        height="100%"
      >
        <rect
          fill="none"
          width="100%"
          height="100%"
          rx={rx}
          ry={ry}
          ref={pathRef}
        />
      </svg>
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          display: "inline-block",
          transform,
        }}
      >
        {children}
      </motion.div>
    </>
  );
}

interface MovingBorderButtonProps {
  children: React.ReactNode;
  borderRadius?: string;
  duration?: number;
  variant?: "light" | "dark";
  className?: string;
  containerClassName?: string;
  href?: string;
  onClick?: () => void;
}

export default function MovingBorderButton({
  children,
  borderRadius = "1.5rem",
  duration = 3000,
  variant = "dark",
  className,
  containerClassName,
  href,
  onClick,
}: MovingBorderButtonProps) {
  const isLight = variant === "light";

  const inner = (
    <div
      className={cn(
        "bg-transparent relative p-[1px] overflow-hidden",
        containerClassName
      )}
      style={{ borderRadius }}
    >
      <div
        className="absolute inset-0"
        style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}
      >
        <MovingBorder duration={duration} rx="30%" ry="30%">
          <div
            className={cn(
              "h-16 w-16 opacity-[0.8]",
              isLight
                ? "bg-[radial-gradient(#3B82F6_40%,transparent_60%)]"
                : "bg-[radial-gradient(#38BDF8_40%,transparent_60%)]"
            )}
          />
        </MovingBorder>
      </div>

      <div
        className={cn(
          "relative backdrop-blur-xl flex items-center justify-center w-full h-full text-sm font-semibold antialiased px-6 py-3 gap-2 transition-all duration-300",
          isLight
            ? "bg-white/90 border border-slate-200 text-slate-900 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700"
            : "bg-slate-900/80 border border-slate-700/50 text-white hover:bg-indigo-600/20 hover:border-indigo-500/40 hover:text-indigo-200",
          className
        )}
        style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}
      >
        {children}
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
        {inner}
      </a>
    );
  }

  return (
    <button onClick={onClick} type="button" className="cursor-pointer">
      {inner}
    </button>
  );
}
