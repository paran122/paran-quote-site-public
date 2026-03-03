"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ParticlesProps {
  className?: string;
  quantity?: number;
  staticity?: number;
  ease?: number;
  color?: string;
  vx?: number;
  vy?: number;
}

interface Circle {
  x: number;
  y: number;
  translateX: number;
  translateY: number;
  size: number;
  alpha: number;
  targetAlpha: number;
  dx: number;
  dy: number;
  magnetism: number;
}

export function Particles({
  className,
  quantity = 50,
  staticity = 50,
  ease = 50,
  color = "#ffffff",
  vx = 0,
  vy = 0,
}: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const context = useRef<CanvasRenderingContext2D | null>(null);
  const circles = useRef<Circle[]>([]);
  const mouse = useRef({ x: 0, y: 0 });
  const canvasSize = useRef({ w: 0, h: 0 });
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (canvasRef.current) {
      context.current = canvasRef.current.getContext("2d");
    }
    initCanvas();
    animate();
    window.addEventListener("resize", initCanvas);
    return () => window.removeEventListener("resize", initCanvas);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, color]);

  useEffect(() => {
    if (!mounted) return;
    const handleMouseMove = (e: MouseEvent) => {
      if (canvasContainerRef.current) {
        const rect = canvasContainerRef.current.getBoundingClientRect();
        const { w, h } = canvasSize.current;
        const x = e.clientX - rect.left - w / 2;
        const y = e.clientY - rect.top - h / 2;
        const inside = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
        if (inside) {
          mouse.current.x = x;
          mouse.current.y = y;
        }
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mounted]);

  const initCanvas = () => {
    if (!canvasContainerRef.current || !canvasRef.current || !context.current) return;
    circles.current = [];
    canvasSize.current.w = canvasContainerRef.current.offsetWidth;
    canvasSize.current.h = canvasContainerRef.current.offsetHeight;
    canvasRef.current.width = canvasSize.current.w * dpr;
    canvasRef.current.height = canvasSize.current.h * dpr;
    canvasRef.current.style.width = `${canvasSize.current.w}px`;
    canvasRef.current.style.height = `${canvasSize.current.h}px`;
    context.current.scale(dpr, dpr);
    for (let i = 0; i < quantity; i++) {
      circles.current.push(circleParams());
    }
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
      : { r: 255, g: 255, b: 255 };
  };

  const circleParams = (): Circle => {
    const { w, h } = canvasSize.current;
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      translateX: 0,
      translateY: 0,
      size: Math.random() * 3 + 0.8,
      alpha: 0,
      targetAlpha: parseFloat((Math.random() * 0.8 + 0.2).toFixed(1)),
      dx: (Math.random() - 0.5) * 0.5,
      dy: (Math.random() - 0.5) * 0.5,
      magnetism: 0.1 + Math.random() * 6,
    };
  };

  const drawCircle = (circle: Circle, update = false) => {
    if (!context.current) return;
    const { x, y, translateX, translateY, size, alpha } = circle;
    const rgb = hexToRgb(color);
    context.current.translate(translateX, translateY);
    context.current.beginPath();
    context.current.arc(x, y, size, 0, 2 * Math.PI);
    context.current.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
    context.current.fill();
    context.current.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!update) {
      circles.current.push(circle);
    }
  };

  const rafId = useRef<number>(0);
  const isVisible = useRef(true);

  // Pause animation when scrolled out of view
  useEffect(() => {
    const el = canvasContainerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible.current = entry.isIntersecting;
        if (entry.isIntersecting) animate();
      },
      { rootMargin: "100px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  const animate = () => {
    if (!context.current || !isVisible.current) return;
    context.current.clearRect(0, 0, canvasSize.current.w, canvasSize.current.h);
    circles.current.forEach((circle, i) => {
      circle.alpha += (circle.targetAlpha - circle.alpha) * 0.05;
      circle.x += circle.dx + vx;
      circle.y += circle.dy + vy;
      circle.translateX += (mouse.current.x / (staticity / circle.magnetism) - circle.translateX) / ease;
      circle.translateY += (mouse.current.y / (staticity / circle.magnetism) - circle.translateY) / ease;

      if (
        circle.x < -10 || circle.x > canvasSize.current.w + 10 ||
        circle.y < -10 || circle.y > canvasSize.current.h + 10
      ) {
        circles.current[i] = circleParams();
        circles.current[i].alpha = 0;
      } else {
        drawCircle(circle, true);
      }
    });
    rafId.current = requestAnimationFrame(animate);
  };

  if (!mounted) return null;

  return (
    <div ref={canvasContainerRef} className={cn("absolute inset-0", className)} aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
