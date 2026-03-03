"use client";

import { useEffect, useRef, useCallback } from "react";
import type { ThemeKey } from "@/lib/themes";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
}

interface ParticleCanvasProps {
  variant: ThemeKey;
  className?: string;
  particleCount?: number;
}

const CONFIGS: Record<ThemeKey, {
  particleColor: string;
  lineColor: string;
  bgStart: string;
  bgEnd: string;
  count: number;
  maxDist: number;
  glowColor: string;
  glowAlpha: number;
}> = {
  navy: {
    particleColor: "99, 150, 255",
    lineColor: "99, 150, 255",
    bgStart: "#0B1120",
    bgEnd: "#111D35",
    count: 140,
    maxDist: 160,
    glowColor: "99, 150, 255",
    glowAlpha: 0.15,
  },
};

export default function ParticleCanvas({ variant, className = "", particleCount }: ParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const particlesRef = useRef<Particle[]>([]);
  const animRef = useRef<number>(0);

  const config = CONFIGS[variant];
  const actualCount = particleCount ?? config.count;

  const initParticles = useCallback((w: number, h: number) => {
    const arr: Particle[] = [];
    for (let i = 0; i < actualCount; i++) {
      arr.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.3,
      });
    }
    particlesRef.current = arr;
  }, [actualCount]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      if (particlesRef.current.length === 0) {
        initParticles(rect.width, rect.height);
      }
    };

    resize();
    window.addEventListener("resize", resize);

    const handleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        mouseRef.current = { x, y };
      } else {
        mouseRef.current = { x: -1000, y: -1000 };
      }
    };
    window.addEventListener("mousemove", handleMouse);

    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, config.bgStart);
      grad.addColorStop(1, config.bgEnd);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      for (const p of particles) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 300 && dist > 0) {
          const force = ((300 - dist) / 300) * 0.06;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        p.vx *= 0.97;
        p.vy *= 0.97;
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        /* 마우스 근처 파티클 강조 */
        const proximity = dist < 250 ? 1 + (250 - dist) / 250 : 1;
        const drawRadius = p.radius * proximity;
        const drawOpacity = Math.min(p.opacity * proximity, 1);

        ctx.beginPath();
        ctx.arc(p.x, p.y, drawRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${config.particleColor}, ${drawOpacity})`;
        ctx.fill();
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < config.maxDist) {
            /* 마우스 근처 연결선은 더 밝게 */
            const midX = (particles[i].x + particles[j].x) / 2;
            const midY = (particles[i].y + particles[j].y) / 2;
            const mouseDist = Math.sqrt((mouse.x - midX) ** 2 + (mouse.y - midY) ** 2);
            const boost = mouseDist < 250 ? 1.5 + (250 - mouseDist) / 250 : 1;
            const alpha = (1 - dist / config.maxDist) * 0.25 * boost;

            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(${config.lineColor}, ${Math.min(alpha, 0.6)})`;
            ctx.lineWidth = mouseDist < 200 ? 1.2 : 0.8;
            ctx.stroke();
          }
        }
      }

      if (mouse.x > 0 && mouse.y > 0) {
        const glow = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 220);
        glow.addColorStop(0, `rgba(${config.glowColor}, ${config.glowAlpha})`);
        glow.addColorStop(0.5, `rgba(${config.glowColor}, ${config.glowAlpha * 0.4})`);
        glow.addColorStop(1, `rgba(${config.glowColor}, 0)`);
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, w, h);
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, [variant, config, initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
    />
  );
}
