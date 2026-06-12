"use client";

import { useEffect } from "react";
import HeroParticle from "./HeroParticle";
import About from "./AboutSection";
import Portfolio from "./PortfolioSection";
import Estimate from "./EstimateSection";
import Process from "./ProcessSection";
import Clients from "./ClientsSection";
import CertSection from "./CertSection";
import BlogSection from "./BlogSection";
import Contact from "./ContactSection";

export default function LandingPage() {
  useEffect(() => {
    // useSearchParams는 페이지 전체를 CSR로 베일아웃시켜 SEO를 해치므로 직접 파싱
    const scrollTo = new URLSearchParams(window.location.search).get("scrollTo");
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
  }, []);

  return (
    <main className="bg-[#f0f2fa] lg:pl-40">
      <HeroParticle />
      <About />
      <Portfolio />
      <Process />
      <Clients />
      <CertSection />
      <Estimate />
      <BlogSection />
      <Contact />
    </main>
  );
}
