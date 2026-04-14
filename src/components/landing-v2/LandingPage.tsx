"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import HeroParticle from "./HeroParticle";
import About from "./AboutSection";
import Portfolio from "./PortfolioSection";
import Estimate from "./EstimateSection";
import Process from "./ProcessSection";
import Clients from "./ClientsSection";
import BlogSection from "./BlogSection";
import Contact from "./ContactSection";

export default function LandingPage() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const scrollTo = searchParams.get("scrollTo");
    if (!scrollTo) return;

    // 블로그 섹션이 비동기 로드되므로, #blog 요소가 나타날 때까지 대기 후 스크롤
    let cancelled = false;
    const poll = setInterval(() => {
      if (cancelled) return;
      // 블로그 섹션 렌더링 완료 확인 (또는 3초 경과 시 폴백)
      if (document.getElementById("blog")) {
        clearInterval(poll);
        setTimeout(() => {
          if (cancelled) return;
          const el = document.getElementById(scrollTo);
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }, 100);

    // 블로그 데이터 로드 실패 폴백 (3초)
    const fallback = setTimeout(() => {
      clearInterval(poll);
      if (cancelled) return;
      const el = document.getElementById(scrollTo);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 3000);

    return () => {
      cancelled = true;
      clearInterval(poll);
      clearTimeout(fallback);
    };
  }, [searchParams]);

  return (
    <main className="bg-[#f0f2fa] lg:pl-40">
      <HeroParticle />
      <About />
      <Portfolio />
      <Estimate />
      <Process />
      <Clients />
      <BlogSection />
      <Contact />
    </main>
  );
}
