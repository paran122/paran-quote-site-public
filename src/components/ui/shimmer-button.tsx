"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
  className?: string;
  children?: React.ReactNode;
}

export function ShimmerButton({
  shimmerColor = "#ffffff",
  shimmerSize = "0.1em",
  shimmerDuration = "2s",
  borderRadius = "100px",
  background = "rgba(0, 0, 0, 1)",
  className,
  children,
  ...props
}: ShimmerButtonProps) {
  return (
    <button
      style={
        {
          "--shimmer-color": shimmerColor,
          "--shimmer-size": shimmerSize,
          "--shimmer-duration": shimmerDuration,
          "--border-radius": borderRadius,
          "--bg": background,
        } as React.CSSProperties
      }
      className={cn(
        "group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap px-8 py-4 text-white [background:var(--bg)] [border-radius:var(--border-radius)]",
        "transform-gpu transition-transform duration-300 ease-in-out active:translate-y-px",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 overflow-hidden [border-radius:var(--border-radius)]">
        <div className="absolute inset-[-100%] animate-[shimmer_var(--shimmer-duration)_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0%,var(--shimmer-color)_10%,transparent_20%)]" />
      </div>
      <div className="absolute inset-px rounded-[inherit] [background:var(--bg)]" />
      <span className="relative z-10 flex items-center gap-2 font-medium">
        {children}
      </span>
    </button>
  );
}
