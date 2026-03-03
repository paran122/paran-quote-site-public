"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface PulsatingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pulseColor?: string;
  duration?: string;
  className?: string;
  children?: React.ReactNode;
}

export function PulsatingButton({
  pulseColor = "#0096ff",
  duration = "2.5s",
  className,
  children,
  ...props
}: PulsatingButtonProps) {
  return (
    <button
      className={cn(
        "group relative flex cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-blue-500 px-6 py-3 text-center text-white",
        className
      )}
      style={
        {
          "--pulse-color": pulseColor,
          "--duration": duration,
        } as React.CSSProperties
      }
      {...props}
    >
      <div className="relative z-10">{children}</div>
      <div
        className="absolute -inset-2 animate-[glow-pulse_var(--duration)_ease-in-out_infinite] rounded-lg blur-xl"
        style={{ background: `radial-gradient(circle, var(--pulse-color), transparent 70%)` }}
      />
      <div className="absolute inset-0 animate-[light-sweep_3s_ease-in-out_infinite] opacity-50"
        style={{
          background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.4) 50%, transparent 60%)",
          backgroundSize: "200% 100%",
        }}
      />
    </button>
  );
}
